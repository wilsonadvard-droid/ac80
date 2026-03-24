/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ChevronRight, Menu, X, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NOVEL_CONTENT } from './content';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentChapter = currentChapterIndex !== null ? NOVEL_CONTENT.chapters[currentChapterIndex] : null;

  const navigateToChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center",
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}>
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setCurrentChapterIndex(null)}
        >
          <Book className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
          <span className="font-serif italic text-xl tracking-tight">The Whispering Void</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0f0f0f] z-[70] p-8 border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="font-serif italic text-2xl">Chapters</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {NOVEL_CONTENT.chapters.map((chapter, idx) => (
                  <button
                    key={chapter.id}
                    onClick={() => navigateToChapter(idx)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg transition-all flex items-center justify-between group",
                      currentChapterIndex === idx ? "bg-yellow-500/10 border border-yellow-500/30" : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Chapter {idx + 1}</p>
                      <p className={cn("font-serif text-lg", currentChapterIndex === idx ? "text-yellow-500" : "")}>
                        {chapter.title}
                      </p>
                    </div>
                    <ChevronRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-1", currentChapterIndex === idx ? "text-yellow-500" : "opacity-30")} />
                  </button>
                ))}
              </div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="p-6 glass rounded-2xl">
                  <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Author</p>
                  <p className="font-serif italic text-lg mb-4">{NOVEL_CONTENT.author}</p>
                  <p className="text-sm opacity-70 leading-relaxed">
                    Exploring the intersection of silence and sound in the deep reaches of space.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentChapterIndex === null ? (
            /* Hero / Landing Page */
            <motion.section 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-6 max-w-6xl mx-auto py-20 lg:py-32"
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block px-3 py-1 rounded-full border border-yellow-500/30 text-yellow-500 text-xs uppercase tracking-[0.2em] mb-4">
                      A Short Novel
                    </span>
                    <h1 className="text-6xl lg:text-8xl font-serif italic leading-[0.9] mb-6">
                      {NOVEL_CONTENT.title}
                    </h1>
                    <p className="text-xl opacity-70 max-w-md leading-relaxed">
                      {NOVEL_CONTENT.synopsis}
                    </p>
                  </motion.div>

                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => navigateToChapter(0)}
                      className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      Start Reading <ChevronRight className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 glass rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
                      <Share2 className="w-5 h-5" /> Share
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/10 border border-white/10">
                  <img 
                    src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000" 
                    alt="Space Void"
                    className="object-cover w-full h-full opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="font-mono text-xs opacity-50 mb-2">PROJECT: VOID-09</p>
                    <p className="font-serif italic text-2xl">"The silence is louder than the scream."</p>
                  </div>
                </div>
              </div>

              {/* Chapter Preview Grid */}
              <div className="mt-32">
                <h3 className="font-serif italic text-3xl mb-12">Table of Contents</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {NOVEL_CONTENT.chapters.map((chapter, idx) => (
                    <motion.div 
                      key={chapter.id}
                      whileHover={{ y: -10 }}
                      onClick={() => navigateToChapter(idx)}
                      className="p-8 glass rounded-3xl cursor-pointer group border border-white/5 hover:border-yellow-500/30 transition-all"
                    >
                      <span className="font-mono text-xs opacity-40 mb-4 block">0{idx + 1}</span>
                      <h4 className="font-serif text-2xl mb-4 group-hover:text-yellow-500 transition-colors">{chapter.title}</h4>
                      <p className="text-sm opacity-60 line-clamp-3 leading-relaxed">
                        {chapter.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          ) : (
            /* Reading View */
            <motion.article 
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-6 py-20"
            >
              <div className="flex items-center justify-between mb-16">
                <button 
                  onClick={() => setCurrentChapterIndex(null)}
                  className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </button>
                <div className="flex items-center gap-4">
                  <button className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <header className="mb-20 text-center">
                <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-40 mb-4 block">
                  Chapter {currentChapterIndex + 1}
                </span>
                <h1 className="text-5xl lg:text-7xl font-serif italic mb-6 leading-tight">
                  {currentChapter?.title}
                </h1>
                <div className="w-12 h-1 bg-yellow-500 mx-auto rounded-full" />
              </header>

              <div className="novel-text prose prose-invert prose-yellow max-w-none">
                <ReactMarkdown>{currentChapter?.content || ""}</ReactMarkdown>
              </div>

              <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  {currentChapterIndex > 0 && (
                    <button 
                      onClick={() => navigateToChapter(currentChapterIndex - 1)}
                      className="px-6 py-3 glass rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="font-serif italic text-lg">{NOVEL_CONTENT.title}</p>
                  <p className="text-xs opacity-40 uppercase tracking-widest mt-1">By {NOVEL_CONTENT.author}</p>
                </div>

                <div className="flex items-center gap-4">
                  {currentChapterIndex < NOVEL_CONTENT.chapters.length - 1 ? (
                    <button 
                      onClick={() => navigateToChapter(currentChapterIndex + 1)}
                      className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition-all flex items-center gap-2"
                    >
                      Next Chapter <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentChapterIndex(null)}
                      className="px-6 py-3 glass rounded-full hover:bg-white/10 transition-all"
                    >
                      End of Story
                    </button>
                  )}
                </div>
              </footer>
            </motion.article>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-sm">
          <p>© 2026 {NOVEL_CONTENT.author}. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Newsletter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
