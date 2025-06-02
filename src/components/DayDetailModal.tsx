
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { theme } from '@/utils/theme';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: {
    fullDate: string;
    mood: number;
    completedHabits: number;
    totalHabits: number;
    completionRate: number;
    habits: Array<{
      id: string;
      name: string;
      icon: string;
      completed: boolean;
    }>;
  } | null;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ isOpen, onClose, dayData }) => {
  if (!dayData) return null;

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 5: return '😃';
      case 4: return '😊';
      case 3: return '😐';
      case 2: return '🙁';
      case 1: return '😢';
      default: return '—';
    }
  };

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 5: return 'Amazing';
      case 4: return 'Good';
      case 3: return 'Okay';
      case 2: return 'Not great';
      case 1: return 'Terrible';
      default: return 'No mood logged';
    }
  };

  const pieData = [
    { name: 'Completed', value: dayData.completedHabits, color: theme.colors.success },
    { name: 'Remaining', value: dayData.totalHabits - dayData.completedHabits, color: 'rgba(255, 255, 255, 0.3)' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl backdrop-blur-xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            }}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} className="text-white" />
            </motion.button>

            <div className="p-6">
              <motion.h3
                className="text-2xl font-bold mb-6 text-white text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {dayData.fullDate}
              </motion.h3>

              {/* Mood Section */}
              <motion.div
                className="mb-6 p-4 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Mood</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl">{getMoodEmoji(dayData.mood)}</span>
                    <span className="text-white/80 text-sm">{getMoodLabel(dayData.mood)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Habits Overview */}
              <motion.div
                className="mb-6 p-4 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium">Habits Completed</span>
                  <span className="font-bold text-xl" style={{ color: theme.colors.success }}>
                    {dayData.completedHabits}/{dayData.totalHabits}
                  </span>
                </div>

                {/* Progress Chart */}
                {dayData.totalHabits > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={40}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1">
                      <div className="text-white/80 text-sm mb-1">Completion Rate</div>
                      <div className="text-2xl font-bold text-white">{dayData.completionRate}%</div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Individual Habits */}
              {dayData.habits.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-white font-medium mb-3">Habit Details</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {dayData.habits.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        className="flex items-center space-x-3 p-2 rounded-lg"
                        style={{ 
                          background: habit.completed 
                            ? 'rgba(16, 185, 129, 0.2)' 
                            : 'rgba(255, 255, 255, 0.1)' 
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <span className="text-lg">{habit.icon}</span>
                        <span className="text-white text-sm flex-1">{habit.name}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          habit.completed ? 'bg-green-400' : 'bg-white/40'
                        }`} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-medium text-white"
                style={{ backgroundColor: theme.colors.primary }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DayDetailModal;
