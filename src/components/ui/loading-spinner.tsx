'use client';

import { useEffect, useState } from 'react';

export function LoadingSpinner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-700 animate-spin" />
          {/* Middle rotating circle (slower) */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-r-sky-500 animate-spin" style={{ animationDirection: 'reverse' }} />
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-sky-700/20 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
