
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Building,
  GraduationCap,
  Zap,
  Heart,
  DollarSign,
  Clock,
  Wrench,
  Target,
  Briefcase
} from 'lucide-react';
import { AudienceType, AUDIENCE_LABELS, ScreeningAnswers } from '@/lib/types';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 'audience', title: 'Your Role', icon: Target },
  { id: 'needs', title: 'Specific Needs', icon: CheckCircle },
  { id: 'budget', title: 'Budget', icon: DollarSign },
  { id: 'expertise', title: 'Technical Level', icon: Wrench },
  { id: 'time', title: 'Time Constraints', icon: Clock },
  { id: 'usecases', title: 'Primary Use Cases', icon: Briefcase },
  { id: 'industry', title: 'Industry Context', icon: Building }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function ScreeningPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ScreeningAnswers>>({
    specificNeeds: [],
    primaryUseCases: []
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to results page with answers
      const queryParams = new URLSearchParams({
        answers: JSON.stringify(answers)
      });
      router.push(`/results?${queryParams.toString()}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (key: keyof ScreeningAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (key: keyof ScreeningAnswers, value: string) => {
    const currentValues = (answers[key] as string[]) || [];
    if (currentValues.includes(value)) {
      handleAnswer(key, currentValues.filter(v => v !== value));
    } else {
      handleAnswer(key, [...currentValues, value]);
    }
  };

  const isStepComplete = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'audience':
        return !!answers.audience;
      case 'needs':
        return (answers.specificNeeds?.length || 0) > 0;
      case 'budget':
        return !!answers.budgetRange;
      case 'expertise':
        return !!answers.technicalExpertise;
      case 'time':
        return !!answers.timeConstraints;
      case 'usecases':
        return (answers.primaryUseCases?.length || 0) > 0;
      case 'industry':
        return !!answers.industryContext;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'audience':
        const audienceOptions = [
          { id: 'sme', label: 'Small & Medium Enterprises', icon: Building, description: 'Business owners and teams' },
          { id: 'upskiller', label: 'Learning & Upskilling', icon: GraduationCap, description: 'Professionals developing skills' },
          { id: 'busy_individual', label: 'Busy Individuals', icon: Zap, description: 'Entrepreneurs and freelancers' },
          { id: 'healthcare_professional', label: 'Healthcare Professionals', icon: Heart, description: 'Medical professionals' }
        ];
        
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Which best describes you?</h2>
              <p className="text-gray-600">Help us understand your primary role and context</p>
            </div>
            
            <div className="grid gap-4">
              {audienceOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      answers.audience === option.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleAnswer('audience', option.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          answers.audience === option.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            answers.audience === option.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        {answers.audience === option.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'needs':
        const needsOptions = [
          'Content Creation', 'Data Analysis', 'Automation', 'Code Development',
          'Image Generation', 'Meeting Transcription', 'Research Assistance', 
          'Customer Support', 'Marketing', 'Project Management', 'Learning & Training',
          'Document Processing', 'Video Creation', 'Design & Creativity'
        ];
        
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your specific needs?</h2>
              <p className="text-gray-600">Select all areas where you need AI assistance (multiple selections allowed)</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {needsOptions.map((need) => (
                <Badge 
                  key={need}
                  variant={answers.specificNeeds?.includes(need) ? "default" : "outline"}
                  className="cursor-pointer p-3 text-center justify-center hover:scale-105 transition-transform"
                  onClick={() => handleMultiSelect('specificNeeds', need)}
                >
                  {need}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 'budget':
        const budgetOptions = [
          { id: 'free', label: 'Free Only', description: 'Looking for free tools and services' },
          { id: 'low', label: 'Low Budget', description: 'Under $50/month' },
          { id: 'medium', label: 'Medium Budget', description: '$50-200/month' },
          { id: 'high', label: 'High Budget', description: '$200+/month or enterprise pricing' }
        ];
        
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your budget range?</h2>
              <p className="text-gray-600">Help us recommend tools within your price range</p>
            </div>
            
            <div className="space-y-3">
              {budgetOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    answers.budgetRange === option.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleAnswer('budgetRange', option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      {answers.budgetRange === option.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'expertise':
        const expertiseOptions = [
          { id: 'beginner', label: 'Beginner', description: 'I prefer simple, easy-to-use tools' },
          { id: 'intermediate', label: 'Intermediate', description: 'I can handle moderate complexity' },
          { id: 'advanced', label: 'Advanced', description: 'I enjoy technical tools and customization' }
        ];
        
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your technical expertise level?</h2>
              <p className="text-gray-600">This helps us recommend tools that match your comfort level</p>
            </div>
            
            <div className="space-y-3">
              {expertiseOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    answers.technicalExpertise === option.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleAnswer('technicalExpertise', option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      {answers.technicalExpertise === option.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'time':
        const timeOptions = [
          { id: 'immediate', label: 'Immediate', description: 'Need solutions right now' },
          { id: 'days', label: 'Within Days', description: 'Can implement within a few days' },
          { id: 'weeks', label: 'Within Weeks', description: 'Have a few weeks to implement' },
          { id: 'months', label: 'Within Months', description: 'Long-term planning, months timeline' }
        ];
        
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your implementation timeline?</h2>
              <p className="text-gray-600">When do you need to have AI tools up and running?</p>
            </div>
            
            <div className="space-y-3">
              {timeOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    answers.timeConstraints === option.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleAnswer('timeConstraints', option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      {answers.timeConstraints === option.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'usecases':
        const useCaseOptions = [
          'Writing & Content Creation', 'Data Analysis & Reporting', 'Coding & Development',
          'Image & Video Generation', 'Meeting & Communication', 'Research & Learning',
          'Automation & Workflows', 'Customer Service', 'Marketing & Sales',
          'Project Management', 'Design & Creativity', 'Healthcare & Medical'
        ];
        
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your primary use cases?</h2>
              <p className="text-gray-600">Select the main areas where you'll use AI tools (multiple selections allowed)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {useCaseOptions.map((useCase) => (
                <Badge 
                  key={useCase}
                  variant={answers.primaryUseCases?.includes(useCase) ? "default" : "outline"}
                  className="cursor-pointer p-3 text-center justify-center hover:scale-105 transition-transform"
                  onClick={() => handleMultiSelect('primaryUseCases', useCase)}
                >
                  {useCase}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 'industry':
        const industryOptions = [
          'Technology & Software', 'Healthcare & Medical', 'Education & Training',
          'Marketing & Advertising', 'Finance & Banking', 'E-commerce & Retail',
          'Manufacturing & Industrial', 'Consulting & Professional Services',
          'Media & Entertainment', 'Non-profit & Government', 'Real Estate',
          'Other/General Business'
        ];
        
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your industry or context?</h2>
              <p className="text-gray-600">This helps us provide more relevant recommendations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {industryOptions.map((industry) => (
                <Card 
                  key={industry}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    answers.industryContext === industry ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleAnswer('industryContext', industry)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{industry}</span>
                      {answers.industryContext === industry && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tool Screening</h1>
          <p className="text-gray-600">Answer a few questions to get personalized recommendations</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
                    index === currentStep 
                      ? 'bg-blue-100 text-blue-800' 
                      : index < currentStep 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                {...fadeInUp}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
          >
            {currentStep === steps.length - 1 ? 'Get Recommendations' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
