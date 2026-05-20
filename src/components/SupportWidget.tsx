'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { SupportMessage } from '../types';
import { MessageSquare, X, Send, User, MessageCircle, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SupportWidget() {
  const { user, supportMessages, addSupportMessage, orders, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-submit identity form if user is logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsFormSubmitted(true);
    }
  }, [user]);

  // Scroll to bottom when messages list increases
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [supportMessages, isOpen, isFormSubmitted]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setIsFormSubmitted(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: name || 'Anonymous Guest',
      customerEmail: email || 'guest@example.com',
      orderId: orderId || undefined,
    };

    addSupportMessage(newMsg);
    setMessage('');

    // Trigger an ambient notification log on the admin side
    useStore.getState().addBotLog({
      id: `bot-notif-${Date.now()}`,
      bot: 'System Chat',
      message: `New message from ${newMsg.customerName}: "${newMsg.text.substring(0, 30)}..."`,
      date: new Date().toLocaleTimeString(),
      type: 'info'
    });

    // Simulated short delay auto-acknowledgement from bot if no admin is active
    setTimeout(() => {
      const msgs = useStore.getState().supportMessages;
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg && lastMsg.sender === 'customer') {
        const supportAutoAck: SupportMessage = {
          id: `msg-ack-${Date.now()}`,
          sender: 'admin',
          text: `Thank you for reaching out, ${name || 'Customer'}! Our support desk has received your ticket regarding ${orderId ? `Order ${orderId}` : 'your inquiry'}. An agent will respond in real-time.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customerName: name || 'Anonymous Guest',
          customerEmail: email || 'guest@example.com',
          orderId: orderId || undefined,
        };
        addSupportMessage(supportAutoAck);
      }
    }, 4000);
  };

  // Filter messages specific to this customer's email
  const displayMessages = supportMessages.filter(
    (m) => m.customerEmail?.toLowerCase() === email.toLowerCase()
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="support-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="bg-[#141414] border border-white/10 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] w-[360px] md:w-[400px] h-[520px] flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div 
              className="px-6 py-4 flex items-center justify-between text-white border-b border-white/5 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${settings.themeColor || '#D4AF37'}3D, #0A0A0A)` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold text-sm"
                  style={{ backgroundColor: settings.themeColor || '#D4AF37' }}
                >
                  <MessageSquare className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Customer Care Center</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-[#50C878] rounded-full animate-ping" />
                    <span className="text-[10px] text-gray-400 font-medium">Support Agents Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Content pane */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0A]/40">
              {!isFormSubmitted ? (
                /* Identity Form */
                <form onSubmit={handleStartChat} className="space-y-4 h-full flex flex-col justify-center">
                  <div className="text-center mb-4">
                    <MessageCircle className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" style={{ color: settings.themeColor }} />
                    <h4 className="text-lg font-bold text-white mb-1">Direct Help Channel</h4>
                    <p className="text-xs text-gray-400">Introduce yourself to start a live conversation with our support managers.</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block font-bold">Your Name</label>
                    <input 
                      type="text" required
                      value={name} onChange={p => setName(p.target.value)}
                      placeholder="Sarah Jenkins"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ '--tw-ring-color': settings.themeColor } as any}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block font-bold">Email Address</label>
                    <input 
                      type="email" required
                      value={email} onChange={p => setEmail(p.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block font-bold">Order ID (Optional)</label>
                    <select
                      value={orderId} 
                      onChange={e => setOrderId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors"
                    >
                      <option value="" className="bg-[#141414] text-gray-400">No order referenced</option>
                      {orders.filter(o => o.email === email || o.email === user?.email).map(o => (
                        <option key={o.id} value={o.id} className="bg-[#141414] text-white font-mono">
                          {o.id} - ${o.total.toFixed(2)} ({o.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-3.5 rounded-xl text-black font-bold uppercase tracking-wider text-xs hover:opacity-90 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    style={{ backgroundColor: settings.themeColor || '#D4AF37' }}
                  >
                    Start Care Thread <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Chat Messages */
                <div className="space-y-4 flex flex-col h-full justify-between">
                  {displayMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <AlertCircle className="w-8 h-8 text-gray-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-300">No messages yet</p>
                      <p className="text-xs text-gray-500 mt-1">Send a message below. Admin replies will show up here instantly in real-time!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pr-1">
                      {displayMessages.map((msg) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                          <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[10px] text-gray-400 font-medium">
                                {isAdmin ? 'Support Agent' : msg.customerName || 'You'}
                              </span>
                              <span className="text-[9px] text-gray-500 font-mono">
                                {msg.timestamp}
                              </span>
                            </div>
                            <div 
                              className={`p-3 rounded-2xl max-w-[85%] text-xs font-medium leading-relaxed shadow-sm ${
                                isAdmin 
                                  ? 'bg-[#141414] border border-white/5 text-gray-100 rounded-tl-none' 
                                  : 'text-black rounded-tr-none'
                              }`}
                              style={!isAdmin ? { backgroundColor: settings.themeColor || '#D4AF37' } : {}}
                            >
                              {msg.text}
                            </div>
                            {msg.orderId && !isAdmin && (
                              <span className="text-[9px] text-[#D4AF37] mt-1 flex items-center gap-1 border border-[#D4AF37]/10 px-1.5 py-0.5 rounded font-mono bg-[#D4AF37]/5">
                                <ShoppingBag className="w-2.5 h-2.5" /> Order: {msg.orderId}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      <div ref={endRef} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Footer */}
            {isFormSubmitted && (
              <form onSubmit={handleSendMessage} className="p-4 bg-[#0A0A0A] border-t border-white/5 flex gap-2">
                <input 
                  type="text" required
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message to helpdesk..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37] transition-all"
                />
                <button 
                  type="submit"
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-95 active:scale-90 transition-all cursor-pointer shadow-md bg-[#D4AF37]"
                  style={{ backgroundColor: settings.themeColor || '#D4AF37' }}
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        id="support-widget-launcher"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[-5px_10px_20px_rgba(0,0,0,0.5)] cursor-pointer group active:scale-95 transition-all text-black font-semibold border-none outline-none relative hover:brightness-110"
        style={{ backgroundColor: settings.themeColor || '#D4AF37' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="w-6 h-6 text-black key-icon-close" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-black" />
              {supportMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border border-black text-[9px] font-bold text-white flex items-center justify-center">
                  {supportMessages.length}
                </span>
              )}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
