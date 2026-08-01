import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, CalendarIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axiosClient from '../axios';
import { useSettings } from '../contexts/SettingsContext';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// À ajuster si l'endpoint public réel diffère (ex. /fetch_project/:slug)
const PROJECT_ENDPOINT = (slug) => `/fetch_project/${slug}`;

function safeParseArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(new Date(date));
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchProject = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await axiosClient.get(PROJECT_ENDPOINT(slug));
        const data = res.data.project || res.data;
        if (!active) return;
        if (!data) {
          setNotFound(true);
        } else {
          setProject(data);
          if (data.id) {
            axiosClient.post(`/projects/${data.id}/view`).catch(() => {});
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du projet :', error);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProject();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-32 px-4">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-10 w-2/3 bg-white/10 rounded" />
          <div className="h-80 bg-white/5 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
            <div className="h-3 bg-white/10 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Ce projet est introuvable.</p>
          <Link to="/projects" className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors">
            ← Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const technologies = safeParseArray(project.technologies);
  const gallery = safeParseArray(project.gallery);
  const allImages = [project.cover_image, ...gallery].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{project.title} | {settings?.site_name || 'ManDev'} - Portfolio</title>
        <meta name="description" content={project.short_description || project.description?.slice(0, 155) || ''} />
      </Helmet>

      <div className="min-h-screen bg-neutral-950">
        <section className="relative pt-28 sm:pt-32 pb-16 px-4 border-b border-white/5 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-0 -right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative max-w-5xl mx-auto">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Retour aux projets
            </button>

            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white mb-4">{project.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-neutral-400">
              {project.client_name && (
                <span className="inline-flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-cyan-300" />
                  {project.client_name}
                </span>
              )}
              {(project.start_date || project.end_date) && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-cyan-300" />
                  {formatDate(project.start_date)} – {project.is_current ? 'Présent' : formatDate(project.end_date)}
                </span>
              )}
            </div>

            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {technologies.map((tech, idx) => (
                  <span key={idx} className="text-[11px] font-mono text-cyan-200 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2.5 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-neutral-900 py-2.5 px-5 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors duration-300"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  Démo live
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/15 text-neutral-300 py-2.5 px-5 rounded-full text-sm font-medium hover:bg-white/10 hover:text-white transition-colors duration-300"
                >
                  <CodeBracketIcon className="w-4 h-4" />
                  Code source
                </a>
              )}
            </div>
          </motion.div>
        </section>

        {/* Cover + Gallery */}
        {allImages.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <motion.button
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                onClick={() => setLightbox(allImages[0])}
                className="block w-full rounded-2xl overflow-hidden border border-white/10 mb-4"
              >
                <img src={allImages[0]} alt={project.title} className="w-full max-h-[520px] object-cover" />
              </motion.button>

              {allImages.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allImages.slice(1).map((img, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      onClick={() => setLightbox(img)}
                      className="aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/30 transition-colors"
                    >
                      <img src={img} alt={`${project.title} ${idx + 2}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Description */}
        <section className="pb-24 px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-2xl font-semibold text-white mb-4">À propos du projet</h2>
            <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {project.description || project.short_description}
            </p>
          </motion.div>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              src={lightbox}
              alt={project.title}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}