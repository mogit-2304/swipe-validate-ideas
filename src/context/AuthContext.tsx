
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

type UserRole = "pm" | "stakeholder" | null;

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole) => {
    // This is just a mock authentication for demo purposes
    // In a real app, this would involve real authentication with a backend
    if (email && password) {
      const name = email.split("@")[0];
      setUser({ name, email, role });
      toast.success(`Welcome back, ${name}!`);
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
