import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const TECHNOLOGIES = [
  'Laravel', 'React', 'Vue', 'Node.js', 'Tailwind CSS', 'Bootstrap',
  'MySQL', 'PostgreSQL', 'MongoDB', 'API REST', 'Livewire', 'PHP'
];

export default function ProjectForm() {
  const { id } = useParams(); // ID avy amin'ny URL
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
  const [loading, setLoading] = useState(true);

  // Fetch project data raha misy ID (Edit mode)
  useEffect(() => {
    if (id) {
      axiosClient.get(`/projects/${id}`)
        .then(res => {
          const data = res.data.project;

          setForm({
            title: data.title || '',
            short_description: data.short_description || '',
            description: data.description || '',
            start_date: data.start_date || '',
            end_date: data.end_date || '',
            cover_image: null,
            gallery: [],
            project_url: data.project_url || '',
            client_name: data.client_name || '',
            github_url: data.github_url || '',
            technologies: Array.isArray(data.technologies) ? data.technologies : [],
            status: data.status || 'draft',
            is_current: data.is_current || false,
            is_featured: data.is_featured || false,
          });

          setExistingCover(data.cover_image || null);
          setExistingGallery(
            Array.isArray(data.gallery)
              ? data.gallery
              : typeof data.gallery === 'string'
                ? JSON.parse(data.gallery)
                : []
          );
        })
        .catch(err => {
          console.error(err);
          toast.error('Failed to fetch project data.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    if (form.gallery && form.gallery.length > 0) {
      form.gallery.forEach((file, idx) => data.append(`gallery[${idx}]`, file));
    }
    if (form.technologies && form.technologies.length > 0) {
      form.technologies.forEach((tech, idx) => data.append(`technologies[${idx}]`, tech));
    }

    try {
      let response;
      if (id) {
        // Update
        response = await axiosClient.post(`/projects/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-HTTP-Method-Override': 'PUT'
          }
        });
      } else {
        // Add new
        response = await axiosClient.post('/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      console.log('Response:', response.data);
      toast.success(response.data.message || 'Project saved successfully!');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Full error:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        toast.error(err.response.data.message || 'Failed to save project.');
      } else {
        toast.error(err.message || 'Failed to save project.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]' />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 m-8">
      {/* Header */}
      <div className='flex items-center justify-between gap-4'>
        <Link to="/admin/projects" className="text-gray-400 hover:text-white">&larr; Back</Link>
        <h2 className="text-2xl font-bold text-white">{id ? "Edit Project" : "Add New Project"}</h2>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Client */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nom Client</label>
        <input
          type="text"
          name="client_name"
          value={form.client_name}
          onChange={e => setForm({ ...form, client_name: e.target.value })}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500"
         
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
        <textarea
          name="short_description"
          rows="2"
          value={form.short_description}
          onChange={handleChange}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-2" />
        </div>
      </div>

      {/* Current Project */}
      <div className="flex items-center gap-3 mb-5">
        <input type="checkbox" name="is_current" checked={form.is_current} onChange={handleChange} />
        <span className="text-gray-300">Current Project</span>
      </div>

      {/* Gallery Upload */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">Gallery Images</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setForm({ ...form, gallery: Array.from(e.target.files) })} className="w-full text-gray-300" />
        {/* Existing gallery */}
        {existingGallery.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {existingGallery.map((file, idx) => (
              <img key={idx} src={`http://localhost:8000/storage/${file}`} alt={`Gallery ${idx}`} className="h-16 w-16 object-cover rounded" />
            ))}
          </div>
        )}
        {/* New gallery */}
        {form.gallery.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {form.gallery.map((file, idx) => (
              <span key={idx} className="text-sm text-green-400">{file.name}</span>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700">
            <PhotoIcon className="w-5 h-5" />
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setForm({ ...form, cover_image: e.target.files[0] })} />
          </label>
          {form.cover_image ? (
            <span className="text-sm text-green-400">{form.cover_image.name}</span>
          ) : existingCover ? (
            <img src={`http://localhost:8000/storage/${existingCover}`} alt="Existing Cover" className="h-16 w-16 object-cover rounded" />
          ) : null}
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input type="url" name="project_url" value={form.project_url} onChange={handleChange} placeholder="Live project URL" className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3" />
        <input type="url" name="github_url" value={form.github_url} onChange={handleChange} placeholder="GitHub repository URL" className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3" />
      </div>

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

      {/* Options */}
      <div className="flex flex-wrap gap-6 items-center">
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
          Featured Project
        </label>
        <select name="status" value={form.status} onChange={handleChange} className="rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link to="/admin/projects" className="px-5 py-2 rounded-xl border border-slate-700 text-gray-300 hover:text-white">Cancel</Link>
        <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}
