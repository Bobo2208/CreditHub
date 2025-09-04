import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    const storedToken =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, remember = false) => {
    if (!userData.token) {
      console.error("Token lipsă în userData!");
      return;
    }

    const storage = remember ? localStorage : sessionStorage;

    const userPayload = {
      id: userData.id,
      nume: userData.nume,
      prenume: userData.prenume,
      role: userData.role,
    };

    if (userData.venit_lunar !== undefined) {
      userPayload.venit = userData.venit_lunar;
    }

    storage.setItem("token", userData.token);
    storage.setItem("user", JSON.stringify(userPayload));

    setUser(userPayload);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
