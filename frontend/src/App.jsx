import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
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

function App() {
  return (
    <ContextProvider>
      <SettingsProvider> {/* Apetraka eto */}
        <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/about" element={
              <Layout>
                <About />
              </Layout>
            } />
            <Route path="/projects" element={
              <Layout>
                <Projects />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <Contact />
              </Layout>
            } />
            <Route path="/cv" element={
              <Layout>
                <Cv />
              </Layout>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} /> {/* Default admin route */}
              <Route path='projects' element={<AdminProject />} /> 
              <Route path='add_projects' element={<ProjectForm />} /> 
              <Route path='edit_projects/:id' element={<ProjectForm />} /> 
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