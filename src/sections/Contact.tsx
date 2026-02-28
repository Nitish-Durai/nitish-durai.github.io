import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { portfolioData } from '@/data';

const socialIcons: Record<string, React.ReactNode> = {
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />
};

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const maxDistance = 80;
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      setPosition({
        x: distanceX * strength * 0.3,
        y: distanceY * strength * 0.3
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}

function FormField({ field, index }: { field: typeof portfolioData.contact.formFields[0]; index: number }) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const inputClasses = `
    w-full px-4 py-4 bg-[#111] border rounded-lg text-white placeholder-gray-500
    transition-all duration-300 outline-none
    ${isFocused 
      ? 'border-[#FFD000] shadow-[0_0_15px_rgba(255,208,0,0.2)]' 
      : 'border-gray-800 hover:border-gray-700'
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.3 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {field.label}
      </label>
      
      {field.type === 'textarea' ? (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={5}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
        />
      )}
      
      {/* Floating Label Animation */}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-[#FFD000]"
        initial={{ width: 0 }}
        animate={{ width: isFocused ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! I will get back to you soon.');
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-20 lg:py-32 bg-[#0D0D0D] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #FFD000 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[#FFD000] text-sm font-medium tracking-wider uppercase"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Poppins'] mt-2 mb-4"
          >
            {portfolioData.contact.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {portfolioData.contact.description}
          </motion.p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {portfolioData.contact.formFields.slice(0, 2).map((field, index) => (
              <FormField key={field.label} field={field} index={index} />
            ))}
          </div>
          
          <FormField 
            field={portfolioData.contact.formFields[2]} 
            index={2} 
          />

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex justify-center pt-4"
          >
            <MagneticButton
              className={`
                inline-flex items-center gap-2 px-10 py-4 bg-[#FFD000] text-black font-semibold rounded-lg
                hover:shadow-[0_0_30px_rgba(255,208,0,0.4)] transition-shadow duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Send size={20} />
                  {portfolioData.contact.submitButtonText}
                </>
              )}
            </MagneticButton>
          </motion.div>
        </motion.form>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 flex justify-center gap-4"
        >
          {portfolioData.contact.socialLinks.map((social, index) => (
            <motion.a
              key={social.platform}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#111] border border-gray-800 rounded-xl text-gray-400 hover:text-[#FFD000] hover:border-[#FFD000]/50 hover:shadow-[0_0_20px_rgba(255,208,0,0.15)] transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                y: -4
              }}
              whileTap={{ scale: 0.95 }}
              aria-label={social.platform}
            >
              {socialIcons[social.icon]}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
