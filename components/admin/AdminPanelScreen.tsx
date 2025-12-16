'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiCheckSquare, FiUserCheck, FiUserX, FiSettings, FiSearch, FiX } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Match, Tournament } from '@/types';
import { createMatch, createTournament, setMatchResult as setMatchResultAction, getUsers, toggleAdmin } from '@/app/actions/admin';
import { User as PrismaUser } from '@prisma/client';
import { TeamsManager } from './TeamsManager';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

type AdminTab = 'matches' | 'tournaments' | 'users' | 'teams';

export const AdminPanelScreen: React.FC = () => {
    const { user, allMatches, tournaments, teams, showNotification, deleteMatch, deleteTournament, updateMatch } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>('matches');
    const [users, setUsers] = useState<PrismaUser[]>([]);

    // Modals State
    const [isCreateMatchModalOpen, setIsCreateMatchModalOpen] = useState(false);
    const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] = useState(false);

    // Search State
    const [matchSearchQuery, setMatchSearchQuery] = useState('');
    const [tournamentSearchQuery, setTournamentSearchQuery] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string, type: 'match' | 'tournament' } | null>(null);

    // Edit Match Details State
    const [isEditMatchModalOpen, setIsEditMatchModalOpen] = useState(false);
    const [matchToEdit, setMatchToEdit] = useState<Match | null>(null);
    const [editMatchTeamA, setEditMatchTeamA] = useState('');
    const [editMatchTeamB, setEditMatchTeamB] = useState('');
    const [editMatchDate, setEditMatchDate] = useState('');
    const [editMatchTournamentId, setEditMatchTournamentId] = useState('');
    const [editMatchStage, setEditMatchStage] = useState('');
    const [editMatchGroup, setEditMatchGroup] = useState('');

    // Match Form State
    const [newMatchTeamA, setNewMatchTeamA] = useState('');
    const [newMatchTeamB, setNewMatchTeamB] = useState('');
    const [newMatchDate, setNewMatchDate] = useState('');
    const [newMatchTournamentId, setNewMatchTournamentId] = useState('');
    const [newMatchStage, setNewMatchStage] = useState('');
    const [newMatchGroup, setNewMatchGroup] = useState('');

    // Tournament Form State
    const [newTournamentName, setNewTournamentName] = useState('');
    const [newTournamentYear, setNewTournamentYear] = useState('');
    const [newTournamentTeamType, setNewTournamentTeamType] = useState('Club'); // Default to Club

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

    const openEditMatchModal = (match: Match) => {
        setMatchToEdit(match);
        setEditMatchTeamA(match.teamA);
        setEditMatchTeamB(match.teamB);
        // Format date for datetime-local input: YYYY-MM-DDThh:mm
        const date = new Date(match.date);
        // Adjust for timezone offset to show correct local time in input
        const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setEditMatchDate(dateString);
        setEditMatchTournamentId(match.tournamentId || '');
        setEditMatchStage(match.stage || '');
        setEditMatchGroup(match.group || '');
        setIsEditMatchModalOpen(true);
    };

    const handleUpdateMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!matchToEdit || !editMatchTeamA || !editMatchTeamB || !editMatchDate || !editMatchTournamentId) {
            showNotification('Por favor completa todos los campos obligatorios.', 'error');
            return;
        }

        try {
            const selectedTournament = tournaments.find(t => t.id === editMatchTournamentId);
            await updateMatch({
                ...matchToEdit,
                teamA: editMatchTeamA,
                teamB: editMatchTeamB,
                date: new Date(editMatchDate).toISOString(),
                tournamentId: editMatchTournamentId,
                tournamentName: selectedTournament?.name,
                stage: editMatchStage || undefined,
                group: editMatchGroup || undefined
            });
            setIsEditMatchModalOpen(false);
            setMatchToEdit(null);
            // showNotification is handled in AppContext
            router.refresh();
        } catch (error) {
            console.error(error);
            showNotification('Error al actualizar el partido', 'error');
        }
    };

    const handleAddMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMatchTeamA || !newMatchTeamB || !newMatchDate || !newMatchTournamentId) {
            showNotification('Por favor completa todos los campos del partido, incluyendo el torneo.', 'error');
            return;
        }

        try {
            await createMatch(
                newMatchTournamentId,
                newMatchTeamA,
                newMatchTeamB,
                new Date(newMatchDate),
                newMatchStage || undefined,
                newMatchGroup || undefined
            );

            setNewMatchTeamA('');
            setNewMatchTeamB('');
            setNewMatchDate('');
            // Keep tournament, stage and group for easier multiple entry
            setIsCreateMatchModalOpen(false);
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
            await createTournament(newTournamentName, parseInt(newTournamentYear), newTournamentTeamType);
            setNewTournamentName('');
            setNewTournamentYear('');
            setNewTournamentTeamType('Club');
            setIsCreateTournamentModalOpen(false);
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

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'match') {
            deleteMatch(itemToDelete.id);
        } else if (itemToDelete.type === 'tournament') {
            deleteTournament(itemToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleDeleteClick = (id: string, name: string, type: 'match' | 'tournament') => {
        setItemToDelete({ id, name, type });
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="admin-title">
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title={`Eliminar ${itemToDelete?.type === 'match' ? 'Partido' : 'Torneo'}`}
                message={`¿Estás seguro que deseas eliminar ${itemToDelete?.type === 'match' ? 'el partido' : 'el torneo'} "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                confirmButtonText="Eliminar"
                confirmButtonVariant="danger"
            />

            {/* Create Match Modal */}
            {isCreateMatchModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-display font-bold text-gloria-accent">Agregar Nuevo Partido</h2>
                            <button onClick={() => setIsCreateMatchModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="p-6">
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
                                            {teams
                                                .filter(t => {
                                                    if (!newMatchTournamentId) return true;
                                                    const tournament = tournaments.find(tour => tour.id === newMatchTournamentId);
                                                    if (!tournament?.teamType) return true;
                                                    return t.type === tournament.teamType;
                                                })
                                                .map(t => (
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
                                            {teams
                                                .filter(t => {
                                                    if (!newMatchTournamentId) return true;
                                                    const tournament = tournaments.find(tour => tour.id === newMatchTournamentId);
                                                    if (!tournament?.teamType) return true;
                                                    return t.type === tournament.teamType;
                                                })
                                                .map(t => (
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
                                        <option value="">Seleccionar Torneo</option>
                                        {tournaments.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.year})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Instancia / Fase (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Fase de Grupos, Octavos, Fecha 1"
                                        value={newMatchStage}
                                        onChange={(e) => setNewMatchStage(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Grupo / Zona (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: A, B, Zona 1"
                                        value={newMatchGroup}
                                        onChange={(e) => setNewMatchGroup(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateMatchModalOpen(false)}
                                        className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="flex justify-center items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                                        <FiPlus /> Agregar Partido
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Tournament Modal */}
            {isCreateTournamentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-display font-bold text-gloria-accent">Crear Nuevo Torneo</h2>
                            <button onClick={() => setIsCreateTournamentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAddTournament} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Nombre del Torneo</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Copa Libertadores"
                                        value={newTournamentName}
                                        onChange={(e) => setNewTournamentName(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Año</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 2025"
                                        value={newTournamentYear}
                                        onChange={(e) => setNewTournamentYear(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Tipo de Equipos</label>
                                    <select
                                        value={newTournamentTeamType}
                                        onChange={(e) => setNewTournamentTeamType(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    >
                                        <option value="Club">Club</option>
                                        <option value="Selección">Selección</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateTournamentModalOpen(false)}
                                        className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                                        <FiPlus /> Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Match Modal */}
            {isEditMatchModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-display font-bold text-gloria-accent">Editar Partido</h2>
                            <button onClick={() => setIsEditMatchModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FiUserX className="transform rotate-45" size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleUpdateMatch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Equipo Local</label>
                                    {teams.length > 0 ? (
                                        <select
                                            value={editMatchTeamA}
                                            onChange={(e) => setEditMatchTeamA(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        >
                                            <option value="">Seleccionar Equipo</option>
                                            {teams
                                                .filter(t => {
                                                    if (!editMatchTournamentId) return true;
                                                    const tournament = tournaments.find(tour => tour.id === editMatchTournamentId);
                                                    if (!tournament?.teamType) return true;
                                                    return t.type === tournament.teamType;
                                                })
                                                .map(t => (
                                                    <option key={t.id} value={t.name}>{t.name}</option>
                                                ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={editMatchTeamA}
                                            onChange={(e) => setEditMatchTeamA(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Equipo Visitante</label>
                                    {teams.length > 0 ? (
                                        <select
                                            value={editMatchTeamB}
                                            onChange={(e) => setEditMatchTeamB(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        >
                                            <option value="">Seleccionar Equipo</option>
                                            {teams
                                                .filter(t => {
                                                    if (!editMatchTournamentId) return true;
                                                    const tournament = tournaments.find(tour => tour.id === editMatchTournamentId);
                                                    if (!tournament?.teamType) return true;
                                                    return t.type === tournament.teamType;
                                                })
                                                .map(t => (
                                                    <option key={t.id} value={t.name}>{t.name}</option>
                                                ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={editMatchTeamB}
                                            onChange={(e) => setEditMatchTeamB(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        value={editMatchDate}
                                        onChange={(e) => setEditMatchDate(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Torneo</label>
                                    <select
                                        value={editMatchTournamentId}
                                        onChange={(e) => setEditMatchTournamentId(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    >
                                        <option value="">Seleccionar Torneo</option>
                                        {tournaments.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.year})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Instancia / Fase</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Fase de Grupos"
                                        value={editMatchStage}
                                        onChange={(e) => setEditMatchStage(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600">Grupo / Zona</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: A"
                                        value={editMatchGroup}
                                        onChange={(e) => setEditMatchGroup(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditMatchModalOpen(false)}
                                        className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar partido..." 
                                    value={matchSearchQuery}
                                    onChange={(e) => setMatchSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                />
                            </div>
                            <button 
                                onClick={() => setIsCreateMatchModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all w-full md:w-auto justify-center"
                            >
                                <FiPlus /> Nuevo Partido
                            </button>
                        </div>

                        <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-display font-bold text-gloria-accent">Lista de Partidos</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {allMatches
                                    .filter(match => 
                                        match.teamA.toLowerCase().includes(matchSearchQuery.toLowerCase()) ||
                                        match.teamB.toLowerCase().includes(matchSearchQuery.toLowerCase()) ||
                                        (match.tournamentName && match.tournamentName.toLowerCase().includes(matchSearchQuery.toLowerCase()))
                                    )
                                    .map(match => (
                                    <li key={match.id} className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <p className="font-display font-bold text-gloria-accent text-lg">{match.teamA} <span className="text-gray-400 font-serif italic text-sm mx-1">vs</span> {match.teamB}</p>
                                            <p className="text-sm text-gray-500 font-serif italic mt-1">
                                                {new Date(match.date).toLocaleString()} - <span className="text-gloria-primary font-bold not-italic">{match.tournamentName || 'Amistoso'}</span>
                                                {match.stage && <span className="ml-2 text-gray-400">• {match.stage}</span>}
                                                {match.group && <span className="ml-2 text-gray-400">• Grupo {match.group}</span>}
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
                                                <>
                                                    <button onClick={() => openEditMatchModal(match)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Editar Detalles">
                                                        <FiSettings />
                                                    </button>
                                                    <button onClick={() => startEditingResult(match)} className="p-2 text-gloria-secondary hover:bg-gloria-secondary/10 rounded transition-colors" title="Editar Resultado">
                                                        <FiEdit2 />
                                                    </button>
                                                </>
                                            )}

                                            <button onClick={() => handleDeleteClick(match.id, `${match.teamA} vs ${match.teamB}`, 'match')} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar Partido">
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
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar torneo..." 
                                    value={tournamentSearchQuery}
                                    onChange={(e) => setTournamentSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                />
                            </div>
                            <button 
                                onClick={() => setIsCreateTournamentModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all w-full md:w-auto justify-center"
                            >
                                <FiPlus /> Nuevo Torneo
                            </button>
                        </div>

                        <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-display font-bold text-gloria-accent">Torneos Existentes</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {tournaments
                                    .filter(t => t.name.toLowerCase().includes(tournamentSearchQuery.toLowerCase()))
                                    .map(tournament => (
                                    <li key={tournament.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="font-display font-bold text-gloria-accent text-lg">{tournament.name}</p>
                                            <p className="text-sm text-gray-500 font-serif italic">Año: {tournament.year}</p>
                                        </div>
                                        <button onClick={() => handleDeleteClick(tournament.id, tournament.name, 'tournament')} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar Torneo">
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
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar usuario..." 
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                                />
                            </div>
                        </div>

                        <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-display font-bold text-gloria-accent">Gestión de Usuarios</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {users
                                    .filter(u => 
                                        (u.username && u.username.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
                                        (u.email && u.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
                                    )
                                    .map(u => (
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
