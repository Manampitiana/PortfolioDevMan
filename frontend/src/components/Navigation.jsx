import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'
import { useSettings } from '../contexts/SettingsContext'

export default function Navigation() {
  const navigate = useNavigate()
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
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[var(--theme-color)/0.5] shadow-md shadow-gray-400 dark:shadow-[var(--theme-color)] backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all duration-300`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Zone Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-9 h-9 overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 rounded flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">

              {settings?.logo ? (
                <img
                  src={`http://localhost:8000/storage/${settings.logo}`}
                  className="w-full h-full object-contain"
                  alt="Logo du site"
                />
              ) : settings?.favicon ? (
                <img
                  src={`http://localhost:8000/storage/${settings.favicon}`}
                  className="w-full h-full object-contain p-1"
                  alt="Favicon utilisée comme logo"
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

          {/* Navigation Bureau (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => `
                  relative px-4 py-2 text-sm font-medium transition-colors duration-300
                  ${isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <span>{item.name}</span>
                    {/* Indicateur de ligne soulignée */}
                    <span className={`
                      absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 transition-all duration-300
                      ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `} />
                  </>
                )}
              </NavLink>
            ))}

            {/* Séparateur */}
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mr-4"> </div>

            <div className='flex items-center'>
              {/* Bouton de Changement de Thème */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all ms-4"
                title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => navigate('/cv')}
                className="ml-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all active:scale-95"
              >
                Mon CV
              </button>
            </div>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-2 text-gray-500">
              {isDark ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-900 dark:text-white"
            >
              {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Panneau de Navigation Mobile */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}
        `}>
          <div className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  px-4 py-3 rounded-xl text-base font-semibold transition-all
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300'}
                `}
              >
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={() => {
                navigate('/cv');
                setIsOpen(false);
              }}
              className="ml-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all active:scale-95"
            >
              Télécharger mon CV
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}