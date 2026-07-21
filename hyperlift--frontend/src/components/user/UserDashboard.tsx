import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiList, FiTarget, FiTrendingUp, FiPlus, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import DashboardStatCard from './DashboardStatCard';
import DonutChart from '../common/DonutChart';
import workoutService from '../../services/workoutService';
import exerciseService from '../../services/exerciseService';
import planService from '../../services/planService';
import progressService from '../../services/progressService';
import LoadingSpinner from '../common/LoadingSpinner';
import { WorkoutResponse, ProgressResponse } from '../../types/AppTypes';
import { formatDate } from '../../utils/Helpers';

const CHART_PALETTE = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#ec4899', '#14b8a6', '#ef4444', '#84cc16', '#6366f1'];

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ workouts: 0, exercises: 0, plans: 0, progress: 0 });
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutResponse[]>([]);
  const [allProgress, setAllProgress] = useState<ProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [workoutsRes, exercisesRes, activePlanRes, progressRes] = await Promise.allSettled([
        workoutService.getUserWorkouts(),
        exerciseService.getAllExercises(),
        planService.getMyActivePlan(),
        progressService.getUserProgress(),
      ]);

      const workouts = workoutsRes.status === 'fulfilled' ? workoutsRes.value.data || [] : [];
      const exercises = exercisesRes.status === 'fulfilled' ? exercisesRes.value.data || [] : [];
      const activePlan = activePlanRes.status === 'fulfilled' ? activePlanRes.value.data : null;
      const progress = progressRes.status === 'fulfilled' ? progressRes.value.data || [] : [];

      setStats({
        workouts: workouts.length,
        exercises: exercises.length,
        plans: activePlan ? 1 : 0,
        progress: progress.length,
      });

      setRecentWorkouts(workouts.slice(0, 5));
      setAllProgress(progress);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const muscleGroupSegments = (() => {
    const counts: Record<string, number> = {};
    allProgress.forEach((p) => {
      if (p.restDay || !p.muscleGroup) return;
      counts[p.muscleGroup] = (counts[p.muscleGroup] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], i) => ({ label, value, color: CHART_PALETTE[i % CHART_PALETTE.length] }));
  })();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Welcome back, <span className="text-orange-500">{user?.firstName}</span> 💪
        </h1>
        <p className="text-gray-400">Here's your fitness overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard icon={<FiActivity />} label="Total Workouts" value={stats.workouts} color="bg-orange-500" />
        <DashboardStatCard icon={<FiList />} label="Exercises" value={stats.exercises} color="bg-blue-500" />
        <DashboardStatCard icon={<FiTarget />} label="Active Plans" value={stats.plans} color="bg-green-500" />
        <DashboardStatCard icon={<FiTrendingUp />} label="Progress Logs" value={stats.progress} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/user/workouts/create"
              className="flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-3 rounded-lg hover:bg-orange-500/20 transition-colors no-underline text-sm font-medium"
            >
              <FiPlus /> New Workout
            </Link>
            <Link
              to="/user/plans/create"
              className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-3 rounded-lg hover:bg-blue-500/20 transition-colors no-underline text-sm font-medium"
            >
              <FiPlus /> New Plan
            </Link>
            <Link
              to="/user/progress/create"
              className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-3 rounded-lg hover:bg-green-500/20 transition-colors no-underline text-sm font-medium"
            >
              <FiPlus /> Log Progress
            </Link>
            <Link
              to="/user/exercises"
              className="flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-3 rounded-lg hover:bg-purple-500/20 transition-colors no-underline text-sm font-medium"
            >
              <FiList /> Browse Exercises
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Workouts</h3>
            <Link to="/user/workouts" className="text-orange-500 text-sm hover:text-orange-400 no-underline">
              View All
            </Link>
          </div>
          {recentWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <FiActivity className="text-4xl text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500">No workouts yet. Start your journey!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <Link
                  key={workout.id}
                  to={`/user/workouts/${workout.id}`}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors no-underline group"
                >
                  <div>
                    <p className="text-white font-medium text-sm group-hover:text-orange-500 transition-colors">
                      {workout.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                      <FiCalendar />
                      <span>{formatDate(workout.workoutDate)}</span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{workout.durationMinutes} min</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Progress Overview</h3>
          <Link to="/user/progress" className="text-orange-500 text-sm hover:text-orange-400 no-underline">
            View All
          </Link>
        </div>
        {muscleGroupSegments.length === 0 ? (
          <div className="text-center py-10">
            <FiTrendingUp className="text-4xl text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500">Log a set to see your training breakdown.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">Sets logged by muscle group</p>
            <DonutChart segments={muscleGroupSegments} />
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;