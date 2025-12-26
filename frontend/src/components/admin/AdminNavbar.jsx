import { Bars3Icon, BellIcon, MagnifyingGlassIcon, UserIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { Clock, MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../axios';

export default function AdminNavbar({ onMenuClick, currentUser, onLogout, unreadCount, recentMessages }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [notifOpen, setNotifOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // Mikatona ny dropdown raha mikitika ny ivelany ny Admin
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className="sticky top-0 z-10 flex h-16 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
            <button
                onClick={onMenuClick}
                className="px-4 text-gray-500 hover:text-gray-700 lg:hidden"
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center justify-between flex-1 px-4 lg:px-6">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2 border dark:bg-gray-900 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 ml-4">
                    {/* Bell Icon with Dynamic Notification */}
                    <button
                        onClick={() => setNotifOpen(!notifOpen)} // <--- Ampio ity line ity
                        className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                        <MessageSquare className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-gray-900"></span>
                            </span>
                        )}
                    </button>

                    {/* DROPDOWN MENU */}
                    {notifOpen && (
                        <div className="absolute right-6 top-16 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="font-bold text-gray-800 dark:text-white text-sm">Hafatra vaovao</h3>
                                <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full font-bold">
                                    {unreadCount} tsy voavaky
                                </span>
                            </div>

                            <div className="max-h-96 overflow-y-auto scrollbar-thin-custom">
                                {recentMessages.length > 0 ? (
                                    recentMessages.map((msg) => (
                                        <Link
                                            key={msg.id}
                                            to="/admin/messages"
                                            onClick={() => setNotifOpen(false)}
                                            className={`block p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!msg.is_read ? 'bg-cyan-400/10' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-sm text-gray-900 dark:text-white">{msg.name}</span>
                                                <span className="text-[10px] text-gray-400 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-1 truncate">{msg.subject}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">"{msg.message}"</p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm italic">
                                        Tsy misy hafatra vaovao.
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/admin/messages"
                                onClick={() => setNotifOpen(false)}
                                className="block p-3 text-center text-xs font-bold text-cyan-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
                            >
                                Jereo ny hafatra rehetra
                            </Link>
                        </div>
                    )}

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-950 rounded-lg p-2 transition-colors"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                                {aboutMe?.pdp ? (
                                    <img
                                        src={aboutMe.pdp}
                                        alt="Profile"
                                        className="w-10 h-10 object-cover"
                                    />
                                ) : (
                                    <span>{currentUser?.name ? currentUser.name[0].toUpperCase() : '?'}</span>
                                )}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                                </div>
                                <Link
                                    to="/admin/about_me"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-600"
                                >
                                    <UserIcon className="h-4 w-4 mr-3" />
                                    Mon Profil
                                </Link>
                                <Link
                                    to="/admin/settings"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-600"
                                >
                                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                                    Paramètres
                                </Link>
                                <hr className="my-2" />
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onLogout();
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 "
                                >
                                    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-3" />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
