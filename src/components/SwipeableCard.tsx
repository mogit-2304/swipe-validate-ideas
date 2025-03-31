
import React, { useState, useRef } from "react";
import { ValidationCard } from "@/lib/types";
import ValidationCardView from "./ValidationCardView";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, X, Check } from "lucide-react";
import { toast } from "sonner";
import { addFeedback } from "@/lib/mockData";

interface SwipeableCardProps {
  card: ValidationCard;
  onSwiped: (cardId: string, approved: boolean) => void;
  stakeholderId: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ card, onSwiped, stakeholderId }) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const diff = e.clientX - startX;
    setOffsetX(diff);
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    handleSwipeEnd();
  };

  const handleMouseUp = () => {
    handleSwipeEnd();
  };

  const handleSwipeEnd = () => {
    if (offsetX > 100) {
      // Swiped right - approve
      setSwipeDirection("right");
      submitFeedback(true);
    } else if (offsetX < -100) {
      // Swiped left - reject
      setSwipeDirection("left");
      setShowFeedbackDialog(true);
    } else {
      // Reset if not swiped enough
      setOffsetX(0);
    }
    setStartX(null);
  };

  const submitFeedback = (approved: boolean, comment?: string) => {
    addFeedback({
      cardId: card.id,
      stakeholderId: stakeholderId,
      approved,
      comment
    });

    toast.success(`Feedback submitted: ${approved ? "Approved" : "Rejected"}`);
    setTimeout(() => {
      onSwiped(card.id, approved);
      setSwipeDirection(null);
      setOffsetX(0);
      setFeedbackComment("");
    }, 500);
  };

  const handleDialogSubmit = () => {
    submitFeedback(false, feedbackComment);
    setShowFeedbackDialog(false);
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    if (direction === "right") {
      submitFeedback(true);
    } else {
      setShowFeedbackDialog(true);
    }
  };

  // Calculate rotation based on swipe offset
  const rotation = offsetX * 0.1;
  
  return (
    <>
      <div className="card-container relative w-full max-w-md mx-auto">
        <div
          ref={cardRef}
          className={`relative w-full touch-none cursor-grab active:cursor-grabbing select-none ${swipeDirection === "right" ? "animate-swipe-right" : swipeDirection === "left" ? "animate-swipe-left" : ""}`}
          style={{
            transform: swipeDirection ? "" : `translateX(${offsetX}px) rotate(${rotation}deg)`,
            transition: startX !== null ? "" : "transform 0.3s ease",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <ValidationCardView card={card} />

          {/* Swipe indicators */}
          <div 
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-destructive/80 text-white p-2 rounded-full transition-opacity"
            style={{ opacity: offsetX < -50 ? 1 : 0 }}
          >
            <ThumbsDown className="h-6 w-6" />
          </div>
          <div 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary/80 text-white p-2 rounded-full transition-opacity"
            style={{ opacity: offsetX > 50 ? 1 : 0 }}
          >
            <ThumbsUp className="h-6 w-6" />
          </div>
        </div>
        
        {/* Button controls for swiping */}
        <div className="flex justify-center mt-6 space-x-6">
          <Button
            variant="outline"
            size="lg"
            className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30"
            onClick={() => handleButtonSwipe("left")}
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
            onClick={() => handleButtonSwipe("right")}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Why did you reject this idea?</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Please provide some feedback or suggestions for improvement..."
            className="mt-2"
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                setShowFeedbackDialog(false);
                setSwipeDirection(null);
                setOffsetX(0);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={handleDialogSubmit}
            >
              <Check className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SwipeableCard;
