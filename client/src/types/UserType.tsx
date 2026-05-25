export interface UserType {
	id: number;
	name: string;
	email: string;
	role: string;
	office: string;
	activeStatus: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface RegisterUserType {
	name: string;
	email: string;
	password: string;
	gender: "Masculine" | "Feminine" | "Other" | "Prefer not to say" | "";
	sex: "Male" | "Female" | "";
	confirmPassword: string;
	office: string;
}
