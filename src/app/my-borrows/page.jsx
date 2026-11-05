'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  BookMarked, 
  RotateCcw, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';
import toast from 'react-hot-toast';

export default function MyBorrowsPage() {
  const { user, loading: authLoading, authFetch } = useAuth();
  const router = useRouter();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningBorrow, setReturningBorrow] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | My Borrowed Books';
  }, []);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      toast('Please log in to view your borrowed books.', { icon: '🔒' });
      router.push(`/login?redirect=${encodeURIComponent('/my-borrows')}`);
    }
  }, [user, authLoading, router]);

  const fetchBorrows = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await authFetch('/borrows');
      if (res.ok) {
        const data = await res.json();
        setBorrows(data);
      }
    } catch (err) {
      console.error('Error fetching borrows:', err);
      toast.error('Failed to retrieve your borrowed books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBorrows();
    }
  }, [user]);

  // Handle return book
  const handleReturnConfirm = async () => {
    if (!returningBorrow) return;
    try {
      setIsReturning(true);
      const res = await authFetch(`/borrows/${returningBorrow._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to return book.');
      }

      toast.success('Book returned successfully! Thank you for passing it forward.');
      setBorrows((prev) => prev.filter((b) => b._id !== returningBorrow._id));
      setReturningBorrow(null);
    } catch (err) {
      toast.error(err.message || 'Failed to process book return.');
    } finally {
      setIsReturning(false);
    }
  };

  if (authLoading || (!user && loading)) {
    return <LoadingSpinner text="Authenticating user session..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs tracking-wider uppercase">
            <BookMarked className="w-4 h-4" />
            <span>Active Loans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            My Borrowed Books
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track reading deadlines and return borrowed books when finished.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/30 transition self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          Borrow More Books
        </Link>
      </div>

      {/* Borrows Content */}
      {loading ? (
        <LoadingSpinner text="Fetching your borrowed book loans..." />
      ) : borrows.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <BookMarked className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No active borrowed books
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You currently have no active book loans. Explore our catalog and borrow a title today.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition"
          >
            Browse Library Books
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Table displaying: Image, Title, Borrow Date, Return Date, and Return Book button */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Borrow Date</th>
                  <th className="py-4 px-6">Due Return Date</th>
                  <th className="py-4 px-6">Loan Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                {borrows.map((borrow) => {
                  const isOverdue =
                    borrow.returnDate &&
                    new Date(borrow.returnDate) < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <tr
                      key={borrow._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition"
                    >
                      {/* Image & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white truncate block">
                              {borrow.bookTitle}
                            </span>
                            <span className="text-xs text-slate-400">
                              Loan ID: {borrow._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{borrow.borrowDate || 'Recent'}</span>
                        </div>
                      </td>

                      {/* Return Date */}
                      <td className="py-4 px-6 text-xs whitespace-nowrap">
                        <div
                          className={`flex items-center gap-1.5 font-medium ${
                            isOverdue
                              ? 'text-rose-600 dark:text-rose-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{borrow.returnDate || '14 Days'}</span>
                          {isOverdue && (
                            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-100 dark:bg-rose-950/80 text-rose-600">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Borrowed (Active)
                        </span>
                      </td>

                      {/* Return Book button */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => setReturningBorrow(borrow)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 shadow-sm shadow-teal-600/30 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Return Book
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(returningBorrow)}
        title="Return Borrowed Book"
        message={`Are you ready to return "${returningBorrow?.bookTitle}"? The copy will be restored to the public library catalog for other readers.`}
        confirmText="Confirm Return"
        cancelText="Keep Reading"
        isDeleting={isReturning}
        onConfirm={handleReturnConfirm}
        onCancel={() => setReturningBorrow(null)}
      />
    </div>
  );
}
