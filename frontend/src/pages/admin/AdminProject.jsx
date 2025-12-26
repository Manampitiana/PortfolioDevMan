import {
    EyeIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminProject() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetchProjects global ao amin'ny component
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/projects');
            setProjects(response.data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects(); // antso voalohany rehefa mount
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        try {
            const response = await axiosClient.delete(`/projects/${id}`);
            toast.success(response.data.message || 'Project deleted successfully!');
            fetchProjects(); // fetchProjects antso aorian'ny delete
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || 'Failed to delete project.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Projects Management</h2>
                <button
                    onClick={() => navigate('/admin/add_projects')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Project
                </button>
            </div>
            <ProjectTable projects={projects} loading={loading} handleDelete={handleDelete} />
        </div>
    );
}

function ProjectTable({ projects, loading, handleDelete }) {
    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]' />
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl overflow-x-auto scrollbar-thin-custom">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 truncate">
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Title</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Slug</th>
                                {/* <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Short Description</th> */}
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Description</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Start Date</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">End Date</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Current</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Cover</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Gallery</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Technologies</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Status</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Live URL</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">GitHub URL</th>
                                {/* <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Created At</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-medium truncate">Updated At</th> */}
                                <th className="text-right py-3 px-4 text-gray-300 font-medium truncate">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="15" className="py-3 px-4 text-center text-gray-300">No projects found</td>
                                </tr>
                            )}
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 truncate">
                                    <td className="py-4 px-4 text-white">{project.title}</td>
                                    <td className="py-4 px-4 text-gray-300">{project.slug}</td>
                                    {/* <td className="py-4 px-4 text-gray-300 truncate max-w-xs">{project.short_description}</td> */}
                                    <td className="py-4 px-4 text-gray-300 truncate max-w-xs">{project.description}</td>
                                    <td className="py-4 px-4 text-gray-300">{project.start_date}</td>
                                    <td className="py-4 px-4 text-gray-300">{project.end_date}</td>
                                    <td className="py-4 px-4 text-gray-300">{project.is_current ? 'Yes' : 'No'}</td>
                                    <td className="py-4 px-4">
                                        {project.cover_image && (
                                            <img src={`http://localhost:8000/storage/${project.cover_image}`} alt="cover" className="w-12 h-12 rounded" />
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {project.gallery && JSON.parse(project.gallery).map((img, idx) => (
                                            <img key={idx} src={`http://localhost:8000/storage/${img}`} alt={`gallery-${idx}`} className="w-8 h-8 rounded mr-1 inline-block" />
                                        ))}
                                    </td>
                                    <td className="py-4 px-4 truncate max-w-xs">{project.technologies && JSON.parse(project.technologies).join(', ')}</td>
                                    <td className="py-4 px-4">{project.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="py-4 px-4">
                                        {project.project_url && (
                                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Live</a>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {project.github_url && (
                                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">GitHub</a>
                                        )}
                                    </td>
                                    {/* <td className="py-4 px-4 text-gray-300">{new Date(project.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 text-gray-300">{new Date(project.updated_at).toLocaleDateString()}</td> */}
                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <Link to={`/admin/edit_projects/${project.id}`} className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors">
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(project.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
