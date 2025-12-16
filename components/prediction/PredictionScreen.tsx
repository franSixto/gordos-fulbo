'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiXCircle } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { getTeamFlagUrl } from '@/lib/utils';

interface PredictionScreenProps {
    matchId: string;
}

export const PredictionScreen: React.FC<PredictionScreenProps> = ({ matchId }) => {
    const { user, allMatches, addOrUpdatePrediction, showNotification, teams } = useApp();
    const router = useRouter();
    const [scoreA, setScoreA] = useState<string>('');
    const [scoreB, setScoreB] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [matchToPredict, setMatchToPredict] = useState<Match | null>(null);

    useEffect(() => {
        const match = allMatches.find(m => m.id === matchId);
        setMatchToPredict(match || null);
    }, [matchId, allMatches]);

    useEffect(() => {
        setScoreA('');
        setScoreB('');
        setError('');
    }, [matchToPredict]);

    const getTeamFlag = (teamName: string) => {
        const team = teams.find(t => t.name === teamName);
        return getTeamFlagUrl(teamName, team?.logoUrl);
    };

    if (!matchToPredict) {
        return (
            <div className="min-h-screen bg-gloria-bg flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-soft text-center max-w-md w-full border border-gray-100">
                    <h1 className="text-2xl font-display font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-500 font-serif italic mb-6">No se ha encontrado el partido para predecir.</p>
                    <button onClick={() => router.back()} className="flex items-center justify-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all w-full">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
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

        addOrUpdatePrediction(predictionDetails);
        showNotification(`Predicción guardada: ${matchToPredict.teamA} ${numScoreA} - ${numScoreB} ${matchToPredict.teamB}`, 'success');
        router.push('/dashboard'); // Or back to where they came from
    };

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="prediction-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="prediction-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">Realizar Predicción</h1>
                    <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                    <div className="bg-gloria-primary p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center gap-8 w-full">
                                <div className="flex flex-col items-center gap-2 flex-1">
                                    <TeamLogo 
                                        teamName={matchToPredict.teamA} 
                                        flagUrl={getTeamFlag(matchToPredict.teamA)} 
                                        width={60} 
                                        height={60} 
                                    />
                                    <span className="text-lg font-bold leading-tight">{matchToPredict.teamA}</span>
                                </div>
                                <span className="text-gloria-gold-300 text-2xl font-serif italic">vs</span>
                                <div className="flex flex-col items-center gap-2 flex-1">
                                    <TeamLogo 
                                        teamName={matchToPredict.teamB} 
                                        flagUrl={getTeamFlag(matchToPredict.teamB)} 
                                        width={60} 
                                        height={60} 
                                    />
                                    <span className="text-lg font-bold leading-tight">{matchToPredict.teamB}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1 mt-2">
                                {matchToPredict.tournamentName && <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-wider text-gloria-gold-100">{matchToPredict.tournamentName}</span>}
                                <div className="flex items-center gap-2 text-gloria-gold-100 text-sm font-serif">
                                    <span>{new Date(matchToPredict.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })} hs</span>
                                </div>
                                {matchToPredict.stage && <span className="text-xs text-white/80 font-bold uppercase tracking-wider">{matchToPredict.stage}</span>}
                                {matchToPredict.group && <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Grupo {matchToPredict.group}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-center items-center gap-8 mb-8">
                            <div className="flex flex-col items-center w-24">
                                <label htmlFor="scoreA" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest mb-3 truncate w-full text-center">{matchToPredict.teamA}</label>
                                <input
                                    type="number"
                                    id="scoreA"
                                    value={scoreA}
                                    onChange={(e) => setScoreA(e.target.value)}
                                    min="0"
                                    placeholder="0"
                                    className="w-24 h-24 text-center text-4xl font-display font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gloria-primary focus:ring-4 focus:ring-gloria-primary/10 transition-all text-gloria-accent"
                                    aria-label={`Goles para ${matchToPredict.teamA}`}
                                />
                            </div>
                            <span className="text-3xl font-display font-bold text-gray-300 mt-6">-</span>
                            <div className="flex flex-col items-center w-24">
                                <label htmlFor="scoreB" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest mb-3 truncate w-full text-center">{matchToPredict.teamB}</label>
                                <input
                                    type="number"
                                    id="scoreB"
                                    value={scoreB}
                                    onChange={(e) => setScoreB(e.target.value)}
                                    min="0"
                                    placeholder="0"
                                    className="w-24 h-24 text-center text-4xl font-display font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gloria-primary focus:ring-4 focus:ring-gloria-primary/10 transition-all text-gloria-accent"
                                    aria-label={`Goles para ${matchToPredict.teamB}`}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700">
                                <FiXCircle className="mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleInternalSavePrediction}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gloria-primary text-white font-serif font-bold text-lg rounded-lg shadow-lg hover:bg-gloria-gold-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <FiSave /> Guardar Predicción
                            </button>
                            <button onClick={() => router.back()} className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-600 font-serif font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                                <FiXCircle /> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
