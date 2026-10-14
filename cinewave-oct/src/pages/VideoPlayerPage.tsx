import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Plus,
  Play,
  Film,
} from 'lucide-react';
import { Movie, AppView } from '../types/movie';

interface VideoPlayerPageProps {
  movie?: Movie;
  allMovies: Movie[];
  watchlistIds: string[];
  savedProgressSeconds: number;
  onSaveProgress: (movieId: string, seconds: number) => void;
  onNavigate: (view: AppView) => void;
  onSelectMovie: (movieId: string) => void;
  onPlayMovie: (movieId: string) => void;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({
  movie,
  allMovies,
  watchlistIds,
  savedProgressSeconds,
  onSaveProgress,
  onNavigate,
  onSelectMovie,
  onPlayMovie,
  onToggleWatchlist,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [hasAppliedResume, setHasAppliedResume] = useState(false);

  const isUrlObviouslyInvalid = (url?: string): boolean => {
    if (!url || !url.trim()) return true;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol !== 'http:' && parsed.protocol !== 'https:';
    } catch {
      return true;
    }
  };

  useEffect(() => {
    setPlaybackError(null);
    setHasAppliedResume(false);
    if (!movie) return;

    if (isUrlObviouslyInvalid(movie.videoUrl)) {
      setPlaybackError(
        'The video URL for this movie is missing or malformed. Please update the Video URL in Catalog Admin with a valid HTTPS MP4/WebM stream.'
      );
    }
  }, [movie?.id, movie?.videoUrl]);

  if (!movie) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Film className="w-12 h-12 text-[#e50914] mx-auto" />
        <h1 className="text-2xl font-bold text-[#f4f4f6] font-display">Stream Not Found</h1>
        <p className="text-sm text-[#9a9aa6]">
          We could not locate the selected movie in your catalog.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#e50914] text-white text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isInWatchlist = watchlistIds.includes(movie.id);
  const upNextMovies = allMovies.filter((m) => m.id !== movie.id).slice(0, 4);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && savedProgressSeconds > 5 && !hasAppliedResume) {
      const duration = videoRef.current.duration || 0;
      if (duration > savedProgressSeconds + 5) {
        videoRef.current.currentTime = savedProgressSeconds;
      }
      setHasAppliedResume(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onSaveProgress(movie.id, videoRef.current.currentTime);
    }
  };

  const handleRetryStream = () => {
    setPlaybackError(null);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        setPlaybackError(
          'Unable to load or decode the video stream from the configured URL. Verify that the file exists and permits cross-origin playback.'
        );
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Player Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onSelectMovie(movie.id)}
          className="min-h-[42px] inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#9a9aa6] hover:text-[#f4f4f6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {movie.title} Details</span>
        </button>

        {/* Playback Rate Controls */}
        <div className="flex items-center gap-1.5 bg-[#131317] border border-white/[0.08] rounded-xl p-1">
          <span className="text-[11px] text-[#9a9aa6] px-2 font-mono">Speed</span>
          {[0.75, 1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleSpeedChange(rate)}
              className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-mono tabular-nums transition-colors ${
                playbackSpeed === rate
                  ? 'bg-[#e50914] text-white font-semibold'
                  : 'text-[#9a9aa6] hover:text-[#f4f4f6]'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Theater Frame (16:9 Widescreen) */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/[0.12] shadow-2xl">
        {!playbackError ? (
          <video
            ref={videoRef}
            key={movie.videoUrl}
            src={movie.videoUrl}
            poster={movie.backdropUrl || movie.posterUrl}
            controls
            playsInline
            autoPlay
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onError={() =>
              setPlaybackError(
                'This video stream failed to load or is unreachable. Check that the Video URL points to a valid, publicly accessible MP4/WebM stream or signed Cloudflare R2 object.'
              )
            }
            className="w-full h-full object-contain bg-black"
          >
            Your browser does not support HTML5 video playback.
          </video>
        ) : (
          /* Helpful Error Message Panel (Never shows a broken player) */
          <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-gradient-to-b from-[#161013] to-[#0a0a0c]">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#f4f4f6] font-display max-w-md">
              Stream Unavailable or Invalid Video URL
            </h2>

            <p className="text-xs sm:text-sm text-[#9a9aa6] max-w-lg mt-2 leading-relaxed">
              {playbackError}
            </p>

            <div className="mt-3 px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] max-w-md w-full truncate font-mono text-[11px] text-[#9a9aa6]">
              Configured URL: {movie.videoUrl || '(Empty URL)'}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {!isUrlObviouslyInvalid(movie.videoUrl) && (
                <button
                  type="button"
                  onClick={handleRetryStream}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-[#1c1c22] hover:bg-[#25252d] text-xs font-semibold text-[#f4f4f6] border border-white/[0.12] flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Stream</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate({ page: 'admin' })}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-xs font-semibold text-white flex items-center gap-2 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Fix Video URL in Admin</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Below-the-Player Metadata & Controls */}
      <div className="bg-[#131317] border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#9a9aa6] tabular-nums">
            <span className="text-[#e50914] font-semibold">Now Playing</span>
            <span aria-hidden="true">·</span>
            <span>{movie.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{movie.releaseYear}</span>
            {movie.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{movie.duration}</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f4f4f6] font-display">
            {movie.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#9a9aa6] leading-relaxed">{movie.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => onToggleWatchlist(movie.id, e)}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${
              isInWatchlist
                ? 'bg-[#1a1a20] text-[#f4f4f6] border-[#e50914]'
                : 'bg-[#0a0a0c] text-[#f4f4f6] border-white/15 hover:border-white/35'
            }`}
          >
            {isInWatchlist ? (
              <>
                <Check className="w-4 h-4 text-[#e50914]" />
                <span>In My List</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to My List</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Up Next Queue */}
      {upNextMovies.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-[#f4f4f6] font-display">Up Next on CineWave</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upNextMovies.map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayMovie(item.id)}
                className="group p-3.5 rounded-xl bg-[#131317] border border-white/[0.08] hover:border-white/[0.22] flex items-center gap-3.5 cursor-pointer transition-colors"
              >
                <div className="w-14 h-20 rounded-lg bg-[#1a1a20] overflow-hidden shrink-0 relative">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#f4f4f6] truncate font-display group-hover:text-[#e50914] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#9a9aa6] mt-0.5 tabular-nums">
                    {item.genre} · {item.releaseYear}
                  </p>
                  {item.duration && (
                    <span className="text-[11px] font-mono text-[#9a9aa6] block mt-1">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
