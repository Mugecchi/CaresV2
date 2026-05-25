import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "../generated/prisma/enums";
async function main() {
	const password = "admin@123";
	const hashedPassword = await bcrypt.hash(password, 10);
	// Create a new user with a post
	const user = await prisma.users.create({
		data: {
			name: "admin",
			email: "admin",
			password: hashedPassword,
			role: Role.ADMIN,
		},
	});

	// Fetch all users with their posts
	const allUsers = await prisma.users.findMany();
	console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
