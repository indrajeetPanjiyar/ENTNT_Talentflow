import React from 'react';
import QuestionInput from './QuestionInput';

const AssessmentForm = ({ assessment, answers, onAnswerChange }) => {
  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-indigo-400 mb-6">{assessment.title}</h1>

      {assessment.sections.map(section => (
        <div key={section.id} className="mb-8 border-b border-gray-700 pb-6">
          <h2 className="text-2xl font-bold mb-4 text-white">{section.title}</h2>
          <div className="space-y-6">
            {section.questions.map(q => {
              
              const shouldShow = true;

              if (!shouldShow) return null;

              return (
                <div key={q.id}>
                  <label className="block text-white font-medium mb-2">
                    {q.label} {q.required && <span className="text-red-500">*</span>}
                    {q.type === 'numeric_range' && <span className="text-sm text-gray-400 ml-2">({q.min} to {q.max})</span>}
                  </label>
                  <QuestionInput
                    question={q}
                    value={answers[q.id] || ''}
                    onChange={(val) => onAnswerChange(q.id, val)}
                  />
                  {/* Validation message stub */}
                  {q.required && !answers[q.id] && <p className="text-red-400 text-xs mt-1">This field is required.</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssessmentForm;