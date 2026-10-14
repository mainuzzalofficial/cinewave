import React from 'react';
import { Home, Film, Layers, Bookmark, SlidersHorizontal } from 'lucide-react';
import { AppView } from '../types/movie';

interface NavbarProps {
  currentView: AppView;
  watchlistCount: number;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  watchlistCount,
  onNavigate,
}) => {
  const isPageActive = (page: AppView['page']) => {
    if (page === 'movies' && (currentView.page === 'details' || currentView.page === 'player')) {
      return true;
    }
    return currentView.page === page;
  };

  return (
    <>
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 h-14 md:h-16 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark reading CineWave */}
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="text-xl md:text-2xl font-bold tracking-tight text-[#f4f4f6] font-display whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e50914] rounded"
          >
            Cine<span className="text-[#e50914]">Wave</span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => onNavigate({ page: 'home' })}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                isPageActive('home')
                  ? 'text-[#f4f4f6] border-[#e50914]'
                  : 'text-[#9a9aa6] border-transparent hover:text-[#f4f4f6]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'movies' })}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                isPageActive('movies')
                  ? 'text-[#f4f4f6] border-[#e50914]'
                  : 'text-[#9a9aa6] border-transparent hover:text-[#f4f4f6]'
              }`}
            >
              Movies
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'genres' })}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                isPageActive('genres')
                  ? 'text-[#f4f4f6] border-[#e50914]'
                  : 'text-[#9a9aa6] border-transparent hover:text-[#f4f4f6]'
              }`}
            >
              Genres
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'watchlist' })}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                isPageActive('watchlist')
                  ? 'text-[#f4f4f6] border-[#e50914]'
                  : 'text-[#9a9aa6] border-transparent hover:text-[#f4f4f6]'
              }`}
            >
              My List{watchlistCount > 0 ? ` (${watchlistCount})` : ''}
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'deploy-guide' })}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                isPageActive('deploy-guide')
                  ? 'text-[#f4f4f6] border-[#e50914]'
                  : 'text-[#9a9aa6] border-transparent hover:text-[#f4f4f6]'
              }`}
            >
              Cloudflare Guide
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'admin' })}
              className={`min-h-[40px] px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isPageActive('admin')
                  ? 'bg-[#e50914] text-white'
                  : 'bg-[#131317] text-[#f4f4f6] border border-white/[0.12] hover:border-[#e50914] hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Catalog Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Thumb-Zone Navigation for Android / Phones) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#0a0a0c]/95 backdrop-blur-md border-t border-white/[0.08] grid grid-cols-5 items-center px-1"
      >
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            isPageActive('home') ? 'text-[#e50914]' : 'text-[#9a9aa6] hover:text-[#f4f4f6]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
            Home
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate({ page: 'movies' })}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            isPageActive('movies') ? 'text-[#e50914]' : 'text-[#9a9aa6] hover:text-[#f4f4f6]'
          }`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
            Movies
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate({ page: 'genres' })}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            isPageActive('genres') ? 'text-[#e50914]' : 'text-[#9a9aa6] hover:text-[#f4f4f6]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
            Genres
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate({ page: 'watchlist' })}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            isPageActive('watchlist') ? 'text-[#e50914]' : 'text-[#9a9aa6] hover:text-[#f4f4f6]'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap tabular-nums">
            My List{watchlistCount > 0 ? ` (${watchlistCount})` : ''}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate({ page: 'admin' })}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            isPageActive('admin') ? 'text-[#e50914]' : 'text-[#9a9aa6] hover:text-[#f4f4f6]'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
            Admin
          </span>
        </button>
      </nav>
    </>
  );
};
