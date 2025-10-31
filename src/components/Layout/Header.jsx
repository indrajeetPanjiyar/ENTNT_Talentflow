import React, { useState } from 'react';
import { Briefcase, Users, FileText, Menu as MenuIcon, X } from 'lucide-react';

const Header = ({ currentPage, loading, error, navigate }) => {
  const pageMap = {
    'dashboard': 'Analytics Dashboard',
    'jobs': 'Jobs Board',
    'candidates': 'Candidate Pipeline',
    'assessments': 'Assessment Management',
    'jobs/:id': 'Job Details',
    'candidates/:id': 'Candidate Profile',
  };
  const title = pageMap[currentPage] || pageMap[currentPage.split('/')[0]] || 'Talent Flow';

  return (
    <header className="pb-4 border-b border-gray-700/50">
      {/* Back button for detail/edit pages */}
      {typeof navigate === 'function' && currentPage && currentPage.includes('/:id') && (
        <button
          onClick={() => {
            if (currentPage.startsWith('jobs')) navigate('jobs');
            else if (currentPage.startsWith('candidates')) navigate('candidates');
            else navigate('dashboard');
          }}
          className="mb-3 inline-flex items-center px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          ← Back
        </button>
      )}
      <h1 className="text-3xl font-extrabold text-white">{title}</h1>
      <p className="text-sm text-gray-400 mt-1">Manage your hiring pipeline efficiently.</p>
      {(loading || error) && (
        <div className={`mt-3 p-3 rounded-xl shadow-lg font-medium text-sm transition-all duration-300 ${
          error ? 'bg-red-800 text-red-200' : 'bg-yellow-700 text-yellow-200 animate-pulse'
        }`}>
          {error ? `API Error: ${error} (Changes rolled back)` : 'Processing request... (Simulated API Latency)'}
        </div>
      )}

      {/* Mobile Floating Nav Button (only visible on small screens) */}
      <MobileNav navigate={navigate} />
    </header>
  );
};

export default Header;

const MobileNav = ({ navigate }) => {
  const [open, setOpen] = useState(false);

  const items = [
    { label: 'Dashboard', page: 'dashboard', icon: MenuIcon },
    { label: 'Jobs', page: 'jobs', icon: Briefcase },
    { label: 'Candidates', page: 'candidates', icon: Users },
    { label: 'Assessments', page: 'assessments', icon: FileText },
  ];

  const handleNavigate = (page) => {
    setOpen(false);
    navigate(page);
  };

  return (
    <>
      {/* overlay to close menu when open */}
      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 md:hidden" />
      )}

  <div className="fixed md:hidden top-4 right-4 z-50">
        <div className="flex flex-col items-end space-y-3">
          {open && (
            <div className="mb-2 bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-700 flex flex-col gap-2">
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNavigate(item.page)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left w-44"
                  >
                    <Icon className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setOpen(o => !o)}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center"
            aria-label="Open navigation"
          >
            {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </>
  );
};