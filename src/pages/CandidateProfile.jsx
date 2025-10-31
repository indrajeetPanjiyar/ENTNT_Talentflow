import React, { useState } from 'react';
import { CANDIDATE_STAGES, generateId } from '../data/seed';

const CandidateProfile = ({ candidate, allJobs, onUpdateCandidate, navigate }) => {
  const job = allJobs.find(j => j.id === candidate.jobId);
  const [noteText, setNoteText] = useState('');
  const [mentions] = useState(['HR Lead Alex', 'Tech Manager Ben', 'Recruiter Claire']); // Local list for @mentions

  const handleStageChange = async (e) => {
    const newStage = e.target.value;
    if (newStage !== candidate.stage) {
      const newCandidate = {
        ...candidate,
        stage: newStage,
        timeline: [...candidate.timeline, { status: newStage, timestamp: new Date().toISOString() }]
      };
      await onUpdateCandidate(newCandidate);
    }
  };

  const handleAddNote = async () => {
    if (noteText.trim() === '') return;

    const newNote = {
      id: generateId(),
      author: 'Current User', // Mock user
      content: noteText.trim(),
      timestamp: new Date().toISOString()
    };

    const newCandidate = {
      ...candidate,
      notes: [newNote, ...candidate.notes]
    };

    await onUpdateCandidate(newCandidate);
    setNoteText('');
  };

  if (!candidate) return <div className="text-red-400">Candidate not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profile and Stage */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{candidate.name}</h1>
              <p className="text-indigo-400 mb-4">{candidate.email}</p>
              <p className="text-sm text-gray-400">
                Applied for: <span className="font-medium text-white">{job?.title || 'N/A'}</span>
              </p>
            </div>
            <select
              value={candidate.stage}
              onChange={handleStageChange}
              className="px-4 py-2 rounded-xl text-white font-semibold transition-colors bg-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {CANDIDATE_STAGES.map(stage => (
                <option key={stage} value={stage} className="bg-gray-700 capitalize">
                  {stage.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Timeline of Status Changes</h2>
          <ol className="relative border-l border-gray-700">
            {candidate.timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((item, index) => (
              <li key={index} className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-3 h-3 bg-indigo-600 rounded-full -left-1.5 ring-4 ring-gray-900"></span>
                <p className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                <h3 className="text-lg font-semibold text-white capitalize">{item.status.replace(/([A-Z])/g, ' $1').trim()}</h3>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Notes/Mentions */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Notes & Mentions</h2>
          <div className="relative mb-4">
            <textarea
              rows="3"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a private note... type @ for mention suggestions"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
            {noteText.includes('@') && (
              <div className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-xl mt-1 shadow-lg">
                <p className="text-sm text-gray-400 p-2 border-b border-gray-600">Mention suggestions (just render):</p>
                {mentions.map(mention => (
                  <div
                    key={mention}
                    onClick={() => setNoteText(noteText.replace(/@\w*$/, `@${mention} `))}
                    className="p-2 text-sm text-white hover:bg-indigo-600 cursor-pointer"
                  >
                    @{mention}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleAddNote}
            className="w-full py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            disabled={noteText.trim() === ''}
          >
            Add Note
          </button>

          <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2">
            {candidate.notes.length === 0 && <p className="text-gray-500 text-sm">No notes yet.</p>}
            {candidate.notes.map(note => (
              <div key={note.id} className="bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-300">
                  {note.content.split(' ').map((word, i) =>
                    word.startsWith('@') && mentions.some(m => word.includes(m))
                      ? <span key={i} className="text-indigo-400 font-semibold">{word} </span>
                      : <span key={i}>{word} </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {note.author} on {new Date(note.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;