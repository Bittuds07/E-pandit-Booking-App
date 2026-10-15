import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  AlertTriangle,
  DollarSign,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTempleBell } from '../utils/audio';

export function AdminDashboard({ 
  metrics, 
  pandits, 
  pujas, 
  bookings, 
  onVerifyPandit, 
  onCreatePuja, 
  onDeletePuja, 
  onResetDB,
  lang 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'verifications' | 'catalog' | 'bookings'
  const [showAddPujaModal, setShowAddPujaModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  // New Puja Form
  const [newTitle, setNewTitle] = useState('');
  const [newSanskritTitle, setNewSanskritTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Health & Prosperity');
  const [newDuration, setNewDuration] = useState('2.0 Hours');
  const [newDakshina, setNewDakshina] = useState(2500);
  const [newDesc, setNewDesc] = useState('');

  const pendingPandits = pandits.filter(p => p.kycStatus === 'pending');

  const handleApprovePandit = async (panditId) => {
    try {
      await onVerifyPandit(panditId, 'verified', 'Gold Verified Vedic Acharya', 'Sanad and background verified by Admin.');
      playTempleBell();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPandit = async (panditId) => {
    try {
      await onVerifyPandit(panditId, 'rejected', 'Application Rejected', 'Incomplete credentials.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePujaSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreatePuja({
        title: newTitle,
        sanskritTitle: newSanskritTitle || newTitle,
        category: newCategory,
        duration: newDuration,
        baseDakshina: Number(newDakshina),
        shortDescription: newDesc,
        image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80",
        modeSupported: ["in_person", "virtual"],
        deities: ["Lord Ganesha", "Kuldevata"],
        includedSamagri: ["Pure Cow Ghee", "Hawan Samidha", "Gangajal", "Chandan & Roli"]
      });
      setShowAddPujaModal(false);
      setNewTitle('');
      setNewDesc('');
      playTempleBell();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset database to original clean seed data?")) return;
    setResetting(true);
    try {
      await onResetDB();
      alert("Database reset to fresh seeds successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-50 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="font-serif-vedic text-2xl font-bold text-amber-100">
              Vedam Platform Administration
            </h1>
          </div>
          <p className="text-xs text-amber-300 mt-1">
            Platform governance, KYC verification pipelines, catalog management & GMV analytics
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 border border-amber-600/50 text-xs font-semibold text-amber-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>Reset Fresh Seeds</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & Key Metrics', icon: TrendingUp },
          { id: 'verifications', label: `Pandit Verification Pipeline (${pendingPandits.length} Pending)`, icon: ShieldCheck },
          { id: 'catalog', label: `Puja Catalog Manager (${pujas.length})`, icon: Layers },
          { id: 'bookings', label: `All Platform Bookings (${bookings.length})`, icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
                isSelected ? 'bg-amber-600 text-white shadow font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Top 6 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
              <p className="text-xs text-stone-500 uppercase font-semibold">Gross Revenue (GMV)</p>
              <p className="text-2xl font-black text-stone-900 mt-1">
                ₹{metrics?.totalGMV?.toLocaleString('en-IN') || '13,397'}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                +24.6% this month
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
              <p className="text-xs text-stone-500 uppercase font-semibold">Platform Fee Earned</p>
              <p className="text-2xl font-black text-amber-700 mt-1">
                ₹{metrics?.platformRevenue?.toLocaleString('en-IN') || '600'}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Transparent flat fee
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
              <p className="text-xs text-stone-500 uppercase font-semibold">Total Bookings</p>
              <p className="text-2xl font-black text-stone-900 mt-1">
                {metrics?.totalBookings || bookings.length}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                {metrics?.activeBookings || 2} Active • {metrics?.completedBookings || 1} Done
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
              <p className="text-xs text-stone-500 uppercase font-semibold">Active Verified Pandits</p>
              <p className="text-2xl font-black text-stone-900 mt-1">
                {metrics?.verifiedPandits || 5}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">
                {pendingPandits.length} pending approval
              </p>
            </div>

          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 text-xs">
              <p className="font-bold text-amber-950 text-sm mb-1">Conversion Rate</p>
              <p className="text-3xl font-extrabold text-amber-900">{metrics?.conversionRate || '78.4%'}</p>
              <p className="text-stone-500 mt-1">Devotees who start checkout and complete booking</p>
            </div>

            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 text-xs">
              <p className="font-bold text-emerald-950 text-sm mb-1">Ceremony Fulfillment Rate</p>
              <p className="text-3xl font-extrabold text-emerald-900">{metrics?.fulfillmentRate || '98.2%'}</p>
              <p className="text-stone-500 mt-1">Pujas completed without cancellation or disputes</p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs">
              <p className="font-bold text-stone-900 text-sm mb-1">Devotee Churn Rate</p>
              <p className="text-3xl font-extrabold text-stone-800">{metrics?.churnRate || '1.4%'}</p>
              <p className="text-stone-500 mt-1">High retention driven by recurring festivals & tithis</p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PANDIT VERIFICATION PIPELINE */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-vedic text-xl font-bold text-stone-900">
                Priest Onboarding & KYC Approval Pipeline
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Inspect identity proofs and Veda Pathshala credentials before granting platform badges.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
              {pendingPandits.length} Applications Pending
            </span>
          </div>

          {pendingPandits.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
              🎉 All priest applications have been reviewed and approved!
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPandits.map((pandit) => (
                <div key={pandit.id} className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={pandit.avatar} 
                      alt={pandit.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300"
                    />
                    <div>
                      <h4 className="font-serif-vedic font-bold text-stone-900 text-base">{pandit.name}</h4>
                      <p className="text-xs text-amber-700 font-semibold">{pandit.title} • {pandit.experienceYears} Years Exp</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{pandit.lineage}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-600">
                        <span className="bg-white px-2 py-0.5 rounded border border-stone-200 font-medium">
                          ID: {pandit.idProofType}
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-stone-200 font-medium">
                          City: {pandit.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleRejectPandit(pandit.id)}
                      className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprovePandit(pandit.id)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Grant Gold Badge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List of Verified Pandits */}
          <div className="pt-6 border-t border-stone-200">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3">
              Currently Verified Active Pandits ({pandits.filter(p => p.kycStatus === 'verified').length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {pandits.filter(p => p.kycStatus === 'verified').map((p) => (
                <div key={p.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{p.verificationBadge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUJA CATALOG MANAGER */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-vedic text-xl font-bold text-stone-900">
                Puja Catalog & Baseline Dakshina Fees
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Add new rituals, adjust standard durations and baseline dakshina rates.
              </p>
            </div>

            <button
              onClick={() => setShowAddPujaModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Puja</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pujas.map((puja) => (
              <div key={puja.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-serif-vedic font-bold text-stone-900 text-sm line-clamp-1">{puja.title}</h4>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                      {puja.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-3">{puja.shortDescription}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-400">Dakshina: </span>
                    <strong className="text-stone-900">₹{puja.baseDakshina?.toLocaleString('en-IN')}</strong>
                  </div>

                  <button
                    onClick={() => onDeletePuja(puja.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete Puja"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALL PLATFORM BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <h3 className="font-serif-vedic text-xl font-bold text-stone-900">
            Platform Master Bookings Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Ritual</th>
                  <th className="py-3 px-3">Yajman & Gotra</th>
                  <th className="py-3 px-3">Assigned Pandit</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-amber-50/50">
                    <td className="py-3 px-3 font-bold text-amber-800">#{b.id}</td>
                    <td className="py-3 px-3 font-semibold text-stone-800">{b.pujaTitle}</td>
                    <td className="py-3 px-3">{b.yajmanName} ({b.gotra})</td>
                    <td className="py-3 px-3 font-medium text-stone-700">{b.panditName}</td>
                    <td className="py-3 px-3 capitalize">{b.mode.replace('_', ' ')}</td>
                    <td className="py-3 px-3 font-bold">₹{b.pricing?.total?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PUJA MODAL */}
      {showAddPujaModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-300 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-vedic text-lg font-bold">Add New Puja to Catalog</h3>
              <button onClick={() => setShowAddPujaModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleCreatePujaSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Puja Title</label>
                <input 
                  type="text" 
                  required 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  className="w-full bg-stone-50 border p-2 rounded-xl"
                  placeholder="e.g. Navagraha Shanti Mahapuja"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Sanskrit Title</label>
                <input 
                  type="text" 
                  value={newSanskritTitle} 
                  onChange={(e) => setNewSanskritTitle(e.target.value)} 
                  className="w-full bg-stone-50 border p-2 rounded-xl"
                  placeholder="e.g. नवग्रह शांति महापूजा"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-stone-50 border p-2 rounded-xl"
                  >
                    <option value="Griha & Vastu">Griha & Vastu</option>
                    <option value="Health & Prosperity">Health & Prosperity</option>
                    <option value="Sanskar & Dosha">Sanskar & Dosha</option>
                    <option value="Astrology & Kundali">Astrology & Kundali</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Baseline Dakshina (₹)</label>
                  <input 
                    type="number" 
                    value={newDakshina} 
                    onChange={(e) => setNewDakshina(e.target.value)}
                    className="w-full bg-stone-50 border p-2 rounded-xl" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description</label>
                <textarea 
                  rows={2} 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  className="w-full bg-stone-50 border p-2 rounded-xl"
                  placeholder="Ceremony purpose and significance..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddPujaModal(false)} 
                  className="px-4 py-2 rounded-xl border text-stone-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
