import dashboardImg from '../assets/dashboard.png';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Sun, Moon, ArrowRight, PlayCircle, TrendingUp, CheckCircle, Timer, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-none">FocusFlow</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 uppercase tracking-wider font-semibold">Stay focused.</p>
          </div>
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-8">
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 mr-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/auth" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Login</Link>
          <Link to="/auth" state={{ isSignUp: true }} className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Sign Up</Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto w-full space-y-12 lg:space-y-24">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Stay focused. <br /><span className="text-primary">Get things done.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Master your productivity with task management, Pomodoro focus timers, and deep analytics. Earn XP as you complete tasks and focus sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/auth" state={{ isSignUp: true }} className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all text-lg flex items-center justify-center gap-2">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-lg flex items-center justify-center gap-2">
                  Try Demo <PlayCircle size={20} />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-3xl -z-10 transform rotate-6"></div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] aspect-[4/3] w-full overflow-hidden">
                  <img
                    alt="FocusFlow dashboard showing task lists and a timer"
                    className="w-full h-full object-cover"
                    src={dashboardImg}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Users</p>
              <div className="flex items-end justify-between">
                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">10k+</h4>
                <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                  <TrendingUp size={16} className="text-xs" /> +12%
                </span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[70%]"></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Focus Hours</p>
              <div className="flex items-end justify-between">
                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">250k+</h4>
                <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                  <TrendingUp size={16} className="text-xs" /> +18%
                </span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[85%]"></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Tasks Completed</p>
              <div className="flex items-end justify-between">
                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">1M+</h4>
                <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                  <TrendingUp size={16} className="text-xs" /> +25%
                </span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[92%]"></div>
              </div>
            </div>
          </section>

          <section className="space-y-10 py-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white">Powerful Features for Peak Performance</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Everything you need to stop procrastinating and start achieving your goals in one clean interface.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm">
                <div className="bg-primary/10 size-14 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle size={28} />
                </div>
                <h5 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Task Management</h5>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Organize your day with intuitive drag-and-drop tasks, subtasks, and priority levels.
                </p>
              </div>
              <div className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm">
                <div className="bg-primary/10 size-14 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Timer size={28} />
                </div>
                <h5 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Pomodoro Timer</h5>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Use the classic focus method with customizable session lengths and break intervals.
                </p>
              </div>
              <div className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm">
                <div className="bg-primary/10 size-14 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 size={28} />
                </div>
                <h5 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Deep Analytics</h5>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Visualize your focus patterns over time and discover when you are most productive.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-primary rounded-[2.5rem] p-12 lg:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold">Ready to reclaim your time?</h2>
              <p className="text-primary-100/80 text-xl">Join 10,000+ users who have transformed their work habits with FocusFlow.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/auth" state={{ isSignUp: true }} className="bg-white text-primary font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-slate-50 transition-all text-lg flex items-center justify-center">Get Started Free</Link>
                <button className="bg-transparent text-white border border-white/30 font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition-all text-lg">Contact Sales</button>
              </div>
            </div>
          </section>

        </div>
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
