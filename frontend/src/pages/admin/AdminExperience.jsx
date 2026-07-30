import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function AdminExperience() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/experiences');
      setExperiences(response.data.experiences || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des expériences :', error);
      toast.error('Impossible de charger les expériences.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette expérience ? Cette action est irréversible.')) return;
    setDeletingId(id);
    try {
      const response = await axiosClient.delete(`/experiences/${id}`);
      toast.success(response.data.message || 'Expérience supprimée avec succès !');
      fetchExperiences();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'expérience :', error);
      toast.error(error.response?.data?.message || 'Échec de la suppression de l\'expérience.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">Expériences</h1>
            <p className="text-neutral-400 text-sm sm:text-base">
              {experiences.length} expérience{experiences.length !== 1 ? 's' : ''} au total
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/add_experiences')}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all duration-300 self-start sm:self-auto"
          >
            <PlusIcon className="w-5 h-5" />
            Ajouter une expérience
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : experiences.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl py-16 flex flex-col items-center text-center"
          >
            <BriefcaseIcon className="w-12 h-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-sm">Aucune expérience trouvée.</p>
            <button
              onClick={() => navigate('/admin/add_experiences')}
              className="mt-4 text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
            >
              Ajouter votre première expérience →
            </button>
          </motion.div>
        ) : (
          <>
            {/* Mobile / tablette : cartes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {experiences.map((exp, index) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  index={index}
                  formatDate={formatDate}
                  onEdit={() => navigate(`/admin/edit_experiences/${exp.id}`)}
                  onDelete={handleDelete}
                  deleting={deletingId === exp.id}
                />
              ))}
            </div>

            {/* Desktop : tableau */}
            <div className="hidden lg:block bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}>
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Période</th>
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Poste</th>
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Entreprise</th>
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Type</th>
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Statut</th>
                      <th className="text-right py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiences.map((exp, index) => (
                      <motion.tr
                        key={exp.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        <td className="py-3.5 px-4 text-neutral-400 text-xs whitespace-nowrap">
                          {formatDate(exp.start_date)} – {exp.is_current ? 'Présent' : formatDate(exp.end_date)}
                        </td>
                        <td className="py-3.5 px-4 text-white text-sm font-medium">{exp.title}</td>
                        <td className="py-3.5 px-4 text-neutral-300 text-sm">{exp.company}</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-sm">{exp.type || '—'}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${Number(exp.is_active) === 1
                                ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300'
                                : 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${Number(exp.is_active) === 1 ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
                            {Number(exp.is_active) === 1 ? 'Visible' : 'Masqué'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button
                              title="Modifier"
                              onClick={() => navigate(`/admin/edit_experiences/${exp.id}`)}
                              className="p-2 text-fuchsia-300 hover:bg-fuchsia-400/10 rounded-lg transition-colors"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              title="Supprimer"
                              onClick={() => handleDelete(exp.id)}
                              disabled={deletingId === exp.id}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {deletingId === exp.id ? (
                                <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />
                              ) : (
                                <TrashIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ExperienceCard({ exp, index, formatDate, onEdit, onDelete, deleting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-4 hover:border-cyan-400/25 transition-colors duration-300"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{exp.title}</h3>
          <p className="text-neutral-400 text-xs truncate">{exp.company}</p>
        </div>
        <span
          className={`flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${Number(exp.is_active) === 1
              ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300'
              : 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${Number(exp.is_active) === 1 ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
          {Number(exp.is_active) === 1 ? 'Visible' : 'Masqué'}
        </span>
      </div>

      <p className="text-neutral-500 text-xs mb-1">
        {formatDate(exp.start_date)} – {exp.is_current ? 'Présent' : formatDate(exp.end_date)}
      </p>
      {exp.type && (
        <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300 mb-3">
          {exp.type}
        </span>
      )}

      <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/5">
        <button
          onClick={onEdit}
          className="p-2 text-fuchsia-300 hover:bg-fuchsia-400/10 rounded-lg transition-colors"
          title="Modifier"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(exp.id)}
          disabled={deleting}
          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Supprimer"
        >
          {deleting ? (
            <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />
          ) : (
            <TrashIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}