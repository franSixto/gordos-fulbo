'use client';

import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/nextjs';
import { AdBanner } from '@/components/ui/AdBanner';
import { FiArrowLeft } from 'react-icons/fi';

interface AuthScreenProps {
    onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gloria-bg p-4 relative overflow-hidden" role="main" aria-labelledby="auth-title">
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gloria-primary font-bold hover:underline bg-white/80 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm"
                >
                    <FiArrowLeft /> Volver
                </button>
            )}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gloria-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-gloria-secondary/20 rounded-full blur-[120px]"></div>
            </div>

            <header className="mb-12 text-center z-10">
                <h1 id="auth-title" className="text-5xl md:text-6xl font-display font-bold text-gloria-accent mb-4 tracking-tight">
                    Gordos Fulbo XXL Turbo Ultra V12
                </h1>
                <p className="text-gloria-primary font-serif italic text-xl tracking-wide">
                    {isLoginView ? 'El camino a la gloria comienza aquí.' : 'Unite a la historia.'}
                </p>
            </header>

            <div className="w-full max-w-md bg-white border border-gloria-primary/20 rounded-2xl shadow-gold overflow-hidden p-8 flex flex-col items-center z-10">
                <div className="flex border-b border-gray-100 w-full mb-8" role="tablist">
                    <button
                        role="tab"
                        aria-selected={isLoginView}
                        onClick={() => setIsLoginView(true)}
                        className={`flex-1 py-4 text-center font-serif font-bold text-lg transition-all duration-300 ${isLoginView ? 'text-gloria-primary border-b-2 border-gloria-primary' : 'text-gray-400 hover:text-gloria-accent'}`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        role="tab"
                        aria-selected={!isLoginView}
                        onClick={() => setIsLoginView(false)}
                        className={`flex-1 py-4 text-center font-serif font-bold text-lg transition-all duration-300 ${!isLoginView ? 'text-gloria-primary border-b-2 border-gloria-primary' : 'text-gray-400 hover:text-gloria-accent'}`}
                    >
                        Registrarse
                    </button>
                </div>

                <div className="w-full">
                    {isLoginView ? (
                        <SignIn routing="hash" appearance={{
                            elements: {
                                formButtonPrimary: 'bg-gloria-primary text-white font-serif font-bold tracking-wide hover:bg-gloria-gold-600 transition-colors shadow-md',
                                card: 'bg-transparent shadow-none p-0',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                socialButtonsBlockButton: 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-sans',
                                formFieldLabel: 'text-gloria-accent font-sans font-medium',
                                formFieldInput: 'bg-gray-50 border-gray-200 text-gloria-text focus:border-gloria-primary focus:ring-gloria-primary/20 rounded-lg',
                                footerActionLink: 'text-gloria-primary hover:text-gloria-gold-600 font-serif italic'
                            }
                        }} />
                    ) : (
                        <SignUp routing="hash" appearance={{
                            elements: {
                                formButtonPrimary: 'bg-gloria-primary text-white font-serif font-bold tracking-wide hover:bg-gloria-gold-600 transition-colors shadow-md',
                                card: 'bg-transparent shadow-none p-0',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                socialButtonsBlockButton: 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-sans',
                                formFieldLabel: 'text-gloria-accent font-sans font-medium',
                                formFieldInput: 'bg-gray-50 border-gray-200 text-gloria-text focus:border-gloria-primary focus:ring-gloria-primary/20 rounded-lg',
                                footerActionLink: 'text-gloria-primary hover:text-gloria-gold-600 font-serif italic'
                            }
                        }} />
                    )}
                </div>
            </div>

            <AdBanner dataAdSlot="1234567890" className="mt-8 max-w-md" />
        </div>
    );
};
