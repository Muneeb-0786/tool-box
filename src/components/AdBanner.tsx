import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot: string;
  size: string;
  className?: string;
}

export default function AdBanner({ slot, size, className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    try {
      // Only initialize if not already done and the element exists
      if (!isInitialized.current && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isInitialized.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // For development, show placeholder ads
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return (
      <div className={`${className} p-4 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 text-sm bg-gray-50 rounded-lg`}>
        <span>📢 Ad Placeholder ({size}) - Slot: {slot}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXX" // Replace with your AdSense client ID
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
