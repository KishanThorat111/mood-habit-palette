
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import EnhancedParallaxHeader from '@/components/EnhancedParallaxHeader';
import EnhancedMoodPicker from '@/components/EnhancedMoodPicker';
import EnhancedHabitCard from '@/components/EnhancedHabitCard';
import AddHabitModal from '@/components/AddHabitModal';
import Toast from '@/components/Toast';
import { storage, Habit } from '@/utils/storage';
import { theme } from '@/utils/theme';

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    undoAction?: () => void;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  useEffect(() => {
    setHabits(storage.getHabits());
    const { mood } = storage.getTodayMood();
    setSelectedMood(mood);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', undoAction?: () => void) => {
    setToast({ message, type, isVisible: true, undoAction });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleMoodSelect = (mood: number, emoji: string) => {
    setSelectedMood(mood);
    storage.setTodayMood(mood, emoji);
    showToast('Mood saved! 😊');
  };

  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      storage.toggleHabit(habitId);
      const updatedHabits = storage.getHabits();
      setHabits(updatedHabits);
      
      const message = habit.completed ? 'Habit marked incomplete' : 'Great job! Habit completed! 🎉';
      showToast(message, 'success', () => {
        storage.toggleHabit(habitId);
        setHabits(storage.getHabits());
        hideToast();
      });
    }
  };

  const handleAddHabit = (name: string, icon: string) => {
    storage.addHabit(name, icon);
    setHabits(storage.getHabits());
    showToast(`"${name}" added to your habits!`);
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      storage.deleteHabit(habitId);
      setHabits(storage.getHabits());
      showToast(`"${habit.name}" deleted`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Parallax Header */}
      <EnhancedParallaxHeader title="Today's Habits" />
      
      {/* Content with scroll snapping */}
      <div className="relative -mt-8 z-10 snap-y snap-mandatory">
        {/* Mood Picker Section */}
        <motion.div 
          className="snap-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <EnhancedMoodPicker selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
        </motion.div>
        
        {/* Habits List Section */}
        <motion.div 
          className="pb-24 snap-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {habits.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-16 px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🌱
              </motion.div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: theme.colors.textDark }}>
                Start Your Journey
              </h3>
              <p className="text-center mb-6 text-lg" style={{ color: theme.colors.textLight }}>
                Add your first habit to begin tracking your daily progress
              </p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="cursor-hover px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-200 min-w-[44px] min-h-[44px]"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 12px 35px rgba(79, 70, 229, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                Add Your First Habit
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {habits.map((habit, index) => (
                <EnhancedHabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggleHabit}
                  onLongPress={handleDeleteHabit}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Enhanced Floating Action Button */}
      {habits.length > 0 && (
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="cursor-hover fixed bottom-24 right-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 z-30 min-w-[44px] min-h-[44px]"
          style={{
            backgroundColor: theme.colors.primary,
            boxShadow: '0 12px 40px rgba(79, 70, 229, 0.3)',
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 15px 50px rgba(79, 70, 229, 0.4)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus size={28} color="white" />
        </motion.button>
      )}
      
      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddHabit}
      />
      
      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        onUndo={toast.undoAction}
      />
    </div>
  );
};

export default Dashboard;
