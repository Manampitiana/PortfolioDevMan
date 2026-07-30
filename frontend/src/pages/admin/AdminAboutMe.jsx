import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const inputClasses = "w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all";
const labelClasses = "block text-sm font-medium text-neutral-400 mb-1.5";

export default function AdminAboutMe() {
  const [pdp, setPdp] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    full_name: '',
    title: '',
    short_bio: '',
    description: '',
    email: '',
    phone: '',
    location: '',
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get('/aboutmes');
        if (data) {
          setForm({
            full_name: data.full_name || '',
            title: data.title || '',
            short_bio: data.short_bio || '',
            description: data.description || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            is_active: !!data.is_active,
          });
          if (data.pdp) setPreview(data.pdp);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du profil :', err);
        toast.error('Impossible de charger vos informations.');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdp(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('full_name', form.full_name);
    formData.append('title', form.title);
    formData.append('short_bio', form.short_bio);
    formData.append('description', form.description);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('location', form.location);
    formData.append('is_active', form.is_active ? 1 : 0);
    if (pdp) formData.append('pdp', pdp);

    try {
      const response = await axiosClient.post('/aboutmes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message || 'Profil mis à jour avec succès !');
    } catch (error) {
      if (error.response?.status === 422) {
        Object.values(error.response.data.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        console.error('Erreur lors de la mise à jour du profil :', error);
        toast.error('Une erreur est survenue.');
      }
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
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">Modifier le profil</h1>
          <p className="text-neutral-400">Gérez vos informations personnelles et votre biographie.</p>
        </motion.header>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl"
        >
          <div className="p-5 sm:p-8 space-y-8">

            {/* SECTION: Profile Picture */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-white/10">
              <div className="relative group flex-shrink-0">
                <div className="w-28 h-28 rounded-full bg-white/[0.04] flex items-center justify-center overflow-hidden border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/10">
                  {preview ? (
                    <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-500 text-4xl">?</span>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-all rounded-full text-[11px] text-white font-semibold text-center px-2">
                  CHANGER LA PHOTO
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium text-white">Photo de profil</h3>
                <p className="text-sm text-neutral-400">Mettez à jour votre avatar. Format carré JPG ou PNG recommandé.</p>
              </div>
            </div>

            {/* SECTION: Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="full_name" className={labelClasses}>Nom complet</label>
                <input id="full_name" name="full_name" value={form.full_name} onChange={handleInputChange} className={inputClasses} placeholder="Jean Dupont" required />
              </div>
              <div>
                <label htmlFor="title" className={labelClasses}>Titre professionnel</label>
                <input id="title" name="title" value={form.title} onChange={handleInputChange} className={inputClasses} placeholder="Développeur Fullstack" required />
              </div>
            </div>

            <div>
              <label htmlFor="short_bio" className={labelClasses}>Biographie courte</label>
              <textarea id="short_bio" name="short_bio" value={form.short_bio} rows="2" onChange={handleInputChange} className={inputClasses} placeholder="Une bio courte et accrocheuse..." />
            </div>

            <div>
              <label htmlFor="description" className={labelClasses}>Description détaillée</label>
              <textarea id="description" name="description" value={form.description} rows="5" onChange={handleInputChange} className={inputClasses} placeholder="Votre parcours en détail..." />
            </div>

            {/* SECTION: Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="email" className={labelClasses}>Email</label>
                <input id="email" name="email" type="email" value={form.email} className={inputClasses} placeholder="mail@example.com" onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>Téléphone</label>
                <input id="phone" name="phone" value={form.phone} className={inputClasses} placeholder="+261 3x xx xxx xx" onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="location" className={labelClasses}>Localisation</label>
                <input id="location" name="location" value={form.location} className={inputClasses} placeholder="Antananarivo" onChange={handleInputChange} />
              </div>
            </div>

            {/* SECTION: Visibility & Save */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-fuchsia-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </div>
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Visible publiquement</span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />}
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}