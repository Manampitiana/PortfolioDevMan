import { ArrowDownIcon, CodeBracketIcon, DevicePhoneMobileIcon, EyeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Facebook, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Experience from './Experience';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../contexts/SettingsContext';
import OsWallpaper from '../components/os/OsWallpaper';
import OsTopBar from '../components/os/OsTopBar';
import OsDock, { OsMobileNav } from '../components/os/OsDock';
import OsTaskbar from '../components/os/OsTaskbar';
import Terminal from '../components/os/Terminal';
import WindowFrame from '../components/os/WindowFrame';

// Reveal réutilisable, cohérent avec le reste du site
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const skillColors = {
  React: '#61DAFB',
  Laravel: '#FF2D20',
  PHP: '#777BB4',
  JavaScript: '#F7DF1E',
  Symfony: '#000000',
  TypeScript: '#3178C6',
  Tailwind: '#06B6D4',
  MySQL: '#4479A1',
  Node: '#339933',
  Express: '#FFFFFF',
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [publicSkills, setPublicSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true); // loader dédié aux compétences
  const { settings } = useSettings();



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
    <>
      <Helmet>
        <title>
          {settings?.site_name || "ManDev"} | Full Stack Web Developer Portfolio
        </title>

        <meta
          name="description"
          content="Portfolio of ManDev, a Full Stack Web Developer from Madagascar. Explore my projects, skills, experience, and contact information."
        />

        <link
          rel="canonical"
          href="https://portfolio-dev-man.vercel.app/"
        />
      </Helmet>
      <div className="min-h-screen bg-neutral-950 transition-colors duration-300 pb-16 md:pb-0">
        <OsTopBar />

        <div className="flex">
          <OsDock />

          <div className="flex-1 min-w-0">

            {/* Section Hero — style "Desktop OS" */}
            <section className="relative overflow-hidden min-h-[calc(100vh-2.75rem)] flex flex-col">
              <OsWallpaper />

              <div className="relative z-10 flex-1 flex items-center px-5 sm:px-10 lg:px-16 py-14">
                <div className="w-full max-w-6xl mx-auto">
                  <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                    {/* Contenu */}
                    <div className="flex-1 text-center lg:text-left">
                      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        {/* Avatar — carte flottante avec PDP + badges tech */}
                        <div className="relative inline-block mb-6">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400 to-fuchsia-400 shadow-lg shadow-cyan-500/10">
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                              {aboutMe?.pdp ? (
                                <img src={aboutMe.pdp} alt={aboutMe?.full_name || 'RAVAKA'} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">🧑‍💻</div>
                              )}
                            </div>
                          </div>
                          <span className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-neutral-900 border border-white/10 rounded-full px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> dispo
                          </span>

                          {/* Badges technos flottants */}
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="flex sm:flex absolute -top-3 -right-6 w-9 h-9 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 items-center justify-center shadow-lg"
                          >
                            <img src="/react.png" alt="React" className="w-4.5 h-4.5" />
                          </motion.div>
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            className="flex sm:flex absolute -bottom-3 -left-7 w-8 h-8 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 items-center justify-center shadow-lg"
                          >
                            <img src="/laravel.png" alt="Laravel" className="w-4 h-4" />
                          </motion.div>
                        </div>
                        <br />

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
                        <p className="text-lg sm:text-xl text-neutral-300 mb-4 leading-relaxed">
                          Développeur Full Stack | Spécialiste React & Laravel
                        </p>
                        <p className="text-base sm:text-lg text-neutral-500 mb-8 max-w-md mx-auto lg:mx-0">
                          Je crée des applications web modernes et responsives avec les technologies les plus récentes
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate('/projects')}
                            className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-neutral-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/10"
                          >
                            Voir mes Projets
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate('/cv')}
                            className="bg-white/10 border border-white/15 backdrop-blur-xl text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors"
                          >
                            Télécharger mon CV
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-3">
                          <a href="https://www.facebook.com/profile.php?id=100070143253960" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                            <Facebook className="w-4 h-4" />
                          </a>
                          <a href="https://www.linkedin.com/in/manampitiana-ravaka-tsiriniaina-5613b1317" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                            <Linkedin className="w-4 h-4" />
                          </a>
                          <a href="https://github.com/Manampitiana" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                            <Github className="w-4 h-4" />
                          </a>
                          <a href={`mailto:${aboutMe?.email || ''}`} className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    </div>

                    {/* Terminal */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                      className="w-full max-w-md lg:max-w-lg"
                    >
                      <Terminal aboutMe={aboutMe} skills={publicSkills} projects={featuredProjects} />
                    </motion.div>
                  </div>
                </div>
              </div>

              <OsTaskbar />
              <OsMobileNav />
            </section>

            {/* Section Compétences */}
            <section id="skills-section" className="relative py-20 px-4 bg-neutral-950 border-t border-white/5 overflow-hidden">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-3xl" />
              </div>
              <div className="relative max-w-6xl mx-auto">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                >
                  <WindowFrame title="skills.json" breadcrumb="Accueil > Compétences" bodyClassName="p-6 sm:p-10">
                    <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">STACK</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-10">
                      Mes <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Compétences</span>
                    </h2>

                    {/* Bloc "éditeur de code" — gouttière de lignes + JSON coloré */}
                    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 h-9 bg-white/[0.03] border-b border-white/10">
                        <span className="text-[11px] font-mono text-neutral-500">skills.json</span>
                      </div>

                      <div className="overflow-x-auto">
                        <div className="min-w-[420px] font-mono text-[13px] leading-7 py-4">
                          <div className="flex">
                            <span className="w-10 shrink-0 text-right pr-4 text-neutral-600 select-none">1</span>
                            <span className="text-neutral-400">{'{'}</span>
                          </div>
                          <div className="flex">
                            <span className="w-10 shrink-0 text-right pr-4 text-neutral-600 select-none">2</span>
                            <span className="pl-4 text-sky-300">"developer"</span>
                            <span className="text-neutral-500">:</span>
                            <span className="text-emerald-300">&nbsp;"Ravaka Tsiriniaina"</span>
                            <span className="text-neutral-500">,</span>
                          </div>
                          <div className="flex">
                            <span className="w-10 shrink-0 text-right pr-4 text-neutral-600 select-none">3</span>
                            <span className="pl-4 text-sky-300">"stack"</span>
                            <span className="text-neutral-500">: [</span>
                          </div>

                          {skillsLoading
                            ? skeletonArray.map((_, index) => (
                              <div key={index} className="flex items-center gap-3 pl-16 pr-6 py-1.5">
                                <div className="h-3.5 w-40 bg-white/10 rounded animate-pulse" />
                                <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full w-1/3 bg-white/10 animate-pulse" />
                                </div>
                              </div>
                            ))
                            : publicSkills.map((skill, index) => {
                              const color = skillColors[skill.name] || '#22d3ee';
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -12 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true, amount: 0.3 }}
                                  transition={{ duration: 0.4, delay: index * 0.06 }}
                                  className="flex items-center gap-3 flex-wrap sm:flex-nowrap group"
                                >
                                  <span className="w-10 shrink-0 text-right pr-4 text-neutral-600 select-none">{index + 4}</span>
                                  <span className="text-neutral-500 shrink-0">{'{ '}</span>
                                  <span className="text-sky-300 shrink-0">"name"</span>
                                  <span className="text-neutral-500 shrink-0">:</span>
                                  <span className="text-emerald-300 shrink-0">&nbsp;"{skill.name}"</span>
                                  <span className="text-neutral-500 shrink-0">,</span>
                                  <span className="text-sky-300 shrink-0">&nbsp;"level"</span>
                                  <span className="text-neutral-500 shrink-0">:</span>
                                  <span className="shrink-0 font-semibold" style={{ color }}>&nbsp;{skill.level}</span>
                                  <span className="text-neutral-500 shrink-0">{' },'}</span>

                                  <div className="flex-1 min-w-[80px] h-1.5 bg-white/5 rounded-full overflow-hidden ml-1">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${skill.level}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 + index * 0.05 }}
                                      className="h-full rounded-full"
                                      style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}66` }}
                                    />
                                  </div>
                                </motion.div>
                              );
                            })}

                          <div className="flex">
                            <span className="w-10 shrink-0 text-right pr-4 text-neutral-600 select-none">{publicSkills.length + 4}</span>
                            <span className="text-neutral-400">]</span>
                          </div>
                          <div className="flex">
                            <span className="w-10 shrink-0 text-right pr-4 text-neutral-600 select-none">{publicSkills.length + 5}</span>
                            <span className="text-neutral-400">{'}'}</span>
                            <span className="inline-block w-2 h-4 bg-cyan-300/80 ml-1 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </WindowFrame>
                </motion.div>
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
                >
                  <WindowFrame title="Services" breadcrumb="Accueil > Services" bodyClassName="p-6 sm:p-10">
                    <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">EXPERTISE</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-10">
                      Mes <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Services</span>
                    </h2>

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
                  </WindowFrame>
                </motion.div>
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
                >
                  <WindowFrame title="Projets" breadcrumb="Accueil > Projets" bodyClassName="p-6 sm:p-10">
                    <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">RÉALISATIONS</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-3">
                      Projets <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Populaires</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mb-10">
                      Découvrez quelques-uns de mes projets les plus réussis
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
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
                  </WindowFrame>
                </motion.div>
              </div>
            </section>

            {/* Section Experience */}
            <div id="experience-section">
              <Experience />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}