import Navbar from './components/Navbar'
import ThemeContextProvider from './context/ThemeContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Resume from './pages/Resume'
import Projects from './pages/Projects'
import Artwork from './pages/Artwork'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <Navbar />
        <Routes>
          <Route path="/resume" element={<Resume />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/artwork" element={<Artwork />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<Navigate to="/resume" />} />
        </Routes>
      </ThemeContextProvider>
    </BrowserRouter>
  )
}

export default App
