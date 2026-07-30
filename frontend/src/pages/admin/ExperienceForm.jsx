import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const TECHNOLOGIES = [
    'Laravel', 'React', 'Vue', 'Node.js', 'Tailwind CSS', 'Bootstrap',
    'MySQL', 'PostgreSQL', 'MongoDB', 'API REST', 'Livewire', 'PHP'
];

const TYPE_SUGGESTIONS = ['Sur site', 'À distance', 'Hybride'];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const inputClasses = "w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all";
const labelClasses = "text-sm text-neutral-400";

export default function ExperienceForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID avy amin'ny URL

    const [pageLoading, setPageLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        is_current: false,
        type: '',
        description: '',
        technologies: [],
        is_active: true,
    });

    useEffect(() => {
        if (!id) return;

        const fetchExperience = async () => {
            setPageLoading(true);
            try {
                const response = await axiosClient.get(`/experiences/${id}`);
                let expData = response.data.experience;

                if (!expData) throw new Error('Expérience introuvable.');

                if (expData.technologies && typeof expData.technologies === 'string') {
                    expData.technologies = JSON.parse(expData.technologies);
                }

                setForm({
                    title: expData.title || '',
                    company: expData.company || '',
                    start_date: expData.start_date || '',
                    end_date: expData.end_date || '',
                    is_current: !!expData.is_current,
                    type: expData.type || '',
                    description: expData.description || '',
                    technologies: expData.technologies || [],
                    is_active: expData.is_active ?? true,
                });
            } catch (err) {
                console.error('Erreur lors de la récupération de l\'expérience :', err);
                toast.error(err.response?.data?.message || err.message || 'Impossible de charger cette expérience.');
                navigate('/admin/experiences');
            } finally {
                setPageLoading(false);
            }
        };

        fetchExperience();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'is_current' && checked ? { end_date: '' } : {}),
        }));
    };

    const toggleTechnology = (tech) => {
        setForm((prev) => ({
            ...prev,
            technologies: prev.technologies.includes(tech)
                ? prev.technologies.filter((t) => t !== tech)
                : [...prev.technologies, tech],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = id
                ? await axiosClient.put(`/experiences/${id}`, form)
                : await axiosClient.post('/experiences', form);

            toast.success(response.data.message || 'Expérience enregistrée avec succès !');
            navigate('/admin/experiences');
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement de l\'expérience :', err);
            toast.error(err.response?.data?.message || err.message || 'Échec de l\'enregistrement de l\'expérience.');
        } finally {
            setSaving(false);
        }
    };

    const isEdit = !!id;

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center h-[80vh] bg-neutral-950">
                <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 p-4 sm:p-6 flex items-start justify-center">
            <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white/[0.03] border border-white/10 backdrop-blur-xl w-full max-w-3xl rounded-2xl p-5 sm:p-8 space-y-5"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Link to="/admin/experiences" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Retour
                    </Link>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-white">
                        {isEdit ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
                    </h2>
                </div>

                {/* Title & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="title" className={labelClasses}>Poste occupé</label>
                        <input
                            id="title"
                            name="title"
                            placeholder="ex. Développeur Full-Stack"
                            value={form.title}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="company" className={labelClasses}>Entreprise</label>
                        <input
                            id="company"
                            name="company"
                            placeholder="ex. ManDev"
                            value={form.company}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {!form.is_current && (
                        <div>
                            <label htmlFor="end_date" className={labelClasses}>Date de fin</label>
                            <input
                                id="end_date"
                                type="date"
                                name="end_date"
                                value={form.end_date}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                    )}
                </div>

                {/* Current checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                    <input
                        type="checkbox"
                        name="is_current"
                        checked={form.is_current}
                        onChange={handleChange}
                        className="w-4 h-4 rounded accent-cyan-500"
                    />
                    <span className="text-neutral-300 text-sm">Poste actuel</span>
                </label>

                {/* Type */}
                <div>
                    <label htmlFor="type" className={labelClasses}>Type</label>
                    <input
                        id="type"
                        name="type"
                        list="type-suggestions"
                        placeholder="ex. Sur site, À distance, Hybride"
                        value={form.type}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                    <datalist id="type-suggestions">
                        {TYPE_SUGGESTIONS.map((t) => <option key={t} value={t} />)}
                    </datalist>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className={labelClasses}>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Missions, responsabilités, réalisations..."
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className={inputClasses}
                    />
                </div>

                {/* Technologies */}
                <div>
                    <label className={`${labelClasses} block mb-3`}>Technologies</label>
                    <div className="flex flex-wrap gap-2">
                        {TECHNOLOGIES.map((tech) => {
                            const active = form.technologies.includes(tech);
                            return (
                                <button
                                    type="button"
                                    key={tech}
                                    onClick={() => toggleTechnology(tech)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active
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

                {/* Active Status */}
                <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 rounded accent-fuchsia-500"
                    />
                    <span className="text-neutral-300 text-sm">Visible sur le portfolio</span>
                </label>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
                    <Link
                        to="/admin/experiences"
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
                        {saving ? (isEdit ? 'Mise à jour...' : 'Enregistrement...') : (isEdit ? 'Mettre à jour' : 'Enregistrer')}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}