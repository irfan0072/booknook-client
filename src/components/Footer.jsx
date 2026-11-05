'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Facebook,
  Heart
} from 'lucide-react';

// New X (formerly Twitter) SVG Icon component
function XLogo({ className = "w-5 h-5" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                BookNook
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              BookNook is a community-driven digital library designed to make reading accessible, seamless, and joyful for everyone. Add a book, borrow a book, and return a book effortlessly.
            </p>
            {/* Social Links with new X logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="X (formerly Twitter)"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wider uppercase">
              Explore Library
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-teal-400 transition">
                  All Books Catalog
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="hover:text-teal-400 transition">
                  Contribute & Add Book
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="hover:text-teal-400 transition">
                  Active Borrowed Books
                </Link>
              </li>
              <li>
                <Link href="/my-books" className="hover:text-teal-400 transition">
                  My Library Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wider uppercase">
              Popular Genres
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/books?category=Fiction" className="hover:text-teal-400 transition">
                  Fiction & Literature
                </Link>
              </li>
              <li>
                <Link href="/books?category=Science" className="hover:text-teal-400 transition">
                  Science & Technology
                </Link>
              </li>
              <li>
                <Link href="/books?category=History" className="hover:text-teal-400 transition">
                  History & Biography
                </Link>
              </li>
              <li>
                <Link href="/books?category=Kids" className="hover:text-teal-400 transition">
                  Children & Young Readers
                </Link>
              </li>
              <li>
                <Link href="/books?category=Others" className="hover:text-teal-400 transition">
                  Self-Help & Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wider uppercase">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>124 University Avenue, Library Plaza, Suite 400</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <a href="mailto:support@booknook.com" className="hover:text-teal-400 transition">
                  support@booknook.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <span>+1 (800) 555-NOOK (6665)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BookNook Library System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for passionate book lovers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
