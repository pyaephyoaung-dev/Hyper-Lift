import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import workoutService from '../../services/workoutService';
import exerciseService from '../../services/exerciseService';
import { ExerciseResponse, WorkoutExerciseRequest } from '../../types/AppTypes';
import AlertMessage from '../common/AlertMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateWorkout = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const addExercise = () => {
    setWorkoutExercises([
      ...workoutExercises,
      { exerciseId: 0, sets: 3, reps: 10, weight: 0, restSeconds: 60 },
    ]);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof WorkoutExerciseRequest, value: number) => {
    const updated = [...workoutExercises];
    updated[index] = { ...updated[index], [field]: value };
    setWorkoutExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await workoutService.createWorkout({
        description,
        workoutDate,
        durationMinutes,
        exercises: workoutExercises,
      });
      navigate('/user/workouts');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading exercises..." />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white p-2 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Workout</h1>
          <p className="text-gray-400 text-sm">Build your workout routine</p>
        </div>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Workout Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                placeholder="e.g., Push Day, Leg Day"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                min={1}
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Exercises</h3>
            <button
              type="button"
              onClick={addExercise}
              className="bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm hover:bg-orange-500/20 transition-colors"
            >
              <FiPlus /> Add Exercise
            </button>
          </div>

          {workoutExercises.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No exercises added yet</p>
          ) : (
            <div className="space-y-4">
              {workoutExercises.map((we, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Exercise #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="col-span-2 sm:col-span-5">
                      <select
                        value={we.exerciseId}
                        onChange={(e) => updateExercise(index, 'exerciseId', Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                        required
                      >
                        <option value={0}>Select Exercise</option>
                        {exercises.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name} ({ex.muscleGroup})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sets</label>
                      <input
                        type="number"
                        value={we.sets}
                        onChange={(e) => updateExercise(index, 'sets', Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Reps</label>
                      <input
                        type="number"
                        value={we.reps}
                        onChange={(e) => updateExercise(index, 'reps', Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={we.weight}
                        onChange={(e) => updateExercise(index, 'weight', Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                        min={0}
                        step={0.5}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Rest (sec)</label>
                      <input
                        type="number"
                        value={we.restSeconds}
                        onChange={(e) => updateExercise(index, 'restSeconds', Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
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
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave />
            )}
            Create Workout
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkout;
