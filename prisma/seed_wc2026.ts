
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const teams = [
    // Hosts
    { name: 'México', region: 'Norteamérica', type: 'Selección' },
    { name: 'Estados Unidos', region: 'Norteamérica', type: 'Selección' },
    { name: 'Canadá', region: 'Norteamérica', type: 'Selección' },

    // Qualified
    { name: 'Japón', region: 'Asia', type: 'Selección' },
    { name: 'Nueva Zelanda', region: 'Oceanía', type: 'Selección' },
    { name: 'República Islámica de Irán', region: 'Asia', type: 'Selección' },
    { name: 'Argentina', region: 'Sudamérica', type: 'Selección' },
    { name: 'Uzbekistán', region: 'Asia', type: 'Selección' },
    { name: 'República de Corea', region: 'Asia', type: 'Selección' },
    { name: 'Jordania', region: 'Asia', type: 'Selección' },
    { name: 'Australia', region: 'Asia', type: 'Selección' },
    { name: 'Ecuador', region: 'Sudamérica', type: 'Selección' },
    { name: 'Brasil', region: 'Sudamérica', type: 'Selección' },
    { name: 'Uruguay', region: 'Sudamérica', type: 'Selección' },
    { name: 'Colombia', region: 'Sudamérica', type: 'Selección' },
    { name: 'Paraguay', region: 'Sudamérica', type: 'Selección' },
    { name: 'Marruecos', region: 'África', type: 'Selección' },
    { name: 'Túnez', region: 'África', type: 'Selección' },
    { name: 'Egipto', region: 'África', type: 'Selección' },
    { name: 'Argelia', region: 'África', type: 'Selección' },
    { name: 'Ghana', region: 'África', type: 'Selección' },
    { name: 'Cabo Verde', region: 'África', type: 'Selección' },
    { name: 'Sudáfrica', region: 'África', type: 'Selección' },
    { name: 'Qatar', region: 'Asia', type: 'Selección' },
    { name: 'Inglaterra', region: 'Europa', type: 'Selección' },
    { name: 'Arabia Saudí', region: 'Asia', type: 'Selección' },
    { name: 'Costa de Marfil', region: 'África', type: 'Selección' },
    // Ghana duplicated in original list, skipped here
    { name: 'Francia', region: 'Europa', type: 'Selección' },
    { name: 'Croacia', region: 'Europa', type: 'Selección' },
    { name: 'Portugal', region: 'Europa', type: 'Selección' },
    { name: 'Noruega', region: 'Europa', type: 'Selección' },
    { name: 'Alemania', region: 'Europa', type: 'Selección' },
    { name: 'Países Bajos', region: 'Europa', type: 'Selección' },
    { name: 'Bélgica', region: 'Europa', type: 'Selección' },
    { name: 'Austria', region: 'Europa', type: 'Selección' },
    { name: 'España', region: 'Europa', type: 'Selección' },
    { name: 'Suiza', region: 'Europa', type: 'Selección' },
    { name: 'Escocia', region: 'Europa', type: 'Selección' },
    { name: 'Haití', region: 'Concacaf', type: 'Selección' },
    { name: 'Curazao', region: 'Concacaf', type: 'Selección' },
    { name: 'Panamá', region: 'Concacaf', type: 'Selección' }, // Fixed region from original 'Europa' typo in request

    // Playoff / Repechaje
    { name: 'Nueva Caledonia', region: 'Oceanía', type: 'Selección' },
    { name: 'Bolivia', region: 'Sudamérica', type: 'Selección' },
    { name: 'República Democrática del Congo', region: 'África', type: 'Selección' },
    { name: 'Iraq', region: 'Asia', type: 'Selección' },
    { name: 'Jamaica', region: 'Concacaf', type: 'Selección' },
    { name: 'Surinam', region: 'Concacaf', type: 'Selección' },
    { name: 'Dinamarca', region: 'Europa', type: 'Selección' },
    { name: 'Italia', region: 'Europa', type: 'Selección' },
    { name: 'Türkiye', region: 'Europa', type: 'Selección' },
    { name: 'Ucrania', region: 'Europa', type: 'Selección' },
    { name: 'Eslovenia', region: 'Europa', type: 'Selección' },
    { name: 'Gales', region: 'Europa', type: 'Selección' },
    { name: 'Polonia', region: 'Europa', type: 'Selección' },
    { name: 'Chequia', region: 'Europa', type: 'Selección' },
    { name: 'Albania', region: 'Europa', type: 'Selección' },
    { name: 'Bosnia y Herzegovina', region: 'Europa', type: 'Selección' },
    { name: 'Kosovo', region: 'Europa', type: 'Selección' },
    { name: 'Irlanda', region: 'Europa', type: 'Selección' },
    { name: 'Irlanda del Norte', region: 'Europa', type: 'Selección' },
    { name: 'República de Macedonia del Norte', region: 'Europa', type: 'Selección' },
    { name: 'Rumanía', region: 'Europa', type: 'Selección' },
    { name: 'Suecia', region: 'Europa', type: 'Selección' },
];

