import React, { useState } from 'react';
import { Search, Mic, ArrowRight, Sparkles, Home, Video, ShieldCheck, Sun } from 'lucide-react';

export function HeroSection({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedMode, 
  setSelectedMode,
  panchangData,
  onOpenPanchang,
  lang 
}) {
  const [activeLangFilter, setActiveLangFilter] = useState('all');

  const languageFilters = [
    { id: 'all', label: 'All Traditions' },
    { id: 'hindi', label: 'Hindi (हिन्दी)' },
    { id: 'sanskrit', label: 'Sanskrit (संस्कृतम्)' },
    { id: 'bengali', label: 'Bengali (বাংলা)' },
    { id: 'tamil', label: 'Tamil (தமிழ்)' },
    { id: 'marathi', label: 'Marathi (मराठी)' },
  ];

  return (
    <div className="w-full bg-[#fff8f5] pt-4 pb-2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* 1. Auspicious Panchang & Shubh Muhurat Floating Strip (from Stitch) */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-[#ffe3d3] p-4 sm:p-5 shadow-sm border border-[#e2bfb4]">
            {/* Ambient Diya Warm Glow */}
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#fe932c]/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0 w-11 h-11 rounded-full bg-[#ffdbcf] flex items-center justify-center text-[#a63500] shadow-sm">
                  <Sun className="w-6 h-6 text-[#a63500]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#904d00] ring-2 ring-[#ffe3d3] animate-pulse" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">
                      Today's Shubh Muhurat
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#a63500]/10 text-[#a63500] text-[10px] font-bold">
                      Active
                    </span>
                  </div>

                  <h2 className="font-serif-vedic text-lg sm:text-xl font-bold text-[#27180e] mt-0.5">
                    Abhijit Muhurat
                  </h2>
                  <p className="text-xs text-[#5a4139] font-medium mt-0.5">
                    11:48 AM – 12:36 PM • Shukla Paksha Dashami
                  </p>
                </div>
              </div>

              <button 
                onClick={onOpenPanchang}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-white text-[#a63500] hover:bg-[#ffeade] font-bold text-xs shadow-sm transition flex items-center gap-1 border border-[#e2bfb4]"
              >
                <span>Panchang</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-[#e2bfb4]/60 flex flex-wrap items-center justify-between text-xs text-[#5a4139] font-semibold gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#904d00]" />
                Rahu Kaal: 04:32 PM – 06:01 PM (Avoid initiation)
              </span>
              <span className="text-[#904d00] font-bold">
                Nakshatra: Rohini / Shravana
              </span>
            </div>
          </div>
        </section>

        {/* 2. Interactive Search & Voice Search Input (from Stitch) */}
        <section>
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 w-5 h-5 text-[#8e7167] pointer-events-none" />
            <input 
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Griha Pravesh, Satyanarayan, Havan, Rudrabhishek..."
              className="w-full h-12 pl-12 pr-12 rounded-full bg-white text-[#27180e] placeholder-[#8e7167] text-xs sm:text-sm font-medium shadow-sm border border-[#e2bfb4] focus:outline-none focus:ring-2 focus:ring-[#a63500] transition-all"
            />
            <button 
              aria-label="Voice Search"
              className="absolute right-3 w-8 h-8 rounded-full flex items-center justify-center text-[#a63500] hover:bg-[#ffeade] transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Vedic Language Filter Scroll (from Stitch) */}
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar -mx-2 px-2 mt-1">
            {languageFilters.map((lf) => {
              const isSelected = activeLangFilter === lf.id;
              return (
                <button
                  key={lf.id}
                  onClick={() => setActiveLangFilter(lf.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#a63500] text-white shadow-sm'
                      : 'bg-[#ffeade] text-[#5a4139] hover:bg-[#ffdcc3]'
                  }`}
                >
                  {lf.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Ritual Mode Selector Segmented Switch (from Stitch) */}
        <section>
          <div className="p-1.5 rounded-2xl bg-[#ffeade] flex items-center shadow-inner border border-[#e2bfb4]">
            <button
              onClick={() => setSelectedMode('in_person')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                selectedMode === 'in_person' || selectedMode === 'all'
                  ? 'bg-white text-[#a63500] shadow-sm'
                  : 'text-[#5a4139] hover:text-[#a63500]'
              }`}
            >
              <Home className="w-4 h-4 text-[#a63500]" />
              <span>In-Person at Home</span>
            </button>

            <button
              onClick={() => setSelectedMode('virtual')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                selectedMode === 'virtual'
                  ? 'bg-white text-[#a63500] shadow-sm'
                  : 'text-[#5a4139] hover:text-[#a63500]'
              }`}
            >
              <Video className="w-4 h-4 text-[#904d00]" />
              <span>Virtual Live Sankalp</span>
            </button>
          </div>

          <div className="mt-2 px-1 flex items-center justify-between text-xs text-[#5a4139] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
              Purohit arrives with purified Samagri
            </span>
            <span className="text-[#904d00] font-bold">
              Available anywhere in Bangalore
            </span>
          </div>
        </section>

      </div>
    </div>
  );
}
