
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Attempt to access `teamType` in create input type.
        // If it compiles and runs (even if we don't actually create), it means the type is there.
        // We can also just try to create one and rollback or delete it.

        // Actually, just checking if the property exists on the model validation is enough?
        // Let's try to create a tournament with teamType.
        const t = await prisma.tournament.create({
            data: {
                name: 'Test Tournament for Type',
                year: 2026,
                teamType: 'Selección'
            }
        });
        console.log(`Created tournament with type: ${t.teamType}`);

        // Cleanup
        await prisma.tournament.delete({
            where: { id: t.id }
        });
        console.log('Cleanup successful');

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
