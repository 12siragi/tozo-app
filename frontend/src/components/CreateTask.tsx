import React, { useState } from 'react';
import { createTask } from '../api/taskAPI';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaBriefcase, FaHeart, FaExclamationCircle, FaRegCalendarAlt } from 'react-icons/fa';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [category, setCategory] = useState('Work');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const validateForm = () => {
    let isValid = true;
    let errors = { title: '', description: '', deadline: '' };

    if (!title) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!description) {
      errors.description = 'Description cannot be empty';
      isValid = false;
    }

    if (!deadline) {
      errors.deadline = 'Deadline is required';
      isValid = false;
    } else if (deadline && deadline < new Date()) {
      errors.deadline = 'Deadline must be a future date';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

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
      setDeadline(null);
      setCategory('Work');
      navigate('/tasks'); // Redirect to Task List page
    } catch (err) {
      setError('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto bg-white shadow-xl rounded-xl">
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md mb-4 animate__animated animate__fadeIn">
          Task created successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md mb-4 animate__animated animate__fadeIn">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800">Create Task</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          className={`focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full transition-all duration-300 ease-in-out ${formErrors.title ? 'border-red-500' : ''}`}
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          className={`focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full transition-all duration-300 ease-in-out ${formErrors.description ? 'border-red-500' : ''}`}
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {formErrors.description && <p className="text-red-500 text-xs">{formErrors.description}</p>}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full transition-all duration-300 ease-in-out"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
        <DatePicker
          selected={deadline}
          onChange={(date) => setDeadline(date)}
          minDate={new Date()}
          placeholderText="Select a date"
          className={`focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full transition-all duration-300 ease-in-out ${formErrors.deadline ? 'border-red-500' : ''}`}
        />
        {formErrors.deadline && <p className="text-red-500 text-xs">{formErrors.deadline}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md p-2 w-full transition-all duration-300 ease-in-out"
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500'} transition-all duration-300 ease-in-out`}
        disabled={loading}
      >
        {loading ? (
          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          'Create Task'
        )}
      </button>
    </form>
  );
};

export default CreateTask;
