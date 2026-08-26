import { useEffect, useState } from 'react';
import { Volume2, Camera } from 'lucide-react';

function formatTime(date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function OsTaskbar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-20 hidden md:flex items-center justify-between px-6 h-11 bg-black/30 backdrop-blur-xl border-t border-white/10 text-neutral-300">
      <div className="flex items-center gap-4">
        <Volume2 className="w-4 h-4" strokeWidth={1.8} />
        <Camera className="w-4 h-4" strokeWidth={1.8} />
      </div>
      <span className="text-xs font-mono tabular-nums">{formatTime(now)}</span>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center text-[11px] font-bold text-neutral-950"
        title="Miakatra any ambony"
      >
        R
      </button>
    </div>
  );
}
