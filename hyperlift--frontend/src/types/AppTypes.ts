export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  goal?: string;
  experienceLevel?: string;
}

export interface LoginResponse extends AuthUser {
  message?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  goal: string;
  experienceLevel: string;
}

export interface UsernameAvailability {
  available: boolean;
}

export interface UserResponse extends BaseEntity {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  goal?: string;
  experienceLevel?: string;
  active: boolean;
}

export interface ProfileUpdateRequest {
  username?: string;
  newPassword?: string;
  weight?: number;
  height?: number;
}

export interface ExerciseRequest {
  name: string;
  description: string;
  muscleGroup: string;
  equipment?: string;
  difficultyLevel?: string;
  videoUrl?: string;
}

export interface ExerciseResponse extends BaseEntity {
  name: string;
  description: string;
  muscleGroup: string;
  equipment?: string;
  difficultyLevel?: string;
  videoUrl?: string;
}

export interface WorkoutRequest {
  description: string;
  workoutDate: string;
  durationMinutes: number;
  workoutSplitId?: number;
  exercises: WorkoutExerciseRequest[];
}

export interface WorkoutResponse extends BaseEntity {
  description: string;
  workoutDate: string;
  durationMinutes: number;
  exercises: WorkoutExerciseResponse[];
  userId: number;
  username?: string;
  workoutSplitId?: number;
  workoutSplitName?: string;
}

export interface WorkoutExerciseRequest {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  restSeconds: number;
}

export interface WorkoutExerciseResponse extends BaseEntity {
  exerciseId: number;
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number;
  restSeconds: number;
  orderIndex?: number;
  notes?: string;
  completed: boolean;
}

export interface WorkoutPlanRequest {
  name: string;
  description?: string;
  durationWeeks?: number;
  difficultyLevel?: string;
  goal?: string;
  isPublic?: boolean;
  daysPerWeek: number;
  hoursPerSession?: number;
}

export interface WorkoutPlanResponse extends BaseEntity {
  name: string;
  description?: string;
  durationWeeks?: number;
  difficultyLevel?: string;
  goal?: string;
  isPublic: boolean;
  daysPerWeek?: number;
  hoursPerSession?: number;
  splits: WorkoutSplitResponse[];
  userId: number;
  username: string;
  active: boolean;
}

export interface SplitExerciseRequest {
  exerciseId: number;
  sets: number;
  reps: number;
  orderIndex?: number;
}

export interface SplitExerciseResponse {
  id: number;
  exerciseId: number;
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  orderIndex?: number;
}

export interface WorkoutSplitRequest {
  name: string;
  dayOfWeek?: string;
  orderIndex?: number;
  workoutPlanId: number;
  exercises?: SplitExerciseRequest[];
  restDay?: boolean;
}

export interface WorkoutSplitResponse extends BaseEntity {
  name: string;
  dayOfWeek?: string;
  orderIndex?: number;
  exercises: SplitExerciseResponse[];
  workoutPlanId: number;
  workoutPlanName: string;
  restDay?: boolean;
}

export interface ProgressRequest {
  recordDate?: string;
  restDay?: boolean;
  exerciseId?: number;
  weight?: number;
  reps?: number;
  rpe?: number;
  restTimeSeconds?: number;
  notes?: string;
}

export interface ProgressResponse extends BaseEntity {
  recordDate: string;
  restDay: boolean;
  exerciseId?: number;
  exerciseName?: string;
  muscleGroup?: string;
  weight?: number;
  reps?: number;
  setNumber?: number;
  rpe?: number;
  restTimeSeconds?: number;
  notes?: string;
  userId: number;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DashboardStats {
  totalWorkouts: number;
  totalExercises: number;
  totalPlans: number;
  recentWorkouts: WorkoutResponse[];
  progressEntries: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalWorkouts: number;
  totalExercises: number;
  totalPlans: number;
  recentUsers: UserResponse[];
}