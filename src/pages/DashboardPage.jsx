import React from 'react';
import { Briefcase, Users, FileText } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  
  const colorMap = {
    indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
    gray: { bg: 'bg-gray-500/20', text: 'text-gray-400' }
  };

  const c = colorMap[color] || colorMap.gray;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 transform hover:scale-[1.01] transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${c.bg} ${c.text}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-3xl font-extrabold text-white">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-400 mt-4">{title}</p>
    </div>
  );
};
  
  const ActionButton = ({ onClick, label, icon: Icon }) => (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-colors duration-200"
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

const DashboardPage = ({ navigate, data = { jobs: [], candidates: [] } }) => {
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];
  const candidates = Array.isArray(data.candidates) ? data.candidates : [];

  const activeJobsCount = jobs.filter(j => j.status === 'active').length;

  // New applicants: candidates applied in the last 7 days
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const newApplicantsCount = candidates.filter(c => {
    try {
      const applied = c.appliedDate ? Date.parse(c.appliedDate) : 0;
      return (now - applied) <= sevenDays;
    } catch (e) {
      return false;
    }
  }).length;

  const techStageCount = candidates.filter(c => c.stage === 'tech').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Active Jobs" value={activeJobsCount} icon={Briefcase} color="indigo" />
      <StatCard title="New Applicants (7d)" value={newApplicantsCount} icon={Users} color="green" />
      <StatCard title="Candidates in Tech Stage" value={techStageCount} icon={FileText} color="cyan" />

    <div className="md:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <ActionButton onClick={() => navigate('jobs')} label="View Jobs Board" icon={Briefcase} />
        <ActionButton onClick={() => navigate('candidates')} label="Manage Candidates" icon={Users} />
        <ActionButton onClick={() => navigate('assessments')} label="Build Assessments" icon={FileText} />
      </div>
    </div>
  </div>
  );
};

export default DashboardPage;