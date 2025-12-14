
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const teams = await prisma.team.findMany();
    console.log(`Total teams in database: ${teams.length}`);

    const expectedTeams = [
        'México', 'Estados Unidos', 'Canadá', 'Japón', 'Nueva Zelanda', 'República Islámica de Irán', 'Argentina',
        'Uzbekistán', 'República de Corea', 'Jordania', 'Australia', 'Ecuador', 'Brasil',
        'Uruguay', 'Colombia', 'Paraguay', 'Marruecos', 'Túnez', 'Egipto', 'Argelia',
        'Ghana', 'Cabo Verde', 'Sudáfrica', 'Qatar', 'Inglaterra', 'Arabia Saudí',
        'Costa de Marfil', 'Francia', 'Croacia', 'Portugal', 'Noruega', 'Alemania',
        'Países Bajos', 'Bélgica', 'Austria', 'España', 'Suiza', 'Escocia', 'Haití',
        'Curazao', 'Panamá', 'Nueva Caledonia', 'Bolivia', 'República Democrática del Congo',
        'Iraq', 'Jamaica', 'Surinam', 'Dinamarca', 'Italia', 'Türkiye', 'Ucrania',
        'Eslovenia', 'Gales', 'Polonia', 'Chequia', 'Albania', 'Bosnia y Herzegovina',
        'Kosovo', 'Irlanda', 'Irlanda del Norte', 'República de Macedonia del Norte',
        'Rumanía', 'Suecia'
    ];

    let missing = [];
    for (const name of expectedTeams) {
        const found = teams.find(t => t.name === name);
        if (!found) {
            missing.push(name);
        }
    }

    if (missing.length > 0) {
        console.error('Missing teams:', missing);
    } else {
        console.log('All expected teams found!');
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
