// Simple UUID generator
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock Data Structures
export const CANDIDATE_STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];
export const JOB_STATUSES = ["active", "archived"];
export const JOB_TAGS = ["Remote", "Full-Time", "Contract", "Engineering", "Design", "Marketing"];

export const createMockJob = (id, order, status = 'active') => ({
  id: id || generateId(),
  title: `Job Title ${order}`,
  slug: `job-title-${order}`,
  status: status,
  tags: JOB_TAGS.slice(Math.floor(Math.random() * 2), Math.floor(Math.random() * 4) + 2),
  order: order,
  description: `We are looking for a highly motivated Job Title ${order} to join our dynamic team. This role involves exciting challenges in ${JOB_TAGS[order % JOB_TAGS.length].toLowerCase()} and offers great career growth.`,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
});

export const createMockCandidate = (id, jobId, name) => {
  const stageIndex = Math.floor(Math.random() * CANDIDATE_STAGES.length);
  const stage = CANDIDATE_STAGES[stageIndex];
  const appliedDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
  return {
    id: id || generateId(),
    name: name || `Candidate ${id}`,
    email: `candidate.${id}@talentflow.com`,
    jobId: jobId,
    stage: stage,
    appliedDate: appliedDate.toISOString(),
    timeline: [
      { status: 'applied', timestamp: appliedDate.toISOString() },
      ...(stage !== 'applied' ? [{ status: stage, timestamp: new Date(appliedDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() }] : [])
    ],
    notes: []
  };
};

export const createMockAssessment = (jobId) => ({
  jobId: jobId,
  title: `Assessment for Job ${jobId}`,
  sections: [
    {
      id: generateId(),
      title: "Introduction",
      questions: [
        { id: generateId(), type: 'short_text', label: 'What is your expected salary?', required: true },
        { id: generateId(), type: 'single_choice', label: 'Are you legally authorized to work?', required: true, options: ['Yes', 'No'] },
        { id: generateId(), type: 'file_upload_stub', label: 'Upload your CV/Resume (Stub)', required: false },
      ]
    },
    {
      id: generateId(),
      title: "Technical Skills",
      questions: [
        { id: generateId(), type: 'long_text', label: 'Describe a complex project you recently completed.', required: true, maxLength: 1000 },
        { id: generateId(), type: 'numeric_range', label: 'Years of professional experience?', required: true, min: 0, max: 20 },
      ]
    }
  ]
});

export const seedData = () => {
  const initialJobs = Array.from({ length: 25 }, (_, i) => createMockJob(null, i + 1, i < 20 ? 'active' : 'archived'));
  const initialCandidates = [];
  initialJobs.forEach(job => {
    // Seed 40 candidates per job (1000 total)
    for (let i = 0; i < 40; i++) {
      initialCandidates.push(createMockCandidate(generateId(), job.id, `Candi-${job.order}-${i + 1}`));
    }
  });

  const initialAssessments = initialJobs.slice(0, 3).map(job => createMockAssessment(job.id));

  return {
    jobs: initialJobs,
    candidates: initialCandidates,
    assessments: initialAssessments,
    candidateResponses: []
  };
};