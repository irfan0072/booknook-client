'use client';

import React from 'react';

export default function LoadingSpinner({ text = 'Loading BookNook data...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-16 px-4">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-teal-600 dark:border-t-teal-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-teal-500/20 animate-pulse"></div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
