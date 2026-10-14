import React from 'react';
import { AppView } from '../types/movie';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0a0a0c] border-t border-white/[0.08] mt-16 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand & Demo Storage Transparency */}
          <div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'home' })}
              className="text-xl font-bold tracking-tight text-[#f4f4f6] font-display"
            >
              Cine<span className="text-[#e50914]">Wave</span>
            </button>
            <p className="text-xs text-[#9a9aa6] mt-2.5 leading-relaxed max-w-sm">
              Independent dark-cinema streaming platform demo. Catalog metadata and My List
              selections are persisted in your current browser’s <code className="text-[#f4f4f6] font-mono">localStorage</code> and
              are not shared across external devices until connected to Cloudflare D1 &amp; R2.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col gap-2 text-xs text-[#9a9aa6]">
            <span className="text-[#f4f4f6] font-semibold mb-1">Navigation</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'home' })}
                className="hover:text-[#f4f4f6] transition-colors text-left"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'movies' })}
                className="hover:text-[#f4f4f6] transition-colors text-left"
              >
                Browse Movies
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'genres' })}
                className="hover:text-[#f4f4f6] transition-colors text-left"
              >
                Genres
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'watchlist' })}
                className="hover:text-[#f4f4f6] transition-colors text-left"
              >
                My List
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'admin' })}
                className="hover:text-[#f4f4f6] transition-colors text-left"
              >
                Catalog Admin
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'deploy-guide' })}
                className="hover:text-[#f4f4f6] transition-colors text-left"
              >
                Android &amp; Cloudflare Pages Guide
              </button>
            </div>
          </div>

          {/* Licensing & Storage Readiness */}
          <div className="text-xs text-[#9a9aa6] leading-relaxed">
            <span className="text-[#f4f4f6] font-semibold block mb-1">
              Open Media &amp; Cloud Readiness
            </span>
            <p>
              All sample streams use Creative Commons (Blender Foundation Open Movie Projects) or
              public-domain test streams. Built for zero-key frontend deployment on Cloudflare Pages.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9a9aa6]">
          <span>© {new Date().getFullYear()} CineWave Streaming Demo. No API keys or secrets in client bundle.</span>
          <span className="font-mono text-[11px]">Storage Mode: Local Browser Demo (Cloudflare D1/R2 Adapter Ready)</span>
        </div>
      </div>
    </footer>
  );
};
