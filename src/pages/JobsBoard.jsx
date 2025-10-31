import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import JobCard from '../components/Jobs/JobCard';
import JobModal from '../components/Jobs/JobModal';

const JobsBoard = ({ data, navigate, onJobReorder, onUpdateJob, onDeleteJob }) => {
  const [filterStatus, setFilterStatus] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [draggedJobId, setDraggedJobId] = useState(null);

  
  const jobs = data && Array.isArray(data.jobs) ? data.jobs : [];

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => filterStatus === 'all' || job.status === filterStatus)
      .filter(job => searchTerm === '' || (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [jobs, filterStatus, searchTerm]);

  const handleEditClick = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDragStart = (e, jobId) => {
    setDraggedJobId(jobId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, targetJobId) => {
    e.preventDefault();
    if (draggedJobId === targetJobId || !draggedJobId) return;

    const sourceJob = data.jobs.find(j => j.id === draggedJobId);
    const targetJob = data.jobs.find(j => j.id === targetJobId);

    if (sourceJob && targetJob) {
      onJobReorder(draggedJobId, targetJob.order);
    }
    setDraggedJobId(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Active ({jobs.filter(j => j.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('archived')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'archived' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Archived ({jobs.filter(j => j.status === 'archived').length})
          </button>
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl py-2 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => handleEditClick(null)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1" /> New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            navigate={navigate}
            onDelete={onDeleteJob}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-4 text-center p-10 bg-gray-800 rounded-xl text-gray-400">
            No jobs match the current filters.
          </div>
        )}
      </div>
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={editingJob}
        onSave={onUpdateJob}
        onDelete={onDeleteJob}
        setEditingJob={setEditingJob}
        nextOrder={jobs.length + 1}
      />
    </div>
  );
};

export default JobsBoard;