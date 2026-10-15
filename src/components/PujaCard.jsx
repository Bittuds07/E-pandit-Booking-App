import React from 'react';
import { Clock, Star, ArrowRight, Video, Home } from 'lucide-react';

export function PujaCard({ puja, onSelectPuja, onBookPuja, lang }) {
  const isMostPopular = puja.id === 'puja-griha-pravesh' || puja.id === 'puja-satyanarayan';

  return (
    <article 
      onClick={() => onSelectPuja(puja)}
      className="group relative rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md border border-[#f3e8d6] hover:border-[#fe932c] transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Card Image Banner */}
      <div className="relative h-36 w-full overflow-hidden bg-[#fff1ea]">
        <img 
          src={puja.image} 
          alt={puja.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#27180e]/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          {isMostPopular ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#fe932c] text-[#27180e] text-[10px] font-bold shadow-sm">
              Most Popular ★
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-[#5a4139] text-[10px] font-semibold backdrop-blur-sm">
              {puja.category}
            </span>
          )}

          <div className="flex items-center gap-1 bg-[#27180e]/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
            <Star className="w-3 h-3 fill-[#fe932c] text-[#fe932c]" />
            <span>{puja.rating}</span>
          </div>
        </div>

        {/* Duration badge on image bottom */}
        <span className="absolute bottom-2.5 left-2.5 text-white text-[11px] font-semibold flex items-center gap-1 drop-shadow">
          <Clock className="w-3.5 h-3.5 text-[#ffdcc3]" />
          <span>{puja.duration}</span>
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif-vedic text-base font-bold text-[#27180e] group-hover:text-[#a63500] transition-colors leading-snug line-clamp-1">
            {puja.title}
          </h3>
          <p className="text-[11px] text-[#5a4139] line-clamp-2 mt-1 leading-relaxed">
            {puja.shortDescription}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-[#fff1ea] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8e7167] uppercase tracking-wider block font-semibold leading-none">
              Dakshina from
            </span>
            <span className="text-base font-extrabold text-[#a63500] leading-tight block mt-0.5">
              ₹{puja.baseDakshina?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookPuja(puja);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#a63500] hover:bg-[#cf4504] text-white text-xs font-bold shadow-sm transition flex items-center gap-1"
            >
              <span>Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
