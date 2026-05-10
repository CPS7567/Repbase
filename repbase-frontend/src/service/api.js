import axios from 'axios';

// The URL where your Python main.py is running
const API_BASE_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// export const workoutService = {
//   // Fetch workout history from your MySQL 'workout_session' table
//   getHistory: () => api.get('/history'),
  
//   // Submit a new workout (this triggers your Task 6 transaction)
//   saveWorkout: (workoutData) => api.post('/workouts', workoutData),
// };

// export const membershipService = {
//   // Check status (will be influenced by your Task 5 trigger)
//   getStatus: (memberId) => api.get(`/membership/${memberId}`),
// };


export const workoutService = {
  // Pass user_id as a query parameter
  getHistory: (userId) => api.get(`/history?user_id=${userId}`),
  
  getWeeklySummary: (userId) => api.get(`/summary?user_id=${userId}`),
};


export const membershipService = {
  // Fetch current membership for a specific user
  getStatus: (userId) => api.get(`/membership/${userId}`),
  
  // Fetch available plans (in case they differ by user)
  getPlans: (userId) => api.get(`/plans/${userId}`),
};