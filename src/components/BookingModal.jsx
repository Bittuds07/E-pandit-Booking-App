import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  QrCode,
  Tag,
  Flame,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTempleBell, playShankh } from '../utils/audio';

export function BookingModal({ 
  puja, 
  initialPandit, 
  allPandits, 
  samagriKits, 
  currentUser, 
  onClose, 
  onBookingSuccess,
  lang 
}) {
  const [step, setStep] = useState(2); // 2: Muhurat & Sankalp, 3: Dakshina & Checkout

  // Calendar Selection State from Stitch
  const [selectedDay, setSelectedDay] = useState('16'); // 15, 16, 17, 18, 19, 20, 21
  const [selectedSlot, setSelectedSlot] = useState('07:30 AM – 11:00 AM (Brahma & Abhijit)');
  const [mode, setMode] = useState('in_person');
  const [selectedPanditId, setSelectedPanditId] = useState(initialPandit?.id || '');

  // Devotee & Sankalp State from Stitch
  const [yajmanName, setYajmanName] = useState(currentUser?.name || 'Ramesh Sharma');
  const [gotra, setGotra] = useState(currentUser?.gotra || 'Kashyap');
  const [familyMembers, setFamilyMembers] = useState('Sunita Sharma (Wife), Aarav (Son)');
  const [sankalpIntent, setSankalpIntent] = useState('New Residence Possession • Peace & Abundance');
  const [venueAddress, setVenueAddress] = useState(currentUser?.address || 'Flat 402, Shanti Heights, Whitefield, Bangalore');
  const [samagriType, setSamagriType] = useState('kit_complete'); // 'kit_complete' | 'pandit_brings' | 'self'
  const [paymentMethod, setPaymentMethod] = useState('UPI (Instant PhonePe / GPay)');
  const [couponApplied, setCouponApplied] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const eligiblePandits = allPandits.filter(p => p.kycStatus === 'verified');
  const assignedPandit = allPandits.find(p => p.id === selectedPanditId) || eligiblePandits[0] || allPandits[0];

  // Bill Calculations based on Stitch Checkout Screen
  const panditDakshina = Math.round((puja?.baseDakshina || 3100) * (assignedPandit?.pricingMultiplier || 1.0));
  const samagriCost = samagriType === 'kit_complete' ? 1199 : samagriType === 'pandit_brings' ? 1499 : 0;
  const travelFee = 150;
  const platformFee = 99;
  const couponDiscount = couponApplied ? 250 : 0;
  const totalAmount = Math.max(0, panditDakshina + samagriCost + travelFee + platformFee - couponDiscount);

  const daysList = [
    { day: '15', weekday: 'Thu', tithi: 'Dashami', isAuspicious: false },
    { day: '16', weekday: 'Fri', tithi: 'Pushya', isAuspicious: true, badge: 'Shubh ★' },
    { day: '17', weekday: 'Sat', tithi: 'Dvadashi', isAuspicious: false },
    { day: '18', weekday: 'Sun', tithi: 'Uttara', isAuspicious: true, badge: 'Ekadashi' },
    { day: '19', weekday: 'Mon', tithi: 'Trayodashi', isAuspicious: false },
    { day: '20', weekday: 'Tue', tithi: 'Chaturdashi', isAuspicious: false },
    { day: '21', weekday: 'Wed', tithi: 'Ashwini', isAuspicious: true, badge: 'Purnima' },
  ];

  const handleConfirmAndPay = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        pujaId: puja.id,
        panditId: assignedPandit?.id,
        mode,
        date: `2026-10-${selectedDay}`,
        slot: selectedSlot,
        samagriKitId: samagriType === 'kit_complete' ? 'kit-complete-hawan' : null,
        samagriOption: samagriType === 'kit_complete' ? 'delivered_home' : 'pandit_brings',
        venueAddress,
        gotra,
        yajmanName,
        specialInstructions: `${sankalpIntent}. Family members: ${familyMembers}`,
        paymentMethod
      };

      const res = await onBookingSuccess(payload);
      setConfirmedBooking(res);
      playTempleBell();
      setTimeout(() => playShankh(), 400);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#27180e]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-[#fff8f5] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#f3e8d6] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-white px-5 py-3.5 border-b border-[#f3e8d6] flex items-center justify-between">
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
              Booking Ceremony Flow
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00] bg-[#ffeade] px-2.5 py-1 rounded-full">
              Vikram Samvat 2083
            </span>
          </div>
        </div>

        {/* Progress Stepper (from Stitch) */}
        {!confirmedBooking && (
          <div className="px-5 pt-3 pb-2 bg-[#fff1ea]">
            <div className="flex items-center justify-between relative max-w-sm mx-auto">
              <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-[#f1d4c4]" />
              <div 
                className="absolute left-6 top-3.5 h-0.5 bg-[#a63500] transition-all duration-300" 
                style={{ width: step === 2 ? '50%' : '100%' }}
              />

              {/* Step 1 */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div className="w-7 h-7 rounded-full bg-[#a63500] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  ✓
                </div>
                <span className="text-[10px] text-[#5a4139] font-medium">Service</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all ${
                  step === 2 ? 'bg-[#fe932c] text-[#27180e] ring-2 ring-[#a63500] animate-pulse' : 'bg-[#a63500] text-white'
                }`}>
                  2
                </div>
                <span className={`text-[10px] font-bold ${step === 2 ? 'text-[#a63500]' : 'text-[#5a4139]'}`}>
                  Muhurat & Sankalp
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 3 ? 'bg-[#fe932c] text-[#27180e] ring-2 ring-[#a63500]' : 'bg-[#f1d4c4] text-[#5a4139]'
                }`}>
                  3
                </div>
                <span className={`text-[10px] font-bold ${step === 3 ? 'text-[#a63500]' : 'text-[#5a4139]'}`}>
                  Dakshina & Checkout
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[66vh] overflow-y-auto space-y-5">
          
          {/* CONFIRMATION SCREEN */}
          {confirmedBooking ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#a63500] bg-[#ffdbcf] px-3 py-1 rounded-full border border-[#e2bfb4]">
                  SHUBH SANKALP REGISTERED • #{confirmedBooking.id}
                </span>
                <h3 className="font-serif-vedic text-2xl font-bold text-[#27180e] mt-2">
                  Auspicious Booking Confirmed!
                </h3>
                <p className="text-xs text-[#5a4139] max-w-md mx-auto mt-1 leading-relaxed">
                  Har Har Mahadev! <strong>{confirmedBooking.panditName}</strong> has accepted your Sankalp for <strong>{confirmedBooking.date}</strong> ({confirmedBooking.slot}).
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#f3e8d6] text-left text-xs space-y-2 max-w-md mx-auto shadow-sm">
                <div className="flex justify-between">
                  <span className="text-[#8e7167]">Ceremony:</span>
                  <span className="font-bold text-[#27180e]">{confirmedBooking.pujaTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e7167]">Yajman & Gotra:</span>
                  <span className="font-semibold text-[#27180e]">{confirmedBooking.yajmanName} ({confirmedBooking.gotra})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e7167]">Venue:</span>
                  <span className="font-semibold text-[#27180e] truncate max-w-[240px]">{confirmedBooking.venueAddress}</span>
                </div>
                <div className="flex justify-between border-t border-[#f3e8d6] pt-2 font-black text-sm">
                  <span>Dakshina Paid:</span>
                  <span className="text-[#a63500]">₹{confirmedBooking.pricing?.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#a63500] hover:bg-[#cf4504] text-white font-bold text-xs shadow-md transition flex items-center gap-2 mx-auto"
                >
                  <span>Track Live on Milestone Timeline</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 2: MUHURAT CALENDAR & SANKALP PATRA (from Stitch Screen 7a34fbeb) */}
              {step === 2 && (
                <div className="space-y-5">
                  
                  {/* Service Context Banner */}
                  <div className="bg-[#ffeade] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-[#e2bfb4]">
                    <img 
                      src={puja.image} 
                      alt={puja.title} 
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-1 bg-[#ffdbcf] px-2 py-0.5 rounded-full mb-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#15803d]" />
                        <span className="text-[10px] font-bold text-[#a63500] uppercase tracking-wider">Vedic Certified</span>
                      </div>
                      <h3 className="font-serif-vedic text-sm font-bold text-[#27180e] truncate">
                        {puja.title}
                      </h3>
                      <p className="text-[11px] text-[#5a4139]">
                        {puja.duration} • Vastu & Navagraha Shanti
                      </p>
                    </div>
                  </div>

                  {/* Shubh Muhurat Calendar Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-serif-vedic text-sm sm:text-base font-bold text-[#27180e]">
                          Shubh Muhurat Calendar
                        </h4>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#904d00]">
                          Kartik Shukla Paksha • Vikram Samvat 2083
                        </p>
                      </div>
                      <span className="bg-[#ffe3d3] text-[#27180e] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Oct 2026
                      </span>
                    </div>

                    {/* Auspicious Yoga Notice (from Stitch) */}
                    <div className="bg-[#ffe3d3] rounded-xl p-3 flex items-center gap-2.5 border border-[#e2bfb4]">
                      <Sparkles className="w-5 h-5 text-[#904d00] shrink-0" />
                      <p className="text-xs text-[#5a4139]">
                        <strong className="text-[#a63500] font-bold">Ravi Pushya Yoga</strong> on 16th Oct is supremely auspicious for entering a new dwelling and invoking Agni.
                      </p>
                    </div>

                    {/* Horizontal Day Scroller (from Stitch) */}
                    <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar -mx-2 px-2 mt-2">
                      {daysList.map((d) => {
                        const isSelected = selectedDay === d.day;
                        return (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => setSelectedDay(d.day)}
                            className={`flex flex-col items-center justify-between min-w-[70px] h-20 p-2 rounded-xl text-center shrink-0 transition-all relative ${
                              isSelected
                                ? 'bg-[#a63500] text-white shadow-md font-bold'
                                : 'bg-white text-[#27180e] border border-[#f3e8d6] hover:bg-[#ffeade]'
                            }`}
                          >
                            {d.badge && (
                              <span className={`absolute -top-1.5 font-bold text-[9px] px-1.5 py-0.2 rounded-full uppercase shadow-sm ${
                                isSelected ? 'bg-[#fe932c] text-[#27180e]' : 'bg-[#ffdcc3] text-[#904d00]'
                              }`}>
                                {d.badge}
                              </span>
                            )}
                            <span className={`text-[10px] uppercase font-semibold mt-0.5 ${isSelected ? 'text-[#ffdbcf]' : 'text-[#8e7167]'}`}>
                              {d.weekday}
                            </span>
                            <span className="font-serif-vedic text-base font-black">
                              {d.day}
                            </span>
                            <span className={`text-[10px] font-medium ${isSelected ? 'text-[#ffdbcf]' : 'text-[#5a4139]'}`}>
                              {d.tithi}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slot Selection (from Stitch) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#27180e]">Select Puja Kaal / Time Slot</span>
                      <span className="text-[10px] font-bold text-[#904d00]">IST (+05:30)</span>
                    </div>

                    {[
                      { 
                        id: '07:30 AM – 11:00 AM (Brahma & Abhijit)', 
                        time: '07:30 AM – 11:00 AM', 
                        desc: 'Brahma & Abhijit Muhurat • Optimal for Vastu Kalash Sthapana', 
                        isRecommended: true 
                      },
                      { 
                        id: '09:00 AM – 12:30 PM (Shubha Hora)', 
                        time: '09:00 AM – 12:30 PM', 
                        desc: 'Shubha Hora • Suitable for joint family havan participation', 
                        isRecommended: false 
                      },
                      { 
                        id: '04:30 PM – 08:00 PM (Godhuli Vela)', 
                        time: '04:30 PM – 08:00 PM', 
                        desc: 'Evening twilight • Includes Lakshmi Pravesh Aarti', 
                        isRecommended: false 
                      }
                    ].map((slot) => {
                      const isSelected = selectedSlot.startsWith(slot.time);
                      return (
                        <div
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-3 rounded-xl bg-white cursor-pointer transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'border-[#a63500] ring-2 ring-[#a63500]/20 bg-[#fff8f5]'
                              : 'border-[#f3e8d6] hover:border-[#fe932c]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif-vedic font-bold text-xs text-[#27180e]">{slot.time}</span>
                              {slot.isRecommended && (
                                <span className="bg-[#a63500] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#5a4139] mt-0.5">{slot.desc}</p>
                          </div>
                          <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-[#a63500]' : 'text-stone-300'}`} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Devotee & Sankalp Information Form (from Stitch) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-vedic text-sm font-bold text-[#27180e]">
                        Yajman & Sankalp Patra
                      </h4>
                      <span className="text-[10px] font-semibold text-[#5a4139] bg-[#ffeade] px-2 py-0.5 rounded-full">
                        Sacred Details
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f3e8d6] space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[#27180e] mb-1">
                          Yajman (Primary Host) Name
                        </label>
                        <input
                          type="text"
                          value={yajmanName}
                          onChange={(e) => setYajmanName(e.target.value)}
                          className="w-full bg-[#fff1ea] border border-[#e2bfb4] rounded-xl px-3 py-2.5 font-medium text-[#27180e] focus:outline-none focus:ring-1 focus:ring-[#a63500]"
                          placeholder="e.g. Ramesh Sharma"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-[#27180e]">Ancestral Gotra</label>
                          <span className="text-[10px] text-[#904d00] font-semibold">Vedic Lineage</span>
                        </div>
                        <input
                          type="text"
                          value={gotra}
                          onChange={(e) => setGotra(e.target.value)}
                          className="w-full bg-[#fff1ea] border border-[#e2bfb4] rounded-xl px-3 py-2.5 font-medium text-[#27180e] focus:outline-none focus:ring-1 focus:ring-[#a63500]"
                          placeholder="e.g. Kashyap, Bharadwaj"
                        />
                        <p className="text-[10px] text-[#5a4139] bg-[#ffeade] p-2 rounded-lg mt-1.5 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#a63500] shrink-0 mt-0.5" />
                          <span>If gotra is unknown, Pandit Ji recites sacred Sankalp under <strong>Achyuta / Kashyap Gotra</strong> as ordained in Shastras.</span>
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold text-[#27180e] mb-1">
                          Family Co-Sankalp Members
                        </label>
                        <input
                          type="text"
                          value={familyMembers}
                          onChange={(e) => setFamilyMembers(e.target.value)}
                          className="w-full bg-[#fff1ea] border border-[#e2bfb4] rounded-xl px-3 py-2.5 font-medium text-[#27180e] focus:outline-none focus:ring-1 focus:ring-[#a63500]"
                          placeholder="Family members for collective blessings"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#27180e] mb-1">
                          Primary Sankalp Intent (Uddeshya)
                        </label>
                        <input
                          type="text"
                          value={sankalpIntent}
                          onChange={(e) => setSankalpIntent(e.target.value)}
                          className="w-full bg-[#fff1ea] border border-[#e2bfb4] rounded-xl px-3 py-2.5 font-medium text-[#27180e] focus:outline-none focus:ring-1 focus:ring-[#a63500]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#27180e] mb-1">
                          Venue Address in Bangalore
                        </label>
                        <input
                          type="text"
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                          className="w-full bg-[#fff1ea] border border-[#e2bfb4] rounded-xl px-3 py-2.5 font-medium text-[#27180e] focus:outline-none focus:ring-1 focus:ring-[#a63500]"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: DAKSHINA & CHECKOUT (from Stitch Screen 19825ff2) */}
              {step === 3 && (
                <div className="space-y-4">
                  
                  {/* Vedic Sanctity Assurance Banner */}
                  <div className="bg-[#ffe3d3] rounded-2xl p-3.5 flex items-center justify-between border border-[#e2bfb4] shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-6 h-6 text-[#15803d]" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#904d00] block">Vedic Sanctity Assured</span>
                        <p className="text-xs font-semibold text-[#27180e]">100% Verified Rigvedic Purohit Assigned</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#a63500] bg-white px-2.5 py-1 rounded-full shadow-sm">
                      Muhurat Locked
                    </span>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-white rounded-2xl p-4 border border-[#f3e8d6] shadow-sm space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-vedic font-bold text-sm text-[#27180e]">{puja.title}</h4>
                      <span className="text-[10px] font-bold text-[#904d00] bg-[#ffeade] px-2 py-0.5 rounded-full">In-Person</span>
                    </div>
                    <div className="text-[11px] text-[#5a4139] space-y-1 bg-[#fff8f5] p-2.5 rounded-xl">
                      <p>📅 <strong>Schedule:</strong> Friday, {selectedDay} October 2026 • {selectedSlot.split('(')[0]}</p>
                      <p>📍 <strong>Venue:</strong> {venueAddress}</p>
                      <p>🕉️ <strong>Host:</strong> {yajmanName} (Gotra: {gotra})</p>
                    </div>
                  </div>

                  {/* Transparent Dakshina & Expense Breakdown (from Stitch) */}
                  <div className="bg-white rounded-2xl p-4 border border-[#f3e8d6] shadow-sm space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-[#f3e8d6] pb-2">
                      <h4 className="font-serif-vedic font-bold text-sm text-[#27180e]">
                        Dakshina & Bill Breakdown
                      </h4>
                      <span className="text-[10px] font-bold text-[#904d00] bg-[#ffe3d3] px-2 py-0.5 rounded-full">
                        100% Transparent
                      </span>
                    </div>

                    <div className="flex justify-between text-[#5a4139]">
                      <div>
                        <p className="font-semibold text-[#27180e]">Pandit Dakshina ({assignedPandit?.name})</p>
                        <p className="text-[10px] text-[#8e7167]">Vedic Acharya Vidhi & Havan (3.5 hrs)</p>
                      </div>
                      <span className="font-bold text-[#27180e]">₹{panditDakshina.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-[#5a4139]">
                      <div>
                        <p className="font-semibold text-[#27180e]">Eco-Friendly Samagri Kit</p>
                        <p className="text-[10px] text-[#8e7167]">Pure Havan Wood, Desi Cow Ghee, Navgraha Samidha</p>
                      </div>
                      <span className="font-bold text-[#27180e]">₹{samagriCost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-[#5a4139]">
                      <div>
                        <p className="font-semibold text-[#27180e]">Priest Travel & Kit Dispatch</p>
                        <p className="text-[10px] text-[#8e7167]">Direct doorstep arrival with ritual kalash</p>
                      </div>
                      <span className="font-bold text-[#27180e]">₹{travelFee}</span>
                    </div>

                    <div className="flex justify-between text-[#5a4139]">
                      <div>
                        <p className="font-semibold text-[#27180e]">Platform & Dakshina Escrow</p>
                        <p className="text-[10px] text-[#8e7167]">Protects funds until full vidhi is completed</p>
                      </div>
                      <span className="font-bold text-[#27180e]">₹{platformFee}</span>
                    </div>

                    {/* Applied Coupon (from Stitch) */}
                    <div className="bg-[#ffeade] rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#a63500]" />
                        <span className="font-bold text-[#a63500]">SHUBHARAMBH Applied</span>
                      </div>
                      <span className="font-bold text-[#15803d]">-₹250</span>
                    </div>

                    <div className="border-t border-[#f3e8d6] pt-2 flex items-center justify-between text-base font-black text-[#27180e]">
                      <span>Total Dakshina:</span>
                      <span className="text-[#a63500]">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <span className="font-bold text-xs text-[#27180e]">Select Payment Mode</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'UPI (Instant PhonePe / GPay)', label: 'UPI / QR Scan' },
                        { id: 'Google Pay / Paytm', label: 'GPay / Paytm' },
                        { id: 'Credit / Debit Card', label: 'Card' },
                        { id: 'Razorpay Net Banking', label: 'Net Banking' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                            paymentMethod === m.id
                              ? 'border-[#a63500] bg-[#fff8f5] ring-2 ring-[#a63500]/20 text-[#a63500]'
                              : 'border-[#f3e8d6] bg-white text-[#5a4139]'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Navigation Buttons */}
        {!confirmedBooking && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#f3e8d6] flex items-center justify-between gap-3">
            <div>
              {step === 3 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-full border border-[#f3e8d6] text-xs font-semibold text-[#5a4139] hover:bg-[#ffeade] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-[#8e7167]"
              >
                Cancel
              </button>

              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-full bg-[#a63500] hover:bg-[#cf4504] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <span>Review Dakshina Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmAndPay}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#a63500] hover:bg-[#cf4504] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Lock Muhurat</span>
                  <span>🪔</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
