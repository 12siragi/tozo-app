// TaskDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById } from  '../api/taskAPI';

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

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (taskId) {
          const taskData = await getTaskById(Number(taskId));
          setTask(taskData);
        }
      } catch (error) {
        setError('Error fetching task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return task ? (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Deadline: {task.deadline}</p>
      <p>Category: {task.category}</p>
      <p>Owner: {task.owner}</p>
      <p>Status: {task.is_completed ? 'Completed' : 'Pending'}</p>
    </div>
  ) : (
    <p>Task not found</p>
  );
};

export default TaskDetail;
