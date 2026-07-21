import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiTarget } from 'react-icons/fi';
import workoutService from '../../services/workoutService';
import { WorkoutResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { formatDate, getMuscleGroupColor } from '../../utils/Helpers';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) loadWorkout(Number(id));
  }, [id]);

  const loadWorkout = async (workoutId: number) => {
    try {
      const response = await workoutService.getWorkoutById(workoutId);
      setWorkout(response.data);
    } catch {
      setError('Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading workout..." />;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!workout) return <AlertMessage type="error" message="Workout not found" />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2">
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{workout.description}</h1>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <FiCalendar className="text-orange-500" />
            <span>{formatDate(workout.workoutDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <FiClock className="text-orange-500" />
            <span>{workout.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <FiTarget className="text-orange-500" />
            <span>{workout.exercises?.length || 0} exercises</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Exercises</h3>
        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-4">
            {workout.exercises.map((we, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{we.exerciseName || 'Exercise'}</h4>
                  <div className="flex gap-2">
                    {we.muscleGroup && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMuscleGroupColor(we.muscleGroup)}`}>
                        {we.muscleGroup}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-3">
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
          <p className="text-gray-500 text-center py-4">No exercises in this workout</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;
