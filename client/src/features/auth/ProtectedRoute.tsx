import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "./useAuthStore";

const ProtectedRoute = ({ allowedRoles = [] }: { allowedRoles?: string[] }) => {
	const { user } = useAuthStore();
	if (!user) return <Navigate to="/login" replace />;
	if (allowedRoles.length && !allowedRoles.includes(user.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return <Outlet />;
};

const GuestRoute = () => {
	const { user } = useAuthStore();

	if (user) return <Navigate to="/" replace />;

	return <Outlet />;
};
export { ProtectedRoute, GuestRoute };
