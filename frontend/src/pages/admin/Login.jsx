import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import axiosClient from '../../axios';
import { useStateContext } from '../../contexts/ContextProvider';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser, setUserToken, userToken } = useStateContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userToken) {
      navigate('/admin');
    }
  }, [userToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post('/login', formData);
      setCurrentUser(response.data.user);
      setUserToken(response.data.token);
      navigate('/admin');
    } catch (error) {
      console.error('Erreur de connexion :', error);
      toast.error(error.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow decoratifs en arrière-plan */}
      <div className="absolute top-1/4 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-md w-full relative">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-2xl shadow-2xl shadow-fuchsia-500/20 mb-4">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-white mb-2">Administration</h2>
          <p className="text-neutral-400">Connectez-vous à votre espace admin</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                <EnvelopeIcon className="h-4 w-4 inline mr-2 text-cyan-300" />
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                <LockClosedIcon className="h-4 w-4 inline mr-2 text-cyan-300" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  tabIndex={-1}
                  title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-3 rounded-xl hover:opacity-95 font-semibold transform hover:scale-[1.02] transition-all shadow-lg shadow-fuchsia-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-neutral-500 hover:text-cyan-300 transition-colors">
              ← Retour au site
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}