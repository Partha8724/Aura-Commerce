'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  RefreshCcw, 
  ExternalLink,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from '../store/useStore';
import { cjApi } from '../lib/cj-api';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

/**
 * AURA COMMERCE - CJ Dropshipping Connection Panel
 * British English implementation.
 */
export default function CJConnectionPanel() {
  const { settings, updateSettings } = useStore();
  const [apiKey, setApiKey] = useState(settings.cjApiKey || '');
  const [status, setStatus] = useState<'online' | 'offline' | 'loading' | 'checking'>(settings.cjConnected ? 'online' : 'offline');
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings.cjConnected && status === 'offline') {
      setStatus('online');
    }
  }, [settings.cjConnected, status]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString('en-GB'),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleConnect = async () => {
    if (!apiKey) {
      addLog('Validation failed: Missing API Authorisation Key', 'error');
      setErrorMessage('Please provide your CJ API Authorisation Key.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);
    addLog('⚡ Handshake initiated via Aura Direct...', 'info');

    try {
      const response = await fetch('/api/cj/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });

      const text = await response.text();
      let result;
      
      try {
        result = JSON.parse(text);
      } catch (e) {
        addLog('❌ Critical Error: Node Gateway returned HTML. Path misconfigured.', 'error');
        throw new Error('Aura Node Gateway delivered an HTML error page. Vercel routing failure.');
      }

      if (result.success) {
        cjApi.apiKey = apiKey;
        updateSettings({ cjApiKey: apiKey, cjConnected: true });
        setStatus('online');
        addLog(`✅ ${result.message}`, 'success');
        addLog('📡 Protocol: Direct Secure Bridge Active', 'info');
        setLastChecked(new Date().toLocaleTimeString('en-GB'));
      } else {
        updateSettings({ cjConnected: false });
        setStatus('offline');
        addLog(`❌ Handshake Denied: ${result.message}`, 'error');
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setStatus('offline');
      addLog(`❌ Connection Failure: ${error.message}`, 'error');
      setErrorMessage(error.message || 'The network link to the CJ API is currently unstable.');
    }
  };

  const resetStatus = () => {
    setApiKey('');
    setStatus('offline');
    setErrorMessage(null);
    addLog('System status reset by operator', 'warning');
  };

  return (
    <div id="cj-connection-panel" className="w-full max-w-4xl mx-auto space-y-6 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#FF6A00]" />
            CJ Dropshipping
          </h2>
          <p className="text-gray-400 text-sm">
            Manage secure tokens and supply chain synchronisation.
          </p>
        </div>
        
        <div className={cn(
          "px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-500",
          status === 'online' ? "bg-green-500/10 border-green-500/50 text-green-400" : 
          status === 'loading' ? "bg-blue-500/10 border-blue-500/50 text-blue-400" :
          "bg-red-500/10 border-red-500/50 text-red-400"
        )}>
          {status === 'online' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-widest">
            {status === 'online' ? 'System Online' : status === 'loading' ? 'Connecting...' : 'System Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF6A00]">
                  API Authorisation Key
                </label>
                <div className="relative group/input">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your CJ API Key..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF6A00]/50 transition-all font-mono text-sm"
                  />
                  {apiKey && (
                    <button 
                      onClick={() => setApiKey('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConnect}
                  disabled={status === 'loading'}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all",
                    status === 'online' 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
                      : "bg-[#FF6A00] text-black hover:bg-[#FF8833] shadow-[0_0_20px_rgba(255,106,0,0.3)]"
                  )}
                >
                  {status === 'loading' ? (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  ) : status === 'online' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                  {status === 'online' ? 'Reconnect Bridge' : 'Establish Connection'}
                </motion.button>

                <a 
                  href="https://developers.cjdropshipping.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold text-sm uppercase tracking-wider border border-white/5 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Get Credentials
                </a>
              </div>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                  >
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-red-400">Connection Obstruction</p>
                      <p className="text-xs text-red-300 opacity-80 leading-relaxed">
                        {errorMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Last Sync</p>
              <p className="text-xl font-mono text-white mt-1">{lastChecked || 'Never'}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">API Version</p>
              <p className="text-xl font-mono text-[#FF6A00] mt-1">2.0 V1</p>
            </div>
          </div>
        </div>

        {/* Console / Logs Card */}
        <div className="lg:col-span-1 h-full min-h-[400px]">
          <div className="bg-black border border-white/5 rounded-2xl h-full flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#FF6A00]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white">System Operational Logs</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            
            <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto space-y-2 custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-gray-700 italic">No activity detected. Awaiting operator input...</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-2 leading-relaxed">
                    <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                    <span className={cn(
                      "break-words",
                      log.type === 'success' ? "text-green-400" :
                      log.type === 'error' ? "text-red-400" :
                      log.type === 'warning' ? "text-yellow-400" :
                      "text-blue-400"
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
