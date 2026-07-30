import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useSettings } from '../contexts/SettingsContext'

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { settings, loading } = useSettings();

  // Noms des menus en français
  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/about' },
    { name: 'Projets', href: '/projects' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 sm:px-4">
        <div className="flex items-center justify-between h-16">

          {/* Zone Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-9 h-9 overflow-hidden bg-gradient-to-tr from-cyan-400 to-fuchsia-400 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-cyan-400/20 group-hover:rotate-6 transition-transform">
              {settings?.logo ? (
                <img src={settings.logo} className="w-full h-full object-contain" alt="Logo du site" />
              ) : settings?.favicon ? (
                <img src={settings.favicon} className="w-full h-full object-contain p-1" alt="Favicon utilisée comme logo" />
              ) : (
                <img src="/logo.png" className="w-full h-full object-contain p-1" alt="Logo par défaut" />
              )}
            </div>
            <span className="text-white font-display font-semibold text-xl tracking-tight">
              {settings?.site_name || 'Mon Portfolio'}
            </span>
          </Link>

          {/* Navigation Bureau (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 text-sm font-medium"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-cyan-300' : 'text-neutral-400 hover:text-white'}`}>
                    {item.name}
                  </span>
                </NavLink>
              );
            })}

            {/* Séparateur */}
            <div className="h-6 w-px bg-white/10 mx-3" />

            <div className="flex items-center gap-3">
              {/* Bouton de Changement de Thème */}
              {/* <button
                onClick={toggleTheme}
                className="p-2 text-neutral-400 hover:text-cyan-300 hover:bg-white/5 rounded-full transition-all"
                title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button> */}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cv')}
                className="bg-white text-neutral-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors"
              >
                Mon CV
              </motion.button>
            </div>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden flex items-center gap-2">
            {/* <button onClick={toggleTheme} className="p-2 text-neutral-400">
              {isDark ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button> */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white"
              aria-label="Menu"
            >
              {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Panneau de Navigation Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 pb-6 pt-2">
                {navigation.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <NavLink
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        block px-4 py-3 rounded-xl text-base font-medium transition-all
                        ${isActive
                          ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-300'
                          : 'text-neutral-300 hover:bg-white/5'}
                      `}
                    >
                      {item.name}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + navigation.length * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    navigate('/cv');
                    setIsOpen(false);
                  }}
                  className="mt-2 bg-white text-neutral-900 px-5 py-3 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Télécharger mon CV
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}