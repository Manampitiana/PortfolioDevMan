import { AcademicCapIcon, BriefcaseIcon, CalendarIcon, EnvelopeIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import Experience from './Experience';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from "react-countup";

export default function About() {
  const [aboutMe, setAboutMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutMe();
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

  const [stats, setStats] = useState(null);

    useEffect(() => {
      axiosClient.get("/stats").then((res) => {
        setStats(res.data);
      });
    }, []);

    if (!stats) return null;

    const items = [
      {
        label: "Projets",
        value: stats.projects,
        suffix: "+",
        color: "text-blue-600",
      },
      {
        label: "Années d'expérience",
        value: stats.experience,
        suffix: "+",
        color: "text-cyan-600",
      },
      {
        label: "Clients",
        value: stats.clients,
        suffix: "+",
        color: "text-green-600",
      },
      {
        label: "Satisfaction",
        value: stats.satisfaction,
        suffix: "%",
        color: "text-yellow-600",
      },
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
      description: 'Formation technique axée sur la pratique, incluant l’ouvrage métallique (découpe, soudure, assemblage) ainsi que les bases de la logique et de la technologie.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              À propos de <span className="text-cyan-400">Moi</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {aboutMe?.title || "Développeur Full Stack"} - {aboutMe?.short_bio}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="w-64 h-64 mx-auto lg:mx-0 mb-8 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-1">
                <div className="w-full h-full rounded-2xl bg-[var(--theme-color)] overflow-hidden">
                  {aboutMe?.pdp ? (
                    <img src={aboutMe.pdp} alt="Photo de profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center h-full justify-center text-gray-500 italic text-sm">Aucune Photo</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start text-gray-300">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-400" />
                  <span>{aboutMe?.full_name}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-300">
                  <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-400" />
                  <span>{aboutMe?.title}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-300">
                  <MapPinIcon className="w-5 h-5 mr-2 text-blue-400" />
                  <span>{aboutMe?.location || 'Madagascar'}</span>
                </div>
                <a
                  href={`mailto:${aboutMe?.email}`}
                  className="flex items-center justify-center lg:justify-start text-gray-300 hover:text-blue-400 transition-colors underline"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-400" />
                  <span>{aboutMe?.email}</span>
                </a>
                <a
                  href={`tel:${aboutMe?.phone}`}
                  className="flex items-center justify-center lg:justify-start text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2 text-blue-400" />
                  <span>{aboutMe?.phone}</span>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-semibold text-[var(--theme-color)] dark:text-white mb-4">Mon Histoire</h3>
                <div className="text-[var(--theme-color)] dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {aboutMe?.description || "Aucune description disponible pour le moment..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Expérience */}
      <Experience />

      {/* Section Éducation */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-[var(--theme-color)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[var(--theme-color)] dark:text-gray-300 mb-16">
            Mon <span className="text-blue-600">Parcours Académique</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <div key={index} className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-xl border border-gray-600 hover:border-cyan-400/60 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:-translate-y-1">
                <div className="flex items-start mb-4">
                  <AcademicCapIcon className="w-10 h-10 text-blue-600 dark:text-cyan-400 mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--theme-color)] dark:text-white mb-2">{edu.degree}</h3>
                    <p className="text-blue-600 dark:text-cyan-400 font-medium mb-2">{edu.school}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{edu.year}</p>
                  </div>

                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-200">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-[var(--theme-color)]">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <div
            key={i}
            className="text-center bg-white dark:bg-[var(--theme-color)] 
                       p-6 rounded-xl border border-gray-200 
                       dark:border-gray-700 shadow-lg hover:shadow-xl transition"
          >
            <div className={`text-4xl font-bold mb-2 ${item.color}`}>
              <CountUp end={item.value} duration={2} />
              {item.suffix || ""}
            </div>

            <p className="text-gray-700 dark:text-gray-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
    </div>
  )
}