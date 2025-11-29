import React from 'react';
import { FiX, FiXCircle, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonVariant?: 'danger' | 'primary';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen, title, message, onConfirm, onCancel,
    confirmButtonText = "Confirmar", cancelButtonText = "Cancelar", confirmButtonVariant = 'primary'
}) => {
    if (!isOpen) return null;

    let confirmIcon = <FiCheckCircle />;
    if (confirmButtonVariant === 'danger') {
        confirmIcon = <FiAlertTriangle />;
    }

    const confirmBtnClasses = confirmButtonVariant === 'danger'
        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
        : 'bg-gloria-primary hover:bg-gloria-gold-600 text-white shadow-md';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gloria-primary/20 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
            <div className="bg-white rounded-xl shadow-gold w-full max-w-md mx-4 overflow-hidden border border-gloria-gold-200">
                <header className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 id="confirm-modal-title" className="text-xl font-display font-bold text-gloria-accent">{title}</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gloria-primary transition-colors" aria-label="Cerrar modal">
                        <FiX size={24} />
                    </button>
                </header>
                <div className="p-8">
                    <p className="text-gray-600 font-serif italic text-lg">{message}</p>
                </div>
                <footer className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-gray-100">
                    <button onClick={onCancel} className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-serif font-bold transition-all">
                        <FiXCircle /> {cancelButtonText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-serif font-bold transition-all transform hover:-translate-y-0.5 ${confirmBtnClasses}`}
                    >
                        {confirmIcon} {confirmButtonText}
                    </button>
                </footer>
            </div>
        </div>
    );
};
