"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { RotateCw } from "lucide-react";

interface JerseyPreviewProps {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    pattern: string;
    collar: string;
    teamName: string;
    playerName: string;
    playerNumber: string;
    showCrest: boolean;
    sponsorText: string;
    showSponsor: boolean;
    garmentLabel: string;
    texture?: string;
    sleeveStyle?: string;
}

export function JerseyPreview({
    primaryColor,
    secondaryColor,
    accentColor,
    pattern,
    collar,
    teamName,
    playerName,
    playerNumber,
    showCrest,
    sponsorText,
    showSponsor,
    garmentLabel,
    texture = "smooth",
    sleeveStyle = "short",
}: JerseyPreviewProps) {
    const [view, setView] = useState<"front" | "back">("front");
    const isBack = view === "back";

    // Check for shorts/kit in label (simple heuristic)
    const showShorts = garmentLabel.toLowerCase().includes("short") || garmentLabel.toLowerCase().includes("kit") || garmentLabel.toLowerCase().includes("uniform");

    const patternId = isBack ? "jersey-pattern-back" : "jersey-pattern-front"; // Unique IDs to force refresh if needed, usually fine
    const patternDef = (): ReactNode => {
        // Reuse pattern logic but ensure it's robust
        const pDef = (id: string) => {
            switch (pattern) {
                case "stripes":
                    return (
                        <pattern id={id} width="36" height="10" patternUnits="userSpaceOnUse">
                            <rect width="18" height="10" fill={primaryColor} />
                            <rect x="18" width="18" height="10" fill={secondaryColor} />
                        </pattern>
                    );
                case "hoops":
                    return (
                        <pattern id={id} width="10" height="36" patternUnits="userSpaceOnUse">
                            <rect width="10" height="18" fill={primaryColor} />
                            <rect y="18" width="10" height="18" fill={secondaryColor} />
                        </pattern>
                    );
                case "half-half":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="50%" stopColor={primaryColor} />
                            <stop offset="50%" stopColor={secondaryColor} />
                        </linearGradient>
                    );
                case "gradient":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="100%" stopColor={secondaryColor} />
                        </linearGradient>
                    );
                case "chevron":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="38%" stopColor={primaryColor} />
                            <stop offset="40%" stopColor={secondaryColor} />
                            <stop offset="60%" stopColor={secondaryColor} />
                            <stop offset="62%" stopColor={primaryColor} />
                            <stop offset="100%" stopColor={primaryColor} />
                        </linearGradient>
                    );
                case "sash":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="20%" stopColor={primaryColor} />
                            <stop offset="25%" stopColor={secondaryColor} />
                            <stop offset="75%" stopColor={secondaryColor} />
                            <stop offset="80%" stopColor={primaryColor} />
                        </linearGradient>
                    );
                case "pinstripe":
                    return (
                        <pattern id={id} width="12" height="10" patternUnits="userSpaceOnUse">
                            <rect width="10" height="10" fill={primaryColor} />
                            <rect x="10" width="2" height="10" fill={secondaryColor} />
                        </pattern>
                    );
                case "block":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="48%" stopColor={primaryColor} />
                            <stop offset="52%" stopColor={secondaryColor} />
                        </linearGradient>
                    );
                case "diamond":
                    return (
                        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
                            <rect width="24" height="24" fill={primaryColor} />
                            <polygon points="12,0 24,12 12,24 0,12" fill={secondaryColor} opacity="0.55" />
                        </pattern>
                    );
                case "camo":
                    return (
                        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill={primaryColor} />
                            <ellipse cx="12" cy="12" rx="11" ry="8" fill={secondaryColor} opacity="0.45" />
                            <ellipse cx="32" cy="28" rx="9" ry="7" fill={secondaryColor} opacity="0.35" />
                            <ellipse cx="4" cy="34" rx="7" ry="6" fill={secondaryColor} opacity="0.25" />
                            <ellipse cx="28" cy="6" rx="6" ry="5" fill={secondaryColor} opacity="0.3" />
                        </pattern>
                    );
                case "lightning":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="44%" stopColor={primaryColor} />
                            <stop offset="46%" stopColor={secondaryColor} />
                            <stop offset="54%" stopColor={secondaryColor} />
                            <stop offset="56%" stopColor={primaryColor} />
                            <stop offset="100%" stopColor={primaryColor} />
                        </linearGradient>
                    );
                default:
                    return null;
            }
        };
        return pDef("jersey-pattern");
    };

    const fillRef = pattern === "solid" ? primaryColor : `url(#jersey-pattern)`;

    // Texture overlay pattern
    const textureDef = (): ReactNode => {
        switch (texture) {
            case "mesh":
                return (
                    <pattern id="tex-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="3" cy="3" r="1" fill="white" opacity="0.07" />
                    </pattern>
                );
            case "honeycomb":
                return (
                    <pattern id="tex-honeycomb" width="10" height="18" patternUnits="userSpaceOnUse">
                        <polygon points="5,0 10,4.5 10,13.5 5,18 0,13.5 0,4.5" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06" />
                    </pattern>
                );
            case "carbon":
                return (
                    <pattern id="tex-carbon" width="4" height="4" patternUnits="userSpaceOnUse">
                        <rect width="2" height="2" fill="white" opacity="0.04" />
                        <rect x="2" y="2" width="2" height="2" fill="white" opacity="0.04" />
                    </pattern>
                );
            case "dots":
                return (
                    <pattern id="tex-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                        <circle cx="4" cy="4" r="0.6" fill="white" opacity="0.08" />
                    </pattern>
                );
            case "lines":
                return (
                    <pattern id="tex-lines" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="4" stroke="white" strokeWidth="0.5" opacity="0.05" />
                    </pattern>
                );
            case "knit":
                return (
                    <pattern id="tex-knit" width="6" height="6" patternUnits="userSpaceOnUse">
                        <path d="M0,3 Q1.5,0 3,3 Q4.5,6 6,3" fill="none" stroke="white" strokeWidth="0.4" opacity="0.06" />
                    </pattern>
                );
            default:
                return null;
        }
    };

    const texId = texture !== "smooth" ? `url(#tex-${texture})` : "none";

    // Sleeve Logic
    const isLong = sleeveStyle === "long";
    const sleeveExt = isLong ? 50 : 0;
    const sleeveW = 250 + sleeveExt;

    // NEW CURVED PATHS (Matching user image)
    // Body: neck (70,0 -> 230,0), sleeves out to (250, 20), armpit curve, waist curve
    const bodyPath = `
        M 80 0 
        L 220 0 
        L 250 20 
        L ${sleeveW} 20 
        L ${sleeveW} 90
        Q ${sleeveW - 10} 100 230 110 
        Q 220 250 230 400 
        L 70 400 
        Q 80 250 70 110 
        Q ${300 - sleeveW + 10} 100 ${300 - sleeveW} 90 
        L ${300 - sleeveW} 20 
        L 50 20 
        Z
    `;

    // Shorts Path (Curved legs)
    const shortsPath = `
        M 70 420 
        L 230 420 
        L 235 550 
        L 165 550 
        L 150 480 
        L 135 550 
        L 65 550 
        L 70 420 
        Z
    `;

    return (
        <div className="relative w-full group">
            <svg viewBox="0 -10 300 600" className="w-full h-auto" style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.4))" }}>
                <defs>
                    {patternDef()}
                    {textureDef()}

                    <filter id="inner-shadow" x="-10%" y="-10%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" />
                        <feComposite operator="out" in="SourceGraphic" result="inverse" />
                        <feFlood floodColor="black" floodOpacity="0.5" result="color" />
                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>

                    <linearGradient id="highlight-overlay" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* ─── JERSEY ─── */}
                <g>
                    {/* Base Fill */}
                    <path d={bodyPath} fill={fillRef} />
                    {/* Texture */}
                    <path d={bodyPath} fill={texId} />
                    {/* Highlights */}
                    <path d={bodyPath} fill="url(#highlight-overlay)" />
                    {/* Outline */}
                    <path d={bodyPath} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                </g>

                {/* ─── SHORTS ─── */}
                {showShorts && (
                    <g>
                        <path d={shortsPath} fill={fillRef} />
                        <path d={shortsPath} fill={texId} />
                        <path d={shortsPath} fill="url(#highlight-overlay)" />
                        <path d={shortsPath} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

                        {/* Waistband */}
                        <path d="M 70 420 Q 150 425 230 420" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                    </g>
                )}

                {/* ─── COLLAR ─── */}
                <g>
                    {isBack ? (
                        /* Back Collar: Simple Curve */
                        <path d="M 80 0 Q 150 15 220 0" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
                    ) : (
                        /* Front Collar: Thick V-neck Crossover */
                        <g>
                            {/* Left Sash (Under) */}
                            <path d="M 150 50 L 110 0 L 130 0 L 160 35 Z" fill={accentColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                            {/* Right Sash (Over) */}
                            <path d="M 150 50 L 190 0 L 170 0 L 140 35 Z" fill={accentColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                            {/* Back Neck fill */}
                            <path d="M 110 0 L 190 0 L 150 30 Z" fill={primaryColor} opacity="0.2" /> {/* Depth shadow inside neck */}
                        </g>
                    )}
                </g>

                {/* ─── CREST (Front Only) ─── */}
                {!isBack && showCrest && (
                    <g transform="translate(200, 35)">
                        <rect width="24" height="24" rx="2" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="0.5" />
                        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">AF</text>
                    </g>
                )}

                {/* ─── SPONSOR (Front Only) ─── */}
                {!isBack && showSponsor && (
                    <g transform="translate(150, 160)">
                        <text textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize={Math.min(24, 200 / (sponsorText.length || 1) * 2)} fontWeight="900" style={{ textTransform: "uppercase", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
                            {sponsorText || "SPONSOR"}
                        </text>
                    </g>
                )}

                {/* ─── NUMBER (Back Only) ─── */}
                {isBack && playerNumber && (
                    <g transform="translate(150, 200)">
                        <text textAnchor="middle" fill="white" fontSize="120" fontWeight="900" style={{ fontFamily: "Impact, sans-serif", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>
                            {playerNumber}
                        </text>
                    </g>
                )}

                {/* ─── PLAYER NAME (Back Only) ─── */}
                {isBack && playerName && (
                    <g transform="translate(150, 80)">
                        <text textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" letterSpacing="2" style={{ textTransform: "uppercase", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
                            {playerName}
                        </text>
                    </g>
                )}

                {/* ─── TEAM NAME (Front/Back?) ─── */}
                {teamName && (
                    <g transform="translate(150, 350)">
                        <text textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontWeight="bold" letterSpacing="1" style={{ textTransform: "uppercase" }}>
                            {teamName}
                        </text>
                    </g>
                )}

            </svg>

            {/* View Toggle */}
            <button
                onClick={() => setView(view === "front" ? "back" : "front")}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/10 z-10 shadow-lg"
                title="Rotate View"
            >
                <RotateCw className="w-5 h-5" />
            </button>

            {/* Garment Label */}
            <div className="absolute top-2 left-2">
                <span className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-white/70 font-bold">
                    {view} view
                </span>
            </div>
        </div>
    );
}
