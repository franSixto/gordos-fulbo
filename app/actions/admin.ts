'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await db.user.findUnique({
        where: { id: userId },
    });

    return user?.isAdmin ?? false;
}

export async function createTournament(name: string, year: number, teamType?: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized");

    await db.tournament.create({
        data: { name, year, teamType }
    });
    revalidatePath('/admin');
}

export async function deleteTournament(tournamentId: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized");

    await db.tournament.delete({
        where: { id: tournamentId }
    });
    revalidatePath('/admin');
}

export async function deleteMatch(matchId: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized");

    // Get users who predicted on this match to recalculate their points later
    const predictions = await db.prediction.findMany({
        where: { matchId },
        select: { userId: true }
    });
    const userIds = Array.from(new Set(predictions.map(p => p.userId)));

    await db.match.delete({
        where: { id: matchId }
    });

    // Recalculate total points for all affected users
    for (const userId of userIds) {
        const total = await db.prediction.aggregate({
            where: { userId },
            _sum: { points: true }
        });
        await db.user.update({
            where: { id: userId },
            data: { totalPoints: total._sum.points || 0 }
        });
    }

    revalidatePath('/admin');
    revalidatePath('/matches');
    revalidatePath('/ranking');
}

export async function createMatch(tournamentId: string, teamA: string, teamB: string, date: Date, stage?: string, group?: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized");

    await db.match.create({
        data: {
            tournamentId,
            teamA,
            teamB,
            date,
            stage,
            group
        }
    });
    revalidatePath('/admin');
    revalidatePath('/matches');
}

export async function updateMatch(matchId: string, data: { teamA?: string, teamB?: string, date?: Date, stage?: string, group?: string }) {
    if (!await checkAdmin()) throw new Error("Unauthorized");

    await db.match.update({
        where: { id: matchId },
        data: {
            teamA: data.teamA,
            teamB: data.teamB,
            date: data.date,
            stage: data.stage,
            group: data.group
        }
    });
    revalidatePath('/admin');
    revalidatePath('/matches');
}

export async function setMatchResult(matchId: string, scoreA: number, scoreB: number) {
    if (!await checkAdmin()) throw new Error("Unauthorized");

    await db.match.update({
        where: { id: matchId },
        data: {
            actualScoreA: scoreA,
            actualScoreB: scoreB,
            isPlayed: true
        }
    });

    // Calculate points for all predictions for this match
    const predictions = await db.prediction.findMany({
        where: { matchId }
    });

    for (const prediction of predictions) {
        let points = 0;
        const predA = prediction.predictedScoreA;
        const predB = prediction.predictedScoreB;

        if (predA === scoreA && predB === scoreB) {
            points = 3; // Exact result
        } else {
            const actualWinner = scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : 'Draw';
            const predictedWinner = predA > predB ? 'A' : predA < predB ? 'B' : 'Draw';
            if (actualWinner === predictedWinner) {
                points = 1; // Correct winner/draw
            }
        }

        // Update prediction points
        await db.prediction.update({
            where: { id: prediction.id },
            data: { points }
        });
    }

    // Recalculate total points for all affected users
    const userIds = Array.from(new Set(predictions.map((p: { userId: string }) => p.userId)));
    for (const userId of userIds) {
        const total = await db.prediction.aggregate({
            where: { userId },
            _sum: { points: true }
        });
        await db.user.update({
            where: { id: userId },
            data: { totalPoints: total._sum.points || 0 }
        });
    }

    revalidatePath('/matches');
    revalidatePath('/ranking');
}

export async function getUsers() {
    if (!await checkAdmin()) throw new Error("Unauthorized");
    return await db.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function toggleAdmin(userId: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await db.user.update({
        where: { id: userId },
        data: { isAdmin: !user.isAdmin }
    });
    revalidatePath('/admin');
}

export async function getTournaments() {
    // Public read is fine, but for admin actions we might want this here
    return await db.tournament.findMany({
        include: { matches: true },
        orderBy: { createdAt: 'desc' }
    });
}
