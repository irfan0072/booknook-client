'use client';

import React from 'react';
import Link from 'next/link';
import { Home, BookX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 shadow-inner">
        <BookX className="w-10 h-10" />
      </div>
      <span className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
        Error 404
      </span>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="max-w-md text-slate-600 dark:text-slate-400 text-sm md:text-base mb-8 leading-relaxed">
        The book chapter or page you are looking for does not exist in our library catalog. It might have been relocated or removed.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/30 transition active:scale-95"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}
