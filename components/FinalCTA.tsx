import Link from 'next/link';
import { ArrowRight, MessageCircle, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { whatsappLink } from '@/lib/config';

export function FinalCTA() {
  return (
    <section className="relative bg-[#0d0c0a] text-white py-24 sm:py-32 overflow-hidden border-t border-stone-800">
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#dbc7af]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="shell relative z-10 max-w-5xl mx-auto px-6 text-center space-y-10">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-[#dbc7af]/30 text-[#dbc7af] text-xs font-semibold tracking-widest uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#dbc7af]" />
          <span>Start A Conversation</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-stone-100 leading-[1.15]">
            Let the material <br className="hidden sm:inline" />
            <em className="text-[#dbc7af] italic font-serif">make the first impression.</em>
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-light max-w-2xl mx-auto leading-relaxed">
            Whether you require bespoke private label manufacturing, custom sizing and engraving, or wholesale bulk sourcing, our master artisans are ready to discuss your requirements.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#dbc7af] hover:bg-[#c9b398] text-stone-950 font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start a conversation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappLink('Hello Qadri Horncraft, I would like to discuss a custom inquiry or wholesale order.')}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium text-sm transition-all duration-300 hover:border-[#dbc7af]/40 hover:text-white"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-12 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-900/40 border border-stone-800/60">
            <div className="p-2 rounded-lg bg-[#dbc7af]/10 text-[#dbc7af] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200 uppercase tracking-wider">Ethical Sourcing</p>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                100% natural, ethically sourced buffalo horn handcrafted by traditional artisans.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-900/40 border border-stone-800/60">
            <div className="p-2 rounded-lg bg-[#dbc7af]/10 text-[#dbc7af] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200 uppercase tracking-wider">Custom Craftsmanship</p>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                Bespoke silhouettes, finishes, laser branding & private label packaging available.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-900/40 border border-stone-800/60">
            <div className="p-2 rounded-lg bg-[#dbc7af]/10 text-[#dbc7af] shrink-0 mt-0.5">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200 uppercase tracking-wider">Global Export</p>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                Trusted worldwide delivery to USA, Europe, GCC, and international wholesale markets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
