import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { CANDIDATE_STAGES } from '../data/seed';
import KanbanColumn from '../components/Candidates/KanbanColumn';
import CandidatesList from '../components/Candidates/CandidatesList';


const CandidatesBoard = ({ data, navigate, onCandidateStageUpdate }) => {
  const [view, setView] = useState('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedCandidateId, setDraggedCandidateId] = useState(null);

  
  const filteredCandidates = useMemo(() => {
    let result = data.candidates;

    if (searchTerm) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    
    return result;
  }, [data.candidates, searchTerm]);

  const candidatesByStage = useMemo(() => {
    return CANDIDATE_STAGES.reduce((acc, stage) => {
      acc[stage] = filteredCandidates.filter(c => c.stage === stage);
      return acc;
    }, {});
  }, [filteredCandidates]);

  const handleDragStart = (e, candidateId) => {
    setDraggedCandidateId(candidateId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (!draggedCandidateId) return;

    const candidateToMove = data.candidates.find(c => c.id === draggedCandidateId);

    if (candidateToMove && candidateToMove.stage !== targetStage) {
      const newCandidate = {
        ...candidateToMove,
        stage: targetStage,
        timeline: [...candidateToMove.timeline, { status: targetStage, timestamp: new Date().toISOString() }]
      };
      
      onCandidateStageUpdate(newCandidate);
    }
    setDraggedCandidateId(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="relative w-full md:w-80 mb-4 md:mb-0">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 1000+ candidates by name/email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl py-2 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('kanban')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Kanban View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            List View
          </button>
        </div>
      </div>

      {view === 'kanban' && (
        <div className="flex space-x-6 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
          {CANDIDATE_STAGES.map(stage => (
            <KanbanColumn
              key={stage}
              stage={stage}
              candidates={candidatesByStage[stage]}
              navigate={navigate}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>
      )}

      {view === 'list' && (
        <CandidatesList candidates={filteredCandidates} navigate={navigate} />
      )}
    </div>
  );
};

export default CandidatesBoard;