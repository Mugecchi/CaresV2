import { Button } from "@/components/ui/button";
import {
	Card,
	CardFooter,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useNavigate } from "react-router";
import { signIn } from "@/lib/api/authApi";

const Login = ({
	setIsLogin,
}: {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const setUser = useAuthStore((state) => state.login);
	const navigate = useNavigate();
	const loginMutation = useMutation({
		mutationFn: () => signIn({ email, password }),
		onSuccess: (data) => {
			setUser(data.user);
			toast.success("Login successful!");
			navigate("/dashboard");
		},
		onError: (error) => {
			toast.error("Invalid Credentials");
			console.error(error);
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginMutation.mutate();
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
				<CardAction>
					<Button variant="link" onClick={() => setIsLogin(false)}>
						Sign Up
					</Button>
				</CardAction>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loginMutation.isPending}
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loginMutation.isPending}
								required
							/>
							<a
								href="#"
								className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</a>
						</div>
					</div>
				</CardContent>

				<CardFooter className="flex-col gap-2">
					<Button
						type="submit"
						className="w-full"
						disabled={loginMutation.isPending}
					>
						{loginMutation.isPending ? "Logging in..." : "Login"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
};

export default Login;
