'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Team } from '@/types';

export async function getTeams() {
    return await db.team.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function createTeam(teamData: { name: string; type: 'Club' | 'Selección'; logoUrl?: string; country?: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if user is admin (optional, but good practice)
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user?.isAdmin) throw new Error("Unauthorized: Admin access required");

    return await db.team.create({
        data: {
            name: teamData.name,
            type: teamData.type,
            logoUrl: teamData.logoUrl,
            country: teamData.country
        }
    });
}

export async function updateTeam(teamId: string, teamData: { name?: string; type?: 'Club' | 'Selección'; logoUrl?: string; country?: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user?.isAdmin) throw new Error("Unauthorized: Admin access required");

    return await db.team.update({
        where: { id: teamId },
        data: teamData
    });
}

export async function deleteTeam(teamId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user?.isAdmin) throw new Error("Unauthorized: Admin access required");

    return await db.team.delete({
        where: { id: teamId }
    });
}
