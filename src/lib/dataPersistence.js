import { initDB, dbOperations, seedInitialData } from './indexedDB';

// Ensure DB is initialized and contains data
const ensureDBInitialized = async () => {
  try {
    // Initialize DB if not already done
    await initDB();
    
    // Check if we have data
    const jobs = await dbOperations.getAllJobs();
    if (!jobs || jobs.length === 0) {
      console.log("No data found, seeding initial data");
      await seedInitialData();
    }
  } catch (error) {
    console.error('Failed to access DB:', error);
    throw error;
  }
};

export const loadData = async () => {
  try {
    await ensureDBInitialized();

    const [jobs, candidates, assessments] = await Promise.all([
      dbOperations.getAllJobs(),
      dbOperations.getAllCandidates(),
      dbOperations.getAllAssessments()
    ]);

    return {
      jobs: jobs || [],
      candidates: candidates || [],
      assessments: assessments || [],
      candidateResponses: []
    };
  } catch (e) {
    console.error("Error loading data:", e);
    throw e;
  }
};

export const saveData = async (data) => {
  if (!data) {
    console.error("No data provided to save");
    return;
  }

  try {
    await ensureDBInitialized();
    const promises = [];

    if (Array.isArray(data.jobs)) {
      promises.push(...data.jobs.map(job => dbOperations.updateJob(job)));
    }

    if (Array.isArray(data.candidates)) {
      promises.push(...data.candidates.map(candidate => dbOperations.updateCandidate(candidate)));
    }

    if (Array.isArray(data.assessments)) {
      promises.push(...data.assessments.map(assessment => dbOperations.updateAssessment(assessment)));
    }

    await Promise.all(promises);
  } catch (e) {
    console.error("Error saving data:", e);
    throw e;
  }
};