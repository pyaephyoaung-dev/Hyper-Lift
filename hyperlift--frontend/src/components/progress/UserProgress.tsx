import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiCalendar, FiTrash2, FiActivity, FiMoon } from 'react-icons/fi';
import progressService from '../../services/progressService';
import { ProgressResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import ConfirmModal from '../common/ConfirmModal';
import { formatDate } from '../../utils/Helpers';

const UserProgress = () => {
  const [progressEntries, setProgressEntries] = useState<ProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await progressService.getUserProgress();
      setProgressEntries(response.data || []);
    } catch {
      setError('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await progressService.deleteProgress(deleteId);
      setProgressEntries(progressEntries.filter((p) => p.id !== deleteId));
      setSuccess('Set deleted');
      setDeleteId(null);
    } catch {
      setError('Failed to delete set');
      setDeleteId(null);
    }
  };

  const groupedByDate = useMemo(() => {
    const byDate = new Map<string, ProgressResponse[]>();
    for (const entry of progressEntries) {
      const list = byDate.get(entry.recordDate) || [];
      list.push(entry);
      byDate.set(entry.recordDate, list);
    }
    return Array.from(byDate.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [progressEntries]);

  const groupByExercise = (entries: ProgressResponse[]) => {
    const byExercise = new Map<string, ProgressResponse[]>();
    for (const entry of entries) {
      if (entry.restDay || !entry.exerciseName) continue;
      const list = byExercise.get(entry.exerciseName) || [];
      list.push(entry);
      byExercise.set(entry.exerciseName, list);
    }
    return Array.from(byExercise.entries());
  };

  if (loading) return <LoadingSpinner message="Loading progress..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Progress Log</h1>
          <p className="text-gray-400 text-sm mt-1">Every set you've logged from your active plan</p>
        </div>
        <Link
          to="/user/progress/create"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors no-underline"
        >
          <FiPlus /> Log a Set
        </Link>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      {progressEntries.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FiTrendingUp className="text-5xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">No sets logged yet</h3>
          <p className="text-gray-400 mb-6">Start logging your workout performance</p>
          <Link
            to="/user/progress/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium transition-colors no-underline"
          >
            <FiPlus /> Log a Set
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {groupedByDate.map(([date, entries]) => {
            const restDayEntries = entries.filter((e) => e.restDay);
            return (
            <div key={date} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <FiCalendar /> {formatDate(date)}
              </div>

              {restDayEntries.length > 0 && (
                <div className="space-y-2 mb-4">
                  {restDayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between text-sm bg-gray-800/60 rounded-lg px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <FiMoon className="text-orange-500" />
                        <div>
                          <span className="text-white font-medium">Rest Day</span>
                          {entry.notes && <p className="text-gray-500 text-xs mt-0.5">{entry.notes}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteId(entry.id)}
                        className="text-gray-500 hover:text-red-500 p-1 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                {groupByExercise(entries).map(([exerciseName, sets]) => (
                  <div key={exerciseName}>
                    <div className="flex items-center gap-2 mb-2">
                      <FiActivity className="text-orange-500 text-sm" />
                      <span className="text-white font-medium text-sm">{exerciseName}</span>
                    </div>
                    <div className="space-y-1.5 pl-6">
                      {sets
                        .slice()
                        .sort((a, b) => (a.setNumber ?? 0) - (b.setNumber ?? 0))
                        .map((set) => (
                          <div
                            key={set.id}
                            className="flex items-center justify-between text-sm bg-gray-800/60 rounded-lg px-3 py-2"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-gray-500 w-14">Set {set.setNumber}</span>
                              <span className="text-white">{set.weight} kg × {set.reps} reps</span>
                              {set.rpe != null && <span className="text-gray-400">RPE {set.rpe}</span>}
                              {set.restTimeSeconds != null && (
                                <span className="text-gray-400">Rest {set.restTimeSeconds}s</span>
                              )}
                            </div>
                            <button
                              onClick={() => setDeleteId(set.id)}
                              className="text-gray-500 hover:text-red-500 p-1 transition-colors bg-transparent border-none cursor-pointer"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      {sets.some((s) => s.notes) && (
                        <div className="pl-1 pt-1 space-y-1">
                          {sets
                            .filter((s) => s.notes)
                            .map((s) => (
                              <p key={s.id} className="text-gray-500 text-xs">
                                Set {s.setNumber}: {s.notes}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Set"
        message="Are you sure you want to delete this logged set?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default UserProgress;
