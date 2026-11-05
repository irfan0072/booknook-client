'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, User, Tag, Layers } from 'lucide-react';

const categoryColorMap = {
  Fiction: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Science: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  History: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Kids: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Others: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

export default function BookCard({ book }) {
  const isAvailable = (book.availableCopies ?? 1) > 0;
  const categoryClass = categoryColorMap[book.category] || categoryColorMap.Others;

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-teal-500/50 transition-all duration-300">
      {/* Book Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={book.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${categoryClass}`}>
            <Tag className="w-3 h-3" />
            {book.category}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
              isAvailable
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {isAvailable ? `${book.availableCopies} Available` : 'Not Available'}
          </span>
        </div>
      </div>

      {/* Book Content */}
      <div className="flex flex-col flex-grow p-5 justify-between">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
            {book.title}
          </h3>

          {/* Author */}
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{book.author}</span>
          </div>

          {/* Short Description */}
          {book.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
              {book.description}
            </p>
          )}
        </div>

        {/* Footer with copies & View Details Button */}
        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Copies: {book.totalCopies || 1}</span>
          </div>

          <Link
            href={`/books/${book._id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-sm shadow-teal-600/30"
          >
            <BookOpen className="w-3.5 h-3.5" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
