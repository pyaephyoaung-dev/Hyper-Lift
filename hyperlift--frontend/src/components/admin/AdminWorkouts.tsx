import { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiClock, FiActivity, FiEye, FiX, FiTarget, FiUser } from 'react-icons/fi';
import workoutService from '../../services/workoutService';
import { WorkoutResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { formatDate, getMuscleGroupColor } from '../../utils/Helpers';

const AdminWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [viewingWorkout, setViewingWorkout] = useState<WorkoutResponse | null>(null);

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
                <th className="px-6 py-4">Actions</th>
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewingWorkout(workout)}
                      className="text-gray-400 hover:text-orange-500 p-2 transition-colors bg-transparent border-none cursor-pointer"
                      title="View workout details"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingWorkout && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingWorkout(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">{viewingWorkout.description}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <FiUser className="text-orange-500" />
                    User #{viewingWorkout.userId}
                    {viewingWorkout.username ? ` — ${viewingWorkout.username}` : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-orange-500" />
                    {formatDate(viewingWorkout.workoutDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-orange-500" />
                    {viewingWorkout.durationMinutes} min
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingWorkout(null)}
                className="text-gray-400 hover:text-white p-1.5 transition-colors bg-transparent border-none cursor-pointer shrink-0"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FiTarget className="text-gray-500 text-sm" />
              <h4 className="text-white font-medium text-sm">
                Exercises ({viewingWorkout.exercises?.length || 0})
              </h4>
            </div>

            {viewingWorkout.exercises && viewingWorkout.exercises.length > 0 ? (
              <div className="space-y-3">
                {viewingWorkout.exercises.map((we, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{we.exerciseName || 'Exercise'}</h4>
                      {we.muscleGroup && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMuscleGroupColor(we.muscleGroup)}`}>
                          {we.muscleGroup}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Sets</p>
                        <p className="text-lg font-bold text-orange-500">{we.sets}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Reps</p>
                        <p className="text-lg font-bold text-orange-500">{we.reps}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="text-lg font-bold text-orange-500">{we.weight} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Rest</p>
                        <p className="text-lg font-bold text-orange-500">{we.restSeconds}s</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6 text-sm">No exercises logged for this workout</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkouts;