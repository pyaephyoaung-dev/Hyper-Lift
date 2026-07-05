import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiChevronDown, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

const AdminNavbar = ({ onToggleSidebar }: AdminNavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-400 hover:text-white p-2"
        >
          <FiMenu className="text-xl" />
        </button>
        <div className="flex items-center gap-2">
          <FiShield className="text-red-500" />
          <h2 className="text-lg font-semibold text-white hidden sm:block">Admin Panel</h2>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.firstName?.charAt(0) || 'A'}
          </div>
          <span className="hidden sm:block text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </span>
          <FiChevronDown className="text-sm" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
