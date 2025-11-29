'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export const CreateLeagueScreen: React.FC = () => {
    const { createLeague, showNotification } = useApp();
    const router = useRouter();
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

        createLeague({ name: leagueName, type: leagueType, description });
        showNotification(`Liga "${leagueName}" creada con éxito.`, 'success');
        router.push('/leagues');
    };

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="create-league-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="create-league-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">Crear Nueva Liga</h1>
                    <button onClick={() => router.push('/leagues')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver a Mis Ligas">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-soft p-8 border border-gray-100 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="league-name" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest">Nombre de la Liga</label>
                        <input
                            type="text"
                            id="league-name"
                            value={leagueName}
                            onChange={(e) => setLeagueName(e.target.value)}
                            required
                            aria-required="true"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="league-type" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest">Tipo de Liga</label>
                        <select
                            id="league-type"
                            value={leagueType}
                            onChange={(e) => setLeagueType(e.target.value as 'Pública' | 'Privada')}
                            required
                            aria-required="true"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                        >
                            <option value="Privada">Privada</option>
                            <option value="Pública">Pública</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="league-description" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest">Descripción (Opcional)</label>
                        <textarea
                            id="league-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                        />
                    </div>
                    {error && <p id="error-message-content-create-league" className="text-sm text-red-600 font-serif italic" role="alert">{error}</p>}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                        <button type="button" onClick={() => router.push('/leagues')} className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border border-gray-300 font-serif font-bold rounded hover:bg-gray-50 transition-all">
                            <FiXCircle /> Cancelar
                        </button>
                        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                            <FiCheckCircle /> Crear Liga
                        </button>
                    </div>
                </form>
            </div>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
