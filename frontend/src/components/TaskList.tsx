import React, { useEffect, useState } from 'react';
import { getTasks, markTaskComplete, softDeleteTask, Task } from '../api/taskAPI';

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
      setError('Error fetching tasks. Please try again later.');
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
      setError('Error marking task as complete.');
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
      setError('Error soft-deleting task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">Task List</h1>
      {loading && <div className="text-center">Loading tasks...</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-700">{task.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>Priority: <span className="font-medium">{task.priority}</span></p>
              <p>Deadline: <span className="font-medium">{task.deadline}</span></p>
              <p>Status: <span className={task.is_completed ? 'text-green-500' : 'text-yellow-500'}>
                {task.is_completed ? 'Completed' : 'Pending'}
              </span></p>
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleCompleteTask(task.id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={task.is_completed || loading}
              >
                {loading ? 'Completing...' : 'Mark Complete'}
              </button>
              <button
                onClick={() => handleSoftDeleteTask(task.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Soft Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksList;
