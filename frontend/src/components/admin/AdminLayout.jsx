import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from "../../contexts/ContextProvider";
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import axiosClient from '../../axios';

export default function AdminLayout() {
  const { currentUser, userToken, setUserToken, setCurrentUser } = useStateContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState({ name: 'Admin', role: 'Super Admin' });

  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    // Maka ny data rehetra rehefa misokatra ny dashboard
    axiosClient.get('/dashboard-stats').then(({ data }) => {
      setUnreadCount(data.unreadCount);
      setRecentMessages(data.recentMessages); // Ampio ity
    }).catch(err => console.error(err));
  }, []);

  if (!userToken) {
    return <Navigate to="/admin/login" />;
  }

  // Check if user is admin
  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const onLogout = async () => {
    setUserToken(null);
    setCurrentUser({});
    return <Navigate to="/admin/login" />;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadCount={unreadCount}
        onLogout={onLogout}
      />

      <div className="lg:pl-72 flex flex-col flex-1">
        <AdminNavbar
          onMenuClick={() => setSidebarOpen(true)}
          currentUser={user}
          unreadCount={unreadCount}
          recentMessages={recentMessages} // Eto ilay izy
          onLogout={onLogout}
        />
        <main className="flex-1">
          <Outlet context={{ setUnreadCount }} />
        </main>
      </div>
    </div>
  );
}
