
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { theme } from '@/utils/theme';
import { Habit } from '@/utils/storage';

interface EnhancedHabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  index: number;
}

const EnhancedHabitCard: React.FC<EnhancedHabitCardProps> = ({ 
  habit, 
  onToggle, 
  onDelete,
  index 
}) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  return (
    <motion.div
      className="habit-card flex items-center p-4 sm:p-5 mx-4 mb-4 rounded-2xl backdrop-blur-xl cursor-pointer min-h-[44px] relative"
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
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      {/* Delete Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(habit.id);
        }}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 min-w-[44px] min-h-[44px] z-10"
        style={{
          background: 'rgba(239, 68, 68, 0.9)',
          opacity: showDeleteButton ? 1 : 0,
          pointerEvents: showDeleteButton ? 'auto' : 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Delete habit: ${habit.name}`}
      >
        <X size={16} className="text-white" />
      </motion.button>

      {/* Icon */}
      <motion.div
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
        }}
        whileHover={{ rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <span className="text-xl sm:text-2xl">{habit.icon}</span>
      </motion.div>
      
      {/* Habit name */}
      <div className="flex-1 min-w-0">
        <motion.h4
          className="font-semibold text-base sm:text-lg truncate"
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
        onClick={(e) => {
          e.stopPropagation();
          onToggle(habit.id);
        }}
        className="relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 min-w-[44px] min-h-[44px] flex-shrink-0"
        style={{
          backgroundColor: habit.completed ? theme.colors.primary : '#E5E7EB',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Toggle habit: ${habit.name}`}
      >
        <motion.span
          className="inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg"
          animate={{
            x: habit.completed ? (window.innerWidth < 640 ? 20 : 28) : 4,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );
};

export default EnhancedHabitCard;
