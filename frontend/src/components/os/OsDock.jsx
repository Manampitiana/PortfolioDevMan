import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FolderKanban, Code2, Briefcase, Mail, SquareTerminal, Github, Trash2 } from 'lucide-react';

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const goToSectionMobile = (id, navigate) => {
  if (document.getElementById(id)) {
    scrollToId(id);
  } else {
    navigate('/');
    setTimeout(() => scrollToId(id), 60);
  }
};

export default function OsDock() {
  const navigate = useNavigate();
  const [showTrash, setShowTrash] = useState(false);

  // Skills/Expérience ne vivent que sur l'Accueil : on y retourne d'abord si besoin
  const goToSection = (id) => {
    if (document.getElementById(id)) {
      scrollToId(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToId(id), 60);
    }
  };

  const items = [
    { label: 'À propos', icon: User, color: 'text-cyan-300', onClick: () => navigate('/about') },
    { label: 'Projets', icon: FolderKanban, color: 'text-amber-300', onClick: () => navigate('/projects') },
    { label: 'Compétences', icon: Code2, color: 'text-emerald-300', onClick: () => goToSection('skills-section') },
    { label: 'Expérience', icon: Briefcase, color: 'text-fuchsia-300', onClick: () => goToSection('experience-section') },
    { label: 'Contact', icon: Mail, color: 'text-sky-300', onClick: () => navigate('/contact') },
    { label: 'Terminal', icon: SquareTerminal, color: 'text-lime-300', onClick: () => goToSection('terminal-window') },
    { label: 'GitHub', icon: Github, color: 'text-neutral-200', onClick: () => window.open('https://github.com/Manampitiana', '_blank') },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center w-20 shrink-0 py-6 gap-3 bg-black/25 backdrop-blur-xl border-r border-white/10 relative z-20 sticky top-11 self-start h-[calc(100vh-2.75rem)] overflow-y-auto">
      {items.map(({ label, icon: Icon, color, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          className="group relative w-14 flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <span className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:border-white/20 transition-transform">
            <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.8} />
          </span>
          <span className="text-[9px] font-mono text-neutral-400 group-hover:text-neutral-200 leading-none text-center">
            {label}
          </span>
        </button>
      ))}

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => {
            setShowTrash(true);
            setTimeout(() => setShowTrash(false), 1800);
          }}
          title="Trash"
          className="group w-14 flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <span className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Trash2 className="w-5 h-5 text-neutral-400" strokeWidth={1.8} />
          </span>
          <span className="text-[9px] font-mono text-neutral-500 leading-none">Corbeille</span>
        </button>
        {showTrash && (
          <div className="absolute left-16 bottom-1 z-50 whitespace-nowrap bg-neutral-900 border border-white/10 text-[11px] text-neutral-300 font-mono px-3 py-2 rounded-lg shadow-xl">
            Aucun bug à supprimer 😄
          </div>
        )}
      </div>
    </aside>
  );
}

export function OsMobileNav() {
  const navigate = useNavigate();
  const items = [
    { label: 'À propos', icon: User, onClick: () => navigate('/about') },
    { label: 'Projets', icon: FolderKanban, onClick: () => navigate('/projects') },
    { label: 'Compétences', icon: Code2, onClick: () => goToSectionMobile('skills-section', navigate) },
    { label: 'Contact', icon: Mail, onClick: () => navigate('/contact') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-black/60 backdrop-blur-xl border-t border-white/10 py-2.5">
      {items.map(({ label, icon: Icon, onClick }) => (
        <button key={label} onClick={onClick} className="flex flex-col items-center gap-1 text-neutral-300">
          <Icon className="w-5 h-5" strokeWidth={1.8} />
          <span className="text-[10px] font-mono">{label}</span>
        </button>
      ))}
    </nav>
  );
}
