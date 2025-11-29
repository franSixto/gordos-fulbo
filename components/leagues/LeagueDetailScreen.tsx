'use client';

import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { League } from '@/types';

interface LeagueDetailScreenProps {
    leagueId: string;
}

export const LeagueDetailScreen: React.FC<LeagueDetailScreenProps> = ({ leagueId }) => {
    const { user, leagues, allMatches, userPredictions, calculatePointsAndStatus } = useApp();
    const router = useRouter();
    const [league, setLeague] = useState<League | null>(null);

    useEffect(() => {
        const foundLeague = leagues.find(l => l.id === leagueId);
        setLeague(foundLeague || null);
    }, [leagueId, leagues]);

    if (!league) {
        return (
            <div className="min-h-screen bg-gloria-bg flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-soft text-center max-w-md w-full border border-gray-100">
                    <h1 className="text-2xl font-display font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-500 font-serif italic mb-6">No se ha encontrado la liga solicitada.</p>
                    <button onClick={() => router.push('/leagues')} className="flex items-center justify-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all w-full">
                        <FiArrowLeft /> Volver a Mis Ligas
                    </button>
                </div>
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
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="league-detail-main-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="league-detail-main-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">{league.name}</h1>
                    <button onClick={() => router.push('/leagues')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver a Mis Ligas">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <section className="bg-white rounded-xl shadow-soft p-8 border border-gray-100" aria-labelledby="league-info-heading">
                    <h2 id="league-info-heading" className="sr-only">Información de la Liga</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="flex items-center gap-2">
                                <strong className="text-xs font-bold text-gloria-primary uppercase tracking-widest">Tipo:</strong>
                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${league.type === 'Pública' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{league.type}</span>
                            </p>
                            {league.description && (
                                <p className="flex flex-col gap-1">
                                    <strong className="text-xs font-bold text-gloria-primary uppercase tracking-widest">Descripción:</strong>
                                    <span className="text-gray-600 font-serif italic">{league.description}</span>
                                </p>
                            )}
                        </div>
                        <div className="space-y-4">
                            <p className="flex flex-col gap-1">
                                <strong className="text-xs font-bold text-gloria-primary uppercase tracking-widest">Creada por:</strong>
                                <span className="text-gray-600 font-serif">{league.createdByUserId}</span>
                            </p>
                            <p className="flex flex-col gap-1">
                                <strong className="text-xs font-bold text-gloria-primary uppercase tracking-widest">Participantes:</strong>
                                <span className="text-gray-600 font-display font-bold text-xl">{league.participantUserIds.length}</span>
                            </p>
                            <p className="flex flex-col gap-1">
                                <strong className="text-xs font-bold text-gloria-primary uppercase tracking-widest">ID de Liga (Código):</strong>
                                <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gloria-accent border border-gray-200">{league.id}</code>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100" aria-labelledby="league-participants-heading">
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 id="league-participants-heading" className="text-xl font-display font-bold text-gloria-accent">Ranking de Participantes en Liga</h2>
                    </div>
                    {rankedLeagueParticipants.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gloria-primary uppercase tracking-widest">#</th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gloria-primary uppercase tracking-widest">Usuario (ID)</th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gloria-primary uppercase tracking-widest">Puntos en Liga</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {rankedLeagueParticipants.map(p => (
                                        <tr key={p.participantId} className={`hover:bg-gray-50 transition-colors ${p.participantId === currentUserAppIdentifier ? 'bg-gloria-primary/5' : ''}`}>
                                            <td className="px-8 py-4 whitespace-nowrap text-sm font-display font-bold text-gloria-secondary">{p.rank}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600 font-serif">
                                                {p.displayName} {p.participantId === currentUserAppIdentifier ? <span className="text-gloria-primary font-bold italic">(Tú)</span> : ''}
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-sm font-display font-bold text-gloria-accent">{p.leaguePoints}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-400 font-serif italic">
                            <p>No hay participantes o datos de puntos para mostrar en esta liga.</p>
                        </div>
                    )}
                </section>
            </div>

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
