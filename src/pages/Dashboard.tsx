
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ParallaxHeader from '@/components/ParallaxHeader';
import MoodPicker from '@/components/MoodPicker';
import HabitCard from '@/components/HabitCard';
import AddHabitModal from '@/components/AddHabitModal';
import Toast from '@/components/Toast';
import { storage, Habit } from '@/utils/storage';
import { theme } from '@/utils/theme';

const Dashboard: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
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
    // Load habits and mood on mount
    setHabits(storage.getHabits());
    const { mood } = storage.getTodayMood();
    setSelectedMood(mood);

    // Handle scroll events
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    const previousHabits = [...habits];
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      storage.toggleHabit(habitId);
      const updatedHabits = storage.getHabits();
      setHabits(updatedHabits);
      
      const message = habit.completed ? 'Habit marked incomplete' : 'Great job! Habit completed! 🎉';
      showToast(message, 'success', () => {
        // Undo action
        storage.toggleHabit(habitId);
        setHabits(storage.getHabits());
        hideToast();
      });
    }
  };

  const handleAddHabit = (name: string, icon: string) => {
    const newHabit = storage.addHabit(name, icon);
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)' }}>
      {/* Parallax Header */}
      <ParallaxHeader scrollY={scrollY} title="Today's Habits" />
      
      {/* Content */}
      <div className="relative -mt-4 z-10">
        {/* Mood Picker */}
        <MoodPicker selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
        
        {/* Habits List */}
        <div className="pb-24">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.textDark }}>
                Start Your Journey
              </h3>
              <p className="text-center" style={{ color: theme.colors.textLight }}>
                Add your first habit to begin tracking your daily progress
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Add Your First Habit
              </button>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggleHabit}
                onLongPress={handleDeleteHabit}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Floating Action Button */}
      {habits.length > 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 z-30"
          style={{
            backgroundColor: theme.colors.primary,
            boxShadow: theme.shadow.floating,
          }}
        >
          <Plus size={24} color="white" />
        </button>
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
