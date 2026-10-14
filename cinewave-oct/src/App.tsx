/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Movie, MovieFormInput } from './types/movie';
import { movieService } from './services/movieStorageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { GenresPage } from './pages/GenresPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { VideoPlayerPage } from './pages/VideoPlayerPage';
import { AdminPage } from './pages/AdminPage';
import { DeploymentGuidePage } from './pages/DeploymentGuidePage';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(() => movieService.getMovies());
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() =>
    movieService.getWatchlistIds()
  );
  const [currentView, setCurrentView] = useState<AppView>({ page: 'home' });

  // Scroll to top smoothly when switching views
  const handleNavigate = useCallback((view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectMovie = useCallback(
    (movieId: string) => {
      handleNavigate({ page: 'details', movieId });
    },
    [handleNavigate]
  );

  const handlePlayMovie = useCallback(
    (movieId: string) => {
      handleNavigate({ page: 'player', movieId });
    },
    [handleNavigate]
  );

  const handleToggleWatchlist = useCallback(
    (movieId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const result = movieService.toggleWatchlist(movieId);
      setWatchlistIds(result.ids);
    },
    []
  );

  const handleAddMovie = useCallback((input: MovieFormInput): Movie => {
    const created = movieService.addMovie(input);
    setMovies(movieService.getMovies());
    return created;
  }, []);

  const handleUpdateMovie = useCallback(
    (id: string, input: MovieFormInput): Movie => {
      const updated = movieService.updateMovie(id, input);
      setMovies(movieService.getMovies());
      return updated;
    },
    []
  );

  const handleDeleteMovie = useCallback((id: string): void => {
    movieService.deleteMovie(id);
    setMovies(movieService.getMovies());
  }, []);

  const handleResetCatalog = useCallback((): void => {
    const restored = movieService.resetCatalogToDefaults();
    setMovies(restored);
  }, []);

  const handleSaveProgress = useCallback((movieId: string, seconds: number) => {
    movieService.savePlaybackProgress(movieId, seconds);
  }, []);

  // Sync across tabs if localStorage is updated
  useEffect(() => {
    const onStorage = () => {
      setMovies(movieService.getMovies());
      setWatchlistIds(movieService.getWatchlistIds());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const renderActivePage = () => {
    switch (currentView.page) {
      case 'home':
        return (
          <HomePage
            movies={movies}
            watchlistIds={watchlistIds}
            onNavigate={handleNavigate}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      case 'movies':
        return (
          <MoviesPage
            movies={movies}
            watchlistIds={watchlistIds}
            initialGenre={currentView.initialGenre}
            initialQuery={currentView.initialQuery}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      case 'genres':
        return (
          <GenresPage
            movies={movies}
            watchlistIds={watchlistIds}
            initialSelectedGenre={currentView.selectedGenre}
            onNavigate={handleNavigate}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      case 'watchlist':
        return (
          <WatchlistPage
            movies={movies}
            watchlistIds={watchlistIds}
            onNavigate={handleNavigate}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      case 'details': {
        const movie = movies.find((m) => m.id === currentView.movieId);
        const savedProgress = movie
          ? movieService.getPlaybackProgress(movie.id)
          : 0;
        return (
          <MovieDetailsPage
            movie={movie}
            allMovies={movies}
            watchlistIds={watchlistIds}
            savedProgressSeconds={savedProgress}
            onNavigate={handleNavigate}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      }
      case 'player': {
        const movie = movies.find((m) => m.id === currentView.movieId);
        const savedProgress = movie
          ? movieService.getPlaybackProgress(movie.id)
          : 0;
        return (
          <VideoPlayerPage
            movie={movie}
            allMovies={movies}
            watchlistIds={watchlistIds}
            savedProgressSeconds={savedProgress}
            onSaveProgress={handleSaveProgress}
            onNavigate={handleNavigate}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      }
      case 'admin':
        return (
          <AdminPage
            movies={movies}
            onAddMovie={handleAddMovie}
            onUpdateMovie={handleUpdateMovie}
            onDeleteMovie={handleDeleteMovie}
            onResetCatalog={handleResetCatalog}
            onPlayMovie={handlePlayMovie}
            onSelectMovie={handleSelectMovie}
            onNavigate={handleNavigate}
          />
        );
      case 'deploy-guide':
        return <DeploymentGuidePage onNavigate={handleNavigate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-[#f4f4f6]">
      <Navbar
        currentView={currentView}
        watchlistCount={watchlistIds.length}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">{renderActivePage()}</main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
