"use client";

import { Shield } from "lucide-react";

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
}: JerseyPreviewProps) {

    // Generate pattern fill as SVG defs
    const patternId = "jersey-pattern";
    const patternDef = (): React.ReactNode => {
        switch (pattern) {
            case "stripes":
                return (
                    <pattern id={patternId} width="40" height="10" patternUnits="userSpaceOnUse">
                        <rect width="20" height="10" fill={primaryColor} />
                        <rect x="20" width="20" height="10" fill={secondaryColor} />
                    </pattern>
                );
            case "hoops":
                return (
                    <pattern id={patternId} width="10" height="40" patternUnits="userSpaceOnUse">
                        <rect width="10" height="20" fill={primaryColor} />
                        <rect y="20" width="10" height="20" fill={secondaryColor} />
                    </pattern>
                );
            case "half-half":
                return (
                    <linearGradient id={patternId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="50%" stopColor={primaryColor} />
                        <stop offset="50%" stopColor={secondaryColor} />
                    </linearGradient>
                );
            case "gradient":
                return (
                    <linearGradient id={patternId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={primaryColor} />
                        <stop offset="100%" stopColor={secondaryColor} />
                    </linearGradient>
                );
            case "chevron":
                return (
                    <>
                        <linearGradient id={patternId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="40%" stopColor={primaryColor} />
                            <stop offset="40%" stopColor={secondaryColor} />
                            <stop offset="60%" stopColor={secondaryColor} />
                            <stop offset="60%" stopColor={primaryColor} />
                            <stop offset="100%" stopColor={primaryColor} />
                        </linearGradient>
                    </>
                );
            case "sash":
                return (
                    <linearGradient id={patternId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="25%" stopColor={primaryColor} />
                        <stop offset="25%" stopColor={secondaryColor} />
                        <stop offset="75%" stopColor={secondaryColor} />
                        <stop offset="75%" stopColor={primaryColor} />
                    </linearGradient>
                );
            case "pinstripe":
                return (
                    <pattern id={patternId} width="12" height="10" patternUnits="userSpaceOnUse">
                        <rect width="10" height="10" fill={primaryColor} />
                        <rect x="10" width="2" height="10" fill={secondaryColor} />
                    </pattern>
                );
            case "block":
                return (
                    <linearGradient id={patternId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="50%" stopColor={primaryColor} />
                        <stop offset="50%" stopColor={secondaryColor} />
                    </linearGradient>
                );
            case "diamond":
                return (
                    <pattern id={patternId} width="30" height="30" patternUnits="userSpaceOnUse">
                        <rect width="30" height="30" fill={primaryColor} />
                        <polygon points="15,0 30,15 15,30 0,15" fill={secondaryColor} opacity="0.5" />
                    </pattern>
                );
            case "camo":
                return (
                    <pattern id={patternId} width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill={primaryColor} />
                        <circle cx="15" cy="15" r="12" fill={secondaryColor} opacity="0.5" />
                        <circle cx="40" cy="35" r="10" fill={secondaryColor} opacity="0.4" />
                        <circle cx="5" cy="40" r="8" fill={secondaryColor} opacity="0.3" />
                    </pattern>
                );
            default:
                return null;
        }
    };

    const fillRef = pattern === "solid" ? primaryColor : `url(#${patternId})`;

    return (
        <div className="relative w-full">
            <svg viewBox="0 0 300 380" className="w-full h-auto drop-shadow-2xl">
                <defs>
                    {patternDef()}
                    {/* Subtle shadow filter */}
                    <filter id="jersey-shadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* ─── JERSEY BODY ─── */}
                {/* Main body + sleeves as one continuous path */}
                <path
                    d={`
                        M 105 45
                        L 80 55
                        L 25 85
                        L 10 120
                        L 30 135
                        L 55 100
                        L 55 340
                        L 245 340
                        L 245 100
                        L 270 135
                        L 290 120
                        L 275 85
                        L 220 55
                        L 195 45
                        C 185 35, 175 30, 150 28
                        C 125 30, 115 35, 105 45
                        Z
                    `}
                    fill={fillRef}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1.5"
                    filter="url(#jersey-shadow)"
                />

                {/* ─── COLLAR ─── */}
                {collar.includes("V-Neck") ? (
                    // V-Neck
                    <path
                        d="M 125 45 L 150 80 L 175 45"
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ) : collar.includes("Polo") || collar.includes("Traditional") ? (
                    // Polo / Traditional collar
                    <>
                        <path
                            d="M 115 46 C 115 30, 185 30, 185 46"
                            fill={accentColor}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1"
                        />
                        <path
                            d="M 140 46 L 140 65 M 160 46 L 160 65"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1.5"
                        />
                    </>
                ) : collar.includes("Grandad") || collar.includes("Henley") || collar.includes("Mandarin") ? (
                    // Grandad / Henley collar
                    <>
                        <path
                            d="M 120 44 C 120 28, 180 28, 180 44"
                            fill={accentColor}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1"
                        />
                        <line x1="150" y1="36" x2="150" y2="60" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                    </>
                ) : collar.includes("Half-Zip") ? (
                    // Half-Zip
                    <>
                        <path
                            d="M 118 44 C 118 28, 182 28, 182 44"
                            fill={accentColor}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1"
                        />
                        <line x1="150" y1="32" x2="150" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="3 2" />
                        <rect x="146" y="90" width="8" height="10" rx="2" fill="rgba(255,255,255,0.5)" />
                    </>
                ) : (
                    // Default: Crew neck
                    <ellipse
                        cx="150" cy="42"
                        rx="30" ry="12"
                        fill={accentColor}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                    />
                )}

                {/* ─── SLEEVE SEAM LINES ─── */}
                <line x1="55" y1="100" x2="80" y2="55" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="245" y1="100" x2="220" y2="55" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* ─── HEM LINE ─── */}
                <line x1="55" y1="338" x2="245" y2="338" stroke={accentColor} strokeWidth="3" opacity="0.7" />

                {/* ─── SLEEVE CUFFS ─── */}
                <line x1="10" y1="120" x2="30" y2="135" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
                <line x1="290" y1="120" x2="270" y2="135" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />

                {/* ─── CREST ─── */}
                {showCrest && (
                    <g transform="translate(75, 80)">
                        <rect width="35" height="35" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                        <g transform="translate(17.5, 17.5)">
                            {/* Shield icon approximation */}
                            <path d="M-8,-10 L8,-10 L10,-2 L0,12 L-10,-2 Z" fill="rgba(255,255,255,0.4)" />
                        </g>
                    </g>
                )}

                {/* ─── SPONSOR ─── */}
                {showSponsor && (
                    <g>
                        <rect x="100" y="85" width="100" height="24" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text x="150" y="101" textAnchor="middle" className="fill-white/80 text-[11px] font-bold uppercase" style={{ fontFamily: "system-ui" }}>
                            {sponsorText || "SPONSOR"}
                        </text>
                    </g>
                )}

                {/* ─── PLAYER NUMBER (large, center) ─── */}
                {playerNumber && (
                    <text
                        x="150" y="220"
                        textAnchor="middle"
                        className="fill-white/70"
                        style={{ fontSize: "90px", fontWeight: 900, fontFamily: "system-ui" }}
                    >
                        {playerNumber}
                    </text>
                )}

                {/* ─── TEAM NAME ─── */}
                {teamName && (
                    <text
                        x="150" y={playerNumber ? "270" : "200"}
                        textAnchor="middle"
                        className="fill-white"
                        style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", fontFamily: "system-ui" }}
                    >
                        {teamName}
                    </text>
                )}

                {/* ─── PLAYER NAME ─── */}
                {playerName && (
                    <text
                        x="150" y="310"
                        textAnchor="middle"
                        className="fill-white/90"
                        style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", fontFamily: "system-ui" }}
                    >
                        {playerName}
                    </text>
                )}

                {/* ─── SUBTLE FABRIC TEXTURE ─── */}
                <path
                    d={`
                        M 105 45 L 80 55 L 25 85 L 10 120 L 30 135 L 55 100 L 55 340
                        L 245 340 L 245 100 L 270 135 L 290 120 L 275 85 L 220 55 L 195 45
                        C 185 35, 175 30, 150 28 C 125 30, 115 35, 105 45 Z
                    `}
                    fill="url(#fabric-texture)"
                    opacity="0.05"
                />
                <defs>
                    <pattern id="fabric-texture" width="4" height="4" patternUnits="userSpaceOnUse">
                        <rect width="2" height="2" fill="white" />
                    </pattern>
                </defs>
            </svg>

            {/* Garment label below */}
            <div className="text-center mt-2">
                <span className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest text-white/60 font-bold">
                    {garmentLabel}
                </span>
            </div>
        </div>
    );
}
