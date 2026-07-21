import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAtSign, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/common/AlertMessage';
import PasswordField from '../components/common/PasswordField';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login({ username, password });
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-600/6 rounded-full blur-[120px]" />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors no-underline z-10">
        <FiArrowLeft /> Home
      </Link>

      <div className="m-auto w-full max-w-md px-5 py-16 relative z-10">
        <div className="text-center mb-10 animate-slide-down">
          <Link to="/" className="inline-flex items-center gap-3 no-underline group">
            <GiWeightLiftingUp className="text-5xl text-orange-500 transition-transform group-hover:rotate-[-8deg]" />
            <span className="text-3xl font-extrabold text-white tracking-tight">
              Hyper<span className="text-orange-500">Lift</span>
            </span>
          </Link>
          <p className="text-gray-500 mt-3 text-sm">Sign in to continue your journey</p>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/40 animate-scale-in">
          {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <div className="relative">
                <FiAtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                  placeholder="john_doe"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="mb-7">
              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 cursor-pointer disabled:cursor-wait"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiLogIn /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
            <div className="relative flex justify-center"><span className="bg-gray-900 px-3 text-gray-600 text-xs">OR</span></div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-400 font-semibold no-underline transition-colors">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
