import { ArrowDownIcon, CodeBracketIcon, DevicePhoneMobileIcon, EyeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Experience from './Experience';

// Reveal réutilisable, cohérent avec le reste du site
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [publicSkills, setPublicSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true); // loader dédié aux compétences



  // Récupérer les compétences
  const fetchSkills = async () => {
    setSkillsLoading(true);
    try {
      const response = await axiosClient.get('/publicSkills');
      setPublicSkills(response.data.publicSkills || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
    } finally {
      setSkillsLoading(false); // <-- eto rehefa vita ny fetch
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
    }
  };

  const services = [
    { title: 'Développement Web', icon: GlobeAltIcon, desc: 'Création de sites web modernes et responsives avec les dernières technologies', bg: 'from-cyan-400 to-fuchsia-400' },
    { title: 'Mobile Responsive', icon: DevicePhoneMobileIcon, desc: 'Design responsive fonctionnant parfaitement sur tous les appareils', bg: 'from-fuchsia-400 to-violet-400' },
    { title: 'Full Stack', icon: CodeBracketIcon, desc: 'Développement Frontend & Backend avec gestion de base de données', bg: 'from-violet-400 to-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 transition-colors duration-300">

      {/* Section Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 py-20 bg-neutral-950 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 w-[34rem] h-[34rem] bg-cyan-500/[0.08] rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] bg-fuchsia-500/[0.08] rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Profil — glass frame */}
            <div className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-64 sm:w-80 lg:w-96">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[4/5] rounded-[28px] bg-white/[0.04] backdrop-blur-2xl border border-white/10 overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
                >
                  <div className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br from-cyan-400 to-fuchsia-400 blur-3xl opacity-30" />
                  {/* DINAMIKA: Sary (PDP) */}
                  {aboutMe?.pdp ? (
                    <img src={aboutMe.pdp} alt={aboutMe?.full_name || 'PDP'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-600 border border-dashed border-white/10 m-3 rounded-2xl">
                      <span className="text-5xl">🧑‍💻</span>
                      <span className="text-[11px] font-mono">Aucune photo</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] font-mono text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> disponible
                  </div>
                </motion.div>

                {/* Chips technologiques flottants */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg"
                >
                  <img src="/react.png" alt="React" className="w-6 h-6 sm:w-7 sm:h-7" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg"
                >
                  <span className="text-base sm:text-lg">🔧</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                  className="hidden sm:flex absolute top-1/2 -left-8 w-10 h-10 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 items-center justify-center shadow-lg"
                >
                  <img src="/laravel.png" alt="Laravel" className="w-5 h-5" />
                </motion.div>
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1.5 mb-6">
                  DÉVELOPPEUR FULL-STACK
                </span>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">
                  Bonjour, je suis
                  <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                    RAVAKA TSIRINIAINA
                  </span>
                  <span className="block text-xl sm:text-2xl lg:text-3xl text-neutral-400 font-medium mt-2">
                    Manampitiana
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-neutral-300 mb-6 leading-relaxed">
                  Développeur Full Stack | Spécialiste React & Laravel
                </p>
                <p className="text-base sm:text-lg text-neutral-500 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Je crée des applications web modernes et responsives avec les technologies les plus récentes
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/projects')}
                    className="bg-white text-neutral-900 px-8 py-4 rounded-full font-semibold hover:bg-neutral-200 transition-all duration-300 transform"
                  >
                    Voir mes Projets
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/cv')}
                    className="bg-white/[0.04] border border-white/10 backdrop-blur-xl text-neutral-200 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
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
            <ArrowDownIcon className="w-6 h-6 text-neutral-500" />
          </motion.div>
        </div>
      </section>

      {/* Section Compétences */}
      <section className="relative py-20 px-4 bg-neutral-950 border-t border-white/5 overflow-hidden">
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
            <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">STACK</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
              Mes <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Compétences</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillsLoading
              ? skeletonArray.map((_, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] h-40 animate-pulse"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-white/10 rounded-full mr-3"></div>
                    <div className="h-5 bg-white/10 rounded-md w-24"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full bg-white/10 rounded-full h-2"></div>
                    <div className="h-3 bg-white/10 rounded-md w-8"></div>
                  </div>
                </div>
              ))
              : publicSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 rounded-2xl hover:border-cyan-400/25 transition-colors duration-300"
                >
                  <div className="flex items-center mb-4">
                    <img src={skill.logo} alt={skill.name} className="w-8 h-8 object-cover mr-3" />
                    <h3 className="font-display text-lg font-semibold text-white">{skill.name}</h3>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 h-1.5 rounded-full"
                    />
                  </div>
                  <span className="font-mono text-xs text-neutral-500">{skill.level}%</span>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section className="relative py-20 px-4 bg-neutral-950 border-t border-white/5 overflow-hidden">
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
            <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">EXPERTISE</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
              Mes <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Services</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="text-center p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/25 transition-colors duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${service.bg} rounded-2xl flex items-center justify-center`}>
                  <service.icon className="w-8 h-8 text-neutral-950" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Projets en vedette */}
      <section className="relative py-20 px-4 bg-neutral-950 border-t border-white/5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">RÉALISATIONS</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
              Projets <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Populaires</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Découvrez quelques-uns de mes projets les plus réussis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className="group bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-cyan-400/25 transition-colors duration-300"
              >
                <div className="relative overflow-hidden h-48">
                  <motion.img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/projects"
                className="inline-block bg-white text-neutral-900 py-3 px-6 rounded-full font-medium hover:bg-neutral-200 transition-all duration-300"
              >
                Voir tous les projets
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Experience */}
      <Experience />
    </div>
  );
}