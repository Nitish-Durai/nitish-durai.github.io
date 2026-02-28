import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataNode { x: number; y: number; id: number; }
interface Packet { fromIdx: number; toIdx: number; t: number; speed: number; }
type Phase = 'pipeline' | 'dashboard' | 'done';

/* ─── Loading words that cycle during the pipeline phase ─── */
const LOADING_WORDS = [
  'Initializing data pipeline...',
  'Connecting to data warehouse...',
  'Bootstrapping ML engine...',
  'Loading analytics modules...',
  'Calibrating neural pathways...',
  'System ready.',
];

function LoadingWords() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx(i => (i + 1 < LOADING_WORDS.length ? i + 1 : i));
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none" style={{ zIndex: 10 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="font-mono text-xs sm:text-sm text-[#FFD000]/70 tracking-wider"
        >
          {LOADING_WORDS[idx]}
          {idx < LOADING_WORDS.length - 1 && (
            <span className="inline-block w-[6px] h-[13px] bg-[#FFD000]/70 align-middle ml-1 boot-cursor" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Binary stream bg ─── */
function BinaryStream() {
  const cols = 38;
  return (
    <div className="absolute inset-0 flex overflow-hidden pointer-events-none" aria-hidden="true" style={{ opacity: 0.04 }}>
      {Array.from({ length: cols }, (_, c) => (
        <div
          key={c}
          className="flex-1 font-mono text-[9px] text-[#FFD000] leading-[14px]"
          style={{
            animation: `binaryScroll ${6 + (c % 7)}s linear infinite`,
            animationDelay: `${-(c * 0.28)}s`,
          }}
        >
          {Array.from({ length: 80 }, () => Math.round(Math.random())).join('\n')}
        </div>
      ))}
    </div>
  );
}

/* ─── Phase 1: Data pipeline canvas (with loading words) ─── */
function DataPipelineCanvas({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2, cy = canvas.height / 2;
    const R = Math.min(cx, cy) * 0.42;
    const nodeCount = 7;

    const nodes: DataNode[] = Array.from({ length: nodeCount }, (_, i) => {
      const a = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), id: i };
    });
    nodes.push({ x: cx, y: cy, id: nodeCount });

    const edges: [number, number][] = [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[0,7],[2,7],[4,7],[6,7]
    ];

    const packets: Packet[] = edges.map(([f, t]) => ({
      fromIdx: f, toIdx: t, t: Math.random(), speed: 0.006 + Math.random() * 0.008,
    }));

    const DURATION = 1800;
    let start: number | null = null;
    let raf: number;

    const draw = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Edges
      edges.forEach(([fi, ti]) => {
        const f = nodes[fi], t = nodes[ti];
        ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = `rgba(255,208,0,${0.18 * p})`; ctx.lineWidth = 1; ctx.stroke();
      });

      // Nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.id === nodeCount ? 11 : 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,208,0,${0.75 * p})`;
        ctx.shadowBlur = 14; ctx.shadowColor = '#FFD000'; ctx.fill(); ctx.shadowBlur = 0;
      });

      // Packets
      packets.forEach(pk => {
        pk.t = (pk.t + pk.speed) % 1;
        const f = nodes[pk.fromIdx], t = nodes[pk.toIdx];
        const px = f.x + (t.x - f.x) * pk.t, py = f.y + (t.y - f.y) * pk.t;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,241,118,${p})`;
        ctx.shadowBlur = 8; ctx.shadowColor = '#FFF176'; ctx.fill(); ctx.shadowBlur = 0;
      });

      // Dataset counter
      ctx.font = '13px monospace'; ctx.fillStyle = `rgba(255,208,0,${p * 0.6})`; ctx.textAlign = 'center';
      ctx.fillText(`dataset_counter: ${Math.floor(p * 1287)}`, cx, cy + R + 52);

      // CPU ring
      ctx.beginPath();
      ctx.arc(56, canvas.height - 56, 26, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2);
      ctx.strokeStyle = `rgba(255,208,0,${p * 0.85})`; ctx.lineWidth = 4; ctx.stroke();
      ctx.font = '10px monospace'; ctx.fillStyle = `rgba(255,208,0,${p * 0.75})`; ctx.textAlign = 'center';
      ctx.fillText('CPU', 56, canvas.height - 52);

      // Latency
      ctx.textAlign = 'right'; ctx.font = '11px monospace';
      ctx.fillStyle = `rgba(255,208,0,${p * 0.55})`;
      ctx.fillText(`latency: ${(Math.random() * 5 + 1).toFixed(1)}ms`, canvas.width - 20, canvas.height - 20);

      if (p < 1) { raf = requestAnimationFrame(draw); }
      else { setTimeout(onDone, 300); }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <LoadingWords />
    </div>
  );
}

/* ─── Phase 2: Dashboard render ─── */
function DashboardLayer({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1350); return () => clearTimeout(t); }, [onDone]);

  const bars = [55, 75, 45, 90, 65, 80];
  const pts = [20, 40, 30, 70, 55, 85, 65, 95];
  const W = 200, H = 70;
  const poly = pts.map((v, i) => `${(i / (pts.length - 1)) * W},${H - (v / 100) * H}`).join(' ');
  const cards = ['8.01 CGPA', '4+ Projects', '1 Internship', '3+ Certs'];

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
      <div className="grid grid-cols-2 gap-4 w-[min(90vw,580px)]">
        {/* Line chart */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }}
          className="bg-[#111] border border-[#FFD000]/20 rounded-xl p-4">
          <div className="text-[#FFD000] text-[11px] mb-2 font-mono">progress_trend.py</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 68 }}>
            <motion.polyline points={poly} fill="none" stroke="#FFD000" strokeWidth="2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.2 }} />
            {pts.map((v, i) => (
              <motion.circle key={i} cx={(i / (pts.length - 1)) * W} cy={H - (v / 100) * H} r={3} fill="#FFD000"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.07 }} />
            ))}
          </svg>
        </motion.div>

        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45 }}
          className="bg-[#111] border border-[#FFD000]/20 rounded-xl p-4">
          <div className="text-[#FFD000] text-[11px] mb-2 font-mono">skills_dist.py</div>
          <div className="flex items-end gap-2" style={{ height: 68 }}>
            {bars.map((h, i) => (
              <motion.div key={i} className="flex-1 bg-gradient-to-t from-[#FFD000] to-[#FFB800] rounded-sm"
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                transition={{ delay: 0.28 + i * 0.07, duration: 0.45, ease: 'easeOut' }} />
            ))}
          </div>
        </motion.div>

        {/* Metric cards */}
        {cards.map((c, i) => (
          <motion.div key={c} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 + i * 0.1, duration: 0.45 }}
            className="bg-[#111] border border-[#FFD000]/20 rounded-xl p-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FFD000] animate-pulse block" />
            <span className="text-[#FFD000] font-mono text-sm font-bold">{c}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main export ─── */
export default function StartupScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('pipeline');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) onComplete();
  }, [onComplete]);

  const go = useCallback((next: Phase, delay = 0) => {
    setTimeout(() => setPhase(next), delay);
  }, []);

  return (
    <motion.div className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      exit={{ opacity: 0 }} transition={{ duration: 0.65, ease: 'easeInOut' }}>
      <BinaryStream />

      {/* Top progress bar: pipeline = 50%, dashboard = 100% */}
      <motion.div className="absolute top-0 left-0 h-[2px] bg-[#FFD000] z-10"
        animate={{ width: phase === 'pipeline' ? '50%' : '100%' }}
        transition={{ duration: 0.55, ease: 'easeOut' }} />

      <AnimatePresence mode="wait">
        {phase === 'pipeline' && (
          <motion.div key="pipeline" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <DataPipelineCanvas onDone={() => go('dashboard')} />
          </motion.div>
        )}
        {phase === 'dashboard' && (
          <motion.div key="dashboard" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <DashboardLayer onDone={() => { go('done'); setTimeout(onComplete, 400); }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-5 font-mono text-[#FFD000]/35 text-xs select-none">ND_SYS v1.0</div>
    </motion.div>
  );
}
