import { prisma } from "../lib/prisma";
import { Offices } from "../generated/prisma/browser";
const offices = [
	"Mayor’s Office",
	"Vice Mayor’s Office",
	"Sangguniang Panlungsod (City Council)",
	"City Administrator’s Office",
	"Human Resource Management Office (HRMO)",
	"Legal Office",
	"Public Information Office (PIO)",
	"City Treasurer’s Office",
	"City Accountant’s Office",
	"City Budget Office",
	"City Assessor’s Office",
	"Bids and Awards Committee (BAC)",
	"General Services Office (GSO)",
	"City Planning and Development Office (CPDO)",
	"City Engineer’s Office",
	"City Environment and Natural Resources Office (CENRO)",
	"City Information and Communications Technology Office (CICTO)",
	"City Health Office (CHO)",
	"City Social Welfare and Development Office (CSWDO)",
	"Population Office",
	"Persons with Disability Affairs Office (PDAO)",
	"Disaster Risk Reduction and Management Office (CDRRMO)",
	"Public Safety Office",
	"Traffic Management Office",
	"City Agriculture Office",
	"Veterinary Office",
	"Business Permits and Licensing Office (BPLO)",
	"Investment Promotions Office",
	"PESO (Public Employment Service Office)",
	"Civil Registrar’s Office",
	"COMELEC Office",
	"DILG Field Office",
	"Local Economic Development Office",
	"Tourism Office",
	"Youth Development Office",
	"Senior Citizens Affairs Office (OSCA)",
	"Cooperative Development Office",
];

async function main() {
	for (const officeName of offices) {
		try {
			const existingOffice = await prisma.offices.findMany({
				where: { name: officeName },
			});
			if (existingOffice.length > 0) {
				console.log(`Office "${officeName}" already exists. Skipping...`);
				continue;
			}
			await prisma.offices.create({
				data: {
					name: officeName,
				},
			});
		} catch (error) {
			console.error(`Error creating office ${officeName}:`, error);
		}
	}
	const createdOffices = await prisma.offices.findMany();
	console.log("Offices created:", createdOffices);
}

// async function main() {
// 	const records = await prisma.records.findMany();
// 	console.log(records);
// }

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
