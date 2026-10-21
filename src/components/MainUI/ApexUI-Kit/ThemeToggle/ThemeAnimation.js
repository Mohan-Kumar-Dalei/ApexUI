// config/animations.js

// Soft-edged circle that grows from `at` until it covers the screen. It animates
// a radial-gradient mask through a registered property, which stays smooth;
// scaling a blurred SVG mask to screen size re-rasterises every frame and flickers.
const circleReveal = (at) => `
  @property --vt-r { syntax: '<length>'; inherits: false; initial-value: 0px; }
  ::view-transition-new(root) {
    -webkit-mask-image: radial-gradient(circle at ${at}, #000 var(--vt-r), transparent calc(var(--vt-r) + 12vmax));
    mask-image: radial-gradient(circle at ${at}, #000 var(--vt-r), transparent calc(var(--vt-r) + 12vmax));
    animation: vt-circle var(--vt-duration) var(--vt-ease);
  }
  ::view-transition-old(root) { animation: none; }
  @keyframes vt-circle {
    from { --vt-r: -12vmax; }
    to   { --vt-r: 150vmax; }
  }
`;

// Holds the last frame until the transition ends (no flash of the old theme)
// and keeps the browser's default plus-lighter blending out of the reveal.
const footer = `
  ::view-transition-old(root), ::view-transition-new(root) {
    animation-fill-mode: both;
    mix-blend-mode: normal;
  }
`;

export function buildAnimationCSS(animation, opts = {}) {
  return presetCSS(animation, opts) + footer;
}

function presetCSS(animation, opts = {}) {
  const duration = opts.duration || "1.5s";
  const ease = opts.ease || "var(--vt-ease)";

  // `var(--vt-ease)` would refer to itself here, so only set a real easing.
  const header = `
    :root { --vt-duration: ${duration};${ease === "var(--vt-ease)" ? "" : ` --vt-ease: ${ease};`} }
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
    case "circle":
      // Grows from the clicked button (ThemeToggle sets --cx / --cy).
      return header + circleReveal("var(--cx, 50%) var(--cy, 50%)");

    case "circle-left":
      return header + circleReveal("0 0");

    case "circle-right":
      return header + circleReveal("100% 0");
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