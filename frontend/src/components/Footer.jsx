import { Link } from 'react-router-dom'
import { HeartIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import { MapPinIcon, Phone, Github, Linkedin, Facebook, Youtube } from 'lucide-react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../contexts/SettingsContext';

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
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100070143253960', icon: <Facebook className='w-5 h-5' /> },
    { name: 'GitHub', href: 'https://github.com/Manampitiana', icon: <Github className='w-5 h-5' /> },
    { name: 'YouTube', href: 'https://www.youtube.com/@ManampitianaTSIRINIAINA', icon: <Youtube className='w-5 h-5' /> },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-[var(--theme-color)] border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* 1. Logo & Description */}
          <div className="md:col-span-5">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center group">
                <div className="w-9 h-9 overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 rounded flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                  {settings?.logo ? (
                    <img
                      src={`https://portfolio-backend-58gy.onrender.com/storage/${settings.logo}`}
                      className="w-full h-full object-contain"
                      alt="Logo"
                    />
                  ) : settings?.favicon ? (
                    <img
                      src={`https://portfolio-backend-58gy.onrender.com/storage/${settings.favicon}`}
                      className="w-full h-full object-contain p-1"
                      alt="Favicon"
                    />
                  ) : (
                    <img
                      src="/logo.png"
                      className="w-full h-full object-contain p-1"
                      alt="Logo par défaut"
                    />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white font-bold text-xl tracking-tight">
                  {settings?.site_name || 'Mon Portfolio'}
                </span>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-sm">
              {aboutMe?.short_bio || "Développeur Full Stack passionné par les technologies modernes et la création de solutions innovantes."}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  className="w-10 h-10 bg-white dark:bg-[var(--theme-color)] border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-[var(--theme-color)] dark:text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-600 transition-all duration-300"
                  title={social.name}
                >
                  <span>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 2. Liens Rapides */}
          <div className="md:col-span-3">
            <h3 className="text-[var(--theme-color)] dark:text-white font-semibold text-lg mb-6">Liens Rapides</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-blue-400 mr-0 group-hover:mr-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Section Contact */}
          <div className="md:col-span-4">
            <h3 className="text-[var(--theme-color)] dark:text-white font-semibold text-lg mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            
            <div className="space-y-5">
              {/* Localisation */}
              <div className="flex items-start group">
                <div className="p-2.5 bg-white dark:bg-[var(--theme-color)] rounded-lg mr-4 group-hover:bg-blue-500/20 border dark:border-gray-600 transition-colors">
                  <MapPinIcon className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200 group-hover:text-gray-600 transition-colors text-sm pt-1 leading-snug">
                  {aboutMe?.location || "Antananarivo, Madagascar"}
                </p>
              </div>

              {/* Email */}
              <a href={`mailto:${aboutMe?.email}`} className="flex items-start group">
                <div className="p-2.5 bg-white dark:bg-[var(--theme-color)] rounded-lg mr-4 group-hover:bg-blue-500/20 border dark:border-gray-600 transition-colors">
                  <EnvelopeIcon className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200 group-hover:text-gray-600 transition-colors text-sm pt-1 break-all">
                  {aboutMe?.email || "contact@exemple.com"}
                </p>
              </a>

              {/* Téléphone */}
              <a href={`tel:${aboutMe?.phone}`} className="flex items-start group">
                <div className="p-2.5 bg-white dark:bg-[var(--theme-color)] rounded-lg mr-4 group-hover:bg-blue-500/20 border dark:border-gray-600 transition-colors">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200 group-hover:text-gray-600 transition-colors text-sm pt-1">
                  {aboutMe?.phone || "+261 -- --- --"}
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Section Bas de page */}
        <div className="border-t border-slate-800/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} <span className="text-gray-600 dark:text-gray-400 font-medium">{settings?.site_name || 'Portfolio'}</span>. Tous droits réservés.
          </p>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="flex items-center">
              Fait avec <HeartIcon className="w-4 h-4 text-red-500 mx-1.5 animate-pulse" /> à Madagascar
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}