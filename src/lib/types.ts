
export interface ValidationCard {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  category: CardCategory;
  createdBy: string;
  createdAt: Date;
  audience: string[];
  contextParameters?: string[];
}

export enum CardCategory {
  PROBLEM = "problem",
  SOLUTION = "solution",
  DESIGN = "design",
  TECH_STACK = "tech_stack"
}

export interface Feedback {
  id: string;
  cardId: string;
  stakeholderId: string;
  approved: boolean;
  comment?: string;
  createdAt: Date;
}

export interface CardMetrics {
  approvalCount: number;
  rejectionCount: number;
  approvalRate: number;
  feedbackComments: string[];
}
