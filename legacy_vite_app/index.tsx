/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { FiLogIn, FiUserPlus, FiLogOut, FiList, FiShield, FiBarChart2, FiUser, FiSettings, FiEdit3, FiInfo, FiPlusCircle, FiLink, FiEye, FiArrowLeft, FiSave, FiXCircle, FiActivity, FiLock, FiArchive, FiClipboard, FiPlusSquare, FiCheckSquare, FiEdit, FiTrash2, FiX, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';


type User = {
    email: string;
    username?: string;
    avatarUrl?: string;
    favoriteTeam?: string;
    isAdmin?: boolean;
    totalPoints?: number;
};

type ScreenView = 'auth' | 'dashboard' | 'leagues' | 'matches' | 'ranking' | 'profile' | 'prediction' | 'pointsDetail' | 'createLeague' | 'joinLeague' | 'leagueDetail' | 'admin';

const MOCK_USER: User = {
    email: 'testuser@example.com',
    username: 'TestUserProde',
    avatarUrl: 'https://via.placeholder.com/100?text=User',
    favoriteTeam: 'Equipo Estrella FC',
    isAdmin: true,
    totalPoints: 0,
};

type Match = {
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

type UserPrediction = {
    matchId: string;
    teamA: string;
    teamB: string;
    predictedScoreA: number;
    predictedScoreB: number;
    userId: string;
};

type League = {
    id: string;
    name: string;
    description?: string;
    type: 'Pública' | 'Privada';
    createdByUserId: string;
    participantUserIds: string[];
};

type Tournament = {
    id: string;
    name: string;
    year: number;
};

type NotificationMessage = {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
};

type PredictionResult = {
    points: number;
    status: string;
    statusClass: string;
};


const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<ScreenView>('dashboard');
    const [user, setUser] = useState<User | null>(MOCK_USER);
    const [selectedMatchToPredict, setSelectedMatchToPredict] = useState<Match | null>(null);
    const [previousViewForPrediction, setPreviousViewForPrediction] = useState<ScreenView | null>(null);
    const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
    const [leagues, setLeagues] = useState<League[]>([]);
    const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
    const [previousViewForLeagueDetail, setPreviousViewForLeagueDetail] = useState<ScreenView | null>(null);
    const [notification, setNotification] = useState<NotificationMessage | null>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [allMatches, setAllMatches] = useState<Match[]>([]);

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
            return { points: 0, status: 'Pendiente', statusClass: 'status-pendiente' };
        }
        if (!prediction) {
            return { points: 0, status: 'No Predicho', statusClass: 'no-prediction-made' };
        }

        const predA = prediction.predictedScoreA;
        const predB = prediction.predictedScoreB;
        const actualScoreA = match.actualScoreA;
        const actualScoreB = match.actualScoreB;

        if (predA === actualScoreA && predB === actualScoreB) {
            return { points: 3, status: 'Resultado Exacto', statusClass: 'status-resultado-exacto' };
        }

        const actualWinner = actualScoreA > actualScoreB ? 'A' : actualScoreA < actualScoreB ? 'B' : 'Draw';
        const predictedWinner = predA > predB ? 'A' : predA < predB ? 'B' : 'Draw';

        if (actualWinner === predictedWinner) {
            if (actualWinner === 'Draw') {
                return { points: 1, status: 'Empate Correcto', statusClass: 'status-empate-correcto' };
            }
            return { points: 1, status: 'Ganador Correcto', statusClass: 'status-ganador-correcto' };
        }
        return { points: 0, status: 'Fallado', statusClass: 'status-fallado' };
    }, []);

    useEffect(() => {
        const currentUserIdentifier = user?.username || user?.email;
        if (user && currentUserIdentifier) { // Check if user and identifier exist
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


    useEffect(() => {
        console.log("User Predictions Updated in App:", userPredictions);
    }, [userPredictions]);

    useEffect(() => {
        console.log("Leagues Updated in App:", leagues);
    }, [leagues]);

    useEffect(() => {
        console.log("Tournaments Updated in App:", tournaments);
    }, [tournaments]);

    useEffect(() => {
        console.log("All Matches Updated in App:", allMatches);
    }, [allMatches]);


    const handleLoginSuccess = (userData: User) => {
        setUser({...userData, totalPoints: 0}); 
        setCurrentView('dashboard');
        showNotification(`Bienvenido/a ${userData.username || userData.email}!`, 'success');
    };

    const handleLogout = () => {
        const username = user?.username || user?.email;
        setUser(null);
        setCurrentView('auth');
        showNotification(`Has cerrado sesión. ¡Hasta pronto, ${username}!`, 'info');
    };

    const handleAddOrUpdatePrediction = (predictionData: Omit<UserPrediction, 'userId'>) => {
        if (!user) return;

        const userId = user.username || user.email;
        const newPrediction: UserPrediction = { ...predictionData, userId };

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
    };

    const handleCreateLeague = (leagueData: { name: string; type: 'Pública' | 'Privada'; description?: string }) => {
        if (!user) return;
        const currentUserIdentifier = user.username || user.email;
        const newLeague: League = {
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            name: leagueData.name,
            type: leagueData.type,
            description: leagueData.description,
            createdByUserId: currentUserIdentifier,
            participantUserIds: [currentUserIdentifier],
        };
        setLeagues(prevLeagues => [...prevLeagues, newLeague]);
    };

    const handleJoinLeague = (leagueId: string): { success: boolean; leagueName?: string; message?: string } => {
        if (!user) return { success: false, message: "Debes iniciar sesión para unirte a una liga." };

        const currentUserIdentifier = user.username || user.email;
        const leagueToJoin = leagues.find(l => l.id === leagueId);

        if (!leagueToJoin) {
            return { success: false, message: "Código de liga no encontrado o inválido." };
        }
        if (leagueToJoin.participantUserIds.includes(currentUserIdentifier)) {
            return { success: false, message: `Ya eres miembro de la liga "${leagueToJoin.name}".` };
        }

        const updatedLeagues = leagues.map(l =>
            l.id === leagueId
                ? { ...l, participantUserIds: [...l.participantUserIds, currentUserIdentifier] }
                : l
        );
        setLeagues(updatedLeagues);
        return { success: true, leagueName: leagueToJoin.name };
    };

    const handleAddTournament = (tournamentData: Omit<Tournament, 'id'>) => {
        const newTournament: Tournament = {
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            ...tournamentData
        };
        setTournaments(prev => [...prev, newTournament]);
    };
    
    const handleUpdateTournament = (updatedTournamentData: Tournament) => {
        setTournaments(prev => prev.map(t => t.id === updatedTournamentData.id ? updatedTournamentData : t));
        showNotification(`Torneo "${updatedTournamentData.name}" actualizado con éxito.`, 'success');
    };

    const handleDeleteTournament = (tournamentId: string) => {
        const tournamentToDelete = tournaments.find(t => t.id === tournamentId);
        if (!tournamentToDelete) return;

        setTournaments(prev => prev.filter(t => t.id !== tournamentId));
        setAllMatches(prevMatches => prevMatches.filter(m => m.tournamentId !== tournamentId));
        showNotification(`Torneo "${tournamentToDelete.name}" y sus partidos asociados han sido eliminados.`, 'success');
    };

    const handleUpdateUserProfile = (profileData: { username?: string; avatarUrl?: string; favoriteTeam?: string; }) => {
        if (user) {
            const updatedUser = { ...user, ...profileData };
            setUser(updatedUser);
            // Simulate persistence for MOCK_USER
            if (user.email === MOCK_USER.email) {
                MOCK_USER.username = updatedUser.username;
                MOCK_USER.avatarUrl = updatedUser.avatarUrl;
                MOCK_USER.favoriteTeam = updatedUser.favoriteTeam;
            }
            showNotification("Perfil actualizado con éxito.", "success");
        }
    };


    const handleAddMatch = (matchData: Omit<Match, 'id' | 'isPlayed' | 'actualScoreA' | 'actualScoreB'> & { leagueIds?: string[] }) => {
        const newMatch: Match = {
            id: Date.now().toString() + Math.random().toString(36).substring(2) + '_match',
            teamA: matchData.teamA,
            teamB: matchData.teamB,
            date: matchData.date,
            tournamentId: matchData.tournamentId,
            tournamentName: matchData.tournamentName,
            leagueIds: matchData.leagueIds || [],
            isPlayed: false,
        };
        setAllMatches(prevMatches => [...prevMatches, newMatch]);
    };
    
    const handleUpdateMatch = (updatedMatchData: Match) => {
        setAllMatches(prev => prev.map(m => m.id === updatedMatchData.id ? updatedMatchData : m));
        showNotification(`Partido "${updatedMatchData.teamA} vs ${updatedMatchData.teamB}" actualizado con éxito.`, 'success');
    };

    const handleDeleteMatch = (matchId: string) => {
        const matchToDelete = allMatches.find(m => m.id === matchId);
        if(!matchToDelete) return;

        setAllMatches(prev => prev.filter(m => m.id !== matchId));
        // Also remove predictions associated with this match
        setUserPredictions(prevPreds => prevPreds.filter(p => p.matchId !== matchId));
        showNotification(`Partido "${matchToDelete.teamA} vs ${matchToDelete.teamB}" eliminado.`, 'success');
    };


    const handleSetMatchResult = (matchId: string, actualScoreA: number, actualScoreB: number) => {
        setAllMatches(prevMatches =>
            prevMatches.map(match =>
                match.id === matchId
                    ? { ...match, actualScoreA, actualScoreB, isPlayed: true }
                    : match
            )
        );
    };

    const navigateTo = (view: ScreenView, payload?: any) => {
        if (view === 'prediction' && payload?.match && payload?.from) {
            setSelectedMatchToPredict(payload.match);
            setPreviousViewForPrediction(payload.from);
        } else if (view === 'leagueDetail' && payload?.league && payload?.from) {
            setSelectedLeague(payload.league);
            setPreviousViewForLeagueDetail(payload.from);
        }
        setCurrentView(view);
    };

    return (
        <>
            {notification && <NotificationDisplay notification={notification} onClose={clearNotification} />}
            {(() => {
                switch (currentView) {
                    case 'auth':
                        return <AuthScreen onLoginSuccess={handleLoginSuccess} showNotification={showNotification} />;
                    case 'dashboard':
                        return <DashboardScreen
                                    user={user}
                                    onLogout={handleLogout}
                                    navigateTo={navigateTo}
                                    userPredictions={userPredictions}
                                    allMatches={allMatches}
                                    calculatePointsAndStatus={calculatePointsAndStatus}
                                />;
                    case 'leagues':
                        return <LeaguesScreen user={user} navigateTo={navigateTo} leagues={leagues} />;
                    case 'matches':
                        return <MatchesScreen
                                    user={user}
                                    navigateTo={navigateTo}
                                    userPredictions={userPredictions}
                                    allMatches={allMatches}
                                    calculatePointsAndStatus={calculatePointsAndStatus}
                                />;
                    case 'ranking':
                        return <RankingScreen user={user} navigateTo={navigateTo} />;
                    case 'profile':
                        return <ProfileScreen
                                    user={user}
                                    navigateTo={navigateTo}
                                    onUpdateProfile={handleUpdateUserProfile}
                                    showNotification={showNotification}
                                    userPredictions={userPredictions}
                                    allMatches={allMatches}
                                    calculatePointsAndStatus={calculatePointsAndStatus}
                                />;
                    case 'prediction':
                        return <PredictionScreen
                                    user={user}
                                    navigateTo={navigateTo}
                                    matchToPredict={selectedMatchToPredict}
                                    previousView={previousViewForPrediction || 'dashboard'}
                                    onSavePrediction={handleAddOrUpdatePrediction}
                                    showNotification={showNotification}
                                />;
                    case 'pointsDetail':
                         return <PointsDetailScreen
                                    user={user}
                                    navigateTo={navigateTo}
                                    userTotalPoints={user?.totalPoints ?? 0}
                                    userPredictions={userPredictions}
                                    allMatches={allMatches}
                                    calculatePointsAndStatus={calculatePointsAndStatus}
                                />;
                    case 'createLeague':
                        return <CreateLeagueScreen user={user} navigateTo={navigateTo} onCreateLeague={handleCreateLeague} showNotification={showNotification} />;
                    case 'joinLeague':
                        return <JoinLeagueScreen user={user} navigateTo={navigateTo} onAttemptJoinLeague={handleJoinLeague} showNotification={showNotification} />;
                    case 'leagueDetail':
                         return <LeagueDetailScreen
                                    user={user}
                                    navigateTo={navigateTo}
                                    league={selectedLeague}
                                    previousView={previousViewForLeagueDetail || 'leagues'}
                                    allMatches={allMatches}
                                    userPredictions={userPredictions}
                                    calculatePointsAndStatus={calculatePointsAndStatus}
                                />;
                     case 'admin':
                        return <AdminPanelScreen
                                    user={user}
                                    navigateTo={navigateTo}
                                    tournaments={tournaments}
                                    leagues={leagues}
                                    onAddTournament={handleAddTournament}
                                    onUpdateTournament={handleUpdateTournament}
                                    onDeleteTournament={handleDeleteTournament}
                                    allMatches={allMatches}
                                    onAddMatch={handleAddMatch}
                                    onUpdateMatch={handleUpdateMatch}
                                    onDeleteMatch={handleDeleteMatch}
                                    onSetMatchResult={handleSetMatchResult}
                                    showNotification={showNotification}
                                />;
                    default:
                        return <DashboardScreen
                                    user={user}
                                    onLogout={handleLogout}
                                    navigateTo={navigateTo}
                                    userPredictions={userPredictions}
                                    allMatches={allMatches}
                                    calculatePointsAndStatus={calculatePointsAndStatus}
                                />;
                }
            })()}
        </>
    );
};

// --- Notification Component ---
interface NotificationDisplayProps {
    notification: NotificationMessage | null;
    onClose: () => void;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ notification, onClose }) => {
    if (!notification) return null;

    return (
        <div className={`notification-container`} role="alert">
             <div className={`notification ${notification.type} fade-in-out`}>
                <p className="notification-message">{notification.message}</p>
                <button onClick={onClose} className="notification-close-button" aria-label="Cerrar notificación">
                    <FiX size={20}/>
                </button>
            </div>
        </div>
    );
};

// --- Confirmation Modal ---
interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonVariant?: 'danger' | 'primary';
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen, title, message, onConfirm, onCancel,
    confirmButtonText = "Confirmar", cancelButtonText = "Cancelar", confirmButtonVariant = 'primary'
}) => {
    if (!isOpen) return null;

    let confirmIcon = <FiCheckCircle />;
    if (confirmButtonVariant === 'danger') {
        confirmIcon = <FiAlertTriangle />;
    }

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
            <div className="modal-content-confirm">
                <header className="modal-header-confirm">
                    <h2 id="confirm-modal-title">{title}</h2>
                    <button onClick={onCancel} className="modal-close-button button-with-icon" aria-label="Cerrar modal">
                        <FiX size={24} />
                    </button>
                </header>
                <div className="modal-body-confirm">
                    <p>{message}</p>
                </div>
                <footer className="modal-footer-confirm">
                    <button onClick={onCancel} className="action-button cancel-button button-with-icon">
                        <FiXCircle /> {cancelButtonText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`action-button modal-confirm-button ${confirmButtonVariant} button-with-icon`}
                    >
                        {confirmIcon} {confirmButtonText}
                    </button>
                </footer>
            </div>
        </div>
    );
};


