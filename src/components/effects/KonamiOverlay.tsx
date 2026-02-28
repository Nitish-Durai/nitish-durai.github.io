import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* K-Means style clustering canvas overlay */
function KMeansCanvas({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const K = 4;
    const POINTS = 120;
    const colors = ['#FFD000', '#FF6B6B', '#4ECDC4', '#A29BFE'];

    // Random data points
    const points = Array.from({ length: POINTS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      cluster: Math.floor(Math.random() * K),
    }));

    // Centroids
    const centroids = Array.from({ length: K }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move centroids
      centroids.forEach(c => {
        c.x += c.vx; c.y += c.vy;
        if (c.x < 60 || c.x > canvas.width - 60) c.vx *= -1;
        if (c.y < 60 || c.y > canvas.height - 60) c.vy *= -1;
      });

      // Reassign points to nearest centroid
      points.forEach(p => {
        let minD = Infinity, best = 0;
        centroids.forEach((c, i) => {
          const d = Math.hypot(p.x - c.x, p.y - c.y);
          if (d < minD) { minD = d; best = i; }
        });
        p.cluster = best;
      });

      // Draw Voronoi-style areas (simple per-point coloring)
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.cluster] + '55';
        ctx.fill();
      });

      // Lines from points to centroid
      points.forEach(p => {
        const c = centroids[p.cluster];
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(c.x, c.y);
        ctx.strokeStyle = colors[p.cluster] + '18'; ctx.lineWidth = 0.5; ctx.stroke();
      });

      // Draw centroids
      centroids.forEach((c, i) => {
        // Glow ring
        ctx.beginPath(); ctx.arc(c.x, c.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = colors[i] + '40'; ctx.lineWidth = 1.5; ctx.stroke();
        // Centre circle
        ctx.beginPath(); ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.shadowBlur = 18; ctx.shadowColor = colors[i]; ctx.fill(); ctx.shadowBlur = 0;
        // Label
        ctx.font = 'bold 11px monospace'; ctx.fillStyle = '#000';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`C${i + 1}`, c.x, c.y);
      });

      // HUD label
      ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD000';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('🤫 EASTER EGG: K-Means Live Clustering', canvas.width / 2, 24);
      ctx.font = '11px monospace'; ctx.fillStyle = '#FFD000aa';
      ctx.fillText('Press ESC or click anywhere to exit', canvas.width / 2, 48);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full cursor-pointer"
      style={{ zIndex: 99998 }}
      onClick={onClose}
    />
  );
}

export default function KonamiOverlay({ active, onClose }: { active: boolean; onClose: () => void }) {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    if (active) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active, handleKey]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div key="konami" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }} className="fixed inset-0" style={{ zIndex: 99998 }}>
          <KMeansCanvas onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
