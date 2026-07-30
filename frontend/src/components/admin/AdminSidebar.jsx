import { Link, useLocation } from "react-router-dom";
import { HomeIcon, Squares2X2Icon, CodeBracketIcon, BriefcaseIcon, ArrowLeftOnRectangleIcon, UserIcon, PhotoIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MessagesSquare, Code2 } from "lucide-react";
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
    // { name: 'Galerie', href: '/admin/gallery', icon: PhotoIcon },
    { name: 'Paramètres', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const SidebarContent = () => (
    <div className="flex-1 overflow-y-auto scrollbar-thin-custom">
      <nav className="px-4 py-6 space-y-1.5">
        {adminNav.map((item) => {
          const isActive = location.pathname === item.href;
          const isMessages = item.name === 'Messages';

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className="relative flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200"
            >
              {isActive && (
                <motion.span
                  layoutId="admin-active-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/15 to-fuchsia-400/15 border border-cyan-400/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className={`relative z-10 flex items-center ${isActive ? 'text-cyan-300' : 'text-neutral-400 hover:text-white'}`}>
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>

              {isMessages && unreadCount > 0 && (
                <span className="relative z-10 bg-fuchsia-400 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-72 bg-neutral-950 border-r border-white/5 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                <span className="font-display text-white font-semibold text-xl flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-neutral-950" />
                  </span>
                  ManDev
                </span>
                <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <SidebarContent />
              <div className="p-4 border-t border-white/5 shrink-0">
                <button
                  onClick={onLogout}
                  className="flex items-center w-full px-4 py-3 text-rose-400 rounded-xl hover:bg-rose-400/10 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium text-sm">Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white/[0.03] border-r border-white/5">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="font-display text-white font-semibold text-xl flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-neutral-950" />
            </span>
            ManDev
          </span>
        </div>
        <SidebarContent />
        <div className="p-4 border-t border-white/5 shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-rose-400 rounded-xl hover:bg-rose-400/10 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}