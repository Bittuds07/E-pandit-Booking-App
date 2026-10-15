import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Home, 
  Video, 
  Package, 
  ShieldCheck, 
  Flame, 
  Volume2,
  ArrowRight
} from 'lucide-react';
import { playTempleBell, playOmChant } from '../utils/audio';

export function PujaDetailsModal({ puja, onClose, onBookPuja, lang }) {
  if (!puja) return null;

  const [selectedMode, setSelectedMode] = useState('in_person');
  const [selectedSamagri, setSelectedSamagri] = useState('kit_complete'); // 'kit_complete' | 'pandit_brings' | 'self'

  const handlePlayMantra = () => {
    playTempleBell();
    setTimeout(() => playOmChant(), 400);
  };

  const getSamagriPrice = () => {
    if (selectedSamagri === 'kit_complete') return 1199;
    if (selectedSamagri === 'pandit_brings') return 1499;
    return 0;
  };

  const totalEstimate = puja.baseDakshina + getSamagriPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#27180e]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-[#fff8f5] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#f3e8d6] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header from Stitch */}
        <div className="bg-white px-5 py-4 border-b border-[#f3e8d6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#27180e] hover:bg-[#ffeade] transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src="https://lh3.googleusercontent.com/aida/AEtjO1WwxTi_8uuWm1T5XCgtqJBrSmRD8DMX0VKdN-eo8ctZDjBUZ4JVwM6JxlS17BnHKWuxFo7tv2XysDOY0HvV9zIAMmDfayles6-8sSwnnimYbaK76YFBmENETtj1RviaXW_FrmEkFuvhRY4a0yyDLWsKVS7bK9GG4X_u15W4_dS_SxGlhGjDSHFCi9tHThsk73jVhErwkmau49tVPE0J_5_hqpuhmUCjxI2mBHxKCzGLDjnSEb2uGW5OpHs" 
              alt="Logo" 
              className="h-7 w-auto object-contain"
            />
            <h2 className="font-serif-vedic text-base sm:text-lg font-bold text-[#27180e]">
              Puja Details
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#ffdbcf] text-[#a63500] font-bold px-2.5 py-0.5 rounded-full">
              {puja.category}
            </span>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto space-y-5">
          
          {/* Devotional Banner */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#ffe3d3] text-[#904d00] text-xs font-semibold shadow-sm border border-[#e2bfb4]">
            <Sparkles className="w-4 h-4 text-[#904d00]" />
            <p className="truncate">Auspicious Shukla Paksha Muhurats available this week</p>
          </div>

          {/* Hero Sacred Card (from Stitch) */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-[#f3e8d6] p-4 sm:p-5 flex flex-col gap-3">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#fe932c]/15 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2 relative z-10">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#ffeade] text-[#a63500] text-[11px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
                  Vedic Sanatan Vidhi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#fff1ea] text-[#5a4139] text-[11px] font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#a63500]" />
                  {puja.duration}
                </span>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdbcf] text-[#390c00] text-xs font-bold shadow-sm">
                <Star className="w-3.5 h-3.5 fill-[#a63500] text-[#a63500]" />
                <span>{puja.rating}</span>
                <span className="text-[10px] text-[#822700]">({puja.reviewCount}+)</span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="font-serif-vedic text-xl sm:text-2xl font-bold text-[#27180e]">
                {puja.title}
              </h3>
              <p className="font-serif-vedic text-xs font-semibold text-[#904d00] mt-0.5">
                {puja.sanskritTitle}
              </p>
              <p className="text-xs text-[#5a4139] leading-relaxed mt-2">
                {puja.fullDescription || puja.shortDescription}
              </p>
            </div>

            {/* Sacred Image Card */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-inner">
              <img 
                src={puja.image} 
                alt={puja.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#27180e]/90 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center gap-2 text-white text-xs font-semibold">
                  <Flame className="w-4 h-4 text-[#fe932c] animate-bounce" />
                  <span>Includes Vastu Shanti, Navagraha & Agni Havan</span>
                </div>
              </div>
            </div>

            {/* Purohit Guarantee Callout */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fff1ea] text-[#27180e] text-xs">
              <ShieldCheck className="w-6 h-6 text-[#a63500] shrink-0" />
              <div>
                <p className="font-bold text-[#27180e]">Conducted by Certified Vedic Purohits</p>
                <p className="text-[#5a4139] text-[11px]">Educated at Banaras & Tirupati Gurukuls with 12+ yrs experience</p>
              </div>
            </div>
          </div>

          {/* Mool Mantra Resonance Card */}
          {puja.mantra && (
            <div className="bg-[#ffeade] p-3.5 rounded-2xl border border-[#e2bfb4] flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#a63500] tracking-wider block">
                  Sacred Mool Mantra
                </span>
                <p className="font-serif-vedic text-xs font-semibold text-[#27180e] mt-0.5">
                  {puja.mantra}
                </p>
              </div>
              <button 
                onClick={handlePlayMantra}
                className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-[#ffdbcf] text-[#a63500] font-bold text-xs shadow-sm transition flex items-center gap-1 border border-[#e2bfb4]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            </div>
          )}

          {/* Ceremony Mode Selector (from Stitch) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-serif-vedic text-sm font-bold text-[#27180e]">
                Ceremony Mode
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00]">
                Step 1 of 3
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option A: In-person */}
              <div 
                onClick={() => setSelectedMode('in_person')}
                className={`cursor-pointer p-3.5 rounded-2xl bg-white shadow-sm transition-all flex items-start gap-3 border ${
                  selectedMode === 'in_person'
                    ? 'border-[#a63500] ring-2 ring-[#a63500]/20 bg-[#fff8f5]'
                    : 'border-[#f3e8d6] hover:border-[#fe932c]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#ffdbcf] flex items-center justify-center text-[#a63500] shrink-0 mt-0.5">
                  <Home className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#27180e]">At Your Residence</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] text-[10px] font-bold">
                      Most Auspicious
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5a4139] mt-0.5">
                    Pandit Ji travels to your venue with ceremonial items and guides your family in person.
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${selectedMode === 'in_person' ? 'text-[#a63500]' : 'text-stone-300'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              {/* Option B: Virtual */}
              <div 
                onClick={() => setSelectedMode('virtual')}
                className={`cursor-pointer p-3.5 rounded-2xl bg-white shadow-sm transition-all flex items-start gap-3 border ${
                  selectedMode === 'virtual'
                    ? 'border-[#a63500] ring-2 ring-[#a63500]/20 bg-[#fff8f5]'
                    : 'border-[#f3e8d6] hover:border-[#fe932c]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#ffeade] flex items-center justify-center text-[#904d00] shrink-0 mt-0.5">
                  <Video className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#27180e]">Virtual Live Video Puja</span>
                    <span className="text-[10px] font-bold text-[#a63500]">Interactive Sanctum</span>
                  </div>
                  <p className="text-[11px] text-[#5a4139] mt-0.5">
                    Priest recites Vedic sankalp via interactive two-way HD video call and guides rituals.
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${selectedMode === 'virtual' ? 'text-[#a63500]' : 'text-stone-300'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Samagri Inclusions (from Stitch) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-vedic text-sm font-bold text-[#27180e]">
                  Puja Samagri Inclusions
                </h4>
                <p className="text-[11px] text-[#5a4139]">Authentic, pure ingredients certified by Vedic scholars</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00]">
                Step 2 of 3
              </span>
            </div>

            <div className="space-y-2">
              <div 
                onClick={() => setSelectedSamagri('kit_complete')}
                className={`cursor-pointer p-3.5 rounded-2xl bg-white shadow-sm transition-all border ${
                  selectedSamagri === 'kit_complete'
                    ? 'border-[#a63500] ring-2 ring-[#a63500]/20 bg-[#fff8f5]'
                    : 'border-[#f3e8d6]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#ffdcc3] flex items-center justify-center text-[#904d00]">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#27180e]">Complete 42-Item Eco Kit</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdbcf] text-[#a63500] text-[10px] font-bold">
                          Recommended
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#a63500]">+₹1,199</span>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${selectedSamagri === 'kit_complete' ? 'text-[#a63500]' : 'text-stone-300'}`} />
                </div>
                <p className="text-[11px] text-[#5a4139] mt-2">
                  Delivered 1 day prior. Contains Pure Havan Kund Samidha, Ghee, Gangajal, Roli, Akshat, Navadhanya, Copper Kalash & Mango Toran.
                </p>
              </div>

              <div 
                onClick={() => setSelectedSamagri('pandit_brings')}
                className={`cursor-pointer p-3.5 rounded-2xl bg-white shadow-sm transition-all border ${
                  selectedSamagri === 'pandit_brings'
                    ? 'border-[#a63500] ring-2 ring-[#a63500]/20 bg-[#fff8f5]'
                    : 'border-[#f3e8d6]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#ffeade] flex items-center justify-center text-[#904d00]">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#27180e]">Pandit Ji Brings All Samagri</span>
                      <span className="text-xs font-bold text-[#a63500] block mt-0.5">+₹1,499</span>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${selectedSamagri === 'pandit_brings' ? 'text-[#a63500]' : 'text-stone-300'}`} />
                </div>
                <p className="text-[11px] text-[#5a4139] mt-2">
                  Hassle-free. Purohit arrives directly with consecrated hawan wood, ghee, and puja essentials.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Fixed Footer CTA (from Stitch) */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#f3e8d6] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#8e7167] uppercase font-bold tracking-wider block">
              Estimated Dakshina
            </span>
            <span className="text-xl font-extrabold text-[#a63500]">
              ₹{totalEstimate.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5a4139] hover:bg-[#ffeade]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookPuja(puja);
              }}
              className="px-5 py-2.5 rounded-full bg-[#a63500] hover:bg-[#cf4504] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <span>Proceed to Muhurat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
