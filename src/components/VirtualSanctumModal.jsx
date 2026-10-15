import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Flame, 
  Bell, 
  Volume2, 
  Sparkles, 
  MessageSquare, 
  Maximize2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTempleBell, playShankh, playOmChant } from '../utils/audio';

export function VirtualSanctumModal({ booking, onClose }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [ahutiCount, setAhutiCount] = useState(11);
  const [ahutiFired, setAhutiFired] = useState(false);
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);
  const [bellRinging, setBellRinging] = useState(false);
  const [shankhActive, setShankhActive] = useState(false);
  const [sankalpCompleted, setSankalpCompleted] = useState(false);

  const mantras = [
    {
      sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
      meaning: "May the divine Supreme Light illuminate our intellect and dispel all spiritual ignorance."
    },
    {
      sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्य pushीय मामृतात् ॥",
      meaning: "We worship the Three-Eyed Lord Shiva, who nourishes and rejuvenates all beings. May we be liberated."
    },
    {
      sanskrit: "ॐ नमो भगवते वासुदेवाय । शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम् ॥",
      meaning: "Salutations to Lord Vishnu, embodiment of serene peace, resting upon the celestial serpent."
    },
    {
      sanskrit: "ॐ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥",
      meaning: "Auspiciousness of all that is auspicious, accomplisher of every divine intent, Goddess Durga, salutations to You."
    }
  ];

  // Rotate mantras gently every 14 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMantraIndex((prev) => (prev + 1) % mantras.length);
    }, 14000);
    return () => clearInterval(interval);
  }, [mantras.length]);

  const handleOfferAhuti = () => {
    setAhutiFired(true);
    setAhutiCount((prev) => prev + 1);
    playOmChant();

    confetti({
      particleCount: 40,
      angle: 90,
      spread: 60,
      origin: { x: 0.5, y: 0.7 },
      colors: ['#ea580c', '#f59e0b', '#dc2626', '#fbbf24']
    });

    setTimeout(() => setAhutiFired(false), 1200);
  };

  const handleRingBell = () => {
    setBellRinging(true);
    playTempleBell();
    setTimeout(() => setBellRinging(false), 1500);
  };

  const handleBlowShankh = () => {
    setShankhActive(true);
    playShankh();
    setTimeout(() => setShankhActive(false), 2500);
  };

  const handleCompleteSankalp = () => {
    setSankalpCompleted(true);
    playTempleBell();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950 flex flex-col text-amber-50">
      
      {/* Top Header Bar */}
      <div className="bg-amber-950/90 border-b border-amber-800/80 px-4 py-3 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center animate-diya">
            <span>🪔</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-vedic font-bold text-base text-amber-100">
                Vedam Virtual Sanctum
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse">
                LIVE CEREMONY
              </span>
            </div>
            <p className="text-[11px] text-amber-300">
              {booking?.pujaTitle} • Booking ID: #{booking?.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-900/60 px-3 py-1 rounded-full border border-amber-700/60 text-xs text-amber-300">
            <Users className="w-3.5 h-3.5" />
            <span>Yajman Gotra: <strong>{booking?.gotra || 'Kashyap'}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 hover:text-white transition border border-stone-600"
            title="Leave Sanctum"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video Arena */}
      <div className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto">
        
        {/* Priest Main Live Video Stream (2 cols on large screen) */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-stone-900 border-2 border-amber-600/60 shadow-2xl flex flex-col justify-between min-h-[380px] sm:min-h-[460px]">
          
          {/* Simulated Authentic Vedic Altar & Priest Video Feed */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&auto=format&fit=crop&q=80" 
              alt="Sacred Altar" 
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />
          </div>

          {/* Priest Overlay Badge */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-xs">
              <img 
                src={booking?.panditAvatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"} 
                alt="Priest" 
                className="w-5 h-5 rounded-full object-cover border border-amber-400"
              />
              <span className="font-bold text-amber-200">{booking?.panditName || 'Pandit Radheshyam Shastri'}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">• Speaking</span>
            </div>

            <div className="bg-stone-950/80 px-2.5 py-1 rounded-full text-[11px] text-amber-300 border border-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>HD 1080p Stream</span>
            </div>
          </div>

          {/* Center Sacred Hawan Flame Animation */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none">
            <div className={`relative transition-all duration-300 ${ahutiFired ? 'scale-125' : 'scale-100'}`}>
              <div className="w-24 h-24 rounded-full bg-orange-600/30 blur-2xl animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl animate-diya">
                🔥
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-xs font-serif-vedic text-amber-200 font-semibold shadow">
                {ahutiFired ? 'स्वाहा! (Offering Received)' : `पवित्र अग्नि कुण्ड • ${ahutiCount} Ahutis Offered`}
              </span>
            </div>
          </div>

          {/* Subtitle / Live Mantra Scrolling Box */}
          <div className="relative z-10 p-4 bg-stone-950/90 backdrop-blur-md border-t border-amber-700/60">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Current Vedic Chanting (ऋग्वेद / यजुर्वेद)
              </span>
              <p className="font-serif-vedic text-sm sm:text-base text-amber-100 font-semibold tracking-wide mt-1">
                {mantras[currentMantraIndex].sanskrit}
              </p>
              <p className="text-[11px] text-amber-300/80 font-light italic mt-0.5">
                "{mantras[currentMantraIndex].meaning}"
              </p>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Devotee Local Preview & Sacred Interactive Controls */}
        <div className="space-y-4 flex flex-col justify-between">
          
          {/* Devotee Self View */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-amber-700/60 aspect-video shadow-lg">
            {cameraOn ? (
              <div className="relative w-full h-full bg-stone-800 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" 
                  alt="Devotee" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-stone-950/80 px-2 py-0.5 rounded text-[10px] text-amber-200">
                  You ({booking?.yajmanName || 'Ramesh Kumar'})
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 text-xs">
                <VideoOff className="w-8 h-8 mb-1" />
                <span>Camera Off</span>
              </div>
            )}

            {/* In-Video Local Controls */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button 
                onClick={() => setMicOn(!micOn)}
                className={`p-1.5 rounded-full text-xs transition ${micOn ? 'bg-stone-900/80 text-white' : 'bg-red-600 text-white'}`}
              >
                {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => setCameraOn(!cameraOn)}
                className={`p-1.5 rounded-full text-xs transition ${cameraOn ? 'bg-stone-900/80 text-white' : 'bg-red-600 text-white'}`}
              >
                {cameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Interactive Sacred Hawan & Ritual Controls */}
          <div className="bg-stone-900/90 border border-amber-700/60 rounded-3xl p-4 space-y-3 shadow-xl">
            <h4 className="font-serif-vedic text-xs uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
              <span>🕉️</span>
              <span>Devotee Sacred Ritual Actions</span>
            </h4>

            {/* Offer Ahuti Button */}
            <button
              onClick={handleOfferAhuti}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 hover:from-orange-500 hover:to-amber-500 text-stone-950 font-black text-sm shadow-lg shadow-orange-600/30 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 text-stone-950 animate-bounce" />
              <span>Offer Ahuti to Hawan Fire (स्वाहा)</span>
            </button>

            {/* Bell & Shankh Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRingBell}
                className={`py-2 px-3 rounded-xl border border-amber-600/60 bg-amber-950/60 hover:bg-amber-900 text-xs font-semibold text-amber-200 transition flex items-center justify-center gap-2 ${
                  bellRinging ? 'ring-2 ring-yellow-400 text-yellow-300' : ''
                }`}
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Ring Bell (घंटी)</span>
              </button>

              <button
                onClick={handleBlowShankh}
                className={`py-2 px-3 rounded-xl border border-amber-600/60 bg-amber-950/60 hover:bg-amber-900 text-xs font-semibold text-amber-200 transition flex items-center justify-center gap-2 ${
                  shankhActive ? 'ring-2 ring-yellow-400 text-yellow-300' : ''
                }`}
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Blow Shankh (शंख)</span>
              </button>
            </div>

            {/* Sankalp Affirmation Card */}
            <div className="bg-amber-950/60 p-3 rounded-2xl border border-amber-800/80 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-300">Vedic Sankalp Recitation:</span>
                {sankalpCompleted ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Affirmed</span>
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed italic mb-2">
                "मम आत्मनः सकलदुरितोपशमनपूर्वकं... सर्वकामसिद्ध्यर्थे {booking?.pujaTitle} कर्म अहं करिष्ये।"
              </p>
              {!sankalpCompleted ? (
                <button
                  onClick={handleCompleteSankalp}
                  className="w-full py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 font-semibold text-xs border border-amber-600/60 transition"
                >
                  I Affirm My Sankalp (सङ्कल्पं समर्पयामि)
                </button>
              ) : (
                <div className="text-center py-1 text-emerald-300 font-semibold text-xs">
                  ✨ Sankalp sealed in divine presence.
                </div>
              )}
            </div>

          </div>

          {/* Bottom Bar: End Call */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-300 text-xs font-semibold border border-stone-700 transition"
            >
              Exit Sanctum Room
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
