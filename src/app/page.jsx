'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { 
  ArrowRight, 
  BookOpen, 
  Search, 
  Bookmark, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Users, 
  Star,
  Quote
} from 'lucide-react';
import BookCard from '@/components/BookCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { API_URL } from '@/context/AuthContext';

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'BookNook | Home – A Small Online Library';

    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/books?limit=6&sort=newest`);
        if (res.ok) {
          const data = await res.json();
          setNewArrivals(data);
        }
      } catch (err) {
        console.error('Error fetching new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const bannerSlides = [
    {
      id: 1,
      title: 'Discover Timeless Stories & Knowledge',
      subtitle: 'Dive into our expansive collection of classic literature, modern fiction, and breakthrough scientific works.',
      image: 'https://images.unsplash.com/photo-1507842229451-7f01be7fe7ab?auto=format&fit=crop&w=1600&q=80',
      badge: 'Curated Collection',
    },
    {
      id: 2,
      title: 'Borrow Freely, Read Endlessly',
      subtitle: 'Borrow your next favorite book with one click, enjoy reading at your own pace, and return it effortlessly for others.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
      badge: 'Zero Subscription Fees',
    },
    {
      id: 3,
      title: 'Contribute Books to Your Community',
      subtitle: 'Have books sitting on your shelf? Share them with fellow readers and expand our collective community library today.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80',
      badge: 'Community Driven',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Find Your Next Read',
      description: 'Search through curated categories ranging from classic fiction to cutting-edge science and history.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Borrow with 1-Click',
      description: 'Select your preferred return timeline and borrow instantly. Track all your active loans in one place.',
      icon: Bookmark,
    },
    {
      step: '03',
      title: 'Return & Pass It Forward',
      description: 'Once finished, return the book with a single tap to make copies immediately available to other readers.',
      icon: RotateCcw,
    },
  ];

  const categories = [
    { name: 'Fiction', count: '120+ Titles', color: 'from-purple-500 to-indigo-600', link: '/books?category=Fiction' },
    { name: 'Science', count: '85+ Titles', color: 'from-blue-500 to-cyan-600', link: '/books?category=Science' },
    { name: 'History', count: '64+ Titles', color: 'from-amber-500 to-orange-600', link: '/books?category=History' },
    { name: 'Kids', count: '45+ Titles', color: 'from-emerald-500 to-teal-600', link: '/books?category=Kids' },
    { name: 'Others', count: '90+ Titles', color: 'from-slate-600 to-slate-800', link: '/books?category=Others' },
  ];

  const testimonials = [
    {
      name: 'Sophia Martinez',
      role: 'Literature Student',
      quote: 'BookNook transformed how I research for university. The borrowing system is lightning fast and completely hassle-free!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'David Chen',
      role: 'Software Engineer',
      quote: 'Being able to add books from my private collection and share them with avid readers in the community feels amazing.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'High School Educator',
      quote: 'The kids section has inspired so many of my students to cultivate daily reading habits without expensive bookstore trips.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Banner Slider (Swiper.js with minimum 3 slides) */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          className="h-[520px] sm:h-[600px] w-full"
        >
          {bannerSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full flex items-center">
                {/* Background Image with Dark Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />
                </div>

                {/* Slide Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                  <div className="max-w-2xl space-y-5">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30 backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      {slide.badge}
                    </span>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                      {slide.title}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                      {slide.subtitle}
                    </p>

                    <div className="pt-2">
                      <Link
                        href="/books"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-teal-600 hover:bg-teal-500 active:scale-95 shadow-lg shadow-teal-600/40 transition-all duration-200"
                      >
                        Browse Books
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. New Arrivals (Dynamic - latest 6 books from DB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Fresh Off The Shelves</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              New Arrivals
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Check out the latest additions to our growing digital collection. Borrow instantly before copies run out.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading latest arrivals..." />
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No books found
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Be the first community member to add a book!
            </p>
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700"
            >
              Add a Book Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {/* See All Books Button */}
        <div className="mt-12 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800 transition active:scale-95 shadow-sm"
          >
            See All Books
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Extra Section 1: How Borrowing Works (Step-by-Step) */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 lg:py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Borrowing Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Borrowing reading materials from BookNook is designed to be frictionless, modern, and open for all members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((stepItem, idx) => {
              const Icon = stepItem.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="relative p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-lg transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 dark:text-slate-700">
                      {stepItem.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {stepItem.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stepItem.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Extra Section 2: Explore by Top Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Browse By Genre
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Top Categories
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Find the exact genre matching your mood today.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={cat.link}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center justify-center h-full"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition shadow-md`}>
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {cat.count}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Extra Section 3: Reader Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-teal-900 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-700/30 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Community Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                What Readers Are Saying
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between"
                >
                  <Quote className="w-8 h-8 text-teal-300 mb-4 opacity-70" />
                  <p className="text-sm text-slate-100 leading-relaxed mb-6 italic">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-teal-300"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-teal-200">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
