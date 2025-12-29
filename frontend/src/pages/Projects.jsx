import { useEffect, useState } from 'react'
import { EyeIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import axiosClient from '../axios'
import { Link } from 'react-router-dom'

// 1. Composant Skeleton pour le chargement
const ProjectSkeleton = () => (
  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  </div>
);

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Mes <span className="text-cyan-400">Réalisations</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Découvrez les projets que j'ai réalisés en utilisant des technologies modernes.
          </p>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="pb-16 px-4 bg-gray-100 dark:bg-[var(--theme-color)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--theme-color)] dark:text-white pt-12 mb-12 text-center">
            Projets <span className="text-blue-600 dark:text-cyan-400">Phares</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {loading ? (
              [...Array(3)].map((_, i) => <ProjectSkeleton key={i} />)
            ) : (
              <>
                {featuredProjects.length === 0 && (
                  <p className="col-span-3 text-center text-gray-500">Aucun projet mis en avant trouvé.</p>
                )}
                {featuredProjects.map((project) => (
                  <div key={project.id} className="group bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm rounded-xl border border-gray-400 dark:border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 bg-[var(--theme-color)] flex items-center justify-center">
                        <img src={`https://portfolio-backend-58gy.onrender.com/storage/${project.cover_image}`} alt={project.title} className='w-full h-full object-cover'/>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        <Link to={project.project_url} onClick={() => incrementView(project.id)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <EyeIcon className="w-5 h-5 text-white" title="Voir le projet" />
                        </Link>
                        <Link to={project.github_url} onClick={() => incrementView(project.id)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <CodeBracketIcon className="w-5 h-5 text-white" title="Voir le code" />
                        </Link>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[var(--theme-color)] dark:text-white mb-3">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies && JSON.parse(project.technologies).map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-cyan-500/20 text-[var(--theme-color)] dark:text-cyan-300 rounded-full text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        <Link to={project.project_url} onClick={() => incrementView(project.id)} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-all duration-300">
                          Démo Live
                        </Link>
                        <Link to={project.github_url} onClick={() => incrementView(project.id)} className="flex-1 border border-gray-400 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-gray-700 hover:text-white transition-all duration-300">
                          Code Source
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* All Projects Section */}
      <section className="pb-10 px-4 bg-gray-100 dark:bg-[var(--theme-color)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--theme-color)] dark:text-white mb-12 text-center">
            Tous mes <span className="text-blue-600 dark:text-cyan-400">Projets</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)
            ) : (
              <>
                {projects.length === 0 && (
                  <p className="col-span-3 text-center text-gray-500">Aucun projet trouvé.</p>
                )}
                {projects.map((project) => (
                  <div key={project.id} className="group bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm rounded-xl border dark:border-gray-700 border-gray-400 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 bg-[var(--theme-color)] flex items-center justify-center">
                        <img src={`https://portfolio-backend-58gy.onrender.com/storage/${project.cover_image}`} alt={project.title} className='w-full h-full object-cover'/>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        <Link to={project.project_url} onClick={() => incrementView(project.id)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <EyeIcon className="w-5 h-5 text-white" />
                        </Link>
                        <Link to={project.github_url} onClick={() => incrementView(project.id)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <CodeBracketIcon className="w-5 h-5 text-white" />
                        </Link>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-[var(--theme-color)] dark:text-white mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies && JSON.parse(project.technologies).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-cyan-500/20 text-gray-700 dark:text-cyan-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}