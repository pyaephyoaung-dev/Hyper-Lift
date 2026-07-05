import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiTarget, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import planService from '../../services/planService';
import { WorkoutPlanResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { getDifficultyColor, getMuscleGroupColor } from '../../utils/Helpers';

// Preview of a library plan — lets the user select it as their active schedule.
const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WorkoutPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (id) loadPlan(Number(id));
  }, [id]);

  const loadPlan = async (planId: number) => {
    try {
      const response = await planService.getPlanById(planId);
      setPlan(response.data);
    } catch {
      setError('Failed to load plan details');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async () => {
    if (!plan) return;
    setSelecting(true);
    setError('');
    try {
      const response = await planService.selectPlan(plan.id);
      setPlan(response.data);
      setSuccess('This plan is now your active workout schedule.');
      setTimeout(() => navigate('/user/plans'), 900);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to select plan');
    } finally {
      setSelecting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading plan..." />;
  if (error && !plan) return <AlertMessage type="error" message={error} />;
  if (!plan) return <AlertMessage type="error" message="Plan not found" />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2 bg-transparent border-none cursor-pointer">
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
          <p className="text-gray-400 text-sm">{plan.description}</p>
        </div>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiClock className="text-orange-500" />
              <span>{plan.daysPerWeek} days/week</span>
            </div>
            {plan.goal && (
              <div className="flex items-center gap-2 text-gray-400">
                <FiTarget className="text-orange-500" />
                <span>{plan.goal}</span>
              </div>
            )}
            {plan.difficultyLevel && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                {plan.difficultyLevel}
              </span>
            )}
          </div>
          <button
            onClick={handleSelect}
            disabled={selecting || plan.active}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer"
          >
            <FiCheckCircle /> {plan.active ? 'Active Plan' : selecting ? 'Selecting...' : 'Select This Plan'}
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Workout Splits</h3>
        {plan.splits && plan.splits.length > 0 ? (
          <div className="space-y-4">
            {plan.splits.map((split) => (
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
          <p className="text-gray-500 text-center py-4">No splits defined</p>
        )}
      </div>
    </div>
  );
};

export default PlanDetail;
