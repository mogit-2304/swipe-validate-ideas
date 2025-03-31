
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Only PMs can see the dashboard
  if (user?.role !== "pm") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container p-4 py-8">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
