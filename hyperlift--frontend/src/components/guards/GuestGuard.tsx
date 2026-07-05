import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GuestGuard = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
