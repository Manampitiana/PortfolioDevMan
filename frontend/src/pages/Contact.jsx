import { useEffect, useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import axiosClient from '../axios';
import toast from 'react-hot-toast';

export default function Contact() {
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
    { name: 'GitHub', url: '#' },
    { name: 'LinkedIn', url: '#' },
    { name: 'Twitter', url: '#' },
    { name: 'Facebook', url: '#' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contactez-<span className="text-cyan-400">Moi</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Un projet ou une question ? Envoyez-moi un message et je vous répondrai dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-100 dark:bg-[var(--theme-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-gray-600 hover:border-cyan-500/50 transition-all duration-300">
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
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
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
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                    placeholder="Écrivez votre message ici..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
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
              <div className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-gray-600 hover:border-cyan-500/50 transition-all duration-300">
                <h2 className="text-2xl font-bold text-[var(--theme-color)] dark:text-white mb-6">Coordonnées</h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon
                    return (
                      <div key={index} className="flex items-center p-4 bg-gray-200 dark:bg-gray-700/50 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700/70 transition-colors duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-gray-700 dark:text-white font-semibold">{info.title}</h3>
                          <a 
                            href={info.link} 
                            className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300"
                          >
                            {info.value}
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-gray-600 hover:border-cyan-500/50 transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">Retrouvez-moi sur</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="p-4 bg-gray-200 dark:bg-gray-700/50 rounded-lg text-center text-gray-700 dark:text-gray-300 hover:bg-cyan-500/20 hover:text-gray-700 dark:hover:text-cyan-300 transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-600 font-medium"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white mt-10 dark:bg-[var(--theme-color)] backdrop-blur-sm p-8 rounded-2xl border border-gray-600">
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
  )
}