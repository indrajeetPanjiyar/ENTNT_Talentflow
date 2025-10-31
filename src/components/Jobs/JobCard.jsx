import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';
import JobStatusBadge from './JobStatusBadge';

const JobCard = ({ job, navigate, onDragStart, onDrop, onDragOver, onDelete }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, job.id)}
    onDrop={(e) => onDrop(e, job.id)}
    onDragOver={onDragOver}
    className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-indigo-500/20 transition-all duration-200"
  >
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-indigo-400 mb-2">{job.title}</h3>
      <div className="flex items-center gap-2">
        <JobStatusBadge status={job.status} />
        <button
          onClick={(e) => { e.stopPropagation(); if (confirm('Delete this job and all related data?')) onDelete && onDelete(job.id); }}
          title="Delete job"
          className="text-red-400 hover:text-red-300 p-1 rounded-md"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
      {job.tags.map(tag => (
        <span key={tag} className="px-2 py-0.5 bg-gray-700 rounded-full">{tag}</span>
      ))}
    </div>
    <div className="text-sm text-gray-500 flex justify-between items-center">
      <span className="font-mono text-xs">Order: {job.order}</span>
      <button
        onClick={() => navigate('jobs/:id', job.id)}
        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
      >
        View Details <ExternalLink className="w-4 h-4 ml-1" />
      </button>
    </div>
  </div>
);

export default JobCard;