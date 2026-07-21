import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiTarget, FiClock, FiEye, FiCheckCircle } from 'react-icons/fi';
import planService from '../../services/planService';
import AlertMessage from '../common/AlertMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import { WorkoutPlanResponse } from '../../types/AppTypes';
import { getDifficultyColor } from '../../utils/Helpers';

const CreatePlan = () => {
  const navigate = useNavigate();
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [searched, setSearched] = useState(false);
  const [matches, setMatches] = useState<WorkoutPlanResponse[]>([]);
  const [error, setError] = useState('');
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await planService.matchPlans(daysPerWeek);
      setMatches(response.data || []);
      setSearched(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to find matching plans');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = async (planId: number) => {
    setSelectingId(planId);
    setError('');
    try {
      await planService.selectPlan(planId);
      setSuccess('This plan is now your active workout schedule.');
      setTimeout(() => navigate('/user/plans'), 900);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to select plan');
      setSelectingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2 bg-transparent border-none cursor-pointer">
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Request a Workout Plan</h1>
          <p className="text-gray-400 text-sm">Tell us your gym days per week and we'll find matching plans</p>
        </div>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <label className="block text-sm text-gray-300 mb-2">Gym days per week</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            min={1}
            max={7}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer"
          >
            <FiSearch /> {submitting ? 'Searching...' : 'Find Plans'}
          </button>
        </div>
      </form>

      {submitting && <LoadingSpinner message="Finding matching plans..." />}

      {searched && !submitting && (
        matches.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-400">
            <FiTarget className="text-4xl text-gray-600 mx-auto mb-3" />
            No plans currently match {daysPerWeek} days/week. Check back later or try a different number of days.
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-white font-semibold text-sm">
              {matches.length} matching plan{matches.length === 1 ? '' : 's'}
            </h2>
            {matches.map((plan) => (
              <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-white font-semibold">{plan.name}</h3>
                    {plan.description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{plan.description}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {plan.difficultyLevel && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                          {plan.difficultyLevel}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <FiClock /> {plan.daysPerWeek} days/week
                      </span>
                      <span className="text-xs text-gray-500">• {plan.splits?.length || 0} split days</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/user/plans/${plan.id}`)}
                      className="text-sm px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:border-gray-600 flex items-center gap-1.5 transition-colors bg-transparent cursor-pointer"
                    >
                      <FiEye /> Preview
                    </button>
                    <button
                      onClick={() => handleSelect(plan.id)}
                      disabled={selectingId === plan.id || plan.active}
                      className="text-sm px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                    >
                      <FiCheckCircle /> {plan.active ? 'Active' : selectingId === plan.id ? 'Selecting...' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default CreatePlan;
