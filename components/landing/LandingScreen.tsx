/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { FiAward, FiUsers, FiTrendingUp, FiChevronRight, FiStar, FiSmartphone, FiCheckCircle } from 'react-icons/fi';
import { SignUpButton } from "@clerk/nextjs";
import LandingNavbar from './LandingNavbar';
import LandingFaq from './LandingFaq';

export default function LandingScreen() {
    return (
        <div className="min-h-screen bg-gloria-bg font-sans text-gloria-text overflow-x-hidden">
            {/* Navbar */}
            <LandingNavbar />

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/background.webp"
                        alt="Estadio de fútbol iluminado de noche con tribunas llenas"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-gloria-accent/95 via-gloria-accent/80 to-gloria-bg"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-gloria-primary font-bold text-sm mb-8 animate-pulse">
                        <FiStar aria-hidden="true" /> <span>La plataforma definitiva de predicciones</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                        La Gloria Eterna <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-gloria-primary via-yellow-200 to-gloria-primary">
                            Se Juega Acá
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Olvidate del Excel. Creá tu liga en segundos, desafiá a tus amigos y demostrá quién sabe más de fútbol.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <SignUpButton mode="modal">
                            <button
                                className="w-full md:w-auto bg-gloria-primary hover:bg-gloria-gold-400 text-gloria-accent font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-gloria-primary/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-gloria-primary/50"
                            >
                                Comenzar Ahora <FiChevronRight aria-hidden="true" />
                            </button>
                        </SignUpButton>
                        <Link
                            href="#how-it-works"
                            className="w-full md:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 flex items-center justify-center"
                        >
                            Cómo Funciona
                        </Link>
                    </div>

                    {/* Stats / Social Proof */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
                        <div>
                            <p className="text-3xl font-bold text-white">100%</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Gratis</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">0%</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Timba</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">+10k</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Predicciones</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">∞</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Gloria</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* How It Works Section (New Funnel Step) */}
            <section id="how-it-works" className="py-20 px-6 bg-white relative z-20 -mt-10 rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-gloria-primary font-bold tracking-widest uppercase text-sm mb-2">Paso a Paso</h2>
                        <h3 className="text-4xl md:text-5xl font-display font-bold text-gloria-accent">Tu camino a la cima</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                        <div className="text-center relative">
                            <div className="w-24 h-24 bg-white border-4 border-gloria-primary rounded-full flex items-center justify-center text-3xl font-bold text-gloria-primary mx-auto mb-6 shadow-lg">1</div>
                            <h4 className="text-xl font-bold text-gloria-accent mb-3">Creá tu Cuenta</h4>
                            <p className="text-gray-600">Registrate en segundos con tu email. Sin formularios eternos ni tarjetas de crédito.</p>
                        </div>
                        <div className="text-center relative">
                            <div className="w-24 h-24 bg-white border-4 border-gloria-primary rounded-full flex items-center justify-center text-3xl font-bold text-gloria-primary mx-auto mb-6 shadow-lg">2</div>
                            <h4 className="text-xl font-bold text-gloria-accent mb-3">Armá tu Liga</h4>
                            <p className="text-gray-600">Invitá a tus amigos, compañeros de trabajo o familiares. ¡Que empiece la competencia!</p>
                        </div>
                        <div className="text-center relative">
                            <div className="w-24 h-24 bg-gloria-primary border-4 border-gloria-primary rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-lg">3</div>
                            <h4 className="text-xl font-bold text-gloria-accent mb-3">Pronosticá y Ganá</h4>
                            <p className="text-gray-600">Cargá tus resultados antes de los partidos. Sumá puntos y cargá a los que pierden.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Preview Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="p-12 md:w-1/2 flex flex-col justify-center order-2 md:order-1">
                            <div className="w-12 h-12 bg-gloria-secondary/10 rounded-xl flex items-center justify-center text-gloria-secondary mb-6">
                                <FiSmartphone size={24} aria-hidden="true" />
                            </div>
                            <h2 className="text-4xl font-display font-bold text-gloria-accent mb-6">
                                Tu estadio, <br /> en tu bolsillo.
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Una interfaz diseñada para los verdaderos enfermos del fútbol. Carga tus predicciones en segundos, revisá la tabla en vivo y recibí notificaciones cuando tu amigo erre ese penal clave.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Resultados en tiempo real',
                                    'Tablas de posiciones automáticas',
                                    'Historial de predicciones',
                                    'Perfiles de usuario detallados'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gloria-accent font-medium">
                                        <FiCheckCircle className="text-green-500 shrink-0" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <SignUpButton mode="modal">
                                    <button className="text-gloria-primary font-bold hover:underline flex items-center gap-2">
                                        Ver demo en vivo <FiChevronRight aria-hidden="true" />
                                    </button>
                                </SignUpButton>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-gloria-accent relative min-h-[400px] flex items-center justify-center p-8 overflow-hidden order-1 md:order-2">
                            {/* Abstract Phone Mockup */}
                            <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-700 shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col">
                                    {/* Mock UI */}
                                    <div className="bg-gloria-primary h-32 p-6 flex flex-col justify-end shrink-0">
                                        <div className="w-16 h-4 bg-white/30 rounded mb-2"></div>
                                        <div className="w-32 h-6 bg-white rounded"></div>
                                    </div>
                                    <div className="p-4 space-y-4 flex-1 overflow-hidden bg-gray-50">
                                        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                                                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="w-8 h-6 bg-green-100 rounded text-green-700 text-xs flex items-center justify-center font-bold">+3</div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-red-100"></div>
                                                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="w-8 h-6 bg-gray-100 rounded text-gray-500 text-xs flex items-center justify-center font-bold">0</div>
                                        </div>
                                        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between mb-2">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                                <div className="text-2xl font-bold text-gloria-accent">2 - 1</div>
                                                <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                            </div>
                                            <div className="w-full h-8 bg-gloria-primary text-white rounded flex items-center justify-center text-sm font-bold">Tu Predicción</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-gloria-primary font-bold tracking-widest uppercase text-sm mb-2">Características</h2>
                        <h3 className="text-4xl md:text-5xl font-display font-bold text-gloria-accent">Todo lo que necesitás para ganar</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FiTrendingUp aria-hidden="true" />}
                            title="Predicciones Precisas"
                            description="Sistema de puntuación justo. 3 puntos por resultado exacto, 1 punto por acertar el ganador. Sin vueltas."
                        />
                        <FeatureCard
                            icon={<FiUsers aria-hidden="true" />}
                            title="Ligas Privadas"
                            description="Armá tu torneo con los de la oficina o los del fútbol 5. Chat (próximamente) y tabla exclusiva."
                        />
                        <FeatureCard
                            icon={<FiAward aria-hidden="true" />}
                            title="Ranking Global"
                            description="¿Te creés el mejor? Medite contra toda la comunidad de Gordos Fulbo y llegá al Olimpo."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials (Social Proof) */}
            <section className="py-20 px-6 bg-gloria-accent text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-gloria-primary font-bold tracking-widest uppercase text-sm mb-2">La Hinchada</h2>
                        <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Lo que dicen los jugadores</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="Antes usábamos un Excel que siempre se rompía. Gordos Fulbo nos salvó el mundial."
                            author="Juan P."
                            role="Admin de 'Los del Fondo'"
                        />
                        <TestimonialCard
                            quote="La interfaz es increíble. Puedo cargar mis resultados desde el bondi sin problemas."
                            author="Sofía M."
                            role="Campeona 2024"
                        />
                        <TestimonialCard
                            quote="Lo mejor es que no hay plata de por medio, solo el placer de ganarles a mis amigos."
                            author="Carlos R."
                            role="Eterno Segundo"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ / Objections Handling */}
            <LandingFaq />

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gloria-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 mix-blend-multiply">
                    <img
                        src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop"
                        alt="Fans celebrando"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-gloria-accent mb-8">
                        ¿Estás listo para la gloria?
                    </h2>
                    <p className="text-xl text-gloria-accent/80 mb-10 font-medium max-w-2xl mx-auto">
                        Unite hoy mismo a la comunidad de fanáticos más grande. Demostrá que sabés más que los periodistas deportivos.
                    </p>
                    <SignUpButton mode="modal">
                        <button
                            className="bg-gloria-accent text-white hover:bg-gray-900 font-bold py-5 px-12 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gloria-accent/50"
                        >
                            Crear mi Cuenta Gratis
                        </button>
                    </SignUpButton>
                    <p className="mt-4 text-sm text-gloria-accent/60 font-medium">
                        No requiere tarjeta de crédito.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                            <img src="/logo.png" alt="Gordos Fulbo Logo" className="h-8 w-auto" />
                            <span className="text-xl font-display font-bold">Gordos Fulbo XXL Turbo Ultra V12</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Plataforma de entretenimiento deportivo. <br />
                            Hecho con <span className="text-red-500">❤</span> y mucha pasión.
                        </p>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-gray-400">
                        <Link href="/terms" className="hover:text-gloria-primary transition-colors">Términos</Link>
                        <Link href="/privacy" className="hover:text-gloria-primary transition-colors">Privacidad</Link>
                        <a href="#" className="hover:text-gloria-primary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-gloria-primary transition-colors">Instagram</a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
                    © {new Date().getFullYear()} Gordos Fulbo XXL Turbo Ultra V12. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-gloria-primary mb-6 group-hover:bg-gloria-primary group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gloria-accent mb-3 font-display">{title}</h3>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="text-gloria-primary text-4xl mb-4 font-serif">&quot;</div>
            <p className="text-gray-300 mb-6 italic leading-relaxed">{quote}</p>
            <div>
                <p className="font-bold text-white">{author}</p>
                <p className="text-sm text-gloria-primary">{role}</p>
            </div>
        </div>
    );
}
