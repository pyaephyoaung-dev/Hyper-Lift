import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiYoutube } from 'react-icons/fi';
import exerciseService from '../../services/exerciseService';
import { ExerciseResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import ConfirmModal from '../common/ConfirmModal';
import { getDifficultyColor, getMuscleGroupColor } from '../../utils/Helpers';

const AdminExercises = () => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const response = await exerciseService.getAllExercises();
      setExercises(response.data || []);
    } catch {
      setError('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await exerciseService.deleteExercise(deleteId);
      setExercises(exercises.filter((e) => e.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('Failed to delete exercise');
      setDeleteId(null);
    }
  };

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading exercises..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Exercise Management</h1>
          <p className="text-gray-400 text-sm mt-1">Add, edit, or remove exercises</p>
        </div>
        <Link
          to="/admin/exercises/create"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors no-underline"
        >
          <FiPlus /> New Exercise
        </Link>
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
              placeholder="Search exercises..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Exercise Name</th>
                <th className="px-6 py-4">Muscle Group</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Tutorial</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((exercise) => (
                <tr key={exercise.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{exercise.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMuscleGroupColor(exercise.muscleGroup)}`}>
                      {exercise.muscleGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficultyLevel || '')}`}>
                      {exercise.difficultyLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{exercise.equipment}</td>
                  <td className="px-6 py-4">
                    {exercise.videoUrl ? (
                      <a
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-400"
                        title="Watch tutorial"
                      >
                        <FiYoutube className="text-lg" />
                      </a>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/exercises/edit/${exercise.id}`}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => setDeleteId(exercise.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Exercise"
        message="Are you sure you want to delete this exercise? This will affect workouts containing it."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminExercises;