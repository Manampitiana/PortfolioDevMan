import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import axiosClient from "../../axios";
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'tools', label: 'Outils' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const inputClasses = "w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all";
const labelClasses = "text-sm text-neutral-400";

export default function SkillsForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // pour la route /admin/edit_skills/:id

  const [pageLoading, setPageLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    logo: null,
    category: "",
    level: 50,
    status: "visible",
  });
  const [existingLogo, setExistingLogo] = useState(null);

  // Pré-remplit le formulaire en mode édition
  useEffect(() => {
    if (id) {
      setPageLoading(true);
      axiosClient.get(`/skills/${id}`)
        .then(res => {
          const skill = res.data.skill;
          setForm({
            name: skill.name || "",
            logo: null,
            category: skill.category || "",
            level: skill.level || 50,
            status: Number(skill.is_active) === 1 ? "visible" : "hidden",
          });
          setExistingLogo(skill.logo || null);
        })
        .catch(err => {
          console.error('Erreur lors de la récupération de la compétence :', err);
          toast.error('Impossible de charger cette compétence.');
        })
        .finally(() => setPageLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('category', form.category);
      data.append('level', parseInt(form.level, 10));
      data.append('is_active', form.status === 'visible' ? 1 : 0);
      if (form.logo) data.append('logo', form.logo);

      const response = id
        ? await axiosClient.post(`/skills/${id}?_method=PUT`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await axiosClient.post('/skills', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || 'Compétence enregistrée avec succès !');
        navigate('/admin/skills');
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la compétence :', err);
      const message = err.response?.data?.message || 'Échec de l\'enregistrement de la compétence.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-6 flex items-start justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="bg-white/[0.03] border border-white/10 backdrop-blur-xl w-full max-w-2xl rounded-2xl p-5 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/skills" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Retour
          </Link>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-white">
            {id ? "Modifier la compétence" : "Ajouter une compétence"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClasses}>Nom de la compétence</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          {/* Logo */}
          <div>
            <label className={labelClasses}>Logo</label>
            <div className="mt-1 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 hover:bg-white/[0.07] transition-colors">
                <PhotoIcon className="w-5 h-5" />
                Choisir un logo
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              {(form.logo || existingLogo) && (
                <img
                  src={form.logo ? URL.createObjectURL(form.logo) : existingLogo}
                  alt="Aperçu du logo"
                  className="h-14 w-14 p-2 object-contain rounded-xl bg-white/[0.04] border border-white/10"
                />
              )}
            </div>
          </div>

          {/* Category & Status */}
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="category" className={labelClasses}>Catégorie</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="" className="bg-neutral-900">Choisir une catégorie</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-neutral-900">{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="status" className={labelClasses}>Statut</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="visible" className="bg-neutral-900">Visible</option>
                <option value="hidden" className="bg-neutral-900">Masqué</option>
              </select>
            </div>
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className={labelClasses}>Niveau : {form.level}%</label>
            <input
              id="level"
              type="range"
              name="level"
              min="0"
              max="100"
              value={form.level}
              onChange={handleChange}
              className="w-full mt-2 accent-cyan-500"
            />
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-1.5 rounded-full transition-all"
                style={{ width: `${form.level}%` }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
            <Link
              to="/admin/skills"
              className="px-5 py-2.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/[0.04] text-center transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />}
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}