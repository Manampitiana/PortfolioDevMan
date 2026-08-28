import { useEffect, useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import axiosClient from '../axios';
import toast from 'react-hot-toast';
import { useSettings } from '../contexts/SettingsContext';
import { Helmet } from 'react-helmet-async';
import WindowFrame from '../components/os/WindowFrame';
import { Facebook, Github, Linkedin, Youtube } from 'lucide-react';

export default function Contact() {
  const [aboutMe, setAboutMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      const response = await axiosClient.get('/fetch_about_me');
      setAboutMe(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post('/messages', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success(response.data.message || 'Message envoyé avec succès !');
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email',
      value: aboutMe?.email,
      link: `mailto:${aboutMe?.email}`
    },
    {
      icon: PhoneIcon,
      title: 'Téléphone',
      value: aboutMe?.phone,
      link: `tel:${aboutMe?.phone}`
    },
    {
      icon: MapPinIcon,
      title: 'Adresse',
      value: aboutMe?.location,
      link: '#'
    }
  ]

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/Manampitiana', color: '#e5e7eb' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/manampitiana-ravaka-tsiriniaina-5613b1317', color: '#0A66C2' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@ManampitianaTSIRINIAINA', color: '#FF0000' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/profile.php?id=100070143253960', color: '#1877F2' }
  ]

  return (
    <>
      <Helmet>
        <title>
          Contact | {settings?.site_name || "ManDev"} - Full Stack Web Developer
        </title>

        <meta
          name="description"
          content="Get in touch with ManDev for freelance projects, collaborations or web development services."
        />

        <link
          rel="canonical"
          href="https://portfolio-dev-man.vercel.app/contact"
        />
      </Helmet>
      <WindowFrame title="Contact" breadcrumb="Accueil > Contact" className="mt-2 mb-10">
        <div>
          {/* Hero Section */}
          <section className="relative pt-10 pb-16 px-4 sm:px-8 bg-neutral-950 border-b border-white/5 overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute top-0 -right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-6xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6">
                Contactez-<span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Moi</span>
              </h1>
              <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-12">
                Un projet ou une question ? Envoyez-moi un message et je vous répondrai dans les plus brefs délais.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-20 px-4 bg-gray-100 dark:bg-[var(--theme-color)]">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Contact Form */}
                <div className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-neutral-300 dark:border-white/10 hover:border-cyan-400/40 transition-all duration-300">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[var(--theme-color)] dark:text-white mb-4">Envoyer un Message</h2>
                    <p className="text-gray-600 dark:text-gray-300">Remplissez le formulaire ci-dessous et je vous répondrai rapidement.</p>
                  </div>

                  {isSubmitted && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-green-300">Message envoyé avec succès ! Je reviendrai vers vous très vite.</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-neutral-300 dark:border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="Votre nom"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-neutral-300 dark:border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="email@exemple.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-neutral-300 dark:border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Quel est l'objet de votre message ?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-neutral-300 dark:border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                        placeholder="Écrivez votre message ici..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-neutral-900 py-4 px-6 rounded-full font-semibold hover:bg-neutral-200 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                          Envoyer le Message
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-neutral-300 dark:border-white/10 hover:border-cyan-400/40 transition-all duration-300">
                    <h2 className="text-2xl font-bold text-[var(--theme-color)] dark:text-white mb-6">Coordonnées</h2>

                    <div className="space-y-6">
                      {contactInfo.map((info, index) => {
                        const IconComponent = info.icon;

                        return (
                          <div
                            key={index}
                            className="
        flex items-start
        p-3 sm:p-4
        bg-gray-200 dark:bg-gray-700/50
        rounded-lg
        hover:bg-gray-300 dark:hover:bg-gray-700/70
        transition-colors duration-300
      "
                          >
                            {/* Icon */}
                            <div
                              className="
          shrink-0
          w-11 h-11 sm:w-12 sm:h-12
          bg-gradient-to-r from-cyan-400 to-fuchsia-400
          rounded-lg
          flex items-center justify-center
          mr-3 sm:mr-4
        "
                            >
                              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-700 dark:text-white font-semibold mb-0.5">
                                {info.title}
                              </h3>

                              <a
                                href={info.link}
                                className="
            block
            text-gray-500 dark:text-gray-300
            hover:text-cyan-600 dark:hover:text-cyan-300
            transition-colors duration-300
            text-sm sm:text-base
            break-words
            overflow-wrap-anywhere
          "
                              >
                                {info.value}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-neutral-300 dark:border-white/10 hover:border-cyan-400/40 transition-all duration-300">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">Retrouvez-moi sur</h2>

                    <div className="grid grid-cols-2 gap-4">
                      {socialLinks.map((social, index) => {
                        const IconComponent = social.icon;
                        return (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-4 bg-gray-200 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-cyan-500/20 hover:text-gray-700 dark:hover:text-cyan-300 transition-all duration-300 hover:transform hover:-translate-y-1 border border-neutral-300 dark:border-white/10 font-medium"
                          >
                            <IconComponent className="w-5 h-5 shrink-0" style={{ color: social.color }} />
                            {social.name}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white mt-10 dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-neutral-300 dark:border-white/10">
                <h2 className="text-2xl font-bold text-[var(--theme-color)] dark:text-white mb-4">Disponibilité</h2>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Disponible pour de nouveaux projets</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Je réponds généralement à tous les messages dans les 24 heures.
                  Pour les demandes urgentes, n'hésitez pas à me contacter par téléphone.
                </p>
              </div>
            </div>
          </section>
        </div>
      </WindowFrame>
    </>
  )
}