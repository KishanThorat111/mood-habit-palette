
import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/utils/theme';

interface EnhancedMoodPickerProps {
  selectedMood: number | null;
  onMoodSelect: (mood: number, emoji: string) => void;
}

const moods = [
  { value: 5, emoji: '😃', label: 'Amazing' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '🙁', label: 'Not great' },
  { value: 1, emoji: '😢', label: 'Terrible' },
];

const EnhancedMoodPicker: React.FC<EnhancedMoodPickerProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <motion.div
      className="p-6 mx-4 mb-6 rounded-2xl backdrop-blur-xl cursor-hover"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.h3
        className="text-center mb-6 font-semibold text-lg text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        How are you feeling today?
      </motion.h3>
      
      <div className="flex justify-center space-x-3 flex-wrap gap-y-3">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.value}
            onClick={() => onMoodSelect(mood.value, mood.emoji)}
            className="mood-button flex flex-col items-center p-4 rounded-2xl transition-all duration-300 min-w-[44px] min-h-[44px] relative"
            style={{
              background: selectedMood === mood.value 
                ? 'rgba(34, 211, 238, 0.4)' 
                : 'rgba(255, 255, 255, 0.2)',
              border: selectedMood === mood.value 
                ? '2px solid #22D3EE' 
                : '1px solid rgba(255, 255, 255, 0.3)',
            }}
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.6 + index * 0.1,
              type: "spring",
              stiffness: 300
            }}
            whileHover={{ 
              scale: 1.1,
              rotateY: 10,
              rotateX: 5,
              boxShadow: '0 8px 25px rgba(34, 211, 238, 0.3)',
              y: -5,
            }}
            whileTap={{ 
              scale: 0.95,
              rotateY: 0,
              rotateX: 0,
            }}
            aria-label={`Select mood: ${mood.label}`}
          >
            {/* Ripple effect background */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ 
                scale: 2, 
                opacity: [0, 0.3, 0],
                transition: { duration: 0.5 }
              }}
              style={{
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, transparent 70%)',
              }}
            />
            
            <motion.span 
              className="text-3xl mb-2 relative z-10"
              whileHover={{ 
                scale: 1.2,
                rotate: [0, -10, 10, 0],
              }}
              transition={{ 
                scale: { duration: 0.2 },
                rotate: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              {mood.emoji}
            </motion.span>
            
            <span 
              className="text-xs font-medium relative z-10 text-white/90"
            >
              {mood.label}
            </span>
            
            {/* Glow effect for selected mood */}
            {selectedMood === mood.value && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: 'linear-gradient(45deg, rgba(34, 211, 238, 0.3), rgba(79, 70, 229, 0.3))',
                  filter: 'blur(8px)',
                  zIndex: -1,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedMoodPicker;
