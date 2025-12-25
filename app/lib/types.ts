
export interface AITool {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  pricing: Record<string, string>;
  key_features: string[];
  target_audiences: string[];
  use_cases: string[];
  pros: string[];
  cons: string[];
  website_url: string | null;
  integration_capabilities: string[];
  ease_of_use: string;
  learning_curve: string;
}

export interface MatchingEntry {
  tool_id: string;
  audience_id: string;
  relevance_score: number;
  specific_benefits: string[];
  implementation_difficulty: string;
  roi_potential: string;
}

export interface AIToolsDatabase {
  ai_tools: AITool[];
  tool_audience_matching: MatchingEntry[];
}

export interface ScreeningAnswers {
  audience: string;
  specificNeeds: string[];
  budgetRange: string;
  technicalExpertise: string;
  timeConstraints: string;
  primaryUseCases: string[];
  industryContext: string;
}

export interface RecommendationResult {
  tool: AITool;
  relevanceScore: number;
  matchingEntry: MatchingEntry;
  reasonsForRecommendation: string[];
}

export type AudienceType = 'sme' | 'upskiller' | 'busy_individual' | 'healthcare_professional';

export const AUDIENCE_LABELS: Record<AudienceType, string> = {
  sme: 'Small & Medium Enterprises',
  upskiller: 'Learning & Upskilling Professionals',
  busy_individual: 'Busy Individuals & Entrepreneurs',
  healthcare_professional: 'Healthcare Professionals'
};

export const AUDIENCE_DESCRIPTIONS: Record<AudienceType, string> = {
  sme: 'Business owners and teams looking to streamline operations, reduce costs, and enhance productivity through AI automation.',
  upskiller: 'Professionals seeking to develop new skills, learn emerging technologies, and advance their careers with AI-powered learning tools.',
  busy_individual: 'Entrepreneurs, freelancers, and professionals who need efficient AI tools to manage time, automate tasks, and boost personal productivity.',
  healthcare_professional: 'Medical professionals, researchers, and healthcare organizations looking for AI solutions to improve patient care and operational efficiency.'
};
