import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  loading = 'lazy',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3EDE4] via-[#E7D9C4] to-[#DFCBB4] text-[#4A1D2F]/80 p-6 text-center ${containerClassName}`}
      >
        <Sparkles className="w-7 h-7 mb-2 opacity-70" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-[#5E5659] max-w-[22ch]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[#F3EDE4] ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={className}
      />
    </div>
  );
}
