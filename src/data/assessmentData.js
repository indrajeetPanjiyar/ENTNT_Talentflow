import {
  Briefcase, Plus, ArrowUpDown,
  Check, Clipboard, FileText
} from 'lucide-react';
import { generateId } from './seed';

export const QUESTION_TYPES = [
  { value: 'single_choice', label: 'Single Choice', icon: Check },
  { value: 'multi_choice', label: 'Multi Choice', icon: Clipboard },
  { value: 'short_text', label: 'Short Text', icon: FileText },
  { value: 'long_text', label: 'Long Text', icon: Briefcase },
  { value: 'numeric_range', label: 'Numeric with Range', icon: ArrowUpDown },
  { value: 'file_upload_stub', label: 'File Upload (Stub)', icon: Plus },
];

export const getInitialQuestion = (type) => {
  const base = { id: generateId(), type, label: 'New Question', required: false };
  if (type === 'single_choice' || type === 'multi_choice') {
    return { ...base, options: ['Option 1', 'Option 2'] };
  }
  if (type === 'numeric_range') {
    return { ...base, min: 0, max: 100 };
  }
  if (type === 'long_text') {
    return { ...base, maxLength: 500 };
  }
  return base;
};