import { useIsMobile } from "@/hooks/use-mobile";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOffices } from "@/lib/api/officesApi";
import { signUp } from "@/lib/api/authApi";
import type { RegisterUserType } from "@/types/UserType";
import { toast } from "sonner";

const LoginPage = () => {
	const isMobile = useIsMobile();
	const [isLogin, setIsLogin] = useState(true);

	// Move the query here - fetched once and shared with both components
	const { data: offices, isLoading } = useQuery({
		queryKey: ["offices"],
		queryFn: getOffices,
	});

	const register = useMutation({
		mutationKey: ["register"],
		mutationFn: async (formData: RegisterUserType) => {
			await signUp(formData);
		},
		onSuccess: () => {
			toast.success("Registration successful! Please login to your account.");
		},
	});

	return (
		<div className="flex min-h-screen justify-center items-center p-4">
			{!isMobile && (
				<img
					className="absolute bottom-0 right-0 transform-[translate(15%,25%)] pointer-events-none"
					src="./icon.ico"
					alt="App Logo"
					style={{
						width: 400,
						height: 400,
						objectFit: "contain",
						opacity: 0.5,
					}}
				/>
			)}
			{isLogin ? (
				<Login setIsLogin={setIsLogin} />
			) : (
				<Register
					setIsLogin={setIsLogin}
					offices={offices}
					isLoading={isLoading}
					register={register}
				/>
			)}
		</div>
	);
};

export default LoginPage;
