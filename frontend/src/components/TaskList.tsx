import React, { useEffect, useState } from 'react';
import { getTasks, markTaskComplete, softDeleteTask, Task } from '../api/taskAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Error fetching tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      await markTaskComplete(taskId);
      fetchTasks();
    } catch (error) {
      toast.error('Error marking task as complete.');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDeleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      await softDeleteTask(taskId);
      fetchTasks();
    } catch (error) {
      toast.error('Error soft-deleting task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-6">Task List</h1>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-lg animate-pulse">
                <div className="h-6 bg-gray-400 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold dark:text-white">{task.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Priority: <span className="font-medium">{task.priority}</span></p>
                  <p>Deadline: <span className="font-medium">{task.deadline}</span></p>
                  <p>Status: 
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-white 
                      ${task.is_completed ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {task.is_completed ? 'Completed' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={task.is_completed || loading}
                  >
                    {loading ? 'Completing...' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => handleSoftDeleteTask(task.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Soft Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      </div>
    </>
  );
};

export default TasksList;
