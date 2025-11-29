'use client';

import React from 'react';
import { FiArrowLeft, FiPlusCircle, FiLink, FiEye, FiShield } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export const LeaguesScreen: React.FC = () => {
    const { leagues } = useApp();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="leagues-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="leagues-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">
                        Ligas
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver al dashboard">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex gap-4 flex-wrap">
                <button className="flex items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all" onClick={() => router.push('/leagues/create')}>
                    <FiPlusCircle /> Crear Nueva Liga
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-gloria-primary border border-gloria-primary font-serif font-bold rounded shadow-sm hover:bg-gray-50 transition-all" onClick={() => router.push('/leagues/join')}>
                    <FiLink /> Unirse a una Liga
                </button>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="leagues-list-title-heading">
                <h2 id="leagues-list-title-heading" className="sr-only">Listado de Ligas</h2>
                {leagues.length > 0 ? (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {leagues.map(league => (
                            <li key={league.id} className="bg-white rounded-xl shadow-soft p-6 flex flex-col justify-between h-full border border-gray-100 hover:shadow-gold transition-all duration-300 group">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gloria-secondary/10 flex items-center justify-center text-gloria-secondary">
                                            <FiShield size={20} />
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-gloria-accent">{league.name}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-gray-600 font-sans text-sm">Participantes: <span className="font-bold text-gloria-accent">{league.participantUserIds.length}</span></p>
                                        <p className="text-gray-600 font-sans text-sm">Tipo: <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${league.type === 'Pública' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{league.type}</span></p>
                                        {league.description && <p className="text-gray-500 text-sm italic font-serif mt-2 line-clamp-2">"{league.description}"</p>}
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gloria-accent font-bold font-serif rounded hover:bg-gloria-primary hover:text-white transition-all"
                                        onClick={() => router.push(`/leagues/${league.id}`)}
                                    >
                                        <FiEye /> Ver Liga
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400 font-serif italic text-lg mb-4">"La gloria se comparte. No estás en ninguna liga."</p>
                        <p className="text-sm text-gray-500">Crea tu propia liga o únete a una existente para competir con amigos.</p>
                    </div>
                )}
            </section>

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
