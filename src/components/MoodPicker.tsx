
import React from 'react';
import { theme } from '@/utils/theme';

interface MoodPickerProps {
  selectedMood: number | null;
  onMoodSelect: (mood: number, emoji: string) => void;
}

const moods = [
  { value: 5, emoji: '😃', label: 'Amazing' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '🙁', label: 'Not great' },
  { value: 1, emoji: '😢', label: 'Terrible' },
];

const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="p-4 mx-4 mb-6 rounded-xl backdrop-blur-md" style={{
      background: theme.colors.glassBg,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: theme.shadow.glass,
    }}>
      <h3 className="text-center mb-4 font-medium" style={{
        fontSize: theme.fontSize.body,
        color: theme.colors.textDefault,
      }}>
        How are you feeling today?
      </h3>
      
      <div className="flex justify-center space-x-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onMoodSelect(mood.value, mood.emoji)}
            className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            style={{
              background: selectedMood === mood.value 
                ? 'rgba(34, 211, 238, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: selectedMood === mood.value 
                ? '2px solid #22D3EE' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              transform: selectedMood === mood.value ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs" style={{ color: theme.colors.textLight }}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodPicker;
