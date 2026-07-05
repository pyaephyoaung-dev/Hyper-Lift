import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiActivity, FiList, FiTarget, FiUser } from 'react-icons/fi';
import DashboardStatCard from '../user/DashboardStatCard';
import dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';
import { UserResponse } from '../../types/AppTypes';
import { formatDate } from '../../utils/Helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, workouts: 0, exercises: 0, plans: 0 });
  const [recentUsers, setRecentUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      const response = await dashboardService.getAdminDashboard();
      const data = response.data;
      setStats({
        users: data.totalUsers,
        workouts: data.totalWorkouts,
        exercises: data.totalExercises,
        plans: data.totalPlans,
      });
      setRecentUsers(data.recentUsers || []);
    } catch {
      // Fallback or error handling
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-gray-400">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard icon={<FiUsers />} label="Total Users" value={stats.users} color="bg-blue-500" />
        <DashboardStatCard icon={<FiActivity />} label="Workouts Logged" value={stats.workouts} color="bg-red-500" />
        <DashboardStatCard icon={<FiList />} label="Total Exercises" value={stats.exercises} color="bg-indigo-500" />
        <DashboardStatCard icon={<FiTarget />} label="Workout Plans" value={stats.plans} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Users</h3>
            <Link to="/admin/users" className="text-red-500 text-sm hover:text-red-400 no-underline">
              View All
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                      <FiUser />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 text-xs">{formatDate(user.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Quick Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Management</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/admin/exercises/create"
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors no-underline group"
            >
              <div className="flex items-center gap-3">
                <FiList className="text-indigo-500" />
                <span className="text-white">Add New Exercise</span>
              </div>
              <span className="text-gray-500 group-hover:text-white transition-colors">→</span>
            </Link>
            <Link
              to="/admin/plans"
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors no-underline group"
            >
              <div className="flex items-center gap-3">
                <FiActivity className="text-red-500" />
                <span className="text-white">Generate Workout Split for a User</span>
              </div>
              <span className="text-gray-500 group-hover:text-white transition-colors">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
