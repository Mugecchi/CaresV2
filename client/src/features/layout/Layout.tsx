import React, { useMemo } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Outlet } from "react-router";
import {
	Bell,
	DoorOpenIcon,
	GearIcon,
	PersonIcon,
} from "@phosphor-icons/react";

// Memoized content component to isolate from sidebar state changes
const LayoutContent = React.memo(() => {
	return (
		<SidebarInset className="z-10 bg-transparent">
			<header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/55 px-4 backdrop-blur-sm">
				{/* Left */}
				<SidebarTrigger aria-label="Toggle sidebar" />

				{/* Right */}
				<div className="flex items-center gap-2">
					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="rounded-md p-2 hover:bg-accent">
								<Bell className="h-4 w-4" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem disabled>No notifications</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Theme Toggle */}
					<ThemeToggle />

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="rounded-md p-2 hover:bg-accent">
								<PersonIcon className="h-4 w-4" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<PersonIcon className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<GearIcon className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<DoorOpenIcon className="mr-2 h-4 w-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			<main
				className="flex-1 p-4 will-change-auto"
				style={{ contain: "layout style paint" } as React.CSSProperties}
			>
				<Outlet />
			</main>
		</SidebarInset>
	);
});

LayoutContent.displayName = "LayoutContent";

const Layout = () => {
	return (
		<SidebarProvider>
			<div className="relative flex min-h-svh w-full overflow-hidden">
				<AppSidebar />
				<LayoutContent />
			</div>
		</SidebarProvider>
	);
};

Layout.displayName = "Layout";
export default Layout;
