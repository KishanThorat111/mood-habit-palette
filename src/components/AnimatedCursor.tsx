
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/utils/theme';

const AnimatedCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, .cursor-hover, .habit-card, .mood-button, .tab-button, a, input, [role="button"]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
          boxShadow: isHovering 
            ? `0 0 20px ${theme.colors.primary}40` 
            : `0 0 10px ${theme.colors.primary}20`,
        }}
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 1.5 : 1,
          width: isHovering ? 16 : 12,
          height: isHovering ? 16 : 12,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />
      
      {/* Trailing cursor ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2"
        style={{
          borderColor: isHovering 
            ? `${theme.colors.secondary}60` 
            : `${theme.colors.primary}40`,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
        }}
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.8 : 1,
          width: isHovering ? 48 : 40,
          height: isHovering ? 48 : 40,
          opacity: isHovering ? 0.8 : 0.6,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
        }}
      />

      {/* Outer glow ring for interactive elements */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
          style={{
            background: `radial-gradient(circle, ${theme.colors.primary}20 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          initial={{ opacity: 0 }}
          animate={{
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
            scale: 1.2,
            width: 80,
            height: 80,
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        />
      )}
    </>
  );
};

export default AnimatedCursor;
