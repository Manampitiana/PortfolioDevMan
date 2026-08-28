import {
    EyeIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    FolderOpenIcon,
    XMarkIcon,
    CalendarIcon,
    UserIcon,
    ArrowTopRightOnSquareIcon,
    CodeBracketIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Analyse sécurisée du JSON (technologies / gallery) pour éviter un crash si la donnée est vide ou mal formée
function safeParseJSON(value) {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default function AdminProject() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [previewProject, setPreviewProject] = useState(null); // projet affiché dans le modal "Aperçu"

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/projects');
            setProjects(response.data.projects || []);
        } catch (error) {
            console.error('Erreur lors de la récupération des projets :', error);
            toast.error('Impossible de charger les projets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce projet ? Cette action est irréversible.')) return;
        setDeletingId(id);
        try {
            const response = await axiosClient.delete(`/projects/${id}`);
            toast.success(response.data.message || 'Projet supprimé avec succès !');
            fetchProjects();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || 'Échec de la suppression du projet.');
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
                        <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">Gestion des projets</h1>
                        <p className="text-neutral-400 text-sm sm:text-base">
                            {projects.length} projet{projects.length !== 1 ? 's' : ''} au total
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/add_projects')}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all duration-300 self-start sm:self-auto"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Ajouter un projet
                    </button>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-[50vh]">
                        <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
                    </div>
                ) : projects.length === 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl py-16 flex flex-col items-center text-center"
                    >
                        <FolderOpenIcon className="w-12 h-12 text-neutral-600 mb-4" />
                        <p className="text-neutral-400 text-sm">Aucun projet trouvé.</p>
                        <button
                            onClick={() => navigate('/admin/add_projects')}
                            className="mt-4 text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
                        >
                            Créer votre premier projet →
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Mobile / tablette : cartes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                            {projects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    onDelete={handleDelete}
                                    onPreview={setPreviewProject}
                                    deleting={deletingId === project.id}
                                />
                            ))}
                        </div>

                        {/* Desktop : tableau */}
                        <div className="hidden lg:block">
                            <ProjectTable
                                projects={projects}
                                onDelete={handleDelete}
                                onPreview={setPreviewProject}
                                deletingId={deletingId}
                            />
                        </div>
                    </>
                )}
            </div>

            <ProjectPreviewModal project={previewProject} onClose={() => setPreviewProject(null)} />
        </div>
    );
}

