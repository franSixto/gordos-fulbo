'use client';

import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiAward } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { getRanking } from '@/app/actions/data';

type RankingUser = {
    username: string | null;
    email: string;
    totalPoints: number;
    avatarUrl: string | null;
};

export const RankingScreen: React.FC = () => {
    const { user } = useApp();
    const router = useRouter();
    const [rankingData, setRankingData] = useState<RankingUser[]>([]);

    useEffect(() => {
        getRanking().then(setRankingData).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="ranking-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="ranking-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">
                        Olimpo de Campeones
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver al dashboard">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="ranking-table-heading">
                <h2 id="ranking-table-heading" className="sr-only">Ranking de Usuarios</h2>
                <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gloria-bg">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gloria-primary uppercase tracking-widest font-sans">Posición</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gloria-primary uppercase tracking-widest font-sans">Jugador</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gloria-primary uppercase tracking-widest font-sans">Puntos</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {rankingData.map((player, index) => {
                                    const isCurrentUser = player.email === user?.email;
                                    const rank = index + 1;
                                    let rankIcon = null;
                                    if (rank === 1) rankIcon = <FiAward className="text-yellow-500" size={20} />;
                                    if (rank === 2) rankIcon = <FiAward className="text-gray-400" size={20} />;
                                    if (rank === 3) rankIcon = <FiAward className="text-orange-400" size={20} />;

                                    return (
                                        <tr key={player.email} className={`transition-colors hover:bg-gray-50 ${isCurrentUser ? 'bg-gloria-primary/5' : ''}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-display font-bold text-lg ${rank <= 3 ? 'text-gloria-accent' : 'text-gray-500'}`}>#{rank}</span>
                                                    {rankIcon}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {player.avatarUrl ? (
                                                        <img className="h-10 w-10 rounded-full mr-3 border-2 border-white shadow-sm" src={player.avatarUrl} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gloria-secondary/20 flex items-center justify-center mr-3 text-gloria-secondary font-bold">
                                                            {(player.username || player.email)[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className={`text-sm font-bold ${isCurrentUser ? 'text-gloria-primary' : 'text-gloria-accent'}`}>
                                                            {player.username || player.email} {isCurrentUser && '(Tú)'}
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-serif italic">
                                                            {rank === 1 ? 'El Campeón' : 'Aspirante'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="font-display font-bold text-xl text-gloria-accent">{player.totalPoints}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {rankingData.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-gray-400 font-serif italic">Cargando la tabla de los inmortales...</p>
                        </div>
                    )}
                </div>
            </section>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
