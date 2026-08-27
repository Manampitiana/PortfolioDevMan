import { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ContextProvider } from './contexts/ContextProvider'
import { SettingsProvider } from './contexts/SettingsContext'
import OsPageLayout from './components/os/OsPageLayout'
import AdminLayout from './components/admin/AdminLayout'

// Public pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Cv = lazy(() => import('./pages/Cv'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin pages
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

// ======================================================
// 5 SECONDS INTRO LOADER
// ======================================================

function BrandLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const duration = 5000

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const percentage = Math.min((elapsed / duration) * 100, 100)

      setProgress(percentage)

      if (percentage >= 100) {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[99999] bg-neutral-950 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.08] blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-fuchsia-500/[0.06] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-cyan-500/[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="relative w-24 h-24 mb-7">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin" style={{ animationDuration: '2s' }} />

          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-400 p-[1px]">
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                <img src="/favicon.png" alt="LOGO" />
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold tracking-wide text-white">
          TsiryWeb Studio
        </h1>

        <p className="mt-2 text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-neutral-500">
          Website • Design • Code
        </p>

        <div className="mt-8 w-52 sm:w-64">
          <div className="h-1 w-full bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
              style={{
                width: `${progress}%`,
                transition: 'width 80ms linear',
                boxShadow: '0 0 12px rgba(34,211,238,0.45)',
              }}
            />
          </div>

          <div className="flex justify-between mt-3">
            <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
              Initialisation
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:200ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  )
}

// ======================================================
// ROUTE LOADER
// ======================================================

function RouteLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-neutral-950 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative w-14 h-14 mb-5">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-white/[0.03] flex items-center justify-center">
            <span className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
              T
            </span>
          </div>
        </div>

        <p className="text-white text-sm font-medium">
          TsiryWeb Studio
        </p>

        <p className="mt-1 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
          Chargement...
        </p>
      </div>
    </div>
  )
}

// ======================================================
// APP INTRO
// ======================================================

function AppIntro({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <BrandLoader />
  }

  return children
}

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <AppIntro>
      <ContextProvider>
        <SettingsProvider>
          <ThemeProvider>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                {/* Public Routes */}

                <Route path="/" element={<Home />} />

                <Route
                  path="/about"
                  element={
                    <OsPageLayout>
                      <About />
                    </OsPageLayout>
                  }
                />

                <Route
                  path="/projects"
                  element={
                    <OsPageLayout>
                      <Projects />
                    </OsPageLayout>
                  }
                />

                <Route
                  path="/projects/:slug"
                  element={
                    <OsPageLayout>
                      <ProjectDetail />
                    </OsPageLayout>
                  }
                />

                <Route
                  path="/contact"
                  element={
                    <OsPageLayout>
                      <Contact />
                    </OsPageLayout>
                  }
                />

                <Route
                  path="/cv"
                  element={
                    <OsPageLayout>
                      <Cv />
                    </OsPageLayout>
                  }
                />

                {/* Admin Routes */}

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<AdminProject />} />
                  <Route path="add_projects" element={<ProjectFormPage />} />
                  <Route path="edit_projects/:id" element={<ProjectFormPage />} />
                  <Route path="skills" element={<AdminSkills />} />
                  <Route path="add_skills" element={<SkillsForm />} />
                  <Route path="edit_skills/:id" element={<SkillsForm />} />
                  <Route path="experiences" element={<AdminExperience />} />
                  <Route path="add_experiences" element={<ExperienceForm />} />
                  <Route path="edit_experiences/:id" element={<ExperienceForm />} />
                  <Route path="about_me" element={<AdminAboutMe />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="messages" element={<AdminMessage />} />
                </Route>

                <Route path="/admin/login" element={<Login />} />

                {/* 404 */}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ThemeProvider>
        </SettingsProvider>
      </ContextProvider>
    </AppIntro>
  )
}

export default App