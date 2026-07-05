import { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiList, FiYoutube } from 'react-icons/fi';
import exerciseService from '../../services/exerciseService';
import { ExerciseResponse } from '../../types/AppTypes';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { getDifficultyColor, getMuscleGroupColor } from '../../utils/Helpers';
import { MUSCLE_GROUPS } from '../../utils/AppConstants';

const UserExercises = () => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [filtered, setFiltered] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    let result = exercises;
    if (search) {
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (muscleFilter) {
      result = result.filter((e) => e.muscleGroup === muscleFilter);
    }
    setFiltered(result);
  }, [exercises, search, muscleFilter]);

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

  if (loading) return <LoadingSpinner message="Loading exercises..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
        <p className="text-gray-400 text-sm mt-1">Browse all available exercises</p>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-orange-500"
            placeholder="Search exercises..."
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white rounded-lg pl-10 pr-8 py-2.5 focus:outline-none focus:border-orange-500 appearance-none"
          >
            <option value="">All Muscles</option>
            {MUSCLE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FiList className="text-5xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">No exercises found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              <h3 className="text-white font-semibold mb-2">{exercise.name}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{exercise.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getMuscleGroupColor(exercise.muscleGroup)}`}>
                  {exercise.muscleGroup}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficultyLevel || '')}`}>
                  {exercise.difficultyLevel}
                </span>
                {exercise.equipment && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                    {exercise.equipment}
                  </span>
                )}
              </div>
              {exercise.videoUrl && (
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                >
                  <FiYoutube /> Watch Tutorial
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserExercises;