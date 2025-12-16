'use client';

import React, { useState } from 'react';
import { Match, UserPrediction } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { getTeamFlagUrl } from '@/lib/utils';
import { FiSave } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';

interface MatchCardProps {
    match: Match;
    userPrediction?: UserPrediction;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, userPrediction }) => {
    const { addOrUpdatePrediction, showNotification, teams } = useApp();
    const [scoreA, setScoreA] = useState<string>(userPrediction?.predictedScoreA.toString() || '');
    const [scoreB, setScoreB] = useState<string>(userPrediction?.predictedScoreB.toString() || '');
    const [isSaving, setIsSaving] = useState(false);

    const getTeamFlag = (teamName: string) => {
        const team = teams.find(t => t.name === teamName);
        return getTeamFlagUrl(teamName, team?.logoUrl);
    };

    const handleSave = async () => {
        const numA = parseInt(scoreA);
        const numB = parseInt(scoreB);

        if (isNaN(numA) || isNaN(numB) || numA < 0 || numB < 0) {
            showNotification('Ingresa un marcador válido', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await addOrUpdatePrediction({
                matchId: match.id,
                teamA: match.teamA,
                teamB: match.teamB,
                predictedScoreA: numA,
                predictedScoreB: numB
            });
            showNotification(`Predicción guardada: ${match.teamA} ${numA} - ${numB} ${match.teamB}`, 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error al guardar', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <li className="bg-white rounded-xl shadow-soft p-4 sm:p-6 flex flex-col justify-between hover:shadow-gold transition-all duration-300 border border-gray-100 group">
            <div className="mb-4 text-center">
                 <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-gloria-primary bg-gloria-primary/10 rounded-full mb-2">{match.tournamentName || 'Torneo Oficial'}</span>
                    {match.stage && <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{match.stage}</span>}
                    {match.group && <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Grupo {match.group}</span>}
                    <p className="text-sm text-gray-500 font-serif italic">{new Date(match.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex flex-col items-center gap-2 flex-1">
                    <TeamLogo 
                        teamName={match.teamA} 
                        flagUrl={getTeamFlag(match.teamA)} 
                        width={45} 
                        height={45} 
                    />
                    <span className="text-sm font-bold text-center leading-tight h-8 flex items-center justify-center line-clamp-2">{match.teamA}</span>
                    <input 
                        type="number" 
                        value={scoreA}
                        onChange={(e) => setScoreA(e.target.value)}
                        className="w-16 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-gloria-primary focus:ring-2 focus:ring-gloria-primary/20 outline-none transition-all"
                        placeholder="-"
                        min="0"
                    />
                </div>

                <div className="flex flex-col items-center justify-center pt-8">
                    <span className="text-gloria-gold-300 font-serif italic text-xl">vs</span>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1">
                    <TeamLogo 
                        teamName={match.teamB} 
                        flagUrl={getTeamFlag(match.teamB)} 
                        width={45} 
                        height={45} 
                    />
                    <span className="text-sm font-bold text-center leading-tight h-8 flex items-center justify-center line-clamp-2">{match.teamB}</span>
                    <input 
                        type="number" 
                        value={scoreB}
                        onChange={(e) => setScoreB(e.target.value)}
                        className="w-16 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-gloria-primary focus:ring-2 focus:ring-gloria-primary/20 outline-none transition-all"
                        placeholder="-"
                        min="0"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gloria-primary text-white font-serif font-bold tracking-wide rounded hover:bg-gloria-gold-600 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Guardando...' : <><FiSave /> Guardar</>}
            </button>
        </li>
    );
};
