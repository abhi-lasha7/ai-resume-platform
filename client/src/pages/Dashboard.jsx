import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return navigate('/login');
    setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {user?.name}!
          </h1>
          <button
            onClick={logout}
            className="border border-slate-600 text-slate-300 px-4 py-2 rounded-xl hover:border-red-500 hover:text-red-400 transition"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
            <div className="text-slate-400">Resumes Analyzed</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">0</div>
            <div className="text-slate-400">Jobs Matched</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">0%</div>
            <div className="text-slate-400">Avg Match Score</div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-dashed border-slate-600 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-white text-xl font-semibold mb-2">Analyze your first resume</h3>
          <p className="text-slate-400 mb-6">Upload your resume and paste a job description to get started</p>
          <button
  onClick={() => navigate('/upload')}
  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition"
>
  Upload Resume →
</button>
        </div>
      </div>
    </div>
  );
}