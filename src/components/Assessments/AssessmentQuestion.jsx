import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

const AssessmentQuestion = ({ sectionId, question, onQuestionChange, onDeleteQuestion, allQuestions }) => {
  const isOptionType = question.type === 'single_choice' || question.type === 'multi_choice';
  const isNumeric = question.type === 'numeric_range';

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onQuestionChange(sectionId, question.id, 'options', newOptions);
  };

  const addOption = () => onQuestionChange(sectionId, question.id, 'options', [...question.options, `Option ${question.options.length + 1}`]);
  const deleteOption = (index) => onQuestionChange(sectionId, question.id, 'options', question.options.filter((_, i) => i !== index));

  
  const [showConditional, setShowConditional] = useState(false);

  return (
    <div className="bg-gray-700 p-4 rounded-xl shadow-inner border border-gray-600 space-y-3">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={question.label}
          onChange={(e) => onQuestionChange(sectionId, question.id, 'label', e.target.value)}
          className="text-base font-medium text-white bg-transparent focus:outline-none focus:ring-0 w-3/4"
        />
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-400">Required</label>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onQuestionChange(sectionId, question.id, 'required', e.target.checked)}
            className="rounded text-indigo-600 bg-gray-600 border-gray-500 focus:ring-indigo-500"
          />
          <button onClick={() => onDeleteQuestion(sectionId, question.id)} className="text-red-400 hover:text-red-300">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOptionType && (
        <div className="space-y-2 pl-4">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg p-2 text-sm text-white"
              />
              <button onClick={() => deleteOption(index)} className="text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addOption} className="text-indigo-400 text-sm hover:text-indigo-300">
            + Add Option
          </button>
        </div>
      )}

      {isNumeric && (
        <div className="flex space-x-4 pl-4 text-sm text-gray-400">
          <div>
            <label>Min</label>
            <input type="number" value={question.min} onChange={(e) => onQuestionChange(sectionId, question.id, 'min', parseInt(e.target.value))} className="w-20 bg-gray-600 border-gray-500 rounded-lg p-1 text-white ml-2" />
          </div>
          <div>
            <label>Max</label>
            <input type="number" value={question.max} onChange={(e) => onQuestionChange(sectionId, question.id, 'max', parseInt(e.target.value))} className="w-20 bg-gray-600 border-gray-500 rounded-lg p-1 text-white ml-2" />
          </div>
        </div>
      )}

      {/* Conditional Logic UI Stub */}
      <div className="pt-2 border-t border-gray-600">
          <button onClick={() => setShowConditional(!showConditional)} className="text-sm text-indigo-400 hover:text-indigo-300">
              {showConditional ? 'Hide Conditional Logic' : 'Add Conditional Logic'}
          </button>
          {showConditional && (
              <div className="mt-2 text-sm bg-gray-600 p-3 rounded-lg text-gray-300">
                  Show this question ONLY if:
                  <select className="bg-gray-500 border-gray-400 rounded-lg p-1 text-sm text-white ml-2 mr-2">
                      {allQuestions.filter(q => q.id !== question.id).map(q => <option key={q.id} value={q.id}>{q.label.substring(0, 20)}...</option>)}
                  </select>
                  is
                  <select className="bg-gray-500 border-gray-400 rounded-lg p-1 text-sm text-white ml-2 mr-2">
                      <option value="equals">equals</option>
                  </select>
                  <input type="text" placeholder="Value" className="w-24 bg-gray-500 border-gray-400 rounded-lg p-1 text-sm text-white ml-2" />
                  <p className="text-xs mt-1 text-gray-400">*Conditional Logic (Q3 only if $Q1==="Yes"$) feature stub.*</p>
              </div>
          )}
      </div>

    </div>
  );
};

export default AssessmentQuestion;