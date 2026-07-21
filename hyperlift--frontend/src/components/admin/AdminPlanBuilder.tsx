import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiClock, FiSettings } from 'react-icons/fi';
import planService from '../../services/planService';
import splitService from '../../services/splitService';
import exerciseService from '../../services/exerciseService';
import { WorkoutPlanResponse, WorkoutSplitResponse, ExerciseResponse, SplitExerciseRequest } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import ConfirmModal from '../common/ConfirmModal';
import { DAYS_OF_WEEK, DIFFICULTY_LEVELS, PLAN_GOALS } from '../../utils/AppConstants';
import { getDifficultyColor } from '../../utils/Helpers';

interface EditorExercise {
  exerciseId: number;
  sets: number;
  reps: number;
}

const AdminPlanBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<WorkoutPlanResponse | null>(null);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingSplit, setEditingSplit] = useState<WorkoutSplitResponse | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [splitName, setSplitName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [isRestDay, setIsRestDay] = useState(false);
  const [editorExercises, setEditorExercises] = useState<EditorExercise[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planDaysPerWeek, setPlanDaysPerWeek] = useState(3);
  const [planHoursPerSession, setPlanHoursPerSession] = useState(1);
  const [planDurationWeeks, setPlanDurationWeeks] = useState(4);
  const [planDifficultyLevel, setPlanDifficultyLevel] = useState('');
  const [planGoal, setPlanGoal] = useState('');
  const [planSubmitting, setPlanSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const [planRes, exercisesRes] = await Promise.all([
        planService.getPlanById(Number(id)),
        exerciseService.getAllExercises(),
      ]);
      setPlan(planRes.data);
      setExercises(exercisesRes.data || []);
    } catch {
      setError('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const openPlanEditor = () => {
    if (!plan) return;
    setPlanName(plan.name);
    setPlanDescription(plan.description || '');
    setPlanDaysPerWeek(plan.daysPerWeek || 3);
    setPlanHoursPerSession(plan.hoursPerSession || 1);
    setPlanDurationWeeks(plan.durationWeeks || 4);
    setPlanDifficultyLevel(plan.difficultyLevel || '');
    setPlanGoal(plan.goal || '');
    setShowPlanEditor(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setPlanSubmitting(true);
    setError('');
    try {
      await planService.updatePlan(plan.id, {
        name: planName,
        description: planDescription || undefined,
        daysPerWeek: planDaysPerWeek,
        hoursPerSession: planHoursPerSession,
        durationWeeks: planDurationWeeks,
        difficultyLevel: planDifficultyLevel || undefined,
        goal: planGoal || undefined,
        isPublic: true,
      });
      setShowPlanEditor(false);
      setSuccess('Plan details updated');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update plan details');
    } finally {
      setPlanSubmitting(false);
    }
  };

  const openNewSplitEditor = () => {
    setEditingSplit(null);
    setSplitName('');
    setDayOfWeek('Monday');
    setIsRestDay(false);
    setEditorExercises([]);
    setShowEditor(true);
  };

  const openEditSplitEditor = (split: WorkoutSplitResponse) => {
    setEditingSplit(split);
    setSplitName(split.name);
    setDayOfWeek(split.dayOfWeek || 'Monday');
    setIsRestDay(!!split.restDay);
    setEditorExercises(
      split.exercises.map((e) => ({ exerciseId: e.exerciseId, sets: e.sets, reps: e.reps }))
    );
    setShowEditor(true);
  };

  const addExerciseRow = () => {
    const firstUnused = exercises.find((ex) => !editorExercises.some((e) => e.exerciseId === ex.id));
    if (!firstUnused) return;
    setEditorExercises((prev) => [...prev, { exerciseId: firstUnused.id, sets: 3, reps: 10 }]);
  };

  const updateExerciseRow = (index: number, patch: Partial<EditorExercise>) => {
    setEditorExercises((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  };

  const removeExerciseRow = (index: number) => {
    setEditorExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setSubmitting(true);
    setError('');
    try {
      const exercisesPayload: SplitExerciseRequest[] = editorExercises.map((ex, idx) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        orderIndex: idx,
      }));
      const payload = {
        name: splitName,
        dayOfWeek,
        orderIndex: DAYS_OF_WEEK.indexOf(dayOfWeek),
        workoutPlanId: plan.id,
        restDay: isRestDay,
        exercises: isRestDay ? [] : exercisesPayload,
      };
      if (editingSplit) {
        await splitService.updateSplit(editingSplit.id, payload);
      } else {
        await splitService.createSplit(payload);
      }
      setShowEditor(false);
      setSuccess(editingSplit ? 'Split updated' : 'Split added');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save split');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSplit = async () => {
    if (!deleteId) return;
    try {
      await splitService.deleteSplit(deleteId);
      setSuccess('Split removed');
      setDeleteId(null);
      await loadData();
    } catch {
      setError('Failed to delete split');
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading plan..." />;
  if (!plan) return <AlertMessage type="error" message="Plan not found" />;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/admin/plans')}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors cursor-pointer bg-transparent border-none"
      >
        <FiArrowLeft /> Back to Plans
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 mt-1 flex-wrap">
            {plan.daysPerWeek && (
              <span className="flex items-center gap-1">
                <FiClock /> {plan.daysPerWeek} days/week{plan.hoursPerSession ? ` · ${plan.hoursPerSession}h/session` : ''}
              </span>
            )}
            {plan.difficultyLevel && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                {plan.difficultyLevel}
              </span>
            )}
            {plan.goal && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                {plan.goal}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={openPlanEditor}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
        >
          <FiSettings /> Edit Plan
        </button>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Split Days ({plan.splits.length})</h2>
        <button
          onClick={openNewSplitEditor}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
        >
          <FiPlus /> Add Day
        </button>
      </div>

      {plan.splits.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-400">
          No split days yet. Click "Add Day" to start building this plan.
        </div>
      ) : (
        <div className="space-y-3">
          {plan.splits
            .slice()
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map((split) => (
              <div key={split.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-red-500 uppercase">{split.dayOfWeek}</span>
                      {split.restDay && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                          Rest Day
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold">{split.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditSplitEditor(split)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => setDeleteId(split.id)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                {!split.restDay && split.exercises.length > 0 && (
                  <div className="space-y-1.5 mt-3">
                    {split.exercises.map((ex) => (
                      <div key={ex.id} className="flex items-center justify-between text-sm">
                        <span className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">{ex.exerciseName}</span>
                        <span className="text-gray-500 text-xs">{ex.sets} sets × {ex.reps} reps</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {showPlanEditor && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPlanEditor(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-4">Edit Plan Details</h3>
            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Description</label>
                <textarea
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Days per week</label>
                  <input
                    type="number"
                    value={planDaysPerWeek}
                    onChange={(e) => setPlanDaysPerWeek(Number(e.target.value))}
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
                    value={planHoursPerSession}
                    onChange={(e) => setPlanHoursPerSession(Number(e.target.value))}
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
                    value={planDifficultyLevel}
                    onChange={(e) => setPlanDifficultyLevel(e.target.value)}
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
                    value={planGoal}
                    onChange={(e) => setPlanGoal(e.target.value)}
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
                  value={planDurationWeeks}
                  onChange={(e) => setPlanDurationWeeks(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  min={1}
                />
              </div>
              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowPlanEditor(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={planSubmitting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {planSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowEditor(false)}>
          <div
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-4">
              {editingSplit ? 'Edit Split Day' : 'Add Split Day'}
            </h3>
            <form onSubmit={handleSaveSplit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Day Name</label>
                <input
                  type="text"
                  value={splitName}
                  onChange={(e) => setSplitName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                  placeholder="e.g. Push Day"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3">
                <div>
                  <p className="text-white text-sm font-medium">Rest Day</p>
                  <p className="text-gray-500 text-xs mt-0.5">No exercises on this day — just a scheduled rest day</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isRestDay}
                  onClick={() => setIsRestDay((v) => !v)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer border-none shrink-0 ${
                    isRestDay ? 'bg-red-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      isRestDay ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {!isRestDay && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-300">Exercises, Sets &amp; Reps</label>
                    <button
                      type="button"
                      onClick={addExerciseRow}
                      className="text-red-500 hover:text-red-400 text-xs font-medium flex items-center gap-1 bg-transparent border-none cursor-pointer"
                    >
                      <FiPlus /> Add Exercise
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editorExercises.length === 0 && (
                      <p className="text-gray-500 text-sm">No exercises added yet.</p>
                    )}
                    {editorExercises.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-2.5">
                        <select
                          value={row.exerciseId}
                          onChange={(e) => updateExerciseRow(idx, { exerciseId: Number(e.target.value) })}
                          className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500"
                        >
                          {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>{ex.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={row.sets}
                          onChange={(e) => updateExerciseRow(idx, { sets: Number(e.target.value) })}
                          className="w-16 bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500"
                          min={1}
                          title="Sets"
                        />
                        <span className="text-gray-500 text-xs">sets</span>
                        <input
                          type="number"
                          value={row.reps}
                          onChange={(e) => updateExerciseRow(idx, { reps: Number(e.target.value) })}
                          className="w-16 bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500"
                          min={1}
                          title="Reps"
                        />
                        <span className="text-gray-500 text-xs">reps</span>
                        <button
                          type="button"
                          onClick={() => removeExerciseRow(idx)}
                          className="text-gray-400 hover:text-red-500 p-1 bg-transparent border-none cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Day'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Split Day"
        message="Remove this day from the split? This can't be undone."
        onConfirm={handleDeleteSplit}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminPlanBuilder;