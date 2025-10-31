import { http, HttpResponse, delay } from 'msw';
import { dbOperations } from '../lib/indexedDB';

// Add artificial delay and random errors to simulate real API
const simulateNetworkConditions = async () => {
  // Add random delay between 200-1200ms
  await delay(Math.floor(Math.random() * 1000) + 200);
  
  // 8% error rate for write operations
  const shouldError = Math.random() < 0.08;
  return shouldError;
};

export const handlers = [
  // Jobs handlers
  http.get('/api/jobs', async () => {
    await simulateNetworkConditions();
    try {
      const jobs = await dbOperations.getAllJobs();
      return HttpResponse.json(jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return HttpResponse.json([]);
    }
  }),

  http.post('/api/jobs', async ({ request }) => {
    const shouldError = await simulateNetworkConditions();
    if (shouldError) {
      return new HttpResponse(null, { status: 500 });
    }
    
    try {
      const job = await request.json();
      await dbOperations.updateJob(job);
      return HttpResponse.json(job);
    } catch (error) {
      console.error('Error creating job:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.put('/api/jobs/:id', async ({ params, request }) => {
    const shouldError = await simulateNetworkConditions();
    if (shouldError) {
      return new HttpResponse(null, { status: 500 });
    }
    
    try {
      const job = await request.json();
      await dbOperations.updateJob(job);
      return HttpResponse.json(job);
    } catch (error) {
      console.error('Error updating job:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),
  
  http.patch('/api/jobs/:id/reorder', async ({ params, request }) => {
    const shouldError = await simulateNetworkConditions();
    if (shouldError) {
      return new HttpResponse(null, { status: 500 });
    }
    
    try {
      const { fromOrder, toOrder } = await request.json();
      const jobs = await dbOperations.getAllJobs();
      
      // Update job orders
      const updatedJobs = jobs.map(job => {
        if (job.order === fromOrder) {
          return { ...job, order: toOrder };
        }
        return job;
      });
      
      // Save all updated jobs
      await Promise.all(updatedJobs.map(job => dbOperations.updateJob(job)));
      
      return HttpResponse.json({ success: true });
    } catch (error) {
      console.error('Error reordering job:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  // Candidates handlers
  http.get('/api/candidates', async () => {
    await simulateNetworkConditions();
    try {
      const candidates = await dbOperations.getAllCandidates();
      return HttpResponse.json(candidates || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return HttpResponse.json([]);
    }
  }),

  http.post('/api/candidates', async ({ request }) => {
    const shouldError = await simulateNetworkConditions();
    if (shouldError) {
      return new HttpResponse(null, { status: 500 });
    }
    
    try {
      const candidate = await request.json();
      await dbOperations.updateCandidate(candidate);
      return HttpResponse.json(candidate);
    } catch (error) {
      console.error('Error creating candidate:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.put('/api/candidates/:id', async ({ params, request }) => {
    const shouldError = await simulateNetworkConditions();
    if (shouldError) {
      return new HttpResponse(null, { status: 500 });
    }
    
    try {
      const candidate = await request.json();
      await dbOperations.updateCandidate(candidate);
      return HttpResponse.json(candidate);
    } catch (error) {
      console.error('Error updating candidate:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    await simulateNetworkConditions();
    try {
      const candidate = await dbOperations.getCandidate(params.id);
      return HttpResponse.json(candidate?.timeline || []);
    } catch (error) {
      console.error('Error fetching candidate timeline:', error);
      return HttpResponse.json([]);
    }
  }),

  // Assessments handlers
  http.get('/api/assessments', async () => {
    await simulateNetworkConditions();
    try {
      const assessments = await dbOperations.getAllAssessments();
      return HttpResponse.json(assessments || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return HttpResponse.json([]);
    }
  }),

  http.get('/api/assessments/:jobId', async ({ params }) => {
    await simulateNetworkConditions();
    try {
      const assessment = await dbOperations.getAssessment(params.jobId);
      return HttpResponse.json(assessment || null);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      return HttpResponse.json(null);
    }
  }),

  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    const shouldError = await simulateNetworkConditions();
    if (shouldError) {
      return new HttpResponse(null, { status: 500 });
    }
    
    try {
      const assessment = await request.json();
      await dbOperations.updateAssessment(assessment);
      return HttpResponse.json(assessment);
    } catch (error) {
      console.error('Error updating assessment:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    const shouldError = await simulateNetworkConditions();
    if (shouldError) {
      return new HttpResponse(null, { status: 500 });
    }
    
    try {
      const response = await request.json();
      await dbOperations.addCandidateResponse({
        id: `${params.jobId}-${response.candidateId}`,
        jobId: params.jobId,
        candidateId: response.candidateId,
        responses: response.responses,
        submittedAt: new Date().toISOString()
      });
      return HttpResponse.json({ success: true });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),
];