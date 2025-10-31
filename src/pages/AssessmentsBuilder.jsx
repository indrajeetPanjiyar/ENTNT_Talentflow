import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { QUESTION_TYPES, getInitialQuestion } from '../data/assessmentData';
import AssessmentSection from '../components/Assessments/AssessmentSection';
import AssessmentForm from '../components/Assessments/AssessmentForm';

const AssessmentsBuilder = ({ data, onSaveAssessment, allJobs = [], getAssessmentByJobId = () => null }) => {
  const [selectedJobId, setSelectedJobId] = useState(() => allJobs?.[0]?.id || '');
  const [assessment, setAssessment] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (selectedJobId) {
      let currentAssessment = typeof getAssessmentByJobId === 'function' ? getAssessmentByJobId(selectedJobId) : null;
      if (!currentAssessment) {
        // Create a new empty assessment structure if none exists
        currentAssessment = { 
            jobId: selectedJobId, 
            title: `Assessment for ${allJobs.find(j => j.id === selectedJobId)?.title || 'Job'}`, 
            sections: [] 
        };
      }
      setAssessment(currentAssessment);
      setIsPreview(false);
    }
  }, [selectedJobId, data.assessments, allJobs, getAssessmentByJobId]);

  const handleAssessmentChange = (key, value) => {
    setAssessment(prev => ({ ...prev, [key]: value }));
  };

  const handleSectionChange = (sectionId, key, value) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s => (s.id === sectionId ? { ...s, [key]: value } : s))
    }));
  };

  const handleQuestionChange = (sectionId, questionId, key, value) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            questions: s.questions.map(q => (q.id === questionId ? { ...q, [key]: value } : q))
          };
        }
        return s;
      })
    }));
  };

  const addSection = () => {
    setAssessment(prev => ({
      ...prev,
      sections: [...prev.sections, { id: getInitialQuestion('section').id, title: `New Section ${prev.sections.length + 1}`, questions: [] }]
    }));
  };

  const addQuestion = (sectionId, type) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId) {
          return { ...s, questions: [...s.questions, getInitialQuestion(type)] };
        }
        return s;
      })
    }));
  };

  const deleteSection = (sectionId) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const deleteQuestion = (sectionId, questionId) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId) {
          return { ...s, questions: s.questions.filter(q => q.id !== questionId) };
        }
        return s;
      })
    }));
  };

  const saveAssessment = () => {
    if (assessment) {
      onSaveAssessment(assessment);
      setIsPreview(true); // Switch to preview after save
    }
  };

  // Preview Form State (simplified, just for demonstration)
  const [previewAnswers, setPreviewAnswers] = useState({});

  const handlePreviewAnswerChange = (questionId, value) => {
    setPreviewAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  if (!allJobs.length) return <div className="text-gray-400">Please create a job first to build an assessment.</div>;
  if (!assessment) return <div className="text-gray-400">Loading assessment...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
          >
            {allJobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <input
            type="text"
            value={assessment.title}
            onChange={(e) => handleAssessmentChange('title', e.target.value)}
            placeholder="Assessment Title"
            className="bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setIsPreview(false)}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!isPreview ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Builder
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isPreview ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Live Preview
          </button>
          <button
            onClick={saveAssessment}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Check className="w-5 h-5 mr-1" /> Save Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Builder Panel */}
        {!isPreview && (
          <div className="lg:col-span-2 space-y-4">
            {assessment.sections.map(section => (
              <AssessmentSection
                key={section.id}
                section={section}
                onSectionChange={handleSectionChange}
                onQuestionChange={handleQuestionChange}
                onAddQuestion={addQuestion}
                onDeleteSection={deleteSection}
                onDeleteQuestion={deleteQuestion}
              />
            ))}
            <div className="flex justify-center pt-4">
              <button
                onClick={addSection}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-1" /> Add Section
              </button>
            </div>
          </div>
        )}

        {/* Live Preview Panel */}
        {isPreview && (
          <div className="lg:col-span-3">
            <AssessmentForm
              assessment={assessment}
              answers={previewAnswers}
              onAnswerChange={handlePreviewAnswerChange}
            />
            <div className="mt-6 flex justify-center">
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
                    Submit Assessment (Stub)
                </button>
            </div>
          </div>
        )}

        {/* Question Type Chooser (Hidden in preview) */}
    {!isPreview && (
      <div className="lg:col-span-1 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-fit lg:sticky lg:top-4">
                <h2 className="text-xl font-bold mb-4 text-white">Add Question Type</h2>
                <p className="text-sm text-gray-400 mb-4">Select a type to add it to a section.</p>
                <div className="space-y-2">
                    {QUESTION_TYPES.map(type => (
                        <div key={type.value} className="flex items-center p-3 bg-gray-700 rounded-xl">
                            <type.icon className="w-5 h-5 mr-3 text-indigo-400" />
                            <span className="text-white">{type.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentsBuilder;