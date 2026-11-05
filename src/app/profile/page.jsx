'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, API_URL } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Library, 
  BookMarked, 
  LogOut, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfilePage() {
  const { user, loading: authLoading, logout, authFetch } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    myBooksCount: 0,
    myBorrowsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'BookNook | My Profile';
  }, []);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [booksRes, borrowsRes] = await Promise.all([
          authFetch(`/books?email=${encodeURIComponent(user.email)}`),
          authFetch('/borrows'),
        ]);

        let bCount = 0;
        let brCount = 0;

        if (booksRes.ok) {
          const bData = await booksRes.json();
          bCount = bData.length;
        }

        if (borrowsRes.ok) {
          const brData = await borrowsRes.json();
          brCount = brData.length;
        }

        setStats({
          myBooksCount: bCount,
          myBorrowsCount: brCount,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  if (authLoading || !user) {
    return <LoadingSpinner text="Loading profile details..." />;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-700 shadow-lg"
          />

          <div className="text-center sm:text-left space-y-2 flex-grow">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Library Member
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Member since 2024
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 transition border border-rose-200 dark:border-rose-800 self-center sm:self-start"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Member Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Books Added Card */}
        <Link
          href="/my-books"
          className="group p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 shadow-sm hover:shadow-lg transition space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : stats.myBooksCount}
            </span>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mt-1">
              Books Contributed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your published books, edit copies, or remove listings.
            </p>
          </div>
        </Link>

        {/* Books Borrowed Card */}
        <Link
          href="/my-borrows"
          className="group p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 shadow-sm hover:shadow-lg transition space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : stats.myBorrowsCount}
            </span>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mt-1">
              Active Borrowed Books
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track your reading deadlines and return books on time.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
