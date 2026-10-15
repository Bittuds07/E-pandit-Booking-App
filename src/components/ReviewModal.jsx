import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ReviewModal({ booking, onClose, onSubmitReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedBadges, setSelectedBadges] = useState(["Vedic Pronunciation", "Punctual"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableBadges = [
    "Vedic Pronunciation",
    "Punctual & Disciplined",
    "Guided Rituals Well",
    "Pure & Fresh Samagri",
    "Clear Explanations",
    "Reassuring & Devout"
  ];

  const toggleBadge = (badge) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badge));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitReview({
        rating,
        comment: comment || "Very divine, punctual and spiritually uplifting ceremony.",
        badges: selectedBadges
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-300 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-amber-100 p-5 flex items-center justify-between border-b border-amber-800">
          <div>
            <h3 className="font-serif-vedic text-lg font-bold">Rate Sacred Ceremony</h3>
            <p className="text-xs text-amber-300 mt-0.5">{booking?.pujaTitle} with {booking?.panditName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-amber-800 text-amber-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Star Rating */}
          <div className="text-center space-y-2">
            <p className="text-xs uppercase font-bold text-stone-500 tracking-wider">How was your ritual experience?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-125 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-stone-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-800">
              {rating === 5 ? '🌟 Exceptional & Sacred' : rating === 4 ? 'Very Good' : 'Satisfactory'}
            </p>
          </div>

          {/* Recognition Badges */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Highlight Pandit Ji's Strengths
            </label>
            <div className="flex flex-wrap gap-2">
              {availableBadges.map((badge) => {
                const isSelected = selectedBadges.includes(badge);
                return (
                  <button
                    type="button"
                    key={badge}
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border-2 border-amber-500 font-bold'
                        : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Your Feedback & Blessings
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share how the rituals felt, punctuality, mantra clarity..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:from-amber-700 hover:to-orange-700 transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review 🙏'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
