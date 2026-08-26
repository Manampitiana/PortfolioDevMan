import OsWallpaper from './OsWallpaper';
import OsTopBar from './OsTopBar';
import OsDock, { OsMobileNav } from './OsDock';
import Footer from '../Footer';

// Chrome OS persistant (top bar + dock) ho an'ny page rehetra afa-tsy ny Accueil
// (izay manana ny endriny manokana). Mitovy amin'ny "OS window" concept.
export default function OsPageLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col pb-16 md:pb-0">
      <div className="fixed inset-0 -z-10">
        <OsWallpaper />
      </div>

      <OsTopBar />

      <div className="flex flex-1">
        <OsDock />
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      <OsMobileNav />
    </div>
  );
}
