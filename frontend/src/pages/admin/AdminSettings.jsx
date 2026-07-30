import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const inputClasses = "w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all";
const sectionLabelClasses = "text-xs font-bold uppercase tracking-wide text-neutral-500 mb-3";

export default function AdminSettings() {
  const [previews, setPreviews] = useState({ logo: null, favicon: null });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    site_name: '',
    tagline: '',
    logo: null,
    favicon: null,
    theme_color: '#06b6d4',
    meta_description: '',
    meta_keywords: '',
    contact_email: '',
    contact_phone: '',
    social_links: { facebook: '', linkedin: '', github: '' },
    maintenance_mode: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosClient.get('/settings');
        if (data) {
          setForm(prev => ({
            ...prev,
            ...data,
            social_links: data.social_links || { facebook: '', linkedin: '', github: '' },
            // Ny "logo"/"favicon" avy any amin'ny DB dia URL (chaîne), tehirizina toy izany
            // fa tsy File — atsahatra amin'ny handleSubmit ny fanavahana azy amin'ny File vaovao
            logo: data.logo,
            favicon: data.favicon,
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des paramètres :', error);
        toast.error('Impossible de charger les paramètres.');
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value }
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setForm(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      if (key === 'social_links') {
        formData.append(key, JSON.stringify(form[key]));
        return;
      }
      if (key === 'logo' || key === 'favicon') {
        // N'envoyer que si un nouveau fichier a été choisi — sinon la chaîne URL
        // existante casserait la validation "image" côté backend
        if (form[key] instanceof File) {
          formData.append(key, form[key]);
        }
        return;
      }
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    try {
      const response = await axiosClient.post('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(response.data.message || 'Paramètres mis à jour !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres :', error);
      toast.error(error.response?.data?.message || 'Échec de la mise à jour des paramètres.');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.header initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">Paramètres du site</h1>
          <p className="text-neutral-400">Configurez l'identité et les informations générales de votre site.</p>
        </motion.header>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-8 space-y-8"
        >
          {/* Logo & Favicon */}
          <div>
            <p className={sectionLabelClasses}>Logo & Favicon</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-neutral-300">Logo du site</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {previews.logo ? (
                      <img src={previews.logo} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : form.logo ? (
                      <img src={form.logo} alt="Logo actuel" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-neutral-600" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-neutral-300 hover:bg-white/[0.07] transition-colors">
                    Choisir un fichier
                    <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-neutral-300">Favicon</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {previews.favicon ? (
                      <img src={previews.favicon} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : form.favicon ? (
                      <img src={form.favicon} alt="Favicon actuel" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-5 h-5 text-neutral-600" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-neutral-300 hover:bg-white/[0.07] transition-colors">
                    Choisir un fichier
                    <input type="file" name="favicon" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* General Info */}
          <div>
            <p className={sectionLabelClasses}>Informations générales</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="site_name" className="sr-only">Nom du site</label>
                <input id="site_name" name="site_name" value={form.site_name || ''} onChange={handleChange} className={inputClasses} placeholder="Nom du site" />
              </div>
              <div>
                <label htmlFor="tagline" className="sr-only">Slogan</label>
                <input id="tagline" name="tagline" value={form.tagline || ''} onChange={handleChange} className={inputClasses} placeholder="Slogan" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 mt-4 bg-white/[0.02] rounded-xl border border-white/5">
              <label htmlFor="theme_color" className="text-neutral-300 font-medium text-sm">Couleur du thème :</label>
              <input id="theme_color" type="color" name="theme_color" value={form.theme_color || '#06b6d4'} onChange={handleChange} className="h-10 w-20 rounded cursor-pointer bg-transparent" />
            </div>

            <div className="mt-4">
              <label htmlFor="meta_description" className="sr-only">Méta-description</label>
              <textarea id="meta_description" name="meta_description" value={form.meta_description || ''} onChange={handleChange} className={`${inputClasses} h-24`} placeholder="Méta-description (pour le référencement SEO)" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className={sectionLabelClasses}>Contact</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="contact_email" value={form.contact_email || ''} onChange={handleChange} className={inputClasses} placeholder="Email de contact" />
              <input name="contact_phone" value={form.contact_phone || ''} onChange={handleChange} className={inputClasses} placeholder="Téléphone de contact" />
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-white/10 pt-6">
            <p className={sectionLabelClasses}>Réseaux sociaux</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="facebook" value={form.social_links.facebook || ''} onChange={handleSocialChange} className={inputClasses} placeholder="URL Facebook" />
              <input name="linkedin" value={form.social_links.linkedin || ''} onChange={handleSocialChange} className={inputClasses} placeholder="URL LinkedIn" />
              <input name="github" value={form.social_links.github || ''} onChange={handleSocialChange} className={inputClasses} placeholder="URL GitHub" />
            </div>
          </div>

          {/* Maintenance mode */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${form.maintenance_mode ? 'bg-amber-400/10 border-amber-400/20' : 'bg-white/[0.02] border-white/5'}`}>
            <label className="flex items-center gap-3 cursor-pointer flex-1">
              <div className="relative flex-shrink-0">
                <input type="checkbox" name="maintenance_mode" checked={!!form.maintenance_mode} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-amber-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </div>
              <span className="text-neutral-300 font-medium text-sm">Activer le mode maintenance</span>
            </label>
            {form.maintenance_mode && <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />}
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}