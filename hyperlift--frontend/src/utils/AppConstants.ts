export const API_BASE_URL = 'http://localhost:8080/api';

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // User
  USER_DASHBOARD: '/user/dashboard',
  USER_WORKOUTS: '/user/workouts',
  USER_WORKOUT_CREATE: '/user/workouts/create',
  USER_WORKOUT_EDIT: '/user/workouts/edit/:id',
  USER_WORKOUT_DETAIL: '/user/workouts/:id',
  USER_EXERCISES: '/user/exercises',
  USER_PLANS: '/user/plans',
  USER_PLAN_CREATE: '/user/plans/create',
  USER_PLAN_DETAIL: '/user/plans/:id',
  USER_PROGRESS: '/user/progress',
  USER_PROGRESS_CREATE: '/user/progress/create',
  USER_PROFILE: '/user/profile',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_EXERCISES: '/admin/exercises',
  ADMIN_EXERCISE_CREATE: '/admin/exercises/create',
  ADMIN_EXERCISE_EDIT: '/admin/exercises/edit/:id',
  ADMIN_WORKOUTS: '/admin/workouts',
  ADMIN_PLANS: '/admin/plans',
  ADMIN_PLAN_BUILDER: '/admin/plans/:id',
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const FITNESS_GOALS = [
  'Gain Muscle',
  'Lose Weight',
  'Maintain Weight',
  'Improve Strength',
  'Improve Endurance',
];

export const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Abs',
  'Core',
  'Forearms',
  'Traps',
  'Full Body',
];

export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Machine',
  'Cable',
  'Bodyweight',
  'Kettlebell',
  'Resistance Band',
  'Smith Machine',
  'EZ Bar',
  'None',
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const PLAN_GOALS = [
  'Muscle Gain',
  'Fat Loss',
  'Strength',
  'Endurance',
  'Flexibility',
  'General Fitness',
];

