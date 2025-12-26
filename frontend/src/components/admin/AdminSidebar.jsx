import { Link, useLocation } from "react-router-dom";
import { HomeIcon, Squares2X2Icon, CodeBracketIcon, BriefcaseIcon, ArrowLeftOnRectangleIcon, UserIcon, PhotoIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MessagesSquare } from "lucide-react";

export default function AdminSidebar({ isOpen, onClose, onLogout, unreadCount }) {
  const location = useLocation();

  const adminNav = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Projects', href: '/admin/projects', icon: Squares2X2Icon },
    { name: 'Skills', href: '/admin/skills', icon: CodeBracketIcon },
    { name: 'Experiences', href: '/admin/experiences', icon: BriefcaseIcon },
    { name: 'Messages', href: '/admin/messages', icon: MessagesSquare },
    { name: 'About Me', href: '/admin/about_me', icon: UserIcon },
    { name: 'Gallery', href: '/admin/gallery', icon: PhotoIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const SidebarContent = () => (
    <div className="flex-1 overflow-y-auto" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: '#4B5563 #1F2937'
    }}>
      <nav className="px-4 py-6 space-y-2">
        {adminNav.map((item) => {
          const isActive = location.pathname === item.href;
          const isMessages = item.name === 'Messages';

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </div>

              {/* Badge kely eo ankavanana */}
              {isMessages && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-gray-800">
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
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-72 bg-gray-900 flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700">
              <span className="text-white font-bold text-xl">ManDev</span>
              <button onClick={onClose} className="text-gray-400"><XMarkIcon className="h-6 w-6" /></button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-gray-900 border-r border-gray-800">
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <span className="text-white font-bold text-xl">ManDev</span>
        </div>
        <SidebarContent />
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={() => {
              onLogout();
            }}
            className="flex items-center w-full px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}