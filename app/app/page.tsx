'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function HomePage() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background */}
      <div className="absolute inset-0 mountain-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4b5a0]/30 via-[#c9a089]/20 to-[#b8907a]/40" />
        <div className="absolute inset-0 mountain-gradient" />
      </div>

      {/* Reflection effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#d4c4b8]/60 to-transparent" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              className="text-left"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 text-sm font-medium text-gray-700 shadow-sm">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  STRATEGIC AI SOLUTIONS
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 mb-8 leading-tight"
              >
                Strategic AI Solutions
                <br />
                for{' '}
                <span className="italic text-[#8b4c5c]">
                  Real-World Impact
                </span>
              </motion.h1>

              {/* Description Card */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-lg shadow-sm border border-white/50"
              >
                <p className="text-gray-600 leading-relaxed">
                  We bridge two decades of healthcare leadership with cutting-edge AI education. Creating transformative learning experiences for professionals who need practical, strategic solutions.
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium group"
                >
                  Explore Solutions
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-white/50 px-6 py-3 rounded-full font-medium"
                >
                  Meet Jaspreet
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-8"
              >
                <div className="text-left">
                  <div className="text-3xl font-bold text-gray-900">20+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Years Leadership</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div className="text-left">
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Ethical Focus</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Speaker Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {/* Image or Placeholder */}
                  <div className="aspect-[3/4] relative">
                    {!imageError ? (
                      <Image
                        src="/jaspreet-speaker.jpg"
                        alt="Jaspreet Chager speaking at AI & Neural Networks conference"
                        fill
                        className="object-cover"
                        priority
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      /* Placeholder when image not found */
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative">
                        {/* Conference header overlay */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-blue-900/90 to-transparent z-10">
                          <div className="text-white text-xl font-bold">AI & NEURAL NETWORKS</div>
                          <div className="flex items-center mt-2">
                            <span className="text-orange-400 font-semibold">Chager.org</span>
                          </div>
                        </div>

                        {/* Speaker silhouette placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white/50 p-8">
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                              <svg className="w-16 h-16 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            </div>
                            <p className="text-sm">Add speaker image</p>
                            <p className="text-xs mt-1 text-white/30">/public/jaspreet-speaker.jpg</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Conference header overlay - shown on both */}
                    {!imageError && (
                      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-blue-900/90 to-transparent z-10">
                        <div className="text-white text-xl font-bold">AI & NEURAL NETWORKS</div>
                        <div className="flex items-center mt-2">
                          <span className="text-orange-400 font-semibold">Chager.org</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quote Card */}
                <div className="absolute -bottom-4 -left-4 right-8 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 z-20">
                  <p className="text-gray-700 italic text-sm mb-2">
                    &ldquo;AI amplifies human potential, never replaces it.&rdquo;
                  </p>
                  <p className="text-[#8b4c5c] font-semibold text-xs uppercase tracking-wider">
                    Jaspreet Chager
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom right logo */}
      <div className="absolute bottom-6 right-6 text-gray-400 font-bold text-xl">
        ai
      </div>
    </div>
  );
}
