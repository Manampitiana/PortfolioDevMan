import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const TECHNOLOGIES = [
    'Laravel', 'React', 'Vue', 'Node.js', 'Tailwind CSS', 'Bootstrap',
    'MySQL', 'PostgreSQL', 'MongoDB', 'API REST', 'Livewire', 'PHP'
];

export default function ExperienceForm({ experience }) {
    const navigate = useNavigate();
    const { id } = useParams(); // ID avy amin'ny URL

    useEffect(() => {
        if (!id) return;

        const fetchExperience = async () => {
            try {
                const response = await axiosClient.get(`/experiences/${id}`);
                let expData = response.data.experience;

                if (!expData) throw new Error('Experience not found');

                if (expData.technologies && typeof expData.technologies === 'string') {
                    expData.technologies = JSON.parse(expData.technologies);
                }

                setForm({
                    title: expData.title || '',
                    company: expData.company || '',
                    start_date: expData.start_date || '',
                    end_date: expData.end_date || '',
                    is_current: expData.is_current || false,
                    type: expData.type || '',
                    description: expData.description || '',
                    technologies: expData.technologies || [],
                    is_active: expData.is_active ?? true,
                });
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.message || err.message || 'Failed to fetch experience.');
                navigate('/admin/experiences');
            }
        };

        fetchExperience();
    }, [id]);

    const [form, setForm] = useState({
        title: experience?.title || '',
        company: experience?.company || '',
        start_date: experience?.start_date || '',
        end_date: experience?.end_date || '',
        is_current: experience?.is_current || false,
        type: experience?.type || '',
        description: experience?.description || '',
        technologies: experience?.technologies || [],
        is_active: experience?.is_active ?? true,
    });

    const [loading, setLoading] = useState(false);

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
        setLoading(true);
    
        try {
            let response;
            if (id) { // Raha edit mode (id ao amin'ny URL)
                response = await axiosClient.put(`/experiences/${id}`, form);
            } else { // Raha add mode
                response = await axiosClient.post('/experiences', form);
            }
    
            toast.success(response.data.message || 'Experience saved successfully!');
            navigate('/admin/experiences');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || 'Failed to save experience.');
        } finally {
            setLoading(false);
        }
    };

    const isEdit = !!id; // true raha edit mode

    return (
        <div className="flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-xl w-full max-w-4xl space-y-4"
            >
                <h2 className="text-xl font-bold text-white">
                    {isEdit ? 'Edit Experience' : 'Add Experience'}
                </h2>

                {/* Title */}
                <input
                    name="title"
                    placeholder="Role / Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />

                {/* Company */}
                <input
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />

                {/* Dates */}
                <div className="flex gap-2">
                    <input
                        type="date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    {!form.is_current && (
                        <input
                            type="date"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                    )}
                </div>

                {/* Current checkbox */}
                <label className="flex items-center gap-2 text-gray-300">
                    <input
                        type="checkbox"
                        name="is_current"
                        checked={form.is_current}
                        onChange={handleChange}
                    />
                    Current Position
                </label>

                {/* Type */}
                <input
                    name="type"
                    placeholder="Type (Remote / Onsite)"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                />

                {/* Description */}
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    rows={4}
                />

                {/* Technologies */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Technologies</label>
                    <div className="flex flex-wrap gap-2">
                        {TECHNOLOGIES.map((tech) => (
                            <button
                                type="button"
                                key={tech}
                                onClick={() => toggleTechnology(tech)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                                ${form.technologies.includes(tech)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-slate-800 text-gray-300 border-slate-700 hover:border-blue-500'
                                    }`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Status */}
                <label className="flex items-center gap-2 text-gray-300">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                    />
                    Active Status
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 rounded text-white"
                >
                    {loading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update' : 'Save')}
                </button>
            </form>
        </div>
    );
}
