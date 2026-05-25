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
import type { RegisterUserType } from "@/types/UserType";
import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { OfficesType } from "@/types/OfficesType";
import type { UseMutationResult } from "@tanstack/react-query";

const Register = ({
	setIsLogin,
	offices,
	isLoading,
	register,
}: {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	offices?: OfficesType[];
	isLoading?: boolean;
	register: UseMutationResult<void, unknown, RegisterUserType, unknown>;
}) => {
	const [form, setForm] = useState<RegisterUserType>({
		name: "",
		email: "",
		gender: "",
		sex: "",
		password: "",
		confirmPassword: "",
		office: "",
	});

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		register.mutate(form);
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Register your account</CardTitle>
				<CardDescription>
					Enter your credentials below to register for a new account
				</CardDescription>
				<CardAction>
					<Button variant="link" onClick={() => setIsLogin(true)}>
						Login
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-6">
					<div className="grid gap-2">
						<Label>Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							value={form.email}
							name="email"
							onChange={handleChange}
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label>Password</Label>
							</div>
							<Input
								id="password"
								type="password"
								value={form.password}
								name="password"
								onChange={handleChange}
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label>Confirm Password</Label>
							</div>
							<Input
								type="password"
								value={form.confirmPassword}
								name="confirmPassword"
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Select
							onValueChange={(value) => setForm({ ...form, office: value })}
							disabled={isLoading}
						>
							<SelectTrigger className="w-full">
								<SelectValue
									placeholder={
										isLoading ? "Loading offices..." : "Select your office"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{offices?.map((office: OfficesType) => (
										<SelectItem key={office.id} value={office.id.toString()}>
											{office.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex-col gap-2">
				<Button onClick={handleSubmit} className="w-full">
					Register
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Register;
