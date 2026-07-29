import { useEffect, useState } from 'react'
import { EyeIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import axiosClient from '../axios'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Reveal réutilisable, cohérent avec le reste du site
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Skeleton — glass, cohérent avec le loading des Compétences
const ProjectSkeleton = () => (
  <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-white/5"></div>
    <div className="p-6 space-y-4">
      <div className="h-5 bg-white/10 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded"></div>
        <div className="h-3 bg-white/10 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-white/10 rounded-full w-full"></div>
        <div className="h-9 bg-white/10 rounded-full w-full"></div>
      </div>
    </div>
  </div>
);

// Card projet — réutilisée pour "Phares" et "Tous mes projets"
function ProjectCard({ project, index, incrementView, featured = false }) {
  const technologies = project.technologies ? JSON.parse(project.technologies) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-cyan-400/25 transition-colors duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-white/[0.02]">
        <img
          src={project.cover_image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/0 to-transparent" />

        {/* Overlay actions au hover */}
        <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={project.project_url}
            onClick={() => incrementView(project.id)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-cyan-400/20 hover:border-cyan-400/40 transition-colors"
            title="Voir le projet"
          >
            <EyeIcon className="w-5 h-5 text-white" />
          </Link>
          <Link
            to={project.github_url}
            onClick={() => incrementView(project.id)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-cyan-400/20 hover:border-cyan-400/40 transition-colors"
            title="Voir le code"
          >
            <CodeBracketIcon className="w-5 h-5 text-white" />
          </Link>
        </div>

        {featured && (
          <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest text-cyan-200 bg-cyan-400/10 border border-cyan-400/20 backdrop-blur-md rounded-full px-2.5 py-1">
            PROJET PHARE
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className={`font-display font-semibold text-white mb-2 ${featured ? 'text-xl' : 'text-lg'}`}>
          {project.title}
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-cyan-200 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2.5 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {featured && (
          <div className="flex gap-3">
            <Link
              to={project.project_url}
              onClick={() => incrementView(project.id)}
              className="flex-1 bg-white text-neutral-900 py-2 px-4 rounded-full text-center text-sm font-medium hover:bg-neutral-200 transition-colors duration-300"
            >
              Démo Live
            </Link>
            <Link
              to={project.github_url}
              onClick={() => incrementView(project.id)}
              className="flex-1 border border-white/15 text-neutral-300 py-2 px-4 rounded-full text-center text-sm font-medium hover:bg-white/10 hover:text-white transition-colors duration-300"
            >
              Code Source
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [resProjects, resFeatured] = await Promise.all([
          axiosClient.get('/fetch_projects'),
          axiosClient.get('/fetch_featured_projects')
        ]);

        setProjects(resProjects.data.projects || []);
        setFeaturedProjects(resFeatured.data.featuredProjects || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  const incrementView = async (projectId) => {
    try {
      await axiosClient.post(`/projects/${projectId}/view`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-neutral-950 border-b border-white/5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-0 -right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative max-w-6xl mx-auto text-center"
        >
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6">
            Mes <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Réalisations</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-12">
            Découvrez les projets que j'ai réalisés en utilisant des technologies modernes.
          </p>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section className="relative py-20 px-4 bg-neutral-950 border-b border-white/5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">SÉLECTION</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
              Projets <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Phares</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => <ProjectSkeleton key={i} />)
            ) : (
              <>
                {featuredProjects.length === 0 && (
                  <p className="col-span-full text-center text-neutral-500">Aucun projet mis en avant trouvé.</p>
                )}
                {featuredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    incrementView={incrementView}
                    featured
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* All Projects Section */}
      <section className="relative py-20 px-4 bg-neutral-950 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/[0.06] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">ARCHIVES</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
              Tous mes <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Projets</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)
            ) : (
              <>
                {projects.length === 0 && (
                  <p className="col-span-full text-center text-neutral-500">Aucun projet trouvé.</p>
                )}
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    incrementView={incrementView}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}