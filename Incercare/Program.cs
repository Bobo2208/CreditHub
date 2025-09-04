using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Incercare;  // Ajustează după spațiul tău de nume

namespace Incercare
{
    // MODELS PENTRU GEMINI
    public record ChatMessage(string Role, string Text);
    public record ChatRequest(List<ChatMessage> Messages);
    public record ChatResponse(string Text);

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var config  = builder.Configuration;

            // === CORS ===
            builder.Services.AddCors(o =>
            {
                o.AddPolicy("AllowFrontend", p =>
                    p.WithOrigins("http://localhost:3000")
                     .AllowAnyHeader()
                     .AllowAnyMethod()
                );
            });

            // === DB CONTEXT ===
            builder.Services.AddDbContext<LicentaContext>(opts =>
                opts.UseNpgsql(config.GetConnectionString("DefaultConnection"))
            );

            // === JWT AUTH ===
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken            = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer              = config["Jwt:Issuer"],
                    ValidAudience            = config["Jwt:Audience"],
                    IssuerSigningKey         = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            config["Jwt:Key"]
                            ?? throw new InvalidOperationException("JWT key not found")
                        )
                    )
                };
            });

            builder.Services.AddScoped<JwtService>();
            builder.Services.AddAuthorization();
            builder.Services.AddControllers();

            // === HTTP CLIENT pentru Gemini ===
            var geminiKey = config["Gemini:ApiKey"]
                ?? throw new InvalidOperationException("Gemini API key not configured");
            builder.Services.AddHttpClient("gemini", client =>
            {
                client.BaseAddress = new Uri("https://generativelanguage.googleapis.com/");
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json")
                );
            });

            var app = builder.Build();

            // === MIDDLEWARE ===
            app.UseCors("AllowFrontend");

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "uploads")
                ),
                RequestPath = "/uploads"
            });

            app.UseAuthentication();
            app.UseAuthorization();

            // === Endpoint Gemini ===
            app.MapPost("/api/gemini-chat", async (ChatRequest req, IHttpClientFactory httpFactory) =>
            {
                try
                {
                    // Construiește mesajul pentru Gemini
                    var conversationText = string.Join("\n", req.Messages.Select(m => 
                        m.Role == "user" ? $"User: {m.Text}" : 
                        m.Role == "assistant" ? $"Assistant: {m.Text}" : 
                        m.Role == "system" ? $"System: {m.Text}" : 
                        $"{m.Role}: {m.Text}"
                    ));

                    var payload = new
                    {
                        contents = new[]
                        {
                            new
                            {
                                parts = new[]
                                {
                                    new { text = conversationText }
                                }
                            }
                        }
                    };

                    var json = JsonSerializer.Serialize(payload);
                    using var content = new StringContent(json, Encoding.UTF8, "application/json");
                    var client = httpFactory.CreateClient("gemini");

                    var response = await client.PostAsync($"v1/models/gemini-1.5-flash:generateContent?key={geminiKey}", content);

                    if (!response.IsSuccessStatusCode)
                    {
                        var err = await response.Content.ReadAsStringAsync();
                        Console.Error.WriteLine($"[Gemini] HTTP {response.StatusCode}: {err}");
                        return Results.Problem(detail: err, statusCode: StatusCodes.Status502BadGateway);
                    }

                    using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
                    
                    // Verifică dacă există candidates
                    if (!doc.RootElement.TryGetProperty("candidates", out var candidates) || 
                        candidates.GetArrayLength() == 0)
                    {
                        Console.Error.WriteLine("[Gemini] No candidates in response");
                        return Results.Problem("No response from Gemini", statusCode: StatusCodes.Status500InternalServerError);
                    }

                    var firstCandidate = candidates[0];
                    if (!firstCandidate.TryGetProperty("content", out var content_prop) ||
                        !content_prop.TryGetProperty("parts", out var parts) ||
                        parts.GetArrayLength() == 0)
                    {
                        Console.Error.WriteLine("[Gemini] Invalid response structure");
                        return Results.Problem("Invalid response structure", statusCode: StatusCodes.Status500InternalServerError);
                    }

                    var reply = parts[0].GetProperty("text").GetString() ?? "";

                    return Results.Json(new ChatResponse(reply.Trim()));
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"[Gemini] Exception: {ex.Message}");
                    return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
                }
            })
            .RequireCors("AllowFrontend");

            // === MVC Controllers ===
            app.MapControllers();

            app.Run();
        }
    }
}