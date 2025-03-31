
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateCardForm from "@/components/CreateCardForm";

const CreatePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Only PMs can create cards
  if (user?.role !== "pm") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container p-4 py-8 max-w-4xl mx-auto">
        <CreateCardForm />
      </div>
    </div>
  );
};

export default CreatePage;
