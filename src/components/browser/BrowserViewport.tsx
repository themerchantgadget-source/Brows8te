import React, { useState, useEffect } from 'react';
import { Search, Globe, Star, GitFork, Play, Pause, ExternalLink, ThumbsUp, MessageSquare, ArrowRight, CornerDownRight, Check, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface BrowserViewportProps {
  url: string;
  onNavigate: (newUrl: string, title?: string) => void;
  onTriggerRipple?: (e: React.MouseEvent) => void;
  themeMode?: 'light' | 'dark';
}

export const BrowserViewport: React.FC<BrowserViewportProps> = ({ url, onNavigate, onTriggerRipple, themeMode = 'light' }) => {
  const isLight = themeMode === 'light';
  const [activeSearchInput, setActiveSearchInput] = useState('');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'news' | 'code'>('all');
  const [upvotedPosts, setUpvotedPosts] = useState<number[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Parse URL & search query
  let domain = 'google.com';
  let query = '';
  let path = '';

  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    domain = parsed.hostname.replace(/^www\./, '');
    query = parsed.searchParams.get('q') || '';
    path = parsed.pathname;
  } catch {
    domain = url;
  }

  useEffect(() => {
    if (query) {
      setActiveSearchInput(query);
    }
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSearchInput.trim()) {
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(activeSearchInput.trim())}`, `${activeSearchInput} - Google Search`);
    }
  };

  const toggleUpvote = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvotedPosts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // 1. Google Homepage & Search Results
  if (domain.includes('google')) {
    const isResultsPage = !!query || url.includes('/search');

    if (!isResultsPage) {
      return (
        <div className={`w-full h-full flex flex-col justify-between p-6 select-none overflow-y-auto ${
          isLight ? 'bg-white text-[#202124]' : 'bg-[#202124] text-[#e8eaed]'
        }`}>
          {/* Header */}
          <div className={`flex justify-between items-center text-xs pt-1 ${
            isLight ? 'text-[#5f6368]' : 'text-[#9aa0a6]'
          }`}>
            <div className="flex gap-4">
              <span className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>About</span>
              <span className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Store</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Gmail</span>
              <span className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Images</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                isLight ? 'bg-[#1a73e8] text-white' : 'bg-[#3c4043] text-[#8ab4f8]'
              }`}>
                B
              </div>
            </div>
          </div>

          {/* Center Search */}
          <div className="flex flex-col items-center max-w-lg mx-auto w-full my-auto py-8">
            {/* Google Logo */}
            <div className="text-4xl sm:text-5xl font-medium tracking-tight mb-7 flex items-center select-none font-sans">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full relative group">
              <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-full border shadow-sm transition-all ${
                isLight
                  ? 'bg-white border-[#dfe1e5] hover:shadow-md focus-within:shadow-md focus-within:border-[#1a73e8]'
                  : 'bg-[#303134] border-[#5f6368]/50 shadow-md hover:bg-[#303134]/90 focus-within:border-[#8ab4f8]'
              }`}>
                <Search className={`w-4 h-4 ${isLight ? 'text-[#9aa0a6]' : 'text-[#9aa0a6]'}`} />
                <input
                  type="text"
                  value={activeSearchInput}
                  onChange={(e) => setActiveSearchInput(e.target.value)}
                  placeholder="Search Google or type a URL"
                  className={`w-full bg-transparent text-sm outline-none ${
                    isLight ? 'text-[#202124] placeholder-[#5f6368]' : 'text-[#e8eaed] placeholder-[#9aa0a6]'
                  }`}
                  autoFocus
                />
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-xs font-medium border transition-colors ${
                    isLight
                      ? 'bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#3c4043] border-[#f8f9fa] hover:border-[#dadce0]'
                      : 'bg-[#303134] hover:bg-[#3c4043] text-[#e8eaed] border-transparent hover:border-[#5f6368]/40'
                  }`}
                >
                  Google Search
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('https://github.com', 'GitHub')}
                  className={`px-4 py-2 rounded-md text-xs font-medium border transition-colors ${
                    isLight
                      ? 'bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#3c4043] border-[#f8f9fa] hover:border-[#dadce0]'
                      : 'bg-[#303134] hover:bg-[#3c4043] text-[#e8eaed] border-transparent hover:border-[#5f6368]/40'
                  }`}
                >
                  I'm Feeling Lucky
                </button>
              </div>
            </form>

            {/* Suggested Shortcuts */}
            <div className="grid grid-cols-4 gap-4 mt-8 w-full max-w-sm">
              {[
                { name: 'GitHub', url: 'https://github.com', icon: '💻' },
                { name: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
                { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: '⚡' },
                { name: 'Wikipedia', url: 'https://en.wikipedia.org', icon: '📖' },
              ].map((s) => (
                <button
                  key={s.name}
                  onClick={() => onNavigate(s.url, s.name)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors group ${
                    isLight ? 'hover:bg-[#f1f3f4]' : 'hover:bg-[#303134]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border ${
                    isLight
                      ? 'bg-[#f1f3f4] group-hover:bg-[#e8eaed] border-black/5'
                      : 'bg-[#303134] group-hover:bg-[#3c4043] border-white/5'
                  }`}>
                    {s.icon}
                  </div>
                  <span className={`text-[11px] truncate max-w-full font-medium ${
                    isLight ? 'text-[#3c4043] group-hover:text-black' : 'text-[#9aa0a6] group-hover:text-[#e8eaed]'
                  }`}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`text-[11px] border-t pt-3 flex justify-between ${
            isLight ? 'text-[#70757a] border-[#dadce0]' : 'text-[#9aa0a6] border-[#3c4043]'
          }`}>
            <span>Region: United Kingdom</span>
            <div className="flex gap-3">
              <span className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Privacy</span>
              <span className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Terms</span>
              <span className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Settings</span>
            </div>
          </div>
        </div>
      );
    }

    // Google Search Results Page
    return (
      <div className={`w-full h-full flex flex-col overflow-y-auto text-left ${
        isLight ? 'bg-white text-[#202124]' : 'bg-[#202124] text-[#e8eaed]'
      }`}>
        {/* Top Sticky Bar */}
        <div className={`sticky top-0 backdrop-blur-md border-b px-4 py-3 z-10 ${
          isLight ? 'bg-white/95 border-[#dadce0]' : 'bg-[#202124]/95 border-[#3c4043]'
        }`}>
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div
              onClick={() => onNavigate('https://www.google.com', 'Google')}
              className="text-lg font-bold text-[#4285F4] cursor-pointer mr-2 select-none"
            >
              G
            </div>
            <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              isLight
                ? 'bg-white border-[#dfe1e5] shadow-sm focus-within:shadow-md'
                : 'bg-[#303134] border-[#5f6368]/40 focus-within:border-[#8ab4f8]'
            }`}>
              <Search className="w-3.5 h-3.5 text-[#9aa0a6]" />
              <input
                type="text"
                value={activeSearchInput}
                onChange={(e) => setActiveSearchInput(e.target.value)}
                className={`w-full bg-transparent text-xs outline-none ${
                  isLight ? 'text-[#202124]' : 'text-[#e8eaed]'
                }`}
              />
            </div>
          </form>

          {/* Search Tabs */}
          <div className="flex gap-4 mt-2 text-[11px] border-b border-transparent">
            {['All', 'News', 'Images', 'Videos', 'Tools'].map((tab, idx) => {
              const isSelected = (activeTab === 'all' && idx === 0) || activeTab === tab.toLowerCase();
              return (
                <span
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as any)}
                  className={`cursor-pointer pb-1 transition-colors ${
                    isSelected
                      ? isLight
                        ? 'text-[#1a73e8] border-b-2 border-[#1a73e8] font-medium'
                        : 'text-[#8ab4f8] border-b-2 border-[#8ab4f8] font-medium'
                      : isLight
                      ? 'text-[#5f6368] hover:text-[#202124]'
                      : 'text-[#9aa0a6] hover:text-[#e8eaed]'
                  }`}
                >
                  {tab}
                </span>
              );
            })}
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 space-y-5 max-w-xl">
          <div className={`text-[11px] ${isLight ? 'text-[#70757a]' : 'text-[#9aa0a6]'}`}>
            About 1,840,000 results (0.34 seconds)
          </div>

          {/* Result 1 */}
          <div className="space-y-1">
            <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-[#202124]' : 'text-[#bdc1c6]'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isLight ? 'bg-[#f1f3f4]' : 'bg-[#303134]'
              }`}>🌐</span>
              <span>github.com &gt; topics &gt; {query || 'tech'}</span>
            </div>
            <h3
              onClick={() => onNavigate('https://github.com', 'GitHub: Open Source')}
              className={`text-base font-medium leading-snug cursor-pointer hover:underline ${
                isLight ? 'text-[#1a0dab]' : 'text-[#8ab4f8]'
              }`}
            >
              Explore {query || 'Top Technology'} Repositories and Libraries · GitHub
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#4d5156]' : 'text-[#bdc1c6]'}`}>
              Discover official repositories, active open source projects, and trending developer tools covering {query || 'the ecosystem'}.
            </p>
          </div>

          {/* Result 2 */}
          <div className="space-y-1">
            <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-[#202124]' : 'text-[#bdc1c6]'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isLight ? 'bg-[#f1f3f4]' : 'bg-[#303134]'
              }`}>📖</span>
              <span>wikipedia.org &gt; wiki &gt; {encodeURIComponent(query || 'Computer_science')}</span>
            </div>
            <h3
              onClick={() => onNavigate('https://en.wikipedia.org', 'Wikipedia')}
              className={`text-base font-medium leading-snug cursor-pointer hover:underline ${
                isLight ? 'text-[#1a0dab]' : 'text-[#8ab4f8]'
              }`}
            >
              {query || 'Technology'} - Comprehensive Encyclopedia Article
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#4d5156]' : 'text-[#bdc1c6]'}`}>
              In-depth overview, historical context, modern advancements, foundational principles, and scholarly references.
            </p>
          </div>

          {/* Result 3 */}
          <div className="space-y-1">
            <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-[#202124]' : 'text-[#bdc1c6]'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isLight ? 'bg-[#f1f3f4]' : 'bg-[#303134]'
              }`}>⚡</span>
              <span>news.ycombinator.com &gt; item</span>
            </div>
            <h3
              onClick={() => onNavigate('https://news.ycombinator.com', 'Hacker News')}
              className={`text-base font-medium leading-snug cursor-pointer hover:underline ${
                isLight ? 'text-[#1a0dab]' : 'text-[#8ab4f8]'
              }`}
            >
              Ask HN: What is your current workflow with {query || 'AI browsers'}?
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#4d5156]' : 'text-[#bdc1c6]'}`}>
              248 points by technologist 14 hours ago | 112 comments discussing remote browser automation and control planes.
            </p>
          </div>

          {/* Result 4 */}
          <div className="space-y-1">
            <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-[#202124]' : 'text-[#bdc1c6]'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isLight ? 'bg-[#f1f3f4]' : 'bg-[#303134]'
              }`}>▶️</span>
              <span>youtube.com &gt; watch</span>
            </div>
            <h3
              onClick={() => onNavigate('https://youtube.com', 'YouTube')}
              className={`text-base font-medium leading-snug cursor-pointer hover:underline ${
                isLight ? 'text-[#1a0dab]' : 'text-[#8ab4f8]'
              }`}
            >
              Hands-on Deep Dive: {query || 'Next Gen Web Interfaces'} (4K Review)
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#4d5156]' : 'text-[#bdc1c6]'}`}>
              1.2M views · 2 days ago · Tech Insights Channel — A thorough breakdown of latency, architecture, and live touch execution.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. GitHub View
  if (domain.includes('github')) {
    return (
      <div className={`w-full h-full flex flex-col overflow-y-auto text-left ${
        isLight ? 'bg-[#ffffff] text-[#1f2328]' : 'bg-[#0d1117] text-[#c9d1d9]'
      }`}>
        {/* GitHub Header */}
        <div className={`border-b px-4 py-3 flex items-center justify-between ${
          isLight ? 'bg-[#f6f8fa] border-[#d0d7de]' : 'bg-[#161b22] border-[#30363d]'
        }`}>
          <div className="flex items-center gap-2">
            <div
              onClick={() => onNavigate('https://github.com', 'GitHub')}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer ${
                isLight ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              🐙
            </div>
            <span className={`text-xs font-semibold ${isLight ? 'text-[#1f2328]' : 'text-white'}`}>
              brow8te / workspace
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
              isLight ? 'border-[#d0d7de] text-[#656d76]' : 'border-[#30363d] text-[#8b949e]'
            }`}>
              Public
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium ${
                isLight
                  ? 'bg-[#f6f8fa] hover:bg-[#eaeef2] border-[#d0d7de] text-[#24292f]'
                  : 'bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#c9d1d9]'
              }`}
            >
              <Star className="w-3 h-3 text-[#e3b341]" />
              <span>Star</span>
              <span className={`px-1 rounded text-[10px] ${isLight ? 'bg-[#eaeef2]' : 'bg-[#30363d]'}`}>1.4k</span>
            </button>
          </div>
        </div>

        {/* Repo Code Navigation Tabs */}
        <div className={`flex gap-4 px-4 pt-2 border-b text-xs ${
          isLight ? 'bg-[#ffffff] border-[#d0d7de]' : 'bg-[#0d1117] border-[#30363d]'
        }`}>
          <span className={`border-b-2 pb-2 font-medium flex items-center gap-1.5 cursor-pointer ${
            isLight
              ? 'text-[#1f2328] border-[#fd8c73]'
              : 'text-white border-[#f78166]'
          }`}>
            <BookOpen className="w-3.5 h-3.5" /> Code
          </span>
          <span className={`pb-2 cursor-pointer flex items-center gap-1 ${
            isLight ? 'text-[#656d76] hover:text-[#1f2328]' : 'text-[#8b949e] hover:text-white'
          }`}>
            Issues <span className={`text-[10px] px-1 rounded ${isLight ? 'bg-[#eaeef2]' : 'bg-[#30363d]'}`}>3</span>
          </span>
          <span className={`pb-2 cursor-pointer flex items-center gap-1 ${
            isLight ? 'text-[#656d76] hover:text-[#1f2328]' : 'text-[#8b949e] hover:text-white'
          }`}>
            Pull requests <span className={`text-[10px] px-1 rounded ${isLight ? 'bg-[#eaeef2]' : 'bg-[#30363d]'}`}>1</span>
          </span>
        </div>

        {/* Repo Body */}
        <div className="p-4 space-y-4">
          {/* Commit Banner */}
          <div className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
            isLight ? 'bg-[#f6f8fa] border-[#d0d7de]' : 'bg-[#161b22] border-[#30363d]'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#1a7f37] flex items-center justify-center text-[10px] text-white">✓</div>
              <span className={`font-mono text-[11px] ${isLight ? 'text-[#1f2328]' : 'text-white'}`}>
                feat: initial Brow8te VNC engine protocol
              </span>
            </div>
            <span className={`text-[10px] ${isLight ? 'text-[#656d76]' : 'text-[#8b949e]'}`}>2m ago</span>
          </div>

          {/* File Tree */}
          <div className={`rounded-lg border overflow-hidden text-xs ${
            isLight ? 'border-[#d0d7de] bg-white' : 'border-[#30363d] bg-[#161b22]'
          }`}>
            {[
              { name: 'src/browser/session.ts', type: 'file', msg: 'Implement CDP session manager', time: '10m ago' },
              { name: 'src/components/VNCPreview.tsx', type: 'file', msg: 'Add live touch event handlers', time: '1h ago' },
              { name: 'src/control/chat.ts', type: 'file', msg: 'Natural language intent parser', time: '3h ago' },
              { name: 'README.md', type: 'file', msg: 'Update architecture diagram', time: '1d ago' },
            ].map((f) => (
              <div
                key={f.name}
                className={`flex items-center justify-between px-3 py-2 border-b last:border-0 cursor-pointer ${
                  isLight
                    ? 'border-[#d0d7de] hover:bg-[#f6f8fa]'
                    : 'border-[#30363d] hover:bg-[#21262d]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={isLight ? 'text-[#656d76]' : 'text-[#8b949e]'}>📄</span>
                  <span className={`hover:underline font-mono text-[11px] ${
                    isLight ? 'text-[#0969da]' : 'text-[#58a6ff]'
                  }`}>{f.name}</span>
                </div>
                <span className={`text-[10px] truncate max-w-[120px] ${
                  isLight ? 'text-[#656d76]' : 'text-[#8b949e]'
                }`}>{f.msg}</span>
              </div>
            ))}
          </div>

          {/* README Box */}
          <div className={`rounded-lg border p-4 text-xs space-y-3 ${
            isLight ? 'border-[#d0d7de] bg-white' : 'border-[#30363d] bg-[#0d1117]'
          }`}>
            <div className={`flex items-center gap-2 font-semibold text-sm pb-2 border-b ${
              isLight ? 'text-[#1f2328] border-[#d0d7de]' : 'text-white border-[#30363d]'
            }`}>
              <span>📖 README.md</span>
            </div>
            <h1 className={`text-lg font-bold ${isLight ? 'text-[#1f2328]' : 'text-white'}`}>
              Brow8te Remote Browser Engine
            </h1>
            <p className={`leading-relaxed ${isLight ? 'text-[#656d76]' : 'text-[#8b949e]'}`}>
              A hybrid browser environment bridging natural conversational intent with zero-latency remote direct manipulation.
            </p>
            <div className={`p-3 rounded-md border font-mono text-[11px] ${
              isLight
                ? 'bg-[#f6f8fa] border-[#d0d7de] text-[#0969da]'
                : 'bg-[#161b22] border-[#30363d] text-[#79c0ff]'
            }`}>
              $ curl -X POST https://api.brow8te.internal/v1/sessions/create
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. YouTube View
  if (domain.includes('youtube')) {
    return (
      <div className={`w-full h-full flex flex-col overflow-y-auto text-left ${
        isLight ? 'bg-[#ffffff] text-[#0f0f0f]' : 'bg-[#0f0f0f] text-[#f1f1f1]'
      }`}>
        {/* Top Red YouTube Bar */}
        <div className={`sticky top-0 border-b px-4 py-2.5 flex items-center justify-between z-10 ${
          isLight ? 'bg-white border-[#e5e5e5]' : 'bg-[#0f0f0f] border-[#272727]'
        }`}>
          <div
            onClick={() => onNavigate('https://youtube.com', 'YouTube')}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <div className="w-6 h-4 bg-[#ff0000] rounded-sm flex items-center justify-center text-[10px] text-white">▶</div>
            <span className="font-bold tracking-tighter text-sm">YouTube</span>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            isLight ? 'bg-[#f2f2f2]' : 'bg-[#272727]'
          }`}>🔍</div>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <button
            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
            className="relative z-10 w-14 h-14 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center text-white shadow-xl transition-transform transform active:scale-95"
          >
            {isPlayingVideo ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>

          {/* Video Scrubber */}
          <div className="absolute bottom-2 inset-x-3 flex flex-col gap-1 z-10">
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <div className={`h-full bg-red-600 rounded-full transition-all duration-300 ${isPlayingVideo ? 'w-2/3' : 'w-1/4'}`} />
            </div>
            <div className="flex justify-between text-[10px] text-white font-mono">
              <span>{isPlayingVideo ? '04:12' : '01:05'}</span>
              <span>12:48</span>
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-4 space-y-3">
          <h2 className={`text-sm font-semibold leading-snug ${isLight ? 'text-[#0f0f0f]' : 'text-white'}`}>
            Building Brow8te: The Remote Control Plane for Next-Gen Browsers
          </h2>
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-[#606060]' : 'text-[#aaaaaa]'}`}>
            <span>482K views · 3 days ago</span>
            <div className="flex gap-2">
              <button className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium ${
                isLight ? 'bg-[#f2f2f2] text-black' : 'bg-[#272727] text-white'
              }`}>
                <ThumbsUp className="w-3 h-3" /> 24k
              </button>
              <button
                onClick={() => {
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium ${
                  isLight ? 'bg-[#f2f2f2] text-black' : 'bg-[#272727] text-white'
                }`}
              >
                {copiedLink ? <Check className="w-3 h-3 text-green-600" /> : <ExternalLink className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Channel Card */}
          <div className={`flex items-center justify-between py-2 border-y ${
            isLight ? 'border-[#e5e5e5]' : 'border-[#272727]'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center font-bold text-white text-xs">
                AI
              </div>
              <div>
                <div className={`text-xs font-semibold ${isLight ? 'text-[#0f0f0f]' : 'text-white'}`}>
                  Browser Engineering Lab
                </div>
                <div className={`text-[10px] ${isLight ? 'text-[#606060]' : 'text-[#aaaaaa]'}`}>
                  1.8M subscribers
                </div>
              </div>
            </div>
            <button className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              isLight ? 'bg-black text-white' : 'bg-white text-black'
            }`}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Hacker News View
  if (domain.includes('ycombinator')) {
    return (
      <div className="w-full h-full bg-[#f6f6ef] text-[#222222] flex flex-col overflow-y-auto text-left">
        {/* Orange Top Bar */}
        <div className="bg-[#ff6600] px-3 py-2 flex items-center justify-between text-xs text-black font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold border border-white px-1.5 py-0.5 bg-black text-white text-[11px]">Y</span>
            <span className="font-bold">Hacker News</span>
            <div className="hidden sm:flex gap-2 text-[11px] text-black/80 font-normal">
              <span>new</span> | <span>past</span> | <span>comments</span> | <span>ask</span> | <span>show</span> | <span>jobs</span>
            </div>
          </div>
          <span className="text-[11px]">login</span>
        </div>

        {/* Stories List */}
        <div className="p-3 space-y-3 font-sans">
          {[
            { id: 1, title: 'Show HN: Brow8te – AI control plane with live remote browser session', domain: 'brow8te.io', points: 342, user: 'antigravity', comments: 128 },
            { id: 2, title: 'Why client-rendered web agents fail without remote CDP execution', domain: 'browserlab.org', points: 219, user: 'swyx', comments: 84 },
            { id: 3, title: 'WebRTC and VNC sub-50ms canvas streaming for mobile web apps', domain: 'github.com/engine', points: 185, user: 'dan_a', comments: 56 },
            { id: 4, title: 'Reflections on natural language user interfaces for web navigation', domain: 'arxiv.org', points: 94, user: 'alanturing', comments: 31 },
          ].map((item, index) => {
            const isUpvoted = upvotedPosts.includes(item.id);
            return (
              <div key={item.id} className="flex items-start gap-2 text-xs">
                <span className="text-[#828282] font-mono text-[11px] pt-0.5">{index + 1}.</span>
                <button
                  onClick={(e) => toggleUpvote(item.id, e)}
                  className={`pt-1 text-[10px] ${isUpvoted ? 'text-[#ff6600]' : 'text-[#828282] hover:text-black'}`}
                >
                  ▲
                </button>
                <div className="space-y-0.5 flex-1">
                  <div className="leading-snug">
                    <span
                      onClick={() => onNavigate(`https://${item.domain}`, item.title)}
                      className="font-medium text-black hover:underline cursor-pointer"
                    >
                      {item.title}
                    </span>{' '}
                    <span className="text-[10px] text-[#828282]">({item.domain})</span>
                  </div>
                  <div className="text-[10px] text-[#828282]">
                    {item.points + (isUpvoted ? 1 : 0)} points by {item.user} 2 hours ago | hide | {item.comments} comments
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. Wikipedia View
  if (domain.includes('wikipedia')) {
    return (
      <div className="w-full h-full bg-[#ffffff] text-[#202122] flex flex-col overflow-y-auto text-left font-serif p-5">
        <div className="border-b border-[#a2a9b1] pb-3 mb-4 font-sans flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-serif">W</span>
            <div>
              <div className="text-sm font-bold tracking-tight">Wikipedia</div>
              <div className="text-[10px] text-[#54595d]">The Free Encyclopedia</div>
            </div>
          </div>
          <span className="text-xs text-[#3366cc] cursor-pointer">Read in another language</span>
        </div>

        <h1 className="text-2xl font-serif font-normal border-b border-[#a2a9b1] pb-1 mb-3 text-black">
          Cloud-assisted Web Browsing
        </h1>

        <div className="text-xs leading-relaxed text-[#202122] space-y-3">
          <p>
            <span className="font-bold">Cloud-assisted web browsing</span> (or remote browser isolation/execution) is an architectural model where the core rendering engine and JavaScript execution take place in an isolated remote container or virtual machine rather than purely on the client device.
          </p>
          <div className="p-3 bg-[#f8f9fa] border border-[#a2a9b1] rounded text-[11px] font-sans">
            <div className="font-bold mb-1">Key Advantages:</div>
            <ul className="list-disc list-inside space-y-1 text-[#54595d]">
              <li>Dual interaction modes: Natural language intent & direct manipulation</li>
              <li>Sandboxed security without client memory leaks</li>
              <li>Autonomous AI browser interaction through Chrome DevTools Protocol (CDP)</li>
            </ul>
          </div>
          <p>
            Modern implementations like <span className="font-semibold text-[#3366cc] cursor-pointer" onClick={() => onNavigate('https://github.com', 'Brow8te')}>Brow8te</span> provide responsive WebRTC/VNC touch stream layers, allowing mobile users to fluidly scroll, type, and interact with complex web applications effortlessly.
          </p>
        </div>
      </div>
    );
  }

  // 6. Generic Live Sandbox View
  return (
    <div className={`w-full h-full flex flex-col justify-between p-6 overflow-y-auto text-left ${
      isLight ? 'bg-[#F9F9F8] text-[#141413]' : 'bg-[#18181b] text-[#f4f4f5]'
    }`}>
      <div className="space-y-4">
        {/* Domain Badge */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-[#E7E6E2]' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C48A4F]" />
            <span className="text-xs font-mono text-[#C48A4F]">{domain}</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
            isLight ? 'bg-[#F3EFE9] text-[#6B6862]' : 'bg-white/5 text-[#8C887E]'
          }`}>
            LIVE SESSION (CDP 60fps)
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-3 pt-2">
          <h1 className={`text-xl font-light tracking-tight ${isLight ? 'text-[#141413]' : 'text-white'}`}>
            {domain.charAt(0).toUpperCase() + domain.slice(1)} Workspace
          </h1>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-[#6B6862]' : 'text-[#a1a1aa]'}`}>
            Connected to remote browser session at <span className={`font-mono ${isLight ? 'text-black font-semibold' : 'text-white'}`}>{url}</span>. Direct pointer manipulation, scroll gestures, and DOM interaction are active.
          </p>
        </div>

        {/* Interactive Feature Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div
            onClick={() => onNavigate('https://www.google.com', 'Google')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
              isLight
                ? 'bg-white border-[#E7E6E2] hover:border-[#C48A4F] shadow-sm'
                : 'bg-[#27272a] border-[#3f3f46] hover:border-[#D4A373]/50'
            }`}
          >
            <div className={`text-xs font-medium flex items-center justify-between ${isLight ? 'text-[#141413]' : 'text-white'}`}>
              <span>Google Search</span>
              <ArrowRight className="w-3 h-3 text-[#C48A4F]" />
            </div>
            <div className={`text-[10px] ${isLight ? 'text-[#6B6862]' : 'text-[#a1a1aa]'}`}>Search the web with AI indexing</div>
          </div>

          <div
            onClick={() => onNavigate('https://github.com', 'GitHub')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
              isLight
                ? 'bg-white border-[#E7E6E2] hover:border-[#C48A4F] shadow-sm'
                : 'bg-[#27272a] border-[#3f3f46] hover:border-[#D4A373]/50'
            }`}
          >
            <div className={`text-xs font-medium flex items-center justify-between ${isLight ? 'text-[#141413]' : 'text-white'}`}>
              <span>GitHub</span>
              <ArrowRight className="w-3 h-3 text-[#C48A4F]" />
            </div>
            <div className={`text-[10px] ${isLight ? 'text-[#6B6862]' : 'text-[#a1a1aa]'}`}>Explore repositories & code</div>
          </div>
        </div>

        {/* Live Input Demo */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isLight
            ? 'bg-white border-[#E7E6E2] shadow-sm'
            : 'bg-[#27272a]/60 border-[#3f3f46]'
        }`}>
          <div className={`text-xs font-medium ${isLight ? 'text-[#141413]' : 'text-white'}`}>Interactive Session Form</div>
          <input
            type="text"
            placeholder="Type anything here into the remote session..."
            className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
              isLight
                ? 'bg-[#F9F9F8] border-[#E7E6E2] text-[#141413] placeholder-[#9E9B93] focus:border-[#C48A4F]'
                : 'bg-[#18181b] border-[#3f3f46] text-white placeholder-[#71717a] focus:border-[#D4A373]'
            }`}
          />
        </div>
      </div>

      <div className={`pt-6 border-t text-[10px] flex justify-between font-mono ${
        isLight ? 'border-[#E7E6E2] text-[#9E9B93]' : 'border-white/10 text-[#71717a]'
      }`}>
        <span>VNC Canvas Latency: 18ms</span>
        <span>SSL TLS 1.3 Verified</span>
      </div>
    </div>
  );
};
