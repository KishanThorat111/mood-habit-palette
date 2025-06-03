
import React, { useState } from 'react';
import { theme } from '@/utils/theme';
import { Plus, X } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
}

const habitIcons = ['📚', '💪', '🏃', '🧘', '💧', '🎨', '📝', '🎵', '🌱', '🍎'];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(habitIcons[0]);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!habitName.trim()) {
      setError('Please enter a habit name');
      return;
    }
    
    onAdd(habitName.trim(), selectedIcon);
    setHabitName('');
    setSelectedIcon(habitIcons[0]);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setHabitName('');
    setSelectedIcon(habitIcons[0]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Add New Habit
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        
        {/* Habit name input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-3 text-white">
            Habit Name
          </label>
          <input
            type="text"
            value={habitName}
            onChange={(e) => {
              setHabitName(e.target.value);
              setError('');
            }}
            placeholder="e.g., Read for 20 minutes"
            className="w-full p-4 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-300">{error}</p>
          )}
        </div>
        
        {/* Icon selector */}
        <div className="mb-8">
          <label className="block text-lg font-medium mb-3 text-white">
            Choose an Icon
          </label>
          <div className="grid grid-cols-5 gap-3">
            {habitIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className="p-4 rounded-xl transition-all duration-200 hover:scale-110"
                style={{
                  background: selectedIcon === icon 
                    ? 'rgba(34, 211, 238, 0.4)' 
                    : 'rgba(255, 255, 255, 0.15)',
                  border: selectedIcon === icon 
                    ? '2px solid #22D3EE' 
                    : '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <span className="text-2xl">{icon}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={handleClose}
            className="flex-1 p-4 rounded-xl font-medium text-white transition-colors hover:bg-white/20"
            style={{ 
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 p-4 rounded-xl font-medium text-white transition-colors hover:opacity-90"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
            }}
          >
            Add Habit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
