// ============ Base Types ============
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// ============ Auth Types ============
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

// Full registration payload, submitted once Step 2 of the wizard is complete.
export interface RegisterRequest {
  // Step 1 — account
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2 — fitness profile
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

// ============ User Types ============
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

// A user may only change their username, password, body weight, and height.
export interface ProfileUpdateRequest {
  username?: string;
  newPassword?: string;
  weight?: number;
  height?: number;
}

// ============ Exercise Types ============
export interface ExerciseRequest {
  name: string;
  description: string;
  muscleGroup: string;
  equipment?: string;
  difficultyLevel?: string;
  /** Link to a YouTube tutorial demonstrating the exercise. */
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

// ============ Workout Types ============
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

// ============ Workout Plan Types ============
export interface WorkoutPlanRequest {
  name: string;
  description?: string;
  durationWeeks?: number;
  difficultyLevel?: string;
  goal?: string;
  isPublic?: boolean;
  /** How many gym days/week this plan is designed for — used for matching. */
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
  /** True when this is the requesting user's currently active plan. */
  active: boolean;
}

// ============ Workout Split Types ============
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
}

export interface WorkoutSplitResponse extends BaseEntity {
  name: string;
  dayOfWeek?: string;
  orderIndex?: number;
  exercises: SplitExerciseResponse[];
  workoutPlanId: number;
  workoutPlanName: string;
}

// ============ Progress Types ============
export interface ProgressRequest {
  /** Defaults to today on the server when omitted. */
  recordDate?: string;
  /** When true, this entry is logged as a rest day — exerciseId/weight/reps are ignored. */
  restDay?: boolean;
  /** Required unless restDay is true. */
  exerciseId?: number;
  /** Required unless restDay is true. */
  weight?: number;
  /** Required unless restDay is true. */
  reps?: number;
  /** Optional. Rate of Perceived Exertion, typically 1-10. */
  rpe?: number;
  /** Optional. Rest taken before this set, in seconds. */
  restTimeSeconds?: number;
  notes?: string;
}

export interface ProgressResponse extends BaseEntity {
  recordDate: string;
  /** True when this entry is a logged rest day instead of a set. */
  restDay: boolean;
  exerciseId?: number;
  exerciseName?: string;
  muscleGroup?: string;
  weight?: number;
  reps?: number;
  /** Auto-assigned by the server. */
  setNumber?: number;
  rpe?: number;
  restTimeSeconds?: number;
  notes?: string;
  userId: number;
  username: string;
}

// ============ API Response ============
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============ Dashboard Types ============
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
