import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 relative z-10 w-full mt-auto shrink-0">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-12 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex flex-col  group w-fit">

              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">FocusFlow</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">STAY FOCUS</p>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed text-sm">
              Empowering individuals and teams to master their productivity with intuitive task management and deep analytics.
            </p>

          </div>

          {/* FooterNav Legal */}
          <div className="space-y-5">
            <h3 className="font-semibold text-slate-900 dark:text-white tracking-widest text-xs uppercase">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="#" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          {/* FooterNav Support */}
          <div className="space-y-5">
            <h3 className="font-semibold text-slate-900 dark:text-white tracking-widest text-xs uppercase">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="#" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">Community</Link>
              </li>
              <li>
                <Link to="#" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} FocusFlow Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
