import { useState } from 'react';
import { FiUser, FiSave, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import AlertMessage from '../common/AlertMessage';
import PasswordField from '../common/PasswordField';
import { setUser } from '../../utils/Helpers';

// Per product spec: from their own Profile page, a user may only change
// their username, password, body weight, and height. Everything else
// (name, email, age, gender, goal, experience) is fixed after registration.
const UserProfile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [height, setHeight] = useState(user?.height ?? '');
  const [weight, setWeight] = useState(user?.weight ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    setSubmitting(true);
    try {
      const response = await userService.updateProfile({
        username: username !== user?.username ? username : undefined,
        newPassword: newPassword || undefined,
        weight: weight === '' ? undefined : Number(weight),
        height: height === '' ? undefined : Number(height),
      });
      setUser(response.data);
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          You can update your username, password, body weight, and height here.
        </p>
      </div>

      {/* Profile Avatar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 text-center">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-3xl text-white font-bold mx-auto mb-3">
          {user?.firstName?.charAt(0) || 'U'}
        </div>
        <h3 className="text-white font-semibold text-lg">
          {user?.firstName} {user?.lastName}
        </h3>
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-1">
          <FiMail className="text-xs" />
          {user?.email}
        </div>
        <span className="inline-block mt-2 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-medium">
          {user?.role}
        </span>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FiUser className="text-orange-500" /> Account
          </h3>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              minLength={3}
              maxLength={50}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Body Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                min={0}
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                min={0}
                step={0.1}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FiLock className="text-orange-500" /> Change Password
          </h3>
          <p className="text-xs text-gray-500 -mt-2">Leave blank to keep your current password</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              minLength={6}
              required={false}
              showStrengthMeter
            />
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              minLength={6}
              required={false}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
