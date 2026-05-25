import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OfficesOverviewSectionProps {
	officesStats: {
		officeId: string;
		officeName: string;
		userCount: number;
	}[];
}

export const OfficesOverviewSection = ({
	officesStats,
}: OfficesOverviewSectionProps) => (
	<div>
		<h2 className="text-2xl font-bold mb-4">Offices Overview</h2>
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Total Offices</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{officesStats.length}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Total Users Across Offices</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{officesStats.reduce(
							(
								sum: number,
								office: {
									officeId: string;
									officeName: string;
									userCount: number;
								},
							) => sum + office.userCount,
							0,
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
);
