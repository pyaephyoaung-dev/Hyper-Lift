import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiAtSign, FiUserPlus, FiArrowLeft, FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/common/AlertMessage';
import PasswordField from '../components/common/PasswordField';
import authService from '../services/authService';
import { GENDER_OPTIONS, FITNESS_GOALS, EXPERIENCE_LEVELS } from '../utils/AppConstants';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,50}$/;

const Register = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — account
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');

  // Step 2 — fitness profile
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced "is this username taken?" check against the backend.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!username) {
      setUsernameStatus('idle');
      return;
    }
    if (!USERNAME_PATTERN.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await authService.checkUsername(username);
        setUsernameStatus(response.data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (usernameStatus === 'taken') {
      setError('That username is already taken');
      return;
    }
    if (usernameStatus === 'invalid') {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await register({
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
        age: Number(age),
        gender,
        weight: Number(weight),
        height: Number(height),
        goal,
        experienceLevel,
      });
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  const usernameHint = () => {
    switch (usernameStatus) {
      case 'checking':
        return <span className="text-gray-500">Checking availability…</span>;
      case 'available':
        return (
          <span className="flex items-center gap-1 text-green-400">
            <FiCheck /> Username is available
          </span>
        );
      case 'taken':
        return (
          <span className="flex items-center gap-1 text-red-400">
            <FiX /> Username already taken
          </span>
        );
      case 'invalid':
        return <span className="text-red-400">3-50 characters: letters, numbers, underscores only</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-600/6 rounded-full blur-[120px]" />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors no-underline z-10">
        <FiArrowLeft /> Home
      </Link>

      <div className="m-auto w-full max-w-md px-5 py-12 relative z-10">
        <div className="text-center mb-8 animate-slide-down">
          <Link to="/" className="inline-flex items-center gap-3 no-underline group">
            <GiWeightLiftingUp className="text-5xl text-orange-500 transition-transform group-hover:rotate-[-8deg]" />
            <span className="text-3xl font-extrabold text-white tracking-tight">
              Hyper<span className="text-orange-500">Lift</span>
            </span>
          </Link>
          <p className="text-gray-500 mt-3 text-sm">
            {step === 1 ? 'Create your free account' : 'Tell us about yourself'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`flex items-center gap-2 text-xs font-semibold ${step === 1 ? 'text-orange-500' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
              {step > 1 ? <FiCheck /> : '1'}
            </span>
            Account
          </div>
          <div className="w-10 h-px bg-gray-800" />
          <div className={`flex items-center gap-2 text-xs font-semibold ${step === 2 ? 'text-orange-500' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
              2
            </span>
            Fitness Profile
          </div>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/40 animate-scale-in">
          {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
          {success && <AlertMessage type="success" message={success} />}

          {step === 1 && (
            <form onSubmit={handleContinue}>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                      placeholder="John" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                      placeholder="Doe" required />
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <div className="relative">
                  <FiAtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input type="text" value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                    placeholder="john_doe" required minLength={3} maxLength={50} autoComplete="username" />
                </div>
                {username && <p className="mt-1.5 text-xs">{usernameHint()}</p>}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                    placeholder="you@example.com" required />
                </div>
              </div>

              <div className="mb-5">
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Min. 6 characters"
                  minLength={6}
                  showStrengthMeter
                />
              </div>

              <div className="mb-7">
                <PasswordField
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  minLength={6}
                />
              </div>

              <button type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 cursor-pointer"
              >
                Continue <FiArrowRight />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                    placeholder="25" min={10} max={120} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    required
                  >
                    <option value="">Select</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Body Weight (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                    placeholder="70" min={0} step={0.1} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Height (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
                    placeholder="175" min={0} step={0.1} required />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">Goal</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  required
                >
                  <option value="">Select your goal</option>
                  {FITNESS_GOALS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="mb-7">
                <label className="block text-sm font-medium text-gray-400 mb-2">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                        experienceLevel === level
                          ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                          : 'bg-gray-800/60 border-gray-700/60 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={handleBack}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FiArrowLeft /> Back
                </button>
                <button type="submit" disabled={isLoading || !experienceLevel}
                  className="flex-[2] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 cursor-pointer disabled:cursor-wait"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><FiUserPlus /> Complete Registration</>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
            <div className="relative flex justify-center"><span className="bg-gray-900 px-3 text-gray-600 text-xs">OR</span></div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Already a member?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-400 font-semibold no-underline transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
