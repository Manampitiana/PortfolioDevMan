import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhotoIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const TECHNOLOGIES = [
  'Laravel', 'React', 'Vue', 'Node.js', 'Tailwind CSS', 'Bootstrap',
  'MySQL', 'PostgreSQL', 'MongoDB', 'API REST', 'Livewire', 'PHP'
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Analyse sécurisée du JSON (technologies / gallery), pour gérer aussi bien un tableau
// déjà décodé côté API qu'une chaîne JSON brute
function safeParseArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

const inputClasses = "w-full rounded-xl bg-white/[0.04] border border-white/10 text-white px-4 py-3 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all";
const labelClasses = "block text-sm font-medium text-neutral-300 mb-2";

export default function ProjectForm({ id, initialData }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    short_description: '',
    description: '',
    start_date: '',
    end_date: '',
    cover_image: null,
    gallery: [],
    project_url: '',
    github_url: '',
    client_name: '',
    technologies: [],
    status: 'draft',
    is_current: false,
    is_featured: false,
  });

  const [existingCover, setExistingCover] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);
  const [removedGallery, setRemovedGallery] = useState([]);
  const [saving, setSaving] = useState(false);

  // Pré-remplit le formulaire à partir des données déjà chargées par ProjectFormPage
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        short_description: initialData.short_description || '',
        description: initialData.description || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        cover_image: null,
        gallery: [],
        project_url: initialData.project_url || '',
        client_name: initialData.client_name || '',
        github_url: initialData.github_url || '',
        technologies: safeParseArray(initialData.technologies),
        status: initialData.status || 'draft',
        is_current: !!initialData.is_current,
        is_featured: !!initialData.is_featured,
      });
      setExistingCover(initialData.cover_image || null);
      setExistingGallery(safeParseArray(initialData.gallery));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleTechnology = (tech) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const removeExistingGalleryImage = (img) => {
    setExistingGallery((prev) => prev.filter((g) => g !== img));
    setRemovedGallery((prev) => [...prev, img]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('title', form.title);
    data.append('short_description', form.short_description);
    data.append('description', form.description);
    data.append('start_date', form.start_date);
    data.append('end_date', form.end_date);
    data.append('project_url', form.project_url);
    data.append('github_url', form.github_url);
    data.append('client_name', form.client_name);
    data.append('status', form.status);
    data.append('is_current', form.is_current ? 1 : 0);
    data.append('is_featured', form.is_featured ? 1 : 0);

    if (form.cover_image) data.append('cover_image', form.cover_image);
    if (form.gallery.length > 0) {
      form.gallery.forEach((file, idx) => data.append(`gallery[${idx}]`, file));
    }
    if (removedGallery.length > 0) {
      removedGallery.forEach((img, idx) => data.append(`removed_gallery[${idx}]`, img));
    }
    if (form.technologies.length > 0) {
      form.technologies.forEach((tech, idx) => data.append(`technologies[${idx}]`, tech));
    }

    try {
      const response = id
        ? await axiosClient.post(`/projects/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data', 'X-HTTP-Method-Override': 'PUT' },
          })
        : await axiosClient.post('/projects', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      toast.success(response.data.message || 'Projet enregistré avec succès !');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du projet :', err);
      const message = err.response?.data?.message || err.message || 'Échec de l\'enregistrement du projet.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-4xl mx-auto bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pb-2">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors w-fit"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Retour
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            {id ? 'Modifier le projet' : 'Ajouter un projet'}
          </h1>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClasses}>Titre du projet</label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        {/* Client */}
        <div>
          <label htmlFor="client_name" className={labelClasses}>Nom du client</label>
          <input
            id="client_name"
            type="text"
            name="client_name"
            value={form.client_name}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="short_description" className={labelClasses}>Description courte</label>
          <textarea
            id="short_description"
            name="short_description"
            rows="2"
            value={form.short_description}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClasses}>Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor="start_date" className={labelClasses}>Date de début</label>
            <input
              id="start_date"
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="end_date" className={labelClasses}>Date de fin</label>
            <input
              id="end_date"
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              disabled={form.is_current}
              className={`${inputClasses} disabled:opacity-40 disabled:cursor-not-allowed`}
            />
          </div>
        </div>

        {/* Current Project */}
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="is_current"
            checked={form.is_current}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-cyan-500"
          />
          <span className="text-neutral-300 text-sm">Projet en cours</span>
        </label>

        {/* Gallery Upload */}
        <div>
          <label className={labelClasses}>Images de la galerie</label>
          <label className="flex items-center justify-center gap-2 w-full sm:w-fit cursor-pointer px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 hover:bg-white/[0.07] transition-colors">
            <PhotoIcon className="w-5 h-5" />
            Choisir des images
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setForm({ ...form, gallery: Array.from(e.target.files) })}
            />
          </label>

          {existingGallery.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {existingGallery.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Galerie ${idx + 1}`} className="h-16 w-16 object-cover rounded-lg border border-white/10" />
                  <button
                    type="button"
                    onClick={() => removeExistingGalleryImage(img)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Retirer cette image"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {form.gallery.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {form.gallery.map((file, idx) => (
                <span key={idx} className="text-xs text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-full truncate max-w-[160px]">
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label className={labelClasses}>Image de couverture</label>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 hover:bg-white/[0.07] transition-colors">
              <PhotoIcon className="w-5 h-5" />
              Choisir une image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setForm({ ...form, cover_image: e.target.files[0] })}
              />
            </label>
            {form.cover_image ? (
              <span className="text-xs text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-full truncate max-w-[160px]">
                {form.cover_image.name}
              </span>
            ) : existingCover ? (
              <img src={existingCover} alt="Couverture actuelle" className="h-14 w-14 object-cover rounded-lg border border-white/10" />
            ) : null}
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor="project_url" className={labelClasses}>URL du site en ligne</label>
            <input
              id="project_url"
              type="url"
              name="project_url"
              value={form.project_url}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="github_url" className={labelClasses}>URL du dépôt GitHub</label>
            <input
              id="github_url"
              type="url"
              name="github_url"
              value={form.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className={inputClasses}
            />
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className={labelClasses}>Technologies</label>
          <div className="flex flex-wrap gap-2">
            {TECHNOLOGIES.map((tech) => {
              const active = form.technologies.includes(tech);
              return (
                <button
                  type="button"
                  key={tech}
                  onClick={() => toggleTechnology(tech)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white border-transparent shadow-sm shadow-fuchsia-500/20'
                      : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-cyan-400/40'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-6 items-center pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-fuchsia-500"
            />
            <span className="text-neutral-300 text-sm">Projet mis en avant</span>
          </label>

          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-neutral-300 text-sm">Statut</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-xl bg-white/[0.04] border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              <option value="draft" className="bg-neutral-900">Brouillon</option>
              <option value="published" className="bg-neutral-900">Publié</option>
              <option value="archived" className="bg-neutral-900">Archivé</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
          <Link
            to="/admin/projects"
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
            {saving ? 'Enregistrement...' : 'Enregistrer le projet'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}