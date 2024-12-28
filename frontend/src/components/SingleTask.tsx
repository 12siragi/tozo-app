// src/components/SingleTask.tsx
import React, { useEffect, useState } from 'react';
import { getTaskById, Task } from '../api/taskAPI';

interface SingleTaskProps {
  taskId: number;
}

const SingleTask: React.FC<SingleTaskProps> = ({ taskId }) => {
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(taskId);
        setTask(data);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  if (!task) return <p>Loading task...</p>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Deadline: {task.deadline}</p>
      <p>Status: {task.is_completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
};

export default SingleTask;
