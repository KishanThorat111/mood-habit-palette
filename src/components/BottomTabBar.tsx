
import React from 'react';
import { Calendar, Check } from 'lucide-react';
import { theme } from '@/utils/theme';

interface BottomTabBarProps {
  activeTab: 'dashboard' | 'history';
  onTabChange: (tab: 'dashboard' | 'history') => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 backdrop-blur-md z-50"
      style={{
        background: theme.colors.glassBg,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        height: '80px',
      }}
    >
      <button
        onClick={() => onTabChange('dashboard')}
        className="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200"
        style={{ 
          color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight 
        }}
      >
        <Check 
          size={24} 
          style={{ 
            color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight,
            transform: activeTab === 'dashboard' ? 'scale(1.1)' : 'scale(1)',
          }} 
        />
        <span 
          className="text-xs mt-1 font-medium"
          style={{ 
            color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight 
          }}
        >
          Dashboard
        </span>
      </button>
      
      <button
        onClick={() => onTabChange('history')}
        className="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200"
        style={{ 
          color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight 
        }}
      >
        <Calendar 
          size={24} 
          style={{ 
            color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight,
            transform: activeTab === 'history' ? 'scale(1.1)' : 'scale(1)',
          }} 
        />
        <span 
          className="text-xs mt-1 font-medium"
          style={{ 
            color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight 
          }}
        >
          History
        </span>
      </button>
    </div>
  );
};

export default BottomTabBar;
