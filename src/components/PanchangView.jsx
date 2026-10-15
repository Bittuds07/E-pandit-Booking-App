import React from 'react';
import { Sparkles, Sun, Moon, Clock, Compass, ShieldAlert, Award } from 'lucide-react';

export function PanchangView({ panchang, lang }) {
  if (!panchang) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 border border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Vedic Panchang & Planetary Muhurat</span>
        </div>
        <h2 className="font-serif-vedic text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          {lang === 'hi' ? 'दैनिक पंचांग एवं शुभ मुहूर्त' : 'Daily Vedic Panchang & Shubh Muhurat'}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base">
          {panchang.date} • {panchang.todaysFestivity}
        </p>
      </div>

      {/* Main Panchang Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        
        {/* Tithi Card */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-stone-400">Tithi</p>
            <p className="font-serif-vedic font-bold text-stone-900 text-sm mt-0.5">{panchang.tithi}</p>
          </div>
        </div>

        {/* Nakshatra Card */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-stone-400">Nakshatra</p>
            <p className="font-serif-vedic font-bold text-stone-900 text-sm mt-0.5">{panchang.nakshatra}</p>
          </div>
        </div>

        {/* Abhijit Muhurat Card */}
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-emerald-800">Abhijit Muhurat</p>
            <p className="font-serif-vedic font-bold text-emerald-950 text-sm mt-0.5">{panchang.abhijitMuhurat}</p>
          </div>
        </div>

        {/* Rahu Kaal Card */}
        <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-rose-800">Rahu Kaal (Inauspicious)</p>
            <p className="font-serif-vedic font-bold text-rose-950 text-sm mt-0.5">{panchang.rahuKaal}</p>
          </div>
        </div>

      </div>

      {/* Sun & Astrological Yogas */}
      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-12">
        <div>
          <p className="text-stone-500">Sunrise</p>
          <p className="font-bold text-stone-900 text-sm">{panchang.sunrise}</p>
        </div>
        <div>
          <p className="text-stone-500">Sunset</p>
          <p className="font-bold text-stone-900 text-sm">{panchang.sunset}</p>
        </div>
        <div>
          <p className="text-stone-500">Yoga</p>
          <p className="font-bold text-stone-900 text-sm">{panchang.yoga}</p>
        </div>
        <div>
          <p className="text-stone-500">Brahma Muhurta</p>
          <p className="font-bold text-stone-900 text-sm">{panchang.brahmaMuhurta}</p>
        </div>
      </div>

      {/* 12 Rashi Daily Rashifal Section (Phase 2 Roadmap item from PRD!) */}
      <div>
        <div className="text-center mb-6">
          <h3 className="font-serif-vedic text-2xl font-bold text-stone-900">
            {lang === 'hi' ? 'दैनिक राशिफल एवं वैदिक उपाय' : 'Daily 12 Rashi Horoscope & Vedic Remedies'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Personalized astrological guidance for spiritual growth & prosperity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {panchang.rashifalHighlights?.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm hover:border-amber-400 transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold font-serif-vedic">
                  {idx + 1}
                </span>
                <h4 className="font-serif-vedic font-bold text-stone-900 text-sm">
                  {item.rashi}
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.fortune}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
