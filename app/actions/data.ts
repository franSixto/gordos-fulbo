'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function getMatches() {
    return await db.match.findMany({
        orderBy: { date: 'asc' },
        include: {
            tournament: true
        }
    });
}

export async function getUserPredictions(userId: string) {
    return await db.prediction.findMany({
        where: { userId },
        include: {
            match: true
        }
    });
}

export async function getLeagues() {
    // For now, return all public leagues or leagues the user is part of
    // This logic can be refined
    return await db.league.findMany({
        include: {
            participants: true
        }
    });
}

export async function getTournaments() {
    return await db.tournament.findMany({
        orderBy: { year: 'desc' }
    });
}

export async function getRanking() {
    return await db.user.findMany({
        orderBy: { totalPoints: 'desc' },
        select: {
            username: true,
            email: true,
            totalPoints: true,
            avatarUrl: true
        }
    });
}

export async function savePrediction(matchId: string, scoreA: number, scoreB: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if match is already played or started
    const match = await db.match.findUnique({ where: { id: matchId } });
    if (!match) throw new Error("Match not found");
    if (match.isPlayed) throw new Error("Match already played"); // Or check date

    // Upsert prediction
    await db.prediction.upsert({
        where: {
            matchId_userId: {
                matchId,
                userId
            }
        },
        update: {
            predictedScoreA: scoreA,
            predictedScoreB: scoreB
        },
        create: {
            matchId,
            userId,
            predictedScoreA: scoreA,
            predictedScoreB: scoreB
        }
    });
}
