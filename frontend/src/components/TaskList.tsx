import React, { useEffect, useState } from 'react';
import {
  getTasks,
  markTaskComplete,
  markTaskIncomplete,
  softDeleteTask,
  restoreTask,
  Task,
} from '../api/taskAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [loadingComplete, setLoadingComplete] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [loadingRestore, setLoadingRestore] = useState<number | null>(null);
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

  const handleCompleteTask = async (taskId: number, isCompleted: boolean) => {
    setLoadingComplete(taskId);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: !isCompleted } : task
      )
    );

    try {
      if (!isCompleted) {
        await markTaskComplete(taskId);
        toast.success('Task marked as complete.');
      } else {
        await markTaskIncomplete(taskId);
        toast.info('Task marked as incomplete.');
      }
      fetchTasks();
    } catch (error) {
      toast.error('Error toggling task completion.');
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: isCompleted } : task
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

  const handleRestoreTask = async (taskId: number) => {
    setLoadingRestore(taskId);
    const taskToRestore = tasks.find((task) => task.id === taskId);
    if (!taskToRestore || !taskToRestore.is_deleted) {
      toast.error('Cannot restore a non-deleted task.');
      setLoadingRestore(null);
      return;
    }

    try {
      await restoreTask(taskId);
      fetchTasks();
      toast.success('Task restored successfully.');
    } catch (error) {
      toast.error('Error restoring task.');
    } finally {
      setLoadingRestore(null);
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

        {loadingFetch ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-lg animate-pulse">
                <div className="h-6 bg-gray-400 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600 text-center font-medium">{error}</div>
        ) : (
          <ul className="space-y-6">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`p-4 rounded-lg shadow-lg ${
                  task.is_completed ? 'bg-green-100' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className={`text-xl font-semibold ${task.is_deleted ? 'line-through' : ''}`}>
                      {task.title}
                    </h2>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {!task.is_deleted && (
                      <button
                        onClick={() => handleCompleteTask(task.id, task.is_completed)}
                        disabled={loadingComplete === task.id}
                        className={`px-4 py-2 text-sm font-medium rounded ${
                          task.is_completed
                            ? 'bg-yellow-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {loadingComplete === task.id
                          ? 'Loading...'
                          : task.is_completed
                          ? 'Mark Incomplete'
                          : 'Mark Complete'}
                      </button>
                    )}
                    {!task.is_deleted ? (
                      <button
                        onClick={() => handleSoftDeleteTask(task.id)}
                        disabled={loadingDelete === task.id}
                        className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded"
                      >
                        {loadingDelete === task.id ? 'Deleting...' : 'Delete'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestoreTask(task.id)}
                        disabled={loadingRestore === task.id}
                        className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded"
                      >
                        {loadingRestore === task.id ? 'Restoring...' : 'Restore'}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TasksList;
