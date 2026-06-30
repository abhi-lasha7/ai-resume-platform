import { useLocation, useNavigate } from 'react-router-dom';

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No results to show</p>
          <button onClick={() => navigate('/dashboard')} className="text-blue-400 hover:text-blue-300">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { resume, analysis } = state.result;
  const score = analysis.matchScore || 0;

  const scoreColor = score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400';
  const scoreRing = score >= 70 ? 'stroke-green-400' : score >= 40 ? 'stroke-yellow-400' : 'stroke-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white mb-6 text-sm"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-6 text-center">
          <p className="text-slate-400 mb-4">{resume.fileName}</p>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                className={scoreRing}
                strokeWidth="8"
                strokeDasharray={`${score * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>{score}%</span>
            </div>
          </div>
          <p className="text-white font-semibold text-lg">Match Score</p>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">{analysis.overallFeedback}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-400">✓</span> Matched Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(analysis.matchedSkills || []).map((skill, i) => (
                <span key={i} className="bg-green-500/10 text-green-400 text-sm px-3 py-1 rounded-full border border-green-500/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-400">✗</span> Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(analysis.missingSkills || []).map((skill, i) => (
                <span key={i} className="bg-red-500/10 text-red-400 text-sm px-3 py-1 rounded-full border border-red-500/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-2">ATS Compatibility</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${analysis.atsScore || 0}%` }}
              ></div>
            </div>
            <span className="text-white font-semibold">{analysis.atsScore || 0}%</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">💡 Suggestions to Improve</h3>
          <ul className="space-y-3">
            {(analysis.suggestions || []).map((s, i) => (
              <li key={i} className="text-slate-300 text-sm flex gap-3">
                <span className="text-blue-400 font-bold">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {analysis.experienceGap && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-2">Experience Analysis</h3>
            <p className="text-slate-300 text-sm">{analysis.experienceGap}</p>
          </div>
        )}

        <button
          onClick={() => navigate('/upload')}
          className="w-full border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-semibold py-3 rounded-xl transition"
        >
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}