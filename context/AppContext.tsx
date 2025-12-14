'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Match, UserPrediction, League, Tournament, NotificationMessage, PredictionResult, Team } from '@/types';
import { useUser, useClerk } from '@clerk/nextjs';
import { syncUser } from '@/app/actions/user';
import { getMatches, getUserPredictions, getLeagues, getTournaments, savePrediction } from '@/app/actions/data';
import { getTeams, createTeam, updateTeam, deleteTeam } from '@/app/actions/teams';
import { deleteMatch as deleteMatchAction, deleteTournament as deleteTournamentAction, updateMatch as updateMatchAction } from '@/app/actions/admin';

type AppContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    allMatches: Match[];
    setAllMatches: React.Dispatch<React.SetStateAction<Match[]>>;
    userPredictions: UserPrediction[];
    setUserPredictions: React.Dispatch<React.SetStateAction<UserPrediction[]>>;
    leagues: League[];
    setLeagues: React.Dispatch<React.SetStateAction<League[]>>;
    tournaments: Tournament[];
    setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
    teams: Team[];
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
    notification: NotificationMessage | null;
    showNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
    clearNotification: () => void;
    calculatePointsAndStatus: (prediction: UserPrediction | undefined, match: Match) => PredictionResult;
    login: (userData: User) => void; // Deprecated but kept for compatibility if needed, though Clerk handles it
    logout: () => void;
    addOrUpdatePrediction: (predictionData: Omit<UserPrediction, 'userId'>) => void;
    createLeague: (leagueData: { name: string; type: 'Pública' | 'Privada'; description?: string }) => void;
    joinLeague: (leagueId: string) => { success: boolean; leagueName?: string; message?: string };
    addTournament: (tournamentData: Omit<Tournament, 'id'>) => void;
    updateTournament: (updatedTournamentData: Tournament) => void;
    deleteTournament: (tournamentId: string) => void;
    addTeam: (teamData: { name: string; type: 'Club' | 'Selección'; logoUrl?: string; country?: string }) => Promise<void>;
    editTeam: (teamId: string, teamData: { name?: string; type?: 'Club' | 'Selección'; logoUrl?: string; country?: string }) => Promise<void>;
    removeTeam: (teamId: string) => Promise<void>;
    updateUserProfile: (profileData: { username?: string; avatarUrl?: string; favoriteTeam?: string; }) => void;
    addMatch: (matchData: Omit<Match, 'id' | 'isPlayed' | 'actualScoreA' | 'actualScoreB'> & { leagueIds?: string[] }) => void;
    updateMatch: (updatedMatchData: Match) => void;
    deleteMatch: (matchId: string) => void;
    setMatchResult: (matchId: string, actualScoreA: number, actualScoreB: number) => void;
    isLoading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Legacy mock user for fallback or initial state if needed, but we prefer Clerk
