
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { theme } from '@/utils/theme';

interface EnhancedParallaxHeaderProps {
  title: string;
}

const EnhancedParallaxHeader: React.FC<EnhancedParallaxHeaderProps> = ({ title }) => {
  const { scrollY } = useScroll();
  
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <div className="relative h-64 overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: backgroundY,
          background: theme.colors.background,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20" />
      </motion.div>
      
      {/* Content */}
      <motion.div
        className="relative h-full flex items-center justify-center"
        style={{ y: textY, opacity, scale }}
      >
        <motion.h1
          className="text-4xl font-bold text-white text-center px-4"
          style={{
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
      </motion.div>
      
      {/* Overlay gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
    </div>
  );
};

export default EnhancedParallaxHeader;
