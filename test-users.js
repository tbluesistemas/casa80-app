const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users found:', users.length);
        console.log(JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
