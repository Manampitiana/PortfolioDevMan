import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import OsPageLayout from './components/os/OsPageLayout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Dashboard from './pages/admin/Dashboard'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import { ContextProvider } from './contexts/ContextProvider'
import AdminLayout from './components/admin/AdminLayout'
import AdminProject from './pages/admin/AdminProject'
import AdminSkills from './pages/admin/AdminSkills'
import AdminExperience from './pages/admin/AdminExperience'
import AdminAboutMe from './pages/admin/AdminAboutMe'
import AdminGallery from './pages/admin/AdminGallery'
import AdminSettings from './pages/admin/AdminSettings'
import ProjectForm from './pages/admin/ProjectForm'
import SkillsForm from './pages/admin/SkillsForm'
import ExperienceForm from './pages/admin/ExperienceForm'
import Cv from './pages/Cv'
import AdminMessage from './pages/admin/AdminMessage'
import { SettingsProvider } from './contexts/SettingsContext'
import ProjectFormPage from './pages/admin/ProjectFormPage'
import ProjectDetail from './pages/ProjectDetail'

function App() {
  return (
    <ContextProvider>
      <SettingsProvider> {/* Apetraka eto */}
        <ThemeProvider>
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
        </ThemeProvider>
      </SettingsProvider>
    </ContextProvider>
  )
}

export default App