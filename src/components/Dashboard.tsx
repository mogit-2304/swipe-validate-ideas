
import React, { useState } from "react";
import { ValidationCard, CardCategory } from "@/lib/types";
import { getCardsByRole, getCardMetrics } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ValidationCardView from "./ValidationCardView";
import { BarChart3, FilterX, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CardCategory | "all">("all");
  
  if (!user) return null;
  
  const cards = getCardsByRole("pm", user.email);

  const filteredCards = category === "all" 
    ? cards 
    : cards.filter(card => card.category === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Validation Dashboard</h1>
        <div className="flex space-x-4">
          <Tabs defaultValue="all" onValueChange={(value) => setCategory(value as CardCategory | "all")}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value={CardCategory.PROBLEM}>Problems</TabsTrigger>
              <TabsTrigger value={CardCategory.SOLUTION}>Solutions</TabsTrigger>
              <TabsTrigger value={CardCategory.DESIGN}>Designs</TabsTrigger>
              <TabsTrigger value={CardCategory.TECH_STACK}>Tech Stack</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => navigate("/create")}>Create New</Button>
        </div>
      </div>
      
      {filteredCards.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <FilterX className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium">No cards found</p>
            <p className="text-gray-500 mt-1">
              {cards.length === 0
                ? "You haven't created any validation cards yet"
                : "No cards match the selected filter"}
            </p>
            <Button onClick={() => navigate("/create")} className="mt-4">
              Create Your First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCards.map((card) => (
            <CardWithMetrics key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};

const CardWithMetrics = ({ card }: { card: ValidationCard }) => {
  const metrics = getCardMetrics(card.id);
  const totalResponses = metrics.approvalCount + metrics.rejectionCount;
  
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-2 border-r">
          <ValidationCardView card={card} />
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <BarChart3 className="mr-1 h-4 w-4" />
            Feedback Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Approval Rate</span>
                <span>{Math.round(metrics.approvalRate * 100)}%</span>
              </div>
              <Progress value={metrics.approvalRate * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-lg font-medium text-green-700">{metrics.approvalCount}</div>
                <div className="text-xs text-green-600">Approvals</div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <div className="text-lg font-medium text-red-700">{metrics.rejectionCount}</div>
                <div className="text-xs text-red-600">Rejections</div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2 text-sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>Feedback Comments ({metrics.feedbackComments.length})</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {metrics.feedbackComments.length > 0 ? (
                  metrics.feedbackComments.map((comment, index) => (
                    <div key={index} className="text-xs bg-secondary p-2 rounded">
                      "{comment}"
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 italic">No comments yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;
