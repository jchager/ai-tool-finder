
import { AIToolsDatabase, ScreeningAnswers, RecommendationResult, AudienceType } from './types';

// Cache for the database
let databaseCache: AIToolsDatabase | null = null;

// Function to load database data
async function loadDatabase(): Promise<AIToolsDatabase> {
  if (databaseCache) {
    return databaseCache;
  }

  try {
    const response = await fetch('/api/database');
    if (!response.ok) {
      throw new Error('Failed to fetch database');
    }
    databaseCache = await response.json();
    return databaseCache!;
  } catch (error) {
    console.error('Error loading AI tools database:', error);
    // Fallback empty database
    const fallback: AIToolsDatabase = {
      ai_tools: [],
      tool_audience_matching: []
    };
    return fallback;
  }
}

// For server-side or build-time access
function loadDatabaseSync(): AIToolsDatabase {
  try {
    if (typeof window === 'undefined') {
      // Server-side: use require
      const aiToolsData = require('../data/ai_tools_database.json');
      return aiToolsData as AIToolsDatabase;
    } else {
      // Client-side: return empty database for now
      return {
        ai_tools: [],
        tool_audience_matching: []
      };
    }
  } catch (error) {
    console.error('Error loading AI tools database:', error);
    return {
      ai_tools: [],
      tool_audience_matching: []
    };
  }
}

const database = loadDatabaseSync();

