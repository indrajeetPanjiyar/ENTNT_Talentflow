import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadData, saveData } from './lib/dataPersistence';
import { useSimulatedApi } from './hooks/useSimulatedApi';

import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './pages/DashboardPage';
import JobsBoard from './pages/JobsBoard';
import JobDetail from './pages/JobDetail';
import CandidatesBoard from './pages/CandidatesBoard';
import CandidateProfile from './pages/CandidateProfile';
import AssessmentsBuilder from './pages/AssessmentsBuilder';


const App = () => {
  console.log("App component rendering");
  
  const [data, setData] = useState({ jobs: [], candidates: [], assessments: [], candidateResponses: [] });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const { simulateRequest, loading, error } = useSimulatedApi();

  
  
  const isFirstSave = useRef(true);
  useEffect(() => {
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    saveData(data).catch(console.error);
  }, [data]);

  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const loaded = await loadData();
        if (mounted && loaded) setData(loaded);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  
  const navigate = (page, id = null) => {
    if (page === 'jobs') setSelectedJobId(null);
    if (page === 'candidates') setSelectedCandidateId(null);
    setCurrentPage(page);
    if (page === 'jobs/:id') setSelectedJobId(id);
    if (page === 'candidates/:id') setSelectedCandidateId(id);
  };

  const getJobById = useCallback((id) => data.jobs.find(j => j.id === id), [data.jobs]);
  const getCandidateById = useCallback((id) => data.candidates.find(c => c.id === id), [data.candidates]);
  const getAssessmentByJobId = useCallback((id) => data.assessments.find(a => a.jobId === id), [data.assessments]);


  const handleUpdateJob = async (job) => {
    const originalJobs = data.jobs;
    const { success } = await simulateRequest(() => {
      setData(prev => {
        const isNew = !prev.jobs.find(j => j.id === job.id);
        let updatedJobs;
        if (isNew) {
          updatedJobs = [...prev.jobs, job];
        } else {
          updatedJobs = prev.jobs.map(j => (j.id === job.id ? job : j));
        }
        return { ...prev, jobs: updatedJobs };
      });
      return job;
    }, true);

    if (!success) {
      console.error("Update Job failed, rolling back.");
      setData(prev => ({ ...prev, jobs: originalJobs }));
    }
    return success;
  };

  const handleUpdateCandidate = async (candidate) => {
    const originalCandidates = data.candidates;
    const { success } = await simulateRequest(() => {
      setData(prev => {
        const updatedCandidates = prev.candidates.map(c => (c.id === candidate.id ? candidate : c));
        return { ...prev, candidates: updatedCandidates };
      });
      return candidate;
    }, true);

    if (!success) {
      console.error("Update Candidate failed, rolling back.");
      setData(prev => ({ ...prev, candidates: originalCandidates }));
    }
    return success;
  };

  const handleCandidateStageUpdate = (candidate) => {
    
    setData(prev => {
      const updatedCandidates = prev.candidates.map(c => (c.id === candidate.id ? candidate : c));
      return { ...prev, candidates: updatedCandidates };
    });
  };

  const handleJobReorder = async (jobId, newOrder) => {
    const originalJobs = data.jobs;
    const draggedJob = data.jobs.find(j => j.id === jobId);
    if (!draggedJob) return;
    const oldOrder = draggedJob.order;

    
    const newJobs = data.jobs.map(j => {
      if (j.id === jobId) {
        return { ...j, order: newOrder };
      }
      if (oldOrder < newOrder && j.order > oldOrder && j.order <= newOrder) {
        return { ...j, order: j.order - 1 };
      }
      if (oldOrder > newOrder && j.order < oldOrder && j.order >= newOrder) {
        return { ...j, order: j.order + 1 };
      }
      return j;
    }).sort((a, b) => a.order - b.order);

    setData(prev => ({ ...prev, jobs: newJobs }));

    
    const { success } = await simulateRequest(() => {
      
      return { fromOrder: oldOrder, toOrder: newOrder };
    }, true);

    
    if (!success) {
      console.error("Job Reorder failed, rolling back.");
      setData(prev => ({ ...prev, jobs: originalJobs }));
    }
  };

  const handleDeleteJob = async (jobId) => {
    const originalJobs = data.jobs;
    const originalAssessments = data.assessments;
    const originalCandidates = data.candidates;

    
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.filter(j => j.id !== jobId),
      assessments: prev.assessments.filter(a => a.jobId !== jobId),
      candidates: prev.candidates.filter(c => c.jobId !== jobId),
    }));

    const { success } = await simulateRequest(() => ({ deleted: jobId }), true);

    if (!success) {
      console.error('Delete job failed, rolling back.');
      setData(prev => ({ ...prev, jobs: originalJobs, assessments: originalAssessments, candidates: originalCandidates }));
      return false;
    }
    return true;
  };

  const handleSaveAssessment = async (assessment) => {
    const originalAssessments = data.assessments;
    const isNew = !data.assessments.find(a => a.jobId === assessment.jobId);

    const { success } = await simulateRequest(() => {
      setData(prev => {
        let updatedAssessments;
        if (isNew) {
          updatedAssessments = [...prev.assessments, assessment];
        } else {
          updatedAssessments = prev.assessments.map(a => (a.jobId === assessment.jobId ? assessment : a));
        }
        return { ...prev, assessments: updatedAssessments };
      });
    }, true);

    if (!success) {
      console.error("Save Assessment failed, rolling back.");
      setData(prev => ({ ...prev, assessments: originalAssessments }));
    }
  };

  const renderContent = () => {
    if (currentPage === 'jobs') return <JobsBoard data={data} navigate={navigate} onJobReorder={handleJobReorder} onUpdateJob={handleUpdateJob} onDeleteJob={handleDeleteJob} />;
    if (currentPage === 'jobs/:id' && selectedJobId) return <JobDetail job={getJobById(selectedJobId)} navigate={navigate} onUpdateJob={handleUpdateJob} allCandidates={data.candidates} />;
    if (currentPage === 'candidates') return <CandidatesBoard data={data} navigate={navigate} onCandidateStageUpdate={handleCandidateStageUpdate} />;
  if (currentPage === 'candidates/:id' && selectedCandidateId) return <CandidateProfile candidate={getCandidateById(selectedCandidateId)} allJobs={data.jobs} onUpdateCandidate={handleUpdateCandidate} navigate={navigate} />;
    if (currentPage === 'assessments') return <AssessmentsBuilder data={data} onSaveAssessment={handleSaveAssessment} allJobs={data.jobs} getAssessmentByJobId={getAssessmentByJobId} />;

  return <DashboardPage navigate={navigate} data={data} />;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-inter">
      <Sidebar currentPage={currentPage} navigate={navigate} />
      <main className="flex-1 overflow-auto p-4 md:p-8">
  <Header currentPage={currentPage} loading={loading} error={error} navigate={navigate} />
        <div className="mt-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;