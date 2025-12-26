import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    stats: { totalProjects: 0, totalViews: 0, totalMessages: 0 },
    recentMessages: []
  });
  const [loading, setLoading] = useState(true);
  const { userToken } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate('/admin/login');
    } else {
      fetchDashboardData();
    }
  }, [userToken]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosClient.get('/dashboard-stats');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { name: 'Total Projects', value: data.stats.totalProjects, icon: DocumentTextIcon, color: 'text-blue-400' },
    { name: 'Total Views', value: data.stats.totalViews, icon: EyeIcon, color: 'text-green-400' },
    { name: 'Messages', value: data.stats.totalMessages, icon: UserGroupIcon, color: 'text-purple-400' },
    { name: 'Status', value: 'Active', icon: ChartBarIcon, color: 'text-yellow-400' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]' />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold dark:text-white text-gray-700 mb-2">Admin Dashboard</h1>
          <p className="dark:text-gray-300 text-gray-600">Welcome back, here is what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Recent Messages Section */}
        <div className="mt-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white text-gray-800">Recent Messages</h2>
            <button
              onClick={() => navigate('/admin/messages')}
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              View All Messages
            </button>
          </div>

          <div className="space-y-4">
            {data.recentMessages.length > 0 ? (
              data.recentMessages.map((msg) => (
                <MessageCard
                  key={msg.id}
                  user={msg.name}
                  time={new Date(msg.created_at).toLocaleDateString()}
                  message={msg.message}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                No recent messages found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components ho an'ny fahadiovan'ny code
function StatsCard({ stat }) {
  const IconComponent = stat.icon;
  return (
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-gray-100 dark:bg-slate-700/50`}>
          <IconComponent className={`w-8 h-8 ${stat.color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
          <p className="text-2xl font-bold dark:text-white text-gray-800">{stat.value}</p>
        </div>
      </div>
    </div>
  );
}

function MessageCard({ user, time, message }) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors border border-transparent dark:border-slate-700/50">
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm">
        {user ? user[0].toUpperCase() : 'U'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="dark:text-white text-gray-800 font-semibold truncate">{user}</h4>
          <span className="text-gray-400 text-xs">{time}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 italic">
          "{message}"
        </p>
      </div>
    </div>
  );
}