import Navbar from './components/Navbar'
import ThemeContextProvider from './context/ThemeContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Resume from './pages/Resume'
import Projects from './pages/Projects'
import Artwork from './pages/Artwork'
import Contact from './pages/Contact'
import MNIST from './pages/MNIST'

import AsciiAnimation from './components/AsciiAnimation'
import { useRef } from 'react'
import { Box, useMediaQuery } from '@mui/material'

function App() {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const asciiContainerRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <ThemeContextProvider>
                <Box
                    ref={asciiContainerRef}
                    sx={{
                        position: 'fixed',
                        top: { xs: 0, sm: 0, md: '-150px' },
                        right: { xs: 0, sm: 0, md: '-150px' },
                        width: { xs: '400px', sm: '500px', md: '900px' },
                        height: { xs: '400px', sm: '500px', md: '900px' },
                        zIndex: 0,
                        opacity: 0.3,
                        pointerEvents: 'none',
                        overflow: 'visible',
                        '@media print': { display: 'none' },
                        fontWeight: 'bold',
                    }}
                >
                    <AsciiAnimation containerRef={asciiContainerRef} resolution={isMobile ? 0.4 : 0.3} />
                </Box>
                <BrowserRouter>

                    <Navbar />
                    <Routes>
                        <Route path="/resume" element={<Resume />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/artwork" element={<Artwork />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/mnist" element={<MNIST />} />
                        <Route path="/" element={<Navigate to="/resume" />} />
                    </Routes>
                </BrowserRouter>
            </ThemeContextProvider>
        </>
    )
}

export default App
