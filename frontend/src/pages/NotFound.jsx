import { Link, useNavigate } from 'react-router-dom'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    // Raha misy tantara navigation ao aloha dia miverina, raha tsy izany dia mankany amin'ny accueil
    // (miaro amin'ny hoe tsy misy dikany "history.back()" raha niditra mivantana tamin'ilay rohy)
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow decoratifs en arrière-plan */}
      <div className="absolute top-1/4 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center max-w-md mx-auto relative">
        <div className="mb-6">
          <h1 className="font-display text-9xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text">
            404
          </h1>
        </div>

        <h2 className="font-display text-3xl font-semibold text-white mb-4">
          Page introuvable
        </h2>

        <p className="text-neutral-400 mb-8 leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas.
          Elle a peut-être été supprimée ou son adresse a changé.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>

          <button
            onClick={goBack}
            className="inline-flex items-center justify-center border border-white/10 bg-white/[0.03] text-neutral-300 px-6 py-3 rounded-xl font-semibold hover:bg-white/[0.07] hover:text-white transition-all duration-300"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Page précédente
          </button>
        </div>
      </motion.div>
    </div>
  )
}