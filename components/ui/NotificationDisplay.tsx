import React from 'react';
import { FiX } from 'react-icons/fi';
import { NotificationMessage } from '@/types';

interface NotificationDisplayProps {
    notification: NotificationMessage | null;
    onClose: () => void;
}

export const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ notification, onClose }) => {
    if (!notification) return null;

    const typeClasses = {
        success: 'bg-green-600 text-white border-green-700',
        error: 'bg-red-600 text-white border-red-700',
        info: 'bg-gloria-primary text-white border-gloria-gold-600',
    };

    return (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-out" role="alert">
            <div className={`flex items-center justify-between p-4 rounded-lg shadow-gold min-w-[320px] border ${typeClasses[notification.type]}`}>
                <p className="mr-4 font-serif font-bold">{notification.message}</p>
                <button onClick={onClose} className="text-white/80 hover:text-white transition-colors focus:outline-none" aria-label="Cerrar notificación">
                    <FiX size={20} />
                </button>
            </div>
        </div>
    );
};
