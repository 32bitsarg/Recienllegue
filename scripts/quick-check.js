const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const res = await prisma.restaurant.findMany({
        take: 10,
        select: { name: true, address: true }
    });
    console.log(JSON.stringify(res, null, 2));
}

main().finally(() => prisma.$disconnect());
