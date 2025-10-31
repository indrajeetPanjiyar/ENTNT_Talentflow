import React, { useMemo } from 'react';
import { Archive, ArrowUpDown, FileText, Calendar } from 'lucide-react';
import JobStatusBadge from '../components/Jobs/JobStatusBadge';
import { CANDIDATE_STAGES } from '../data/seed';

const JobDetail = ({ job, navigate, onUpdateJob, allCandidates }) => {
  const candidatesForJob = useMemo(() => {
    return allCandidates.filter(c => c.jobId === job.id);
  }, [allCandidates, job.id]);

  const handleToggleArchive = async () => {
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    await onUpdateJob({ ...job, status: newStatus });
    
    if (newStatus === 'archived') {
        navigate('jobs');
    }
  };

  if (!job) return <div className="text-red-400">Job not found.</div>;

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-start bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">{job.title}</h1>
          <p className="text-gray-500 font-mono text-sm mb-4">Slug: <span className="text-gray-400">{job.slug}</span></p>
          <div className="flex space-x-3 items-center">
            <JobStatusBadge status={job.status} />
            <span className="text-sm text-gray-400 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                Created: {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={handleToggleArchive}
            className={`flex items-center px-4 py-2 text-sm rounded-xl transition-colors ${
              job.status === 'active'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {job.status === 'active' ? <Archive className="w-4 h-4 mr-2" /> : <ArrowUpDown className="w-4 h-4 mr-2" />}
            {job.status === 'active' ? 'Archive Job' : 'Reactivate Job'}
          </button>
          <button
            onClick={() => navigate('assessments')} // Assume this link takes them to the assessment builder view
            className="flex items-center w-full justify-center px-4 py-2 text-sm rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Manage Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 space-y-4">
          <h2 className="text-xl font-bold text-white">Description</h2>
          <p className="text-gray-400">{job.description}</p>
          <h2 className="text-xl font-bold text-white pt-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {job.tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-sm bg-indigo-600/20 text-indigo-300 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Pipeline Summary</h2>
          <div className="space-y-3">
            {CANDIDATE_STAGES.map(stage => {
              const count = candidatesForJob.filter(c => c.stage === stage).length;
              const color = count > 0 ? (stage === 'hired' ? 'text-green-400' : 'text-indigo-400') : 'text-gray-500';
              return (
                <div key={stage} className="flex justify-between items-center text-sm">
                  <span className="capitalize text-gray-400">{stage.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className={`font-semibold ${color}`}>{count}</span>
                </div>
              );
            })}
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-700">
                <span>Total Candidates</span>
                <span>{candidatesForJob.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;