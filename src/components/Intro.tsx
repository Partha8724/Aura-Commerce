import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Sparkles, ChevronRight } from 'lucide-react';

export function Intro() {
  const { setHasSeenIntro, settings } = useStore();
  const [phase, setPhase] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);

  const typingOptions = [
    "Discover your next masterpiece...",
    "Curated luxury essentials...",
    "Exclusive drops and collections...",
    "Redefining modern retail...",
    "Step into the future..."
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800); // 1st Word
    const t2 = setTimeout(() => setPhase(2), 2500); // 2nd Word
    const t3 = setTimeout(() => setPhase(3), 4000); // Subtitles
    const t4 = setTimeout(() => setPhase(4), 5500); // Enter Button

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    if (phase < 3) return;
    const interval = setInterval(() => {
      setTypingIndex((prev) => (prev + 1) % typingOptions.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [phase]);

  const words = settings.storeName.split(' ');
  const firstWord = words[0] || 'AURA';
  const secondWord = words.slice(1).join(' ') || 'COMMERCE';

  // Generate random particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden perspective-[2000px]">
      
      {/* Dynamic Background */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,rgba(5,5,5,1)_60%)] animate-[spin_60s_linear_infinite] pointer-events-none" />
      
      {/* Floating Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: `0 0 ${p.size * 2}px rgba(255,255,255,0.5)`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center transform-style-[preserve-3d]">
        
        {/* First Word Typing (3D Cinematic) */}
        <div className="flex gap-2 sm:gap-[20px] mb-2 h-[100px] sm:h-[140px] items-center flex-wrap justify-center max-w-[90vw]">
          {firstWord.split('').map((letter, i) => (
            <motion.span
              key={`w1-${i}`}
              className="text-[80px] sm:text-[120px] md:text-[160px] font-display font-black leading-none"
              style={{ 
                color: 'transparent',
                // Chrome and Safari specifically
                WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 60px ${settings.themeColor}40`
              }}
              initial={{ opacity: 0, scale: 0.5, z: 1000, rotateX: 90, rotateY: Math.random() * 45 - 22.5 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1, z: 0, rotateX: 0, rotateY: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 1.8, type: "spring", bounce: 0.5 }}
            >
              <div className="relative">
                {letter}
                {/* Internal Glow Fill */}
                <motion.span
                  className="absolute inset-0 z-[-1]"
                  style={{
                    WebkitTextStroke: '0px',
                    WebkitTextFillColor: 'white',
                    opacity: 0.2
                  }}
                  animate={phase >= 2 ? {
                    opacity: [0.1, 0.5, 0.1],
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                >
                  {letter}
                </motion.span>
              </div>
            </motion.span>
          ))}
        </div>

        {/* Second Word Typing */}
        <div className="flex gap-1 sm:gap-[15px] mb-12 h-[40px] sm:h-[60px] items-center flex-wrap justify-center max-w-[90vw]">
          {secondWord.split('').map((letter, i) => (
            <motion.span
              key={`w2-${i}`}
              className="text-[28px] sm:text-[40px] md:text-[60px] font-sans font-light tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-300 leading-none"
              initial={{ opacity: 0, scale: 0.8, y: 30, filter: 'blur(10px)' }}
              animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ delay: 0.5 + (i * 0.1), duration: 1, ease: "easeOut" }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Subtitles (Animated Typing) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="flex flex-col items-center mb-16 h-12"
        >
          <div className="h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={typingIndex}
                initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
                transition={{ duration: 0.8 }}
                className="font-sans font-light text-gray-400 text-lg sm:text-xl flex items-center tracking-wide"
              >
                <Sparkles className="w-4 h-4 mr-3 text-[#D4AF37]" />
                {typingOptions[typingIndex]}
                <span className="w-1 h-5 bg-[#D4AF37] ml-2 animate-pulse" />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enter Button (Sleek Modern) */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1, y: 0 } : {}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setHasSeenIntro(true)}
          className="group relative overflow-hidden rounded-full bg-white/5 border border-white/10 px-10 py-5 backdrop-blur-xl flex items-center gap-4 transition-all hover:bg-white/10 hover:border-white/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          <span className="relative z-10 text-white font-sans font-medium tracking-[4px] uppercase text-sm">
            Enter Store
          </span>
          <div className="relative z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:translate-x-2 transition-transform">
            <ChevronRight className="w-5 h-5 text-black" />
          </div>
        </motion.button>
      </div>

      <button 
        onClick={() => setHasSeenIntro(true)}
        className="absolute bottom-8 right-8 text-gray-600 font-sans text-xs hover:text-white transition-colors uppercase tracking-[0.2em] cursor-pointer z-50 flex items-center gap-2"
      >
        Skip <ChevronRight className="w-3 h-3" />
      </button>

    </div>
  );
}

