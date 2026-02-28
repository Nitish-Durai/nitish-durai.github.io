import { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/sections/Hero';
import Skills from '@/sections/Skills';
import Projects from '@/sections/Projects';
import Contact from '@/sections/Contact';
import StartupScreen from '@/components/effects/StartupScreen';
import KonamiOverlay from '@/components/effects/KonamiOverlay';
import DataRainOverlay, { useDataRain } from '@/components/effects/DataRainOverlay';
import { useKonamiCode } from '@/hooks/useKonamiCode';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    return scrollYProgress.on('change', latest => setIsVisible(latest > 0.4));
  }, [scrollYProgress]);

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8, pointerEvents: isVisible ? 'auto' : 'none' }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#FFD000] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,208,0,0.3)] hover:shadow-[0_0_30px_rgba(255,208,0,0.5)] transition-shadow"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-black">
        <path d="m18 15-6-6-6 6" />
      </svg>
    </motion.button>
  );
}

function App() {
  const [booted, setBooted] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [dataRainActive, setDataRainActive] = useState(false);

  const handleBoot = useCallback(() => setBooted(true), []);
  const activateKonami = useCallback(() => setKonamiActive(true), []);
  const closeKonami = useCallback(() => setKonamiActive(false), []);
  const activateDataRain = useCallback(() => setDataRainActive(true), []);
  const closeDataRain = useCallback(() => setDataRainActive(false), []);

  // Easter egg listeners
  useKonamiCode(activateKonami);
  useDataRain(activateDataRain);

  // Profile pic click → K-Means
  useEffect(() => {
    const handler = () => activateKonami();
    window.addEventListener('activate-kmeans', handler);
    return () => window.removeEventListener('activate-kmeans', handler);
  }, [activateKonami]);

  return (
    <>
      {/* ─── Boot sequence ─── */}
      <AnimatePresence>
        {!booted && <StartupScreen key="startup" onComplete={handleBoot} />}
      </AnimatePresence>

      {/* ─── Konami K-Means overlay ─── */}
      <KonamiOverlay active={konamiActive} onClose={closeKonami} />

      {/* ─── Data Rain overlay ─── */}
      <DataRainOverlay active={dataRainActive} onClose={closeDataRain} />

      {/* ─── Main app ─── */}
      <AnimatePresence>
        {booted && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-black"
          >
            <ScrollProgress />
            <Navbar />
            <main>
              <Hero />
              <Skills />
              <Projects />
              <Contact />
            </main>
            <Footer />
            <ScrollToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
