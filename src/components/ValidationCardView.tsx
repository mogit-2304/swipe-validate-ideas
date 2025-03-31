
import React from "react";
import { ValidationCard, CardCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Clock, Users, Info } from "lucide-react";

interface ValidationCardViewProps {
  card: ValidationCard;
  showActions?: boolean;
}

// Format date to a readable string
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get color for card category
const getCategoryColor = (category: CardCategory): string => {
  switch (category) {
    case CardCategory.PROBLEM:
      return "bg-amber-100 text-amber-800 border-amber-200";
    case CardCategory.SOLUTION:
      return "bg-green-100 text-green-800 border-green-200";
    case CardCategory.DESIGN:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case CardCategory.TECH_STACK:
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ValidationCardView: React.FC<ValidationCardViewProps> = ({ card, showActions = false }) => {
  return (
    <Card className="w-full card-shadow hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${getCategoryColor(card.category)} capitalize`}>
            {card.category.replace('_', ' ')}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(card.createdAt)}</span>
          </div>
        </div>
        <CardTitle className="text-xl">{card.title}</CardTitle>
        <CardDescription className="mt-2">{card.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {card.imageUrls.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mb-4">
            {card.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${card.title} reference ${index + 1}`}
                className="w-full h-40 object-cover rounded-md"
              />
            ))}
          </div>
        )}
        {card.contextParameters && card.contextParameters.length > 0 && (
          <div className="mt-4 bg-secondary p-3 rounded-md">
            <div className="flex items-center mb-2 text-sm font-medium">
              <Info className="h-4 w-4 mr-1 text-primary" />
              Context Parameters
            </div>
            <ul className="text-sm space-y-1 list-disc pl-5">
              {card.contextParameters.map((param, index) => (
                <li key={index}>{param}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-xs text-gray-600">
          <Users className="h-3 w-3 mr-1" />
          <span>
            Audience: {card.audience.map(a => a.replace('-', ' ')).join(', ')}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ValidationCardView;
