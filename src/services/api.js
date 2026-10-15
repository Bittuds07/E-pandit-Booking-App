import { initialData } from '../data/initialData';

const API_BASE = '/api';

// Helper to check and load local fallback store
function getLocalStore() {
  try {
    const raw = localStorage.getItem('vedam_store');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  const cloned = JSON.parse(JSON.stringify(initialData));
  try {
    localStorage.setItem('vedam_store', JSON.stringify(cloned));
  } catch (e) {}
  return cloned;
}

function saveLocalStore(store) {
  try {
    localStorage.setItem('vedam_store', JSON.stringify(store));
  } catch (e) {}
}

let activeUserId = "user-ramesh";

export const api = {
  // Auth & User
  getUsers: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/users`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().users;
  },

  getCurrentUser: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    const store = getLocalStore();
    return store.users.find(u => u.id === activeUserId) || store.users[0];
  },

  switchRole: async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/auth/switch-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    activeUserId = userId;
    const store = getLocalStore();
    const user = store.users.find(u => u.id === userId) || store.users[0];
    return { success: true, user };
  },

  updateProfile: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    const store = getLocalStore();
    const user = store.users.find(u => u.id === activeUserId) || store.users[0];
    Object.assign(user, data);
    saveLocalStore(store);
    return user;
  },

  // Pujas
  getPujas: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.mode) params.append('mode', filters.mode);
      if (filters.search) params.append('search', filters.search);
      const res = await fetch(`${API_BASE}/pujas?${params.toString()}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().pujas;
  },

  getPujaById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pujas/${id}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().pujas.find(p => p.id === id);
  },

  // Pandits
  getPandits: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.language) params.append('language', filters.language);
      if (filters.city) params.append('city', filters.city);
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.mode) params.append('mode', filters.mode);
      if (filters.kycStatus) params.append('kycStatus', filters.kycStatus);
      const res = await fetch(`${API_BASE}/pandits?${params.toString()}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().pandits;
  },

  getPanditById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pandits/${id}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().pandits.find(p => p.id === id);
  },

  updatePanditAvailability: async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/pandits/${id}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    const store = getLocalStore();
    const p = store.pandits.find(x => x.id === id);
    if (p) {
      Object.assign(p, data);
      saveLocalStore(store);
    }
    return p;
  },

  requestPanditPayout: async (id, amount) => {
    try {
      const res = await fetch(`${API_BASE}/pandits/${id}/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    const store = getLocalStore();
    const p = store.pandits.find(x => x.id === id);
    if (p) {
      p.pendingPayout = 0;
      p.walletBalance = 0;
      saveLocalStore(store);
    }
    return { success: true, message: `Payout of ₹${(amount || 12500).toLocaleString('en-IN')} initiated to ${p?.bankAccount || 'Bank'}` };
  },

  submitPanditKYC: async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/pandits/${id}/kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    const store = getLocalStore();
    const p = store.pandits.find(x => x.id === id);
    if (p) {
      p.kycStatus = 'pending';
      saveLocalStore(store);
    }
    return { success: true, message: "KYC credentials submitted for Admin review" };
  },

  // Bookings
  getBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.panditId) params.append('panditId', filters.panditId);
      if (filters.status) params.append('status', filters.status);
      const res = await fetch(`${API_BASE}/bookings?${params.toString()}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().bookings;
  },

  getBookingById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().bookings.find(b => b.id === id);
  },

  createBooking: async (bookingData) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}

    const store = getLocalStore();
    const bookingId = `EP-${Math.floor(10000 + Math.random() * 90000)}`;
    const puja = store.pujas.find(p => p.id === bookingData.pujaId) || store.pujas[0];
    const pandit = store.pandits.find(p => p.id === bookingData.panditId) || store.pandits[0];

    const newBooking = {
      id: bookingId,
      userId: activeUserId,
      userName: bookingData.yajmanName || "Ramesh Sharma",
      userPhone: "+91 98765 43210",
      pujaId: puja.id,
      pujaTitle: puja.title,
      panditId: pandit.id,
      panditName: pandit.name,
      panditPhone: pandit.phone || "+91 98220 12345",
      panditAvatar: pandit.avatar,
      mode: bookingData.mode || "in_person",
      date: bookingData.date || "2026-10-16",
      slot: bookingData.slot || "07:30 AM – 11:00 AM",
      samagriKitName: bookingData.samagriKitId ? "Complete 42-Item Eco Kit" : "Self Arranged",
      samagriOption: bookingData.samagriOption || "delivered_home",
      venueAddress: bookingData.venueAddress || "Whitefield, Bangalore",
      gotra: bookingData.gotra || "Kashyap",
      yajmanName: bookingData.yajmanName || "Ramesh Sharma",
      specialInstructions: bookingData.specialInstructions || "",
      pricing: {
        panditDakshina: puja.baseDakshina,
        samagriCost: bookingData.samagriKitId ? 1199 : 0,
        travelFee: 150,
        platformFee: 99,
        couponDiscount: 250,
        total: Math.max(0, puja.baseDakshina + (bookingData.samagriKitId ? 1199 : 0) + 150 + 99 - 250),
        paymentStatus: "paid",
        paymentMethod: bookingData.paymentMethod || "UPI"
      },
      status: "confirmed",
      tracking: {
        etaMinutes: 20,
        distanceRemainingKm: 3.5,
        panditVehicle: "KA-03-MM-1008 (White Dzire)"
      },
      createdAt: new Date().toISOString()
    };

    store.bookings.unshift(newBooking);
    saveLocalStore(store);
    return newBooking;
  },

  updateBookingStatus: async (id, status, note) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}

    const store = getLocalStore();
    const b = store.bookings.find(x => x.id === id);
    if (b) {
      b.status = status;
      saveLocalStore(store);
    }
    return b;
  },

  simulateTrackingStep: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}

    const store = getLocalStore();
    const b = store.bookings.find(x => x.id === id);
    if (b && b.tracking) {
      b.tracking.etaMinutes = Math.max(2, (b.tracking.etaMinutes || 18) - 3);
      b.tracking.distanceRemainingKm = Math.max(0.4, Number(((b.tracking.distanceRemainingKm || 3.2) - 0.6).toFixed(1)));
      saveLocalStore(store);
    }
    return b;
  },

  submitReview: async (bookingId, reviewData) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}

    const store = getLocalStore();
    const b = store.bookings.find(x => x.id === bookingId);
    if (b) {
      b.review = reviewData;
      saveLocalStore(store);
    }
    return { success: true };
  },

  // Samagri & Panchang
  getSamagriKits: async () => {
    try {
      const res = await fetch(`${API_BASE}/samagri-kits`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().samagriKits;
  },

  getPanchang: async () => {
    try {
      const res = await fetch(`${API_BASE}/panchang`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    return getLocalStore().panchang;
  },

  // Admin
  getAdminMetrics: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/metrics`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}
    const store = getLocalStore();
    return {
      totalBookings: store.bookings.length,
      activeBookings: store.bookings.filter(b => ['confirmed', 'on_the_way', 'in_progress'].includes(b.status)).length,
      completedBookings: store.bookings.filter(b => b.status === 'completed').length,
      totalGMV: store.bookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0),
      platformRevenue: 600,
      verifiedPandits: store.pandits.filter(p => p.kycStatus === 'verified').length,
      pendingKycPandits: store.pandits.filter(p => p.kycStatus === 'pending').length,
      conversionRate: "78.4%",
      fulfillmentRate: "98.2%",
      churnRate: "1.4%"
    };
  },

  verifyPanditKYC: async (panditId, status, badge, notes) => {
    try {
      const res = await fetch(`${API_BASE}/admin/pandits/${panditId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, badge, notes })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}

    const store = getLocalStore();
    const p = store.pandits.find(x => x.id === panditId);
    if (p) {
      p.kycStatus = status;
      p.verificationBadge = badge;
      saveLocalStore(store);
    }
    return { success: true, pandit: p };
  },

  createAdminPuja: async (pujaData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/pujas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pujaData)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}

    const store = getLocalStore();
    const newP = { id: `puja-${Date.now().toString(36)}`, ...pujaData, rating: 5.0, reviewCount: 0 };
    store.pujas.push(newP);
    saveLocalStore(store);
    return newP;
  },

  deleteAdminPuja: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/pujas/${id}`, { method: 'DELETE' });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {}

    const store = getLocalStore();
    store.pujas = store.pujas.filter(x => x.id !== id);
    saveLocalStore(store);
    return { success: true };
  },

  resetDatabase: async () => {
    try {
      await fetch(`${API_BASE}/admin/reset`, { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('vedam_store');
    return { success: true };
  }
};
