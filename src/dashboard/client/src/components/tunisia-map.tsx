import { useState } from "react";
import { cn } from "@/lib/utils";
import tunisiaMap from "@svg-maps/tunisia";

// Map SVG location IDs to our data IDs
const SVG_ID_TO_DATA_ID: Record<string, number> = {
  "tunis-1": 1, "tunis-2": 1,
  "ariana": 2,
  "ben-arous": 3,
  "manouba": 4,
  "nabeul-1": 5, "nabeul-2": 5,
  "zaghouan": 6,
  "bizerte": 7,
  "beja": 8,
  "jendouba": 9,
  "kef": 10,
  "siliana": 11,
  "sousse": 12,
  "monastir": 13,
  "mahdia": 14,
  "sfax-1": 15, "sfax-2": 15,
  "sidi-bouzid": 18,
  "kairouan": 16,
  "kasserine": 17,
  "gabes": 19,
  "mednine": 20,
  "tozeur": 21,
  "gafsa": 22,
  "kebili": 23,
  "tataouine": 24,
};

export type GovernorateInfo = {
  id: number;
  name: string;
  value: number;
  population?: number;
};

interface TunisiaMapProps {
  governorates: GovernorateInfo[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  className?: string;
}

function getColor(value: number): string {
  const t = Math.max(0, Math.min(1, value / 100));
  // Red scale: brighter base to avoid looking black
  const l = 0.4 + t * 0.4;
  const c = 0.08 + t * 0.17;
  const h = 25; // Red hue
  return `oklch(${l} ${c} ${h})`;
}

export function TunisiaMap({ governorates, selectedId, onSelect, className }: TunisiaMapProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const govMap = new Map(governorates.map((g) => [g.id, g]));
  const hoveredGov = hoveredId ? govMap.get(hoveredId) : null;

  return (
    <div className={cn("relative", className)}>
      <svg viewBox={tunisiaMap.viewBox} className="w-full h-auto max-h-[480px]" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
        {/* Background */}
        <rect x="0" y="0" width="492" height="1027" fill="oklch(0.2 0.01 260)" rx="8" />

        {tunisiaMap.locations.map((loc: any) => {
          const dataId = SVG_ID_TO_DATA_ID[loc.id];
          if (!dataId) return null;
          const gov = govMap.get(dataId);
          if (!gov) return null;

          const isSelected = selectedId === dataId;
          const isHovered = hoveredId === dataId;
          const color = getColor(gov.value || 0);

          return (
            <path
              key={loc.id}
              d={loc.path}
              fill={color}
              stroke={isSelected ? "white" : isHovered ? "oklch(0.8 0 0)" : "oklch(0.3 0.01 260)"}
              strokeWidth={isSelected ? 3 : isHovered ? 2 : 0.8}
              className="cursor-pointer transition-all duration-300"
              style={{
                filter: isSelected ? "brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.4))" : isHovered ? "brightness(1.1)" : "none",
              }}
              onClick={() => onSelect(dataId === selectedId ? null : dataId)}
              onMouseEnter={() => setHoveredId(dataId)}
              onMouseLeave={() => setHoveredId(null)}
            />
          );
        })}

        {/* Labels for major governorates */}
        {[
          { id: 1, x: 328, y: 72 }, { id: 2, x: 310, y: 42 }, { id: 7, x: 245, y: 22 },
          { id: 5, x: 395, y: 80 }, { id: 8, x: 215, y: 110 }, { id: 9, x: 135, y: 95 },
          { id: 10, x: 110, y: 200 }, { id: 11, x: 215, y: 210 }, { id: 6, x: 310, y: 150 },
          { id: 16, x: 275, y: 240 }, { id: 12, x: 370, y: 210 }, { id: 13, x: 395, y: 240 },
          { id: 17, x: 120, y: 330 }, { id: 18, x: 220, y: 340 }, { id: 14, x: 410, y: 295 },
          { id: 15, x: 350, y: 380 }, { id: 22, x: 110, y: 430 }, { id: 21, x: 42, y: 520 },
          { id: 23, x: 135, y: 600 }, { id: 19, x: 255, y: 530 }, { id: 20, x: 380, y: 640 },
          { id: 24, x: 280, y: 780 },
        ].map(({ id, x, y }) => {
          const gov = govMap.get(id);
          if (!gov) return null;
          const isSelected = selectedId === id;
          return (
            <text
              key={`label-${id}`} x={x} y={y}
              textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize={isSelected ? "14" : "10"}
              fontWeight={isSelected ? "800" : "600"}
              className="pointer-events-none select-none"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}
            >
              {gov.name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 justify-center">
        <span className="text-xs font-medium text-muted-foreground">0%</span>
        <div className="w-48 h-2.5 rounded-full border border-white/10" style={{
          background: "linear-gradient(to right, oklch(0.4 0.08 25), oklch(0.8 0.25 25))"
        }} />
        <span className="text-xs font-medium text-muted-foreground">100%</span>
      </div>
    </div>
  );
}
