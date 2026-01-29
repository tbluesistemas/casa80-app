const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUsers() {
    try {
        console.log('Creando usuarios...');

        // Hash passwords
        const adminPassword = await bcrypt.hash('admin123', 10);
        const viewerPassword = await bcrypt.hash('viewer123', 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: 'admin@casa80.com',
                name: 'Administrator',
                password: adminPassword,
                role: 'ADMIN',
                active: true
            }
        });

        // Create viewer user
        const viewer = await prisma.user.create({
            data: {
                email: 'viewer@casa80.com',
                name: 'Viewer User',
                password: viewerPassword,
                role: 'VIEWER',
                active: true
            }
        });

        console.log('✅ Usuarios creados:');
        console.log('  - Admin:', admin.email, '(password: admin123)');
        console.log('  - Viewer:', viewer.email, '(password: viewer123)');

    } catch (error) {
        console.error('Error creating users:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createUsers();
