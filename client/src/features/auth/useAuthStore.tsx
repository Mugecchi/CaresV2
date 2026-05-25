import type { UserType } from "@/types/UserType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
	user: UserType | null;
	login: (data: UserType) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			login: (data: UserType) => {
				set({ user: data });
			},
			logout: () => {
				set({ user: null });
				localStorage.removeItem("token");
			},
		}),
		{
			name: "auth-store", // localStorage key
		},
	),
);