interface AuthScreenProps {
    onLoginSuccess: (user: User) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, showNotification }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleFormSwitch = (isLogin: boolean) => {
        setIsLoginView(isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
    };

    const validateEmail = (emailToValidate: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailToValidate);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        const baseUser: Omit<User, 'username' | 'avatarUrl' | 'favoriteTeam'> = { // Explicitly Omit optional fields for clarity
            email,
            isAdmin: email === MOCK_USER.email, 
            totalPoints: 0 
        };
        
        let finalUser: User;

        if (isLoginView) {
            console.log('Login attempt:', { email, password });
            const loggedInUsername = email === MOCK_USER.email ? MOCK_USER.username : (username.trim() || email.split('@')[0]);
            finalUser = { 
                ...baseUser, 
                username: loggedInUsername,
                avatarUrl: email === MOCK_USER.email ? MOCK_USER.avatarUrl : undefined,
                favoriteTeam: email === MOCK_USER.email ? MOCK_USER.favoriteTeam : undefined,
            };
            onLoginSuccess(finalUser);
        } else {
            if (!username.trim()) {
                setError('Por favor, introduce un nombre de usuario.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }
            console.log('Register attempt:', { username, email, password });
            finalUser = { ...baseUser, username: username.trim() };
            onLoginSuccess(finalUser);
        }
    };

    return (
        <div className="auth-container" role="main" aria-labelledby="auth-title">
            <header>
              <h1 id="auth-title">Gordos Fulbo</h1>
              <p>{isLoginView ? 'Inicia sesión para continuar' : 'Crea una cuenta para empezar'}</p>
            </header>

            <div className="auth-tabs" role="tablist">
                <button
                    role="tab"
                    aria-selected={isLoginView}
                    aria-controls="auth-form"
                    onClick={() => handleFormSwitch(true)}
                    className={isLoginView ? 'active' : ''}
                    id="login-tab"
                >
                    Iniciar Sesión
                </button>
                <button
                    role="tab"
                    aria-selected={!isLoginView}
                    aria-controls="auth-form"
                    onClick={() => handleFormSwitch(false)}
                    className={!isLoginView ? 'active' : ''}
                    id="register-tab"
                >
                    Registrarse
                </button>
            </div>

            <form onSubmit={handleSubmit} id="auth-form" aria-labelledby={isLoginView ? "login-tab" : "register-tab"}>
                {!isLoginView && (
                    <div className="form-group">
                        <label htmlFor="username-auth">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username-auth"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            aria-required="true"
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email-auth">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email-auth"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-required="true"
                        aria-describedby={error && error.includes('correo') ? "error-message-content-auth" : undefined}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password-auth">Contraseña</label>
                    <input
                        type="password"
                        id="password-auth"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-required="true"
                        aria-describedby={error && error.includes('contraseña') ? "error-message-content-auth" : undefined}
                    />
                </div>
                {!isLoginView && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword-auth">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword-auth"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            aria-required="true"
                            aria-describedby={error && error.includes('contraseñas no coinciden') ? "error-message-content-auth" : undefined}
                        />
                    </div>
                )}
                {error && <p id="error-message-content-auth" className="error-message" role="alert">{error}</p>}
                <button type="submit" className="submit-button button-with-icon">
                    {isLoginView ? <FiLogIn /> : <FiUserPlus />}
                    {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>
            </form>
        </div>
    );
};

interface DashboardScreenProps {
    user: User | null;
    onLogout: () => void;
    navigateTo: (view: ScreenView, payload?: any) => void;
    userPredictions: UserPrediction[];
    allMatches: Match[];
    calculatePointsAndStatus: (prediction: UserPrediction | undefined, match: Match) => PredictionResult;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onLogout, navigateTo, userPredictions, allMatches, calculatePointsAndStatus }) => {
     const upcomingMatchesForDashboard: Match[] = allMatches
        .filter(match => !match.isPlayed)
        .slice(0, 2); 

    const currentUserPredictions = user
        ? userPredictions.filter(p => p.userId === (user.username || user.email))
        : [];

    return (
        <div className="dashboard-container" role="main" aria-labelledby="dashboard-title">
            <header className="dashboard-header">
                <h1 id="dashboard-title">Gordos Fulbo Dashboard</h1>
                <div className="user-info">
                    <span>Bienvenido/a, {user?.username || user?.email}</span>
                    <button onClick={onLogout} className="logout-button button-with-icon" aria-label="Cerrar sesión">
                        <FiLogOut /> Cerrar Sesión
                    </button>
                </div>
            </header>

            <nav className="dashboard-nav" aria-label="Navegación principal">
                <button className="nav-button button-with-icon" onClick={() => navigateTo('matches')}><FiList /> Partidos</button>
                <button className="nav-button button-with-icon" onClick={() => navigateTo('leagues')}><FiShield /> Ligas</button>
                <button className="nav-button button-with-icon" onClick={() => navigateTo('ranking')}><FiBarChart2 /> Ranking</button>
                <button className="nav-button button-with-icon" onClick={() => navigateTo('profile')}><FiUser /> Mi Perfil</button>
                {user?.isAdmin && (
                     <button className="nav-button admin-nav-button button-with-icon" onClick={() => navigateTo('admin')}><FiSettings /> Panel de Admin</button>
                )}
            </nav>

            <section className="dashboard-section" aria-labelledby="predictions-summary-title">
                <h2 id="predictions-summary-title">Resumen de Predicciones</h2>
                <div className="card-list">
                    {currentUserPredictions.length > 0 ? currentUserPredictions.slice(0,3).map((pred) => { 
                        const match = allMatches.find(m => m.id === pred.matchId);
                        let result: PredictionResult = { points: 0, status: 'Pendiente', statusClass: 'status-pendiente' };
                        if (match) {
                           result = calculatePointsAndStatus(pred, match);
                        }

                        return (
                            <div key={`${pred.matchId}-${pred.userId}`} className="card prediction-card">
                                <div className="prediction-card-header">
                                     <span className="team-name-display">{pred.teamA}</span>
                                     <span className="vs-separator">vs</span>
                                     <span className="team-name-display">{pred.teamB}</span>
                                </div>
                                <div className="prediction-card-body">
                                    <p className="your-prediction-label">Tu Predicción:</p>
                                    <p className="predicted-score-display">
                                        {pred.predictedScoreA} - {pred.predictedScoreB}
                                    </p>
                                </div>
                                <div className="prediction-card-footer">
                                    <p className="status-label">Estado: <span className={result.statusClass}>{result.status}</span></p>
                                    {match && match.isPlayed && typeof match.actualScoreA === 'number' && (
                                        <p className="prediction-card-points">
                                            Puntos: <span className={result.points > 0 ? 'positive' : result.points < 0 ? 'negative' : 'neutral'}>
                                                {result.points > 0 ? `+${result.points}` : result.points}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    }) : <p className="no-predictions-message">No has realizado ninguna predicción todavía.</p>}
                </div>
            </section>

            <section className="dashboard-section" aria-labelledby="upcoming-matches-title">
                <h2 id="upcoming-matches-title">Próximos Partidos por Jugar</h2>
                <div className="card-list">
                {upcomingMatchesForDashboard.length > 0 ? upcomingMatchesForDashboard.map(match => (
                    <div key={match.id} className="card match-card">
                        <p><strong>{match.teamA} vs {match.teamB}</strong> ({match.tournamentName || 'General'})</p>
                        <p>Fecha: {new Date(match.date).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        <button
                            className="predict-button button-with-icon"
                            onClick={() => navigateTo('prediction', { match, from: 'dashboard' })}
                        >
                            <FiEdit3 /> Predecir
                        </button>
                    </div>
                )) : <p className="no-items-message">No hay partidos próximos para mostrar aquí. Ve a la sección de Partidos para ver todos.</p>}
                </div>
            </section>

            <section className="dashboard-section" aria-labelledby="current-points-title">
                 <h2 id="current-points-title">Mis Puntos Actuales</h2>
                <div className="card points-card">
                    <p className="points-value">{user?.totalPoints ?? 0} Puntos</p>
                    <button onClick={() => navigateTo('pointsDetail')} className="details-button button-with-icon">
                        <FiInfo /> Ver Detalle
                    </button>
                </div>
            </section>

            <footer className="dashboard-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

interface LeaguesScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView, payload?: any) => void;
    leagues: League[];
}

const LeaguesScreen: React.FC<LeaguesScreenProps> = ({ user, navigateTo, leagues }) => {

    return (
        <div className="leagues-container" role="main" aria-labelledby="leagues-title">
            <header className="leagues-header">
                <h1 id="leagues-title">Mis Ligas</h1>
                <button onClick={() => navigateTo('dashboard')} className="back-button button-with-icon" aria-label="Volver al dashboard">
                    <FiArrowLeft /> Volver al Dashboard
                </button>
            </header>

            <div className="leagues-actions">
                <button className="action-button create-league-button button-with-icon" onClick={() => navigateTo('createLeague')}>
                    <FiPlusCircle /> Crear Nueva Liga
                </button>
                <button className="action-button join-league-button button-with-icon" onClick={() => navigateTo('joinLeague')}>
                    <FiLink /> Unirse a una Liga
                </button>
            </div>

            <section className="leagues-list-section" aria-labelledby="leagues-list-title-heading">
                <h2 id="leagues-list-title-heading" className="sr-only">Listado de Ligas</h2>
                {leagues.length > 0 ? (
                    <ul className="leagues-list">
                        {leagues.map(league => (
                            <li key={league.id} className="league-item card">
                                <div className="league-info">
                                    <h3>{league.name}</h3>
                                    <p>Participantes: {league.participantUserIds.length}</p>
                                    <p>Tu Ranking: N/A</p>
                                    <p>Tipo: <span className={`league-type ${league.type.toLowerCase()}`}>{league.type}</span></p>
                                    {league.description && <p><i>{league.description}</i></p>}
                                </div>
                                <div className="league-item-actions">
                                    <button
                                        className="details-button button-with-icon"
                                        onClick={() => navigateTo('leagueDetail', { league, from: 'leagues' })}
                                    >
                                        <FiEye /> Ver Liga
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-items-message">No estás participando en ninguna liga actualmente. ¡Crea una o únete a alguna!</p>
                )}
            </section>

            <footer className="leagues-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

interface CreateLeagueScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView) => void;
    onCreateLeague: (leagueData: { name: string; type: 'Pública' | 'Privada'; description?: string }) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
}

const CreateLeagueScreen: React.FC<CreateLeagueScreenProps> = ({ user, navigateTo, onCreateLeague, showNotification }) => {
    const [leagueName, setLeagueName] = useState('');
    const [leagueType, setLeagueType] = useState<'Pública' | 'Privada'>('Privada');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (!leagueName.trim()) {
            setError('El nombre de la liga es obligatorio.');
            return;
        }

        onCreateLeague({ name: leagueName, type: leagueType, description });
        showNotification(`Liga "${leagueName}" creada con éxito.`, 'success');
        navigateTo('leagues');
    };

    return (
        <div className="create-league-container" role="main" aria-labelledby="create-league-title">
            <header className="create-league-header">
                <h1 id="create-league-title">Crear Nueva Liga</h1>
                <button onClick={() => navigateTo('leagues')} className="back-button button-with-icon" aria-label="Volver a Mis Ligas">
                    <FiArrowLeft /> Volver a Mis Ligas
                </button>
            </header>

            <form onSubmit={handleSubmit} className="create-league-form card">
                <div className="form-group">
                    <label htmlFor="league-name">Nombre de la Liga</label>
                    <input
                        type="text"
                        id="league-name"
                        value={leagueName}
                        onChange={(e) => setLeagueName(e.target.value)}
                        required
                        aria-required="true"
                        aria-describedby={error && error.includes('nombre') ? "error-message-content-create-league" : undefined}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="league-type">Tipo de Liga</label>
                    <select
                        id="league-type"
                        value={leagueType}
                        onChange={(e) => setLeagueType(e.target.value as 'Pública' | 'Privada')}
                        required
                        aria-required="true"
                    >
                        <option value="Privada">Privada</option>
                        <option value="Pública">Pública</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="league-description">Descripción (Opcional)</label>
                    <textarea
                        id="league-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>
                {error && <p id="error-message-content-create-league" className="error-message" role="alert">{error}</p>}
                <div className="create-league-actions">
                    <button type="submit" className="action-button button-with-icon"><FiCheckCircle /> Crear Liga</button>
                    <button type="button" onClick={() => navigateTo('leagues')} className="action-button cancel-button button-with-icon">
                        <FiXCircle /> Cancelar
                    </button>
                </div>
            </form>
             <footer className="create-league-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

interface JoinLeagueScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView) => void;
    onAttemptJoinLeague: (leagueId: string) => { success: boolean; leagueName?: string; message?: string };
    showNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
}

const JoinLeagueScreen: React.FC<JoinLeagueScreenProps> = ({ user, navigateTo, onAttemptJoinLeague, showNotification }) => {
    const [leagueCode, setLeagueCode] = useState('');
    const [error, setError] = useState(''); 

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (!leagueCode.trim()) {
            setError('El código de la liga es obligatorio.'); 
            return;
        }
        const result = onAttemptJoinLeague(leagueCode);
        if (result.success) {
            showNotification(`¡Te has unido a la liga "${result.leagueName}" con éxito!`, 'success');
            navigateTo('leagues');
        } else {
            showNotification(result.message || 'Error al unirse a la liga.', 'error');
        }
    };

    return (
        <div className="join-league-container" role="main" aria-labelledby="join-league-title">
            <header className="join-league-header">
                <h1 id="join-league-title">Unirse a una Liga</h1>
                <button onClick={() => navigateTo('leagues')} className="back-button button-with-icon" aria-label="Volver a Mis Ligas">
                    <FiArrowLeft /> Volver a Mis Ligas
                </button>
            </header>

            <form onSubmit={handleSubmit} className="join-league-form card">
                <p>Ingresa el código de la liga a la que quieres unirte.</p>
                <div className="form-group">
                    <label htmlFor="league-code">Código de la Liga</label>
                    <input
                        type="text"
                        id="league-code"
                        value={leagueCode}
                        onChange={(e) => setLeagueCode(e.target.value)}
                        placeholder="Ej: A8X3FG"
                        required
                        aria-required="true"
                        aria-describedby={error ? "error-message-content-join-league" : undefined}
                    />
                </div>
                {error && <p id="error-message-content-join-league" className="error-message" role="alert">{error}</p>}
                <div className="join-league-actions">
                    <button type="submit" className="action-button button-with-icon"><FiCheckCircle /> Buscar y Unirse</button>
                     <button type="button" onClick={() => navigateTo('leagues')} className="action-button cancel-button button-with-icon">
                        <FiXCircle /> Cancelar
                    </button>
                </div>
            </form>
            <footer className="join-league-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

interface LeagueDetailScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView, payload?: any) => void;
    league: League | null;
    previousView: ScreenView;
    allMatches: Match[];
    userPredictions: UserPrediction[];
    calculatePointsAndStatus: (prediction: UserPrediction | undefined, match: Match) => PredictionResult;
}

const LeagueDetailScreen: React.FC<LeagueDetailScreenProps> = ({
    user, navigateTo, league, previousView,
    allMatches, userPredictions, calculatePointsAndStatus
}) => {
    if (!league) {
        return (
            <div className="league-detail-container">
                <header className="league-detail-header">
                    <h1>Error</h1>
                    <button onClick={() => navigateTo(previousView || 'leagues')} className="back-button button-with-icon">
                        <FiArrowLeft /> Volver
                    </button>
                </header>
                <p className="error-message card">No se ha seleccionado ninguna liga para ver detalles. Por favor, vuelve a la lista de ligas e inténtalo de nuevo.</p>
                <footer className="league-detail-footer">
                    <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
                </footer>
            </div>
        );
    }

    const currentUserAppIdentifier = user?.username || user?.email;

    const rankedLeagueParticipants = league.participantUserIds.map(participantId => {
        let leagueSpecificPoints = 0;
        const leagueMatches = allMatches.filter(m => m.leagueIds?.includes(league.id) && m.isPlayed && typeof m.actualScoreA === 'number');
        const participantPredictions = userPredictions.filter(p => p.userId === participantId);

        leagueMatches.forEach(lMatch => {
            const predictionForThisMatch = participantPredictions.find(p => p.matchId === lMatch.id);
            if (predictionForThisMatch) {
                const result = calculatePointsAndStatus(predictionForThisMatch, lMatch);
                leagueSpecificPoints += result.points;
            }
        });
        return {
            participantId,
            displayName: participantId, // Could be enhanced if we had a user list
            leaguePoints: leagueSpecificPoints,
        };
    }).sort((a, b) => b.leaguePoints - a.leaguePoints)
      .map((p, index) => ({ ...p, rank: index + 1 }));


    return (
        <div className="league-detail-container" role="main" aria-labelledby="league-detail-main-title">
            <header className="league-detail-header">
                <h1 id="league-detail-main-title">{league.name}</h1>
                <button onClick={() => navigateTo(previousView || 'leagues')} className="back-button button-with-icon" aria-label="Volver a Mis Ligas">
                    <FiArrowLeft /> Volver
                </button>
            </header>

            <section className="league-detail-info-card card" aria-labelledby="league-info-heading">
                <h2 id="league-info-heading" className="sr-only">Información de la Liga</h2>
                <p><strong>Tipo:</strong> <span className={`league-type ${league.type.toLowerCase()}`}>{league.type}</span></p>
                {league.description && <p><strong>Descripción:</strong> {league.description}</p>}
                <p><strong>Creada por:</strong> {league.createdByUserId}</p>
                <p><strong>Participantes:</strong> {league.participantUserIds.length}</p>
                <p><strong>ID de Liga (Código):</strong> {league.id}</p>
            </section>

            <section className="league-participants-section card" aria-labelledby="league-participants-heading">
                <h2 id="league-participants-heading">Ranking de Participantes en Liga</h2>
                {rankedLeagueParticipants.length > 0 ? (
                     <div className="table-responsive">
                        <table className="league-participants-table ranking-table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Usuario (ID)</th>
                                    <th scope="col">Puntos en Liga</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankedLeagueParticipants.map(p => (
                                    <tr key={p.participantId} className={p.participantId === currentUserAppIdentifier ? 'current-user-row' : ''}>
                                        <td>{p.rank}</td>
                                        <td>{p.displayName} {p.participantId === currentUserAppIdentifier ? '(Tú)' : ''}</td>
                                        <td>{p.leaguePoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-items-message">No hay participantes o datos de puntos para mostrar en esta liga.</p>
                )}
            </section>

             <footer className="league-detail-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};


interface MatchesScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView, payload?: any) => void;
    userPredictions: UserPrediction[];
    allMatches: Match[];
    calculatePointsAndStatus: (prediction: UserPrediction | undefined, match: Match) => PredictionResult;
}

type MatchTab = 'upcoming' | 'played';


const MatchesScreen: React.FC<MatchesScreenProps> = ({ user, navigateTo, userPredictions, allMatches, calculatePointsAndStatus }) => {
    const [activeTab, setActiveTab] = useState<MatchTab>('upcoming');

    const upcomingMatchesData = allMatches.filter(match => !match.isPlayed);
    const playedMatchesData = allMatches.filter(match => match.isPlayed && typeof match.actualScoreA === 'number' && typeof match.actualScoreB === 'number');

    return (
        <div className="matches-container" role="main" aria-labelledby="matches-title">
            <header className="matches-header">
                <h1 id="matches-title">Partidos y Resultados</h1>
                <button onClick={() => navigateTo('dashboard')} className="back-button button-with-icon" aria-label="Volver al dashboard">
                    <FiArrowLeft /> Volver al Dashboard
                </button>
            </header>

            <div className="matches-tabs" role="tablist" aria-label="Tipos de partidos">
                <button
                    id="upcoming-matches-tab"
                    role="tab"
                    aria-controls="upcoming-matches-panel"
                    aria-selected={activeTab === 'upcoming'}
                    onClick={() => setActiveTab('upcoming')}
                    className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                >
                    Próximos Partidos
                </button>
                <button
                    id="played-matches-tab"
                    role="tab"
                    aria-controls="played-matches-panel"
                    aria-selected={activeTab === 'played'}
                    onClick={() => setActiveTab('played')}
                    className={`tab-button ${activeTab === 'played' ? 'active' : ''}`}
                >
                    Partidos Jugados
                </button>
            </div>

            {activeTab === 'upcoming' && (
                <section id="upcoming-matches-panel" role="tabpanel" aria-labelledby="upcoming-matches-tab" className="match-list-section">
                    <h2 className="sr-only">Próximos Partidos</h2>
                    {upcomingMatchesData.length > 0 ? (
                        <ul className="match-list">
                            {upcomingMatchesData.map(match => (
                                <li key={match.id} className="match-item card">
                                    <div className="match-item-header">
                                        <span className="match-tournament">{match.tournamentName || 'General'}</span>
                                        <span className="match-date">{new Date(match.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })} hs</span>
                                    </div>
                                    <div className="match-item-teams">
                                        <span className="team-name">{match.teamA}</span>
                                        <span className="vs">vs</span>
                                        <span className="team-name">{match.teamB}</span>
                                    </div>
                                    <button
                                        className="predict-button main-action button-with-icon"
                                        onClick={() => navigateTo('prediction', { match, from: 'matches' })}
                                    >
                                        <FiEdit3 /> Realizar Predicción
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-items-message">No hay próximos partidos programados.</p>
                    )}
                </section>
            )}

            {activeTab === 'played' && (
                <section id="played-matches-panel" role="tabpanel" aria-labelledby="played-matches-tab" className="match-list-section">
                    <h2 className="sr-only">Partidos Jugados</h2>
                    {playedMatchesData.length > 0 ? (
                        <ul className="match-list">
                            {playedMatchesData.map(match => {
                                const userIdentifier = user?.username || user?.email;
                                const prediction = userPredictions.find(p => p.matchId === match.id && p.userId === userIdentifier);
                                const { points, status, statusClass } = calculatePointsAndStatus(prediction, match);

                                return (
                                    <li key={match.id} className="match-item card played">
                                        <div className="match-item-header">
                                             <span className="match-tournament">{match.tournamentName || 'General'}</span>
                                            <span className="match-date">{new Date(match.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
                                        </div>
                                        <div className="match-item-teams score">
                                            <span className="team-name">{match.teamA}</span>
                                            <span className="match-score">{match.actualScoreA} - {match.actualScoreB}</span>
                                            <span className="team-name">{match.teamB}</span>
                                        </div>
                                        <div className="prediction-details">
                                            {prediction ? (
                                                <>
                                                    <p><strong>Tu Predicción:</strong> {prediction.predictedScoreA} - {prediction.predictedScoreB}</p>
                                                    <p><strong>Resultado:</strong> <span className={statusClass}>{status}</span></p>
                                                    <p><strong>Puntos Obtenidos:</strong> <span className="points-awarded">{points > 0 ? `+${points}` : points}</span></p>
                                                </>
                                            ) : (
                                                <p className="no-prediction-made">No realizaste predicción para este partido.</p>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="no-items-message">No hay partidos jugados para mostrar.</p>
                    )}
                </section>
            )}
             <footer className="matches-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

interface PredictionScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView, payload?: any) => void;
    matchToPredict: Match | null;
    previousView: ScreenView;
    onSavePrediction: (predictionData: Omit<UserPrediction, 'userId'>) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
}

const PredictionScreen: React.FC<PredictionScreenProps> = ({ user, navigateTo, matchToPredict, previousView, onSavePrediction, showNotification }) => {
    const [scoreA, setScoreA] = useState<string>('');
    const [scoreB, setScoreB] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setScoreA('');
        setScoreB('');
        setError('');
    }, [matchToPredict]);

    if (!matchToPredict) {
        return (
            <div className="prediction-container">
                <header className="prediction-header">
                    <h1>Error</h1>
                    <button onClick={() => navigateTo(previousView || 'dashboard')} className="back-button button-with-icon">
                        <FiArrowLeft /> Volver
                    </button>
                </header>
                <p className="error-message card">No se ha seleccionado ningún partido para predecir.</p>
                 <footer className="prediction-footer">
                    <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
                </footer>
            </div>
        );
    }

    const handleInternalSavePrediction = () => {
        setError('');
        const numScoreA = parseInt(scoreA, 10);
        const numScoreB = parseInt(scoreB, 10);

        if (isNaN(numScoreA) || numScoreA < 0 || isNaN(numScoreB) || numScoreB < 0) {
            setError('Por favor, ingresa un marcador válido (números enteros no negativos).');
            return;
        }

        const predictionDetails = {
            matchId: matchToPredict.id,
            teamA: matchToPredict.teamA,
            teamB: matchToPredict.teamB,
            predictedScoreA: numScoreA,
            predictedScoreB: numScoreB,
        };

        onSavePrediction(predictionDetails);
        showNotification(`Predicción guardada: ${matchToPredict.teamA} ${numScoreA} - ${numScoreB} ${matchToPredict.teamB}`, 'success');
        navigateTo(previousView || 'dashboard');
    };

    return (
        <div className="prediction-container" role="main" aria-labelledby="prediction-title">
            <header className="prediction-header">
                <h1 id="prediction-title">Realizar Predicción</h1>
                <button onClick={() => navigateTo(previousView || 'dashboard')} className="back-button button-with-icon" aria-label={`Volver a ${previousView === 'matches' ? 'Partidos' : 'Dashboard'}`}>
                    <FiArrowLeft /> Volver
                </button>
            </header>

            <div className="prediction-form-card card">
                <div className="match-details-preview">
                    <h2>{matchToPredict.teamA} <span className="vs-small">vs</span> {matchToPredict.teamB}</h2>
                    <p className="match-info-text">
                        {matchToPredict.tournamentName && <span className="match-tournament-tag">{matchToPredict.tournamentName}</span>}
                        {new Date(matchToPredict.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })} hs
                    </p>
                </div>

                <div className="prediction-form-content">
                    <div className="score-inputs">
                        <div className="form-group score-input-group">
                            <label htmlFor="scoreA">{`Goles ${matchToPredict.teamA}`}</label>
                            <input
                                type="number"
                                id="scoreA"
                                value={scoreA}
                                onChange={(e) => setScoreA(e.target.value)}
                                min="0"
                                placeholder="0"
                                aria-label={`Goles para ${matchToPredict.teamA}`}
                            />
                        </div>
                        <div className="form-group score-input-group">
                            <label htmlFor="scoreB">{`Goles ${matchToPredict.teamB}`}</label>
                            <input
                                type="number"
                                id="scoreB"
                                value={scoreB}
                                onChange={(e) => setScoreB(e.target.value)}
                                min="0"
                                placeholder="0"
                                aria-label={`Goles para ${matchToPredict.teamB}`}
                            />
                        </div>
                    </div>
                    {error && <p className="error-message" role="alert">{error}</p>}
                    <div className="prediction-actions">
                        <button onClick={handleInternalSavePrediction} className="action-button save-prediction-button button-with-icon">
                            <FiSave /> Guardar Predicción
                        </button>
                        <button onClick={() => navigateTo(previousView || 'dashboard')} className="action-button cancel-button button-with-icon">
                            <FiXCircle /> Cancelar
                        </button>
                    </div>
                </div>
            </div>
            <footer className="prediction-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

interface PointsDetailScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView) => void;
    userTotalPoints: number;
    userPredictions: UserPrediction[];
    allMatches: Match[];
    calculatePointsAndStatus: (prediction: UserPrediction | undefined, match: Match) => PredictionResult;
}

const PointsDetailScreen: React.FC<PointsDetailScreenProps> = ({ user, navigateTo, userTotalPoints, userPredictions, allMatches, calculatePointsAndStatus }) => {
    const dynamicPointsBreakdown: Array<{ id: string; source: string; points: number; detail: string; date: string; }> = [];

    if (user) {
        const currentUserIdentifier = user.username || user.email;
        const currentUserActivePredictions = userPredictions.filter(p => p.userId === currentUserIdentifier);

        currentUserActivePredictions.forEach(prediction => {
            const match = allMatches.find(m => m.id === prediction.matchId);
            if (match && match.isPlayed && typeof match.actualScoreA === 'number' && typeof match.actualScoreB === 'number') {
                const result = calculatePointsAndStatus(prediction, match);
                if (result.points > 0) { // Only show entries that resulted in points
                    dynamicPointsBreakdown.push({
                        id: `${prediction.matchId}-${prediction.userId}`,
                        source: `Predicción: ${match.teamA} vs ${match.teamB}`,
                        points: result.points,
                        detail: result.status,
                        date: match.date
                    });
                }
            }
        });
    }
    // Sort by date, most recent first for example
    dynamicPointsBreakdown.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    return (
        <div className="points-detail-container" role="main" aria-labelledby="points-detail-title">
            <header className="points-detail-header">
                <h1 id="points-detail-title">Detalle de Mis Puntos</h1>
                <button onClick={() => navigateTo('dashboard')} className="back-button button-with-icon" aria-label="Volver al dashboard">
                    <FiArrowLeft /> Volver al Dashboard
                </button>
            </header>
            <section className="points-breakdown-section card">
                 <h2 className="sr-only">Desglose de Puntos</h2>
                {dynamicPointsBreakdown.length > 0 ? (
                    <ul className="points-breakdown-list">
                        {dynamicPointsBreakdown.map(item => (
                            <li key={item.id} className="point-entry-card">
                                <div className="point-entry-header">
                                    <span className="point-source">{item.source}</span>
                                    <span className={`point-value ${item.points > 0 ? 'positive' : item.points < 0 ? 'negative' : 'neutral'}`}>
                                        {item.points > 0 ? `+${item.points}` : item.points} pts
                                    </span>
                                </div>
                                <p className="point-detail-text">{item.detail}</p>
                                <p className="point-date-text">{new Date(item.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-items-message">No has ganado puntos por predicciones todavía.</p>
                )}
                <div className="points-total-summary">
                    <h3>Total de Puntos Acumulados: <span className="total-points-value">{userTotalPoints}</span></h3>
                </div>
            </section>
            <footer className="points-detail-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};


interface RankingScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView) => void;
}

const RankingScreen: React.FC<RankingScreenProps> = ({ user, navigateTo }) => {
    const mockPlayers = [
        { username: 'JuanPerez', points: 150, email: 'juan@example.com' },
        { username: 'MariaGarcia', points: 145, email: 'maria@example.com' },
        { username: 'CarlosLopez', points: 130, email: 'carlos@example.com' },
        { username: 'AnaMartinez', points: 120, email: 'ana@example.com' },
        { username: 'LuisSanchez', points: 110, email: 'luis@example.com' },
    ];

    const currentUserIdentifier = user?.username || user?.email;
    
    let rankingData = mockPlayers.map(player => ({
        ...player,
        points: (player.username === currentUserIdentifier || player.email === user?.email) 
                ? (user?.totalPoints ?? 0) 
                : player.points
    }));
    
    if (user && !rankingData.some(p => (p.username === currentUserIdentifier || p.email === user.email))) {
        rankingData.push({ username: currentUserIdentifier!, email: user.email, points: user.totalPoints ?? 0});
    }

    rankingData.sort((a, b) => b.points - a.points);
    const finalRankingData = rankingData.map((player, index) => ({
        ...player,
        rank: index + 1
    }));


    return (
        <div className="ranking-container" role="main" aria-labelledby="ranking-title">
            <header className="ranking-header">
                <h1 id="ranking-title">Tabla de Posiciones</h1>
                 <button onClick={() => navigateTo('dashboard')} className="back-button button-with-icon" aria-label="Volver al dashboard">
                    <FiArrowLeft /> Volver al Dashboard
                </button>
            </header>

            <section className="ranking-table-section" aria-labelledby="ranking-table-heading">
                <h2 id="ranking-table-heading" className="sr-only">Ranking de Usuarios</h2>
                <div className="table-responsive">
                    <table className="ranking-table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Usuario</th>
                                <th scope="col">Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalRankingData.map(player => (
                                <tr key={player.username} className={(player.username === currentUserIdentifier || player.email === user?.email) ? 'current-user-row' : ''}>
                                    <td>{player.rank}</td>
                                    <td>{player.username}</td>
                                    <td>{player.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <footer className="ranking-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

interface ProfileScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView) => void;
    onUpdateProfile: (profileData: { username: string; avatarUrl: string; favoriteTeam: string; }) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
    userPredictions: UserPrediction[];
    allMatches: Match[];
    calculatePointsAndStatus: (prediction: UserPrediction | undefined, match: Match) => PredictionResult;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
    user, navigateTo, onUpdateProfile, showNotification, 
    userPredictions, allMatches, calculatePointsAndStatus 
}) => {
    const [username, setUsername] = useState(user?.username || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://via.placeholder.com/150?text=User');
    const [favoriteTeam, setFavoriteTeam] = useState(user?.favoriteTeam || '');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setAvatarUrl(user.avatarUrl || 'https://via.placeholder.com/150?text=User');
            setFavoriteTeam(user.favoriteTeam || '');
        }
    }, [user]);


    const handleEditToggle = () => {
        if (isEditing) {
            onUpdateProfile({ 
                username: username.trim(), 
                avatarUrl: avatarUrl.trim(), 
                favoriteTeam: favoriteTeam.trim() 
            });
        }
        setIsEditing(!isEditing);
    };

    if (!user) {
        return (
            <div className="profile-container">
                <p className="error-message card">Usuario no encontrado. Por favor, inicia sesión.</p>
                <button onClick={() => navigateTo('auth')} className="action-button button-with-icon">
                    <FiLogIn /> Ir a Iniciar Sesión
                </button>
                 <footer className="profile-footer">
                    <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
                </footer>
            </div>
        );
    }

    const currentUserIdentifier = user.username || user.email;
    const currentUserActivePredictions = userPredictions.filter(p => p.userId === currentUserIdentifier);
    const predictionsMadeCount = currentUserActivePredictions.length;

    let correctPredictionsCount = 0;
    currentUserActivePredictions.forEach(prediction => {
        const match = allMatches.find(m => m.id === prediction.matchId);
        if (match && match.isPlayed && typeof match.actualScoreA === 'number' && typeof match.actualScoreB === 'number') {
            const result = calculatePointsAndStatus(prediction, match);
            if (result.points > 0) {
                correctPredictionsCount++;
            }
        }
    });


    return (
        <div className="profile-container" role="main" aria-labelledby="profile-title">
            <header className="profile-header">
                <h1 id="profile-title">Mi Perfil</h1>
                <button onClick={() => navigateTo('dashboard')} className="back-button button-with-icon" aria-label="Volver al dashboard">
                    <FiArrowLeft /> Volver al Dashboard
                </button>
            </header>

            <section className="profile-details-section card" aria-labelledby="profile-details-heading">
                <h2 id="profile-details-heading" className="sr-only">Detalles del Perfil</h2>
                <div className="profile-avatar-container">
                     <img
                        src={isEditing ? (avatarUrl || 'https://via.placeholder.com/150?text=User') : (user.avatarUrl || 'https://via.placeholder.com/150?text=User')}
                        alt="Avatar de usuario"
                        className="profile-avatar"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')}
                    />
                </div>
                <div className="profile-info">
                    <div className="form-group">
                        <label htmlFor="profile-username">Nombre de Usuario:</label>
                        <input type="text" id="profile-username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-email">Correo Electrónico:</label>
                        <input type="email" id="profile-email" value={user.email} disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-avatar-url">URL del Avatar:</label>
                        <input type="text" id="profile-avatar-url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} disabled={!isEditing} placeholder="https://ejemplo.com/avatar.png"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-fav-team">Equipo Favorito:</label>
                        <input type="text" id="profile-fav-team" value={favoriteTeam} onChange={(e) => setFavoriteTeam(e.target.value)} disabled={!isEditing} />
                    </div>
                    <button onClick={handleEditToggle} className="action-button edit-profile-button button-with-icon">
                        {isEditing ? <FiSave /> : <FiEdit />}
                        {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                    </button>
                </div>
            </section>

            <section className="profile-stats-section card" aria-labelledby="profile-stats-heading">
                <h2 id="profile-stats-heading">Mis Estadísticas</h2>
                <ul>
                    <li>Partidos Predecidos: <strong>{predictionsMadeCount}</strong></li>
                    <li>Predicciones Acertadas: <strong>{correctPredictionsCount}</strong></li>
                    <li>Puntos Totales: <strong>{user.totalPoints ?? 0}</strong></li>
                </ul>
                 <button className="details-button button-with-icon" onClick={() => showNotification('Ver historial completo de predicciones (Próximamente)', 'info')}>
                    <FiActivity /> Ver Historial Completo
                </button>
            </section>

            <section className="profile-actions-section card" aria-labelledby="profile-actions-heading">
                <h2 id="profile-actions-heading">Acciones de Cuenta</h2>
                 <button className="action-button button-with-icon" onClick={() => showNotification('Cambiar contraseña (Próximamente)', 'info')}>
                    <FiLock /> Cambiar Contraseña
                </button>
            </section>

            <footer className="profile-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

// --- Admin Panel Components ---
interface AdminPanelScreenProps {
    user: User | null;
    navigateTo: (view: ScreenView, payload?: any) => void;
    tournaments: Tournament[];
    leagues: League[]; // Added for assigning matches to leagues
    onAddTournament: (tournamentData: Omit<Tournament, 'id'>) => void;
    onUpdateTournament: (tournamentData: Tournament) => void;
    onDeleteTournament: (tournamentId: string) => void;
    allMatches: Match[];
    onAddMatch: (matchData: Omit<Match, 'id' | 'isPlayed' | 'actualScoreA' | 'actualScoreB'> & { leagueIds?: string[] }) => void;
    onUpdateMatch: (matchData: Match) => void;
    onDeleteMatch: (matchId: string) => void;
    onSetMatchResult: (matchId: string, actualScoreA: number, actualScoreB: number) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
}

type AdminSubView = 'tournamentsList' | 'tournamentForm' | 'matchesList' | 'matchForm' | 'setResultForm' ;

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
    user,
    navigateTo,
    tournaments,
    leagues, // Receive all leagues
    onAddTournament,
    onUpdateTournament,
    onDeleteTournament,
    allMatches,
    onAddMatch,
    onUpdateMatch,
    onDeleteMatch,
    onSetMatchResult,
    showNotification
}) => {
    const [adminView, setAdminView] = useState<AdminSubView>('tournamentsList');
    const [selectedTournamentForMatchAdmin, setSelectedTournamentForMatchAdmin] = useState<Tournament | null>(null);

    // Tournament Form State
    const [tournamentName, setTournamentName] = useState('');
    const [tournamentYear, setTournamentYear] = useState<string>(new Date().getFullYear().toString());
    const [tournamentError, setTournamentError] = useState('');
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);


    // Match Form State
    const [matchTeamA, setMatchTeamA] = useState('');
    const [matchTeamB, setMatchTeamB] = useState('');
    const [matchDate, setMatchDate] = useState(''); 
    const [matchTime, setMatchTime] = useState(''); 
    const [matchError, setMatchError] = useState('');
    const [editingMatch, setEditingMatch] = useState<Match | null>(null);
    const [selectedLeagueIdsForMatchForm, setSelectedLeagueIdsForMatchForm] = useState<string[]>([]);


    // Set Result Form State
    const [selectedMatchForResult, setSelectedMatchForResult] = useState<Match | null>(null);
    const [resultScoreA, setResultScoreA] = useState('');
    const [resultScoreB, setResultScoreB] = useState('');
    const [resultErrorForm, setResultErrorForm] = useState('');
    
    const handleOpenAddTournamentForm = () => {
        setEditingTournament(null);
        setTournamentName('');
        setTournamentYear(new Date().getFullYear().toString());
        setTournamentError('');
        setAdminView('tournamentForm');
    };
    
    const handleEditTournamentClick = (tournament: Tournament) => {
        setEditingTournament(tournament);
        setTournamentName(tournament.name);
        setTournamentYear(tournament.year.toString());
        setTournamentError('');
        setAdminView('tournamentForm');
    };

    const handleTournamentSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setTournamentError('');
        if (!tournamentName.trim()) {
            setTournamentError('El nombre del torneo es obligatorio.');
            return;
        }
        const year = parseInt(tournamentYear, 10);
        if (isNaN(year) || year < 1900 || year > 2100) {
            setTournamentError('Por favor, ingresa un año válido.');
            return;
        }

        if (editingTournament) { 
            onUpdateTournament({ ...editingTournament, name: tournamentName, year });
        } else { 
            onAddTournament({ name: tournamentName, year });
        }
        
        setTournamentName('');
        setTournamentYear(new Date().getFullYear().toString());
        setEditingTournament(null);
        setAdminView('tournamentsList');
    };
    
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalProps, setConfirmModalProps] = useState<{
        title: string;
        message: string;
        onConfirmAction: () => void;
        confirmButtonVariant?: 'danger' | 'primary';
    } | null>(null);

    const openConfirmationModal = (
        title: string,
        message: string,
        onConfirmAction: () => void,
        confirmButtonVariant: 'danger' | 'primary' = 'primary'
    ) => {
        setConfirmModalProps({ title, message, onConfirmAction, confirmButtonVariant });
        setIsConfirmModalOpen(true);
    };
    
    const handleDeleteTournamentClick = (tournament: Tournament) => {
        openConfirmationModal(
            "Confirmar Eliminación de Torneo",
            `¿Estás seguro de que quieres eliminar el torneo "${tournament.name}" y todos sus partidos asociados? Esta acción no se puede deshacer.`,
            () => {
                onDeleteTournament(tournament.id);
                setIsConfirmModalOpen(false); // Close modal after action
            },
            'danger'
        );
    };
    
    const handleOpenAddMatchForm = () => {
        setEditingMatch(null);
        setMatchTeamA('');
        setMatchTeamB('');
        setMatchDate('');
        setMatchTime('');
        setMatchError('');
        setSelectedLeagueIdsForMatchForm([]);
        setAdminView('matchForm');
    };

    const handleEditMatchClick = (match: Match) => {
        setEditingMatch(match);
        setMatchTeamA(match.teamA);
        setMatchTeamB(match.teamB);
        // Date and time need careful formatting for input type="date" and "time"
        const [datePart, timePartWithMs] = match.date.split('T');
        setMatchDate(datePart); // YYYY-MM-DD
        setMatchTime(timePartWithMs ? timePartWithMs.substring(0, 5) : ''); // HH:MM
        setMatchError('');
        setSelectedLeagueIdsForMatchForm(match.leagueIds || []);
        setAdminView('matchForm');
    };
    
    const handleLeagueCheckboxChange = (leagueId: string) => {
        setSelectedLeagueIdsForMatchForm(prev =>
            prev.includes(leagueId)
                ? prev.filter(id => id !== leagueId)
                : [...prev, leagueId]
        );
    };


    const handleMatchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setMatchError('');
        if (!selectedTournamentForMatchAdmin) {
            setMatchError('Error interno: No hay torneo seleccionado.');
            return;
        }
        if (!matchTeamA.trim() || !matchTeamB.trim()) {
            setMatchError('Los nombres de ambos equipos son obligatorios.');
            return;
        }
        if (!matchDate || !matchTime) {
            setMatchError('La fecha y hora del partido son obligatorias.');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(matchDate)) {
            setMatchError('Formato de fecha inválido. Usa YYYY-MM-DD.');
            return;
        }
        if (!/^\d{2}:\d{2}$/.test(matchTime)) {
            setMatchError('Formato de hora inválido. Usa HH:MM.');
            return;
        }

        const fullDateTime = `${matchDate}T${matchTime}:00`;

        if (editingMatch) { // Edit mode
            onUpdateMatch({
                ...editingMatch, // Spread existing match to keep isPlayed, scores etc.
                teamA: matchTeamA,
                teamB: matchTeamB,
                date: fullDateTime,
                leagueIds: selectedLeagueIdsForMatchForm,
                // tournamentId and tournamentName remain from editingMatch
            });
        } else { // Add mode
            onAddMatch({
                teamA: matchTeamA,
                teamB: matchTeamB,
                date: fullDateTime,
                tournamentId: selectedTournamentForMatchAdmin.id,
                tournamentName: selectedTournamentForMatchAdmin.name,
                leagueIds: selectedLeagueIdsForMatchForm,
            });
        }
        
        setEditingMatch(null);
        setMatchTeamA('');
        setMatchTeamB('');
        setMatchDate('');
        setMatchTime('');
        setSelectedLeagueIdsForMatchForm([]);
        setAdminView('matchesList');
    };
    
    const handleDeleteMatchClick = (match: Match) => {
         openConfirmationModal(
            "Confirmar Eliminación de Partido",
            `¿Estás seguro de que quieres eliminar el partido "${match.teamA} vs ${match.teamB}"? Todas las predicciones asociadas también se eliminarán.`,
            () => {
                onDeleteMatch(match.id);
                setIsConfirmModalOpen(false);
            },
            'danger'
        );
    };


    const handleOpenSetResultForm = (match: Match) => {
        setSelectedMatchForResult(match);
        setResultScoreA(match.actualScoreA?.toString() || '');
        setResultScoreB(match.actualScoreB?.toString() || '');
        setResultErrorForm('');
        setAdminView('setResultForm');
    };

    const handleSaveMatchResultSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setResultErrorForm('');
        if (!selectedMatchForResult) {
            setResultErrorForm('Error: No hay partido seleccionado.');
            return;
        }
        const numScoreA = parseInt(resultScoreA, 10);
        const numScoreB = parseInt(resultScoreB, 10);

        if (isNaN(numScoreA) || numScoreA < 0 || isNaN(numScoreB) || numScoreB < 0) {
            setResultErrorForm('Por favor, ingresa marcadores válidos (números enteros no negativos).');
            return;
        }

        onSetMatchResult(selectedMatchForResult.id, numScoreA, numScoreB);
        showNotification(`Resultado para ${selectedMatchForResult.teamA} vs ${selectedMatchForResult.teamB} guardado: ${numScoreA} - ${numScoreB}.`, 'success');

        setSelectedMatchForResult(null);
        setResultScoreA('');
        setResultScoreB('');
        setAdminView('matchesList'); 
    };

    const openMatchManagement = (tournament: Tournament) => {
        setSelectedTournamentForMatchAdmin(tournament);
        setEditingMatch(null); 
        setMatchError(''); 
        setAdminView('matchesList');
    };
    
    const handleBackToTournamentList = () => {
        setEditingTournament(null);
        setSelectedTournamentForMatchAdmin(null);
        setEditingMatch(null);
        setAdminView('tournamentsList');
    };
    
    const handleBackToMatchList = () => {
        setEditingMatch(null);
        setAdminView('matchesList');
    }


    if (!user?.isAdmin) {
        return (
            <div className="admin-panel-container">
                <p className="error-message card">Acceso denegado. Esta sección es solo para administradores.</p>
                <button onClick={() => navigateTo('dashboard')} className="action-button button-with-icon">
                    <FiArrowLeft /> Volver al Dashboard
                </button>
            </div>
        );
    }

    const matchesForSelectedTournament = selectedTournamentForMatchAdmin
        ? allMatches.filter(m => m.tournamentId === selectedTournamentForMatchAdmin.id)
        : [];

    return (
        <div className="admin-panel-container" role="main" aria-labelledby="admin-panel-title">
            <header className="admin-header">
                <h1 id="admin-panel-title">Panel de Administración</h1>
                <button onClick={() => navigateTo('dashboard')} className="back-button button-with-icon" aria-label="Volver al dashboard">
                    <FiArrowLeft /> Volver al Dashboard
                </button>
            </header>
            {confirmModalProps && (
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    title={confirmModalProps.title}
                    message={confirmModalProps.message}
                    onConfirm={confirmModalProps.onConfirmAction}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    confirmButtonVariant={confirmModalProps.confirmButtonVariant}
                />
            )}

            <nav className="admin-nav card">
                <button
                    onClick={handleBackToTournamentList}
                    className={`nav-button button-with-icon ${(adminView === 'tournamentsList' || adminView === 'tournamentForm') ? 'active' : ''}`}
                    aria-current={(adminView === 'tournamentsList' || adminView === 'tournamentForm') ? "page" : undefined}
                >
                    <FiArchive /> Gestionar Torneos
                </button>
                <button
                    onClick={() => {
                        if (selectedTournamentForMatchAdmin) openMatchManagement(selectedTournamentForMatchAdmin);
                        else showNotification("Selecciona un torneo primero para gestionar sus partidos.", "info");
                    }}
                    className={`nav-button button-with-icon ${(adminView === 'matchesList' || adminView === 'matchForm' || adminView === 'setResultForm') ? 'active' : ''}`}
                    disabled={!selectedTournamentForMatchAdmin && !['matchesList', 'matchForm', 'setResultForm'].includes(adminView)}
                >
                    <FiClipboard /> Gestionar Partidos {selectedTournamentForMatchAdmin ? `(${selectedTournamentForMatchAdmin.name})` : ''}
                </button>
            </nav>

            {adminView === 'tournamentsList' && (
                <section className="admin-section card" aria-labelledby="tournaments-admin-title">
                    <div className="admin-section-header">
                        <h2 id="tournaments-admin-title">Lista de Torneos</h2>
                        <button className="action-button add-new-button button-with-icon" onClick={handleOpenAddTournamentForm}>
                            <FiPlusSquare /> Añadir Nuevo Torneo
                        </button>
                    </div>
                    {tournaments.length > 0 ? (
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Torneo</th>
                                        <th>Año</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tournaments.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.name}</td>
                                            <td>{t.year}</td>
                                            <td className="actions-cell">
                                                <button 
                                                    className="action-button-icon edit-icon-button" 
                                                    onClick={() => handleEditTournamentClick(t)}
                                                    aria-label={`Editar torneo ${t.name}`}
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button 
                                                    className="action-button-icon delete-icon-button" 
                                                    onClick={() => handleDeleteTournamentClick(t)}
                                                    aria-label={`Eliminar torneo ${t.name}`}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                                <button className="action-button-small button-with-icon" onClick={() => openMatchManagement(t)}>
                                                    <FiList /> Gestionar Partidos
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-items-message">No hay torneos creados. ¡Añade uno!</p>
                    )}
                </section>
            )}

            {adminView === 'tournamentForm' && (
                <section className="admin-section card" aria-labelledby="tournament-form-title-id">
                     <div className="admin-section-header">
                        <h2 id="tournament-form-title-id">{editingTournament ? `Editar Torneo: ${editingTournament.name}` : "Añadir Nuevo Torneo"}</h2>
                        <button className="action-button cancel-button button-with-icon" onClick={handleBackToTournamentList}>
                           <FiArrowLeft /> Volver a Lista de Torneos
                        </button>
                    </div>
                    <form onSubmit={handleTournamentSubmit} className="admin-form-card">
                        <div className="form-group">
                            <label htmlFor="tournament-name-form">Nombre del Torneo</label>
                            <input
                                type="text"
                                id="tournament-name-form"
                                value={tournamentName}
                                onChange={(e) => setTournamentName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tournament-year-form">Año</label>
                            <input
                                type="number"
                                id="tournament-year-form"
                                value={tournamentYear}
                                onChange={(e) => setTournamentYear(e.target.value)}
                                required
                                min="1900"
                                max="2100"
                            />
                        </div>
                        {tournamentError && <p className="error-message">{tournamentError}</p>}
                        <div className="admin-form-actions">
                            <button type="submit" className="action-button button-with-icon">
                                <FiSave /> {editingTournament ? "Guardar Cambios" : "Guardar Torneo"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {adminView === 'matchesList' && selectedTournamentForMatchAdmin && (
                 <section className="admin-section card" aria-labelledby="matches-admin-title">
                    <div className="admin-section-header">
                        <h2 id="matches-admin-title">Partidos de: {selectedTournamentForMatchAdmin.name}</h2>
                        <div>
                            <button className="action-button add-new-button button-with-icon" onClick={handleOpenAddMatchForm}>
                                <FiPlusSquare /> Añadir Nuevo Partido
                            </button>
                            <button className="action-button cancel-button button-with-icon" style={{marginLeft: '10px'}} onClick={handleBackToTournamentList}>
                                <FiArrowLeft /> Volver a Lista de Torneos
                            </button>
                        </div>
                    </div>
                    {matchesForSelectedTournament.length > 0 ? (
                        <div className="table-responsive">
                            <table className="admin-table matches-admin-table">
                                <thead>
                                    <tr>
                                        <th>Equipo A</th>
                                        <th>Equipo B</th>
                                        <th>Fecha y Hora</th>
                                        <th>Ligas</th>
                                        <th>Resultado</th>
                                        <th className="actions-cell">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchesForSelectedTournament.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.teamA}</td>
                                            <td>{m.teamB}</td>
                                            <td>{new Date(m.date).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                            <td>{m.leagueIds && m.leagueIds.length > 0 ? m.leagueIds.map(id => leagues.find(l=>l.id === id)?.name || id).join(', ') : 'Global'}</td>
                                            <td>
                                                {m.isPlayed && typeof m.actualScoreA === 'number' ? `${m.actualScoreA} - ${m.actualScoreB}` : 'Pendiente'}
                                            </td>
                                            <td className="match-actions-cell">
                                                 <button
                                                    className="action-button-icon edit-icon-button"
                                                    onClick={() => handleEditMatchClick(m)}
                                                    aria-label={`Editar partido ${m.teamA} vs ${m.teamB}`}
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    className="action-button-icon delete-icon-button"
                                                    onClick={() => handleDeleteMatchClick(m)}
                                                    aria-label={`Eliminar partido ${m.teamA} vs ${m.teamB}`}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                                <button
                                                    className="action-button-small button-with-icon"
                                                    onClick={() => handleOpenSetResultForm(m)}
                                                >
                                                    {m.isPlayed ? <FiEdit /> : <FiCheckSquare />}
                                                    {m.isPlayed ? 'Editar Resultado' : 'Registrar Resultado'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-items-message">No hay partidos creados para este torneo. ¡Añade uno!</p>
                    )}
                </section>
            )}

            {adminView === 'matchForm' && selectedTournamentForMatchAdmin && (
                <section className="admin-section card" aria-labelledby="match-form-admin-title">
                     <div className="admin-section-header">
                        <h2 id="match-form-admin-title">
                            {editingMatch 
                                ? `Editar Partido: ${editingMatch.teamA} vs ${editingMatch.teamB}` 
                                : `Añadir Nuevo Partido a: ${selectedTournamentForMatchAdmin.name}`}
                        </h2>
                         <button className="action-button cancel-button button-with-icon" onClick={handleBackToMatchList}>
                            <FiArrowLeft /> Volver a Lista de Partidos
                        </button>
                    </div>
                    <form onSubmit={handleMatchSubmit} className="admin-form-card">
                        <div className="form-group">
                            <label htmlFor="match-team-a">Equipo A</label>
                            <input type="text" id="match-team-a" value={matchTeamA} onChange={e => setMatchTeamA(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="match-team-b">Equipo B</label>
                            <input type="text" id="match-team-b" value={matchTeamB} onChange={e => setMatchTeamB(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="match-date">Fecha del Partido</label>
                            <input type="date" id="match-date" value={matchDate} onChange={e => setMatchDate(e.target.value)} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="match-time">Hora del Partido (HH:MM)</label>
                            <input type="time" id="match-time" value={matchTime} onChange={e => setMatchTime(e.target.value)} required />
                        </div>
                        <div className="form-group league-assignment-section">
                            <h3 className="league-assignment-title">Asociar con Ligas (Opcional)</h3>
                            <div className="league-checkbox-list">
                                {leagues.map(league => (
                                    <div key={league.id} className="league-checkbox-group">
                                        <input
                                            type="checkbox"
                                            id={`league-assign-${league.id}`}
                                            value={league.id}
                                            checked={selectedLeagueIdsForMatchForm.includes(league.id)}
                                            onChange={() => handleLeagueCheckboxChange(league.id)}
                                        />
                                        <label htmlFor={`league-assign-${league.id}`}>{league.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {matchError && <p className="error-message">{matchError}</p>}
                        <div className="admin-form-actions">
                            <button type="submit" className="action-button button-with-icon">
                                <FiSave /> {editingMatch ? "Guardar Cambios" : "Guardar Partido"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {adminView === 'setResultForm' && selectedMatchForResult && (
                 <section className="admin-section card" aria-labelledby="set-result-title">
                    <div className="admin-section-header">
                        <h2 id="set-result-title">
                             {selectedMatchForResult.isPlayed ? 'Editar Resultado para: ' : 'Registrar Resultado para: '} 
                             {selectedMatchForResult.teamA} vs {selectedMatchForResult.teamB}
                        </h2>
                         <button className="action-button cancel-button button-with-icon" onClick={() => {
                             setSelectedMatchForResult(null);
                             setResultScoreA('');
                             setResultScoreB('');
                             setResultErrorForm('');
                             handleBackToMatchList(); 
                         }}>
                            <FiArrowLeft /> Volver a Lista de Partidos
                        </button>
                    </div>
                    <form onSubmit={handleSaveMatchResultSubmit} className="admin-form-card">
                        <p>Torneo: {selectedMatchForResult.tournamentName}</p>
                        <p>Fecha: {new Date(selectedMatchForResult.date).toLocaleString('es-ES', {dateStyle: 'medium', timeStyle: 'short'})}</p>
                        <div className="score-inputs">
                            <div className="form-group score-input-group">
                                <label htmlFor="result-score-a">{`Goles ${selectedMatchForResult.teamA}`}</label>
                                <input
                                    type="number"
                                    id="result-score-a"
                                    value={resultScoreA}
                                    onChange={(e) => setResultScoreA(e.target.value)}
                                    min="0"
                                    required
                                    placeholder="0"
                                />
                            </div>
                            <div className="form-group score-input-group">
                                <label htmlFor="result-score-b">{`Goles ${selectedMatchForResult.teamB}`}</label>
                                <input
                                    type="number"
                                    id="result-score-b"
                                    value={resultScoreB}
                                    onChange={(e) => setResultScoreB(e.target.value)}
                                    min="0"
                                    required
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        {resultErrorForm && <p className="error-message">{resultErrorForm}</p>}
                        <div className="admin-form-actions">
                            <button type="submit" className="action-button button-with-icon">
                                <FiSave /> {selectedMatchForResult.isPlayed ? "Guardar Cambios" : "Guardar Resultado"}
                            </button>
                        </div>
                    </form>
                </section>
            )}


             <footer className="admin-footer">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo Admin. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};


const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error('Failed to find the root element');
}