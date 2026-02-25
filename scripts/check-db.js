const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking DB connection...");
        const count = await prisma.restaurant.count();
        console.log("Total Restaurants:", count);

        const first = await prisma.restaurant.findFirst();
        console.log("First record sample:", JSON.stringify(first, null, 2));
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
