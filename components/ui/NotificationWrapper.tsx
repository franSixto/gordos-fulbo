'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { NotificationDisplay } from '@/components/ui/NotificationDisplay';

export const NotificationWrapper: React.FC = () => {
    const { notification, clearNotification } = useApp();
    return <NotificationDisplay notification={notification} onClose={clearNotification} />;
};
