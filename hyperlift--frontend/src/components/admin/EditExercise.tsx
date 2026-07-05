import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import exerciseService from '../../services/exerciseService';
import AlertMessage from '../common/AlertMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import { MUSCLE_GROUPS, DIFFICULTY_LEVELS, EQUIPMENT_TYPES } from '../../utils/AppConstants';

const EditExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [equipment, setEquipmentRequired] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) loadExercise(Number(id));
  }, [id]);

  const loadExercise = async (exerciseId: number) => {
    try {
      const response = await exerciseService.getExerciseById(exerciseId);
      const data = response.data;
      setName(data.name);
      setDescription(data.description);
      setMuscleGroup(data.muscleGroup);
      setDifficultyLevel(data.difficultyLevel || '');
      setEquipmentRequired(data.equipment || '');
      setVideoUrl(data.videoUrl || '');
    } catch {
      setError('Failed to load exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSubmitting(true);

    try {
      await exerciseService.updateExercise(Number(id), {
        name,
        description,
        muscleGroup,
        difficultyLevel,
        equipment,
        videoUrl: videoUrl || undefined,
      });
      navigate('/admin/exercises');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update exercise');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2">
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Exercise</h1>
          <p className="text-gray-400 text-sm">Update exercise details</p>
        </div>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Exercise Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Muscle Group</label>
              <select
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                required
              >
                {MUSCLE_GROUPS.map((mg) => (
                  <option key={mg} value={mg}>{mg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                required
              >
                {DIFFICULTY_LEVELS.map((dl) => (
                  <option key={dl} value={dl}>{dl}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Equipment Required</label>
              <select
                value={equipment}
                onChange={(e) => setEquipmentRequired(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                required
              >
                {EQUIPMENT_TYPES.map((et) => (
                  <option key={et} value={et}>{et}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">YouTube Tutorial URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 mt-1">Optional — link to a video demonstrating this exercise</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave />
            )}
            Update Exercise
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExercise;