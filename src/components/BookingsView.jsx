import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  Home, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Car, 
  Flame, 
  RefreshCw,
  Package,
  Check,
  Sparkles
} from 'lucide-react';
import { VirtualSanctumModal } from './VirtualSanctumModal';
import { ReviewModal } from './ReviewModal';

export function BookingsView({ 
  bookings, 
  onSimulateTracking, 
  onUpdateStatus, 
  onSubmitReview,
  lang 
}) {
  const [filterTab, setFilterTab] = useState('active'); // 'active' | 'past'
  const [selectedVirtualBooking, setSelectedVirtualBooking] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [simulatingId, setSimulatingId] = useState(null);

  const activeBookings = bookings.filter(b => ['confirmed', 'on_the_way', 'in_progress'].includes(b.status));
  const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));
  const currentList = filterTab === 'active' ? activeBookings : pastBookings;

  const handleSimulateStep = async (bookingId) => {
    setSimulatingId(bookingId);
    try {
      await onSimulateTracking(bookingId);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setSimulatingId(null), 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Tab Filter Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-vedic text-xl sm:text-2xl font-bold text-[#27180e]">
            Ritual Journey & Live Tracker
          </h2>
          <p className="text-xs text-[#5a4139] mt-0.5">
            Real-time transit alerts, ceremony milestones, and sanctum live streams
          </p>
        </div>

        <div className="flex items-center bg-[#ffeade] p-1 rounded-full border border-[#f3e8d6] text-xs font-bold">
          <button
            onClick={() => setFilterTab('active')}
            className={`px-3.5 py-1.5 rounded-full transition ${
              filterTab === 'active'
                ? 'bg-[#a63500] text-white shadow-sm'
                : 'text-[#5a4139] hover:text-[#27180e]'
            }`}
          >
            Active ({activeBookings.length})
          </button>
          <button
            onClick={() => setFilterTab('past')}
            className={`px-3.5 py-1.5 rounded-full transition ${
              filterTab === 'past'
                ? 'bg-[#a63500] text-white shadow-sm'
                : 'text-[#5a4139] hover:text-[#27180e]'
            }`}
          >
            Completed ({pastBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#f3e8d6] max-w-md mx-auto shadow-sm">
          <span className="text-3xl mb-2 block">🪔</span>
          <h3 className="font-serif-vedic text-base font-bold text-[#27180e]">
            No {filterTab} ceremonies found
          </h3>
          <p className="text-xs text-[#5a4139] mt-1">
            Book a sacred ceremony from the catalog to follow its live journey.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentList.map((booking) => {
            const isCompleted = booking.status === 'completed';
            const isOnTheWay = booking.status === 'on_the_way';
            const isInProgress = booking.status === 'in_progress';

            return (
              <div 
                key={booking.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#f3e8d6] transition-all"
              >
                
                {/* 1. Auspicious Kalash Radiance Banner (from Stitch Live Booking Tracker Screen) */}
                <div className="p-5 bg-[#ffeade] relative overflow-hidden border-b border-[#f3e8d6]">
                  {/* Ambient Glow Orb */}
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#fe932c]/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#904d00]">
                          Booking #{booking.id}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fe932c]" />
                        <span className="text-[10px] text-[#5a4139] font-medium">
                          Bangalore, Whitefield
                        </span>
                      </div>

                      <h3 className="font-serif-vedic text-xl sm:text-2xl font-bold text-[#27180e]">
                        {booking.pujaTitle}
                      </h3>

                      <p className="text-xs text-[#5a4139] flex items-center gap-1 font-medium mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#904d00]" />
                        <span>Auspicious Day: <strong>{booking.date} • {booking.slot.split('(')[0]}</strong> (Amrit Kaal)</span>
                      </p>
                    </div>

                    {/* Custom Illustrated Kalash Motif from Stitch */}
                    <div className="shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md shadow-[#904d00]/10 border border-[#e2bfb4]">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="50" cy="84" fill="#904d00" opacity="0.3" rx="20" ry="5" />
                        <path d="M40 76 L60 76 L56 82 L44 82 Z" fill="#904d00" />
                        <path d="M35 56 C33 70 38 78 50 78 C62 78 67 70 65 56 Z" fill="#cf4504" />
                        <path d="M36 53 H64 V56 H36 Z" fill="#904d00" />
                        <circle cx="50" cy="67" fill="#d9352f" r="4" />
                        <path d="M36 54 C30 46 29 36 34 38 C38 41 38 48 39 53 Z" fill="#2e7d32" />
                        <path d="M64 54 C70 46 71 36 66 38 C62 41 62 48 61 53 Z" fill="#2e7d32" />
                        <path d="M50 18 C58 32 60 48 50 52 C40 48 42 32 50 18 Z" fill="#fe932c" />
                        <path d="M50 25 C54 34 55 45 50 48 C45 45 46 34 50 25 Z" fill="#ffea79" />
                      </svg>
                    </div>
                  </div>

                  {/* Vedic Status Seal from Stitch */}
                  <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#e2bfb4]/60">
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-[11px] font-bold text-emerald-800">
                        {booking.panditName} Assigned & Confirmed
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-[#a63500] flex items-center gap-1">
                      <span>Shubh Sankalp Registered</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* 2. Milestone Progress Timeline (Ritual Journey) from Stitch */}
                <div className="p-5 sm:p-6 space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif-vedic text-base font-bold text-[#27180e]">
                        Ritual Journey
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#ffdcc3] text-[#2f1500] px-2.5 py-1 rounded-full">
                      {isCompleted ? 'Step 6 of 6 Completed' : isInProgress ? 'Step 5 of 6 (In Progress)' : isOnTheWay ? 'Step 4 of 6 (En Route)' : 'Step 3 of 6 (Active)'}
                    </span>
                  </div>

                  {/* Timeline List (from Stitch) */}
                  <div className="relative pl-6 space-y-6 text-xs">
                    {/* Connecting Vertical Guide Line */}
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#ffeade]" />
                    <div 
                      className="absolute left-2.5 top-2 w-0.5 bg-[#fe932c] transition-all duration-500" 
                      style={{ 
                        height: isCompleted ? '100%' : isInProgress ? '80%' : isOnTheWay ? '60%' : '40%' 
                      }} 
                    />

                    {/* Step 1: Booking Confirmed */}
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#fe932c] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 font-bold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#27180e]">Booking Confirmed & Muhurat Locked</p>
                          <span className="text-[10px] text-[#8e7167]">Auspicious</span>
                        </div>
                        <p className="text-[11px] text-[#5a4139] mt-0.5">Auspicious Choghadiya: Amrit Vela verified by Shastri Ji.</p>
                      </div>
                    </div>

                    {/* Step 2: Pandit Assigned */}
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#fe932c] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 font-bold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#27180e]">Vedic Purohit Assigned</p>
                          <span className="text-[10px] text-[#8e7167]">Accepted</span>
                        </div>
                        <p className="text-[11px] text-[#5a4139] mt-0.5">{booking.panditName} accepted the Griha Pravesh Sankalp.</p>
                      </div>
                    </div>

                    {/* Step 3: Samagri Kit In Transit */}
                    <div className="relative flex items-start gap-3">
                      <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                        isOnTheWay || isInProgress || isCompleted ? 'bg-[#fe932c] text-white' : 'bg-[#a63500] text-white animate-pulse'
                      }`}>
                        {isOnTheWay || isInProgress || isCompleted ? <Check className="w-3 h-3 font-bold" /> : <Package className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 bg-[#fff1ea] rounded-xl p-3 border border-[#f3e8d6]">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#a63500]">Samagri Kit Dispatched</p>
                          <span className="text-[10px] font-bold bg-[#ffdbcf] text-[#a63500] px-2 py-0.5 rounded-full">In Transit</span>
                        </div>
                        <p className="text-[11px] text-[#27180e] mt-0.5">Box of 42 sacred ritual items en route via Express Courier.</p>
                        <p className="text-[10px] text-[#904d00] font-semibold mt-1">Contains Pure Mango Wood Samidha, Desi Ghee, Gangajal & Kalash</p>
                      </div>
                    </div>

                    {/* Step 4: Pandit En Route (with live simulation button) */}
                    <div className={`relative flex items-start gap-3 ${booking.status === 'confirmed' ? 'opacity-60' : ''}`}>
                      <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                        isOnTheWay ? 'bg-[#a63500] text-white animate-pulse' : isInProgress || isCompleted ? 'bg-[#fe932c] text-white' : 'bg-[#ffeade] text-[#5a4139]'
                      }`}>
                        {isInProgress || isCompleted ? <Check className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#27180e]">Pandit Ji En Route to Venue</p>
                          {isOnTheWay && (
                            <button
                              onClick={() => handleSimulateStep(booking.id)}
                              disabled={simulatingId === booking.id}
                              className="text-[10px] font-bold text-[#a63500] bg-[#ffeade] hover:bg-[#ffdcc3] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#e2bfb4]"
                            >
                              <RefreshCw className={`w-3 h-3 ${simulatingId === booking.id ? 'animate-spin' : ''}`} />
                              <span>Simulate Moving Closer</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5a4139] mt-0.5">
                          {isOnTheWay 
                            ? `Vehicle KA-03-MM-1008 • ETA ~${booking.tracking?.etaMinutes || 18} mins (${booking.tracking?.distanceRemainingKm || 3.2} km remaining)`
                            : 'Scheduled departure at morning muhurat. Live GPS transit alerts will trigger.'}
                        </p>
                      </div>
                    </div>

                    {/* Step 5: Puja & Havan In Progress */}
                    <div className={`relative flex items-start gap-3 ${['confirmed', 'on_the_way'].includes(booking.status) ? 'opacity-60' : ''}`}>
                      <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                        isInProgress ? 'bg-[#a63500] text-white animate-pulse' : isCompleted ? 'bg-[#fe932c] text-white' : 'bg-[#ffeade] text-[#5a4139]'
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#27180e]">Puja, Navagraha & Havan</p>
                        <p className="text-[11px] text-[#5a4139] mt-0.5">Vedic chanting, Gau puja, Vastu sthapana & Agni ahutis.</p>
                      </div>
                    </div>

                    {/* Step 6: Purnahuti & Completed */}
                    <div className={`relative flex items-start gap-3 ${!isCompleted ? 'opacity-60' : ''}`}>
                      <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                        isCompleted ? 'bg-emerald-600 text-white' : 'bg-[#ffeade] text-[#5a4139]'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#27180e]">Purnahuti, Aarti & Ashirvaad Sealed</p>
                        <p className="text-[11px] text-[#5a4139] mt-0.5">Auspicious blessing complete with Mahaprasad.</p>
                      </div>
                    </div>

                  </div>

                  {/* Virtual Video Room Trigger for Virtual Bookings */}
                  {booking.mode === 'virtual' && (
                    <div className="bg-[#ffeade] rounded-2xl p-4 border border-[#e2bfb4] flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-[#a63500]" />
                          <h4 className="font-bold text-xs text-[#27180e]">Virtual Sanctum Video Room</h4>
                        </div>
                        <p className="text-[11px] text-[#5a4139] mt-0.5">Two-way live interactive video call with priest and digital Hawan</p>
                      </div>
                      <button
                        onClick={() => setSelectedVirtualBooking(booking)}
                        className="px-4 py-2 rounded-full bg-[#a63500] text-white text-xs font-bold shadow-sm hover:bg-[#cf4504] transition"
                      >
                        Join Live Sanctum
                      </button>
                    </div>
                  )}

                  {/* Completed Review Callout */}
                  {isCompleted && (
                    <div className="pt-2">
                      {booking.review ? (
                        <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-emerald-800">Your Review & Blessings</span>
                            <span className="font-bold text-[#fe932c]">{booking.review.rating} ★</span>
                          </div>
                          <p className="text-[#5a4139] italic">"{booking.review.comment}"</p>
                        </div>
                      ) : (
                        <div className="bg-[#fff1ea] rounded-2xl p-3.5 border border-[#e2bfb4] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[#27180e]">How was your ritual experience?</p>
                            <p className="text-[11px] text-[#5a4139]">Share your rating and feedback for the priest</p>
                          </div>
                          <button
                            onClick={() => setReviewingBooking(booking)}
                            className="px-4 py-2 rounded-full bg-[#a63500] text-white text-xs font-bold shadow-sm hover:bg-[#cf4504]"
                          >
                            Rate Ceremony
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Footer Details */}
                <div className="bg-[#fff8f5] px-5 py-3 border-t border-[#f3e8d6] flex items-center justify-between text-[11px] text-[#8e7167]">
                  <span>Paid: <strong>₹{booking.pricing?.total?.toLocaleString('en-IN')}</strong> via {booking.pricing?.paymentMethod}</span>
                  <span>Yajman Gotra: <strong>{booking.gotra}</strong></span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedVirtualBooking && (
        <VirtualSanctumModal 
          booking={selectedVirtualBooking} 
          onClose={() => setSelectedVirtualBooking(null)} 
        />
      )}

      {reviewingBooking && (
        <ReviewModal
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
          onSubmitReview={(reviewData) => onSubmitReview(reviewingBooking.id, reviewData)}
        />
      )}

    </div>
  );
}
