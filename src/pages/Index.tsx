
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SwipeableCard from "@/components/SwipeableCard";
import { getCardsByRole } from "@/lib/mockData";
import { ValidationCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<ValidationCard[]>([]);
  const [swipedCards, setSwipedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // For demo, stakeholders see all cards, PMs see their dashboard
      if (user.role === "stakeholder") {
        const availableCards = getCardsByRole("stakeholder", user.email);
        setCards(availableCards);
      }
      setLoading(false);
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect PMs to their dashboard
  if (user?.role === "pm") {
    return <Navigate to="/dashboard" />;
  }

  const handleSwiped = (cardId: string, approved: boolean) => {
    setSwipedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(cardId);
      return newSet;
    });
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const availableCards = cards.filter(card => !swipedCards.has(card.id));
  const currentCard = availableCards[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container p-4 max-w-4xl mx-auto flex flex-col">
        {availableCards.length > 0 ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Validation Cards</h2>
              <div className="text-sm text-muted-foreground">
                {availableCards.length - currentIndex} card{availableCards.length - currentIndex !== 1 ? 's' : ''} remaining
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <SwipeableCard 
                card={currentCard} 
                onSwiped={handleSwiped}
                stakeholderId={user?.email || ''}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">All caught up!</h2>
            <p className="text-muted-foreground mb-6">
              You've reviewed all available validation cards.
              Check back later for new cards from your product team.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSwipedCards(new Set());
                setCurrentIndex(0);
                toast.success("Cards reset! You can review them again.");
              }}
            >
              Reset Cards (Demo Only)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
