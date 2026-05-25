import type { RegisterUserType } from "@/types/UserType";
import api from "./axios";

export const signUp = async (formData: RegisterUserType) => {
	const response = await api.post("/auth/signup", formData);
	return response.data;
};

export const signIn = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const response = await api.post("/auth/signin", { email, password });
	return response.data;
};

export const checkAuth = async () => {
	const response = await api.get("/auth/check");
	return response.data;
};

export const logout = async () => {
	await api.post("/auth/logout");
};
