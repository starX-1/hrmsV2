'use client'

import { useEffect, useState } from "react";
import Header from "./components/HeaderMain";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles } from 'lucide-react';

export default function Home() {
  // ✅ ALL HOOKS CALLED AT TOP LEVEL - NOT IN CONDITIONALS
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Floating particles for background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 4 + 1,
  }));

  useEffect(() => {
    setIsClient(true);
    setIsLoaded(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't render the full component on server
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full"
          />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-green-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-green-100 to-green-50 opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 3 + particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-green-400 z-50"
      />

      {/* Floating Scroll-to-top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white shadow-2xl flex items-center justify-center hover:shadow-green-500/30 transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping opacity-0" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Loading Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full"
              />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-green-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Sections with Stagger Effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />

        <main>
          {/* Hero Section with Parallax */}
          <motion.div>
            <Hero />
          </motion.div>

          {/* Features Section with Staggered Children */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Features />
          </motion.div>

          {/* How It Works with Enhanced Visuals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HowItWorks />
          </motion.div>

          {/* Testimonials with Interactive Slider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Testimonials />
          </motion.div>

          {/* Pricing Cards with Hover Effects */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Pricing />
          </motion.div>

          {/* CTA Section with Enhanced Visuals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CTA />
          </motion.div>
        </main>

        {/* Footer with Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Footer />
        </motion.div>
      </motion.div>

      {/* Interactive Hover Effects Container */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-gradient-to-r from-green-100/20 to-green-300/20 rounded-full blur-3xl" />
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-gradient-to-r from-green-200/20 to-green-400/20 rounded-full blur-3xl" />
      </div>

      {/* Scroll-triggered Confetti Effect */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 opacity-0"
              initial={{ y: -100, x: Math.random() * window.innerWidth }}
              animate={{
                y: window.innerHeight + 100,
                x: Math.random() * window.innerWidth - 100,
                opacity: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 5,
              }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}