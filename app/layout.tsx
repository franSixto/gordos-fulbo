import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProvider } from "@/context/AppContext";
import { NotificationWrapper } from "@/components/ui/NotificationWrapper";
// import Script from "next/script";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const lato = Lato({ weight: ['100', '300', '400', '700', '900'], subsets: ["latin"], variable: '--font-lato' });

export const metadata: Metadata = {
    title: "Gordos Fulbo XXL Turbo Ultra V12 - Gloria Eterna",
    description: "Prode para el mundial de futbol",
    icons: {
        icon: '/logo.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="es" className="scroll-smooth">
                <head>
                    {/* Google AdSense Script - Reemplaza ca-pub-XXXXXXXXXXXXXXXX con tu ID real */}
                    {/* <Script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
                        crossOrigin="anonymous"
                        strategy="afterInteractive"
                    /> */}
                </head>
                <body className={`${playfair.variable} ${lato.variable} bg-gloria-bg text-gloria-text`}>
                    <AppProvider>
                        <NotificationWrapper />
                        {children}
                    </AppProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
