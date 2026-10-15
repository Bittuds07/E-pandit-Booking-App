import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PujaCard } from './components/PujaCard';
import { PujaDetailsModal } from './components/PujaDetailsModal';
import { BookingModal } from './components/BookingModal';
import { BookingsView } from './components/BookingsView';
import { PanditDirectory } from './components/PanditDirectory';
import { PanditDashboard } from './components/PanditDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PanchangView } from './components/PanchangView';
import { SamagriKitsView } from './components/SamagriKitsView';
import { UserProfileModal } from './components/UserProfileModal';
import { Flame, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [pujas, setPujas] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [samagriKits, setSamagriKits] = useState([]);
  const [panchangData, setPanchangData] = useState(null);
  const [adminMetrics, setAdminMetrics] = useState(null);

  // App Navigation & UI state
  const [activeTab, setActiveTab] = useState('pujas'); // 'pujas' | 'pandits' | 'bookings' | 'panchang' | 'samagri' | 'pandit-dashboard' | 'admin-dashboard'
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('all');

  // Modals
  const [selectedPujaForDetails, setSelectedPujaForDetails] = useState(null);
  const [bookingPuja, setBookingPuja] = useState(null);
  const [bookingPandit, setBookingPandit] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial app data
  const fetchData = async () => {
    try {
      const [u, users, pj, pd, bk, sk, pc, am] = await Promise.all([
        api.getCurrentUser(),
        api.getUsers(),
        api.getPujas(),
        api.getPandits(),
        api.getBookings(),
        api.getSamagriKits(),
        api.getPanchang(),
        api.getAdminMetrics()
      ]);

      setCurrentUser(u);
      setAllUsers(users);
      setPujas(pj);
      setPandits(pd);
      setBookings(bk);
      setSamagriKits(sk);
      setPanchangData(pc);
      setAdminMetrics(am);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleSwitchUser = async (userId) => {
    try {
      const res = await api.switchRole(userId);
      if (res.user) {
        setCurrentUser(res.user);
        // Refresh bookings for current view
        const bk = await api.getBookings();
        setBookings(bk);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (data) => {
    const updated = await api.updateProfile(data);
    setCurrentUser(updated);
  };

  const handleBookingInitiate = (puja, pandit = null) => {
    setBookingPuja(puja);
    setBookingPandit(pandit);
  };

  const handleBookingSuccess = async (bookingPayload) => {
    const newBooking = await api.createBooking(bookingPayload);
    // Refresh bookings & pandits
    const [bk, pd, am] = await Promise.all([
      api.getBookings(),
      api.getPandits(),
      api.getAdminMetrics()
    ]);
    setBookings(bk);
    setPandits(pd);
    setAdminMetrics(am);
    return newBooking;
  };

  const handleUpdateStatus = async (bookingId, status, note) => {
    await api.updateBookingStatus(bookingId, status, note);
    const bk = await api.getBookings();
    setBookings(bk);
  };

  const handleSimulateTracking = async (bookingId) => {
    await api.simulateTrackingStep(bookingId);
    const bk = await api.getBookings();
    setBookings(bk);
  };

  const handleSubmitReview = async (bookingId, reviewData) => {
    await api.submitReview(bookingId, reviewData);
    const [bk, pd] = await Promise.all([
      api.getBookings(),
      api.getPandits()
    ]);
    setBookings(bk);
    setPandits(pd);
  };

  const handleVerifyPandit = async (panditId, status, badge, notes) => {
    await api.verifyPanditKYC(panditId, status, badge, notes);
    const [pd, am] = await Promise.all([
      api.getPandits(),
      api.getAdminMetrics()
    ]);
    setPandits(pd);
    setAdminMetrics(am);
  };

  const handleCreatePuja = async (pujaData) => {
    await api.createAdminPuja(pujaData);
    const pj = await api.getPujas();
    setPujas(pj);
  };

  const handleDeletePuja = async (pujaId) => {
    await api.deleteAdminPuja(pujaId);
    const pj = await api.getPujas();
    setPujas(pj);
  };

  const handleResetDB = async () => {
    await api.resetDatabase();
    await fetchData();
  };

  // Filtered Pujas
  const filteredPujas = pujas.filter((p) => {
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedMode !== 'all' && !p.modeSupported.includes(selectedMode)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSanskrit = p.sanskritTitle.toLowerCase().includes(q);
      const matchDesc = p.shortDescription.toLowerCase().includes(q);
      const matchDeities = p.deities?.some(d => d.toLowerCase().includes(q));
      if (!matchTitle && !matchSanskrit && !matchDesc && !matchDeities) return false;
    }
    return true;
  });

  const activeBookingsCount = bookings.filter(b => ['confirmed', 'on_the_way', 'in_progress'].includes(b.status)).length;
  const currentPandit = pandits.find(p => p.userId === currentUser?.id || p.id === currentUser?.panditId) || pandits[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-amber-100">
        <div className="w-16 h-16 rounded-full bg-amber-600/20 border-2 border-amber-500 flex items-center justify-center text-3xl animate-diya mb-4">
          🪔
        </div>
        <h2 className="font-serif-vedic text-xl font-bold tracking-wider text-amber-200">
          VEDAM • वेदम्
        </h2>
        <p className="text-xs text-amber-400/80 mt-1">Connecting Sacred Devotion with Vedic Purity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-stone-900 font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingCount={activeBookingsCount}
        onOpenProfile={() => setShowProfileModal(true)}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: PUJAS EXPLORATION (Home / Devotee Landing) */}
        {activeTab === 'pujas' && (
          <div>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              panchangData={panchangData}
              onOpenPanchang={() => setActiveTab('panchang')}
              lang={lang}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-serif-vedic text-2xl sm:text-3xl font-bold text-stone-900">
                    {lang === 'hi' ? 'वैदिक पूजा एवं अनुष्ठान सूची' : 'Sacred Vedic Pujas & Rituals'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                    {lang === 'hi'
                      ? 'अपने घर के लिए शुभ मुहूर्त में कराएं पूर्ण विधि-विधान सहित पूजा'
                      : 'Handcrafted Vedic ceremonies conducted strictly adhering to Agamas and Grihya Sutras'}
                  </p>
                </div>

                <div className="text-xs text-amber-900 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-300 font-semibold">
                  {filteredPujas.length} Auspicious Ceremonies Available
                </div>
              </div>

              {/* Pujas Grid */}
              {filteredPujas.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-amber-200/80 max-w-md mx-auto">
                  <p className="text-2xl mb-2">🔍</p>
                  <h3 className="font-serif-vedic text-base font-bold text-stone-900 mb-1">
                    No matching ceremonies found
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Try searching for other deities like Shiva, Vishnu, Lakshmi, or clear your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedMode('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredPujas.map((puja) => (
                    <PujaCard
                      key={puja.id}
                      puja={puja}
                      onSelectPuja={(p) => setSelectedPujaForDetails(p)}
                      onBookPuja={(p) => handleBookingInitiate(p)}
                      lang={lang}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: PANDITS DIRECTORY */}
        {activeTab === 'pandits' && (
          <PanditDirectory
            pandits={pandits}
            onBookWithPandit={(pandit) => {
              // open booking with first available puja
              handleBookingInitiate(pujas[0], pandit);
            }}
            lang={lang}
          />
        )}

        {/* TAB 3: BOOKINGS VIEW */}
        {activeTab === 'bookings' && (
          <BookingsView
            bookings={bookings}
            onSimulateTracking={handleSimulateTracking}
            onUpdateStatus={handleUpdateStatus}
            onSubmitReview={handleSubmitReview}
            lang={lang}
          />
        )}

        {/* TAB 4: PANCHANG & RASHIFAL */}
        {activeTab === 'panchang' && (
          <PanchangView
            panchang={panchangData}
            lang={lang}
          />
        )}

        {/* TAB 5: SAMAGRI KITS */}
        {activeTab === 'samagri' && (
          <SamagriKitsView
            samagriKits={samagriKits}
            onSelectPujaForBooking={() => setActiveTab('pujas')}
            lang={lang}
          />
        )}

        {/* TAB 6: PANDIT DASHBOARD */}
        {activeTab === 'pandit-dashboard' && (
          <PanditDashboard
            pandit={currentPandit}
            bookings={bookings}
            onUpdateStatus={handleUpdateStatus}
            onRequestPayout={api.requestPanditPayout}
            onSubmitKYC={api.submitPanditKYC}
            onUpdateAvailability={api.updatePanditAvailability}
            lang={lang}
          />
        )}

        {/* TAB 7: ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            metrics={adminMetrics}
            pandits={pandits}
            pujas={pujas}
            bookings={bookings}
            onVerifyPandit={handleVerifyPandit}
            onCreatePuja={handleCreatePuja}
            onDeletePuja={handleDeletePuja}
            onResetDB={handleResetDB}
            lang={lang}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-amber-900/40 py-12 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪔</span>
              <span className="font-serif-vedic text-lg font-bold text-amber-200">VEDAM</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">वेदम्</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Empowering devotees worldwide to connect with authentic, certified Vedic priests. Transparent Dakshina, consecrated Samagri, and divine peace of mind.
            </p>
          </div>

          <div>
            <h4 className="font-serif-vedic font-bold text-amber-300 text-sm mb-3">Sacred Ceremonies</h4>
            <ul className="space-y-2 text-stone-400 text-[11px]">
              <li>Griha Pravesh & Vastu Shanti</li>
              <li>Maha Rudrabhishek & Shiv Archana</li>
              <li>Satyanarayan Mahapuja & Katha</li>
              <li>Mahamrityunjaya Jaap & Hawan</li>
              <li>Kaal Sarp Dosh Nivaran</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif-vedic font-bold text-amber-300 text-sm mb-3">Vedic Assurance</h4>
            <ul className="space-y-2 text-stone-400 text-[11px]">
              <li>✓ Gurukul & Sanad Certified Priests</li>
              <li>✓ 100% Shuddh Cow Ghee & Samagri</li>
              <li>✓ Punctuality & Muhurat Guarantee</li>
              <li>✓ High-Definition Virtual Sanctum</li>
              <li>✓ Secure PCI-DSS Payments</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif-vedic font-bold text-amber-300 text-sm mb-3">Switch Persona Anytime</h4>
            <p className="text-stone-400 text-[11px] mb-3">
              Test all user perspectives seamlessly using the top header dropdown:
            </p>
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => { handleSwitchUser('user-ramesh'); setActiveTab('pujas'); }}
                className="text-left bg-stone-800 hover:bg-stone-700 p-2 rounded-lg text-amber-200 font-medium"
              >
                🕉️ Devotee (Ramesh Kumar)
              </button>
              <button 
                onClick={() => { handleSwitchUser('user-radheshyam'); setActiveTab('pandit-dashboard'); }}
                className="text-left bg-stone-800 hover:bg-stone-700 p-2 rounded-lg text-amber-200 font-medium"
              >
                📿 Pandit Ji (Radheshyam Shastri)
              </button>
              <button 
                onClick={() => { handleSwitchUser('user-admin'); setActiveTab('admin-dashboard'); }}
                className="text-left bg-stone-800 hover:bg-stone-700 p-2 rounded-lg text-amber-200 font-medium"
              >
                🛡️ Platform Admin (Pooja Sharma)
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
          <p>© 2026 Vedam Technologies Ltd. All Rights Reserved. Built according to PRD Specifications.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Made with devotion & Vedic purity</span>
            <span className="text-amber-500">🕉️</span>
          </p>
        </div>
      </footer>

      {/* Puja Details Modal */}
      {selectedPujaForDetails && (
        <PujaDetailsModal
          puja={selectedPujaForDetails}
          onClose={() => setSelectedPujaForDetails(null)}
          onBookPuja={(p) => handleBookingInitiate(p)}
          lang={lang}
        />
      )}

      {/* Booking Flow Modal */}
      {bookingPuja && (
        <BookingModal
          puja={bookingPuja}
          initialPandit={bookingPandit}
          allPandits={pandits}
          samagriKits={samagriKits}
          currentUser={currentUser}
          onClose={() => {
            setBookingPuja(null);
            setBookingPandit(null);
          }}
          onBookingSuccess={handleBookingSuccess}
          lang={lang}
        />
      )}

      {/* Devotee Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={handleUpdateProfile}
          lang={lang}
        />
      )}

    </div>
  );
}
