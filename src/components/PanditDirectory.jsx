import React, { useState } from 'react';
import { Star, ShieldCheck, Award, MapPin, Globe, Clock, CheckCircle2, Video, Home, Phone, Calendar } from 'lucide-react';

export function PanditDirectory({ pandits, onBookWithPandit, lang }) {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const languages = ['all', 'Hindi', 'Sanskrit', 'Telugu', 'Tamil', 'Bengali', 'Marathi', 'Gujarati', 'English'];
  const specialties = ['all', 'Griha & Vastu', 'Health & Prosperity', 'Sanskar & Dosha', 'Astrology & Kundali'];

  const filteredPandits = pandits.filter(p => {
    if (selectedLanguage !== 'all' && !p.languages.some(l => l.toLowerCase() === selectedLanguage.toLowerCase())) {
      return false;
    }
    if (selectedSpecialty !== 'all' && !p.specialties.includes(selectedSpecialty)) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3 border border-amber-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Certified Vedic Gurukul Acharyas</span>
        </div>
        <h2 className="font-serif-vedic text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
          {lang === 'hi' ? 'सत्यापित वैदिक पुरोहित' : 'Verified Vedic Pandits & Acharyas'}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {lang === 'hi'
            ? 'काशी, तिरुपति एवं हरिद्वार गुरुकुलों से दीक्षित, वैदिक मंत्रोच्चार में पारंगत आचार्यों से कराएं अपना अनुष्ठान।'
            : 'Initiated from premier Veda Pathshalas of Kashi, Tirupati & Haridwar. Transparent Dakshina and background-verified credentials.'}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
        
        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs font-semibold text-stone-600">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l === 'all' ? 'All Languages' : l}
              </option>
            ))}
          </select>
        </div>

        {/* Specialty Filter */}
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs font-semibold text-stone-600">Specialty:</span>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Specialties' : s}
              </option>
            ))}
          </select>
        </div>

        {/* Active Count */}
        <div className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Showing {filteredPandits.length} Verified Acharyas
        </div>

      </div>

      {/* Pandits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPandits.map((pandit) => {
          const isVerified = pandit.kycStatus === 'verified';

          return (
            <div 
              key={pandit.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Top: Avatar, Lineage, Badge */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img 
                      src={pandit.avatar} 
                      alt={pandit.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-md"
                    />
                    {isVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow" title="Vedic Verified Acharya">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-serif-vedic text-base font-bold text-stone-900 truncate">
                        {pandit.name}
                      </h3>
                    </div>
                    <p className="text-xs text-amber-700 font-semibold truncate">
                      {pandit.title}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {pandit.lineage}
                    </p>
                  </div>
                </div>

                {/* Rating & Experience Stats */}
                <div className="grid grid-cols-3 gap-2 bg-amber-50/50 p-2.5 rounded-2xl border border-amber-100 text-center mb-4">
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-medium">Rating</p>
                    <p className="text-xs font-bold text-stone-900 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{pandit.rating}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-medium">Experience</p>
                    <p className="text-xs font-bold text-stone-900">{pandit.experienceYears} Years</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-medium">Ceremonies</p>
                    <p className="text-xs font-bold text-stone-900">{pandit.completedPujas}+</p>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-xs text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                  {pandit.bio}
                </p>

                {/* Badges / Languages */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{pandit.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{pandit.city} ({pandit.travelRadiusKm} km travel radius)</span>
                  </div>
                </div>

                {/* Verification Badge Pill */}
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{pandit.verificationBadge}</span>
                </div>

              </div>

              {/* Card Footer Action */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {pandit.modes.includes('in_person') && (
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900" title="Home visits available">
                      <Home className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {pandit.modes.includes('virtual') && (
                    <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-900" title="Virtual online pujas available">
                      <Video className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onBookWithPandit(pandit)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book with Acharya Ji</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
