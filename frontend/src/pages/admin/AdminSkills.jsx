import { PlusIcon, PencilSquareIcon, TrashIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Outils',
};

export default function AdminSkills() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/skills');
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences :', error);
      toast.error('Impossible de charger les compétences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette compétence ? Cette action est irréversible.')) return;
    setDeletingId(id);
    try {
      const response = await axiosClient.delete(`/skills/${id}`);
      toast.success(response.data.message || 'Compétence supprimée avec succès !');
      fetchSkills();
    } catch (error) {
      console.error('Erreur lors de la suppression de la compétence :', error);
      toast.error(error.response?.data?.message || 'Échec de la suppression de la compétence.');
    } finally {
      setDeletingId(null);
    }
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
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">Compétences</h1>
            <p className="text-neutral-400 text-sm sm:text-base">
              {skills.length} compétence{skills.length !== 1 ? 's' : ''} au total
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/add_skills')}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all duration-300 self-start sm:self-auto"
          >
            <PlusIcon className="w-5 h-5" />
            Ajouter une compétence
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : skills.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl py-16 flex flex-col items-center text-center"
          >
            <CpuChipIcon className="w-12 h-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-sm">Aucune compétence trouvée.</p>
            <button
              onClick={() => navigate('/admin/add_skills')}
              className="mt-4 text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
            >
              Ajouter votre première compétence →
            </button>
          </motion.div>
        ) : (
          <>
            {/* Mobile / tablette : cartes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  index={index}
                  onEdit={() => navigate(`/admin/edit_skills/${skill.id}`)}
                  onDelete={handleDelete}
                  deleting={deletingId === skill.id}
                />
              ))}
            </div>

            {/* Desktop : tableau */}
            <div className="hidden lg:block bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}>
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Compétence</th>
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Catégorie</th>
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Niveau</th>
                      <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Statut</th>
                      <th className="text-right py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, index) => (
                      <motion.tr
                        key={skill.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {skill.logo ? (
                              <img src={skill.logo} alt={skill.name} className="w-10 h-10 p-1.5 object-contain rounded-lg bg-white/[0.04] border border-white/10 flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                <CpuChipIcon className="w-4 h-4 text-neutral-600" />
                              </div>
                            )}
                            <span className="text-white text-sm font-medium truncate">{skill.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300">
                            {CATEGORY_LABELS[skill.category] || skill.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 max-w-[160px]">
                            <div className="flex-1 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-1.5 rounded-full"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-neutral-400 text-xs w-9 text-right">{skill.level}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${Number(skill.is_active) === 1
                                ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300'
                                : 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${Number(skill.is_active) === 1 ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
                            {Number(skill.is_active) === 1 ? 'Visible' : 'Masqué'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button
                              title="Modifier"
                              onClick={() => navigate(`/admin/edit_skills/${skill.id}`)}
                              className="p-2 text-fuchsia-300 hover:bg-fuchsia-400/10 rounded-lg transition-colors"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              title="Supprimer"
                              onClick={() => handleDelete(skill.id)}
                              disabled={deletingId === skill.id}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {deletingId === skill.id ? (
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

function SkillCard({ skill, index, onEdit, onDelete, deleting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-4 hover:border-cyan-400/25 transition-colors duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        {skill.logo ? (
          <img src={skill.logo} alt={skill.name} className="w-12 h-12 p-2 object-contain rounded-xl bg-white/[0.04] border border-white/10 flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <CpuChipIcon className="w-5 h-5 text-neutral-600" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-medium text-sm truncate">{skill.name}</h3>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300">
              {CATEGORY_LABELS[skill.category] || skill.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${Number(skill.is_active) === 1
                  ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300'
                  : 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${Number(skill.is_active) === 1 ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
              {Number(skill.is_active) === 1 ? 'Visible' : 'Masqué'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-1.5 rounded-full"
            style={{ width: `${skill.level}%` }}
          />
        </div>
        <span className="text-neutral-400 text-xs w-9 text-right">{skill.level}%</span>
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/5">
        <button
          onClick={onEdit}
          className="p-2 text-fuchsia-300 hover:bg-fuchsia-400/10 rounded-lg transition-colors"
          title="Modifier"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(skill.id)}
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