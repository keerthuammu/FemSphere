import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto shadow-sm min-h-screen bg-white dark:bg-slate-900 border-x border-slate-200/80 dark:border-slate-800 relative pb-20">
        {children}
      </div>
    </div>
  );
}
