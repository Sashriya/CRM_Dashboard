import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50">
        <div className="h-10 w-10 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/70 shadow-lg flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;