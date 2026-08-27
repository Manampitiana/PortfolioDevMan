import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import OsPageLayout from './components/os/OsPageLayout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { ContextProvider } from './contexts/ContextProvider'
import AdminLayout from './components/admin/AdminLayout'
import { SettingsProvider } from './contexts/SettingsContext'
import ProjectDetail from './pages/ProjectDetail'

// Lazy-load : CV (react-pdf/renderer, lourd) et tout l'espace Admin —
// ne sont chargés que lorsque l'utilisateur y accède réellement
const Cv = lazy(() => import('./pages/Cv'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProject = lazy(() => import('./pages/admin/AdminProject'))
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'))
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience'))
const AdminAboutMe = lazy(() => import('./pages/admin/AdminAboutMe'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminMessage = lazy(() => import('./pages/admin/AdminMessage'))
const ProjectForm = lazy(() => import('./pages/admin/ProjectForm'))
const SkillsForm = lazy(() => import('./pages/admin/SkillsForm'))
const ExperienceForm = lazy(() => import('./pages/admin/ExperienceForm'))
const ProjectFormPage = lazy(() => import('./pages/admin/ProjectFormPage'))

// Écran d'attente minimal pendant le chargement des chunks
function RouteLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-neutral-950 flex items-center justify-center overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center">

        {/* Logo loader */}
        <div className="relative w-20 h-20 mb-6">

          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20" />

          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />

          {/* Logo / Initial */}
          <div className="absolute inset-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center justify-center">
            <span className="font-display text-xl font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
              T
            </span>
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <p className="text-white font-semibold tracking-wide">
            TsiryWeb Studio
          </p>

          <p className="mt-2 text-[11px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
            Initialisation...
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5 mt-5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce" />
        </div>

      </div>
    </div>
  )
}

function App() {
  return (
    <ContextProvider>
      <SettingsProvider> {/* Apetraka eto */}
        <ThemeProvider>
          <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Public Routes */}
            {/* Ny page rehetra dia mampiasa ny chrome OS (top bar + dock), tsy ny Navigation taloha intsony */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={
              <OsPageLayout>
                <About />
              </OsPageLayout>
            } />
            <Route path="/projects" element={
              <OsPageLayout>
                <Projects />
              </OsPageLayout>
            } />
            <Route path="/projects/:slug" element={
              <OsPageLayout>
                <ProjectDetail />
              </OsPageLayout>
            } />
            <Route path="/contact" element={
              <OsPageLayout>
                <Contact />
              </OsPageLayout>
            } />
            <Route path="/cv" element={
              <OsPageLayout>
                <Cv />
              </OsPageLayout>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} /> {/* Default admin route */}
              <Route path='projects' element={<AdminProject />} />
              <Route path='add_projects' element={<ProjectFormPage />} />
              <Route path='edit_projects/:id' element={<ProjectFormPage />} />
              <Route path='skills' element={<AdminSkills />} />
              <Route path='add_skills' element={<SkillsForm />} />
              <Route path='edit_skills/:id' element={<SkillsForm />} />
              <Route path='experiences' element={<AdminExperience />} />
              <Route path='add_experiences' element={<ExperienceForm />} />
              <Route path='edit_experiences/:id' element={<ExperienceForm />} />
              <Route path='about_me' element={<AdminAboutMe />} />
              <Route path='gallery' element={<AdminGallery />} />
              <Route path='settings' element={<AdminSettings />} />
              <Route path='messages' element={<AdminMessage />} />
            </Route>
            <Route path="/admin/login" element={<Login />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </ThemeProvider>
      </SettingsProvider>
    </ContextProvider>
  )
}

export default App