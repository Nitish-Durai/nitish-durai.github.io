import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Data Rain Canvas ── */
function DataRainCanvas({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters: digits + ML/math symbols
    const CHARS = '01ΣλμσπΩ∇∂∈∞√∫∑αβγδεζηθ10010110110010111110100'.split('');

    const COL_W = 18;
    const cols = Math.floor(canvas.width / COL_W);

    // Each column: current y drop position (in rows)
    const drops = Array.from({ length: cols }, () => Math.random() * -60);

    let raf: number;

    const draw = () => {
      // Fading trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * COL_W;

        // Head of the stream: bright white-yellow
        ctx.font = `bold 14px monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(char, x, y * 16);

        // Sub-head: bright yellow
        ctx.fillStyle = '#FFD000';
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, (y - 1) * 16);

        // Body: dim yellow
        ctx.fillStyle = `rgba(255, 208, 0, ${0.35 + Math.random() * 0.2})`;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, (y - 2) * 16);

        drops[i] = y + 1;
        // Reset column randomly once it passes bottom
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) {
          drops[i] = -Math.random() * 20;
        }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full cursor-pointer"
      style={{ zIndex: 99997 }}
      onClick={onClose}
    />
  );
}

/* ── Hook: watch for typing "data" anywhere ── */
export function useDataRain(onActivate: () => void) {
  useEffect(() => {
    const TRIGGER = 'data';
    let buf = '';
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      buf = (buf + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buf === TRIGGER) { buf = ''; onActivate(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onActivate]);
}

/* ── Overlay component ── */
export default function DataRainOverlay({ active, onClose }: { active: boolean; onClose: () => void }) {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    if (active) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active, handleKey]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="datarain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0"
          style={{ zIndex: 99997 }}
        >
          <DataRainCanvas onClose={onClose} />

          {/* HUD label */}
          <div className="fixed top-6 left-1/2 -translate-x-1/2 pointer-events-none"
               style={{ zIndex: 99999 }}>
            <div className="font-mono text-[#FFD000] text-sm bg-black/70 px-5 py-2 rounded-full border border-[#FFD000]/30 flex items-center gap-2">
              <span className="animate-pulse">⬛</span>
              DATA RAIN — type &apos;data&apos; or press ESC to exit
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
