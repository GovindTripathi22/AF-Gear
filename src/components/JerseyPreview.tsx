"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { RotateCw } from "lucide-react";

interface JerseyPreviewProps {
    colors: Record<string, string>;
    pattern: string;
    collar: string;
    teamName: string;
    playerName: string;
    playerNumber: string;
    showCrest: boolean;
    sponsorText: string;
    showSponsor: boolean;
    garmentLabel?: string;
    texture?: string;
    sleeveStyle?: string;
    baseImage?: string;
}

export function JerseyPreview({
    colors,
    pattern,
    collar,
    teamName,
    playerName,
    playerNumber,
    showCrest,
    sponsorText,
    showSponsor,
    garmentLabel = "Custom Jersey",
    texture = "smooth",
    sleeveStyle = "short",
    baseImage,
}: JerseyPreviewProps) {
    const [view, setView] = useState<"front" | "back">("front");
    const isBack = view === "back";

    // Defaults
    const defaultColor = "#ffffff";
    const getZoneColor = (zone: string) => colors[zone] || defaultColor;

    // Sleeve Logic
    const isLong = sleeveStyle === "long";
    const sleeveExt = isLong ? 60 : 0;
    const sleeveW = 250 + sleeveExt;
    const cuffW = isLong ? 20 : 15;

    // ─── PATH DEFINITIONS ───
    // ... (Keep existing definitions)

    // Shoulders (Yoke)
    const shouldersPath = `
        M 80 0 
        L 220 0 
        L 235 15 
        L 220 50 
        Q 150 70 80 50 
        L 65 15 
        Z
    `;

    // Sleeves (Left & Right)
    const sleeveLeftPath = `
        M 65 15 
        L 80 50 
        L 70 110 
        Q ${300 - sleeveW + 10} 100 ${300 - sleeveW} 90 
        L ${300 - sleeveW} 20 
        L 50 20 
        Z
    `;
    const sleeveRightPath = `
        M 235 15 
        L 220 50 
        L 230 110 
        Q ${sleeveW - 10} 100 ${sleeveW} 90
        L ${sleeveW} 20
        L 250 20
        Z
    `;

    const cuffLeftPath = `
        M ${300 - sleeveW} 20
        L ${300 - sleeveW} 90
        L ${300 - sleeveW - cuffW} 85
        L ${300 - sleeveW - cuffW} 20
        Z
    `;

    const cuffRightPath = `
        M ${sleeveW} 20
        L ${sleeveW} 90
        L ${sleeveW + cuffW} 85
        L ${sleeveW + cuffW} 20
        Z
    `;

    // Main Body
    const bodyPath = `
        M 80 50
        Q 150 70 220 50
        L 230 110
        Q 220 250 230 400
        L 70 400
        Q 80 250 70 110
        Z
    `;

    // Side Panels
    const sidePanelLeftPath = `
        M 70 110
        Q 80 250 70 400
        L 85 400
        Q 95 250 85 110
        Z
    `;
    const sidePanelRightPath = `
        M 230 110
        Q 220 250 230 400
        L 215 400
        Q 205 250 215 110
        Z
    `;


    // Pattern ID
    const patternId = isBack ? "jersey-pattern-back" : "jersey-pattern-front";

    const patternDef = (): ReactNode => {
        // ... (Keep existing pattern defs)
        const primaryColor = getZoneColor("body");
        const secondaryColor = getZoneColor("shoulders");

        const pDef = (id: string) => {
            switch (pattern) {
                // ... (Keep enum cases)
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
                case "chelsea":
                case "chevron":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="30%" stopColor={primaryColor} />
                            <stop offset="50%" stopColor={secondaryColor} />
                            <stop offset="70%" stopColor={primaryColor} />
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
                default:
                    return null;
            }
        };
        return pDef(patternId);
    };

    const fillBody = pattern === "solid" ? getZoneColor("body") : `url(#${patternId})`;

    // Texture function
    const textureDef = (): ReactNode => {
        return (
            <pattern id="tex-mesh" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.5" fill="black" opacity="0.1" />
            </pattern>
        );
    };
    const texId = texture !== "smooth" ? `url(#tex-mesh)` : "none";


    // Generate a unique ID for the mask to prevent collisions
    const maskId = `jersey-mask-${isBack ? 'back' : 'front'}`;

    // Loading State for the mask image
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Reset loading state if baseImage changes
    useEffect(() => {
        setIsImageLoaded(false);
    }, [baseImage]);

    return (
        <div className="relative w-full h-full group flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden shadow-inner isolate">

            {/* 1. COLOR LAYER (Masked by CSS) */}
            {/* The colors are drawn here, but we use CSS to invisibly 'cut' them to the shirt shape */}
            <div
                className={`absolute inset-0 z-10 w-full h-full transition-opacity duration-500 ${isImageLoaded || !baseImage ? "opacity-100" : "opacity-0"}`}
                style={baseImage && isImageLoaded ? {
                    maskImage: `url(${baseImage}?v4)`,
                    WebkitMaskImage: `url(${baseImage}?v4)`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                } : {}}
            >
                {/* SVG Colors - Scaled up to ensure they fill the mask completely */}
                <svg viewBox="0 0 300 450" className="w-full h-full object-contain transform scale-105" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        {patternDef()}
                    </defs>
                    <g style={{ mixBlendMode: 'multiply' }}>
                        {/* Zones */}
                        <path d={sleeveLeftPath} fill={getZoneColor("sleeves")} />
                        <path d={sleeveRightPath} fill={getZoneColor("sleeves")} />
                        <path d={sidePanelLeftPath} fill={getZoneColor("sidePanels")} />
                        <path d={sidePanelRightPath} fill={getZoneColor("sidePanels")} />
                        <path d={bodyPath} fill={fillBody} />
                        <path d={shouldersPath} fill={getZoneColor("shoulders")} />
                        <path d={cuffLeftPath} fill={getZoneColor("cuffs")} />
                        <path d={cuffRightPath} fill={getZoneColor("cuffs")} />
                    </g>

                    {/* Collar - Kept separate or included? Included for better masking */}
                    <g style={{ mixBlendMode: 'multiply' }}>
                        {isBack ? (
                            <path d="M 80 0 Q 150 15 220 0" fill="none" stroke={getZoneColor("collar")} strokeWidth="6" strokeLinecap="round" />
                        ) : (
                            <path d="M 150 50 L 110 0 L 190 0 L 150 50" fill={getZoneColor("collar")} />
                        )}
                    </g>
                </svg>
            </div>

            {/* 2. TEXTURE LAYER (The Base Image) */}
            {/* Sits ON TOP. Multiply mode adds shadows/folds TO the colors below. */}
            {baseImage && (
                <div className="absolute inset-0 z-20 pointer-events-none w-full h-full flex items-center justify-center">
                    <img
                        src={`${baseImage}?v4`}
                        alt="Jersey Shadow"
                        className="w-full h-full object-contain mix-blend-multiply opacity-100"
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => setIsImageLoaded(false)}
                    />
                </div>
            )}


            {/* 3. LOGOS & TEXT LAYER (Top - Unmasked because they might need to "pop" or sit slightly differently) */}
            <div className="absolute inset-0 z-30 pointer-events-none w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 300 450" className="w-full h-full object-contain">

                    {/* ─── CREST ─── */}
                    {!isBack && showCrest && (
                        <g transform="translate(200, 35)">
                            <image href="/assets/af-logo.png" x="0" y="0" width="30" height="30" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
                        </g>
                    )}

                    {/* ─── SPONSOR ─── */}
                    {!isBack && showSponsor && (
                        <g transform="translate(150, 180)">
                            <text textAnchor="middle" fill="white" fontSize={Math.min(28, 200 / (sponsorText.length || 1) * 2)} fontWeight="900" style={{ textTransform: "uppercase", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
                                {sponsorText || "SPONSOR"}
                            </text>
                        </g>
                    )}

                    {/* ─── BACK DETAILS ─── */}
                    {isBack && playerNumber && (
                        <g transform="translate(150, 220)">
                            <text textAnchor="middle" fill="white" fontSize="140" fontWeight="900" style={{ fontFamily: "Impact, sans-serif", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>
                                {playerNumber}
                            </text>
                        </g>
                    )}

                    {isBack && playerName && (
                        <g transform="translate(150, 100)">
                            <text textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" letterSpacing="2" style={{ textTransform: "uppercase", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
                                {playerName}
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* View Toggle */}
            <button
                onClick={() => setView(view === "front" ? "back" : "front")}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/10 z-40 shadow-lg"
                title="Rotate View"
            >
                <RotateCw className="w-5 h-5" />
            </button>
        </div>
    );
}
