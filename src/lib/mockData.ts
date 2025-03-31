
import { ValidationCard, CardCategory, Feedback, CardMetrics } from "./types";

// Mock validation cards
export const mockValidationCards: ValidationCard[] = [
  {
    id: "card-1",
    title: "Mobile App Navigation Redesign",
    description: "We're considering a bottom navigation bar instead of the current hamburger menu to improve discoverability. Does this solve the navigation issues you've experienced?",
    imageUrls: ["/placeholder.svg", "/placeholder.svg"],
    category: CardCategory.DESIGN,
    createdBy: "jane@example.com",
    createdAt: new Date("2023-05-15"),
    audience: ["design-team", "user-research"],
    contextParameters: ["Current user engagement with menu items is low", "User testing shows confusion with current navigation"]
  },
  {
    id: "card-2",
    title: "User Onboarding Friction Problem",
    description: "Users are dropping off during the account creation process. We believe it's because we're asking for too much information upfront. Is this a significant problem to solve?",
    imageUrls: ["/placeholder.svg"],
    category: CardCategory.PROBLEM,
    createdBy: "john@example.com",
    createdAt: new Date("2023-05-14"),
    audience: ["product-team", "marketing"],
    contextParameters: ["40% drop-off rate during onboarding", "Competitor analysis shows simpler flows"]
  },
  {
    id: "card-3",
    title: "GraphQL vs REST API Approach",
    description: "For our new feature that requires complex, nested data, should we implement GraphQL or stick with our current REST architecture?",
    imageUrls: [],
    category: CardCategory.TECH_STACK,
    createdBy: "jane@example.com",
    createdAt: new Date("2023-05-13"),
    audience: ["engineering", "architecture"],
    contextParameters: ["Increasing frontend complexity", "Team has limited GraphQL experience"]
  },
  {
    id: "card-4",
    title: "AI-powered Content Recommendations",
    description: "Would implementing AI-based content recommendations solve the problem of users not discovering relevant content in the platform?",
    imageUrls: ["/placeholder.svg"],
    category: CardCategory.SOLUTION,
    createdBy: "john@example.com",
    createdAt: new Date("2023-05-12"),
    audience: ["product-team", "data-science"],
    contextParameters: ["Current manual recommendations perform poorly", "We have sufficient data to train models"]
  }
];

// Mock feedback responses
export const mockFeedback: Feedback[] = [
  {
    id: "feedback-1",
    cardId: "card-1",
    stakeholderId: "user1@example.com",
    approved: true,
    createdAt: new Date("2023-05-16")
  },
  {
    id: "feedback-2",
    cardId: "card-1",
    stakeholderId: "user2@example.com",
    approved: false,
    comment: "I think we need more user testing before making this change.",
    createdAt: new Date("2023-05-16")
  },
  {
    id: "feedback-3",
    cardId: "card-2",
    stakeholderId: "user1@example.com",
    approved: true,
    createdAt: new Date("2023-05-15")
  },
  {
    id: "feedback-4",
    cardId: "card-3",
    stakeholderId: "user3@example.com",
    approved: false,
    comment: "GraphQL has a steeper learning curve. Let's stick with REST for now.",
    createdAt: new Date("2023-05-14")
  },
  {
    id: "feedback-5",
    cardId: "card-4",
    stakeholderId: "user2@example.com",
    approved: true,
    createdAt: new Date("2023-05-13")
  }
];

// Get cards for a specific user role
export const getCardsByRole = (role: "pm" | "stakeholder", email: string): ValidationCard[] => {
  if (role === "pm") {
    // PMs see cards they created
    return mockValidationCards.filter(card => card.createdBy === email);
  } else {
    // Stakeholders see all cards (in a real app, would filter by audience)
    return mockValidationCards;
  }
};

// Get feedback for a specific card
export const getFeedbackByCardId = (cardId: string): Feedback[] => {
  return mockFeedback.filter(feedback => feedback.cardId === cardId);
};

// Calculate metrics for a card
export const getCardMetrics = (cardId: string): CardMetrics => {
  const cardFeedback = getFeedbackByCardId(cardId);
  const approvals = cardFeedback.filter(f => f.approved);
  const rejections = cardFeedback.filter(f => !f.approved);
  
  return {
    approvalCount: approvals.length,
    rejectionCount: rejections.length,
    approvalRate: cardFeedback.length > 0 ? approvals.length / cardFeedback.length : 0,
    feedbackComments: cardFeedback
      .filter(f => f.comment)
      .map(f => f.comment!)
  };
};

export const addFeedback = (feedback: Omit<Feedback, "id" | "createdAt">): void => {
  const newFeedback: Feedback = {
    ...feedback,
    id: `feedback-${mockFeedback.length + 1}`,
    createdAt: new Date()
  };
  
  mockFeedback.push(newFeedback);
};

export const addCard = (card: Omit<ValidationCard, "id" | "createdAt">): ValidationCard => {
  const newCard: ValidationCard = {
    ...card,
    id: `card-${mockValidationCards.length + 1}`,
    createdAt: new Date()
  };
  
  mockValidationCards.push(newCard);
  return newCard;
};
