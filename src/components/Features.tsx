import { motion } from 'motion/react';
import { Brain, Rocket, Network, LineChart } from 'lucide-react';
import { cn } from '../lib/utils';

const features = [
  {
    icon: Brain,
    title: "AI Price Optimization",
    description: "Our proprietary algorithm analyzes market trends to set the perfect margin, maximizing your profit automatically.",
    color: "from-purple-500/20 to-transparent"
  },
  {
    icon: Rocket,
    title: "Auto Order Fulfillment",
    description: "Orders are processed and routed to strictly-vetted suppliers with zero manual intervention required.",
    color: "from-blue-500/20 to-transparent"
  },
  {
    icon: Network,
    title: "Multi-Supplier Network",
    description: "Access an elite tier of dropshipping suppliers globally. We handle the logistics; you focus on growth.",
    color: "from-emerald-500/20 to-transparent"
  },
  {
    icon: LineChart,
    title: "Real-Time Tracking",
    description: "Live dashboard syncing product status, carrier updates, and profit metrics natively.",
    color: "from-orange-500/20 to-transparent"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 relative bg-[#020202]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:w-2/3">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[1px] w-12 bg-indigo-500"></span>
            <span className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase">Intelligence</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter leading-[0.9]">
            THE ARCHITECTURE OF <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">MODERN COMMERCE.</span>
          </h2>
          <p className="text-neutral-400 text-lg font-light leading-relaxed">
            Aura Commerce eliminates the friction of traditional dropshipping. No more manual ordering, blind pricing, or unreliable shipping.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 backdrop-blur-2xl shadow-2xl"
            >
              <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", feature.color)} />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <feature.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
