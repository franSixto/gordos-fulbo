'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export const WelcomeConfetti = () => {
    const ehhAudioRef = useRef<HTMLAudioElement | null>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        // Check session storage
        const hasShown = sessionStorage.getItem('welcomeShown');
        if (hasShown || hasRun.current) return;

        // Initialize audio with preload
        ehhAudioRef.current = new Audio('/ehh.mp3');
        ehhAudioRef.current.preload = 'auto';

        const colors = ['#FFD700', '#FFFFFF', '#87CEEB']; // Gold, White, Light Blue
        const interval = 500; // Reduced from 800ms

        const fireConfetti = () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: colors,
                zIndex: 9999,
            });
        };

        const playEhh = () => {
            if (ehhAudioRef.current) {
                ehhAudioRef.current.currentTime = 0;
                ehhAudioRef.current.play().catch(e => console.log("Ehh Audio play failed:", e));
            }
        };

        const triggerSequence = () => {
            if (hasRun.current) return;
            hasRun.current = true;
            sessionStorage.setItem('welcomeShown', 'true');

            // Shot 1
            fireConfetti();

            // Shot 2
            setTimeout(() => {
                fireConfetti();
            }, interval);

            // Shot 3
            setTimeout(() => {
                fireConfetti();
            }, interval * 2);

            // Ehh sound at the end
            setTimeout(() => {
                playEhh();
            }, interval * 3);
        };

        // Attempt autoplay
        const attemptAutoplay = async () => {
            try {
                // We try to play the audio muted first to check if we can, or just try to play.
                // Actually, the best check is to try playing.
                if (ehhAudioRef.current) {
                    await ehhAudioRef.current.play();
                    ehhAudioRef.current.pause();
                    ehhAudioRef.current.currentTime = 0;
                    // If we got here, autoplay is allowed.
                    triggerSequence();
                }
            } catch (error) {
                console.log("Autoplay blocked. Waiting for interaction.", error);
                // If blocked, wait for first click
                const enableAudio = () => {
                    triggerSequence();
                    document.removeEventListener('click', enableAudio);
                    document.removeEventListener('keydown', enableAudio);
                    document.removeEventListener('touchstart', enableAudio);
                };
                document.addEventListener('click', enableAudio);
                document.addEventListener('keydown', enableAudio);
                document.addEventListener('touchstart', enableAudio);
            }
        };

        attemptAutoplay();

    }, []);

    return null;
};
