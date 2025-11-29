export type User = {
    email: string;
    username?: string;
    avatarUrl?: string;
    favoriteTeam?: string;
    isAdmin?: boolean;
    totalPoints?: number;
};

export type ScreenView = 'auth' | 'dashboard' | 'leagues' | 'matches' | 'ranking' | 'profile' | 'prediction' | 'pointsDetail' | 'createLeague' | 'joinLeague' | 'leagueDetail' | 'admin';

export type Match = {
    id: string;
    teamA: string;
    teamB: string;
    date: string;
    tournamentId?: string;
    tournamentName?: string;
    actualScoreA?: number;
    actualScoreB?: number;
    isPlayed?: boolean;
    leagueIds?: string[];
};

export type UserPrediction = {
    matchId: string;
    teamA: string;
    teamB: string;
    predictedScoreA: number;
    predictedScoreB: number;
    userId: string;
};

export type League = {
    id: string;
    name: string;
    description?: string;
    type: 'Pública' | 'Privada';
    createdByUserId: string;
    participantUserIds: string[];
};

export type Tournament = {
    id: string;
    name: string;
    year: number;
};

export type Team = {
    id: string;
    name: string;
    type: 'Club' | 'Selección';
    logoUrl?: string;
    country?: string;
};

export type NotificationMessage = {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
};

export type PredictionResult = {
    points: number;
    status: string;
    statusClass: string;
};
