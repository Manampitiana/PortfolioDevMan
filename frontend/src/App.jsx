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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="flex items-center gap-2 text-neutral-400 font-mono text-sm">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        Chargement...
      </div>
    </div>
  );
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