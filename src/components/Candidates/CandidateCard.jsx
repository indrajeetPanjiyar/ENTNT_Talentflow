import React from 'react';

const CandidateCard = ({ candidate, navigate, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, candidate.id)}
    onClick={() => navigate('candidates/:id', candidate.id)}
    className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600 mb-3 cursor-pointer hover:bg-gray-600 transition-colors"
  >
    <h4 className="font-semibold text-white truncate">{candidate.name}</h4>
    <p className="text-xs text-gray-400 truncate mt-1">{candidate.email}</p>
    <p className="text-xs text-indigo-400 mt-2">Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</p>
  </div>
);

export default CandidateCard;