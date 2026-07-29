import React, { useState, useRef, useEffect } from 'react';
import { sanitizeInput, checkRateLimit } from '../utils/sanitize';
import { apiSendChatMessage } from '../services/api';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', user: 'Xyron', text: 'Welcome to Xyron Chat — encrypted, zero-log, peer-to-peer.', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [channel] = useState('#general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const sanitized = sanitizeInput(input);
    if (!sanitized.trim()) return;

    // Rate limiting: max 10 messages per 10 seconds
    if (!checkRateLimit('chat', 10, 10000)) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: 'Xyron',
        text: '⏱ Rate limit hit. Slow down.',
        timestamp: new Date(),
      }]);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: sanitized,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Send to backend and get confirmation
    const result = await apiSendChatMessage(channel, sanitized);
    setMessages(prev => [...prev, {
      id: result.id,
      user: 'Xyron',
      text: `Message delivered (${new Date(result.timestamp).toLocaleTimeString()})`,
      timestamp: new Date(),
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/60 backdrop-blur-md rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-zinc-400 font-mono">{channel}</span>
        <span className="text-xs text-zinc-600 ml-auto">🔒 E2E encrypted</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`text-sm ${msg.user === 'You' ? 'text-right' : ''}`}>
            <span className={`inline-block px-3 py-1.5 rounded-lg text-xs ${
              msg.user === 'You'
                ? 'bg-blue-600/20 text-blue-300'
                : msg.user === 'Xyron'
                ? 'bg-zinc-800 text-zinc-400'
                : 'bg-zinc-800/50 text-zinc-300'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message (#general)"
            className="flex-1 bg-zinc-900 text-sm text-zinc-200 px-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-zinc-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
