
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Check, Plus, Heart, BookOpen } from 'lucide-react';
import { theme } from '@/utils/theme';

interface EnhancedBottomTabBarProps {
  activeTab: 'dashboard' | 'history';
  onTabChange: (tab: 'dashboard' | 'history') => void;
}

const EnhancedBottomTabBar: React.FC<EnhancedBottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const [showRadialMenu, setShowRadialMenu] = useState(false);

  const radialMenuItems = [
    { icon: Check, label: 'Add Habit', angle: -90 },
    { icon: Heart, label: 'Add Mood', angle: -45 },
    { icon: BookOpen, label: 'Add Note', angle: 0 },
  ];

  return (
    <>
      {/* Radial Menu Overlay */}
      <AnimatePresence>
        {showRadialMenu && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRadialMenu(false)}
          >
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              {radialMenuItems.map((item, index) => {
                const radians = (item.angle * Math.PI) / 180;
                const distance = 80;
                const x = Math.cos(radians) * distance;
                const y = Math.sin(radians) * distance;

                return (
                  <motion.button
                    key={item.label}
                    className="absolute w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: theme.colors.primary,
                      boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
                    }}
                    initial={{ 
                      scale: 0, 
                      x: 0, 
                      y: 0,
                      opacity: 0 
                    }}
                    animate={{ 
                      scale: 1, 
                      x: x, 
                      y: y,
                      opacity: 1 
                    }}
                    exit={{ 
                      scale: 0, 
                      x: 0, 
                      y: 0,
                      opacity: 0 
                    }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      console.log(`Add ${item.label} clicked`);
                      setShowRadialMenu(false);
                    }}
                  >
                    <item.icon size={20} color="white" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Tab Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-3 backdrop-blur-xl z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          height: '80px',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Dashboard Tab */}
        <motion.button
          onClick={() => onTabChange('dashboard')}
          className="tab-button flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 min-w-[44px] min-h-[44px]"
          style={{ 
            color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ 
              scale: activeTab === 'dashboard' ? 1.2 : 1,
              rotateY: activeTab === 'dashboard' ? 360 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Check 
              size={24} 
              style={{ 
                color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight,
              }} 
            />
          </motion.div>
          <motion.span 
            className="text-xs mt-1 font-medium"
            style={{ 
              color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight 
            }}
            animate={{ opacity: activeTab === 'dashboard' ? 1 : 0.7 }}
          >
            Dashboard
          </motion.span>
          {activeTab === 'dashboard' && (
            <motion.div
              className="absolute bottom-0 w-12 h-1 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
              layoutId="activeTab"
            />
          )}
        </motion.button>
        
        {/* Center Plus Button */}
        <motion.div
          className="flex items-center justify-center mx-4"
        >
          <motion.button
            onClick={() => setShowRadialMenu(!showRadialMenu)}
            className="w-14 h-14 rounded-full flex items-center justify-center min-w-[44px] min-h-[44px]"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: '0 12px 35px rgba(79, 70, 229, 0.6)',
            }}
            whileTap={{ 
              scale: 0.9,
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.8)',
            }}
            animate={{
              rotate: showRadialMenu ? 45 : 0,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300,
              damping: 20
            }}
          >
            <motion.div
              animate={{
                scale: showRadialMenu ? 1.2 : 1,
              }}
            >
              <Plus size={24} color="white" />
            </motion.div>
          </motion.button>
        </motion.div>
        
        {/* History Tab */}
        <motion.button
          onClick={() => onTabChange('history')}
          className="tab-button flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 min-w-[44px] min-h-[44px]"
          style={{ 
            color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ 
              scale: activeTab === 'history' ? 1.2 : 1,
              rotateY: activeTab === 'history' ? 360 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Calendar 
              size={24} 
              style={{ 
                color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight,
              }} 
            />
          </motion.div>
          <motion.span 
            className="text-xs mt-1 font-medium"
            style={{ 
              color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight 
            }}
            animate={{ opacity: activeTab === 'history' ? 1 : 0.7 }}
          >
            History
          </motion.span>
          {activeTab === 'history' && (
            <motion.div
              className="absolute bottom-0 w-12 h-1 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
              layoutId="activeTab"
            />
          )}
        </motion.button>
      </motion.div>
    </>
  );
};

export default EnhancedBottomTabBar;
