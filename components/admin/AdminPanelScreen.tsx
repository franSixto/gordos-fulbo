'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiCheckSquare, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Match, Tournament } from '@/types';
import { createMatch, createTournament, setMatchResult as setMatchResultAction, getUsers, toggleAdmin } from '@/app/actions/admin';
import { User as PrismaUser } from '@prisma/client';
import { TeamsManager } from './TeamsManager';

type AdminTab = 'matches' | 'tournaments' | 'users' | 'teams';

export const AdminPanelScreen: React.FC = () => {
    const { user, allMatches, tournaments, teams, showNotification, deleteMatch, deleteTournament } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>('matches');
    const [users, setUsers] = useState<PrismaUser[]>([]);

    // Match Form State
    const [newMatchTeamA, setNewMatchTeamA] = useState('');
    const [newMatchTeamB, setNewMatchTeamB] = useState('');
    const [newMatchDate, setNewMatchDate] = useState('');
    const [newMatchTournamentId, setNewMatchTournamentId] = useState('');

    // Tournament Form State
    const [newTournamentName, setNewTournamentName] = useState('');
    const [newTournamentYear, setNewTournamentYear] = useState('');

    // Edit States
    const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
    const [editMatchScoreA, setEditMatchScoreA] = useState<string>('');
    const [editMatchScoreB, setEditMatchScoreB] = useState<string>('');

    useEffect(() => {
        if (activeTab === 'users') {
            getUsers().then(setUsers).catch(err => {
                console.error(err);
                showNotification('Error al cargar usuarios', 'error');
            });
        }
    }, [activeTab, showNotification]);

    if (!user?.isAdmin) {
        return (
            <div className="min-h-screen bg-gloria-bg flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-soft text-center max-w-md w-full border border-gray-100">
                    <h1 className="text-2xl font-display font-bold text-red-600 mb-4">Acceso Denegado</h1>
                    <p className="text-gray-500 font-serif italic mb-6">No tienes permisos de administrador para ver esta página.</p>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center justify-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all w-full">
                        <FiArrowLeft /> Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleAddMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMatchTeamA || !newMatchTeamB || !newMatchDate) {
            showNotification('Por favor completa todos los campos del partido.', 'error');
            return;
        }

        try {
            await createMatch(
                newMatchTournamentId || 'friendly', // Handle friendly or require tournament
                newMatchTeamA,
                newMatchTeamB,
                new Date(newMatchDate)
            );

            setNewMatchTeamA('');
            setNewMatchTeamB('');
            setNewMatchDate('');
            showNotification('Partido agregado con éxito. Recarga para ver cambios.', 'success');
            router.refresh();
        } catch (error) {
            console.error(error);
            showNotification('Error al crear partido', 'error');
        }
    };

    const handleAddTournament = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTournamentName || !newTournamentYear) {
            showNotification('Nombre y año del torneo son obligatorios.', 'error');
            return;
        }
        try {
            await createTournament(newTournamentName, parseInt(newTournamentYear));
            setNewTournamentName('');
            setNewTournamentYear('');
            showNotification('Torneo creado con éxito. Recarga para ver cambios.', 'success');
            router.refresh();
        } catch (error) {
            console.error(error);
            showNotification('Error al crear torneo', 'error');
        }
    };

    const startEditingResult = (match: Match) => {
        setEditingMatchId(match.id);
        setEditMatchScoreA(match.actualScoreA?.toString() || '');
        setEditMatchScoreB(match.actualScoreB?.toString() || '');
    };

    const saveMatchResult = async (matchId: string) => {
        const scoreA = parseInt(editMatchScoreA);
        const scoreB = parseInt(editMatchScoreB);

        if (isNaN(scoreA) || isNaN(scoreB)) {
            showNotification('Los marcadores deben ser números válidos.', 'error');
            return;
        }

        try {
            await setMatchResultAction(matchId, scoreA, scoreB);
            setEditingMatchId(null);
            showNotification('Resultado actualizado. Recarga para ver cambios.', 'success');
            router.refresh();
        } catch (error) {
            console.error(error);
            showNotification('Error al actualizar resultado', 'error');
        }
    };

    const handleToggleAdmin = async (userId: string) => {
        try {
            await toggleAdmin(userId);
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            showNotification('Permisos de administrador actualizados.', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error al cambiar permisos', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="admin-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="admin-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">Panel de Administración</h1>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver al dashboard">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex border-b border-gray-200" role="tablist">
                    <button
                        role="tab"
                        aria-selected={activeTab === 'matches'}
                        onClick={() => setActiveTab('matches')}
                        className={`py-4 px-6 font-display font-bold text-sm uppercase tracking-widest focus:outline-none transition-colors ${activeTab === 'matches' ? 'border-b-2 border-gloria-primary text-gloria-primary' : 'text-gray-400 hover:text-gloria-accent'}`}
                    >
                        Gestionar Partidos
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'tournaments'}
                        onClick={() => setActiveTab('tournaments')}
                        className={`py-4 px-6 font-display font-bold text-sm uppercase tracking-widest focus:outline-none transition-colors ${activeTab === 'tournaments' ? 'border-b-2 border-gloria-primary text-gloria-primary' : 'text-gray-400 hover:text-gloria-accent'}`}
                    >
                        Gestionar Torneos
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'teams'}
                        onClick={() => setActiveTab('teams')}
                        className={`py-4 px-6 font-display font-bold text-sm uppercase tracking-widest focus:outline-none transition-colors ${activeTab === 'teams' ? 'border-b-2 border-gloria-primary text-gloria-primary' : 'text-gray-400 hover:text-gloria-accent'}`}
                    >
                        Gestionar Equipos
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                        className={`py-4 px-6 font-display font-bold text-sm uppercase tracking-widest focus:outline-none transition-colors ${activeTab === 'users' ? 'border-b-2 border-gloria-primary text-gloria-primary' : 'text-gray-400 hover:text-gloria-accent'}`}
                    >
                        Gestionar Usuarios
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {activeTab === 'matches' && (
                    <div className="space-y-8">
                        <section className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
                            <h2 className="text-xl font-display font-bold text-gloria-accent mb-6">Agregar Nuevo Partido</h2>
                            <form onSubmit={handleAddMatch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Equipo Local</label>
                                    {teams.length > 0 ? (
                                        <select
                                            value={newMatchTeamA}
                                            onChange={(e) => setNewMatchTeamA(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        >
                                            <option value="">Seleccionar Equipo</option>
                                            {teams.map(t => (
                                                <option key={t.id} value={t.name}>{t.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder="Nombre Equipo A"
                                            value={newMatchTeamA}
                                            onChange={(e) => setNewMatchTeamA(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Equipo Visitante</label>
                                    {teams.length > 0 ? (
                                        <select
                                            value={newMatchTeamB}
                                            onChange={(e) => setNewMatchTeamB(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        >
                                            <option value="">Seleccionar Equipo</option>
                                            {teams.map(t => (
                                                <option key={t.id} value={t.name}>{t.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder="Nombre Equipo B"
                                            value={newMatchTeamB}
                                            onChange={(e) => setNewMatchTeamB(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        value={newMatchDate}
                                        onChange={(e) => setNewMatchDate(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Torneo</label>
                                    <select
                                        value={newMatchTournamentId}
                                        onChange={(e) => setNewMatchTournamentId(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    >
                                        <option value="">Seleccionar Torneo (Opcional)</option>
                                        {tournaments.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.year})</option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="md:col-span-2 flex justify-center items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                                    <FiPlus /> Agregar Partido
                                </button>
                            </form>
                        </section>

                        <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-display font-bold text-gloria-accent">Lista de Partidos</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {allMatches.map(match => (
                                    <li key={match.id} className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <p className="font-display font-bold text-gloria-accent text-lg">{match.teamA} <span className="text-gray-400 font-serif italic text-sm mx-1">vs</span> {match.teamB}</p>
                                            <p className="text-sm text-gray-500 font-serif italic mt-1">
                                                {new Date(match.date).toLocaleString()} - <span className="text-gloria-primary font-bold not-italic">{match.tournamentName || 'Amistoso'}</span>
                                            </p>
                                            {match.isPlayed && (
                                                <p className="text-sm font-bold text-green-600 mt-2 bg-green-50 inline-block px-2 py-1 rounded border border-green-100">
                                                    Resultado: {match.actualScoreA} - {match.actualScoreB}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {editingMatchId === match.id ? (
                                                <div className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg shadow-sm">
                                                    <input
                                                        type="number"
                                                        value={editMatchScoreA}
                                                        onChange={(e) => setEditMatchScoreA(e.target.value)}
                                                        className="w-12 px-2 py-1 text-center border border-gray-200 rounded bg-gray-50 font-bold text-gloria-accent"
                                                        placeholder="A"
                                                    />
                                                    <span className="text-gray-400 font-bold">-</span>
                                                    <input
                                                        type="number"
                                                        value={editMatchScoreB}
                                                        onChange={(e) => setEditMatchScoreB(e.target.value)}
                                                        className="w-12 px-2 py-1 text-center border border-gray-200 rounded bg-gray-50 font-bold text-gloria-accent"
                                                        placeholder="B"
                                                    />
                                                    <button onClick={() => saveMatchResult(match.id)} className="text-green-600 hover:text-green-800 p-1" title="Guardar Resultado">
                                                        <FiSave size={20} />
                                                    </button>
                                                    <button onClick={() => setEditingMatchId(null)} className="text-gray-400 hover:text-gray-600 p-1" title="Cancelar">
                                                        <FiCheckSquare size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => startEditingResult(match)} className="p-2 text-gloria-secondary hover:bg-gloria-secondary/10 rounded transition-colors" title="Editar Resultado">
                                                    <FiEdit2 />
                                                </button>
                                            )}

                                            <button onClick={() => deleteMatch(match.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar Partido">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'tournaments' && (
                    <div className="space-y-8">
                        <section className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
                            <h2 className="text-xl font-display font-bold text-gloria-accent mb-6">Crear Nuevo Torneo</h2>
                            <form onSubmit={handleAddTournament} className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre del Torneo"
                                    value={newTournamentName}
                                    onChange={(e) => setNewTournamentName(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                />
                                <input
                                    type="number"
                                    placeholder="Año"
                                    value={newTournamentYear}
                                    onChange={(e) => setNewTournamentYear(e.target.value)}
                                    className="w-32 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                />
                                <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                                    <FiPlus /> Crear
                                </button>
                            </form>
                        </section>

                        <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-display font-bold text-gloria-accent">Torneos Existentes</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {tournaments.map(tournament => (
                                    <li key={tournament.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="font-display font-bold text-gloria-accent text-lg">{tournament.name}</p>
                                            <p className="text-sm text-gray-500 font-serif italic">Año: {tournament.year}</p>
                                        </div>
                                        <button onClick={() => deleteTournament(tournament.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar Torneo">
                                            <FiTrash2 />
                                        </button>
                                    </li>
                                ))}
                                {tournaments.length === 0 && (
                                    <li className="p-12 text-center text-gray-400 font-serif italic">No hay torneos creados.</li>
                                )}
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'teams' && <TeamsManager />}

                {activeTab === 'users' && (
                    <div className="space-y-8">
                        <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-display font-bold text-gloria-accent">Gestión de Usuarios</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {users.map(u => (
                                    <li key={u.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {u.avatarUrl && <img src={u.avatarUrl} alt={u.username || 'User'} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />}
                                            <div>
                                                <p className="font-display font-bold text-gloria-accent">{u.username || u.email}</p>
                                                <p className="text-sm text-gray-500 font-serif italic">{u.email}</p>
                                                {u.isAdmin && <span className="text-xs bg-gloria-primary/10 text-gloria-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 inline-block">Admin</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleAdmin(u.id)}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all ${u.isAdmin ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                                            title={u.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                                        >
                                            {u.isAdmin ? <><FiUserX /> Quitar Admin</> : <><FiUserCheck /> Hacer Admin</>}
                                        </button>
                                    </li>
                                ))}
                                {users.length === 0 && (
                                    <li className="p-12 text-center text-gray-400 font-serif italic">No hay usuarios registrados.</li>
                                )}
                            </ul>
                        </section>
                    </div>
                )}
            </main>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
