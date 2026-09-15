import React from "react";

export default function EqualizerBars({ count = 24, className = "" }) {
  const bars = Array.from({ length: count });
  return (
    <div className={`flex items-end gap-1 ${className}`} aria-hidden>
      {bars.map((_, i) => (
        <span
          key={i}
          className="w-1 origin-bottom rounded-full bg-gradient-to-t from-accent to-secondary"
          style={{
            height: "100%",
            animation: `eq ${1 + (i % 5) * 0.25}s ease-in-out ${i * 0.07}s infinite`,
          }}
        />
      ))}
    </div>
  );
}