// Correspondance entre la valeur "status" (varchar) en base et son affichage
const STATUS_CONFIG = {
    published: { label: 'Publié', dot: 'bg-emerald-400', classes: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300' },
    draft: { label: 'Brouillon', dot: 'bg-amber-400', classes: 'bg-amber-400/10 border-amber-400/20 text-amber-300' },
    archived: { label: 'Archivé', dot: 'bg-neutral-500', classes: 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400' },
};

function StatusPill({ status }) {
    const config = STATUS_CONFIG[status] || {
        label: status || 'Inconnu',
        dot: 'bg-neutral-500',
        classes: 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${config.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

function TechChips({ technologies, max = 3 }) {
    const techs = safeParseJSON(technologies);
    if (techs.length === 0) return <span className="text-neutral-600 text-xs">—</span>;
    const shown = techs.slice(0, max);
    const rest = techs.length - shown.length;
    return (
        <div className="flex flex-wrap gap-1.5">
            {shown.map((tech, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                    {tech}
                </span>
            ))}
            {rest > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                    +{rest}
                </span>
            )}
        </div>
    );
}

function ActionButtons({ project, onDelete, onPreview, deleting }) {
    return (
        <div className="flex items-center gap-1.5">
            <button
                title="Aperçu"
                onClick={() => onPreview(project)}
                className="p-2 text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-colors"
            >
                <EyeIcon className="w-4 h-4" />
            </button>
            <Link
                to={`/admin/edit_projects/${project.id}`}
                title="Modifier"
                className="p-2 text-fuchsia-300 hover:bg-fuchsia-400/10 rounded-lg transition-colors"
            >
                <PencilIcon className="w-4 h-4" />
            </Link>
            <button
                title="Supprimer"
                onClick={() => onDelete(project.id)}
                disabled={deleting}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {deleting ? (
                    <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />
                ) : (
                    <TrashIcon className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}

function ProjectCard({ project, index, onDelete, onPreview, deleting }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-4 hover:border-cyan-400/25 transition-colors duration-300"
        >
            <div className="flex items-start gap-3 mb-3">
                {project.cover_image ? (
                    <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <FolderOpenIcon className="w-6 h-6 text-neutral-600" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <h3 className="text-white font-medium text-sm truncate">{project.title}</h3>
                    <p className="text-neutral-500 text-xs truncate">{project.slug}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                        <StatusPill status={project.status} />
                        {project.is_current && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300">
                                En cours
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-neutral-400 text-xs line-clamp-2 mb-3">{project.description}</p>

            <TechChips technologies={project.technologies} />

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs">
                    {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                            Voir le site
                        </a>
                    )}
                    {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:text-violet-200 transition-colors">
                            GitHub
                        </a>
                    )}
                </div>
                <ActionButtons project={project} onDelete={onDelete} onPreview={onPreview} deleting={deleting} />
            </div>
        </motion.div>
    );
}

function ProjectTable({ projects, onDelete, onPreview, deletingId }) {
    return (
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}>
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Projet</th>
                            <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Description</th>
                            <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Technologies</th>
                            <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Période</th>
                            <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Statut</th>
                            <th className="text-left py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Liens</th>
                            <th className="text-right py-3.5 px-4 text-neutral-400 font-medium text-xs uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <motion.tr
                                key={project.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.04 }}
                                className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-200"
                            >
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3 max-w-[220px]">
                                        {project.cover_image ? (
                                            <img src={project.cover_image} alt={project.title} className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                                <FolderOpenIcon className="w-4 h-4 text-neutral-600" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{project.title}</p>
                                            <p className="text-neutral-500 text-xs truncate">{project.slug}</p>
                                            {project.is_current && (
                                                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300">
                                                    En cours
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 px-4 text-neutral-400 text-sm max-w-[220px] truncate">{project.description}</td>
                                <td className="py-3.5 px-4 max-w-[200px]"><TechChips technologies={project.technologies} /></td>
                                <td className="py-3.5 px-4 text-neutral-400 text-xs whitespace-nowrap">
                                    {project.start_date}
                                    {project.end_date ? ` → ${project.end_date}` : ' → présent'}
                                </td>
                                <td className="py-3.5 px-4"><StatusPill status={project.status} /></td>
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3 text-xs">
                                        {project.project_url && (
                                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                                                Site
                                            </a>
                                        )}
                                        {project.github_url && (
                                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:text-violet-200 transition-colors">
                                                GitHub
                                            </a>
                                        )}
                                        {!project.project_url && !project.github_url && <span className="text-neutral-600">—</span>}
                                    </div>
                                </td>
                                <td className="py-3.5 px-4">
                                    <div className="flex justify-end">
                                        <ActionButtons project={project} onDelete={onDelete} onPreview={onPreview} deleting={deletingId === project.id} />
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Modal "Aperçu" propre à l'Admin — affiche TOUTES les infos (même un projet en Brouillon/Archivé,
// qui ne serait pas visible sur la page publique /projects/:slug)
function ProjectPreviewModal({ project, onClose }) {
    if (!project) return null;

    const technologies = safeParseJSON(project.technologies);
    const gallery = safeParseJSON(project.gallery);

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl"
                    >
                        {/* En-tête sticky */}
                        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 sm:px-6 h-14 bg-neutral-900/95 backdrop-blur-xl border-b border-white/10">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-white font-medium text-sm truncate">{project.title}</span>
                                <StatusPill status={project.status} />
                                {project.is_current && (
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300 shrink-0">
                                        En cours
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6">
                            {project.cover_image ? (
                                <img
                                    src={project.cover_image}
                                    alt={project.title}
                                    className="w-full h-56 sm:h-64 object-cover rounded-xl border border-white/10 mb-6"
                                />
                            ) : (
                                <div className="w-full h-40 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                    <FolderOpenIcon className="w-10 h-10 text-neutral-600" />
                                </div>
                            )}

                            {project.short_description && (
                                <p className="text-neutral-300 text-sm leading-relaxed mb-5">{project.short_description}</p>
                            )}

                            {project.description && (
                                <div className="mb-6">
                                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-2">Description</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-line">{project.description}</p>
                                </div>
                            )}

                            {/* Infos clés */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                                    <CalendarIcon className="w-4 h-4 text-cyan-300 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-neutral-500 uppercase tracking-wide">Période</p>
                                        <p className="text-neutral-300 text-sm">
                                            {project.start_date}{project.end_date ? ` → ${project.end_date}` : ' → présent'}
                                        </p>
                                    </div>
                                </div>
                                {project.client_name && (
                                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                                        <UserIcon className="w-4 h-4 text-fuchsia-300 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[11px] text-neutral-500 uppercase tracking-wide">Client</p>
                                            <p className="text-neutral-300 text-sm truncate">{project.client_name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Technologies */}
                            {technologies.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-2.5">Technologies</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {technologies.map((tech, i) => (
                                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Galerie */}
                            {gallery.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-2.5">Galerie ({gallery.length})</h4>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {gallery.map((img, i) => (
                                            <img key={i} src={img} alt={`Galerie ${i + 1}`} className="w-full aspect-square object-cover rounded-lg border border-white/10" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Liens + actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                                {project.project_url && (
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
                                    >
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                        Voir le site
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-violet-300 hover:text-violet-200 transition-colors"
                                    >
                                        <CodeBracketIcon className="w-4 h-4" />
                                        GitHub
                                    </a>
                                )}

                                <div className="flex-1" />

                                <Link
                                    to={`/admin/edit_projects/${project.id}`}
                                    className="inline-flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded-lg transition-colors"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    Modifier
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}