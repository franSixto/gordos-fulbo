import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gloria-bg text-gloria-text font-sans p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-soft p-8 border border-gray-100">
                <Link href="/" className="inline-flex items-center gap-2 text-gloria-primary font-bold mb-6 hover:underline">
                    <FiArrowLeft /> Volver al Inicio
                </Link>
                <h1 className="text-3xl font-display font-bold text-gloria-accent mb-6">Términos y Condiciones de Uso</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">1. Introducción</h2>
                        <p>Bienvenido a <strong>Gordos Fulbo XXL Turbo Ultra V12</strong>. Al acceder a nuestra plataforma, aceptás estos términos y condiciones. Si no estás de acuerdo, te pedimos amablemente que no uses la aplicación (y te pierdas la gloria).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">2. Naturaleza del Servicio</h2>
                        <p>Gordos Fulbo XXL Turbo Ultra V12 es una plataforma de entretenimiento y predicciones deportivas (&quot;Prode&quot;). <strong>NO es un sitio de apuestas.</strong> No se utiliza dinero real, ni se otorgan premios monetarios. El único premio es el honor, el respeto de tus pares y la &quot;Gloria Eterna&quot;.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">3. Registro y Cuentas</h2>
                        <p>Para participar, debés registrarte. Sos responsable de mantener la confidencialidad de tu cuenta. No nos hacemos cargo si dejás la sesión abierta y tu amigo te cambia las predicciones para que pierdas.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">4. Conducta del Usuario</h2>
                        <p>Se espera un comportamiento deportivo. El &quot;folklore&quot; del fútbol es bienvenido, pero no toleramos discursos de odio, acoso o trampas. Cualquier intento de hackear el sistema para sumar puntos resultará en la expulsión inmediata y la vergüenza pública.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">5. Limitación de Responsabilidad</h2>
                        <p>Gordos Fulbo XXL Turbo Ultra V12 se ofrece &quot;tal cual&quot;. No garantizamos que la plataforma esté libre de errores (aunque lo intentamos). No somos responsables si el servidor se cae justo antes de que cierren las predicciones de la final.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">6. Modificaciones</h2>
                        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Te avisaremos, pero es tu responsabilidad revisarlos.</p>
                    </section>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 italic">
                    Última actualización: 28 de Noviembre de 2025
                </div>
            </div>
        </div>
    );
}
