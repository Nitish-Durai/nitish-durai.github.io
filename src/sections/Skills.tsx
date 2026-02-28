import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { portfolioData } from '@/data';
import { Code2, BarChart2, Wrench } from 'lucide-react';

/* Category icon mapping */
const categoryIcons: Record<string, React.ReactNode> = {
  'Languages & Databases': <Code2 className="w-6 h-6" />,
  'Data & Machine Learning': <BarChart2 className="w-6 h-6" />,
  'Tools & Platforms': <Wrench className="w-6 h-6" />,
};

/* Skill name → special effect type */
const ML_SKILLS = new Set(['scikit-learn', 'Pandas', 'NumPy', 'Matplotlib']);

/* Animated decision-boundary bg on hover for ML skills */
function DecisionBoundaryBg() {
  return (
    <motion.div
      className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Animated wavy decision boundary lines */}
        {[20, 40, 60, 80].map((y, i) => (
          <motion.path
            key={i}
            d={`M 0 ${y} Q 25 ${y - 10 + i * 5} 50 ${y + 8 - i * 3} T 100 ${y}`}
            fill="none"
            stroke="#FFD000"
            strokeWidth="0.5"
            strokeOpacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          />
        ))}
        {/* Scatter dots */}
        {Array.from({ length: 18 }, (_, i) => (
          <motion.circle
            key={i}
            cx={5 + (i % 7) * 14}
            cy={10 + Math.floor(i / 7) * 35}
            r="1.5"
            fill={i % 2 === 0 ? '#FFD000' : '#4ECDC4'}
            fillOpacity="0.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

/* Single skill chip */
function SkillChip({ skill, index }: { skill: { name: string; level: number }; index: number }) {
  const isML = ML_SKILLS.has(skill.name);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.08, y: -3 }}
      className="relative inline-flex items-center px-4 py-2 rounded-full border border-[#FFD000]/30 
                 bg-[#0D0D0D] text-sm font-medium text-gray-200 cursor-default overflow-hidden
                 hover:border-[#FFD000] hover:text-[#FFD000] transition-colors duration-200"
    >
      {/* Decision boundary easter egg for ML skills */}
      {isML && hovered && <DecisionBoundaryBg />}

      {/* Glow pulse for ML skills on hover */}
      {isML && hovered && (
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: ['0 0 0px #FFD000', '0 0 18px #FFD000', '0 0 6px #FFD000'] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'loop' }}
        />
      )}

      <span className="relative z-10">{skill.name}</span>

      {/* Small yellow dot accent */}
      <span className={`relative z-10 ml-2 w-1.5 h-1.5 rounded-full ${isML ? 'bg-[#FFD000]' : 'bg-[#FFD000]/40'}`} />
    </motion.div>
  );
}

/* Skill category card */
function SkillCard({ category, index }: { category: typeof portfolioData.skills.categories[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.18, duration: 0.55, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-[#111] rounded-xl p-6 border border-[#FFD000]/20 hover:border-[#FFD000]/50 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-[#FFD000]/10 rounded-lg text-[#FFD000]">
          {categoryIcons[category.category] ?? <Code2 className="w-6 h-6" />}
        </div>
        <h3 className="text-xl font-semibold text-white font-['Poppins']">{category.category}</h3>
      </div>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, si) => (
          <SkillChip key={skill.name} skill={skill} index={si} />
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────── Build Terminal Easter Egg ─────────── */
const BUILD_LINES = [
  { text: '$ pip install skillcraft-internship', color: '#FFD000' },
  { text: 'Collecting pandas, numpy, sklearn...', color: '#aaaaaa' },
  { text: '  ████████████████ 100%', color: '#4ade80' },
  { text: 'Installing opencv-python...', color: '#aaaaaa' },
  { text: '  ████████████████ 100%', color: '#4ade80' },
  { text: 'Building K-Means model... ✓', color: '#FFD000' },
  { text: 'Building SVM classifier... ✓', color: '#FFD000' },
  { text: 'Deploying gesture recognition... ✓', color: '#FFD000' },
  { text: 'BUILD SUCCESSFUL in 3m 16s ✅', color: '#4ade80' },
];

function BuildTerminal({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  // Single ref tracks the ONE pending timeout at any time → fully cleaned up
  const tidRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    finishedRef.current = false;
    let step = 0;

    const addLine = () => {
      step += 1;
      setCount(step);
      if (step < BUILD_LINES.length) {
        tidRef.current = setTimeout(addLine, 270 + Math.random() * 110);
      } else {
        // All lines shown — wait then signal done
        tidRef.current = setTimeout(() => {
          if (!finishedRef.current) {
            finishedRef.current = true;
            onDone();
          }
        }, 1500);
      }
    };

    tidRef.current = setTimeout(addLine, 80);

    return () => {
      // Cancel whatever timeout is pending right now
      if (tidRef.current !== null) clearTimeout(tidRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally run once on mount

  const visibleLines = BUILD_LINES.slice(0, count);
  const done = count >= BUILD_LINES.length;

  return (
    <div className="absolute inset-0 rounded-xl bg-[#0a0a0a] flex flex-col overflow-hidden" style={{ zIndex: 10 }}>
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] border-b border-[#FFD000]/10 shrink-0">
        <span className="w-2 h-2 rounded-full bg-red-500/80" />
        <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
        <span className="w-2 h-2 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[9px] text-gray-500 font-mono">build.sh — internship</span>
      </div>

      {/* Log lines */}
      <div className="flex-1 p-3 overflow-hidden flex flex-col justify-end gap-0.5">
        {visibleLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.13 }}
            className="font-mono text-[9px] leading-tight truncate"
            style={{ color: line.color }}
          >
            {line.text}
          </motion.div>
        ))}
        {/* Blinking cursor — hidden once done */}
        {!done && (
          <span className="inline-block w-1 h-3 bg-[#FFD000] align-middle boot-cursor" />
        )}
      </div>
    </div>
  );
}

function InternshipStatCard({
  stat, index, inView
}: { stat: { value: string; label: string }; index: number; inView: boolean }) {
  const [running, setRunning] = useState(false);

  const start = () => { if (!running) setRunning(true); };

  // Called by BuildTerminal when animation finishes
  const handleDone = useCallback(() => {
    setRunning(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
      whileHover={!running ? { scale: 1.06 } : {}}
      onClick={start}
      className="relative text-center p-6 bg-[#111] rounded-xl border border-[#FFD000]/10 hover:border-[#FFD000]/40 transition-colors cursor-pointer overflow-hidden select-none min-h-[110px]"
      title="Click to run the build 👷"
    >
      {/* Normal content — always in DOM, just fades opacity */}
      <div
        className="transition-opacity duration-200"
        style={{ opacity: running ? 0 : 1, pointerEvents: running ? 'none' : 'auto' }}
      >
        <div className="text-3xl sm:text-4xl font-bold text-[#FFD000] font-['Poppins'] mb-2">{stat.value}</div>
        <div className="text-sm text-gray-400">{stat.label}</div>
        <div className="text-[9px] text-[#FFD000]/25 font-mono mt-2">click to build →</div>
      </div>

      {/* Terminal overlay — CSS transition only, no AnimatePresence */}
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{ opacity: running ? 1 : 0, pointerEvents: running ? 'auto' : 'none' }}
      >
        {/* Only mount BuildTerminal when running to reset its state cleanly */}
        {running && <BuildTerminal onDone={handleDone} />}
      </div>
    </motion.div>
  );
}


export default function Skills() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="relative py-20 lg:py-32 bg-[#0D0D0D] overflow-hidden">
      {/* Dot grid bg */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #FFD000 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Faint horizontal moving graph lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.04 }}>
        {[15, 35, 55, 75, 90].map((t, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-[#FFD000]"
            style={{ top: `${t}%` }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 14 + i * 3, repeat: Infinity, ease: 'linear', delay: i * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div ref={sectionRef} className="text-center mb-14">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }} className="text-[#FFD000] text-sm font-medium tracking-wider uppercase">
            My Expertise
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Poppins'] mt-2 mb-4">
            {portfolioData.skills.title}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }} className="text-gray-400 text-lg max-w-2xl mx-auto">
            {portfolioData.skills.description}
          </motion.p>

        </motion.div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {portfolioData.skills.categories.map((cat, i) => (
            <SkillCard key={cat.category} category={cat} index={i} />
          ))}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {portfolioData.about.stats.map((stat, i) =>
            stat.label === 'Internships'
              ? <InternshipStatCard key={stat.label} stat={stat} index={i} inView={inView} />
              : (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.06 }}
                  className="text-center p-6 bg-[#111] rounded-xl border border-[#FFD000]/10 hover:border-[#FFD000]/30 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-[#FFD000] font-['Poppins'] mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              )
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
