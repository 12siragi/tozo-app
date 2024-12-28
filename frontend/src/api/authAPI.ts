import axiosClient from './axiosClient';

// User Registration - Handles user registration
export const register = async (userData: {
  email: string;
  password1: string;
  password2: string;
  username: string;
}) => {
  try {
    const response = await axiosClient.post('/auth/register/', userData);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Registration failed.');
  }
};

// User Login - Handles user login and token retrieval
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axiosClient.post('/auth/token/', credentials);
    const { access, refresh } = response.data;

    // Store tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return { access, refresh };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Login failed. Check your credentials.');
  }
};

// Password Reset Request - Handles requesting a password reset email
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosClient.post('/auth/password-reset/', { email });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Password reset request failed.');
  }
};

// Password Reset Confirmation - Confirms the password reset using token
export const confirmPasswordReset = async (
  token: string,
  email: string,
  newPassword: string
) => {
  try {
    const response = await axiosClient.post('/auth/password-reset-confirm/', {
      token,
      email,
      new_password: newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Password reset confirmation failed.');
  }
};

// Password Change - Handles changing the password for the logged-in user
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await axiosClient.post('/auth/password-change/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Password change failed.');
  }
};

// Email Verification - Verifies the email address using a token
export const verifyEmail = async (token: string, email: string) => {
  try {
    const response = await axiosClient.post('/auth/verify-email/', { token, email });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Email verification failed.');
  }
};

// Fetch Current User - Fetches the current logged-in user's data
export const fetchCurrentUser = async () => {
  try {
    const response = await axiosClient.get('/auth/user/');
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch user data.');
  }
};

// Fetch all tasks
export const getTasks = async () => {
  try {
    const response = await axiosClient.get('/tasks/');
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch tasks.');
  }
};

// Create a new task
export const createTask = async (task: { title: string; description: string }) => {
  try {
    const response = await axiosClient.post('/tasks/create/', task);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Failed to create task.');
  }
};

// Fetch task details
export const getTaskDetail = async (id: number) => {
  try {
    const response = await axiosClient.get(`/tasks/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch task details.');
  }
};

// Mark task as complete
export const markTaskComplete = async (id: number) => {
  try {
    const response = await axiosClient.patch(`/tasks/${id}/complete/`);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.detail || 'Failed to mark task as complete.');
  }
};
