import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminPrivateRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  
  // Check if user is logged in and has admin/staff/manager role
  const isAdmin = currentUser && ['admin', 'manager', 'staff'].includes(currentUser.role);
  
  // If user is not logged in, redirect to sign-in
  if (!currentUser) {
    return <Navigate to='/sign-in' />;
  }
  
  // If user doesn't have admin privileges, redirect to home
  if (!isAdmin) {
    return <Navigate to='/' />;
  }
  
  // If user has admin privileges, render the protected component
  return children;
}
