// src/components/TasksList.tsx
import React, { useEffect, useState } from 'react';
import { getTasks, markTaskComplete, softDeleteTask, Task } from '../api/taskAPI';

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await markTaskComplete(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  const handleSoftDeleteTask = async (taskId: number) => {
    try {
      await softDeleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error soft-deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      {tasks.map((task) => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Deadline: {task.deadline}</p>
          <p>Status: {task.is_completed ? 'Completed' : 'Pending'}</p>
          <button onClick={() => handleCompleteTask(task.id)}>Mark Complete</button>
          <button onClick={() => handleSoftDeleteTask(task.id)}>Soft Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TasksList;
