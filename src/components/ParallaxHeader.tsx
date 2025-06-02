
import React from 'react';
import { theme } from '@/utils/theme';

interface ParallaxHeaderProps {
  scrollY: number;
  title: string;
}

const ParallaxHeader: React.FC<ParallaxHeaderProps> = ({ scrollY, title }) => {
  const headerHeight = Math.max(120, 200 - scrollY * 0.5);
  const titleOpacity = Math.max(0.7, 1 - scrollY * 0.003);
  const titleScale = Math.max(0.8, 1 - scrollY * 0.001);

  return (
    <div 
      className="relative overflow-hidden transition-all duration-300 ease-out"
      style={{
        height: `${headerHeight}px`,
        background: theme.colors.background,
      }}
    >
      {/* Parallax background */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          background: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 70%), radial-gradient(circle at 70% 80%, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Backdrop blur overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      
      {/* Title */}
      <div className="relative h-full flex items-center justify-center">
        <h1 
          className="text-white font-bold text-center px-4 transition-all duration-300"
          style={{
            fontSize: headerHeight > 150 ? theme.fontSize.h1 : theme.fontSize.h2,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default ParallaxHeader;
