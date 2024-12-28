import React, { useState } from 'react';
import { createTask } from '../api/taskAPI';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Work'); // Default category set to 'Work'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
      await createTask(newTask);
      alert('Task created successfully!');
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDeadline('');
      setCategory('Work'); // Reset category to 'Work' after form submission
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Urgent">Urgent</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default CreateTask;
