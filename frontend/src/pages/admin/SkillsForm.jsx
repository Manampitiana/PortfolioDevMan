import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosClient from "../../axios";
import toast from 'react-hot-toast';
import {Loader} from 'lucide-react'

export default function SkillsForm({ initialData = null }) {
    const navigate = useNavigate();
    const { id } = useParams(); // ho an'ny edit route /admin/edit_skills/:id
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        logo: null,
        category: "",
        level: 50,
        status: "visible",
    });
    const [existingLogo, setExistingLogo] = useState(null); // ho preview logo efa misy

    // Prefill form rehefa Edit
    useEffect(() => {
        if(initialData) {
            setForm({
                name: initialData.name || "",
                logo: null,
                category: initialData.category || "",
                level: initialData.level || 50,
                status: initialData.is_active === 1 ? "visible" : "hidden",
            });
            setExistingLogo(initialData.logo || null);
        } else if(id) {
            axiosClient.get(`/skills/${id}`)
                .then(res => {
                    const skill = res.data.skill;
                    setForm({
                        name: skill.name || "",
                        logo: null,
                        category: skill.category || "",
                        level: skill.level || 50,
                        status: skill.is_active === 1 ? "visible" : "hidden",
                    });
                    setExistingLogo(skill.logo || null);
                })
                .catch(err => console.error(err));
        }
    }, [initialData, id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const data = new FormData();
            data.append('name', form.name);
            data.append('category', form.category);
            data.append('level', parseInt(form.level, 10)); // ⚡ integer
            data.append('is_active', form.status === 'visible' ? 1 : 0); // ⚡ boolean
            if (form.logo) data.append('logo', form.logo);
    
            let response;
            if(initialData || id) {
                response = await axiosClient.post(`/skills/${id}?_method=PUT`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axiosClient.post('/skills', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
    
            if(response.status === 200 || response.status === 201) {
                toast.success(response.data.message || 'Skill saved successfully!');
                navigate('/admin/skills');
            }
    
        } catch(err) {
            console.error(err);
            const message = err.response?.data?.message || 'Failed to save skill.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if(loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]'/>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {initialData || id ? "Edit Skill" : "Add Skill"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="text-sm text-gray-400">Skill Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-400">Logo</label>
                        <input
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full mt-1 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none file:bg-gray-700 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer file:border-0"
                        />
                        {/* Preview */}
                        {form.logo ? (
                            <img
                                src={URL.createObjectURL(form.logo)}
                                alt="Preview"
                                className="mt-3 h-16 w-16 p-2 object-contain rounded bg-gray-900"
                            />
                        ) : existingLogo ? (
                            <img
                                src={`http://localhost:8000/storage/${existingLogo}`}
                                alt="Current Logo"
                                className="mt-3 h-16 w-16 p-2 object-contain rounded bg-gray-900"
                            />
                        ) : null}
                    </div>

                    {/* Category & Status */}
                    <div className="w-full flex items-center gap-4">
                        <div className="w-full">
                            <label className="text-sm text-gray-400">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select category</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="tools">Tools</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="text-sm text-gray-400">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>
                    </div>

                    {/* Level */}
                    <div>
                        <label className="text-sm text-gray-400">Level: {form.level}%</label>
                        <input
                            type="range"
                            name="level"
                            min="0"
                            max="100"
                            value={form.level}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    );
}
