
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ExternalLink, 
  Star, 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ScreeningAnswers, RecommendationResult } from '@/lib/types';
import { generateRecommendations } from '@/lib/recommendation-engine';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<RecommendationResult[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'category'>('relevance');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      const answersParam = searchParams?.get('answers');
      if (answersParam) {
        try {
          const answers: ScreeningAnswers = JSON.parse(answersParam);
          
          // Fetch database and generate recommendations
          const response = await fetch('/api/database');
          if (response.ok) {
            const database = await response.json();
            const recs = generateRecommendations(database, answers);
            setRecommendations(recs);
            setFilteredRecommendations(recs);
          } else {
            console.error('Failed to load database');
            setRecommendations([]);
            setFilteredRecommendations([]);
          }
        } catch (error) {
          console.error('Error processing recommendations:', error);
          setRecommendations([]);
          setFilteredRecommendations([]);
        }
      }
      setLoading(false);
    };
    
    loadRecommendations();
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...recommendations];
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(rec => rec.tool.category === filterCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'name':
          return a.tool.name.localeCompare(b.tool.name);
        case 'category':
          return a.tool.category.localeCompare(b.tool.category);
        default:
          return 0;
      }
    });
    
    setFilteredRecommendations(filtered);
  }, [recommendations, sortBy, filterCategory]);

  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedCards(newExpanded);
  };

  const getUniqueCategories = () => {
    const categories = new Set(recommendations.map(rec => rec.tool.category));
    return Array.from(categories).sort();
  };

  const getPricingBadge = (pricing: Record<string, string>) => {
    const hasFree = Object.keys(pricing).some(key => 
      key.toLowerCase().includes('free') || pricing[key].toLowerCase().includes('free')
    );
    
    if (hasFree) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Free Available</Badge>;
    }
    
    const prices = Object.values(pricing).join(' ').match(/\$(\d+)/g);
    if (prices && prices.length > 0) {
      const minPrice = Math.min(...prices.map(p => parseInt(p.replace('$', ''))));
      if (minPrice < 20) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Budget-Friendly</Badge>;
      if (minPrice < 100) return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Mid-Range</Badge>;
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Premium</Badge>;
    }
    
    return <Badge variant="outline">Contact for Pricing</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-blue-600 bg-blue-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your responses and generating recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Personalized AI Tool Recommendations
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Based on your responses, we've found {filteredRecommendations.length} tools that match your needs
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/screening">
              <Button variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Screening
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: 'relevance' | 'name' | 'category') => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {filteredRecommendations.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <p className="text-gray-600 mb-4">No tools match your current filters.</p>
            <Button onClick={() => setFilterCategory('all')}>
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-6"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {filteredRecommendations.map((recommendation, index) => {
              const { tool, relevanceScore, reasonsForRecommendation } = recommendation;
              const isExpanded = expandedCards.has(tool.id);
              
              return (
                <motion.div key={tool.id} variants={fadeInUp}>
                  <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-bold">{tool.name}</CardTitle>
                            <div className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(relevanceScore)}`}>
                              {relevanceScore.toFixed(1)}/10
                            </div>
                            {index < 3 && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Top Pick
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{tool.category}</Badge>
                            <Badge variant="outline">{tool.subcategory}</Badge>
                            {getPricingBadge(tool.pricing)}
                          </div>
                          
                          <p className="text-gray-600 mb-4">{tool.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Key Features */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {tool.key_features.slice(0, isExpanded ? undefined : 3).map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {!isExpanded && tool.key_features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tool.key_features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Why Recommended */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Why we recommend this:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {reasonsForRecommendation.slice(0, isExpanded ? undefined : 2).map((reason, idx) => (
                            <li key={idx} className="flex items-start">
                              <Star className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                          {!isExpanded && reasonsForRecommendation.length > 2 && (
                            <li className="text-blue-600 text-xs">
                              +{reasonsForRecommendation.length - 2} more reasons
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {/* Expanded Content */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 border-t pt-4"
                        >
                          {/* Pricing Details */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Pricing:</h4>
                            <div className="space-y-2">
                              {Object.entries(tool.pricing).map(([tier, price]) => (
                                <div key={tier} className="flex justify-between items-start bg-gray-50 p-2 rounded">
                                  <span className="font-medium capitalize text-sm">{tier.replace('_', ' ')}:</span>
                                  <span className="text-sm text-gray-600 text-right flex-1 ml-2">{price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Pros and Cons */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-700 mb-2">Pros:</h4>
                              <ul className="text-sm space-y-1">
                                {tool.pros.map((pro, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-red-700 mb-2">Cons:</h4>
                              <ul className="text-sm space-y-1">
                                {tool.cons.map((con, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {/* Use Cases */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Use Cases:</h4>
                            <div className="flex flex-wrap gap-2">
                              {tool.use_cases.map((useCase, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {useCase}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Implementation Details */}
                          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">Ease of Use:</h5>
                              <p className="text-sm text-gray-600">{tool.ease_of_use}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">Learning Curve:</h5>
                              <p className="text-sm text-gray-600">{tool.learning_curve}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                        {tool.website_url && (
                          <Button asChild>
                            <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit Website
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          onClick={() => toggleExpanded(tool.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Show More
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
