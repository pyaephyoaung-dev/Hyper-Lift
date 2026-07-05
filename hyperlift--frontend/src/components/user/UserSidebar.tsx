import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiActivity,
  FiList,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/user/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { path: '/user/workouts', icon: <FiActivity />, label: 'Workouts' },
  { path: '/user/exercises', icon: <FiList />, label: 'Exercises' },
  { path: '/user/plans', icon: <FiTarget />, label: 'Plans' },
  { path: '/user/progress', icon: <FiTrendingUp />, label: 'Progress' },
  { path: '/user/profile', icon: <FiUser />, label: 'Profile' },
];

const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <GiWeightLiftingUp className="text-3xl text-orange-500" />
            <span className="text-xl font-bold text-white">
              Hyper<span className="text-orange-500">Lift</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-500 border-l-4 border-orange-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default UserSidebar;
