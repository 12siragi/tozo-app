// TaskList.tsx
import React, { useEffect, useState } from 'react';
import { getTasks } from '../api/taskAPI';

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

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        setError('Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <a href={`/tasks/${task.id}`}>{task.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
