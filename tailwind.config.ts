import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gloria: {
                    bg: '#F8F9FA', // Blanco Humo / Mármol
                    card: '#FFFFFF', // Blanco Puro
                    primary: '#B4975A', // Dorado Mate
                    secondary: '#75AADB', // Celeste Bandera
                    accent: '#1F2937', // Azul Noche / Navy
                    text: '#111827', // Casi Negro
                    muted: '#6B7280', // Gris Piedra
                    gold: {
                        100: '#F5F0E1',
                        200: '#E6DCC3',
                        300: '#D7C8A5',
                        400: '#C8B487',
                        500: '#B4975A', // Base
                        600: '#907948',
                        700: '#6C5B36',
                    }
                },
            },
            fontFamily: {
                sans: ['var(--font-lato)', 'sans-serif'],
                serif: ['var(--font-playfair)', 'serif'],
                display: ['var(--font-playfair)', 'serif'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "marble": "url('/patterns/marble.png')", // Placeholder for future texture
            },
            boxShadow: {
                'soft': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
                'gold': '0 10px 15px -3px rgba(180, 151, 90, 0.2)',
            }
        },
    },
    plugins: [],
};
export default config;
