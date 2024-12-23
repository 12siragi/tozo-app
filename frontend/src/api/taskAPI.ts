// taskAPI.ts
import axiosClient from './axiosClient';

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
    return response.data;  // Return task data
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Fetch a specific task by ID
export const getTaskById = async (taskId: number): Promise<Task> => {
  try {
    const response = await axiosClient.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  try {
    const response = await axiosClient.post('/tasks/', newTask);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};


export const getTaskDetail = async (taskId: number): Promise<Task> => {
  try {
    const response = await axiosClient.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};


export const markTaskComplete = async (taskId: number): Promise<void> => {
  try {
    await axiosClient.patch(`/tasks/${taskId}/complete/`);
  } catch (error) {
    console.error('Error marking task as complete:', error);
    throw error;
  }
};