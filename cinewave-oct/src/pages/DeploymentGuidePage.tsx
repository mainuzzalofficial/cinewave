import React, { useState } from 'react';
import {
  Smartphone,
  Cloud,
  ShieldAlert,
  Copy,
  Check,
  ArrowLeft,
  Server,
  Database,
} from 'lucide-react';
import { AppView } from '../types/movie';
import { CLOUDFLARE_ARCHITECTURE_BLUEPRINT } from '../services/movieStorageService';

interface DeploymentGuidePageProps {
  onNavigate: (view: AppView) => void;
}

export const DeploymentGuidePage: React.FC<DeploymentGuidePageProps> = ({ onNavigate }) => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-white/[0.08] pb-6">
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className="min-h-[40px] inline-flex items-center gap-2 text-xs font-semibold text-[#9a9aa6] hover:text-[#f4f4f6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#f4f4f6] font-display tracking-tight">
          Android Preview &amp; Cloudflare Pages Deployment Guide
        </h1>
        <p className="text-xs sm:text-sm text-[#9a9aa6] max-w-3xl leading-relaxed">
          Step-by-step instructions for testing CineWave on Android phones and deploying the
          production build to Cloudflare Pages with future Cloudflare D1, R2, and Workers storage.
        </p>
      </div>

      {/* Section 1: Android Phone Preview & Mobile Workflow */}
      <section className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-[#f4f4f6] font-display font-bold text-lg">
          <Smartphone className="w-5 h-5 text-[#e50914]" />
          <h2>1. Previewing CineWave on an Android Phone</h2>
        </div>

        <p className="text-xs sm:text-sm text-[#d4d4dc] leading-relaxed">
          CineWave is designed mobile-first with a fixed bottom thumb-zone navigation bar,
          44×44px minimum touch targets, and inline HTML5 video playback (<code className="font-mono text-white">playsInline</code>) optimized for Android Chrome.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/[0.08] space-y-1.5">
            <span className="text-xs font-mono text-[#e50914] font-semibold">Option A · Cloud URL</span>
            <h3 className="text-sm font-bold text-[#f4f4f6] font-display">
              Open Hosted Preview Link
            </h3>
            <p className="text-xs text-[#9a9aa6] leading-relaxed">
              Open the hosted preview URL directly in <strong>Chrome on Android</strong>. Tap the
              three-dot browser menu and select <strong>Add to Home screen</strong> for a full-screen
              app experience.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/[0.08] space-y-1.5">
            <span className="text-xs font-mono text-[#e50914] font-semibold">Option B · Local Wi-Fi</span>
            <h3 className="text-sm font-bold text-[#f4f4f6] font-display">
              Run Vite with --host
            </h3>
            <p className="text-xs text-[#9a9aa6] leading-relaxed">
              On your development machine, run <code className="font-mono text-white">npm run dev -- --host</code>.
              Connect your Android phone to the same Wi-Fi network and visit the displayed
              <code className="font-mono text-white"> http://192.168.x.x:3000</code> address.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/[0.08] space-y-1.5">
            <span className="text-xs font-mono text-[#e50914] font-semibold">Option C · Termux / Cloud</span>
            <h3 className="text-sm font-bold text-[#f4f4f6] font-display">
              Deploy Directly from Android
            </h3>
            <p className="text-xs text-[#9a9aa6] leading-relaxed">
              Push this repository to GitHub from your Android browser or Git client, then connect
              the repo in the mobile-friendly Cloudflare Dashboard—Cloudflare builds the site in the
              cloud.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Deploying to Cloudflare Pages */}
      <section className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-[#f4f4f6] font-display font-bold text-lg">
          <Cloud className="w-5 h-5 text-[#e50914]" />
          <h2>2. Deploying to Cloudflare Pages (Zero Paid APIs Required)</h2>
        </div>

        <p className="text-xs sm:text-sm text-[#d4d4dc] leading-relaxed">
          The initial demo compiles into a clean static bundle in <code className="font-mono text-white">dist/</code> with
          zero secret keys required. You can deploy via Git integration or Wrangler CLI:
        </p>

        <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#f4f4f6]">
              Cloudflare Pages Build Settings
            </span>
            <button
              type="button"
              onClick={() =>
                copyText(
                  'cf-build',
                  'npm install && npm run build\nBuild output directory: dist'
                )
              }
              className="text-xs text-[#9a9aa6] hover:text-white flex items-center gap-1"
            >
              {copiedBlock === 'cf-build' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs font-mono text-[#d4d4dc] overflow-x-auto leading-relaxed">
{`Framework preset:       Vite
Build command:          npm run build
Build output directory: dist
Node.js version:        20.x (or higher)
Environment variables:  None required for initial demo`}
          </pre>
        </div>
      </section>

      {/* Section 3: Future Storage Integration (Cloudflare D1 + R2 + Workers) */}
      <section className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 text-[#f4f4f6] font-display font-bold text-lg">
          <Server className="w-5 h-5 text-[#e50914]" />
          <h2>3. Future Storage Upgrade: Cloudflare R2 + D1 + Workers API</h2>
        </div>

        <p className="text-xs sm:text-sm text-[#d4d4dc] leading-relaxed">
          CineWave isolates all data operations inside <code className="font-mono text-white">src/services/movieStorageService.ts</code> (<code className="font-mono text-white">IMovieStorageService</code>).
          When you are ready to move from browser <code className="font-mono text-white">localStorage</code> to shared cloud
          storage:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f4f4f6]">
              <Database className="w-4 h-4 text-[#e50914]" />
              <span>Cloudflare D1 (Metadata SQLite)</span>
            </div>
            <pre className="text-[11px] font-mono text-[#9a9aa6] overflow-x-auto">
              {CLOUDFLARE_ARCHITECTURE_BLUEPRINT.d1SchemaSql}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f4f4f6]">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Private R2 Security Rules</span>
            </div>
            <ul className="text-xs text-[#9a9aa6] space-y-1.5 leading-relaxed list-disc list-inside">
              <li>Never place R2 Access Keys or Secret Keys in React code or <code className="font-mono">VITE_*</code> variables.</li>
              <li>Bind your R2 bucket (<code className="font-mono">MEDIA_BUCKET</code>) and D1 database (<code className="font-mono">DB</code>) to Cloudflare Pages Functions / Workers.</li>
              <li>Serve video bytes via HTTP 206 Range responses or short-lived presigned URLs generated by the Worker.</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#f4f4f6]">
              Reference Cloudflare Pages Function (functions/api/stream/[id].ts)
            </span>
            <button
              type="button"
              onClick={() =>
                copyText(
                  'worker-code',
                  CLOUDFLARE_ARCHITECTURE_BLUEPRINT.workerSignedStreamExample
                )
              }
              className="text-xs text-[#9a9aa6] hover:text-white flex items-center gap-1"
            >
              {copiedBlock === 'worker-code' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] font-mono text-[#d4d4dc] overflow-x-auto leading-relaxed">
            {CLOUDFLARE_ARCHITECTURE_BLUEPRINT.workerSignedStreamExample}
          </pre>
        </div>
      </section>
    </div>
  );
};
