// A crunch, made in the browser from filtered noise. Off until the visitor turns it on.
const KEY = 'lays.sound';
let ctx = null;
export const soundOn = () => {
    try {
        return localStorage.getItem(KEY) === '1';
    } catch {
        return false;
    }
};
export function setSound(on) {
    try {
        localStorage.setItem(KEY, on ? '1' : '0');
    } catch {
        /* fine */
    }
    if (on) crunch();
}

export function crunch() {
    if (!soundOn()) return;
    try {
        ctx ??= new AudioContext();
        const len = 0.22;
        const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        // a few sharp cracks inside a short burst of noise
        for (let i = 0; i < d.length; i++) {
            const t = i / d.length;
            const crack = Math.sin(t * 90) > 0.86 ? 1 : 0.35;
            d[i] = (Math.random() * 2 - 1) * crack * Math.pow(1 - t, 2.4);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const band = ctx.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.value = 2600;
        band.Q.value = 0.9;
        const gain = ctx.createGain();
        gain.gain.value = 0.5;
        src.connect(band).connect(gain).connect(ctx.destination);
        src.start();
    } catch {
        /* no audio here */
    }
}
