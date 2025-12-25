
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Search, 
  Users, 
  TrendingUp, 
  Clock, 
  Heart, 
  Building, 
  GraduationCap, 
  Zap,
  ArrowRight,
  Bot,
  Target,
  Lightbulb
} from 'lucide-react';
import { AUDIENCE_LABELS, AUDIENCE_DESCRIPTIONS, AudienceType } from '@/lib/types';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const CountUp = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function HomePage() {
  const [toolsCount, setToolsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch database from API
        const response = await fetch('/api/database');
        if (response.ok) {
          const data = await response.json();
          
          // Calculate categories count
          const categoryCounts: Record<string, number> = {};
          if (data?.ai_tools?.length) {
            data.ai_tools.forEach((tool: any) => {
              if (tool?.category) {
                categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
              }
            });
          }
          
          // Calculate audience stats
          const audienceStats: Record<string, number> = {};
          if (data?.tool_audience_matching?.length) {
            data.tool_audience_matching.forEach((match: any) => {
              if (match?.audience_id) {
                audienceStats[match.audience_id] = (audienceStats[match.audience_id] || 0) + 1;
              }
            });
          }
          
          setToolsCount(data?.ai_tools?.length || 50);
          setCategoriesCount(Object.keys(categoryCounts).length || 8);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        // Set fallback values
        setToolsCount(50);
        setCategoriesCount(8);
      }
    };
    
    loadStats();
  }, []);

  const audienceCards = [
    {
      id: 'sme' as AudienceType,
      icon: Building,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'upskiller' as AudienceType,
      icon: GraduationCap,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'busy_individual' as AudienceType,
      icon: Zap,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      id: 'healthcare_professional' as AudienceType,
      icon: Heart,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Bot className="w-4 h-4 mr-2" />
                AI-Powered Tool Discovery
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8"
            >
              Find the Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Tools
              </span>{' '}
              for Your Needs
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Discover personalized AI tool recommendations through our intelligent screening process. 
              Whether you're running a business, learning new skills, or optimizing productivity, 
              we'll match you with the right tools.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="mb-16">
              <Link href="/screening">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold group">
                  Start Your AI Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <CountUp end={50} />+
                </div>
                <div className="text-gray-600">AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <CountUp end={categoriesCount} />
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <CountUp end={4} />
                </div>
                <div className="text-gray-600">Target Audiences</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Target Audiences Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Who We Help
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent screening process is designed for four key audiences, 
              each with unique needs and challenges.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {audienceCards.map((audience) => {
              const IconComponent = audience.icon;
              return (
                <motion.div key={audience.id} variants={fadeInUp}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl ${audience.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-8 h-8 ${audience.iconColor}`} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {AUDIENCE_LABELS[audience.id]}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {AUDIENCE_DESCRIPTIONS[audience.id]}
                      </p>

                      <div className={`h-1 w-24 bg-gradient-to-r ${audience.gradient} rounded-full`}></div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our three-step process ensures you get the most relevant AI tool recommendations
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {[
              {
                step: '01',
                icon: Target,
                title: 'Tell Us About You',
                description: 'Share your role, industry, technical expertise, and specific needs through our intelligent questionnaire.'
              },
              {
                step: '02',
                icon: Search,
                title: 'AI Analysis',
                description: 'Our recommendation engine analyzes your responses against our database of 50+ AI tools and their capabilities.'
              },
              {
                step: '03',
                icon: Lightbulb,
                title: 'Get Recommendations',
                description: 'Receive personalized tool suggestions with detailed explanations, pricing, and implementation guidance.'
              }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-blue-600 mb-4">{item.step}</div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-white"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Discover Your Perfect AI Tools?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90">
              Take our intelligent screening survey and get personalized recommendations in minutes.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/screening">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold group">
                  Start Screening Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
