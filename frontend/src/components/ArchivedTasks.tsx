import React, { useEffect, useState } from 'react';
import { fetchArchivedTasks, restoreTask, Task } from '../api/taskAPI';
import { toast } from 'react-toastify';

const ArchivedTasks: React.FC = () => {
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [loadingRestore, setLoadingRestore] = useState<number | null>(null);

  const fetchArchived = async () => {
    try {
      const data = await fetchArchivedTasks();
      setArchivedTasks(data);
    } catch (error) {
      toast.error('Error fetching archived tasks.');
    }
  };

  const handleRestore = async (taskId: number) => {
    setLoadingRestore(taskId);
    try {
      await restoreTask(taskId);
      toast.success('Task restored successfully.');
      setArchivedTasks((prev) => prev.filter((task) => task.id !== taskId)); // Remove restored task
    } catch (error) {
      toast.error('Error restoring task.');
    } finally {
      setLoadingRestore(null);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Archived Tasks</h2>
      {archivedTasks.length === 0 ? (
        <p className="text-gray-500 text-center">No archived tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {archivedTasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-500">{task.description}</p>
              </div>
              <button
                onClick={() => handleRestore(task.id)}
                disabled={loadingRestore === task.id}
                className={`px-4 py-2 text-white rounded ${
                  loadingRestore === task.id ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loadingRestore === task.id ? 'Restoring...' : 'Restore'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchivedTasks;
