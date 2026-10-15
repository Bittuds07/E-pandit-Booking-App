import React from 'react';
import { Package, CheckCircle2, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';

export function SamagriKitsView({ samagriKits, onSelectPujaForBooking, lang }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 border border-amber-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Shuddh & Consecrated Samagri</span>
        </div>
        <h2 className="font-serif-vedic text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
          {lang === 'hi' ? 'वैदिक पूजा सामग्री किट्स' : 'Vedic Puja Samagri Kits'}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {lang === 'hi'
            ? 'शुद्ध देसी गाय का घी, सूखा आम की समिधा, काशी का गंगाजल एवं 51 जड़ी-बूटियों से युक्त प्रमाणिक हवन सामग्री।'
            : 'Pre-assembled or custom curated with pure cow ghee, dried mango samidha wood, sealed Varanasi Gangajal, and 51 Ayurvedic herbs.'}
        </p>
      </div>

      {/* Kits Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {samagriKits?.map((kit) => (
          <div 
            key={kit.id}
            className={`bg-white rounded-3xl overflow-hidden border shadow-sm flex flex-col justify-between transition-all duration-300 ${
              kit.isPopular 
                ? 'border-2 border-amber-500 shadow-xl ring-2 ring-amber-400/20' 
                : 'border-amber-200/80 hover:border-amber-400'
            }`}
          >
            {/* Kit Top */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Package className="w-6 h-6" />
                </span>
                {kit.isPopular && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                )}
              </div>

              <h3 className="font-serif-vedic text-xl font-bold text-stone-900 mb-1">
                {kit.name}
              </h3>
              <p className="text-xs text-stone-500 mb-4">{kit.tagline}</p>

              <div className="mb-6 pb-4 border-b border-stone-100">
                <span className="text-2xl sm:text-3xl font-black text-stone-900">₹{kit.price}</span>
                <span className="text-xs text-stone-400 ml-1.5">all-inclusive</span>
              </div>

              {/* Itemized List */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">What's in the kit:</p>
                {kit.items?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-stone-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="p-6 bg-stone-50 border-t border-stone-100">
              <p className="text-[11px] text-amber-800 font-semibold mb-3">
                Delivery: {kit.deliveryMode}
              </p>
              <button
                onClick={() => onSelectPujaForBooking()}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition"
              >
                Book with a Ceremony
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
