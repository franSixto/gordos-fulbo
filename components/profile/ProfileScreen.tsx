'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiSave, FiActivity, FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export const ProfileScreen: React.FC = () => {
    const { user, updateUserProfile, showNotification, userPredictions, allMatches, calculatePointsAndStatus } = useApp();
    const router = useRouter();
    const [username, setUsername] = useState(user?.username || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://via.placeholder.com/150?text=User');
    const [favoriteTeam, setFavoriteTeam] = useState(user?.favoriteTeam || '');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setAvatarUrl(user.avatarUrl || 'https://via.placeholder.com/150?text=User');
            setFavoriteTeam(user.favoriteTeam || '');
        }
    }, [user]);


    const handleEditToggle = () => {
        if (isEditing) {
            updateUserProfile({
                username: username.trim(),
                avatarUrl: avatarUrl.trim(),
                favoriteTeam: favoriteTeam.trim()
            });
        }
        setIsEditing(!isEditing);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gloria-bg flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-soft text-center max-w-md w-full border border-gray-100">
                    <p className="text-gray-500 font-serif italic mb-6">Usuario no encontrado. Por favor, inicia sesión.</p>
                    <button onClick={() => router.push('/')} className="flex items-center justify-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all w-full">
                        <FiLogIn /> Ir a Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    const currentUserIdentifier = user.username || user.email;
    const currentUserActivePredictions = userPredictions.filter(p => p.userId === currentUserIdentifier);
    const predictionsMadeCount = currentUserActivePredictions.length;

    let correctPredictionsCount = 0;
    currentUserActivePredictions.forEach(prediction => {
        const match = allMatches.find(m => m.id === prediction.matchId);
        if (match && match.isPlayed && typeof match.actualScoreA === 'number' && typeof match.actualScoreB === 'number') {
            const result = calculatePointsAndStatus(prediction, match);
            if (result.points > 0) {
                correctPredictionsCount++;
            }
        }
    });

    return (
        <div className="min-h-screen bg-gloria-bg pb-12 text-gloria-text font-sans" role="main" aria-labelledby="profile-title">
            <header className="bg-white border-b border-gray-200 shadow-sm mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 id="profile-title" className="text-2xl font-display font-bold text-gloria-accent tracking-tight">
                        Mi Legado
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gloria-accent transition-colors font-serif italic" aria-label="Volver al dashboard">
                        <FiArrowLeft /> Volver
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <section className="bg-white rounded-xl shadow-soft p-8 border border-gray-100" aria-labelledby="profile-details-heading">
                    <h2 id="profile-details-heading" className="sr-only">Detalles del Perfil</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="shrink-0 relative group">
                            <div className="absolute inset-0 bg-gloria-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                            <img
                                src={isEditing ? (avatarUrl || 'https://via.placeholder.com/150?text=User') : (user.avatarUrl || 'https://via.placeholder.com/150?text=User')}
                                alt="Avatar de usuario"
                                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-gold"
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')}
                            />
                        </div>
                        <div className="grow w-full space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="profile-username" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        id="profile-username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="profile-email" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        id="profile-email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="profile-avatar-url" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest">URL del Avatar</label>
                                    <input
                                        type="text"
                                        id="profile-avatar-url"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="https://ejemplo.com/avatar.png"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="profile-fav-team" className="block text-xs font-bold text-gloria-primary uppercase tracking-widest">Equipo Favorito</label>
                                    <input
                                        type="text"
                                        id="profile-fav-team"
                                        value={favoriteTeam}
                                        onChange={(e) => setFavoriteTeam(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gloria-accent focus:outline-none focus:ring-2 focus:ring-gloria-primary/20 focus:border-gloria-primary disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleEditToggle} className="flex items-center gap-2 px-6 py-3 bg-gloria-primary text-white font-serif font-bold rounded shadow-md hover:bg-gloria-gold-600 transition-all">
                                    {isEditing ? <FiSave /> : <FiEdit />}
                                    {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-soft p-8 border border-gray-100" aria-labelledby="profile-stats-heading">
                    <h2 id="profile-stats-heading" className="text-xl font-display font-bold text-gloria-accent mb-6">Estadísticas de Carrera</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <li className="bg-gloria-bg p-6 rounded-xl text-center border border-gray-100 hover:shadow-md transition-shadow">
                            <span className="block text-4xl font-display font-bold text-gloria-secondary mb-2">{predictionsMadeCount}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Partidos Jugados</span>
                        </li>
                        <li className="bg-gloria-bg p-6 rounded-xl text-center border border-gray-100 hover:shadow-md transition-shadow">
                            <span className="block text-4xl font-display font-bold text-green-600 mb-2">{correctPredictionsCount}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aciertos</span>
                        </li>
                        <li className="bg-gloria-bg p-6 rounded-xl text-center border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute inset-0 bg-gloria-primary/5"></div>
                            <span className="block text-4xl font-display font-bold text-gloria-primary mb-2 relative z-10">{user.totalPoints ?? 0}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest relative z-10">Puntos Totales</span>
                        </li>
                    </ul>
                    <button className="flex items-center gap-2 px-6 py-3 text-gloria-secondary border border-gloria-secondary font-serif font-bold rounded hover:bg-gloria-secondary hover:text-white transition-all" onClick={() => showNotification('Ver historial completo de predicciones (Próximamente)', 'info')}>
                        <FiActivity /> Ver Historial Completo
                    </button>
                </section>

                <section className="bg-white rounded-xl shadow-soft p-8 border border-gray-100" aria-labelledby="profile-actions-heading">
                    <h2 id="profile-actions-heading" className="text-xl font-display font-bold text-gloria-accent mb-6">Seguridad</h2>
                    <button className="flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-300 font-serif font-bold rounded hover:bg-gray-50 transition-all" onClick={() => showNotification('Cambiar contraseña (Próximamente)', 'info')}>
                        <FiLock /> Cambiar Contraseña
                    </button>
                </section>
            </div>

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-serif italic">
                <p>&copy; {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Gloria Eterna.</p>
            </footer>
        </div>
    );
};
