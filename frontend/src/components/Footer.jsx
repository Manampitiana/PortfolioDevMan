import { Link } from 'react-router-dom'
import { HeartIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import { motion } from 'framer-motion';
import { MapPinIcon, Phone, Github, Linkedin, Facebook, Youtube, LinkedinIcon } from 'lucide-react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../contexts/SettingsContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [aboutMe, setAboutMe] = useState(null);
  const { settings, loading } = useSettings();

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      const response = await axiosClient.get('/fetch_about_me');
      setAboutMe(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations :', error);
    }
  };

  const quickLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/about' },
    { name: 'Projets', href: '/projects' },
    { name: 'Contact', href: '/contact' }
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100070143253960', icon: <Facebook className='w-4 h-4' /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/manampitiana-ravaka-tsiriniaina-5613b1317', icon: <LinkedinIcon className='w-4 h-4' /> },
    { name: 'GitHub', href: 'https://github.com/Manampitiana', icon: <Github className='w-4 h-4' /> },
    { name: 'YouTube', href: 'https://www.youtube.com/@ManampitianaTSIRINIAINA', icon: <Youtube className='w-4 h-4' /> },
  ]

  const contactRows = [
    { icon: MapPinIcon, value: aboutMe?.location || "Antananarivo, Madagascar" },
    { icon: EnvelopeIcon, value: aboutMe?.email || "contact@exemple.com", href: `mailto:${aboutMe?.email}` },
    { icon: Phone, value: aboutMe?.phone || "+261 -- --- --", href: `tel:${aboutMe?.phone}` },
  ];

  return (
    <footer className="relative bg-neutral-950 border-t border-white/5 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/[0.05] rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-12 gap-12"
        >

          {/* 1. Logo & Description */}
          <div className="md:col-span-5">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center group">
                <div className="w-9 h-9 overflow-hidden bg-gradient-to-tr from-cyan-400 to-fuchsia-400 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/20 group-hover:rotate-6 transition-transform">
                  {settings?.logo ? (
                    <img src={settings.logo} className="w-full h-full object-contain" alt="Logo" />
                  ) : settings?.favicon ? (
                    <img src={settings.favicon} className="w-full h-full object-contain p-1" alt="Favicon" />
                  ) : (
                    <img src="/logo.png" className="w-full h-full object-contain p-1" alt="Logo par défaut" />
                  )}
                </div>
                <span className="font-display text-white font-semibold text-xl tracking-tight">
                  {settings?.site_name || 'Mon Portfolio'}
                </span>
              </Link>
            </div>
            <p className="text-neutral-400 mb-8 leading-relaxed max-w-sm text-sm">
              {aboutMe?.short_bio || "Développeur Full Stack passionné par les technologies modernes et la création de solutions innovantes."}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-cyan-200 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all duration-300"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Liens Rapides */}
          <div className="md:col-span-3">
            <h3 className="font-display text-white font-semibold text-base mb-6">Liens Rapides</h3>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-cyan-300 transition-colors duration-300 flex items-center group text-sm"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Section Contact */}
          <div className="md:col-span-4">
            <h3 className="font-display text-white font-semibold text-base mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full" />
            </h3>

            <div className="space-y-4">
              {contactRows.map((row, i) => {
                const Icon = row.icon;
                const Wrapper = row.href ? 'a' : 'div';
                return (
                  <Wrapper
                    key={i}
                    {...(row.href ? { href: row.href } : {})}
                    className="flex items-start gap-3.5 group"
                  >
                    <div className="p-2.5 bg-white/[0.03] border border-white/10 rounded-lg group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 transition-colors shrink-0">
                      <Icon className="w-4 h-4 text-cyan-300" />
                    </div>
                    <p className="text-neutral-400 group-hover:text-neutral-200 transition-colors text-sm pt-1.5 leading-snug break-all">
                      {row.value}
                    </p>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Section Bas de page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-neutral-500 text-sm text-center md:text-left">
            © {currentYear} <span className="text-neutral-300 font-medium">{settings?.site_name || 'Portfolio'}</span>. Tous droits réservés.
          </p>
          <div className="flex items-center text-neutral-500 text-sm">
            <span className="flex items-center">
              Fait avec <HeartIcon className="w-4 h-4 text-fuchsia-400 mx-1.5 animate-pulse" /> à Madagascar
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}