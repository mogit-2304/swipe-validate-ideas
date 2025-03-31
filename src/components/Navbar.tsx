
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle, BarChart } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-primary">SwipeValidate</Link>
      
      <div className="flex items-center space-x-6">
        {user.role === "pm" && (
          <>
            <Link to="/create" className="flex items-center text-gray-700 hover:text-primary transition-colors">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Card
            </Link>
            <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-primary transition-colors">
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </>
        )}
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">
            {user.name} ({user.role})
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
