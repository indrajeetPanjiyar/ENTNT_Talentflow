import { openDB } from 'idb';
import { seedData } from '../data/seed';

const DB_NAME = 'talentFlowDB';
const DB_VERSION = 1;

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores
      db.createObjectStore('jobs', { keyPath: 'id' });
      db.createObjectStore('candidates', { keyPath: 'id' });
      db.createObjectStore('assessments', { keyPath: 'jobId' });
      db.createObjectStore('candidateResponses', { keyPath: 'id' });
    },
  });

  // Check if data needs to be seeded
  const isEmpty = await isDBEmpty();
  if (isEmpty) {
    console.log("Seeding initial data to IndexedDB");
    await seedInitialData();
  }

  return db;
};

const isDBEmpty = async () => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction('jobs', 'readonly');
  const store = tx.objectStore('jobs');
  const count = await store.count();
  await tx.done;
  return count === 0;
};

export const seedInitialData = async () => {
  const data = seedData();
  const db = await openDB(DB_NAME, DB_VERSION);

  // Use a transaction for all stores
  const tx = db.transaction(['jobs', 'candidates', 'assessments'], 'readwrite');

  // Add all jobs
  await Promise.all(data.jobs.map(job => tx.objectStore('jobs').add(job)));

  // Add all candidates
  await Promise.all(data.candidates.map(candidate => tx.objectStore('candidates').add(candidate)));

  // Add all assessments
  await Promise.all(data.assessments.map(assessment => tx.objectStore('assessments').add(assessment)));

  await tx.done;
  return data;
};

export const dbOperations = {
  async getAllJobs() {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.getAll('jobs');
  },

  async getAllCandidates() {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.getAll('candidates');
  },

  async getAllAssessments() {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.getAll('assessments');
  },

  async getJob(id) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.get('jobs', id);
  },

  async updateJob(job) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.put('jobs', job);
  },

  async addCandidate(candidate) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.add('candidates', candidate);
  },

  async updateCandidate(candidate) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.put('candidates', candidate);
  },

  async addAssessment(assessment) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.add('assessments', assessment);
  },

  async updateAssessment(assessment) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.put('assessments', assessment);
  },

  async getAssessment(jobId) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.get('assessments', jobId);
  },

  async getCandidate(id) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.get('candidates', id);
  },

  async addCandidateResponse(response) {
    const db = await openDB(DB_NAME, DB_VERSION);
    return db.put('candidateResponses', response);
  },

  async getCandidateResponses(candidateId) {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction('candidateResponses', 'readonly');
    const store = tx.objectStore('candidateResponses');
    return store.getAll();
  }
};