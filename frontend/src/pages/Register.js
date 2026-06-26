import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const DEPARTMENTS = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT', 'MBA', 'BCA', 'MCA', 'Physics', 'Chemistry', 'Mathematics', 'Other'];
const SKILLS = ['DSA', 'Web Dev', 'Machine Learning', 'App Dev', 'Cloud', 'Cybersecurity', 'Data Science', 'UI/UX', 'Research', 'Communication', 'Leadership'];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: params.get('role') || 'mentee',
    year: '', department: '', bio: '',
    skills: [], interests: []
  });

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-icon-lg">⚡</span>
          <h1>Mentova</h1>
          <p>Join a thriving community of students helping each other succeed.</p>
        </div>
        <div className="role-preview">
          <div
            className={`role-card ${form.role === 'mentor' ? 'active' : ''}`}
            onClick={() => setForm({...form, role: 'mentor'})}
          >
            <span className="role-emoji">🎓</span>
            <div>
              <strong>Mentor</strong>
              <p>3rd/4th year · Share knowledge</p>
            </div>
          </div>
          <div
            className={`role-card ${form.role === 'mentee' ? 'active' : ''}`}
            onClick={() => setForm({...form, role: 'mentee'})}
          >
            <span className="role-emoji">📖</span>
            <div>
              <strong>Mentee</strong>
              <p>1st/2nd year · Seek guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create your account</h2>
            <div className="step-indicator">
              <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
              <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
            </div>
            <p>Step {step} of 2 — {step === 1 ? 'Basic Info' : 'Your Profile'}</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {step === 1 && (
            <div>
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-btn ${form.role === 'mentee' ? 'active' : ''}`}
                  onClick={() => setForm({...form, role: 'mentee'})}
                >
                  📖 I'm a Mentee
                </button>
                <button
                  type="button"
                  className={`role-btn ${form.role === 'mentor' ? 'active' : ''}`}
                  onClick={() => setForm({...form, role: 'mentor'})}
                >
                  🎓 I'm a Mentor
                </button>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" placeholder="Aarav Sharma"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>College Email</label>
                <input type="email" className="form-control" placeholder="aarav@college.edu"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Year</label>
                  <select className="form-control" value={form.year} onChange={e => setForm({...form, year: e.target.value})} required>
                    <option value="">Select</option>
                    {['1st', '2nd', '3rd', '4th'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required>
                    <option value="">Select</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }}
                onClick={() => { if (form.name && form.email && form.password && form.year && form.department) setStep(2); else setError('Please fill all fields.'); setError(''); }}
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Bio (tell others about yourself)</label>
                <textarea className="form-control" placeholder="I'm passionate about DSA and web development..."
                  value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Your Skills / Expertise (select all that apply)</label>
                <div className="skills-grid">
                  {SKILLS.map(skill => (
                    <div
                      key={skill}
                      className={`skill-chip ${form.skills.includes(skill) ? 'selected' : ''}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-row-btns">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Creating...' : 'Join Mentova 🚀'}
                </button>
              </div>
            </form>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
