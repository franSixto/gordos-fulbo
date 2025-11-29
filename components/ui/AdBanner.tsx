import React, { useEffect } from 'react';

interface AdBannerProps {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
    className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
    dataAdSlot,
    dataAdFormat = 'auto',
    dataFullWidthResponsive = true,
    className = ''
}) => {
    useEffect(() => {
        try {
            // @ts-expect-error AdSense global variable
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    // For local development, we show a placeholder
    // In production, this would be hidden if no ad loads, or filled by the ad
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <div className={`w-full flex justify-center my-6 ${className}`}>
            {isDevelopment ? (
                <div className="w-full max-w-[728px] h-[90px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-sans text-sm">
                    <div className="text-center">
                        <p className="font-bold">Espacio Publicitario (Google AdSense)</p>
                        <p className="text-xs">Slot ID: {dataAdSlot}</p>
                    </div>
                </div>
            ) : (
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // REPLACE WITH YOUR PUBLISHER ID
                    data-ad-slot={dataAdSlot}
                    data-ad-format={dataAdFormat}
                    data-full-width-responsive={dataFullWidthResponsive ? 'true' : 'false'}
                />
            )}
        </div>
    );
};
