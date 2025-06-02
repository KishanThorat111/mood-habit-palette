
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
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md p-6 rounded-xl backdrop-blur-md"
        style={{
          background: theme.colors.cardBackground,
          boxShadow: theme.shadow.floating,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: theme.colors.textDark }}>
            Add New Habit
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} style={{ color: theme.colors.textLight }} />
          </button>
        </div>
        
        {/* Habit name input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textDefault }}>
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
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>
        
        {/* Icon selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textDefault }}>
            Choose an Icon
          </label>
          <div className="grid grid-cols-5 gap-2">
            {habitIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className="p-3 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  background: selectedIcon === icon 
                    ? 'rgba(79, 70, 229, 0.2)' 
                    : 'rgba(255, 255, 255, 0.5)',
                  border: selectedIcon === icon 
                    ? '2px solid #4F46E5' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <span className="text-xl">{icon}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 p-3 rounded-lg border border-gray-300 font-medium transition-colors hover:bg-gray-50"
            style={{ color: theme.colors.textDefault }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 p-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Add Habit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
