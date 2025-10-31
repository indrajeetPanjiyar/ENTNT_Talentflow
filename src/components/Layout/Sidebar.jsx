import React from 'react';
import {
  Briefcase, Users, FileText,
  Settings, Menu,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', page: 'dashboard', icon: Menu },
  { name: 'Jobs Board', page: 'jobs', icon: Briefcase },
  { name: 'Candidates', page: 'candidates', icon: Users },
  { name: 'Assessments', page: 'assessments', icon: FileText },
];

const Sidebar = ({ currentPage, navigate }) => {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 p-4 shadow-2xl">
      <div className="text-2xl font-bold text-indigo-400 mb-8 tracking-wider">
        TalentFlow
      </div>
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group ${
              (currentPage === item.page || (item.page !== 'dashboard' && currentPage.startsWith(item.page)))
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button className="flex items-center w-full p-3 rounded-xl text-gray-400 hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;