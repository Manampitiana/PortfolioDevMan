import { Bars3Icon, MagnifyingGlassIcon, UserIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { Clock, MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../axios';

export default function AdminNavbar({ onMenuClick, currentUser, onLogout, unreadCount, recentMessages }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const notifRef = useRef(null);
    const userMenuRef = useRef(null);

    const [aboutMe, setAboutMe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAboutMe();
    }, []);

    const fetchAboutMe = async () => {
        try {
            const response = await axiosClient.get('/fetch_about_me');
            setAboutMe(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } finally {
            setLoading(false);
        }
    };

    // Ferme les menus déroulants au clic en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropdownMotion = {
        initial: { opacity: 0, y: -8, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.97 },
        transition: { duration: 0.15, ease: "easeOut" },
    };

    return (
        <div className="sticky top-0 z-30 flex h-16 bg-white/[0.03] backdrop-blur-xl border-b border-white/10">
            <button
                onClick={onMenuClick}
                className="text-gray-400 hover:text-white transition-colors lg:hidden"
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center justify-between flex-1 px-3 sm:px-6 gap-2 sm:gap-4">
                {/* Search - desktop */}
                <div className="hidden sm:block flex-1 max-w-md">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Search - mobile (icon that expands) */}
                <div className="sm:hidden flex-1 flex items-center">
                    <AnimatePresence initial={false}>
                        {searchOpen ? (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="relative overflow-hidden"
                            >
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Rechercher..."
                                    onBlur={() => setSearchOpen(false)}
                                    className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                                />
                            </motion.div>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                            </button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Bell Icon with Dynamic Notification */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                        >
                            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-500 border-2 border-neutral-950"></span>
                                </span>
                            )}
                        </button>

                        {/* DROPDOWN MENU */}
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    {...dropdownMotion}
                                    className="absolute right-0 top-14 w-[calc(100vw-1.5rem)] max-w-80 sm:w-80 bg-neutral-900/90 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden z-50"
                                >
                                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                        <h3 className="font-bold text-white text-sm">Messages récents</h3>
                                        <span className="text-[10px] bg-cyan-400/10 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                                            {unreadCount} non lus
                                        </span>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}>
                                        {recentMessages.length > 0 ? (
                                            recentMessages.map((msg) => (
                                                <Link
                                                    key={msg.id}
                                                    to="/admin/messages"
                                                    onClick={() => setNotifOpen(false)}
                                                    className={`block p-4 border-b border-white/5 hover:bg-white/[0.04] transition-colors ${!msg.is_read ? 'bg-cyan-400/[0.06]' : ''}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <span className="font-semibold text-sm text-white truncate">{msg.name}</span>
                                                        <span className="text-[10px] text-gray-500 flex items-center flex-shrink-0">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-cyan-300 font-medium mb-1 truncate">{msg.subject}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-2 italic">"{msg.message}"</p>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-gray-500 text-sm italic">
                                                Aucun nouveau message.
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        to="/admin/messages"
                                        onClick={() => setNotifOpen(false)}
                                        className="block p-3 text-center text-xs font-bold text-cyan-300 hover:bg-white/[0.04] transition-colors border-t border-white/10"
                                    >
                                        Voir tous les messages
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 sm:gap-3 hover:bg-white/[0.06] rounded-lg p-1.5 sm:p-2 transition-colors"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-white leading-tight">{currentUser.name}</p>
                                <p className="text-xs text-gray-500">{currentUser.role}</p>
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-fuchsia-500/10 overflow-hidden flex-shrink-0">
                                {aboutMe?.pdp ? (
                                    <img
                                        src={aboutMe.pdp}
                                        alt="Profil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{currentUser?.name ? currentUser.name[0].toUpperCase() : '?'}</span>
                                )}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    {...dropdownMotion}
                                    className="absolute right-0 mt-2 w-56 bg-neutral-900/90 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/40 border border-white/10 py-2 z-50"
                                >
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                    </div>
                                    <Link
                                        to="/admin/about_me"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-cyan-300 transition-colors"
                                    >
                                        <UserIcon className="h-4 w-4 mr-3" />
                                        Mon profil
                                    </Link>
                                    <Link
                                        to="/admin/settings"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-cyan-300 transition-colors"
                                    >
                                        <Cog6ToothIcon className="h-4 w-4 mr-3" />
                                        Paramètres
                                    </Link>
                                    <hr className="my-2 border-white/10" />
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            onLogout();
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                    >
                                        <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-3" />
                                        Déconnexion
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}