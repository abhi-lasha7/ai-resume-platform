import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          AI Powered · Built for Placements
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          Land Your <span className="text-blue-400">Dream Job</span>
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          Upload your resume, paste a job description, get an AI match score instantly.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105">
            Get Started →
          </a>
          <a href="/login" className="border border-slate-600 hover:border-slate-400 text-slate-300 font-semibold px-8 py-3 rounded-xl transition-all duration-200">
            Sign In
          </a>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">AI Score</div>
            <div className="text-slate-400 text-sm">Match % with any job</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">Skill Gap</div>
            <div className="text-slate-400 text-sm">Know what to learn</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">ATS Check</div>
            <div className="text-slate-400 text-sm">Beat the bots</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;