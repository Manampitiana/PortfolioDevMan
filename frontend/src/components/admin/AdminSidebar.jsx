import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  Squares2X2Icon,
  CodeBracketIcon,
  BriefcaseIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
  PhotoIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MessagesSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSidebar({ isOpen, onClose, onLogout, unreadCount }) {
  const location = useLocation();

  const adminNav = [
    { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
    { name: 'Projets', href: '/admin/projects', icon: Squares2X2Icon },
    { name: 'Compétences', href: '/admin/skills', icon: CodeBracketIcon },
    { name: 'Expériences', href: '/admin/experiences', icon: BriefcaseIcon },
    { name: 'Messages', href: '/admin/messages', icon: MessagesSquare },
    { name: 'À propos', href: '/admin/about_me', icon: UserIcon },
    { name: 'Galerie', href: '/admin/gallery', icon: PhotoIcon },
    { name: 'Paramètres', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  // "layoutId" mitovy eo amin'ny desktop sy mobile mba tsy hifanipaka ny animation
  const NavLinks = ({ layoutPrefix, onItemClick }) => (
    <nav className="px-4 py-6 space-y-1.5">
      {adminNav.map((item) => {
        const isActive = location.pathname === item.href;
        const isMessages = item.name === 'Messages';

        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
            className="relative flex items-center justify-between px-4 py-3 rounded-xl group"
          >
            {isActive && (
              <motion.div
                layoutId={`${layoutPrefix}-active-pill`}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/80 to-fuchsia-500/80 shadow-lg shadow-fuchsia-500/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}

            <div className="relative z-10 flex items-center">
              <item.icon
                className={`h-5 w-5 mr-3 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
              />
              <span
                className={`font-medium text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}
              >
                {item.name}
              </span>
            </div>

            {isMessages && unreadCount > 0 && (
              <span className="relative z-10 bg-fuchsia-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-black/20">
                {unreadCount}
              </span>
            )}

            {!isActive && (
              <div className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 w-72 bg-white/[0.04] backdrop-blur-2xl border-r border-white/10 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0">
                <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-bold text-xl">
                  ManDev
                </span>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div
                className="flex-1 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}
              >
                <NavLinks layoutPrefix="mobile" onItemClick={onClose} />
              </div>

              <div className="p-4 border-t border-white/10 flex-shrink-0">
                <button
                  onClick={onLogout}
                  className="flex items-center w-full px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium text-sm">Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white/[0.03] border-r border-white/10 backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-white/10 flex-shrink-0">
          <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-bold text-xl">
            ManDev
          </span>
        </div>

        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}
        >
          <NavLinks layoutPrefix="desktop" />
        </div>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}