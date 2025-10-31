import React from 'react';
import CandidateCard from './CandidateCard';

const KanbanColumn = ({ stage, candidates, navigate, onDragStart, onDrop, onDragOver }) => (
  <div
    onDrop={(e) => onDrop(e, stage)}
    onDragOver={onDragOver}
    className="flex-1 min-w-80 bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-700 flex flex-col"
  >
    <h3 className="text-lg font-bold mb-4 capitalize flex justify-between items-center">
      {stage.replace(/([A-Z])/g, ' $1').trim()}
      <span className="text-indigo-400 font-mono text-sm">{candidates.length}</span>
    </h3>
    <div className="overflow-y-auto h-full space-y-3 p-1">
      {candidates.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          navigate={navigate}
          onDragStart={onDragStart}
        />
      ))}
      {candidates.length === 0 && (
          <div className="text-center p-8 text-gray-500 border border-dashed border-gray-700 rounded-xl">
              Drop candidates here
          </div>
      )}
    </div>
  </div>
);

export default KanbanColumn;