// components/TouchHearts.tsx
'use client';

import { useEffect, useRef } from 'react';

/**
 * TouchHearts (tap/click hearts only)
 * - No falling background hearts.
 * - Creates a heart at pointer location on pointerdown.
 * - Animates up + fade and removes after animation end.
 * - Respects prefers-reduced-motion.
 *
 * Usage: <TouchHearts /> near the root of the app (e.g. in app/layout.tsx or app/gallery/page.tsx)
 */

export default function TouchHearts({
  maxConcurrent = 14,
  throttleMs = 90,
  animationMs = 1800, // total animation duration
}: {
  maxConcurrent?: number;
  throttleMs?: number;
  animationMs?: number;
}) {
  const lastTimeRef = useRef(0);
  const activeRef = useRef(0);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // if user prefers reduced motion, do nothing
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // create container
    const container = document.createElement('div');
    container.id = 'touch-hearts-container';
    Object.assign(container.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '9999',
    });
    containerRef.current = container;
    document.body.appendChild(container);

    function createHeart(x: number, y: number) {
      if (!containerRef.current) return;
      if (activeRef.current >= maxConcurrent) return;

      const heart = document.createElement('div');
      heart.className = 'pg-touch-heart';
      heart.setAttribute('role', 'presentation');

      // center at pointer
      heart.style.position = 'absolute';
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.pointerEvents = 'none';
      heart.style.transform = 'translate(-50%, -50%)';

      // randomized style
      const size = Math.floor(Math.random() * 18) + 18; // 18 - 36px
      const drift = Math.floor(Math.random() * 120) - 60; // -60 to +60 px
      const rotate = Math.floor(Math.random() * 50) - 25; // -25 to +25 deg
      const delay = Math.random() * 80; // ms

      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;
      heart.style.borderRadius = '6px'; // small rounding for nicer shape before clip
      heart.style.transform += ` rotate(${rotate}deg)`;

      // CSS variables used in injected stylesheet
      heart.style.setProperty('--pg-thrift-drift', `${drift}px`);
      heart.style.setProperty('--pg-thrift-duration', `${animationMs}ms`);
      heart.style.setProperty('--pg-thrift-delay', `${delay}ms`);

      containerRef.current.appendChild(heart);
      activeRef.current += 1;

      const cleanup = () => {
        try { heart.remove(); } catch {}
        activeRef.current -= 1;
      };

      // remove after (duration + delay + small buffer)
      const totalMs = animationMs + delay + 200;
      const timeout = setTimeout(cleanup, totalMs);

      // in case animationend fires earlier/late, also listen to animationend
      const onAnimEnd = () => {
        clearTimeout(timeout);
        cleanup();
        heart.removeEventListener('animationend', onAnimEnd);
      };
      heart.addEventListener('animationend', onAnimEnd);
    }

    function onPointerDown(e: PointerEvent) {
      // throttle
      const now = Date.now();
      if (now - lastTimeRef.current < throttleMs) return;
      lastTimeRef.current = now;

      // get viewport coordinates
      const x = e.clientX;
      const y = e.clientY;

      // spawn a small burst (1 or 2)
      createHeart(x, y);
      if (Math.random() < 0.35) {
        createHeart(x + (Math.random() * 22 - 11), y - 8);
      }
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      try { container.remove(); } catch {}
    };
  }, [maxConcurrent, throttleMs, animationMs]);

  // inject CSS once
  useEffect(() => {
    if (document.getElementById('touch-hearts-styles')) return;
    const style = document.createElement('style');
    style.id = 'touch-hearts-styles';
    style.innerHTML = `
/* Touch hearts styles (no DOM heavy work, GPU-friendly) */
.pg-touch-heart {
  display: inline-block;
  will-change: transform, opacity;
  background: linear-gradient(135deg, #ff7ab6 0%, #7c5cff 100%);
  /* heart shape using clip-path (fallback will show a rounded square) */
  -webkit-clip-path: path('M 12 21 l -9 -7 c -3 -2.5 0 -8 5 -8 c 2 0 4 1 4 1 s 2 -1 4 -1 c 5 0 8 5.5 5 8 l -9 7 z');
  clip-path: path('M 12 21 l -9 -7 c -3 -2.5 0 -8 5 -8 c 2 0 4 1 4 1 s 2 -1 4 -1 c 5 0 8 5.5 5 8 l -9 7 z');
  filter: drop-shadow(0 8px 20px rgba(0,0,0,0.18));
  position: absolute;
  transform-origin: center;
  opacity: 0;
  animation-name: pg-touchheart-float;
  animation-duration: var(--pg-thrift-duration, 1800ms);
  animation-timing-function: cubic-bezier(.22,.9,.29,1);
  animation-fill-mode: forwards;
  animation-delay: var(--pg-thrift-delay, 0ms);
}

/* if browser doesn't support clip-path:path, hide and fallback to pseudo hearts */
@supports not (clip-path: path('M0 0')) {
  .pg-touch-heart {
    clip-path: circle(50% at 50% 50%);
    border-radius: 50%;
  }
}

/* keyframes: rise up, scale a little, fade out, drift horizontally using css var */
@keyframes pg-touchheart-float {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(0) scale(0.98);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(-10px) scale(1.06);
  }
  75% {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(-80px) translateX(var(--pg-thrift-drift, 0px)) scale(0.98);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(-160px) translateX(var(--pg-thrift-drift, 0px)) scale(0.86);
  }
}

/* smaller on small screens */
@media (max-width: 640px) {
  .pg-touch-heart { width: 20px; height: 20px; animation-duration: calc(var(--pg-thrift-duration, 1800ms) * 0.9); }
}

/* reduced motion — disable animation */
@media (prefers-reduced-motion: reduce) {
  .pg-touch-heart { animation: none !important; opacity: 0 !important; display: none !important; }
}
    `;
    document.head.appendChild(style);
  }, []);

  return null;
}
