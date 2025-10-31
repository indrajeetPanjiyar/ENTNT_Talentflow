import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { QUESTION_TYPES } from '../../data/assessmentData';
import AssessmentQuestion from './AssessmentQuestion';

const AssessmentSection = ({ section, onSectionChange, onQuestionChange, onAddQuestion, onDeleteSection, onDeleteQuestion }) => {
  const [newQType, setNewQType] = useState(QUESTION_TYPES[0].value);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-gray-700 pb-3 gap-3">
        <input
          type="text"
          value={section.title}
          onChange={(e) => onSectionChange(section.id, 'title', e.target.value)}
          className="text-2xl font-bold text-indigo-400 bg-transparent focus:outline-none focus:ring-0 w-full md:w-3/4"
        />
        <button onClick={() => onDeleteSection(section.id)} className="text-red-400 hover:text-red-300">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {section.questions.map(q => (
          <AssessmentQuestion
            key={q.id}
            sectionId={section.id}
            question={q}
            onQuestionChange={onQuestionChange}
            onDeleteQuestion={onDeleteQuestion}
            allQuestions={section.questions}
          />
        ))}
      </div>

      <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-gray-700">
        <select
          value={newQType}
          onChange={(e) => setNewQType(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-xl p-2 text-white text-sm"
        >
          {QUESTION_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <button
          onClick={() => onAddQuestion(section.id, newQType)}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Question
        </button>
      </div>
    </div>
  );
};

export default AssessmentSection;