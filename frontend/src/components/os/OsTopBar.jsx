import { useEffect, useState } from 'react';
import { Wifi, BatteryFull } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

function formatTime(date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function OsTopBar() {
  const [now, setNow] = useState(new Date());
  const { settings } = useSettings();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 h-11 bg-black/30 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center text-[10px] font-bold text-neutral-950">
          R
        </div>
        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          {(settings?.site_name || 'RAVAKA').toUpperCase()} OS
        </span>
      </div>
      <div className="flex items-center gap-3 text-neutral-200">
        <Wifi className="w-4 h-4" strokeWidth={1.8} />
        <BatteryFull className="w-5 h-5" strokeWidth={1.8} />
        <span className="text-xs sm:text-sm font-mono tabular-nums">{formatTime(now)}</span>
      </div>
    </div>
  );
}
