import { useState, useEffect } from 'react';
import axiosClient from '../../axios'; // Ataovy azo antoka fa marina ny path-nao
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

export default function AdminAboutMe() {
  const [pdp, setPdp] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Ho an'ny loading voalohany

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

  // 1. FAKANA NY DATA REHEFA MISOKATRA NY PEJY
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
            is_active: !!data.is_active, // Manova azy ho boolean
          });
          if (data.pdp) setPreview(data.pdp); // URL feno avy any amin'ny Controller
        }
      } catch (err) {
        console.error("Error fetching data", err);
        toast.error("Tsy azo ny mombamomba anao.");
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
    setLoading(true);

    const formData = new FormData();
    // Ampidirina ny fields rehetra
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    // Ampidirina ny sary raha misy vaovao
    if (pdp) {
      formData.append('pdp', pdp);
    }

    try {
      const response = await axiosClient.post('/aboutmes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message || 'Profile updated successfully!');
    } catch (error) {
      if (error.response?.status === 422) {
        toast.error('Hamarino ny inputs-nao');
      } else {
        toast.error('Nisy olana nitranga.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1";

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]' />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-gray-400">Manage your personal information and biography.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
          <div className="p-6 md:p-8 space-y-8">

            {/* SECTION: Profile Picture */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-gray-700">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-blue-500 shadow-lg shadow-blue-500/20">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 text-4xl">?</span>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-all rounded-full text-xs text-white font-semibold">
                  CHANGE PHOTO
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                <p className="text-sm text-gray-400">Update your avatar. Square JPG or PNG recommended.</p>
              </div>
            </div>

            {/* SECTION: Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name</label>
                <input name="full_name" value={form.full_name} onChange={handleInputChange} className={inputClass} placeholder="John Doe" required />
              </div>
              <div>
                <label className={labelClass}>Professional Title</label>
                <input name="title" value={form.title} onChange={handleInputChange} className={inputClass} placeholder="Fullstack Developer" required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Short Bio</label>
              <textarea name="short_bio" value={form.short_bio} rows="2" onChange={handleInputChange} className={inputClass} placeholder="A short, catchy bio..." />
            </div>

            <div>
              <label className={labelClass}>Long Description</label>
              <textarea name="description" value={form.description} rows="5" onChange={handleInputChange} className={inputClass} placeholder="Your detailed background..." />
            </div>

            {/* SECTION: Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" type="email" value={form.email} className={inputClass} placeholder="mail@example.com" onChange={handleInputChange} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone" value={form.phone} className={inputClass} placeholder="+261 3x xx xxx xx" onChange={handleInputChange} />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input name="location" value={form.location} className={inputClass} placeholder="Antananarivo" onChange={handleInputChange} />
              </div>
            </div>

            {/* SECTION: Visibility & Save */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-700 gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Publicly Visible</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:bg-gray-600"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}