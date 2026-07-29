import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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
      console.error('Erreur lors de la récupération des données du tableau de bord :', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { name: 'Projets Totaux', value: data.stats.totalProjects, icon: DocumentTextIcon, tint: 'bg-cyan-400/10 border-cyan-400/20 text-cyan-300' },
    { name: 'Vues Totales', value: data.stats.totalViews, icon: EyeIcon, tint: 'bg-fuchsia-400/10 border-fuchsia-400/20 text-fuchsia-300' },
    { name: 'Messages', value: data.stats.totalMessages, icon: UserGroupIcon, tint: 'bg-violet-400/10 border-violet-400/20 text-violet-300' },
    { name: 'Statut', value: 'Actif', icon: ChartBarIcon, tint: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-neutral-950">
        <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">Tableau de Bord</h1>
          <p className="text-neutral-400">Bon retour parmi nous, voici un aperçu de votre activité.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <StatsCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Recent Messages Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-white">Messages Récents</h2>
            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => navigate('/admin/messages')}
              className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors self-start sm:self-auto"
            >
              Voir tous les messages →
            </motion.button>
          </div>

          <div className="space-y-3">
            {data.recentMessages.length > 0 ? (
              data.recentMessages.map((msg, i) => (
                <MessageCard
                  key={msg.id}
                  index={i}
                  user={msg.name}
                  time={new Date(msg.created_at).toLocaleDateString('fr-FR')}
                  message={msg.message}
                />
              ))
            ) : (
              <div className="text-center py-10 text-neutral-500 text-sm">
                Aucun message récent trouvé.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Sous-composants pour la lisibilité du code
function StatsCard({ stat, index }) {
  const IconComponent = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-5 sm:p-6 rounded-2xl hover:border-cyan-400/25 transition-colors duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${stat.tint} shrink-0`}>
          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-neutral-500 truncate">{stat.name}</p>
          <p className="font-display text-xl sm:text-2xl font-semibold text-white">{stat.value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MessageCard({ user, time, message, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors duration-300"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-fuchsia-400 rounded-full flex-shrink-0 flex items-center justify-center text-neutral-950 font-semibold shadow-sm">
        {user ? user[0].toUpperCase() : 'U'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-white font-medium truncate text-sm">{user}</h4>
          <span className="text-neutral-500 text-xs shrink-0">{time}</span>
        </div>
        <p className="text-neutral-400 text-sm line-clamp-2 italic">
          « {message} »
        </p>
      </div>
    </motion.div>
  );
}