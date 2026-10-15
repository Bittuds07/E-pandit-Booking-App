// Web Audio API Synthesizer for Authentic Vedic Temple Sounds

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Resonant Temple Bell Sound (Ghanti)
export function playTempleBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Fundamental frequencies of an authentic bronze temple bell
    const frequencies = [587.33, 1174.66, 1760.0, 2349.32, 3520.0];
    const gains = [0.6, 0.4, 0.25, 0.15, 0.08];
    const decayTimes = [3.5, 2.8, 2.0, 1.4, 0.9];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, now);
    masterGain.connect(ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      // Slight inharmonic detuning for metallic bronze resonance
      osc.frequency.setValueAtTime(freq * (1 + (idx * 0.004)), now);

      gainNode.gain.setValueAtTime(gains[idx], now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decayTimes[idx]);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(now);
      osc.stop(now + decayTimes[idx] + 0.1);
    });
  } catch (err) {
    console.warn("Audio synthesis error:", err);
  }
}

// Sacred Shankh (Conch Shell) Blowing Sound
export function playShankh() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 3.2;

    // Shankh fundamental is around 220Hz - 245Hz with deep brassy overtones
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Pitch envelope: gradual rise, hold, natural breath decay
    osc1.frequency.setValueAtTime(210, now);
    osc1.frequency.linearRampToValueAtTime(245, now + 0.8);
    osc1.frequency.setValueAtTime(245, now + 2.2);
    osc1.frequency.exponentialRampToValueAtTime(200, now + duration);

    osc2.frequency.setValueAtTime(420, now);
    osc2.frequency.linearRampToValueAtTime(490, now + 0.8);
    osc2.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Warm resonant acoustic filter
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480, now);
    filter.Q.setValueAtTime(3.5, now);

    // Breath gain envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.38, now + 0.6);
    gainNode.gain.setValueAtTime(0.38, now + 2.2);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  } catch (err) {
    console.warn("Shankh audio error:", err);
  }
}

// Deep Om Vibration Drone
export function playOmChant() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 4.0;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(136.1, now); // 136.1 Hz is the sacred Om frequency (C#)

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(68.05, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  } catch (err) {
    console.warn("Om chant audio error:", err);
  }
}
