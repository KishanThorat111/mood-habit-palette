
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Undo2 } from 'lucide-react';
import { theme } from '@/utils/theme';

interface OptimizedToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  onUndo?: () => void;
}

const OptimizedToast: React.FC<OptimizedToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  onUndo 
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'info': return theme.colors.primary;
      default: return theme.colors.primary;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] max-w-sm w-full mx-4"
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className="p-4 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getTypeColor() }}
              />
              <p className="text-white font-medium text-sm flex-1">{message}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {onUndo && (
                <motion.button
                  onClick={onUndo}
                  className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Undo2 size={16} />
                </motion.button>
              )}
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptimizedToast;
