'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth, API_URL } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Calendar, 
  Tag, 
  Layers, 
  Mail, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import BorrowModal from '@/components/BorrowModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  // Fetch book details
  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/books/${id}`);
      if (!res.ok) {
        throw new Error('Book not found');
      }
      const data = await res.json();
      setBook(data);
      document.title = `BookNook | ${data.title}`;
    } catch (err) {
      console.error(err);
      toast.error('Could not load book information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const handleBorrowClick = () => {
    if (!user) {
      toast('Please login to borrow this book.', { icon: '🔒' });
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsBorrowModalOpen(true);
  };

  if (loading || authLoading) {
    return <LoadingSpinner text="Retrieving book details..." />;
  }

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          Book not found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested book ID does not match any items in our library database.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Books
        </Link>
      </div>
    );
  }

  const isAvailable = (book.availableCopies ?? 1) > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Cover Image */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-sm">
                <Tag className="w-3.5 h-3.5" />
                {book.category}
              </span>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Title & Author */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Library Book Specimen
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {book.title}
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium mt-1">
                Written by <span className="font-semibold text-slate-900 dark:text-white">{book.author}</span>
              </p>
            </div>

            {/* Inventory Status Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold ${
                  isAvailable
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Available ({book.availableCopies} left)
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Not Available (0 copies)
                  </>
                )}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Layers className="w-4 h-4 text-slate-400" />
                Total Copies: {book.totalCopies || 1}
              </span>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                Overview & Summary
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {book.description || 'No description provided for this book.'}
              </p>
            </div>

            {/* Added By Metadata Box */}
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Book Contributor Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Added by: <strong>{book.userName || 'Library Admin'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="truncate">{book.userEmail || 'admin@booknook.com'}</span>
                </div>
                {book.createdAt && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 sm:col-span-2">
                    <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Added on: {new Date(book.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button: Borrow This Book */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-4">
            <button
              onClick={handleBorrowClick}
              disabled={!isAvailable}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-base font-bold shadow-lg transition-all ${
                isAvailable
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30 active:scale-95'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              {isAvailable ? 'Borrow This Book' : 'Not Available'}
            </button>

            {!isAvailable && (
              <span className="text-xs text-rose-500 font-medium">
                Check back once other readers return their copies.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        book={book}
        onBorrowSuccess={fetchBookDetails}
      />
    </div>
  );
}
