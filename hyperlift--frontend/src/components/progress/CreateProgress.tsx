import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import progressService from '../../services/progressService';
import planService from '../../services/planService';
import AlertMessage from '../common/AlertMessage';
import { WorkoutPlanResponse, SplitExerciseResponse } from '../../types/AppTypes';

const todayISO = () => new Date().toISOString().split('T')[0];

let uid = 0;
const nextId = () => `${Date.now()}-${uid++}`;

interface SetEntry {
  key: string;
  weight: string;
  reps: string;
  rpe: string;
  restTimeSeconds: string;
}

interface ExerciseBlock {
  key: string;
  exerciseId: number | '';
  notes: string;
  collapsed: boolean;
  sets: SetEntry[];
}

const makeSet = (): SetEntry => ({ key: nextId(), weight: '', reps: '', rpe: '', restTimeSeconds: '' });
const makeBlock = (): ExerciseBlock => ({ key: nextId(), exerciseId: '', notes: '', collapsed: false, sets: [makeSet()] });


const CreateProgress = () => {
  const navigate = useNavigate();

  const [activePlan, setActivePlan] = useState<WorkoutPlanResponse | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [recordDate, setRecordDate] = useState(todayISO());
  const [isRestDay, setIsRestDay] = useState(false);
  const [restDayNotes, setRestDayNotes] = useState('');
  const [blocks, setBlocks] = useState<ExerciseBlock[]>([makeBlock()]);

  const [submitting, setSubmitting] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadActivePlan();
  }, []);

  const loadActivePlan = async () => {
    try {
      const response = await planService.getMyActivePlan();
      setActivePlan(response.data || null);
    } catch {
      // no active plan is fine — the exercise dropdown will just be empty
    } finally {
      setLoadingPlan(false);
    }
  };

  
  const planExercises: SplitExerciseResponse[] = (() => {
    if (!activePlan?.splits) return [];
    const seen = new Set<number>();
    const flat: SplitExerciseResponse[] = [];
    for (const split of activePlan.splits) {
      for (const ex of split.exercises || []) {
        if (!seen.has(ex.exerciseId)) {
          seen.add(ex.exerciseId);
          flat.push(ex);
        }
      }
    }
    return flat;
  })();

  const toNum = (v: string) => (v === '' ? undefined : Number(v));

  // ---- Block / set helpers ----

  const addBlock = () => setBlocks((prev) => [...prev, makeBlock()]);

  const removeBlock = (blockKey: string) =>
    setBlocks((prev) => (prev.length === 1 ? prev : prev.filter((b) => b.key !== blockKey)));

  const toggleCollapsed = (blockKey: string) =>
    setBlocks((prev) => prev.map((b) => (b.key === blockKey ? { ...b, collapsed: !b.collapsed } : b)));

  const updateBlockExercise = (blockKey: string, exerciseId: number | '') =>
    setBlocks((prev) => prev.map((b) => (b.key === blockKey ? { ...b, exerciseId } : b)));

  const updateBlockNotes = (blockKey: string, notes: string) =>
    setBlocks((prev) => prev.map((b) => (b.key === blockKey ? { ...b, notes } : b)));

  const addSet = (blockKey: string) =>
    setBlocks((prev) => prev.map((b) => (b.key === blockKey ? { ...b, sets: [...b.sets, makeSet()] } : b)));

  const removeSet = (blockKey: string, setKey: string) =>
    setBlocks((prev) =>
      prev.map((b) =>
        b.key === blockKey
          ? { ...b, sets: b.sets.length === 1 ? b.sets : b.sets.filter((s) => s.key !== setKey) }
          : b
      )
    );

  const updateSetField = (blockKey: string, setKey: string, field: keyof Omit<SetEntry, 'key'>, value: string) =>
    setBlocks((prev) =>
      prev.map((b) =>
        b.key === blockKey
          ? { ...b, sets: b.sets.map((s) => (s.key === setKey ? { ...s, [field]: value } : s)) }
          : b
      )
    );

  // Exercise ids already claimed by another block, so the same exercise isn't
  // split across two blocks (extra sets for it belong in that block instead).
  const takenElsewhere = (blockKey: string) =>
    new Set(blocks.filter((b) => b.key !== blockKey && b.exerciseId !== '').map((b) => b.exerciseId));

  const totalSets = blocks.reduce((sum, b) => sum + (b.exerciseId ? b.sets.length : 0), 0);

  // ---- Submit ----

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRestDay) {
      setError('');
      setSubmitting(true);
      try {
        await progressService.createProgress({
          recordDate,
          restDay: true,
          notes: restDayNotes || undefined,
        });
        navigate('/user/progress');
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to log rest day');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const activeBlocks = blocks.filter((b) => b.exerciseId !== '');
    if (activeBlocks.length === 0) {
      setError('Please select at least one exercise');
      return;
    }
    for (const block of activeBlocks) {
      const incomplete = block.sets.some((s) => s.weight === '' || s.reps === '');
      if (incomplete) {
        setError('Please fill in weight and reps for every set, or remove the empty set');
        return;
      }
    }

    setError('');
    setSubmitting(true);

    // Sets are auto-numbered per exercise on the server based on how many are
    // already saved for that day, so submit sequentially, in order.
    let completed = 0;
    try {
      for (const block of activeBlocks) {
        for (const set of block.sets) {
          setProgressMsg(`Saving set ${completed + 1} of ${totalSets}...`);
          await progressService.createProgress({
            recordDate,
            exerciseId: block.exerciseId as number,
            weight: Number(set.weight),
            reps: Number(set.reps),
            rpe: toNum(set.rpe),
            restTimeSeconds: toNum(set.restTimeSeconds),
            notes: block.notes || undefined,
          });
          completed += 1;
        }
      }
      navigate('/user/progress');
    } catch (err: any) {
      setError(
        (err?.response?.data?.message || 'Failed to save this session') +
          (completed > 0 ? ` — ${completed} of ${totalSets} sets were saved before the error.` : '')
      );
    } finally {
      setSubmitting(false);
      setProgressMsg('');
    }
  };

  const exerciseName = (id: number | '') => planExercises.find((e) => e.exerciseId === id)?.exerciseName;

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate('/user/progress')}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors cursor-pointer bg-transparent border-none"
      >
        <FiArrowLeft /> Back to Progress
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">{isRestDay ? 'Log a Rest Day' : 'Log a Session'}</h1>
      <p className="text-gray-400 text-sm mb-6">
        {isRestDay
          ? 'No sets required — just save today as a rest day.'
          : 'Add every exercise and set you did — set numbers are tracked automatically.'}
      </p>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      {!isRestDay && !loadingPlan && !activePlan && (
        <AlertMessage
          type="error"
          message="You don't have an active workout plan yet. Select a plan first so you have exercises to log against."
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              max={todayISO()}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="flex items-center justify-between bg-gray-800/60 border border-gray-800 rounded-lg px-4 py-3">
            <div>
              <p className="text-white text-sm font-medium">Rest Day</p>
              <p className="text-gray-500 text-xs mt-0.5">No sets to log — just mark today as a rest day</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isRestDay}
              onClick={() => setIsRestDay((v) => !v)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer border-none shrink-0 ${
                isRestDay ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isRestDay ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isRestDay && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
              <textarea
                value={restDayNotes}
                onChange={(e) => setRestDayNotes(e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 resize-none"
                placeholder="How are you feeling on your rest day?"
              />
            </div>
          )}
        </div>

        {!isRestDay && (
          <>
            {blocks.map((block, blockIndex) => {
              const taken = takenElsewhere(block.key);
              return (
                <div key={block.key} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">
                        Exercise {blockIndex + 1}
                        {exerciseName(block.exerciseId) ? ` — ${exerciseName(block.exerciseId)}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleCollapsed(block.key)}
                        className="text-gray-500 hover:text-white p-1.5 transition-colors bg-transparent border-none cursor-pointer"
                        title={block.collapsed ? 'Expand' : 'Collapse'}
                      >
                        {block.collapsed ? <FiChevronDown /> : <FiChevronUp />}
                      </button>
                      {blocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBlock(block.key)}
                          className="text-gray-500 hover:text-red-500 p-1.5 transition-colors bg-transparent border-none cursor-pointer"
                          title="Remove exercise"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Exercise</label>
                    <select
                      value={block.exerciseId}
                      onChange={(e) =>
                        updateBlockExercise(block.key, e.target.value ? Number(e.target.value) : '')
                      }
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                      required
                      disabled={planExercises.length === 0}
                    >
                      <option value="">Select an exercise</option>
                      {planExercises.map((ex) => (
                        <option key={ex.exerciseId} value={ex.exerciseId} disabled={taken.has(ex.exerciseId)}>
                          {ex.exerciseName}
                          {taken.has(ex.exerciseId) ? ' (already added above)' : ''}
                        </option>
                      ))}
                    </select>
                    {(() => {
                      const target = planExercises.find((e) => e.exerciseId === block.exerciseId);
                      return target ? (
                        <p className="text-xs text-gray-500 mt-1.5">
                          Planned: {target.sets} sets × {target.reps} reps
                        </p>
                      ) : null;
                    })()}
                  </div>

                  {!block.collapsed && (
                    <>
                      <div className="space-y-3">
                        {block.sets.map((set, setIndex) => (
                          <div key={set.key} className="bg-gray-800/40 border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium text-gray-400">Set {setIndex + 1}</span>
                              {block.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSet(block.key, set.key)}
                                  className="text-gray-500 hover:text-red-500 p-1 transition-colors bg-transparent border-none cursor-pointer"
                                >
                                  <FiTrash2 className="text-sm" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Weight (kg)</label>
                                <input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) => updateSetField(block.key, set.key, 'weight', e.target.value)}
                                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                                  step={0.5}
                                  min={0}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Reps</label>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => updateSetField(block.key, set.key, 'reps', e.target.value)}
                                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                                  min={1}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1.5">RPE (optional)</label>
                                <input
                                  type="number"
                                  value={set.rpe}
                                  onChange={(e) => updateSetField(block.key, set.key, 'rpe', e.target.value)}
                                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                                  step={0.5}
                                  min={0}
                                  max={10}
                                  placeholder="1–10"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Rest (sec, optional)</label>
                                <input
                                  type="number"
                                  value={set.restTimeSeconds}
                                  onChange={(e) =>
                                    updateSetField(block.key, set.key, 'restTimeSeconds', e.target.value)
                                  }
                                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                                  min={0}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addSet(block.key)}
                        className="w-full border border-dashed border-gray-700 hover:border-orange-500 hover:text-orange-500 text-gray-400 rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer bg-transparent"
                      >
                        <FiPlus /> Add Another Set
                      </button>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Notes for this exercise (optional)</label>
                        <textarea
                          value={block.notes}
                          onChange={(e) => updateBlockNotes(block.key, e.target.value)}
                          rows={2}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none"
                          placeholder="How did these sets feel?"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addBlock}
              className="w-full bg-gray-900 border border-gray-800 hover:border-orange-500 text-gray-300 hover:text-orange-500 rounded-xl py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FiPlus /> Add Another Exercise
            </button>
          </>
        )}

        <button
          type="submit"
          disabled={submitting || (!isRestDay && totalSets === 0)}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiSave />
          )}
          {submitting
            ? progressMsg || 'Saving...'
            : isRestDay
            ? 'Save Rest Day'
            : `Save Session${totalSets ? ` (${totalSets} set${totalSets === 1 ? '' : 's'})` : ''}`}
        </button>
      </form>
    </div>
  );
};

export default CreateProgress;