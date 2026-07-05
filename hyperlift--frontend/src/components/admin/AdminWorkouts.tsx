import { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiClock, FiActivity } from 'react-icons/fi';
import workoutService from '../../services/workoutService';
import { WorkoutResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { formatDate } from '../../utils/Helpers';

const AdminWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const response = await workoutService.getAllWorkouts();
      setWorkouts(response.data || []);
    } catch {
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const filtered = workouts.filter((w) =>
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading workouts..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">All Workouts</h1>
        <p className="text-gray-400 text-sm mt-1">Global view of user workouts</p>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500"
              placeholder="Search by workout description..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Workout</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Exercises</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((workout) => (
                <tr key={workout.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiActivity className="text-red-500" />
                      <span className="text-white font-medium">{workout.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{workout.userId}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-xs" />
                      {formatDate(workout.workoutDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-xs" />
                      {workout.durationMinutes} min
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">
                      {workout.exercises?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkouts;
