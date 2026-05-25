import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { routes } from "@/router/routes";
import { Link, useLocation, useNavigate } from "react-router";
import { logout } from "@/lib/api/authApi";
import { DoorOpenIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { toast } from "sonner";

const AppSidebar = React.memo(() => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const clearAuth = useAuthStore((state) => state.logout);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			// Clear auth state regardless of API success
			clearAuth();
			// Redirect to login
			toast.success("User Logged Out Successfully");
			navigate("/login");
		}
	};

	return (
		<Sidebar
			variant="floating"
			collapsible="icon"
			className="z-10 rounded-2xl will-change-[width]"
		>
			<SidebarHeader>
				<div className="flex items-center gap-2 overflow-hidden">
					<img
						src="./icon.ico"
						alt="App Logo"
						className="h-8 w-8 shrink-0 object-contain"
					/>

					<span
						className="
										whitespace-nowrap
										text-lg
										font-bold
										transition-all
										duration-200
										ease-out
										group-data-[collapsible=icon]:w-0
										group-data-[collapsible=icon]:opacity-0
										group-data-[collapsible=icon]:overflow-hidden
									"
					>
						title
					</span>
				</div>
			</SidebarHeader>
			<SidebarContent className="p-2">
				{routes.map(({ path, index, label, icon: Icon }) => {
					const to = index ? "/" : (path ?? "/");

					return (
						<SidebarMenuButton
							key={to}
							className="rounded-lg"
							asChild
							isActive={pathname === to}
						>
							<Link to={to}>
								<Icon size={16} weight="duotone" />
								<span>{label}</span>
							</Link>
						</SidebarMenuButton>
					);
				})}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenuButton
					className="rounded-lg bg-primary"
					variant={"outline"}
					onClick={handleLogout}
				>
					<DoorOpenIcon size={16} weight="duotone" />
					<span className="font-semibold">Logout</span>
				</SidebarMenuButton>
			</SidebarFooter>
		</Sidebar>
	);
});

AppSidebar.displayName = "AppSidebar";
export default AppSidebar;
