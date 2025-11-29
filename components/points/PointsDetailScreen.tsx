'use client';

import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export const PointsDetailScreen: React.FC = () => {
    const { user, userPredictions, allMatches, calculatePointsAndStatus } = useApp();
    const router = useRouter();

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
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="points-detail-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="points-detail-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">Detalle de Mis Puntos</h1>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver al dashboard">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-soft p-8 border border-gray-100">
                <h2 className="sr-only">Desglose de Puntos</h2>
                {dynamicPointsBreakdown.length > 0 ? (
                    <ul className="space-y-6">
                        {dynamicPointsBreakdown.map(item => (
                            <li key={item.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-display font-bold text-gloria-accent text-lg">{item.source}</span>
                                    <span className={`font-display font-bold text-xl ${item.points > 0 ? 'text-green-600' : item.points < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                        {item.points > 0 ? `+${item.points}` : item.points} pts
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-serif italic">{item.detail}</p>
                                <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">{new Date(item.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400 font-serif italic py-12">No has ganado puntos por predicciones todavía.</p>
                )}
                <div className="mt-12 pt-8 border-t border-gray-100 text-right">
                    <h3 className="text-2xl font-display font-bold text-gloria-accent">Total de Puntos Acumulados: <span className="text-gloria-primary">{user?.totalPoints ?? 0}</span></h3>
                </div>
            </section>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
