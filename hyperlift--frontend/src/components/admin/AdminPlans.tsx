import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiTarget, FiClock, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import planService from '../../services/planService';
import { WorkoutPlanResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import ConfirmModal from '../common/ConfirmModal';
import { getDifficultyColor } from '../../utils/Helpers';
import { DIFFICULTY_LEVELS, PLAN_GOALS } from '../../utils/AppConstants';

const AdminPlans = () => {
  const [plans, setPlans] = useState<WorkoutPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [hoursPerSession, setHoursPerSession] = useState(1);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await planService.getAllPlans();
      setPlans(response.data || []);
    } catch {
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const filtered = plans.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setDaysPerWeek(3);
    setHoursPerSession(1);
    setDurationWeeks(4);
    setDifficultyLevel('');
    setGoal('');
    setShowCreateModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await planService.createPlan({
        name,
        description,
        daysPerWeek,
        hoursPerSession,
        durationWeeks,
        difficultyLevel: difficultyLevel || undefined,
        goal: goal || undefined,
        isPublic: true,
      });
      setShowCreateModal(false);
      setSuccess('Plan created — now add split days and exercises.');
      await loadPlans();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await planService.deletePlan(deleteId);
      setPlans(plans.filter((p) => p.id !== deleteId));
      setSuccess('Plan deleted');
      setDeleteId(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete plan');
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading plans..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Workout Plans</h1>
          <p className="text-gray-400 text-sm mt-1">Your library of plans users can match to and select</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
        >
          <FiPlus /> Create Plan
        </button>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500"
              placeholder="Search plans..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Goal</th>
                <th className="px-6 py-4">Split Days</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiTarget className="text-red-500" />
                      <span className="text-white font-medium">{plan.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-xs" />
                      {plan.daysPerWeek}d/wk{plan.hoursPerSession ? ` · ${plan.hoursPerSession}h/session` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {plan.difficultyLevel && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                        {plan.difficultyLevel}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {plan.goal && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        {plan.goal}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{plan.splits?.length || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/plans/${plan.id}`}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors inline-block"
                        title="Build / edit split"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => setDeleteId(plan.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-1">Create Workout Plan</h3>
            <p className="text-gray-400 text-sm mb-5">
              Name the plan and set its availability. You'll add split days and exercises next.
            </p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  placeholder="e.g. Push Pull Legs Split"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Days per week</label>
                  <input
                    type="number"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                    min={1}
                    max={7}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Hours per session</label>
                  <input
                    type="number"
                    value={hoursPerSession}
                    onChange={(e) => setHoursPerSession(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                    min={0.25}
                    step={0.25}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select</option>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select</option>
                    {PLAN_GOALS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Duration (weeks)</label>
                <input
                  type="number"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  min={1}
                />
              </div>
              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminPlans;