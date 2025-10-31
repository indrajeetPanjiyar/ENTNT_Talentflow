import React, { useState, useEffect } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { generateId, JOB_TAGS } from '../../data/seed';

const JobModal = ({ isOpen, onClose, job, onSave, setEditingJob, nextOrder }) => {
  const [form, setForm] = useState({
    title: '', slug: '', tags: [], status: 'active', description: '',
  });
  const [error, setError] = useState({});

  useEffect(() => {
    if (job) {
      setForm(job);
    } else {
      setForm({ title: '', slug: '', tags: [], status: 'active', description: '' });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'title' && !job) {
      setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
    }
    setError(prev => ({ ...prev, [name]: '' }));
  };

  const handleTagChange = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!form.title) newErrors.title = 'Title is required.';
    if (!form.slug) newErrors.slug = 'Slug is required.';
    
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newJob = {
      ...form,
      id: form.id || generateId(),
      order: form.order !== undefined ? form.order : nextOrder, // New jobs go to the end
      createdAt: form.createdAt || new Date().toISOString()
    };
    
    const success = await onSave(newJob);
    if (success) {
      onClose();
      setEditingJob(null);
    } else {
      setError(prev => ({ ...prev, submit: 'Failed to save job. Please try again.' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      {/* Modal container: responsive max width, limited max-height and internal scroll when needed */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700 transform transition-all max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">{job ? 'Edit Job' : 'Create New Job'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
            {error.title && <p className="text-red-400 text-xs mt-1">{error.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Slug <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              readOnly={!!job} // Slug is not editable after creation
              className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            />
            {error.slug && <p className="text-red-400 text-xs mt-1">{error.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {JOB_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    form.tags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div>
              {job && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this job and all related data?')) {
                      onClose();
                      setEditingJob(null);
                      onDelete && onDelete(job.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors mr-3"
                >
                  <Trash2 className="w-4 h-4 inline-block mr-2" /> Delete
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/50"
              >
                <Check className="w-5 h-5 mr-1" /> {job ? 'Save Changes' : 'Create Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;