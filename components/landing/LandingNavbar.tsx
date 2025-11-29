'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gloria-accent/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Gordos Fulbo Logo" className="h-10 w-auto" />
                    <span className="text-2xl font-display font-bold tracking-tight text-white">
                        Gordos Fulbo XXL Turbo Ultra V12
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <SignInButton mode="modal">
                        <button
                            className="hidden md:block text-white/90 hover:text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-2"
                        >
                            Iniciar Sesión
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button
                            className="bg-gloria-primary hover:bg-white hover:text-gloria-accent text-gloria-accent font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-gold transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gloria-primary focus:ring-offset-2 focus:ring-offset-gloria-accent"
                        >
                            Jugar Ahora
                        </button>
                    </SignUpButton>
                </div>
            </div>
        </nav>
    );
}
