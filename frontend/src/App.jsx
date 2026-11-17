import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import SymptomChecker from './pages/SymptomChecker.jsx'
import AssessmentResult from './pages/AssessmentResult.jsx'
import FirstAid from './pages/FirstAid.jsx'
import Assistant from './pages/Assistant.jsx'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
          <Navbar />
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/assessment-result" element={<AssessmentResult />} />
              <Route path="/first-aid" element={<FirstAid />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
