import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Loader2, Sun, Moon, Home } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

const AuthenticationPage = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignUp);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      toast.success('Successfully logged in!', {
        description: 'Redirecting to your dashboard...'
      });
    } else {
      toast.success('Account created successfully!', {
        description: 'Welcome to FocusFlow. Redirecting...'
      });
    }

    // Simulate redirection after a standard delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-3">
          <div>
            <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-none">FocusFlow</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 uppercase tracking-wider font-semibold">Stay focused.</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 mr-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            <Home size={20} />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[440px]">

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 md:p-10 relative overflow-hidden">

            {/* Smooth Tab Switching visual representation */}
            <div className="flex mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Sign Up
              </button>
            </div>

            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-black tracking-tight mb-2">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {isLogin ? 'Please enter your details to sign in.' : 'Enter your details to get started.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      required
                      className="w-full pl-11 pr-4 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="Aaron Boafo"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    required
                    className="w-full pl-11 pr-4 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="name@company.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  {isLogin && <a href="#" className="text-xs font-bold text-primary hover:underline cursor-pointer">Forgot Password?</a>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    required
                    className="w-full pl-11 pr-12 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98]" type="submit">
                  {isLogin ? 'Login' : 'Create Account'}
                </button>
              </div>

              {isLogin && (
                <div className="flex items-center gap-2 justify-center py-2">
                  <Loader2 size={14} className="text-slate-400 animate-spin" />
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">Redirecting to Dashboard upon success</p>
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isLogin ? 'New to FocusFlow? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </div>


        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthenticationPage;
