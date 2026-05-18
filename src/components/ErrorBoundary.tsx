import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full space-y-8 p-12 bg-[#141414] border border-white/10 rounded-3xl shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-display font-bold">System Anomaly</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                A critical error occurred while rendering this interface. Our systems have logged the incident.
              </p>
              
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-left mb-6">
                <p className="text-xs font-mono text-red-400 break-words">
                  {this.state.error?.message || 'Unknown execution failure'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-sm uppercase tracking-widest"
              >
                <Home className="w-4 h-4" /> Home
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 py-3 px-4 gold-gradient text-black rounded-xl transition-all font-bold text-sm uppercase tracking-widest"
              >
                <RefreshCcw className="w-4 h-4" /> Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
