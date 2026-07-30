import { AcademicCapIcon, BriefcaseIcon, CalendarIcon, EnvelopeIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import { motion } from 'framer-motion';
import Experience from './Experience';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from "react-countup";
import { Helmet } from 'react-helmet-async';

// Reveal réutilisable, cohérent avec le reste du site
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  const [aboutMe, setAboutMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAboutMe();
    axiosClient.get("/stats").then((res) => setStats(res.data)).catch(() => { });
  }, []);

  const fetchAboutMe = async () => {
    try {
      const response = await axiosClient.get('/fetch_about_me');
      setAboutMe(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  // Valeurs par défaut tant que /stats n'a pas répondu — évite l'écran vide
  const items = [
    { label: "Projets", value: stats?.projects ?? 0, suffix: "+" },
    { label: "Années d'expérience", value: stats?.experience ?? 0, suffix: "+" },
    { label: "Clients", value: stats?.clients ?? 0, suffix: "+" },
    { label: "Satisfaction", value: stats?.satisfaction ?? 0, suffix: "%" },
  ];

  const infoRows = [
    { icon: UserIcon, value: aboutMe?.full_name },
    { icon: BriefcaseIcon, value: aboutMe?.title },
    { icon: MapPinIcon, value: aboutMe?.location || 'Madagascar' },
    { icon: EnvelopeIcon, value: aboutMe?.email, href: `mailto:${aboutMe?.email}` },
    { icon: Phone, value: aboutMe?.phone, href: `tel:${aboutMe?.phone}` },
  ];

  const education = [
    {
      degree: 'Formation en Développement Web',
      school: 'Hopes Formation Andavamamba',
      year: '2024',
      description: 'Formation spécialisée en développement web couvrant le frontend et le backend, incluant HTML, CSS, JavaScript, React et les bases du développement backend avec Laravel.'
    },
    {
      degree: 'Baccalauréat Technique',
      school: 'LTP Mantasoa',
      year: '2019',
      description: "Formation technique axée sur la pratique, incluant l'ouvrage métallique (découpe, soudure, assemblage) ainsi que les bases de la logique et de la technologie."
    }
  ]

  return (
    <>
      <Helmet>
        <title>About | ManDev - Full Stack Web Developer</title>

        <meta
          name="description"
          content="Learn more about ManDev, a Full Stack Web Developer from Madagascar specializing in React, Laravel, Tailwind CSS and modern web applications."
        />

        <link
          rel="canonical"
          href="https://portfolio-dev-man.vercel.app/about"
        />
      </Helmet>

      <div className="min-h-screen bg-neutral-950">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 px-4 bg-neutral-950 border-b border-white/5 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-0 -right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6">
                À propos de <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Moi</span>
              </h1>
              <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                {aboutMe?.title || "Développeur Full Stack"} - {aboutMe?.short_bio}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-center lg:text-left"
              >
                {/* PDP — glass frame */}
                <div className="relative w-64 mx-auto lg:mx-0 mb-8">
                  <div className="relative aspect-[4/5] rounded-[28px] bg-white/[0.04] backdrop-blur-2xl border border-white/10 overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-400 to-fuchsia-400 blur-3xl opacity-30" />
                    {aboutMe?.pdp ? (
                      <img src={aboutMe.pdp} alt="Photo de profil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 italic text-sm">
                        Aucune photo
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 max-w-xs mx-auto lg:mx-0">
                  {infoRows.filter(r => r.value).map((row, i) => {
                    const Icon = row.icon;
                    const Wrapper = row.href ? 'a' : 'div';
                    return (
                      <Wrapper
                        key={i}
                        {...(row.href ? { href: row.href } : {})}
                        className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-300 hover:border-cyan-400/30 hover:text-white transition-colors"
                      >
                        <Icon className="w-4 h-4 text-cyan-300 shrink-0" />
                        <span className="truncate">{row.value}</span>
                      </Wrapper>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 rounded-2xl">
                  <h3 className="font-display text-2xl font-semibold text-white mb-4">Mon Histoire</h3>
                  <div className="text-neutral-400 leading-relaxed whitespace-pre-line">
                    {aboutMe?.description || "Aucune description disponible pour le moment..."}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Expérience */}
        <Experience />

        {/* Section Éducation */}
        <section className="relative py-20 px-4 bg-neutral-950 border-t border-white/5 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/[0.06] rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="text-center mb-14"
            >
              <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">FORMATION</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
                Mon <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Parcours Académique</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 rounded-2xl hover:border-cyan-400/25 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400/15 to-fuchsia-400/15 border border-white/10 flex items-center justify-center">
                      <AcademicCapIcon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white mb-1">{edu.degree}</h3>
                      <p className="text-cyan-300 text-sm font-medium">{edu.school}</p>
                      <p className="text-neutral-500 text-xs font-mono mt-1">{edu.year}</p>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed">{edu.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="relative py-20 px-4 bg-neutral-950 border-t border-white/5">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="text-center bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 rounded-2xl hover:border-cyan-400/25 transition-colors duration-300"
              >
                <div className="font-display text-3xl sm:text-4xl font-semibold mb-2 bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                  <CountUp end={item.value} duration={2} />
                  {item.suffix || ""}
                </div>
                <p className="text-neutral-500 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

    </>
  )
}