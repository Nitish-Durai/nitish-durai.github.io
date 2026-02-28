import { motion } from 'framer-motion';
import { portfolioData } from '@/data';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-8 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Logo */}
          <motion.a
            href="#"
            className="text-lg font-bold font-['Poppins']"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-white">Nitish</span>
            <span className="text-[#FFD000]">.</span>
          </motion.a>

          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center">
            © {currentYear} {portfolioData.name} | All Rights Reserved
          </p>

          {/* Made With */}
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-500"
            whileHover={{ color: '#FFD000' }}
          >
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-[#FFD000] fill-[#FFD000]" />
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
