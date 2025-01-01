import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskDetail, markTaskComplete } from '../api/taskAPI';



const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const parsedId = id ? parseInt(id) : null; // Parse id once
  const [task, setTask] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskComplete, setIsTaskComplete] = useState<boolean>(false); // To track task completion status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetail = async () => {
      if (parsedId) {
        try {
          const response = await getTaskDetail(parsedId); // Fetch task details by ID
          setTask(response.data);
          setIsTaskComplete(response.data.isComplete); // Assuming the response includes a 'isComplete' field
        } catch (error) {
          setError('Error fetching task details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTaskDetail();
  }, [parsedId]);

  const handleMarkComplete = async () => {
    if (parsedId && !isTaskComplete) {
      try {
        await markTaskComplete(parsedId); // Mark task as complete via API
        setIsTaskComplete(true); // Update state to reflect task completion
        navigate('/tasks'); // Redirect to tasks list after completion
      } catch (error) {
        setError('Error marking task as complete. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="spinner-border animate-spin h-8 w-8 border-4 border-t-4 border-gray-700 rounded-full"></div>
        <span className="ml-2 text-gray-500">Loading task details...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return task ? (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">{task.title}</h2>
      <p className="text-lg text-gray-700 mb-6">{task.description}</p>
      
      {/* Mark as complete button */}
      <button
        onClick={handleMarkComplete}
        disabled={isTaskComplete} // Disable button if task is complete
        className={`w-full sm:w-auto ${isTaskComplete ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500`}
      >
        {isTaskComplete ? 'Task Completed' : 'Mark as Complete'}
      </button>

      {/* Additional task information */}
      <div className="mt-6 text-sm text-gray-500">
        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-500">Task not found.</div>
  );
};

export default TaskDetail;
