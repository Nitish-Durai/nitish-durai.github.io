import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowDown } from 'lucide-react';
import { portfolioData } from '@/data';
import ParticleBackground from '@/components/effects/ParticleBackground';

/* ─── Animated graph lines that pulse behind the hero text ─── */
function GraphLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // 3 separate graph line series
    const series = Array.from({ length: 3 }, (_, si) => ({
      phase: si * (Math.PI * 2 / 3),
      amplitude: 35 + si * 20,
      yOffset: canvas.height * (0.35 + si * 0.12),
      speed: 0.00015 + si * 0.00008,
      opacity: 0.06 - si * 0.015,
    }));

    let t = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;

      series.forEach(s => {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const freq = (2 * Math.PI * x) / W;
          const y = s.yOffset + Math.sin(freq * 2 + t * s.speed + s.phase) * s.amplitude
                               + Math.sin(freq * 5 + t * s.speed * 0.8) * (s.amplitude * 0.3);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,208,0,${s.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glowing data points along the line
        for (let xi = 0; xi <= W; xi += W / 8) {
          const freq = (2 * Math.PI * xi) / W;
          const y = s.yOffset + Math.sin(freq * 2 + t * s.speed + s.phase) * s.amplitude
                               + Math.sin(freq * 5 + t * s.speed * 0.8) * (s.amplitude * 0.3);
          const pulse = (Math.sin(t * 0.002 + xi) + 1) / 2; // 0..1
          ctx.beginPath();
          ctx.arc(xi, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,208,0,${s.opacity * 4 * (0.4 + pulse * 0.6)})`;
          ctx.shadowBlur = 6; ctx.shadowColor = '#FFD000'; ctx.fill(); ctx.shadowBlur = 0;
        }
      });

      t++;
      raf = requestAnimationFrame(draw);
    };

    if (!isMobile) draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2, mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}

/* ─── Floating data particles (upward drift) ─── */
function DataParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; vy: number; size: number; opacity: number; drift: number };
    const COUNT = 30;

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 200,
      vy: -(0.3 + Math.random() * 0.5),
      size: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.12 + 0.04,
      drift: (Math.random() - 0.5) * 0.15,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy; p.x += p.drift;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,208,0,${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 3 }}
      aria-hidden="true"
    />
  );
}

/* ─── Hero section ─── */
export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };
  const imageVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' as const, delay: 0.5 } },
  };

  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Layers */}
      <ParticleBackground />
      <GraphLines />
      <DataParticles />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-[#0D0D0D]" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-160px)]">

          {/* Left – text */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible"
            className="order-2 lg:order-1 text-center lg:text-left">

            <motion.p variants={itemVariants}
              className="text-[#FFD000] text-sm sm:text-base font-medium tracking-wider uppercase mb-2">
              {portfolioData.hero.greeting}
            </motion.p>

            {/* Shimmering name */}
            <motion.h1 variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-['Poppins'] mb-4">
              <span className="shimmer-text">{portfolioData.hero.name}</span>
            </motion.h1>

            {/* Role with typing cursor */}
            <motion.h2 variants={itemVariants}
              className="text-xl sm:text-2xl lg:text-3xl text-white font-medium mb-6 flex items-center gap-1 justify-center lg:justify-start">
              {portfolioData.hero.role}
              <motion.span
                className="inline-block w-[3px] h-7 bg-[#FFD000] ml-1 rounded"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.49, 0.5, 0.99] }}
              />
            </motion.h2>

            <motion.p variants={itemVariants}
              className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {portfolioData.hero.description}
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.a
                href={portfolioData.hero.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                download="Nitish_Durai_Resume.pdf"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD000] text-black font-semibold rounded-lg magnetic-button"
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(255,208,0,0.55)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Download size={20} />
                Download Resume
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right – profile image */}
          <motion.div variants={imageVariants} initial="hidden" animate="visible"
            className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFD000] rounded-2xl blur-3xl opacity-20 breathing-glow" />
              <motion.div className="relative floating" style={{ perspective: '1000px' }}>
                <motion.div
                  className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] lg:w-[380px] lg:h-[480px] rounded-2xl overflow-hidden border-2 border-[#FFD000]/30 breathing-glow cursor-pointer select-none"
                  onClick={() => window.dispatchEvent(new CustomEvent('activate-kmeans'))}
                  whileTap={{ scale: 0.97 }}
                  title="🔍 Click me..."
                >
                  <img src={portfolioData.hero.profileImage} alt={portfolioData.hero.name}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Subtle click hint — pulsing border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-[#FFD000]/0 pointer-events-none"
                    animate={{ borderColor: ['rgba(255,208,0,0)', 'rgba(255,208,0,0.35)', 'rgba(255,208,0,0)'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  />
                </motion.div>
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 border-2 border-[#FFD000]/50 rounded-lg"
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#FFD000]/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.a href="#skills"
            className="flex flex-col items-center text-gray-500 hover:text-[#FFD000] transition-colors"
            animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={e => { e.preventDefault(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span className="text-xs uppercase tracking-wider mb-2">Scroll Down</span>
            <ArrowDown size={20} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