// Function that takes database as parameter for client-side use
export function generateRecommendations(database: AIToolsDatabase, answers: ScreeningAnswers): RecommendationResult[] {
  const { audience, specificNeeds, budgetRange, technicalExpertise, primaryUseCases } = answers;
  
  // Safety check for database
  if (!database?.tool_audience_matching?.length || !database?.ai_tools?.length) {
    console.warn('Database not loaded or empty');
    return [];
  }
  
  // Get matching entries for the selected audience
  const relevantMatches = database.tool_audience_matching.filter(
    match => match.audience_id === audience
  );
  
  // Create recommendations with scoring
  const recommendations: RecommendationResult[] = relevantMatches.map(match => {
    const tool = database.ai_tools.find(tool => tool.id === match.tool_id);
    if (!tool) return null;
    
    let adjustedScore = match.relevance_score;
    const reasonsForRecommendation: string[] = [];
    
    // Adjust score based on budget considerations
    const hasFreeOption = Object.keys(tool.pricing).some(key => 
      key.toLowerCase().includes('free') || tool.pricing[key].toLowerCase().includes('free')
    );
    
    if (budgetRange === 'free' && hasFreeOption) {
      adjustedScore += 1;
      reasonsForRecommendation.push('Offers free tier or free option');
    } else if (budgetRange === 'low' && (hasFreeOption || Object.values(tool.pricing).some(price => 
      price.includes('$') && parseInt(price.replace(/[^0-9]/g, '')) < 50
    ))) {
      adjustedScore += 0.5;
      reasonsForRecommendation.push('Budget-friendly pricing');
    }
    
    // Adjust score based on technical expertise
    if (technicalExpertise === 'beginner' && tool.learning_curve.toLowerCase().includes('easy')) {
      adjustedScore += 1;
      reasonsForRecommendation.push('Easy to learn and use');
    } else if (technicalExpertise === 'advanced' && tool.learning_curve.toLowerCase().includes('hard')) {
      adjustedScore += 0.5;
      reasonsForRecommendation.push('Advanced features for expert users');
    }
    
    // Match use cases
    const matchingUseCases = tool.use_cases.filter(useCase =>
      primaryUseCases.some(primaryUse => 
        useCase.toLowerCase().includes(primaryUse.toLowerCase()) ||
        primaryUse.toLowerCase().includes(useCase.toLowerCase())
      )
    );
    
    if (matchingUseCases.length > 0) {
      adjustedScore += matchingUseCases.length * 0.3;
      reasonsForRecommendation.push(`Matches your use cases: ${matchingUseCases.join(', ')}`);
    }
    
    // Match specific needs
    const matchingFeatures = tool.key_features.filter(feature =>
      specificNeeds.some(need => 
        feature.toLowerCase().includes(need.toLowerCase()) ||
        need.toLowerCase().includes(feature.toLowerCase())
      )
    );
    
    if (matchingFeatures.length > 0) {
      adjustedScore += matchingFeatures.length * 0.2;
      reasonsForRecommendation.push(`Key features align with your needs`);
    }
    
    // Add specific benefits from matching matrix
    reasonsForRecommendation.push(...match.specific_benefits);
    
    return {
      tool,
      relevanceScore: Math.min(adjustedScore, 10), // Cap at 10
      matchingEntry: match,
      reasonsForRecommendation
    };
  }).filter(Boolean) as RecommendationResult[];
  
  // Sort by relevance score (highest first)
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export function getRecommendations(answers: ScreeningAnswers): RecommendationResult[] {
  const { audience, specificNeeds, budgetRange, technicalExpertise, primaryUseCases } = answers;
  
  // Safety check for database
  if (!database?.tool_audience_matching?.length || !database?.ai_tools?.length) {
    console.warn('Database not loaded or empty');
    return [];
  }
  
  // Get matching entries for the selected audience
  const relevantMatches = database.tool_audience_matching.filter(
    match => match.audience_id === audience
  );
  
  // Create recommendations with scoring
  const recommendations: RecommendationResult[] = relevantMatches.map(match => {
    const tool = database.ai_tools.find(tool => tool.id === match.tool_id);
    if (!tool) return null;
    
    let adjustedScore = match.relevance_score;
    const reasonsForRecommendation: string[] = [];
    
    // Adjust score based on budget considerations
    const hasFreeOption = Object.keys(tool.pricing).some(key => 
      key.toLowerCase().includes('free') || tool.pricing[key].toLowerCase().includes('free')
    );
    
    if (budgetRange === 'free' && hasFreeOption) {
      adjustedScore += 1;
      reasonsForRecommendation.push('Offers free tier or free option');
    } else if (budgetRange === 'low' && (hasFreeOption || Object.values(tool.pricing).some(price => 
      price.includes('$') && parseInt(price.replace(/[^0-9]/g, '')) < 50
    ))) {
      adjustedScore += 0.5;
      reasonsForRecommendation.push('Budget-friendly pricing');
    }
    
    // Adjust score based on technical expertise
    if (technicalExpertise === 'beginner' && tool.learning_curve.toLowerCase().includes('easy')) {
      adjustedScore += 1;
      reasonsForRecommendation.push('Easy to learn and use');
    } else if (technicalExpertise === 'advanced' && tool.learning_curve.toLowerCase().includes('hard')) {
      adjustedScore += 0.5;
      reasonsForRecommendation.push('Advanced features for expert users');
    }
    
    // Match use cases
    const matchingUseCases = tool.use_cases.filter(useCase =>
      primaryUseCases.some(primaryUse => 
        useCase.toLowerCase().includes(primaryUse.toLowerCase()) ||
        primaryUse.toLowerCase().includes(useCase.toLowerCase())
      )
    );
    
    if (matchingUseCases.length > 0) {
      adjustedScore += matchingUseCases.length * 0.3;
      reasonsForRecommendation.push(`Matches your use cases: ${matchingUseCases.join(', ')}`);
    }
    
    // Match specific needs
    const matchingFeatures = tool.key_features.filter(feature =>
      specificNeeds.some(need => 
        feature.toLowerCase().includes(need.toLowerCase()) ||
        need.toLowerCase().includes(feature.toLowerCase())
      )
    );
    
    if (matchingFeatures.length > 0) {
      adjustedScore += matchingFeatures.length * 0.2;
      reasonsForRecommendation.push(`Key features align with your needs`);
    }
    
    // Add specific benefits from matching matrix
    reasonsForRecommendation.push(...match.specific_benefits);
    
    return {
      tool,
      relevanceScore: Math.min(adjustedScore, 10), // Cap at 10
      matchingEntry: match,
      reasonsForRecommendation
    };
  }).filter(Boolean) as RecommendationResult[];
  
  // Sort by relevance score (highest first)
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export function getToolsByCategory(): Record<string, number> {
  const categoryCounts: Record<string, number> = {};
  if (database?.ai_tools?.length) {
    database.ai_tools.forEach(tool => {
      if (tool?.category) {
        categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
      }
    });
  }
  return categoryCounts;
}

export function getAudienceStats(): Record<string, number> {
  const audienceStats: Record<string, number> = {};
  if (database?.tool_audience_matching?.length) {
    database.tool_audience_matching.forEach(match => {
      if (match?.audience_id) {
        audienceStats[match.audience_id] = (audienceStats[match.audience_id] || 0) + 1;
      }
    });
  }
  return audienceStats;
}