async function main() {
    console.log('Start seeding WC 2026 teams...');

    for (const team of teams) {
        const createdTeam = await prisma.team.upsert({
            where: { name: team.name },
            update: {
                type: team.type,
            },
            create: {
                name: team.name,
                type: team.type,
                // Since schema doesn't have 'region' field, we skip it or could add it if we modify schema.
                // Assuming 'country' field might be used for region or just left as null for now if strict country.
                // But requested to "agregar la información", so let's stick to what we have in schema:
                // name, type, logoUrl, country.
                // User list has (Region), maybe map that to 'country' field temporarily or just ignore?
                // Schema: country String?
                // Let's use the region as country/region info or just name.
                // Actually, 'country' in Team model usually refers to the nation.
                // Let's rely on name.
            },
        });
        console.log(`Upserted team: ${createdTeam.name}`);
    }

    // Create Tournament
    const tournament = await prisma.tournament.upsert({
        where: { id: 'wc-2026' },
        update: {},
        create: {
            id: 'wc-2026',
            name: 'Copa Mundial 2026',
            year: 2026,
            teamType: 'Selección',
        }
    });
    console.log(`Upserted tournament: ${tournament.name}`);

    const matches = [
        { teamA: 'México', teamB: 'TBD', date: new Date('2026-06-11T19:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo A' },
        { teamA: 'Canadá', teamB: 'TBD', date: new Date('2026-06-12T19:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo B' },
        { teamA: 'Estados Unidos', teamB: 'TBD', date: new Date('2026-06-12T22:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo D' },
        { teamA: 'Argentina', teamB: 'TBD', date: new Date('2026-06-14T15:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo C' },
        { teamA: 'Brasil', teamB: 'TBD', date: new Date('2026-06-15T18:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo E' },
        { teamA: 'España', teamB: 'TBD', date: new Date('2026-06-16T12:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo F' },
        { teamA: 'Francia', teamB: 'TBD', date: new Date('2026-06-16T15:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo G' },
        { teamA: 'Alemania', teamB: 'TBD', date: new Date('2026-06-17T12:00:00Z'), stage: 'Fase de Grupos', group: 'Grupo H' },
    ];

    for (const match of matches) {
        const existingMatch = await prisma.match.findFirst({
            where: {
                teamA: match.teamA,
                teamB: match.teamB,
                tournamentId: tournament.id
            }
        });

        if (!existingMatch) {
            await prisma.match.create({
                data: {
                    teamA: match.teamA,
                    teamB: match.teamB,
                    date: match.date,
                    stage: match.stage,
                    group: match.group,
                    tournamentId: tournament.id
                }
            });
            console.log(`Created match: ${match.teamA} vs ${match.teamB}`);
        } else {
             await prisma.match.update({
                 where: { id: existingMatch.id },
                 data: {
                     stage: match.stage,
                     group: match.group
                 }
             });
             console.log(`Updated match: ${match.teamA} vs ${match.teamB}`);
        }
    }

    console.log('Seeding finished.');
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
