import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Car, 
  Upload, 
  ArrowUpRight,
  Sparkles,
  Phone,
  Check,
  Flame,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTempleBell } from '../utils/audio';

export function PanditDashboard({ 
  pandit, 
  bookings, 
  onUpdateStatus, 
  onRequestPayout, 
  onSubmitKYC,
  onUpdateAvailability,
  lang 
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'calendar' | 'wallet' | 'kyc'
  const [travelRadius, setTravelRadius] = useState(pandit?.travelRadiusKm || 25);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [kycNotes, setKycNotes] = useState('');
  const [kycSubmittedMsg, setKycSubmittedMsg] = useState('');

  // Assigned bookings for this Pandit
  const panditBookings = bookings.filter(b => b.panditId === pandit?.id || b.panditName === pandit?.name);
  const pendingRequests = panditBookings.filter(b => b.status === 'confirmed');
  const activeOrders = panditBookings.filter(b => ['on_the_way', 'in_progress'].includes(b.status));
  const completedOrders = panditBookings.filter(b => b.status === 'completed');

  const handlePayout = async () => {
    setIsProcessingPayout(true);
    try {
      const res = await onRequestPayout(pandit.id, pandit.pendingPayout || pandit.walletBalance);
      setPayoutSuccessMsg(res.message || 'Payout transfer initiated to bank account!');
      playTempleBell();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => setPayoutSuccessMsg(''), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await onSubmitKYC(pandit.id, {
        idProofType: "Aadhaar + Sampurnanand Sanskrit Vishwavidyalaya Sanad",
        notes: kycNotes
      });
      setKycSubmittedMsg("Documents submitted successfully for Admin review!");
      setTimeout(() => setKycSubmittedMsg(''), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRadiusSave = async () => {
    try {
      await onUpdateAvailability(pandit.id, {
        travelRadiusKm: Number(travelRadius),
        availableSlots: pandit.availableSlots
      });
      alert(`Service radius updated to ${travelRadius} km!`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Pandit Profile Header Bar */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-50 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-700/60 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={pandit?.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"} 
                alt={pandit?.name} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-vedic text-xl sm:text-2xl font-bold text-amber-100">
                  {pandit?.name}
                </h1>
                <span className="text-xs bg-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                  {pandit?.verificationBadge || 'Gold Verified Acharya'}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium mt-0.5">{pandit?.title}</p>
              <p className="text-[11px] text-amber-200/70 mt-0.5">
                {pandit?.lineage} • {pandit?.experienceYears} Years Vedic Experience
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-amber-950/70 p-3 rounded-2xl border border-amber-800 text-center text-xs">
            <div>
              <p className="text-amber-400/80 text-[10px] uppercase font-semibold">Wallet Balance</p>
              <p className="text-sm sm:text-base font-extrabold text-amber-100">
                ₹{pandit?.walletBalance?.toLocaleString('en-IN') || '38,400'}
              </p>
            </div>
            <div>
              <p className="text-amber-400/80 text-[10px] uppercase font-semibold">Completed</p>
              <p className="text-sm sm:text-base font-extrabold text-amber-100">
                {pandit?.completedPujas || 342}+
              </p>
            </div>
            <div>
              <p className="text-amber-400/80 text-[10px] uppercase font-semibold">Vedic Rating</p>
              <p className="text-sm sm:text-base font-extrabold text-yellow-300">
                {pandit?.rating || 4.9} ★
              </p>
            </div>
          </div>

        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-amber-800/80 text-xs font-semibold">
          {[
            { id: 'orders', label: `Ceremonies & Requests (${pendingRequests.length + activeOrders.length})`, icon: Calendar },
            { id: 'wallet', label: 'Dakshina Wallet & Payouts', icon: Wallet },
            { id: 'calendar', label: 'Availability & Travel Radius', icon: Clock },
            { id: 'kyc', label: 'Credentials & Verification', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md font-bold'
                    : 'bg-amber-900/40 text-amber-200 hover:bg-amber-900/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: CEREMONIES & ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Active Orders Section */}
          <div>
            <h3 className="font-serif-vedic text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Today's Active Ceremonies ({activeOrders.length})</span>
            </h3>

            {activeOrders.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 text-stone-500 text-xs text-center">
                No rituals currently in transit or underway.
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl p-5 border-2 border-amber-400 shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          #{order.id} • {order.mode === 'in_person' ? 'Home Visit' : 'Virtual Sanctum'}
                        </span>
                        <h4 className="font-serif-vedic text-base font-bold text-stone-900 mt-1">
                          {order.pujaTitle}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                          Dakshina: ₹{order.pricing?.panditDakshina?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-xl mb-4">
                      <div>
                        <p><strong>Yajman:</strong> {order.yajmanName}</p>
                        <p><strong>Gotra:</strong> {order.gotra}</p>
                        <p><strong>Phone:</strong> {order.userPhone}</p>
                      </div>
                      <div>
                        <p><strong>Venue Address:</strong> {order.venueAddress}</p>
                        <p><strong>Special Intent:</strong> {order.specialInstructions || 'Peace & prosperity'}</p>
                      </div>
                    </div>

                    {/* Status Update Actions for Pandit */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      <span className="text-xs text-stone-500 font-medium">
                        Current Status: <strong className="text-amber-800 uppercase">{order.status.replace('_', ' ')}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {order.status === 'on_the_way' && (
                          <button
                            onClick={() => onUpdateStatus(order.id, 'in_progress', 'Pandit Ji arrived at venue and lit the auspicious lamp.')}
                            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Mark: Arrived & Started</span>
                          </button>
                        )}

                        {order.status === 'in_progress' && (
                          <button
                            onClick={() => onUpdateStatus(order.id, 'completed', 'Ceremony completed with Purnahuti, Aarti, and Vedic Ashirvaad.')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete Ceremony (Purnahuti)</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Requests Queue */}
          <div>
            <h3 className="font-serif-vedic text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span>Upcoming / New Requests ({pendingRequests.length})</span>
            </h3>

            {pendingRequests.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 text-stone-500 text-xs text-center">
                All appointments accepted. No new pending requests.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-serif-vedic text-base font-bold text-stone-900">
                          {req.pujaTitle}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Date: {req.date} • Slot: {req.slot}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-stone-900">
                          ₹{req.pricing?.panditDakshina?.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[10px] text-stone-400">Guaranteed Dakshina</p>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 bg-amber-50/60 p-3 rounded-xl mb-4 space-y-1">
                      <p><strong>Yajman Name:</strong> {req.yajmanName} (Gotra: {req.gotra})</p>
                      <p><strong>Location:</strong> {req.venueAddress}</p>
                      <p><strong>Samagri:</strong> {req.samagriKitName} ({req.samagriOption})</p>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onUpdateStatus(req.id, 'on_the_way', 'Pandit Ji departed for Yajman venue.')}
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Start Travel (Depart)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: DAKSHINA WALLET & PAYOUTS */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <h3 className="font-serif-vedic text-xl font-bold text-stone-900">
                Priest Earnings & Dakshina Wallet
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Linked Bank Account: <strong>{pandit?.bankAccount || 'HDFC Bank •••• 4821'}</strong>
              </p>
            </div>

            <button
              onClick={handlePayout}
              disabled={isProcessingPayout}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{isProcessingPayout ? 'Transferring...' : 'Request Immediate Payout'}</span>
            </button>
          </div>

          {payoutSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{payoutSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
              <p className="text-xs text-stone-500">Available Wallet Balance</p>
              <p className="text-2xl font-black text-amber-950 mt-1">
                ₹{pandit?.walletBalance?.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-amber-700 mt-1">Ready for withdrawal</p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">Pending Settlement</p>
              <p className="text-2xl font-black text-stone-900 mt-1">
                ₹{pandit?.pendingPayout?.toLocaleString('en-IN') || 0}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">Automated weekly transfer</p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">Total Lifetime Dakshina</p>
              <p className="text-2xl font-black text-stone-900 mt-1">
                ₹{( (pandit?.walletBalance || 38400) + 142000 ).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">Across {pandit?.completedPujas || 342} rituals</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AVAILABILITY & TRAVEL RADIUS */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
          <h3 className="font-serif-vedic text-xl font-bold text-stone-900">
            Working Slots & In-Person Travel Radius
          </h3>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Maximum In-Person Travel Radius (Current: {travelRadius} km)
            </label>
            <div className="flex items-center gap-4 max-w-md">
              <input
                type="range"
                min="5"
                max="50"
                value={travelRadius}
                onChange={(e) => setTravelRadius(e.target.value)}
                className="w-full accent-amber-600"
              />
              <span className="font-bold text-sm text-stone-900 w-16">{travelRadius} km</span>
              <button
                onClick={handleRadiusSave}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Devotees within this radius can book you for Griha Pravesh and housewarming rituals.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Active Working Muhurat Slots
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {pandit?.availableSlots?.map((slot, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-semibold text-stone-800">{slot}</span>
                  <span className="text-emerald-700 font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KYC & CREDENTIALS */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-vedic text-xl font-bold text-stone-900">
                Vedic Qualifications & Identity Sanad
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Current KYC Status: <strong className="text-emerald-700 uppercase">{pandit?.kycStatus}</strong>
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{pandit?.verificationBadge}</span>
            </div>
          </div>

          {kycSubmittedMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-semibold">
              {kycSubmittedMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <p className="text-stone-400 font-medium">Government ID Document</p>
              <p className="font-bold text-stone-800">{pandit?.idProofType || 'Aadhaar Card + PAN'}</p>
              <p className="text-emerald-600 font-semibold text-[11px]">✓ Verified by Vedam Trust Admin</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <p className="text-stone-400 font-medium">Gurukul Sanad & Degree</p>
              <p className="font-bold text-stone-800">{pandit?.lineage}</p>
              <p className="text-emerald-600 font-semibold text-[11px]">✓ Sanskrit Shiksha Parishad Certified</p>
            </div>
          </div>

          {/* Form to Submit Additional Credentials */}
          <form onSubmit={handleKYCSubmit} className="space-y-4 pt-4 border-t border-stone-100">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Submit Additional Vedic Credentials or Jyotish Sanad
            </h4>
            <textarea
              value={kycNotes}
              onChange={(e) => setKycNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Completed Tirupati Shukla Yajurveda Samhita specialization..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Submit for Admin Inspection</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
