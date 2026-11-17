import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import SymptomChecker from './pages/SymptomChecker.jsx'
import AssessmentResult from './pages/AssessmentResult.jsx'
import FirstAid from './pages/FirstAid.jsx'
import Assistant from './pages/Assistant.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
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
  )
}

export default App
