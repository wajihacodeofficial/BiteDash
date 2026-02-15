import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'customer') {
    return <Navigate to="/dashboard/customer?tab=profile" replace />;
  }

  // Future: Handle rider/restaurant profile redirects
  return <Navigate to="/" replace />;
};

export default Profile;
