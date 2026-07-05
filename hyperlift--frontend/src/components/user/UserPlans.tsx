import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTarget, FiClock, FiEye, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import planService from '../../services/planService';
import { WorkoutPlanResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { getDifficultyColor, getMuscleGroupColor } from '../../utils/Helpers';

const UserPlans = () => {
  const [activePlan, setActivePlan] = useState<WorkoutPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActivePlan();
  }, []);

  const loadActivePlan = async () => {
    try {
      const response = await planService.getMyActivePlan();
      setActivePlan(response.data || null);
    } catch {
      setError('Failed to load your active plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your plan..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Workout Schedule</h1>
          <p className="text-gray-400 text-sm mt-1">The plan you've selected as your active schedule</p>
        </div>
        <Link
          to="/user/plans/create"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors no-underline"
        >
          <FiPlus /> {activePlan ? 'Change Plan' : 'Request a Plan'}
        </Link>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      {!activePlan ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FiTarget className="text-5xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">No active plan yet</h3>
          <p className="text-gray-400 mb-6">Tell us your gym days per week to find a matching plan</p>
          <Link
            to="/user/plans/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium transition-colors no-underline"
          >
            <FiPlus /> Request a Plan
          </Link>
        </div>
      ) : (
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-green-400 text-xs font-medium mb-2">
                  <FiCheckCircle /> Active Plan
                </span>
                <h2 className="text-xl font-bold text-white">{activePlan.name}</h2>
                {activePlan.description && <p className="text-gray-400 text-sm mt-1">{activePlan.description}</p>}
              </div>
              <Link
                to={`/user/plans/${activePlan.id}`}
                className="text-gray-400 hover:text-orange-500 p-2 transition-colors shrink-0"
              >
                <FiEye />
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {activePlan.difficultyLevel && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activePlan.difficultyLevel)}`}>
                  {activePlan.difficultyLevel}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FiClock /> {activePlan.daysPerWeek} days/week
              </span>
              <span className="text-xs text-gray-500">• {activePlan.splits?.length || 0} split days</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Split Days</h3>
            {activePlan.splits && activePlan.splits.length > 0 ? (
              <div className="space-y-4">
                {activePlan.splits.map((split) => (
                  <div key={split.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FiCalendar className="text-orange-500" />
                      <h4 className="text-white font-medium">{split.name}</h4>
                      {split.dayOfWeek && (
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">{split.dayOfWeek}</span>
                      )}
                    </div>
                    {split.exercises && split.exercises.length > 0 ? (
                      <div className="space-y-1.5">
                        {split.exercises.map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getMuscleGroupColor(ex.muscleGroup)}`}>
                              {ex.exerciseName}
                            </span>
                            <span className="text-gray-400">{ex.sets} sets × {ex.reps} reps</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No exercises assigned</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No splits defined yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPlans;
