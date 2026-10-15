import React, { useState } from 'react';
import { 
  Bell, 
  Volume2, 
  MapPin, 
  ChevronDown, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  Package, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { playTempleBell, playShankh } from '../utils/audio';

export function Navbar({ 
  currentUser, 
  allUsers, 
  onSwitchUser, 
  activeTab, 
  setActiveTab, 
  bookingCount,
  onOpenProfile,
  lang,
  setLang
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);
  const [shankhBlowing, setShankhBlowing] = useState(false);

  const handleRingBell = () => {
    setBellRinging(true);
    playTempleBell();
    setTimeout(() => setBellRinging(false), 1500);
  };

  const handleBlowShankh = () => {
    setShankhBlowing(true);
    playShankh();
    setTimeout(() => setShankhBlowing(false), 2500);
  };

  const navLinks = [
    { id: 'pujas', label: lang === 'hi' ? 'पूजाएं' : 'Sacred Pujas', icon: Flame },
    { id: 'pandits', label: lang === 'hi' ? 'पंडित जी' : 'Verified Pandits', icon: Users },
    { id: 'bookings', label: lang === 'hi' ? 'मेरी बुकिंग' : 'Bookings', icon: Calendar, badge: bookingCount },
    { id: 'panchang', label: lang === 'hi' ? 'पंचांग' : 'Shubh Muhurat', icon: Sparkles },
    { id: 'samagri', label: lang === 'hi' ? 'सामग्री' : 'Samagri Kits', icon: Package },
  ];

  if (currentUser?.role === 'pandit') {
    navLinks.unshift({ id: 'pandit-dashboard', label: lang === 'hi' ? 'पंडित पोर्टल' : 'Pandit Portal', icon: Users });
  }

  if (currentUser?.role === 'admin') {
    navLinks.unshift({ id: 'admin-dashboard', label: lang === 'hi' ? 'एडमिन' : 'Admin Console', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-50 bg-[#fff8f5]/90 backdrop-blur-xl border-b border-[#f3e8d6] shadow-[0_1px_8px_rgba(41,26,16,0.04)] transition-all">
      
      {/* Top Auspicious Ticker */}
      <div className="bg-[#a63500] text-xs py-1 px-4 text-center text-white flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 mx-auto">
          <span>🕉️</span>
          <span>
            {lang === 'hi' 
              ? 'शुभ मुहूर्त: अभिजित मुहूर्त 11:48 AM – 12:36 PM • शुक्ल पक्ष दशमी | 100% सत्यापित वैदिक पुरोहित'
              : "Today's Shubh Muhurat: Abhijit 11:48 AM – 12:36 PM • Shukla Paksha Dashami | 100% Verified Rigvedic Purohits"}
          </span>
          <span className="hidden sm:inline bg-[#cf4504] px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-bold">
            Vedic Sanctity
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="hover:bg-white/20 transition px-2 py-0.5 rounded font-bold"
          >
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City Selector from Stitch */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('pujas')}>
            <img 
              src="https://lh3.googleusercontent.com/aida/AEtjO1WwxTi_8uuWm1T5XCgtqJBrSmRD8DMX0VKdN-eo8ctZDjBUZ4JVwM6JxlS17BnHKWuxFo7tv2XysDOY0HvV9zIAMmDfayles6-8sSwnnimYbaK76YFBmENETtj1RviaXW_FrmEkFuvhRY4a0yyDLWsKVS7bK9GG4X_u15W4_dS_SxGlhGjDSHFCi9tHThsk73jVhErwkmau49tVPE0J_5_hqpuhmUCjxI2mBHxKCzGLDjnSEb2uGW5OpHs" 
              alt="E-Pandit Sacred Kalash & Diya Logo" 
              className="h-9 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-bold text-[#904d00] uppercase tracking-widest leading-none">
                E-Pandit
              </span>
              <div className="flex items-center text-xs font-semibold text-[#27180e] hover:text-[#a63500] transition-colors mt-0.5">
                <span className="truncate max-w-[150px]">Bangalore, Whitefield</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#904d00] ml-0.5" />
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#a63500] text-white shadow-sm'
                      : 'text-[#5a4139] hover:text-[#27180e] hover:bg-[#ffeade]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#a63500]'}`} />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#fe932c] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Sounds, Persona Switcher & Profile */}
          <div className="flex items-center gap-2">
            
            {/* Temple Bell */}
            <button
              onClick={handleRingBell}
              title="Ring Temple Bell (घंटी)"
              className={`p-2 rounded-full border border-[#f3e8d6] bg-[#ffffff] hover:bg-[#ffeade] text-[#a63500] transition shadow-sm ${
                bellRinging ? 'scale-110 ring-2 ring-[#fe932c] text-[#fe932c]' : ''
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Sacred Shankh */}
            <button
              onClick={handleBlowShankh}
              title="Blow Sacred Shankh (शंख)"
              className={`p-2 rounded-full border border-[#f3e8d6] bg-[#ffffff] hover:bg-[#ffeade] text-[#a63500] transition shadow-sm ${
                shankhBlowing ? 'scale-110 ring-2 ring-[#fe932c] text-[#fe932c]' : ''
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffeade] hover:bg-[#ffdcc3] border border-[#f3e8d6] text-xs font-semibold text-[#27180e] transition shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#a63500] text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser?.role === 'pandit' ? '📿' : currentUser?.role === 'admin' ? '🛡️' : '🕉️'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold leading-none block">{currentUser?.name?.split(' ')[0]}</span>
                  <span className="text-[10px] text-[#904d00] capitalize block">{currentUser?.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#904d00]" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#f3e8d6] rounded-2xl shadow-xl py-2 z-50 text-[#27180e]">
                  <div className="px-3 py-1.5 border-b border-[#ffeade] text-[11px] text-[#904d00] font-bold">
                    ⚡ Quick Persona Switcher
                  </div>
                  {allUsers?.map((u) => {
                    const isSelected = u.id === currentUser?.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u.id);
                          setShowRoleDropdown(false);
                          if (u.role === 'pandit') setActiveTab('pandit-dashboard');
                          else if (u.role === 'admin') setActiveTab('admin-dashboard');
                          else setActiveTab('pujas');
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition ${
                          isSelected ? 'bg-[#ffeade] font-bold text-[#a63500]' : 'hover:bg-[#fff8f5] text-[#5a4139]'
                        }`}
                      >
                        <span className="text-base">
                          {u.role === 'pandit' ? '📿' : u.role === 'admin' ? '🛡️' : '🕉️'}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-[#27180e]">{u.name}</p>
                          <p className="text-[10px] text-[#904d00] capitalize">{u.role} Persona</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="p-0.5 rounded-full ring-2 ring-[#fe932c]/40 hover:ring-[#a63500] transition"
              title="Devotee Profile & Gotra Settings"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTuQ-szJVyQtc3bLTrWOAf9cwjt9pSm9n1qG0Oar88NnAi6TZxfm6snXxXAu3d93gjONsUwzeHg9WH5B3ThHGkmjFQvmlac6D_N3hh4ysG5C9_Q40Pet4Aw8V4wAMwSHD8PZCx9F1HRitoK_q-zDAM6sxkM36iXn27qP-rbuTgh11-7XU6xRLkw9SIIWWTstL2qVe7QRmnFXlg2X-h6_KXAkNTMF5YHqW58Gg58vMJ0V79RHdNliGn" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#5a4139] hover:bg-[#ffeade]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fff8f5] border-t border-[#f3e8d6] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-[#a63500] text-white font-bold' : 'text-[#5a4139] hover:bg-[#ffeade]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#fe932c] text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
