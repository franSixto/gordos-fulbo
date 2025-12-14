
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TOURNAMENT_NAME = 'Copa Mundial 2026';
const TOURNAMENT_YEAR = 2026;

// Helper to parse date string "Jun 11, 26 4:00 PM" to Date object
function parseDate(dateStr: string): Date {
    // Add "20" to year to make it "2026"
    const parts = dateStr.split(',');
    if (parts.length < 2) return new Date();
    
    const datePart = parts[0].trim(); // "Jun 11"
    const yearTimePart = parts[1].trim(); // "26 4:00 PM"
    
    const [yearShort, ...timeParts] = yearTimePart.split(' ');
    const timeStr = timeParts.join(' ');
    
    const fullDateStr = `${datePart}, 20${yearShort} ${timeStr}`;
    return new Date(fullDateStr);
}

const matchesData = [
    // Group A
    { group: 'A', stage: 'Fase de Grupos', date: 'Jun 11, 26 4:00 PM', teamA: 'México', teamB: 'Sudáfrica' },
    { group: 'A', stage: 'Fase de Grupos', date: 'Jun 11, 26 11:00 PM', teamA: 'Corea del Sur', teamB: 'TBD' }, // TBD handled as placeholder
    { group: 'A', stage: 'Fase de Grupos', date: 'Jun 18, 26 1:00 PM', teamA: 'TBD', teamB: 'Sudáfrica' },
    { group: 'A', stage: 'Fase de Grupos', date: 'Jun 18, 26 10:00 PM', teamA: 'México', teamB: 'Corea del Sur' },
    { group: 'A', stage: 'Fase de Grupos', date: 'Jun 24, 26 10:00 PM', teamA: 'Sudáfrica', teamB: 'Corea del Sur' },
    { group: 'A', stage: 'Fase de Grupos', date: 'Jun 24, 26 10:00 PM', teamA: 'TBD', teamB: 'México' },

    // Group B
    { group: 'B', stage: 'Fase de Grupos', date: 'Jun 12, 26 4:00 PM', teamA: 'Canadá', teamB: 'TBD' },
    { group: 'B', stage: 'Fase de Grupos', date: 'Jun 13, 26 4:00 PM', teamA: 'Qatar', teamB: 'Suiza' },
    { group: 'B', stage: 'Fase de Grupos', date: 'Jun 18, 26 4:00 PM', teamA: 'Suiza', teamB: 'TBD' },
    { group: 'B', stage: 'Fase de Grupos', date: 'Jun 18, 26 7:00 PM', teamA: 'Canadá', teamB: 'Qatar' },
    { group: 'B', stage: 'Fase de Grupos', date: 'Jun 24, 26 4:00 PM', teamA: 'Suiza', teamB: 'Canadá' },
    { group: 'B', stage: 'Fase de Grupos', date: 'Jun 24, 26 4:00 PM', teamA: 'TBD', teamB: 'Qatar' },

    // Group C
    { group: 'C', stage: 'Fase de Grupos', date: 'Jun 13, 26 7:00 PM', teamA: 'Brasil', teamB: 'Marruecos' },
    { group: 'C', stage: 'Fase de Grupos', date: 'Jun 13, 26 10:00 PM', teamA: 'Haití', teamB: 'Escocia' },
    { group: 'C', stage: 'Fase de Grupos', date: 'Jun 19, 26 7:00 PM', teamA: 'Escocia', teamB: 'Marruecos' },
    { group: 'C', stage: 'Fase de Grupos', date: 'Jun 19, 26 10:00 PM', teamA: 'Brasil', teamB: 'Haití' },
    { group: 'C', stage: 'Fase de Grupos', date: 'Jun 24, 26 7:00 PM', teamA: 'Marruecos', teamB: 'Haití' },
    { group: 'C', stage: 'Fase de Grupos', date: 'Jun 24, 26 7:00 PM', teamA: 'Escocia', teamB: 'Brasil' },

    // Group D
    { group: 'D', stage: 'Fase de Grupos', date: 'Jun 12, 26 10:00 PM', teamA: 'Estados Unidos', teamB: 'Paraguay' },
    { group: 'D', stage: 'Fase de Grupos', date: 'Jun 14, 26 1:00 AM', teamA: 'Australia', teamB: 'TBD' },
    { group: 'D', stage: 'Fase de Grupos', date: 'Jun 19, 26 4:00 PM', teamA: 'Estados Unidos', teamB: 'Australia' },
    { group: 'D', stage: 'Fase de Grupos', date: 'Jun 20, 26 1:00 AM', teamA: 'TBD', teamB: 'Paraguay' },
    { group: 'D', stage: 'Fase de Grupos', date: 'Jun 25, 26 11:00 PM', teamA: 'TBD', teamB: 'Estados Unidos' },
    { group: 'D', stage: 'Fase de Grupos', date: 'Jun 25, 26 11:00 PM', teamA: 'Paraguay', teamB: 'Australia' },

    // Group E
    { group: 'E', stage: 'Fase de Grupos', date: 'Jun 14, 26 2:00 PM', teamA: 'Alemania', teamB: 'Curazao' },
    { group: 'E', stage: 'Fase de Grupos', date: 'Jun 14, 26 8:00 PM', teamA: 'Costa de Marfil', teamB: 'Ecuador' },
    { group: 'E', stage: 'Fase de Grupos', date: 'Jun 20, 26 5:00 PM', teamA: 'Alemania', teamB: 'Costa de Marfil' },
    { group: 'E', stage: 'Fase de Grupos', date: 'Jun 20, 26 9:00 PM', teamA: 'Ecuador', teamB: 'Curazao' },
    { group: 'E', stage: 'Fase de Grupos', date: 'Jun 25, 26 5:00 PM', teamA: 'Curazao', teamB: 'Costa de Marfil' },
    { group: 'E', stage: 'Fase de Grupos', date: 'Jun 25, 26 5:00 PM', teamA: 'Ecuador', teamB: 'Alemania' },

    // Group F
    { group: 'F', stage: 'Fase de Grupos', date: 'Jun 14, 26 5:00 PM', teamA: 'Países Bajos', teamB: 'Japón' },
    { group: 'F', stage: 'Fase de Grupos', date: 'Jun 14, 26 11:00 PM', teamA: 'TBD', teamB: 'Túnez' },
    { group: 'F', stage: 'Fase de Grupos', date: 'Jun 20, 26 2:00 PM', teamA: 'Países Bajos', teamB: 'TBD' },
    { group: 'F', stage: 'Fase de Grupos', date: 'Jun 21, 26 1:00 AM', teamA: 'Túnez', teamB: 'Japón' },
    { group: 'F', stage: 'Fase de Grupos', date: 'Jun 25, 26 8:00 PM', teamA: 'Túnez', teamB: 'Países Bajos' },
    { group: 'F', stage: 'Fase de Grupos', date: 'Jun 25, 26 8:00 PM', teamA: 'Japón', teamB: 'TBD' },

    // Group G
    { group: 'G', stage: 'Fase de Grupos', date: 'Jun 15, 26 4:00 PM', teamA: 'Bélgica', teamB: 'Egipto' },
    { group: 'G', stage: 'Fase de Grupos', date: 'Jun 15, 26 10:00 PM', teamA: 'Irán', teamB: 'Nueva Zelanda' },
    { group: 'G', stage: 'Fase de Grupos', date: 'Jun 21, 26 4:00 PM', teamA: 'Bélgica', teamB: 'Irán' },
    { group: 'G', stage: 'Fase de Grupos', date: 'Jun 21, 26 10:00 PM', teamA: 'Nueva Zelanda', teamB: 'Egipto' },
    { group: 'G', stage: 'Fase de Grupos', date: 'Jun 27, 26 12:00 AM', teamA: 'Nueva Zelanda', teamB: 'Bélgica' },
    { group: 'G', stage: 'Fase de Grupos', date: 'Jun 27, 26 12:00 AM', teamA: 'Egipto', teamB: 'Irán' },

    // Group H
    { group: 'H', stage: 'Fase de Grupos', date: 'Jun 15, 26 1:00 PM', teamA: 'España', teamB: 'Cabo Verde' },
    { group: 'H', stage: 'Fase de Grupos', date: 'Jun 15, 26 7:00 PM', teamA: 'Arabia Saudí', teamB: 'Uruguay' },
    { group: 'H', stage: 'Fase de Grupos', date: 'Jun 21, 26 1:00 PM', teamA: 'España', teamB: 'Arabia Saudí' },
    { group: 'H', stage: 'Fase de Grupos', date: 'Jun 21, 26 7:00 PM', teamA: 'Uruguay', teamB: 'Cabo Verde' },
    { group: 'H', stage: 'Fase de Grupos', date: 'Jun 26, 26 9:00 PM', teamA: 'Cabo Verde', teamB: 'Arabia Saudí' },
    { group: 'H', stage: 'Fase de Grupos', date: 'Jun 26, 26 9:00 PM', teamA: 'Uruguay', teamB: 'España' },

    // Group I
    { group: 'I', stage: 'Fase de Grupos', date: 'Jun 16, 26 4:00 PM', teamA: 'Francia', teamB: 'Senegal' },
    { group: 'I', stage: 'Fase de Grupos', date: 'Jun 16, 26 7:00 PM', teamA: 'TBD', teamB: 'Noruega' },
    { group: 'I', stage: 'Fase de Grupos', date: 'Jun 22, 26 6:00 PM', teamA: 'Francia', teamB: 'TBD' },
    { group: 'I', stage: 'Fase de Grupos', date: 'Jun 22, 26 9:00 PM', teamA: 'Noruega', teamB: 'Senegal' },
    { group: 'I', stage: 'Fase de Grupos', date: 'Jun 26, 26 4:00 PM', teamA: 'Noruega', teamB: 'Francia' },
    { group: 'I', stage: 'Fase de Grupos', date: 'Jun 26, 26 4:00 PM', teamA: 'Senegal', teamB: 'TBD' },

    // Group J
    { group: 'J', stage: 'Fase de Grupos', date: 'Jun 16, 26 10:00 PM', teamA: 'Argentina', teamB: 'Argelia' },
    { group: 'J', stage: 'Fase de Grupos', date: 'Jun 17, 26 1:00 AM', teamA: 'Austria', teamB: 'Jordania' },
    { group: 'J', stage: 'Fase de Grupos', date: 'Jun 22, 26 2:00 PM', teamA: 'Argentina', teamB: 'Austria' },
    { group: 'J', stage: 'Fase de Grupos', date: 'Jun 23, 26 12:00 AM', teamA: 'Jordania', teamB: 'Argelia' },
    { group: 'J', stage: 'Fase de Grupos', date: 'Jun 27, 26 11:00 PM', teamA: 'Argelia', teamB: 'Austria' },
    { group: 'J', stage: 'Fase de Grupos', date: 'Jun 27, 26 11:00 PM', teamA: 'Jordania', teamB: 'Argentina' },

    // Group K
    { group: 'K', stage: 'Fase de Grupos', date: 'Jun 17, 26 2:00 PM', teamA: 'Portugal', teamB: 'TBD' },
    { group: 'K', stage: 'Fase de Grupos', date: 'Jun 17, 26 11:00 PM', teamA: 'Uzbekistán', teamB: 'Colombia' },
    { group: 'K', stage: 'Fase de Grupos', date: 'Jun 23, 26 2:00 PM', teamA: 'Portugal', teamB: 'Uzbekistán' },
    { group: 'K', stage: 'Fase de Grupos', date: 'Jun 23, 26 11:00 PM', teamA: 'Colombia', teamB: 'TBD' },
    { group: 'K', stage: 'Fase de Grupos', date: 'Jun 27, 26 8:30 PM', teamA: 'Colombia', teamB: 'Portugal' },
    { group: 'K', stage: 'Fase de Grupos', date: 'Jun 27, 26 8:30 PM', teamA: 'TBD', teamB: 'Uzbekistán' },

    // Group L
    { group: 'L', stage: 'Fase de Grupos', date: 'Jun 17, 26 5:00 PM', teamA: 'Inglaterra', teamB: 'Croacia' },
    { group: 'L', stage: 'Fase de Grupos', date: 'Jun 17, 26 8:00 PM', teamA: 'Ghana', teamB: 'Panamá' },
    { group: 'L', stage: 'Fase de Grupos', date: 'Jun 23, 26 5:00 PM', teamA: 'Inglaterra', teamB: 'Ghana' },
    { group: 'L', stage: 'Fase de Grupos', date: 'Jun 23, 26 8:00 PM', teamA: 'Panamá', teamB: 'Croacia' },
    { group: 'L', stage: 'Fase de Grupos', date: 'Jun 27, 26 6:00 PM', teamA: 'Panamá', teamB: 'Inglaterra' },
    { group: 'L', stage: 'Fase de Grupos', date: 'Jun 27, 26 6:00 PM', teamA: 'Croacia', teamB: 'Ghana' },

    // Round of 32
    { stage: '16avos de Final', date: 'Jun 28, 26 4:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jun 29, 26 2:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jun 29, 26 5:30 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jun 29, 26 10:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jun 30, 26 2:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jun 30, 26 6:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jun 30, 26 10:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 1, 26 1:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 1, 26 5:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 1, 26 9:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 2, 26 4:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 2, 26 8:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 3, 26 12:00 AM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 3, 26 3:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 3, 26 7:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: '16avos de Final', date: 'Jul 3, 26 10:30 PM', teamA: 'TBD', teamB: 'TBD' },

    // Round of 16
    { stage: 'Octavos de Final', date: 'Jul 4, 26 2:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Octavos de Final', date: 'Jul 4, 26 6:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Octavos de Final', date: 'Jul 5, 26 5:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Octavos de Final', date: 'Jul 5, 26 9:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Octavos de Final', date: 'Jul 6, 26 4:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Octavos de Final', date: 'Jul 6, 26 9:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Octavos de Final', date: 'Jul 7, 26 1:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Octavos de Final', date: 'Jul 7, 26 5:00 PM', teamA: 'TBD', teamB: 'TBD' },

    // Quarter-finals
    { stage: 'Cuartos de Final', date: 'Jul 9, 26 5:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Cuartos de Final', date: 'Jul 10, 26 4:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Cuartos de Final', date: 'Jul 11, 26 6:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Cuartos de Final', date: 'Jul 11, 26 10:00 PM', teamA: 'TBD', teamB: 'TBD' },

    // Semi-finals
    { stage: 'Semifinal', date: 'Jul 14, 26 4:00 PM', teamA: 'TBD', teamB: 'TBD' },
    { stage: 'Semifinal', date: 'Jul 15, 26 4:00 PM', teamA: 'TBD', teamB: 'TBD' },

    // Third place
    { stage: 'Tercer Puesto', date: 'Jul 18, 26 6:00 PM', teamA: 'TBD', teamB: 'TBD' },

    // Final
    { stage: 'Final', date: 'Jul 19, 26 4:00 PM', teamA: 'TBD', teamB: 'TBD' },
];

const tournamentConfig = {
    stages: [
        { name: 'Fase de Grupos', order: 1, type: 'group' },
        { name: '16avos de Final', order: 2, type: 'knockout' },
        { name: 'Octavos de Final', order: 3, type: 'knockout' },
        { name: 'Cuartos de Final', order: 4, type: 'knockout' },
        { name: 'Semifinal', order: 5, type: 'knockout' },
        { name: 'Tercer Puesto', order: 6, type: 'knockout' },
        { name: 'Final', order: 7, type: 'knockout' }
    ],
    groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
};

async function main() {
    console.log('🌱 Iniciando seed del Mundial 2026...');

    // 1. Create Tournament
    const tournament = await prisma.tournament.create({
        data: {
            name: TOURNAMENT_NAME,
            year: TOURNAMENT_YEAR,
            teamType: 'Selección',
            config: JSON.stringify(tournamentConfig)
        }
    });
    console.log(`🏆 Torneo creado: ${tournament.name}`);

    // 2. Ensure Teams Exist
    const teamsSet = new Set<string>();
    matchesData.forEach(m => {
        if (m.teamA !== 'TBD') teamsSet.add(m.teamA);
        if (m.teamB !== 'TBD') teamsSet.add(m.teamB);
    });

    for (const teamName of teamsSet) {
        await prisma.team.upsert({
            where: { name: teamName },
            update: {},
            create: {
                name: teamName,
                type: 'Selección',
                country: teamName // Simple assumption
            }
        });
    }
    console.log(`🌍 Equipos verificados/creados: ${teamsSet.size}`);

    // 3. Create Matches
    let matchesCreated = 0;
    let matchesUpdated = 0;
    for (const matchData of matchesData) {
        const matchDate = parseDate(matchData.date);
        
        const existingMatch = await prisma.match.findFirst({
            where: {
                tournamentId: tournament.id,
                teamA: matchData.teamA,
                teamB: matchData.teamB,
            }
        });

        if (existingMatch) {
            await prisma.match.update({
                where: { id: existingMatch.id },
                data: {
                    stage: matchData.stage,
                    group: matchData.group,
                    date: matchDate
                }
            });
            matchesUpdated++;
        } else {
            await prisma.match.create({
                data: {
                    tournamentId: tournament.id,
                    teamA: matchData.teamA,
                    teamB: matchData.teamB,
                    date: matchDate,
                    stage: matchData.stage,
                    group: matchData.group
                }
            });
            matchesCreated++;
        }
    }
    console.log(`⚽ Partidos creados: ${matchesCreated}`);
    console.log(`🔄 Partidos actualizados: ${matchesUpdated}`);
    console.log('✅ Seed completado con éxito.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
