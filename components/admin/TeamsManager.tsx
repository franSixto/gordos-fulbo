'use client';

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { Team } from '@/types';

export const TeamsManager: React.FC = () => {
    const { teams, addTeam, editTeam, removeTeam, showNotification } = useApp();
    
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamType, setNewTeamType] = useState<'Club' | 'Selección'>('Club');
    const [newTeamCountry, setNewTeamCountry] = useState('');
    const [newTeamLogoUrl, setNewTeamLogoUrl] = useState('');

    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editType, setEditType] = useState<'Club' | 'Selección'>('Club');
    const [editCountry, setEditCountry] = useState('');
    const [editLogoUrl, setEditLogoUrl] = useState('');

    const handleAddTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName) {
            showNotification('El nombre del equipo es obligatorio.', 'error');
            return;
        }
        await addTeam({
            name: newTeamName,
            type: newTeamType,
            country: newTeamCountry,
            logoUrl: newTeamLogoUrl
        });
        setNewTeamName('');
        setNewTeamType('Club');
        setNewTeamCountry('');
        setNewTeamLogoUrl('');
    };

    const startEditing = (team: Team) => {
        setEditingTeamId(team.id);
        setEditName(team.name);
        setEditType(team.type);
        setEditCountry(team.country || '');
        setEditLogoUrl(team.logoUrl || '');
    };

    const cancelEditing = () => {
        setEditingTeamId(null);
        setEditName('');
        setEditType('Club');
        setEditCountry('');
        setEditLogoUrl('');
    };

    const saveEdit = async () => {
        if (!editingTeamId || !editName) return;
        await editTeam(editingTeamId, {
            name: editName,
            type: editType,
            country: editCountry,
            logoUrl: editLogoUrl
        });
        setEditingTeamId(null);
    };

    return (
        <div className="space-y-8">
            <section className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
                <h2 className="text-xl font-display font-bold text-gloria-accent mb-6">Agregar Nuevo Equipo</h2>
                <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="Nombre del Equipo"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                    />
                    <select
                        value={newTeamType}
                        onChange={(e) => setNewTeamType(e.target.value as 'Club' | 'Selección')}
                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                    >
                        <option value="Club">Club</option>
                        <option value="Selección">Selección</option>
                    </select>
                    <input
                        type="text"
                        placeholder="País (Opcional)"
                        value={newTeamCountry}
                        onChange={(e) => setNewTeamCountry(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                    />
                    <input
                        type="text"
                        placeholder="URL del Logo (Opcional)"
                        value={newTeamLogoUrl}
                        onChange={(e) => setNewTeamLogoUrl(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary transition-all"
                    />
                    <button type="submit" className="md:col-span-2 flex justify-center items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                        <FiPlus /> Agregar Equipo
                    </button>
                </form>
            </section>

            <section className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-display font-bold text-gloria-accent">Equipos Existentes</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                    {teams.map(team => (
                        <li key={team.id} className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition-colors">
                            {editingTeamId === team.id ? (
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded bg-white"
                                        placeholder="Nombre"
                                    />
                                    <select
                                        value={editType}
                                        onChange={(e) => setEditType(e.target.value as 'Club' | 'Selección')}
                                        className="px-3 py-2 border border-gray-200 rounded bg-white"
                                    >
                                        <option value="Club">Club</option>
                                        <option value="Selección">Selección</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={editCountry}
                                        onChange={(e) => setEditCountry(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded bg-white"
                                        placeholder="País"
                                    />
                                    <input
                                        type="text"
                                        value={editLogoUrl}
                                        onChange={(e) => setEditLogoUrl(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded bg-white"
                                        placeholder="URL Logo"
                                    />
                                    <div className="sm:col-span-2 flex gap-2 justify-end">
                                        <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                                            <FiSave /> Guardar
                                        </button>
                                        <button onClick={cancelEditing} className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">
                                            <FiX /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 flex-1">
                                        {team.logoUrl ? (
                                            <img src={team.logoUrl} alt={team.name} className="w-10 h-10 object-contain" />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
                                                {team.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-display font-bold text-gloria-accent text-lg">{team.name}</p>
                                            <p className="text-sm text-gray-500 font-serif italic">
                                                {team.type} {team.country && `• ${team.country}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => startEditing(team)} className="p-2 text-gloria-secondary hover:bg-gloria-secondary/10 rounded transition-colors" title="Editar">
                                            <FiEdit2 />
                                        </button>
                                        <button onClick={() => removeTeam(team.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                    {teams.length === 0 && (
                        <li className="p-12 text-center text-gray-400 font-serif italic">No hay equipos registrados.</li>
                    )}
                </ul>
            </section>
        </div>
    );
};
