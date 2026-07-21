import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './auth/Login';
import Register from './auth/Register';
import LandingPage from './components/landing/LandingPage';

import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';

import AuthGuard from './components/guards/AuthGuard';
import AdminGuard from './components/guards/AdminGuard';
import GuestGuard from './components/guards/GuestGuard';

import NotFound from './components/exception/NotFound';
import Unauthorized from './components/exception/Unauthorized';

import UserDashboard from './components/user/UserDashboard';
import UserWorkouts from './components/workout/UserWorkouts';
import CreateWorkout from './components/workout/CreateWorkout';
import WorkoutDetail from './components/workout/WorkoutDetail';
import UserExercises from './components/exercise/UserExercises';
import UserPlans from './components/user/UserPlans';
import CreatePlan from './components/user/CreatePlan';
import PlanDetail from './components/user/PlanDetail';
import UserProgress from './components/progress/UserProgress';
import CreateProgress from './components/progress/CreateProgress';
import UserProfile from './components/user/UserProfile';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminExercises from './components/admin/AdminExercises';
import CreateExercise from './components/admin/CreateExercise';
import EditExercise from './components/admin/EditExercise';
import AdminWorkouts from './components/admin/AdminWorkouts';
import AdminPlans from './components/admin/AdminPlans';
import AdminPlanBuilder from './components/admin/AdminPlanBuilder';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<AuthGuard />}>
            <Route element={<UserLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/workouts" element={<UserWorkouts />} />
              <Route path="/user/workouts/create" element={<CreateWorkout />} />
              <Route path="/user/workouts/:id" element={<WorkoutDetail />} />
              <Route path="/user/exercises" element={<UserExercises />} />
              <Route path="/user/plans" element={<UserPlans />} />
              <Route path="/user/plans/create" element={<CreatePlan />} />
              <Route path="/user/plans/:id" element={<PlanDetail />} />
              <Route path="/user/progress" element={<UserProgress />} />
              <Route path="/user/progress/create" element={<CreateProgress />} />
              <Route path="/user/profile" element={<UserProfile />} />
            </Route>
          </Route>

          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/exercises" element={<AdminExercises />} />
              <Route path="/admin/exercises/create" element={<CreateExercise />} />
              <Route path="/admin/exercises/edit/:id" element={<EditExercise />} />
              <Route path="/admin/workouts" element={<AdminWorkouts />} />
              <Route path="/admin/plans" element={<AdminPlans />} />
              <Route path="/admin/plans/:id" element={<AdminPlanBuilder />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
