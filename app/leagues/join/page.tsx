'use client';

import React, { useEffect } from 'react';
import { JoinLeagueScreen } from '@/components/leagues/JoinLeagueScreen';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function JoinLeaguePage() {
    const { user, isLoading } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <JoinLeagueScreen />;
}
