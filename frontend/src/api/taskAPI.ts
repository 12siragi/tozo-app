
import axiosClient from './axiosClient';

// Utility functions for interacting with the API
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

// Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axiosClient.get('/tasks/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching tasks:', error.response || error.message);
    throw error;
  }
};

// Fetch a specific task by ID
export const getTaskById = async (taskId: number): Promise<Task> => {
  try {
    const response = await axiosClient.get(`/tasks/${taskId}/`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching task by ID:', error.response || error.message);
    throw error;
  }
};

// Create a new task
export const createTask = async (
  newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>
): Promise<Task> => {
  try {
    const response = await axiosClient.post('/tasks/', newTask);
    return response.data;
  } catch (error: any) {
    console.error('Error creating task:', error.response || error.message);
    throw error;
  }
};

// Mark a task as complete
export const markTaskComplete = async (taskId: number): Promise<void> => {
  try {
    await axiosClient.patch(`/tasks/${taskId}/`, { is_completed: true });
  } catch (error: any) {
    console.error('Error marking task as complete:', error.response || error.message);
    throw error;
  }
};

// Soft delete a task
export const softDeleteTask = async (taskId: number): Promise<void> => {
  try {
    await axiosClient.patch(`/tasks/${taskId}/soft-delete/`, { is_deleted: true });
  } catch (error: any) {
    console.error('Error soft-deleting task:', error.response || error.message);
    throw error;
  }
};
