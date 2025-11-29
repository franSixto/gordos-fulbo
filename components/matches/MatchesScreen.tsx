'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

type MatchTab = 'upcoming' | 'played';

export const MatchesScreen: React.FC = () => {
    const { user, userPredictions, allMatches, calculatePointsAndStatus } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<MatchTab>('upcoming');

    const upcomingMatchesData = allMatches.filter(match => !match.isPlayed);
    const playedMatchesData = allMatches.filter(match => match.isPlayed && typeof match.actualScoreA === 'number' && typeof match.actualScoreB === 'number');

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="matches-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="matches-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">
                        Encuentros
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver al dashboard">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex justify-center border-b border-gray-200" role="tablist" aria-label="Tipos de partidos">
                    <button
                        id="upcoming-matches-tab"
                        role="tab"
                        aria-controls="upcoming-matches-panel"
                        aria-selected={activeTab === 'upcoming'}
                        onClick={() => setActiveTab('upcoming')}
                        className={`py-4 px-8 font-serif font-bold text-lg transition-all duration-300 border-b-2 ${activeTab === 'upcoming' ? 'border-gloria-primary text-gloria-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Por Jugar
                    </button>
                    <button
                        id="played-matches-tab"
                        role="tab"
                        aria-controls="played-matches-panel"
                        aria-selected={activeTab === 'played'}
                        onClick={() => setActiveTab('played')}
                        className={`py-4 px-8 font-serif font-bold text-lg transition-all duration-300 border-b-2 ${activeTab === 'played' ? 'border-gloria-primary text-gloria-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Resultados
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {activeTab === 'upcoming' && (
                    <section id="upcoming-matches-panel" role="tabpanel" aria-labelledby="upcoming-matches-tab">
                        <h2 className="sr-only">Próximos Partidos</h2>
                        {upcomingMatchesData.length > 0 ? (
                            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {upcomingMatchesData.map(match => (
                                    <li key={match.id} className="bg-white rounded-xl shadow-soft p-8 flex flex-col justify-between hover:shadow-gold transition-all duration-300 border border-gray-100 group">
                                        <div className="mb-8 text-center">
                                            <div className="mb-4">
                                                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-gloria-primary bg-gloria-primary/10 rounded-full mb-2">{match.tournamentName || 'Torneo Oficial'}</span>
                                                <p className="text-sm text-gray-500 font-serif italic">{new Date(match.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                            </div>
                                            <div className="flex items-center justify-center gap-4 font-display text-2xl text-gloria-accent font-bold">
                                                <span className="flex-1 text-right">{match.teamA}</span>
                                                <span className="text-gloria-primary text-lg font-serif font-normal italic">vs</span>
                                                <span className="flex-1 text-left">{match.teamB}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold tracking-wide rounded hover:bg-gloria-gold-600 transition-colors shadow-md"
                                            onClick={() => router.push(`/prediction/${match.id}`)}
                                        >
                                            <FiEdit3 /> Predecir Resultado
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-400 font-serif italic text-xl">"La calma antes de la tormenta. No hay partidos programados."</p>
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'played' && (
                    <section id="played-matches-panel" role="tabpanel" aria-labelledby="played-matches-tab">
                        <h2 className="sr-only">Partidos Jugados</h2>
                        {playedMatchesData.length > 0 ? (
                            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {playedMatchesData.map(match => {
                                    const userIdentifier = user?.username || user?.email;
                                    const prediction = userPredictions.find(p => p.matchId === match.id && p.userId === userIdentifier);
                                    const { points, status, statusClass } = calculatePointsAndStatus(prediction, match);

                                    return (
                                        <li key={match.id} className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-gloria-secondary">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gloria-secondary">{match.tournamentName || 'Torneo Oficial'}</span>
                                                <span className="text-sm text-gray-400 font-serif italic">{new Date(match.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
                                            </div>

                                            <div className="flex items-center justify-between font-display text-xl text-gloria-accent font-bold mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <span className="flex-1 text-right">{match.teamA}</span>
                                                <span className="mx-4 text-2xl text-gloria-secondary">{match.actualScoreA} - {match.actualScoreB}</span>
                                                <span className="flex-1 text-left">{match.teamB}</span>
                                            </div>

                                            <div className="text-sm border-t border-gray-100 pt-4 space-y-3">
                                                {prediction ? (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <strong className="text-gray-500 uppercase text-xs tracking-widest font-sans">Tu Pronóstico</strong>
                                                            <span className="text-gloria-accent font-display font-bold text-lg">{prediction.predictedScoreA} - {prediction.predictedScoreB}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <strong className="text-gray-500 uppercase text-xs tracking-widest font-sans">Resultado</strong>
                                                            <span className={`font-bold uppercase text-xs px-2 py-1 rounded ${status === 'Pendiente' ? 'bg-gray-100 text-gray-500' : points > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{status}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-gloria-bg p-3 rounded border border-gray-100">
                                                            <strong className="text-gloria-primary uppercase text-xs tracking-widest font-sans font-bold">Puntos Obtenidos</strong>
                                                            <span className={`font-display font-bold text-xl ${points > 0 ? 'text-gloria-primary' : 'text-gray-400'}`}>{points > 0 ? `+${points}` : points}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-400 italic text-center text-sm font-serif">No participaste en este encuentro histórico.</p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-400 font-serif italic text-xl">"La historia aún no se ha escrito."</p>
                            </div>
                        )}
                    </section>
                )}
            </main>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
