import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('Buscando usuario con email elbardelorencia990@gmail.com...');

    const user = await prisma.user.findUnique({
        where: { email: 'elbardelorencia990@gmail.com' }
    });

    if (!user) {
        console.log('Error: No se encontró ningún usuario con ese correo en la base de datos de producción.');
        process.exit(1);
    }

    console.log(`Usuario encontrado: ${user.name || user.username || 'Sin nombre'} (${user.email})`);
    console.log(`Rol actual: ${user.role}`);

    console.log('Actualizando rol a ADMIN...');

    const updatedUser = await prisma.user.update({
        where: { email: 'elbardelorencia990@gmail.com' },
        data: { role: 'ADMIN' }
    });

    console.log('✅ Éxito! El usuario ahora es administrador.');
    console.log(`Nuevo rol: ${updatedUser.role}`);
}

main()
    .catch((e) => {
        console.error('Ha ocurrido un error inesperado:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
