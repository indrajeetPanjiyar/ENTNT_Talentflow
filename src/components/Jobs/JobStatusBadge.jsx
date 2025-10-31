import React from 'react';

const JobStatusBadge = ({ status }) => {
  const colors = {
    active: 'bg-green-600/20 text-green-400',
    archived: 'bg-red-600/20 text-red-400',
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase ${colors[status] || 'bg-gray-600/20 text-gray-400'}`}>
      {status}
    </span>
  );
};

export default JobStatusBadge;