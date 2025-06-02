
import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/utils/theme';
import { Habit } from '@/utils/storage';

interface EnhancedHabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onLongPress?: (habitId: string) => void;
  index: number;
}

const EnhancedHabitCard: React.FC<EnhancedHabitCardProps> = ({ 
  habit, 
  onToggle, 
  onLongPress, 
  index 
}) => {
  return (
    <motion.div
      className="habit-card flex items-center p-5 mx-4 mb-4 rounded-2xl backdrop-blur-xl cursor-pointer min-h-[44px]"
      style={{
        background: habit.completed 
          ? 'rgba(34, 211, 238, 0.3)' 
          : 'rgba(255, 255, 255, 0.25)',
        border: habit.completed 
          ? '1px solid rgba(34, 211, 238, 0.6)' 
          : '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      }}
      whileTap={{ scale: 0.98 }}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.(habit.id);
      }}
    >
      {/* Icon */}
      <motion.div
        className="flex items-center justify-center w-12 h-12 mr-4 rounded-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
        }}
        whileHover={{ rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <span className="text-2xl">{habit.icon}</span>
      </motion.div>
      
      {/* Habit name */}
      <div className="flex-1">
        <motion.h4
          className="font-semibold text-lg"
          style={{
            color: theme.colors.textDark,
            textDecoration: habit.completed ? 'line-through' : 'none',
            opacity: habit.completed ? 0.7 : 1,
          }}
          animate={{ opacity: habit.completed ? 0.7 : 1 }}
        >
          {habit.name}
        </motion.h4>
      </div>
      
      {/* Enhanced toggle switch */}
      <motion.button
        onClick={() => onToggle(habit.id)}
        className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 min-w-[44px] min-h-[44px]"
        style={{
          backgroundColor: habit.completed ? theme.colors.primary : '#E5E7EB',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Toggle habit: ${habit.name}`}
      >
        <motion.span
          className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
          animate={{
            x: habit.completed ? 28 : 4,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );
};

export default EnhancedHabitCard;
