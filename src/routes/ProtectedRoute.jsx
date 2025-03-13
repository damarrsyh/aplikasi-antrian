import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // console.log("=== DEBUG ProtectedRoute ===");
  // console.log("isAuthenticated:", isAuthenticated);
  // console.log("User Data:", user);
  // console.log("Allowed Roles:", allowedRoles);
  // console.log("User Role:", user?.role);
  // console.log("Allowed Roles.includes(User Role):", allowedRoles?.includes(user?.role));

  const hasAccess = useMemo(() => {
    // eslint-disable-next-line react/prop-types
    return isAuthenticated && allowedRoles.includes(user?.role);
  }, [isAuthenticated, user, allowedRoles]);

  if (!isAuthenticated) {
    // console.log("Redirect ke /login");
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    // console.log("Role tidak sesuai! Redirect ke /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
