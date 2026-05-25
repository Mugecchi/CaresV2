import { createBrowserRouter } from "react-router";
import type { ComponentType } from "react";
import type { Icon } from "@phosphor-icons/react";
import { House } from "@phosphor-icons/react";
import LoginPage from "@/Pages/LoginPages/LoginPage";
import { GuestRoute, ProtectedRoute } from "@/features/auth/ProtectedRoute";
import Dashboard from "@/Pages/DashboardPages/Dashboard";
import Layout from "@/features/layout/Layout";
import RecordsPage from "@/Pages/Records/RecordsPage";

type RouteConfig = {
	path?: string;
	index?: boolean;
	label: string;
	icon: Icon;
	Component: ComponentType;
};

export const routes: RouteConfig[] = [
	{ index: true, label: "Dashboard", icon: House, Component: Dashboard },
	{ path: "/records", label: "Records", icon: House, Component: RecordsPage },
];

export const router = createBrowserRouter([
	{
		element: <GuestRoute />,
		children: [
			{
				path: "/login",
				Component: LoginPage,
			},
		],
	},
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				element: <Layout />,
				children: [
					...routes.map(({ path, Component, index }) => ({
						index,
						path,
						element: <Component />,
					})),
				],
			},
		],
	},
]);
