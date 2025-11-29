import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gloria-bg text-gloria-text font-sans p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-soft p-8 border border-gray-100">
                <Link href="/" className="inline-flex items-center gap-2 text-gloria-primary font-bold mb-6 hover:underline">
                    <FiArrowLeft /> Volver al Inicio
                </Link>
                <h1 className="text-3xl font-display font-bold text-gloria-accent mb-6">Política de Privacidad</h1>
                
                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">1. Qué datos recolectamos</h2>
                        <p>Recolectamos lo mínimo indispensable: tu nombre (o apodo), tu correo electrónico (para que puedas recuperar tu cuenta) y tus predicciones (para calcular tu gloria).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">2. Uso de la información</h2>
                        <p>Usamos tus datos exclusivamente para el funcionamiento del juego. No vendemos tu información a terceros. No nos interesa lucrar con tus datos, solo queremos saber quién sabe más de fútbol.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">3. Cookies</h2>
                        <p>Utilizamos cookies para mantener tu sesión iniciada y recordar tus preferencias. No usamos cookies para rastrearte por todo internet, eso es de mala gente.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">4. Seguridad</h2>
                        <p>Hacemos todo lo posible para proteger tus datos. Sin embargo, recordá que ninguna transmisión por internet es 100% segura. Usá una contraseña segura y no se la des a nadie.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gloria-accent mb-2">5. Contacto</h2>
                        <p>Si tenés dudas sobre tu privacidad, podés contactarnos (aunque probablemente estemos viendo un partido).</p>
                    </section>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 italic">
                    Última actualización: 28 de Noviembre de 2025
                </div>
            </div>
        </div>
    );
}
