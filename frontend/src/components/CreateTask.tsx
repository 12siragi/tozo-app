import React, { useState } from 'react';
import { createTask } from '../api/taskAPI';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Work');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newTask = {
      title,
      description,
      priority,
      deadline,
      category,
      is_completed: false,
      is_deleted: false,
      owner: 'current_user', // Replace with actual owner info
    };

    try {
      await createTask(newTask);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDeadline('');
      setCategory('Work');
    } catch (err) {
      setError('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
      {success && <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md mb-4">Task created successfully!</div>}
      {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md mb-4">{error}</div>}

      <h2 className="text-xl font-semibold">Create Task</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          className="focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          className="focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full"
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default CreateTask;
