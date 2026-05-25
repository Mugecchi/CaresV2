import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import auth from "./routes/authRoutes";
import options from "./routes/optionsRoute";
import records from "./routes/recordsRoutes";
import dashboard from "./routes/dashboardRoutes";
import { ENV } from "./lib/ENV";
import errorHandler from "./lib/errorHandler";
const app = express();

app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:3000"],
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());

// health check
app.get("/", (req, res) => {
	res.send({ message: "Hello World!" });
});

app.use("/api/auth", auth);
app.use("/api/options", options);
app.use("/api/records", records);
app.use("/api/dashboard", dashboard);

app.use(errorHandler);
const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
