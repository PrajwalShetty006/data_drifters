import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // For now, skip auth check since MongoDB is not running
  // Just check if user is "authenticated" in localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

