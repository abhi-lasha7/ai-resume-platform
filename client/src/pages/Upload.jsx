import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const handleSubmit = async () => {
    if (!file) return toast.error('Please upload a resume');
    if (jobDescription.trim().length < 20) return toast.error('Please paste a detailed job description (min 20 characters)');

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Analysis complete!');
      navigate('/results', { state: { result: res.data.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white mb-6 text-sm"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">Analyze Your Resume</h1>
        <p className="text-slate-400 mb-8">Upload your resume and paste the job description to get an instant AI match score</p>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-3">Resume File</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
              isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <div className="text-4xl mb-2">📄</div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-red-400 text-sm mt-3 hover:text-red-300"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">📤</div>
                <p className="text-white font-medium">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </p>
                <p className="text-slate-400 text-sm mt-1">or click to browse · PDF or DOCX · Max 5MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-3">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition resize-none"
          />
          <p className="text-slate-500 text-xs mt-2">{jobDescription.length} characters</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Analyzing with AI...
            </>
          ) : (
            'Analyze Resume →'
          )}
        </button>
        {loading && (
          <p className="text-slate-400 text-sm text-center mt-3">This usually takes 10-20 seconds</p>
        )}
      </div>
    </div>
  );
}