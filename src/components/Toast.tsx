
import React, { useEffect } from 'react';
import { theme } from '@/utils/theme';
import { Check, Undo2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  onUndo?: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  onUndo,
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { bg: theme.colors.success, icon: <Check size={20} /> };
      case 'error':
        return { bg: theme.colors.error, icon: <X size={20} /> };
      default:
        return { bg: theme.colors.primary, icon: <Check size={20} /> };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div 
      className={`fixed bottom-20 left-4 right-4 flex items-center justify-between p-4 rounded-xl backdrop-blur-md transition-all duration-300 z-40 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: theme.shadow.floating,
        border: `1px solid ${typeStyles.bg}`,
      }}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="flex items-center justify-center w-6 h-6 rounded-full"
          style={{ backgroundColor: typeStyles.bg }}
        >
          <span className="text-white text-sm">{typeStyles.icon}</span>
        </div>
        <span className="font-medium" style={{ color: theme.colors.textDark }}>
          {message}
        </span>
      </div>
      
      {onUndo && (
        <button
          onClick={onUndo}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: theme.colors.primary }}
        >
          <Undo2 size={16} />
          <span className="text-sm font-medium">Undo</span>
        </button>
      )}
    </div>
  );
};

export default Toast;
