
import React from 'react';
import { theme } from '@/utils/theme';
import { Habit } from '@/utils/storage';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onLongPress?: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onLongPress }) => {
  return (
    <div 
      className="flex items-center p-4 mx-4 mb-3 rounded-xl backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer"
      style={{
        background: habit.completed 
          ? 'rgba(34, 211, 238, 0.2)' 
          : theme.colors.glassCard,
        border: habit.completed 
          ? '1px solid rgba(34, 211, 238, 0.5)' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: theme.shadow.glass,
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.(habit.id);
      }}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-lg" style={{
        background: 'rgba(255, 255, 255, 0.2)',
      }}>
        <span className="text-xl">{habit.icon}</span>
      </div>
      
      {/* Habit name */}
      <div className="flex-1">
        <h4 
          className="font-medium"
          style={{
            fontSize: theme.fontSize.body,
            color: theme.colors.textDefault,
            textDecoration: habit.completed ? 'line-through' : 'none',
            opacity: habit.completed ? 0.7 : 1,
          }}
        >
          {habit.name}
        </h4>
      </div>
      
      {/* Toggle switch */}
      <button
        onClick={() => onToggle(habit.id)}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
        style={{
          backgroundColor: habit.completed ? theme.colors.primary : '#E5E7EB',
        }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
          style={{
            transform: habit.completed ? 'translateX(1.5rem)' : 'translateX(0.125rem)',
          }}
        />
      </button>
    </div>
  );
};

export default HabitCard;
