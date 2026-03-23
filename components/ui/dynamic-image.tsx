"use client";

import { useState, useEffect } from "react";

interface DynamicImageProps {
  query: string;
  seed: number;
  alt: string;
  className?: string;
}

const FALLBACK = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop";

export function DynamicImage({ query, seed, alt, className }: DynamicImageProps) {
  const [src, setSrc] = useState<string>(FALLBACK);

  useEffect(() => {
    fetch(`/api/image?query=${encodeURIComponent(query)}&seed=${seed}`)
      .then(r => r.json())
      .then(data => { if (data.url) setSrc(data.url); })
      .catch(() => setSrc(FALLBACK));
  }, [query, seed]);

  return <img src={src} alt={alt} className={className} />;
}