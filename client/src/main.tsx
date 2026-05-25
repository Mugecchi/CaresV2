/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "@/router/routes";
import { BackgroundOrbs } from "@/components/ui/backgroundOrbs.tsx";
import { initializeTheme } from "@/lib/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import { useAuthInit } from "@/features/auth/useAuthInit";

initializeTheme();

const queryClient = new QueryClient();

function RootApp() {
	useAuthInit();
	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<BackgroundOrbs />
			<Toaster closeButton richColors />
			<RouterProvider router={router} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<RootApp />
		</QueryClientProvider>
	</StrictMode>,
);
