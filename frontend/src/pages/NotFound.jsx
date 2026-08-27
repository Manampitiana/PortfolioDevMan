import { Link, useNavigate } from 'react-router-dom'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import OsPageLayout from '../components/os/OsPageLayout'
import WindowFrame from '../components/os/WindowFrame'

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
    <OsPageLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-xl mx-auto mt-6">
        <WindowFrame title="Erreur" breadcrumb="Accueil > 404" bodyClassName="p-6 sm:p-10 text-center">
          {/* Simulation d'erreur terminal */}
          <div className="rounded-xl border border-white/10 bg-black/30 font-mono text-[13px] text-left p-4 mb-8 overflow-x-auto">
            <p className="text-neutral-300">
              <span className="text-emerald-400">ravaka@portfolio:~$</span> cd {window.location.pathname}
            </p>
            <p className="text-rose-400 mt-1">
              bash: cd: {window.location.pathname}: Aucun fichier ou dossier de ce type
            </p>
            <p className="text-neutral-500 mt-1">
              <span className="text-emerald-400">manDev@portfolio:~$</span>
              <span className="inline-block w-2 h-4 bg-cyan-300/80 ml-1 align-middle animate-pulse" />
            </p>
          </div>

          <h1 className="font-display text-7xl sm:text-8xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text mb-4">
            404
          </h1>

          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
            Page introuvable
          </h2>

          <p className="text-neutral-400 mb-8 leading-relaxed max-w-md mx-auto">
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
        </WindowFrame>
      </motion.div>
    </OsPageLayout>
  )
}