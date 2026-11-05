'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, API_URL } from '@/context/AuthContext';
import { 
  Library, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Layers, 
  Tag, 
  ExternalLink 
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';
import EditBookModal from '@/components/EditBookModal';
import toast from 'react-hot-toast';

export default function MyBooksPage() {
  const { user, loading: authLoading, authFetch } = useAuth();
  const router = useRouter();

  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | My Added Books';
  }, []);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      toast('Please log in to view your books.', { icon: '🔒' });
      router.push(`/login?redirect=${encodeURIComponent('/my-books')}`);
    }
  }, [user, authLoading, router]);

  const fetchMyBooks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await authFetch(`/books?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setMyBooks(data);
      }
    } catch (err) {
      console.error('Error fetching my books:', err);
      toast.error('Failed to load your books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBooks();
    }
  }, [user]);

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    try {
      setIsDeleting(true);
      const res = await authFetch(`/books/${deletingBook._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete book.');
      }

      toast.success('Book removed successfully from your catalog!');
      setMyBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      setDeletingBook(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete book.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || (!user && loading)) {
    return <LoadingSpinner text="Authenticating user session..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs tracking-wider uppercase">
            <Library className="w-4 h-4" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            My Added Books
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, update, and monitor the books you contributed to BookNook.
          </p>
        </div>

        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/30 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Another Book
        </Link>
      </div>

      {/* Books Content */}
      {loading ? (
        <LoadingSpinner text="Fetching your contributed books..." />
      ) : myBooks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            You haven&apos;t added any books yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Expand our library catalog by sharing books from your personal reading collection.
          </p>
          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Responsive Table for Desktop & Tablet */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Copies</th>
                  <th className="py-4 px-6">Date Added</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                {myBooks.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition"
                  >
                    {/* Book Cover & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/books/${book._id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition truncate block"
                          >
                            {book.title}
                          </Link>
                          <p className="text-xs text-slate-500 truncate">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {book.category}
                      </span>
                    </td>

                    {/* Copies */}
                    <td className="py-4 px-6">
                      <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                        <p>Total: <strong>{book.totalCopies || 1}</strong></p>
                        <p className="text-teal-600 dark:text-teal-400">
                          Available: <strong>{book.availableCopies ?? 1}</strong>
                        </p>
                      </div>
                    </td>

                    {/* Date Added */}
                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                      {book.createdAt
                        ? new Date(book.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recent'}
                    </td>

                    {/* Action Buttons: Edit & Delete */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingBook(book)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition"
                          title="Edit Book Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingBook(book)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <EditBookModal
          isOpen={Boolean(editingBook)}
          onClose={() => setEditingBook(null)}
          book={editingBook}
          onUpdateSuccess={fetchMyBooks}
        />
      )}

      {/* Custom Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={Boolean(deletingBook)}
        title="Delete Book from Library"
        message={`Are you sure you want to permanently delete "${deletingBook?.title}"? All catalog records and availability will be removed.`}
        confirmText="Yes, Delete Book"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingBook(null)}
      />
    </div>
  );
}
