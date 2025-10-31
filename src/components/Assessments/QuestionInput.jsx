import React from 'react';
import { Plus } from 'lucide-react';

// Question Input Component (Runtime)
const QuestionInput = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'short_text':
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
        />
      );
    case 'long_text':
      return (
        <textarea
          rows="4"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={question.maxLength}
          placeholder={`Max ${question.maxLength} characters.`}
          className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
        />
      );
    case 'numeric_range':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          min={question.min}
          max={question.max}
          className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
        />
      );
    case 'single_choice':
      return (
        <div className="space-y-2">
          {question.options.map(option => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`${question.id}-${option}`}
                name={question.id}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <label htmlFor={`${question.id}-${option}`} className="ml-3 text-sm text-gray-300">{option}</label>
            </div>
          ))}
        </div>
      );
    case 'multi_choice':
      return (
        <div className="space-y-2">
          {question.options.map(option => (
            <div key={option} className="flex items-center">
              <input
                type="checkbox"
                id={`${question.id}-${option}`}
                checked={Array.isArray(value) && value.includes(option)}
                onChange={(e) => {
                  let newValue = Array.isArray(value) ? [...value] : [];
                  if (e.target.checked) {
                    newValue.push(option);
                  } else {
                    newValue = newValue.filter(item => item !== option);
                  }
                  onChange(newValue);
                }}
                className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor={`${question.id}-${option}`} className="ml-3 text-sm text-gray-300">{option}</label>
            </div>
          ))}
        </div>
      );
    case 'file_upload_stub':
      return (
        <div className="flex flex-col items-center">
          <label className="w-full">
            <div className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center text-gray-400 cursor-pointer">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <p>Click to select a file</p>
              <input
                type="file"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  if (!f) return onChange(null);
                  const reader = new FileReader();
                  reader.onload = () => {
                    // pass a small file descriptor and data URL to the parent
                    onChange({ name: f.name, type: f.type, size: f.size, dataUrl: reader.result });
                  };
                  reader.readAsDataURL(f);
                }}
                className="hidden"
              />
            </div>
          </label>
          {value && typeof value === 'object' && (
            <div className="mt-3 w-full text-left bg-gray-800 p-3 rounded-md border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-200">{value.name} <span className="text-xs text-gray-400">({Math.round((value.size||0)/1024)} KB)</span></div>
                <div className="flex items-center gap-2">
                  <a href={value.dataUrl} download={value.name} className="text-indigo-300 hover:underline text-sm">Download</a>
                  <button onClick={() => onChange(null)} className="text-red-400 text-sm">Remove</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    default:
      return <p className="text-red-400">Unknown Question Type</p>;
  }
};

export default QuestionInput;