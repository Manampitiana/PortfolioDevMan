import { useState, useEffect } from 'react';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [previews, setPreviews] = useState({ logo: null, favicon: null });
  const [form, setForm] = useState({
    site_name: '',
    tagline: '',
    logo: null,
    favicon: null,
    theme_color: '#2563eb',
    meta_description: '',
    meta_keywords: '',
    contact_email: '',
    contact_phone: '',
    social_links: { facebook: '', linkedin: '', github: '' },
    maintenance_mode: false,
  });

  // Fakana ny angona rehefa misokatra ny pejy
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosClient.get('/settings');
        if (data) {
          setForm({
            ...data,
            social_links: data.social_links || { facebook: '', linkedin: '', github: '' },
            // Avelao ho ao ny anaran'ny sary (string) avy any amin'ny DB
            logo: data.logo, 
            favicon: data.favicon
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
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

  // Ao anatin'ny component AdminSettings

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      // 1. Tehirizina ao amin'ny form state ilay file ho an'ny upload
      setForm(prev => ({ ...prev, [name]: file }));

      // 2. Mamorona preview URL ho an'ny fampisehoana azy
      setPreviews(prev => ({
        ...prev,
        [name]: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach(key => {
      if (key === 'social_links') {
        formData.append(key, JSON.stringify(form[key]));
      } else if (form[key] !== null) { // Rehefa misy sary vao alefa
        formData.append(key, form[key]);
      }
    });

    try {
      const response = await axiosClient.post('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(response.data.message || 'Settings updated!');
      // Tsy fafana ny form fa avela eo ny data vao novaina
    } catch (error) {
      console.error(error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl space-y-6 mx-auto bg-gray-800 rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-white mb-4">Site Settings</h1>

      {/* Logo & Favicon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
        {/* SITE LOGO */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-300">Site Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-gray-800 border border-gray-600 flex items-center justify-center overflow-hidden">
              {previews.logo ? (
                <img src={previews.logo} alt="Preview" className="w-full h-full object-cover" />
              ) : form.logo ? (
                <img src={`http://localhost:8000/storage/${form.logo}`} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-[10px]">No Logo</span>
              )}
            </div>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>

        {/* FAVICON */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-300">Favicon</label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-gray-800 border border-gray-600 flex items-center justify-center overflow-hidden">
              {previews.favicon ? (
                <img src={previews.favicon} alt="Preview" className="w-full h-full object-cover" />
              ) : form.favicon ? (
                <img src={`http://localhost:8000/storage/${form.favicon}`} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-[8px]">No Icon</span>
              )}
            </div>
            <input
              type="file"
              name="favicon"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* General Info */}
      <div className="space-y-4">
        <input name="site_name" value={form.site_name || ''} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none" placeholder="Site Name" />
        <input name="tagline" value={form.tagline || ''} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none" placeholder="Tagline" />
      </div>

      <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">0f021d
        <label className="text-gray-300 font-medium">Theme Color:</label>
        <input type="color" name="theme_color" value={form.theme_color || '#2563eb'} onChange={handleChange} className="h-10 w-20 rounded cursor-pointer bg-transparent" />
      </div>

      <textarea name="meta_description" value={form.meta_description || ''} onChange={handleChange} className="w-full p-3 h-24 rounded-lg bg-gray-700 text-white border border-gray-600 outline-none" placeholder="Meta Description" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="contact_email" value={form.contact_email || ''} onChange={handleChange} className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 outline-none" placeholder="Contact Email" />
        <input name="contact_phone" value={form.contact_phone || ''} onChange={handleChange} className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 outline-none" placeholder="Contact Phone" />
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-700 pt-6">
        <input name="facebook" value={form.social_links.facebook || ''} onChange={handleSocialChange} className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 outline-none" placeholder="Facebook URL" />
        <input name="linkedin" value={form.social_links.linkedin || ''} onChange={handleSocialChange} className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 outline-none" placeholder="LinkedIn URL" />
        <input name="github" value={form.social_links.github || ''} onChange={handleSocialChange} className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 outline-none" placeholder="GitHub URL" />
      </div>

      <div className="flex items-center gap-3 p-2">
        <input type="checkbox" name="maintenance_mode" checked={!!form.maintenance_mode} onChange={handleChange} className="w-5 h-5 rounded text-blue-600" />
        <span className="text-gray-300 font-medium">Activate Maintenance Mode</span>
      </div>

      <button type="submit" className="w-full md:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors shadow-lg">
        Save All Changes
      </button>
    </form>
  );
}