const MOCK_USER_TEMPLATE: User = {
    email: 'testuser@example.com',
    username: 'TestUserProde',
    avatarUrl: 'https://via.placeholder.com/100?text=User',
    favoriteTeam: 'Equipo Estrella FC',
    isAdmin: false,
    totalPoints: 0,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const { signOut } = useClerk();

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
    const [leagues, setLeagues] = useState<League[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [allMatches, setAllMatches] = useState<Match[]>([]);
    const [notification, setNotification] = useState<NotificationMessage | null>(null);

    // Sync Clerk user with AppContext user and fetch data
    useEffect(() => {
        const sync = async () => {
            if (!isLoaded) return;

            if (isSignedIn && clerkUser) {
                try {
                    const dbUser = await syncUser();
                    if (dbUser) {
                        setUser({
                            email: dbUser.email,
                            username: dbUser.username || '',
                            avatarUrl: dbUser.avatarUrl || '',
                            favoriteTeam: dbUser.favoriteTeam || '',
                            isAdmin: dbUser.isAdmin,
                            totalPoints: dbUser.totalPoints
                        });

                        // Fetch initial data
                        const [matchesData, predictionsData, leaguesData, tournamentsData, teamsData] = await Promise.all([
                            getMatches(),
                            getUserPredictions(dbUser.id),
                            getLeagues(),
                            getTournaments(),
                            getTeams()
                        ]);

                        setAllMatches(matchesData.map(m => ({
                            id: m.id,
                            teamA: m.teamA,
                            teamB: m.teamB,
                            date: m.date.toISOString(),
                            tournamentId: m.tournamentId,
                            tournamentName: m.tournament?.name,
                            stage: m.stage,
                            group: m.group,
                            actualScoreA: m.actualScoreA ?? undefined,
                            actualScoreB: m.actualScoreB ?? undefined,
                            isPlayed: m.isPlayed
                        })));

                        setUserPredictions(predictionsData.map(p => ({
                            matchId: p.matchId,
                            teamA: p.match.teamA,
                            teamB: p.match.teamB,
                            predictedScoreA: p.predictedScoreA,
                            predictedScoreB: p.predictedScoreB,
                            userId: dbUser.username || dbUser.email // Using username/email as ID for frontend compatibility for now
                        })));

                        setLeagues(leaguesData.map(l => ({
                            id: l.id,
                            name: l.name,
                            description: l.description || undefined,
                            type: l.type as 'Pública' | 'Privada',
                            createdByUserId: l.createdByUserId,
                            participantUserIds: l.participants.map(p => p.username || p.email)
                        })));

                        setTournaments(tournamentsData.map(t => ({
                            id: t.id,
                            name: t.name,
                            year: t.year
                        })));

                        setTeams(teamsData.map(t => ({
                            id: t.id,
                            name: t.name,
                            type: t.type as 'Club' | 'Selección',
                            logoUrl: t.logoUrl || undefined,
                            country: t.country || undefined
                        })));
                    }
                } catch (error) {
                    console.error("Failed to sync user or fetch data", error);
                }
            } else {
                setUser(null);
                setAllMatches([]);
                setUserPredictions([]);
                setLeagues([]);
                setTournaments([]);
                setTeams([]);
            }
            setIsLoading(false);
        };
        sync();
    }, [isLoaded, isSignedIn, clerkUser]);

    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info', duration: number = 3000) => {
        const id = Date.now().toString();
        setNotification({ id, message, type });
        setTimeout(() => {
            setNotification(currentNotification =>
                currentNotification && currentNotification.id === id ? null : currentNotification
            );
        }, duration);
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const calculatePointsAndStatus = useCallback((
        prediction: UserPrediction | undefined,
        match: Match
    ): PredictionResult => {
        if (!match.isPlayed || typeof match.actualScoreA !== 'number' || typeof match.actualScoreB !== 'number') {
            return { points: 0, status: 'Pendiente', statusClass: 'text-gray-500' };
        }
        if (!prediction) {
            return { points: 0, status: 'No Predicho', statusClass: 'text-gray-400' };
        }

        const predA = prediction.predictedScoreA;
        const predB = prediction.predictedScoreB;
        const actualScoreA = match.actualScoreA;
        const actualScoreB = match.actualScoreB;

        if (predA === actualScoreA && predB === actualScoreB) {
            return { points: 3, status: 'Resultado Exacto', statusClass: 'text-green-600 font-bold' };
        }

        const actualWinner = actualScoreA > actualScoreB ? 'A' : actualScoreA < actualScoreB ? 'B' : 'Draw';
        const predictedWinner = predA > predB ? 'A' : predA < predB ? 'B' : 'Draw';

        if (actualWinner === predictedWinner) {
            if (actualWinner === 'Draw') {
                return { points: 1, status: 'Empate Correcto', statusClass: 'text-blue-600 font-semibold' };
            }
            return { points: 1, status: 'Ganador Correcto', statusClass: 'text-blue-600 font-semibold' };
        }
        return { points: 0, status: 'Fallado', statusClass: 'text-red-500' };
    }, []);

    useEffect(() => {
        const currentUserIdentifier = user?.username || user?.email;
        if (user && currentUserIdentifier) {
            let newTotalPoints = 0;
            const currentUserActivePredictions = userPredictions.filter(p => p.userId === currentUserIdentifier);

            currentUserActivePredictions.forEach(prediction => {
                const match = allMatches.find(m => m.id === prediction.matchId);
                if (match && match.isPlayed && typeof match.actualScoreA === 'number' && typeof match.actualScoreB === 'number') {
                    const result = calculatePointsAndStatus(prediction, match);
                    newTotalPoints += result.points;
                }
            });

            if (user.totalPoints !== newTotalPoints) {
                console.log(`Recalculating points for ${currentUserIdentifier}. Old: ${user.totalPoints}, New: ${newTotalPoints}`);
                setUser(prevUser => prevUser ? ({ ...prevUser, totalPoints: newTotalPoints }) : null);
            }
        }
    }, [user?.username, user?.email, userPredictions, allMatches, calculatePointsAndStatus, user?.totalPoints]);

    const login = (userData: User) => {
        // This is now handled by Clerk, but we keep the method signature to avoid breaking changes immediately
        console.warn("Login should be handled by Clerk");
    };

    const logout = () => {
        signOut();
        setUser(null);
        showNotification(`Has cerrado sesión.`, 'info');
    };

    const addOrUpdatePrediction = async (predictionData: Omit<UserPrediction, 'userId'>) => {
        if (!user) return;

        const userId = user.username || user.email;
        const newPrediction: UserPrediction = { ...predictionData, userId: userId! };

        // Optimistic update
        setUserPredictions(prevPredictions => {
            const existingPredictionIndex = prevPredictions.findIndex(
                p => p.matchId === newPrediction.matchId && p.userId === newPrediction.userId
            );

            if (existingPredictionIndex > -1) {
                const updatedPredictions = [...prevPredictions];
                updatedPredictions[existingPredictionIndex] = newPrediction;
                return updatedPredictions;
            } else {
                return [...prevPredictions, newPrediction];
            }
        });

        try {
            await savePrediction(predictionData.matchId, predictionData.predictedScoreA, predictionData.predictedScoreB);
            showNotification('Predicción guardada con éxito', 'success');
        } catch (error) {
            console.error("Failed to save prediction", error);
            showNotification('Error al guardar predicción', 'error');
            // Revert optimistic update if needed (omitted for brevity but recommended)
        }
    };

    const createLeague = (leagueData: { name: string; type: 'Pública' | 'Privada'; description?: string }) => {
        if (!user) return;
        const currentUserIdentifier = user.username || user.email;
        const newLeague: League = {
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            name: leagueData.name,
            type: leagueData.type,
            description: leagueData.description,
            createdByUserId: currentUserIdentifier!,
            participantUserIds: [currentUserIdentifier!],
        };
        setLeagues(prevLeagues => [...prevLeagues, newLeague]);
    };

    const joinLeague = (leagueId: string): { success: boolean; leagueName?: string; message?: string } => {
        if (!user) return { success: false, message: "Debes iniciar sesión para unirte a una liga." };

        const currentUserIdentifier = user.username || user.email;
        const leagueToJoin = leagues.find(l => l.id === leagueId);

        if (!leagueToJoin) {
            return { success: false, message: "Código de liga no encontrado o inválido." };
        }
        if (leagueToJoin.participantUserIds.includes(currentUserIdentifier!)) {
            return { success: false, message: `Ya eres miembro de la liga "${leagueToJoin.name}".` };
        }

        const updatedLeagues = leagues.map(l =>
            l.id === leagueId
                ? { ...l, participantUserIds: [...l.participantUserIds, currentUserIdentifier!] }
                : l
        );
        setLeagues(updatedLeagues);
        return { success: true, leagueName: leagueToJoin.name };
    };

    const addTournament = (tournamentData: Omit<Tournament, 'id'>) => {
        const newTournament: Tournament = {
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            ...tournamentData
        };
        setTournaments(prev => [...prev, newTournament]);
    };

    const updateTournament = (updatedTournamentData: Tournament) => {
        setTournaments(prev => prev.map(t => t.id === updatedTournamentData.id ? updatedTournamentData : t));
        showNotification(`Torneo "${updatedTournamentData.name}" actualizado con éxito.`, 'success');
    };

    const deleteTournament = async (tournamentId: string) => {
        const tournamentToDelete = tournaments.find(t => t.id === tournamentId);
        if (!tournamentToDelete) return;

        try {
            await deleteTournamentAction(tournamentId);
            setTournaments(prev => prev.filter(t => t.id !== tournamentId));
            setAllMatches(prevMatches => prevMatches.filter(m => m.tournamentId !== tournamentId));
            showNotification(`Torneo "${tournamentToDelete.name}" y sus partidos asociados han sido eliminados.`, 'success');
        } catch (error) {
            console.error("Failed to delete tournament", error);
            showNotification('Error al eliminar torneo', 'error');
        }
    };

    const addTeam = async (teamData: { name: string; type: 'Club' | 'Selección'; logoUrl?: string; country?: string }) => {
        try {
            const newTeam = await createTeam(teamData);
            setTeams(prev => [...prev, {
                id: newTeam.id,
                name: newTeam.name,
                type: newTeam.type as 'Club' | 'Selección',
                logoUrl: newTeam.logoUrl || undefined,
                country: newTeam.country || undefined
            }]);
            showNotification(`Equipo "${teamData.name}" creado con éxito.`, 'success');
        } catch (error) {
            console.error("Failed to create team", error);
            showNotification('Error al crear equipo', 'error');
        }
    };

    const editTeam = async (teamId: string, teamData: { name?: string; type?: 'Club' | 'Selección'; logoUrl?: string; country?: string }) => {
        try {
            const updatedTeam = await updateTeam(teamId, teamData);
            setTeams(prev => prev.map(t => t.id === teamId ? {
                id: updatedTeam.id,
                name: updatedTeam.name,
                type: updatedTeam.type as 'Club' | 'Selección',
                logoUrl: updatedTeam.logoUrl || undefined,
                country: updatedTeam.country || undefined
            } : t));
            showNotification(`Equipo "${updatedTeam.name}" actualizado con éxito.`, 'success');
        } catch (error) {
            console.error("Failed to update team", error);
            showNotification('Error al actualizar equipo', 'error');
        }
    };

    const removeTeam = async (teamId: string) => {
        try {
            await deleteTeam(teamId);
            setTeams(prev => prev.filter(t => t.id !== teamId));
            showNotification('Equipo eliminado con éxito.', 'success');
        } catch (error) {
            console.error("Failed to delete team", error);
            showNotification('Error al eliminar equipo', 'error');
        }
    };

    const updateUserProfile = (profileData: { username?: string; avatarUrl?: string; favoriteTeam?: string; }) => {
        if (user) {
            const updatedUser = { ...user, ...profileData };
            setUser(updatedUser);
            showNotification("Perfil actualizado con éxito.", "success");
        }
    };

    const addMatch = (matchData: Omit<Match, 'id' | 'isPlayed' | 'actualScoreA' | 'actualScoreB'> & { leagueIds?: string[] }) => {
        const newMatch: Match = {
            id: Date.now().toString() + Math.random().toString(36).substring(2) + '_match',
            teamA: matchData.teamA,
            teamB: matchData.teamB,
            date: matchData.date,
            tournamentId: matchData.tournamentId,
            tournamentName: matchData.tournamentName,
            stage: matchData.stage,
            group: matchData.group,
            leagueIds: matchData.leagueIds || [],
            isPlayed: false,
        };
        setAllMatches(prevMatches => [...prevMatches, newMatch]);
    };

    const updateMatch = async (updatedMatchData: Match) => {
        try {
            await updateMatchAction(updatedMatchData.id, {
                teamA: updatedMatchData.teamA,
                teamB: updatedMatchData.teamB,
                date: new Date(updatedMatchData.date),
                stage: updatedMatchData.stage || undefined,
                group: updatedMatchData.group || undefined
            });
            setAllMatches(prev => prev.map(m => m.id === updatedMatchData.id ? updatedMatchData : m));
            showNotification(`Partido actualizado con éxito.`, 'success');
        } catch (error) {
            console.error("Failed to update match", error);
            showNotification('Error al actualizar partido', 'error');
        }
    };

    const deleteMatch = async (matchId: string) => {
        const matchToDelete = allMatches.find(m => m.id === matchId);
        if (!matchToDelete) return;

        try {
            await deleteMatchAction(matchId);
            setAllMatches(prev => prev.filter(m => m.id !== matchId));
            // Also remove predictions associated with this match
            setUserPredictions(prevPreds => prevPreds.filter(p => p.matchId !== matchId));
            showNotification(`Partido "${matchToDelete.teamA} vs ${matchToDelete.teamB}" eliminado.`, 'success');
        } catch (error) {
            console.error("Failed to delete match", error);
            showNotification('Error al eliminar partido', 'error');
        }
    };

    const setMatchResult = (matchId: string, actualScoreA: number, actualScoreB: number) => {
        setAllMatches(prevMatches =>
            prevMatches.map(match =>
                match.id === matchId
                    ? { ...match, actualScoreA, actualScoreB, isPlayed: true }
                    : match
            )
        );
    };

    return (
        <AppContext.Provider value={{
            user, setUser,
            allMatches, setAllMatches,
            userPredictions, setUserPredictions,
            leagues, setLeagues,
            tournaments, setTournaments,
            teams, setTeams,
            notification, showNotification, clearNotification,
            calculatePointsAndStatus,
            login, logout,
            addOrUpdatePrediction,
            createLeague, joinLeague,
            addTournament, updateTournament, deleteTournament,
            addTeam, editTeam, removeTeam,
            updateUserProfile,
            addMatch, updateMatch, deleteMatch, setMatchResult,
            isLoading
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
