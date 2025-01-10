import React, { useEffect, useState } from 'react';
import { getTasks, markTaskComplete, softDeleteTask, Task } from '../api/taskAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [loadingComplete, setLoadingComplete] = useState<number | null>(null); // Track which task is being completed
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null); // Track which task is being deleted
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoadingFetch(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      setError('Error fetching tasks. Please try again later.');
      toast.error('Error fetching tasks. Please try again later.');
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    setLoadingComplete(taskId);
    
    // Optimistic update: mark the task as complete immediately in the UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: true } : task
      )
    );

    try {
      await markTaskComplete(taskId);
      // Optionally, you can fetch the tasks again if needed (for full confirmation)
      fetchTasks();
    } catch (error) {
      // If error occurs, revert the task completion state
      toast.error('Error marking task as complete.');
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: false } : task
        )
      );
    } finally {
      setLoadingComplete(null);
    }
  };

  const handleSoftDeleteTask = async (taskId: number) => {
    setLoadingDelete(taskId);
    try {
      await softDeleteTask(taskId);
      fetchTasks();
    } catch (error) {
      toast.error('Error soft-deleting task.');
    } finally {
      setLoadingDelete(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8 text-blue-700">Task List</h1>
        
        {/* Loading State */}
        {loadingFetch ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-lg animate-pulse">
                <div className="h-6 bg-gray-400 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold dark:text-white mb-3">{task.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{task.description}</p>
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <p><strong>Priority:</strong> <span className="font-medium">{task.priority}</span></p>
                  <p><strong>Deadline:</strong> <span className="font-medium">{task.deadline}</span></p>
                  <p><strong>Status:</strong> 
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-white 
                      ${task.is_completed ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {task.is_completed ? 'Completed' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    disabled={task.is_completed || loadingComplete !== null}
                  >
                    {loadingComplete === task.id ? 'Completing...' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => handleSoftDeleteTask(task.id)}
                    className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    disabled={loadingDelete === task.id}
                  >
                    {loadingDelete === task.id ? 'Deleting...' : 'Soft Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-red-500 text-center mt-4 text-lg">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default TasksList;
