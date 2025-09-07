// config/animations.js

// Small utility to escape quotes in data-URIs
const esc = (s = "") => s.replace(/#/g, "%23").replace(/\n/g, "");

export function buildAnimationCSS(animation, opts = {}) {
  const duration = opts.duration || "1.5s";
  const ease = opts.ease || "var(--vt-ease)";

  const header = `
    :root { --vt-duration: ${duration}; --vt-ease: ${ease}; }
    ::view-transition-group(root){ animation-timing-function: var(--vt-ease); }
  `;

  // GIF MASK
  if (typeof animation === "object" && animation?.type === "gif") {
    const link = animation.link || "";
    return header + `
      ::view-transition-new(root) {
        mask: url('${link}') center  / 0 no-repeat;
        -webkit-mask: url('${link}') center  / 0 no-repeat;
        animation: vt-scale-gif var(--vt-duration);
      }
      ::view-transition-old(root), .dark::view-transition-old(root) {
        animation: vt-scale-gif var(--vt-duration);
      }
      @keyframes vt-scale-gif {
        0%   { mask-size: 0; -webkit-mask-size: 0; }
        10%  { mask-size: 50vmax; -webkit-mask-size: 40vmax; }
        90%  { mask-size: 50vmax; -webkit-mask-size: 40vmax; }
        100% { mask-size: 2000vmax; -webkit-mask-size: 2000vmax; }
      }
    `;
  }

  // Named PRESETS
  const preset = typeof animation === "string" ? animation : animation?.type;

  switch (preset) {
    case "circle": {
      const circleSVG = esc(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>`
      );
      return header + `
        ::view-transition-new(root) {
          mask: url('data:image/svg+xml,${circleSVG}') center / 0 no-repeat;
          -webkit-mask: url('data:image/svg+xml,${circleSVG}') center / 0 no-repeat;
          animation: vt-scale var(--vt-duration);
        }
        ::view-transition-old(root), .dark::view-transition-old(root) {
          animation: vt-scale var(--vt-duration);
        }
        @keyframes vt-scale {
          to { mask-size: 200vmax; -webkit-mask-size: 200vmax; }
        }
      `;
    }

    case "circle-left": {
      const svg = esc(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="b"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23b)"/></svg>`
      );
      return header + `
        ::view-transition-new(root) {
          mask: url('data:image/svg+xml,${svg}') top left / 0 no-repeat;
          -webkit-mask: url('data:image/svg+xml,${svg}') top left / 0 no-repeat;
          transform-origin: top left;
          animation: vt-scale-tl var(--vt-duration);
        }
        ::view-transition-old(root), .dark::view-transition-old(root) {
          transform-origin: top left;
          animation: vt-scale-tl var(--vt-duration);
        }
        @keyframes vt-scale-tl { to { mask-size: 350vmax; -webkit-mask-size: 350vmax; } }
      `;
    }
    case "circle-right": {
      const svg = esc(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
       <defs><filter id="b"><feGaussianBlur stdDeviation="2"/></filter></defs>
       <circle cx="40" cy="0" r="18" fill="white" filter="url(%23b)"/>
     </svg>`
      );

      return header + `
    ::view-transition-new(root) {
      mask: url('data:image/svg+xml,${svg}') top right / 0 no-repeat;
      -webkit-mask: url('data:image/svg+xml,${svg}') top right / 0 no-repeat;
      transform-origin: top right;
      animation: vt-scale-tr var(--vt-duration);
    }

    ::view-transition-old(root), .dark::view-transition-old(root) {
      transform-origin: top right;
      animation: vt-scale-tr var(--vt-duration);
    }

    @keyframes vt-scale-tr {
      to {
        mask-size: 350vmax;
        -webkit-mask-size: 350vmax;
      }
    }
  `;
    }
    case "split-reveal-horizontal": {
      return header + `
    ::view-transition-new(root) {
      /* Start as a 0-height line in the middle */
      clip-path: inset(50% 0 50% 0);
      animation: vt-split-reveal var(--vt-duration) cubic-bezier(0.25, 1, 0.5, 1);
    }

    ::view-transition-old(root), .dark::view-transition-old(root) {
      /* The old view just fades away in the background */
      animation: vt-fade-out calc(var(--vt-duration) * 0.5) ease-out forwards;
    }

    @keyframes vt-split-reveal {
      to {
        /* Expand to full height */
        clip-path: inset(0 0 0 0);
      }
    }

    @keyframes vt-fade-out {
      to { opacity: 0; }
    }
  `;
    }

    case "chevron-wipe-right": {
      return header + `
    ::view-transition-new(root) {
      clip-path: polygon(0% 0%, 0% 100%, 0% 100%, 0% 50%, 0% 0%);
      animation: vt-chevron-wipe var(--vt-duration) ease-in-out;
    }
    ::view-transition-old(root) {
      animation: vt-fade-out calc(var(--vt-duration) * 0.5) forwards;
    }
    @keyframes vt-chevron-wipe {
      to { clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 125% 50%, 100% 0%); }
    }
    @keyframes vt-fade-out { to { opacity: 0; } }
  `;
    }
    case "blinds-reveal-down": {
      return header + `
    ::view-transition-new(root) {
      clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%, 0% 20%, 100% 20%, 100% 20%, 0% 20%, 0% 40%, 100% 40%, 100% 40%, 0% 40%, 0% 60%, 100% 60%, 100% 60%, 0% 60%, 0% 80%, 100% 80%, 100% 80%, 0% 80%, 0% 100%, 100% 100%, 100% 100%, 0% 100%);
      animation: vt-blinds-reveal var(--vt-duration) ease-out;
    }
    ::view-transition-old(root) {
      animation: vt-fade-out calc(var(--vt-duration) * 0.5) forwards;
    }
    @keyframes vt-blinds-reveal {
      to {
        clip-path: polygon(0% 0%, 100% 0%, 100% 20%, 0% 20%, 0% 20%, 100% 20%, 100% 40%, 0% 40%, 0% 40%, 100% 40%, 100% 60%, 0% 60%, 0% 60%, 100% 60%, 100% 80%, 0% 80%, 0% 80%, 100% 80%, 100% 100%, 0% 100%, 0% 100%, 100% 100%, 100% 100%, 0% 100%);
      }
    }
    @keyframes vt-fade-out { to { opacity: 0; } }
  `;
    }

    case "clock-wipe": {
      return header + `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
    ::view-transition-new(root) {
      mask: conic-gradient(from 90deg, #000 var(--angle), transparent var(--angle));
      -webkit-mask: conic-gradient(from 90deg, #000 var(--angle), transparent var(--angle));
      animation: vt-clock-wipe var(--vt-duration) linear;
    }
    ::view-transition-old(root) {
      animation: vt-fade-out calc(var(--vt-duration) * 0.5) forwards;
    }
    @keyframes vt-clock-wipe {
      to { --angle: 360deg; }
    }
    @keyframes vt-fade-out { to { opacity: 0; } }
  `;
    }

    case "polygon": {
      return header + `
        ::view-transition-group(root){ animation-duration: ${duration}; }
        ::view-transition-new(root){ animation-name: vt-reveal-light; }
        ::view-transition-old(root), .dark::view-transition-old(root){ animation:none; z-index:-1; }
        .dark::view-transition-new(root){ animation-name: vt-reveal-dark; }
        @keyframes vt-reveal-dark {
          from { clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%); }
          to   { clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%); }
        }
        @keyframes vt-reveal-light {
          from { clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%); }
          to   { clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%); }
        }
      `;
    }

    case "blur-fade": {
      return header + `
        ::view-transition-new(root) {
          filter: blur(40px);
          animation: vt-fade-in ${duration} forwards;
        }
        ::view-transition-old(root) {
          filter: blur(0);
          animation: vt-fade-out ${duration} forwards;
        }
        @keyframes vt-fade-in   { from { filter: blur(40px); opacity:0; } to { filter: blur(0); opacity:1; } }
        @keyframes vt-fade-out  { from { filter: blur(0); opacity:1; }  to { filter: blur(40px); opacity:0; } }
      `;

    }

    case "curtain-wipe": {
      return header + `
    ::view-transition-new(root) {
      clip-path: inset(100% 0 0 0); /* pura niche se hidden */
      animation: vt-curtain-wipe var(--vt-duration) forwards;
    }
    ::view-transition-old(root), .dark::view-transition-old(root) {
      clip-path: inset(0 0 0 0);
      animation: vt-curtain-wipe-old var(--vt-duration) forwards;
    }

    @keyframes vt-curtain-wipe {
      to {
        clip-path: inset(0 0 0 0); /* pura screen visible */
      }
    }

    @keyframes vt-curtain-wipe-old {
      to {
        clip-path: inset(0 0 100% 0); /* pura upar slide hoke gayab */
      }
    }
  `;
    }
   // Add more animation 




    default:
      return header; // no-op if unknown
  }
}
