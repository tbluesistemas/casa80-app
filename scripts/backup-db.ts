import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database backup...');

    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();
    const events = await prisma.event.findMany();
    const clients = await prisma.client.findMany();
    const eventItems = await prisma.eventItem.findMany();
    const inventoryLogs = await prisma.inventoryLog.findMany();

    const data = {
        users,
        products,
        events,
        clients,
        eventItems,
        inventoryLogs,
    };

    console.log('Records found:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Clients: ${clients.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- EventItems: ${eventItems.length}`);
    console.log(`- InventoryLogs: ${inventoryLogs.length}`);

    const backupDir = path.join(__dirname, '../backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    const backupPath = path.join(backupDir, 'data.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

    console.log(`\nBackup saved to: ${backupPath}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
