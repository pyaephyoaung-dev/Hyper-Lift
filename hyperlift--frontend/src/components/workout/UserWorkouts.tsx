import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiActivity, FiCalendar, FiClock, FiTrash2, FiEye, FiZap } from 'react-icons/fi';
import workoutService from '../../services/workoutService';
import { WorkoutResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import ConfirmModal from '../common/ConfirmModal';
import { formatDate } from '../../utils/Helpers';

const UserWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const response = await workoutService.getUserWorkouts();
      setWorkouts(response.data || []);
    } catch {
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await workoutService.deleteWorkout(deleteId);
      setWorkouts(workouts.filter((w) => w.id !== deleteId));
      setSuccess('Workout deleted successfully');
      setDeleteId(null);
    } catch {
      setError('Failed to delete workout');
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading workouts..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Workouts</h1>
          <p className="text-gray-400 text-sm mt-1">Track and manage your workouts</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/user/plans"
            className="bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors no-underline"
          >
            <FiZap /> Generate Workout Split
          </Link>
          <Link
            to="/user/workouts/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors no-underline"
          >
            <FiPlus /> Add Workout
          </Link>
        </div>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-gray-300 text-sm">
          Prefer a structured, multi-day program? Let the admin build you a personalized split based on
          how many days and hours you can train.
        </p>
        <Link
          to="/user/plans"
          className="text-indigo-300 hover:text-indigo-200 text-sm font-semibold whitespace-nowrap no-underline"
        >
          Go to Plans →
        </Link>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      {workouts.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FiActivity className="text-5xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">No workouts yet</h3>
          <p className="text-gray-400 mb-6">Start by creating your first workout</p>
          <Link
            to="/user/workouts/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium transition-colors no-underline"
          >
            <FiPlus /> Create Workout
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold line-clamp-1">{workout.description}</h3>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/user/workouts/${workout.id}`}
                    className="text-gray-400 hover:text-orange-500 p-1 transition-colors"
                  >
                    <FiEye />
                  </Link>
                  <button
                    onClick={() => setDeleteId(workout.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FiCalendar /> {formatDate(workout.workoutDate)}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock /> {workout.durationMinutes} min
                </span>
              </div>
              {workout.exercises && workout.exercises.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500">{workout.exercises.length} exercises</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default UserWorkouts;
