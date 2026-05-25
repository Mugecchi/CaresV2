import "dotenv/config";

export const ENV = {
	DATABASE_URL: process.env.DATABASE_URL,
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	NODE_ENV: process.env.NODE_ENV,
};
