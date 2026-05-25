'use client';

import React from 'react';

interface FancyLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export default function FancyLoader({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
}: FancyLoaderProps) {

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  const Spinner = () => {
    return (
      <div className={`relative ${sizeClasses[size]}`}>

        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl opacity-70 animate-pulse" />

        {/* OUTER ARC (clockwise) */}
        <div className="absolute inset-0 rounded-full">
          <div className="w-full h-full rounded-full border-[3px] border-transparent 
            border-t-blue-400/80 border-r-transparent border-b-transparent border-l-transparent
            animate-spin"
            style={{ animationDuration: '6s' }}
          />
        </div>

        {/* SECOND ARC (reverse) */}
        <div className="absolute inset-2 rounded-full">
          <div className="w-full h-full rounded-full border-[3px] border-transparent 
            border-b-purple-400/80 border-l-transparent border-t-transparent border-r-transparent
            animate-[spin_4s_linear_infinite_reverse]"
          />
        </div>

        {/* THIRD ARC (faded trail effect) */}
        <div className="absolute inset-4 rounded-full">
          <div className="w-full h-full rounded-full border-[2px] border-transparent 
            border-r-indigo-400/60 border-t-transparent border-b-transparent border-l-transparent
            animate-spin"
            style={{ animationDuration: '3s' }}
          />
        </div>

        {/* ORBITING LIGHT PARTICLES */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 shadow-lg"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 90}deg) translateX(${size === 'lg' ? '52px' : size === 'md' ? '38px' : '28px'})`,
                animation: `orbit ${3 + i}s linear infinite`,
                animationDelay: `-${i * 0.4}s`,
                opacity: 0.8
              }}
            />
          ))}
        </div>

        {/* CENTER ENERGY CORE */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 blur-[3px] animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 rounded-full border border-white/30 animate-ping" />
          </div>
        </div>

      </div>
    );
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <Spinner />

      {message && (
        <p className="mt-6 text-gray-400 text-xs tracking-[0.3em] uppercase">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-xl z-[200] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}