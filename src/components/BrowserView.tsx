import React, { useState, useRef, useCallback } from 'react';
import { InstanceType } from '../types/instance';

interface BrowserViewProps {
  type: InstanceType;
}

const BrowserView: React.FC<BrowserViewProps> = ({ type }) => {
  const [url, setUrl] = useState('https://example.com');
  const [loadedUrl, setLoadedUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://example.com']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = useCallback((targetUrl: string) => {
    let finalUrl = targetUrl.trim();
    if (!finalUrl) return;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    setLoading(true);
    setLoadedUrl(finalUrl);
    setUrl(finalUrl);

    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);

    // Simulate load delay
    setTimeout(() => setLoading(false), 600);
  }, [history, historyIdx]);

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      const u = history[idx];
      setUrl(u);
      setLoadedUrl(u);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      const u = history[idx];
      setUrl(u);
      setLoadedUrl(u);
    }
  };

  const refresh = () => {
    setLoading(true);
    setLoadedUrl(prev => prev);
    setTimeout(() => setLoading(false), 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') navigate(url);
  };

  const isCybersec = type === 'cybersec';

  return (
    <div className="flex flex-col h-full bg-zinc-950/60 backdrop-blur-md rounded-xl border border-zinc-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <button
          onClick={goBack}
          disabled={historyIdx <= 0}
          className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 disabled:opacity-30 transition"
          title="Back"
        >
          ◀
        </button>
        <button
          onClick={goForward}
          disabled={historyIdx >= history.length - 1}
          className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 disabled:opacity-30 transition"
          title="Forward"
        >
          ▶
        </button>
        <button
          onClick={refresh}
          className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 transition"
          title="Refresh"
        >
          {loading ? '⟳' : '⟳'}
        </button>
        <div className="flex-1 flex items-center bg-zinc-800 rounded-lg px-3 py-1.5 text-sm">
          {isCybersec && (
            <span className="text-red-500 text-xs mr-2 font-mono">🔒</span>
          )}
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-zinc-300 text-xs outline-none"
          />
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full ${
          loading ? 'text-yellow-500 bg-yellow-900/20' : 'text-green-500 bg-green-900/20'
        }`}>
          {loading ? 'LOADING' : 'SECURE'}
        </span>
      </div>

      {/* Content area */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          {loadedUrl && (
            <iframe
              ref={iframeRef}
              src={loadedUrl}
              className="w-full h-full border-0"
              title="Browser"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}
          {loading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800">
              <div className="h-full bg-blue-500 animate-pulse rounded-full transition-all" style={{ width: '60%' }} />
            </div>
          )}
        </div>

        {/* Cybersec network panel */}
        {isCybersec && (
          <div className="w-64 border-l border-zinc-800 bg-zinc-900/30 p-3 text-xs overflow-y-auto">
            <h4 className="text-zinc-400 font-semibold mb-3 flex items-center gap-1.5">
              <span>🔍</span> Network Inspector
            </h4>
            <div className="space-y-2">
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500">URL</p>
                <p className="text-zinc-300 truncate">{loadedUrl}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500">Method</p>
                <p className="text-green-400">GET</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500">Status</p>
                <p className="text-zinc-300">{loading ? 'Loading...' : '200 OK'}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500">Content-Type</p>
                <p className="text-zinc-300">text/html</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500">Headers</p>
                <div className="text-zinc-600 mt-1 font-mono text-[10px] leading-relaxed">
                  <p>Server: nginx/1.24.0</p>
                  <p>X-Frame-Options: SAMEORIGIN</p>
                  <p>Content-Security-Policy: ...</p>
                  <p>Set-Cookie: [redacted]</p>
                </div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500">Security</p>
                <div className="mt-1 space-y-1">
                  <p className="text-green-400">✓ HTTPS (TLS 1.3)</p>
                  <p className="text-green-400">✓ HSTS Enabled</p>
                  <p className="text-zinc-500">○ Certificate: Valid</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-zinc-800 text-[10px] text-zinc-600 bg-zinc-900/50">
        <span>Ready</span>
        <span className="flex items-center gap-2">
          <span>{isCybersec ? '🔒 Proxy: 127.0.0.1:8080' : '📡 Direct'}</span>
          <span>🔋 {type}</span>
        </span>
      </div>
    </div>
  );
};

export default BrowserView;
