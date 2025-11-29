'use client';

import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

export default function LandingFaq() {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-display font-bold text-gloria-accent">Preguntas Frecuentes</h3>
                </div>
                <div className="space-y-6">
                    <FaqItem
                        question="¿Es realmente gratis?"
                        answer="Sí, 100% gratis. No hay costos ocultos ni suscripciones premium. El objetivo es divertirse."
                    />
                    <FaqItem
                        question="¿Se juega por dinero?"
                        answer="No. Gordos Fulbo XXL Turbo Ultra V12 es una plataforma de entretenimiento. No facilitamos apuestas ni premios monetarios."
                    />
                    <FaqItem
                        question="¿Puedo crear más de una liga?"
                        answer="¡Claro! Podés tener una liga con los del trabajo, otra con la familia y otra con tus amigos."
                    />
                </div>
            </div>
        </section>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold text-gloria-accent text-lg">{question}</span>
                <FiChevronRight className={`transform transition-transform text-gloria-primary ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600">{answer}</p>
            </div>
        </div>
    );
}
