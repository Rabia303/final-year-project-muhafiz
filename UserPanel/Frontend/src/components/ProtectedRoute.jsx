import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authUtils";

function ProtectedRoute({ children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
