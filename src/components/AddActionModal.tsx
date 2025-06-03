
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, X } from 'lucide-react';
import { theme } from '@/utils/theme';
import { storage } from '@/utils/storage';

interface AddActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddActionModal: React.FC<AddActionModalProps> = ({ isOpen, onClose }) => {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');

  const habitIcons = ['🎯', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴'];

  const handleAddHabit = () => {
    if (habitName.trim()) {
      storage.addHabit(habitName.trim(), selectedIcon);
      setHabitName('');
      setSelectedIcon('🎯');
      setShowHabitForm(false);
      onClose();
      // Trigger a page refresh to show the new habit
      window.location.reload();
    }
  };

  const handleMoodAction = () => {
    console.log('Add mood action clicked');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4"
          style={{ zIndex: 99999 }}
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
              zIndex: 100000,
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
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                zIndex: 100001,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} className="text-white" />
            </motion.button>

            {!showHabitForm ? (
              <motion.div 
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.h2
                  className="text-2xl font-bold text-white mb-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  What would you like to add?
                </motion.h2>

                <div className="space-y-4">
                  {[
                    { 
                      icon: Check, 
                      label: 'Add Habit', 
                      description: 'Create a new daily habit',
                      action: () => setShowHabitForm(true),
                      color: theme.colors.success
                    },
                    { 
                      icon: Heart, 
                      label: 'Log Mood', 
                      description: 'Record how you\'re feeling today',
                      action: handleMoodAction,
                      color: theme.colors.error
                    },
                  ].map((item, index) => (
                    <motion.button
                      key={item.label}
                      onClick={item.action}
                      className="w-full p-4 rounded-xl flex items-center space-x-4 text-left transition-all duration-300 min-h-[44px]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: item.color }}
                      >
                        <item.icon size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {item.label}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2
                  className="text-2xl font-bold text-white mb-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Create New Habit
                </motion.h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Habit Name
                    </label>
                    <input
                      type="text"
                      value={habitName}
                      onChange={(e) => setHabitName(e.target.value)}
                      placeholder="e.g., Drink 8 glasses of water"
                      className="w-full p-4 rounded-xl text-white placeholder-white/60 border border-white/30 backdrop-blur-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                      }}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Choose Icon
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {habitIcons.map((icon) => (
                        <motion.button
                          key={icon}
                          onClick={() => setSelectedIcon(icon)}
                          className="w-full aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-200"
                          style={{
                            background: selectedIcon === icon 
                              ? 'rgba(34, 211, 238, 0.4)' 
                              : 'rgba(255, 255, 255, 0.15)',
                            border: selectedIcon === icon 
                              ? '2px solid #22D3EE' 
                              : '1px solid rgba(255, 255, 255, 0.3)',
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {icon}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setShowHabitForm(false)}
                      className="flex-1 py-3 rounded-xl font-medium text-white border border-white/30"
                      style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleAddHabit}
                      disabled={!habitName.trim()}
                      className="flex-1 py-3 rounded-xl font-medium text-white"
                      style={{ 
                        background: habitName.trim() 
                          ? theme.colors.primary 
                          : 'rgba(255, 255, 255, 0.15)',
                        opacity: habitName.trim() ? 1 : 0.5,
                      }}
                      whileHover={{ scale: habitName.trim() ? 1.02 : 1 }}
                      whileTap={{ scale: habitName.trim() ? 0.98 : 1 }}
                    >
                      Create Habit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddActionModal;
