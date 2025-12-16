'use client';

import React from 'react';
import { FiLogOut, FiList, FiShield, FiBarChart2, FiUser, FiSettings, FiEdit3, FiInfo } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { PredictionResult } from '@/types';
import { AdBanner } from '@/components/ui/AdBanner';
import Image from 'next/image';
import { getTeamFlagUrl } from '@/lib/utils';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { MatchCard } from '@/components/matches/MatchCard';

export const DashboardScreen: React.FC = () => {
    const { user, logout, userPredictions, allMatches, calculatePointsAndStatus, teams } = useApp();
    const router = useRouter();

    const getTeamFlag = (teamName: string) => {
        const team = teams.find(t => t.name === teamName);
        return getTeamFlagUrl(teamName, team?.logoUrl);
    };

    const upcomingMatchesForDashboard = allMatches
        .filter(match => !match.isPlayed)
        .slice(0, 2);

    const currentUserPredictions = user
        ? userPredictions.filter(p => p.userId === (user.username || user.email))
        : [];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="dashboard-title">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="dashboard-title" className="text-xl sm:text-2xl font-display font-bold text-gloria-accent tracking-tight truncate max-w-[70%] sm:max-w-none">
                        Gordos Fulbo <span className="hidden sm:inline">XXL Turbo Ultra V12</span> <span className="text-gloria-primary font-normal italic hidden md:inline">| Gloria Eterna</span>
                    </h1>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-gloria-accent font-bold text-sm">
                                {user?.username || user?.email}
                            </span>
                            <span className="text-gloria-primary text-xs font-serif italic">
                                Director Técnico
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Cerrar sesión"
                            title="Cerrar Sesión"
                        >
                            <FiLogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Navegación principal">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                    <button className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-soft hover:shadow-gold hover:-translate-y-1 transition-all duration-300" onClick={() => router.push('/matches')}>
                        <div className="w-12 h-12 rounded-full bg-gloria-bg flex items-center justify-center mb-4 group-hover:bg-gloria-primary/10 transition-colors">
                            <FiList size={24} className="text-gloria-accent group-hover:text-gloria-primary transition-colors" />
                        </div>
                        <span className="font-serif font-bold text-gloria-accent">Partidos</span>
                    </button>
                    <button className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-soft hover:shadow-gold hover:-translate-y-1 transition-all duration-300" onClick={() => router.push('/leagues')}>
                        <div className="w-12 h-12 rounded-full bg-gloria-bg flex items-center justify-center mb-4 group-hover:bg-gloria-secondary/10 transition-colors">
                            <FiShield size={24} className="text-gloria-accent group-hover:text-gloria-secondary transition-colors" />
                        </div>
                        <span className="font-serif font-bold text-gloria-accent">Ligas</span>
                    </button>
                    <button className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-soft hover:shadow-gold hover:-translate-y-1 transition-all duration-300" onClick={() => router.push('/ranking')}>
                        <div className="w-12 h-12 rounded-full bg-gloria-bg flex items-center justify-center mb-4 group-hover:bg-gloria-primary/10 transition-colors">
                            <FiBarChart2 size={24} className="text-gloria-accent group-hover:text-gloria-primary transition-colors" />
                        </div>
                        <span className="font-serif font-bold text-gloria-accent">Olimpo</span>
                    </button>
                    <button className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-soft hover:shadow-gold hover:-translate-y-1 transition-all duration-300" onClick={() => router.push('/profile')}>
                        <div className="w-12 h-12 rounded-full bg-gloria-bg flex items-center justify-center mb-4 group-hover:bg-gloria-secondary/10 transition-colors">
                            <FiUser size={24} className="text-gloria-accent group-hover:text-gloria-secondary transition-colors" />
                        </div>
                        <span className="font-serif font-bold text-gloria-accent">Legado</span>
                    </button>
                    {user?.isAdmin && (
                        <button className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-soft hover:shadow-gold hover:-translate-y-1 transition-all duration-300 col-span-2 sm:col-span-1" onClick={() => router.push('/admin')}>
                            <div className="w-12 h-12 rounded-full bg-gloria-bg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                                <FiSettings size={24} className="text-gray-600 group-hover:text-gray-800 transition-colors" />
                            </div>
                            <span className="font-serif font-bold text-gray-600">Admin</span>
                        </button>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <section aria-labelledby="current-points-title">
                    <div className="bg-gradient-to-r from-gloria-accent to-gray-900 rounded-xl shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden text-white gap-6 sm:gap-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gloria-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="relative z-10 text-center sm:text-left">
                            <h2 id="current-points-title" className="text-sm text-gloria-primary uppercase tracking-widest mb-2 font-bold">Tu Legado</h2>
                            <p className="text-5xl sm:text-6xl font-display font-bold text-white drop-shadow-md">{user?.totalPoints ?? 0}</p>
                            <p className="text-sm text-gray-400 mt-2 font-serif italic">Puntos acumulados en la historia</p>
                        </div>
                        <button onClick={() => router.push('/points')} className="relative z-10 flex items-center gap-2 px-6 py-3 border border-gloria-primary/50 text-gloria-primary rounded hover:bg-gloria-primary hover:text-white font-serif font-bold transition-all w-full sm:w-auto justify-center">
                            <FiInfo /> Ver Detalle
                        </button>
                    </div>
                </section>

                <section aria-labelledby="predictions-summary-title">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <h2 id="predictions-summary-title" className="text-2xl font-display font-bold text-gloria-accent">
                            Tus Predicciones
                        </h2>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {currentUserPredictions.length > 0 ? currentUserPredictions.slice(0, 3).map((pred) => {
                            const match = allMatches.find(m => m.id === pred.matchId);
                            let result: PredictionResult = { points: 0, status: 'Pendiente', statusClass: 'text-gray-400' };
                            if (match) {
                                result = calculatePointsAndStatus(pred, match);
                            }

                            return (
                                <div key={`${pred.matchId}-${pred.userId}`} className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-gold transition-shadow duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                                            <span className="font-serif font-bold text-sm text-gloria-accent truncate">{pred.teamA}</span>
                                            <TeamLogo 
                                                teamName={pred.teamA} 
                                                flagUrl={getTeamFlag(pred.teamA)} 
                                                width={35} 
                                                height={35} 
                                                className="flex-shrink-0"
                                            />
                                        </div>
                                        <span className="text-xs text-gloria-primary font-serif italic mx-2 flex-shrink-0">vs</span>
                                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-start">
                                            <TeamLogo 
                                                teamName={pred.teamB} 
                                                flagUrl={getTeamFlag(pred.teamB)} 
                                                width={35} 
                                                height={35} 
                                                className="flex-shrink-0"
                                            />
                                            <span className="font-serif font-bold text-sm text-gloria-accent truncate">{pred.teamB}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gloria-bg rounded-lg p-4 text-center mb-4 border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-sans">Tu Pronóstico</p>
                                        <p className="text-3xl font-display font-bold text-gloria-accent tracking-widest">
                                            {pred.predictedScoreA} - {pred.predictedScoreB}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${result.status === 'Pendiente' ? 'bg-gray-100 text-gray-500' : result.points > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {result.status}
                                        </span>
                                        {match && match.isPlayed && typeof match.actualScoreA === 'number' && (
                                            <span className={`font-serif font-bold text-lg ${result.points > 0 ? 'text-gloria-primary' : 'text-gray-400'}`}>
                                                {result.points > 0 ? `+${result.points} pts` : '0 pts'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
                                <p className="text-gray-500 font-serif italic text-lg mb-6">&quot;La gloria no es para los que esperan, sino para los que se atreven.&quot;</p>
                                <button onClick={() => router.push('/matches')} className="px-8 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                                    Realizar Predicción
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section aria-labelledby="upcoming-matches-title">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <h2 id="upcoming-matches-title" className="text-2xl font-display font-bold text-gloria-accent">
                            Próximos Encuentros
                        </h2>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {upcomingMatchesForDashboard.length > 0 ? upcomingMatchesForDashboard.map(match => (
                            <MatchCard key={match.id} match={match} />
                        )) : <p className="text-gray-500 col-span-full text-center font-serif italic">El estadio está en silencio. No hay partidos próximos.</p>}
                    </div>
                </section>

                <AdBanner dataAdSlot="0987654321" />
            </main>

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
