import React from 'react';
import Image from 'next/image';

interface TeamLogoProps {
    teamName: string;
    flagUrl: string;
    width?: number;
    height?: number;
    className?: string;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, flagUrl, width = 48, height = 48, className = '' }) => {
    if (teamName === 'TBD') {
        return (
            <div 
                className={`bg-gray-200 flex items-center justify-center rounded-sm text-gray-500 font-bold text-[10px] leading-none ${className}`}
                style={{ width: `${width}px`, height: `${height}px` }}
            >
                TBD
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
            <Image 
                src={flagUrl} 
                alt={teamName} 
                fill
                className="object-contain"
                sizes={`${width}px`}
            />
        </div>
    );
};
