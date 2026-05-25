import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { checkAuth } from "@/lib/api/authApi";

export const useAuthInit = () => {
	useEffect(() => {
		const initAuth = async () => {
			try {
				// Verify token with backend
				const { user } = await checkAuth();
				useAuthStore.setState({ user });
			} catch (err) {
				// Token invalid or expired, clear auth state
				console.error("Auth check failed:", err);
				useAuthStore.setState({ user: null });
				localStorage.removeItem("token");
			}
		};

		initAuth();
	}, []);
};
