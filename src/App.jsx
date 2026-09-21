import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import ToastContainer from './components/Toast';
import { Eye, EyeOff, CreditCard, Check } from 'lucide-react';

function Login() {
  // WHY: Tracks whether we show the Sign Up or Sign In form on the right column.
  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'

  // WHY: Sign-up-only fields (kept separate from sign-in).
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // WHY: Shared fields used by both sign-up and sign-in.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // WHY: Rocket Money-style terms acceptance checkbox (required before signup).
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // WHY: Toggles password visibility as plain text vs hidden dots.
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/dashboard');
    });
  }, [navigate]);

  // WHY: Sign-in only needs email + password.
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('/dashboard');
    setLoading(false);
  };

  // WHY: Sign-up validates names + terms before calling Supabase.
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!firstName.trim()) { alert('Please enter your first name.'); return; }
    if (!lastName.trim()) { alert('Please enter your last name.'); return; }
    if (!email.trim()) { alert('Please enter your email address.'); return; }
    if (!password || password.length < 6) { alert('Password must be at least 6 characters.'); return; }
    if (!agreedToTerms) { alert('Please accept the Terms of Service and Privacy Policy to continue.'); return; }

    setLoading(true);
    // WHY: Names are passed via options.data so they land in auth.users.user_metadata.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`
        }
      }
    });
    if (error) alert(error.message);
    else alert('Check your email for confirmation!');
    setLoading(false);
  };

  return (
    // WHY: Rocket Money-style light canvas, centered, generous vertical space.
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Main card: two-column on desktop, stacked on mobile */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/70 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ─── LEFT COLUMN: Marketing copy ─── */}
            <div className="relative bg-slate-50 p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200/70">
              {/* Brand mark */}
              <div className="flex items-center gap-2.5 mb-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">Subsaver</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
                Easily cancel unwanted subscriptions
              </h2>

              {/* Subhead */}
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Subscription cancellation and tracking are just part of why Subsaver helps Nigerians save money every month.
              </p>

              {/* "with Subsaver you can also..." pill */}
              <div className="inline-block bg-white border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5 shadow-sm">
                with Subsaver, you can also...
              </div>

              {/* Benefits */}
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-600" />
                  </span>
                  Effortlessly track your spending
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-600" />
                  </span>
                  Easily spot forgotten charges
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-600" />
                  </span>
                  Cancel subscriptions with one click
                </li>
              </ul>

              {/* Trust line */}
              <p className="text-xs text-slate-400 mt-10">
                Trusted by early users across Nigeria.
              </p>
            </div>

            {/* ─── RIGHT COLUMN: Form ─── */}
            <div className="p-8 sm:p-10 lg:p-12">
              {mode === 'signup' ? (
                <>
                  {/* Heading */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    Create your Subsaver account
                  </h3>
                  <p className="text-sm text-slate-500 mb-7">
                    Takes less than a minute. Free to start.
                  </p>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    {/* First + Last name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          First Name<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Jamine"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Last Name<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Cole"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Email Address<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>

                    {/* Password with show/hide */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Password<span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        I agree to the Subsaver{' '}
                        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>,{' '}
                        <a href="/terms" className="text-blue-600 hover:underline">Account Terms of Use</a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                      </span>
                    </label>

                    {/* Primary CTA */}
                    <button
                      onClick={handleSignUp}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? 'Creating account…' : 'Create Account'}
                    </button>

                    {/* Mode switch */}
                    <p className="text-sm text-slate-500 text-center pt-2">
                      Already have a Subsaver account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signin')}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                </>
              ) : (
                <>
                  {/* ─── SIGN IN MODE ─── */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    Welcome back
                  </h3>
                  <p className="text-sm text-slate-500 mb-7">
                    Log in to your Subsaver account.
                  </p>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>

                    {/* Password with show/hide */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Primary CTA */}
                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? 'Logging in…' : 'Log In'}
                    </button>

                    {/* Mode switch */}
                    <p className="text-sm text-slate-500 text-center pt-2">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Legal microcopy below card */}
        <p className="text-xs text-slate-400 text-center mt-6">
          © 2026 Subsaver. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data }) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Auth check failed:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data }) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Auth check failed:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;