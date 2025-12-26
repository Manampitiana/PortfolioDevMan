import { ArrowDownIcon, CodeBracketIcon, DevicePhoneMobileIcon, EyeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Experience from './Experience';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [publicSkills, setPublicSkills] = useState([]);
  const [loading, setLoading] = useState(true); // loader state



  // Récupérer les compétences
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/publicSkills');
      setPublicSkills(response.data.publicSkills || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
    } finally {
      setLoading(false); // <-- eto rehefa vita ny fetch
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Récupérer les projets en vedette
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await axiosClient.get('/fetch_featured_projects');
        setFeaturedProjects(response.data.featuredProjects || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets en vedette:', error);
      }
    };
    fetchFeaturedProjects();
  }, []);

  const skeletonArray = Array(6).fill(0); // 6 skeletons


  const [aboutMe, setAboutMe] = useState(null);

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      const response = await axiosClient.get('/fetch_about_me'); // Hamarino ny route-nao
      // Raha Laravel no mampiasa resource, dia response.data matetika
      setAboutMe(response.data);
    } catch (error) {
      console.error('Error fetching about me:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">

      {/* Section Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Profil */}
            <div className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                  className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-2"
                >
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-6xl sm:text-7xl lg:text-8xl font-bold text-white overflow-hidden">
                    {/* DINAMIKA: Sary (PDP) */}
                    {aboutMe?.pdp ? (
                      <img src={aboutMe?.pdp} alt="pdp" />
                    ) : (
                      <div className="flex items-center h-full justify-center text-gray-500 italic text-sm">No Photo</div>
                    )}
                  </div>
                </motion.div>

                {/* Icônes flottantes */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-2xl animate-[spin_3s_linear_infinite]">
                    <img src="/react.png" alt="" />
                  </span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-lg">🔧</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                  className="absolute top-1/2 -left-8 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">
                    <img src="/laravel.png" alt="" />
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                  Bonjour, je suis
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    RAVAKA TSIRINIAINA
                  </span>
                  <span className="block text-2xl sm:text-2xl lg:text-3xl text-gray-300 font-medium mt-2">
                    Manampitiana
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 leading-relaxed">
                  Développeur Full Stack | Spécialiste React & Laravel
                </p>
                <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Je crée des applications web modernes et responsives avec les technologies les plus récentes
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/projects')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform"
                  >
                    Voir mes Projets
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/cv')}
                    className="border border-gray-400 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 hover:text-white transition-all duration-300"
                  >
                    Télécharger mon CV
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Indicateur de scroll */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDownIcon className="w-6 h-6 text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* Section Compétences */}
      <section className="py-20 px-4 bg-gray-100 dark:dark:bg-[var(--theme-color)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[var(--theme-color)] dark:text-white mb-16 transition-colors duration-300">
            Mes <span className="text-blue-600 dark:text-cyan-400 transition-colors duration-300">Compétences</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? skeletonArray.map((_, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[var(--theme-color)] shadow-lg h-40 animate-pulse"
                >
                  {/* Header Skeleton (Logo + Titre) */}
                  <div className="flex items-center mb-6">
                    {/* Logo Circle */}
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                    {/* Title Text */}
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
                  </div>

                  {/* Progress Bar Skeleton */}
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                    {/* Percentage Text */}
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-8"></div>
                  </div>
                </div>
              ))
              : publicSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-[var(--theme-color)] p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-cyan-500/50 shadow-lg dark:shadow-none"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={`http://localhost:8000/storage/${skill.logo}`}
                      alt={skill.name}
                      className="w-8 h-8 object-cover mr-2"
                    />
                    <h3 className="text-xl font-semibold text-[var(--theme-color)] dark:text-white">{skill.name}</h3>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{skill.level}%</span>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section className="py-20 px-4 bg-white dark:bg-[var(--theme-color)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[var(--theme-color)] dark:text-white mb-16">
            Mes <span className="text-blue-600 dark:text-cyan-400">Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Développement Web', icon: GlobeAltIcon, desc: 'Création de sites web modernes et responsives avec les dernières technologies', bg: 'from-cyan-500 to-blue-600' },
              { title: 'Mobile Responsive', icon: DevicePhoneMobileIcon, desc: 'Design responsive fonctionnant parfaitement sur tous les appareils', bg: 'from-blue-500 to-indigo-600' },
              { title: 'Full Stack', icon: CodeBracketIcon, desc: 'Développement Frontend & Backend avec gestion de base de données', bg: 'from-emerald-500 to-teal-600' }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className={`text-center p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-cyan-500/50 transition-all duration-300 shadow-lg dark:shadow-none bg-gray-50 dark:bg-[var(--theme-color)]`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${service.bg} rounded-full flex items-center justify-center`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--theme-color)] dark:text-white mb-4">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Projets en vedette */}
      <section className="py-20 px-4 bg-gray-100 dark:bg-[var(--theme-color)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--theme-color)] dark:text-white mb-4">
              Projets <span className="text-blue-600 dark:text-cyan-400">Populaires</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez quelques-uns de mes projets les plus réussis
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group bg-white dark:bg-[var(--theme-color)] rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 shadow-lg"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={`http://localhost:8000/storage/${project.cover_image}`}
                    alt={project.title}
                    className='w-full h-48 object-cover'
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <a href={project.liveUrl} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <EyeIcon className="w-5 h-5 text-white" />
                    </a>
                    <a href={project.githubUrl} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <CodeBracketIcon className="w-5 h-5 text-white" />
                    </a>
                  </div> */}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-3">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div>
            <Link
              to="/projects"
              className="mx-auto block w-max bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
            >
              Voir tous les projets
            </Link>
          </div>
        </div>
      </section>

      {/* Section Experience */}
      <Experience />
    </div>
  );
}
