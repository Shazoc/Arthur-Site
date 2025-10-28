import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Articles from './components/Articles'
import ArticleDetail from './components/ArticleDetail'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Login from './components/login'
import AddArticle from './components/AddArticle'
import { useAuth } from './useAuth'
import AddProject from './components/AddProject'
import ProjectDetail from './components/ProjectDetail'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-article" element={isAuthenticated ? <AddArticle /> : <Navigate to="/login" />} />
          <Route path="/add-project" element={isAuthenticated ? <AddProject /> : <Navigate to="/login" />} />
          <Route path="/radio" element={<Projects />} />
          <Route path="/radio/:id" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
