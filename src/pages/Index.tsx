
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './Dashboard';
import EnhancedHistory from '@/components/EnhancedHistory';
import EnhancedBottomTabBar from '@/components/EnhancedBottomTabBar';
import AnimatedBackground from '@/components/AnimatedBackground';
import AnimatedCursor from '@/components/AnimatedCursor';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Custom Cursor */}
      <div className="hidden md:block">
        <AnimatedCursor />
      </div>
      
      {/* Content with smooth transitions and proper z-index */}
      <motion.div
        className="relative z-10 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <Dashboard />
          </motion.div>
        )}
        
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <EnhancedHistory />
          </motion.div>
        )}
      </motion.div>
      
      {/* Enhanced Bottom Tab Bar with highest z-index */}
      <EnhancedBottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
