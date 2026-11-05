'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, API_URL } from '@/context/AuthContext';
import { 
  PlusCircle, 
  BookOpen, 
  User, 
  Mail, 
  Image as ImageIcon, 
  Layers, 
  Sparkles,
  Upload,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AddBookPage() {
  const { user, loading: authLoading, authFetch } = useAuth();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    image: '',
    description: '',
    totalCopies: 3,
  });

  useEffect(() => {
    document.title = 'BookNook | Add New Book';
  }, []);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      toast('Please log in to add a new book.', { icon: '🔒' });
      router.push(`/login?redirect=${encodeURIComponent('/add-book')}`);
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <LoadingSpinner text="Checking authentication status..." />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalCopies' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim() || !formData.image.trim()) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await authFetch('/books', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          userName: user.name,
          userEmail: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to publish book.');
      }

      toast.success('Book published successfully to BookNook!');
      router.push('/books');
    } catch (err) {
      toast.error(err.message || 'Could not add book. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
          <Sparkles className="w-3.5 h-3.5" />
          Community Contribution
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Add a New Book
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Share high quality literature or textbooks with our community. Fill out the details below.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Book Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Brave New World"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Author Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                placeholder="e.g. Aldous Huxley"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Total Copies (Challenge Requirement) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Total Copies in Stock <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Layers className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="totalCopies"
                  required
                  min="1"
                  max="100"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Book Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Book Cover Image URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                name="image"
                required
                placeholder="https://images.unsplash.com/... or imgbb direct link"
                value={formData.image}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Paste an image link from imgbb, postimage, or Unsplash.
            </p>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Short Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="Provide a compelling synopsis or outline of the book..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Read-only User Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Contributor Name (Read-Only)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={user?.name || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Contributor Email (Read-Only)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 shadow-lg shadow-teal-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Add Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
