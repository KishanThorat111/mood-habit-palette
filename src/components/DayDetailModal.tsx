
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
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl backdrop-blur-xl relative"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
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
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center z-10"
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} className="text-white" />
            </motion.button>

            <div className="p-8">
              {/* Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-3xl font-bold text-white mb-2">
                  {dayData.fullDate}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full" />
              </motion.div>

              {/* Mood Section */}
              <motion.div
                className="mb-8 p-6 rounded-2xl"
                style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">Mood</h4>
                    <p className="text-white/70 text-sm">{getMoodLabel(dayData.mood)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{getMoodEmoji(dayData.mood)}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{dayData.mood || '—'}</div>
                      <div className="text-white/60 text-xs">out of 5</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Habits Overview */}
              <motion.div
                className="mb-8 p-6 rounded-2xl"
                style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-white font-semibold text-lg mb-4">Habits Overview</h4>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Completion Rate</div>
                    <div className="text-3xl font-bold text-white">{dayData.completionRate}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/70 text-sm mb-1">Completed</div>
                    <div className="text-2xl font-bold" style={{ color: theme.colors.success }}>
                      {dayData.completedHabits}/{dayData.totalHabits}
                    </div>
                  </div>
                </div>

                {/* Progress Chart */}
                {dayData.totalHabits > 0 && (
                  <div className="flex justify-center">
                    <div className="w-24 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={48}
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
                  </div>
                )}
              </motion.div>

              {/* Individual Habits */}
              {dayData.habits.length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-white font-semibold text-lg mb-4">Habit Details</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {dayData.habits.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        className="flex items-center space-x-4 p-4 rounded-xl"
                        style={{ 
                          background: habit.completed 
                            ? 'rgba(16, 185, 129, 0.2)' 
                            : 'rgba(255, 255, 255, 0.1)' 
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <span className="text-2xl">{habit.icon}</span>
                        <span className="text-white text-sm flex-1 font-medium">{habit.name}</span>
                        <div className={`w-3 h-3 rounded-full ${
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
                className="w-full py-4 rounded-xl font-semibold text-white text-lg"
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
