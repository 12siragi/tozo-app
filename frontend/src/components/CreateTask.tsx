// CreateTask.tsx
import React, { useState } from 'react';
import { createTask } from '../api/taskAPI';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  deadline: string;
  category: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  owner: string;
}

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [owner, setOwner] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTask = { title, description, priority, deadline, category, owner, is_completed: false, is_deleted: false };
    
    try {
      await createTask(newTask);
      setSuccessMessage('Task created successfully');
      // Reset form fields
      setTitle('');
      setDescription('');
      setPriority('');
      setDeadline('');
      setCategory('');
      setOwner('');
    } catch (error) {
      setError('Error creating task');
    }
  };

  return (
    <div>
      <h1>Create New Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Priority</label>
          <input type="text" value={priority} onChange={(e) => setPriority(e.target.value)} required />
        </div>
        <div>
          <label>Deadline</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>
        <div>
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>Owner</label>
          <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} required />
        </div>
        <button type="submit">Create Task</button>
      </form>
      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default CreateTask;
