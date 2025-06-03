
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Plus } from 'lucide-react';
import { theme } from '@/utils/theme';
import AddActionModal from './AddActionModal';

interface EnhancedBottomTabBarProps {
  activeTab: 'dashboard' | 'history';
  onTabChange: (tab: 'dashboard' | 'history') => void;
}

const EnhancedBottomTabBar: React.FC<EnhancedBottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Add Action Modal */}
      <AddActionModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      {/* Bottom Tab Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-3 backdrop-blur-xl z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          height: '80px',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Dashboard Tab */}
        <motion.button
          onClick={() => onTabChange('dashboard')}
          className="tab-button flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 min-w-[44px] min-h-[44px]"
          style={{ 
            color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ 
              scale: activeTab === 'dashboard' ? 1.2 : 1,
              rotateY: activeTab === 'dashboard' ? 360 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Check 
              size={24} 
              style={{ 
                color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight,
              }} 
            />
          </motion.div>
          <motion.span 
            className="text-xs mt-1 font-medium"
            style={{ 
              color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textLight 
            }}
            animate={{ opacity: activeTab === 'dashboard' ? 1 : 0.7 }}
          >
            Dashboard
          </motion.span>
          {activeTab === 'dashboard' && (
            <motion.div
              className="absolute bottom-0 w-12 h-1 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
              layoutId="activeTab"
            />
          )}
        </motion.button>

        {/* Add Button */}
        <motion.button
          onClick={() => setShowModal(true)}
          className="cursor-hover mx-4 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 min-w-[44px] min-h-[44px]"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
            boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 12px 35px rgba(79, 70, 229, 0.5)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Plus size={24} className="text-white" />
          </motion.div>
        </motion.button>
        
        {/* History Tab */}
        <motion.button
          onClick={() => onTabChange('history')}
          className="tab-button flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 min-w-[44px] min-h-[44px]"
          style={{ 
            color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ 
              scale: activeTab === 'history' ? 1.2 : 1,
              rotateY: activeTab === 'history' ? 360 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Calendar 
              size={24} 
              style={{ 
                color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight,
              }} 
            />
          </motion.div>
          <motion.span 
            className="text-xs mt-1 font-medium"
            style={{ 
              color: activeTab === 'history' ? theme.colors.primary : theme.colors.textLight 
            }}
            animate={{ opacity: activeTab === 'history' ? 1 : 0.7 }}
          >
            History
          </motion.span>
          {activeTab === 'history' && (
            <motion.div
              className="absolute bottom-0 w-12 h-1 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
              layoutId="activeTab"
            />
          )}
        </motion.button>
      </motion.div>
    </>
  );
};

export default EnhancedBottomTabBar;
