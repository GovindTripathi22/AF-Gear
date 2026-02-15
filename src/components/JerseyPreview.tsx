"use client";

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

    const patternId = "jersey-pattern";
    const patternDef = (): React.ReactNode => {
        switch (pattern) {
            case "stripes":
                return (
                    <pattern id={patternId} width="36" height="10" patternUnits="userSpaceOnUse">
                        <rect width="18" height="10" fill={primaryColor} />
                        <rect x="18" width="18" height="10" fill={secondaryColor} />
                    </pattern>
                );
            case "hoops":
                return (
                    <pattern id={patternId} width="10" height="36" patternUnits="userSpaceOnUse">
                        <rect width="10" height="18" fill={primaryColor} />
                        <rect y="18" width="10" height="18" fill={secondaryColor} />
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
                    <linearGradient id={patternId} x1="0" y1="0" x2="0" y2="1">
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
                    <linearGradient id={patternId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="20%" stopColor={primaryColor} />
                        <stop offset="25%" stopColor={secondaryColor} />
                        <stop offset="75%" stopColor={secondaryColor} />
                        <stop offset="80%" stopColor={primaryColor} />
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
                        <stop offset="48%" stopColor={primaryColor} />
                        <stop offset="52%" stopColor={secondaryColor} />
                    </linearGradient>
                );
            case "diamond":
                return (
                    <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
                        <rect width="24" height="24" fill={primaryColor} />
                        <polygon points="12,0 24,12 12,24 0,12" fill={secondaryColor} opacity="0.55" />
                    </pattern>
                );
            case "camo":
                return (
                    <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect width="40" height="40" fill={primaryColor} />
                        <ellipse cx="12" cy="12" rx="11" ry="8" fill={secondaryColor} opacity="0.45" />
                        <ellipse cx="32" cy="28" rx="9" ry="7" fill={secondaryColor} opacity="0.35" />
                        <ellipse cx="4" cy="34" rx="7" ry="6" fill={secondaryColor} opacity="0.25" />
                        <ellipse cx="28" cy="6" rx="6" ry="5" fill={secondaryColor} opacity="0.3" />
                    </pattern>
                );
            case "lightning":
                return (
                    <linearGradient id={patternId} x1="0" y1="0" x2="1" y2="1">
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

    const fillRef = pattern === "solid" ? primaryColor : `url(#${patternId})`;

    // Texture overlay pattern
    const textureDef = (): React.ReactNode => {
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

    // Longer sleeves path
    const isLong = sleeveStyle === "long";

    const bodyPath = isLong
        ? `M 105 45 L 78 56 L 15 95 L -5 165 L 22 175 L 50 110 L 50 340 L 250 340 L 250 110 L 278 175 L 305 165 L 285 95 L 222 56 L 195 45 C 185 35, 175 30, 150 28 C 125 30, 115 35, 105 45 Z`
        : `M 105 45 L 80 55 L 25 85 L 10 125 L 32 137 L 55 102 L 55 340 L 245 340 L 245 102 L 268 137 L 290 125 L 275 85 L 220 55 L 195 45 C 185 35, 175 30, 150 28 C 125 30, 115 35, 105 45 Z`;

    const leftCuffStart = isLong ? "-5,165" : "10,125";
    const leftCuffEnd = isLong ? "22,175" : "32,137";
    const rightCuffStart = isLong ? "305,165" : "290,125";
    const rightCuffEnd = isLong ? "278,175" : "268,137";
    const leftSeam = isLong ? { x1: 50, y1: 110, x2: 78, y2: 56 } : { x1: 55, y1: 102, x2: 80, y2: 55 };
    const rightSeam = isLong ? { x1: 250, y1: 110, x2: 222, y2: 56 } : { x1: 245, y1: 102, x2: 220, y2: 55 };
    const bottomLeft = isLong ? 50 : 55;
    const bottomRight = isLong ? 250 : 245;

    return (
        <div className="relative w-full">
            <svg viewBox="-10 0 320 400" className="w-full h-auto" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}>
                <defs>
                    {patternDef()}
                    {textureDef()}

                    {/* Shadow filter for 3D depth */}
                    <filter id="inner-shadow" x="-10%" y="-10%" width="140%" height="140%">
                        <feComponentTransfer in="SourceAlpha">
                            <feFuncA type="table" tableValues="1 0" />
                        </feComponentTransfer>
                        <feGaussianBlur stdDeviation="8" />
                        <feOffset dx="4" dy="6" result="offsetblur" />
                        <feFlood floodColor="rgba(0,0,0,0.35)" result="color" />
                        <feComposite in2="offsetblur" operator="in" />
                        <feComposite in2="SourceAlpha" operator="in" />
                        <feMerge>
                            <feMergeNode in="SourceGraphic" />
                            <feMergeNode />
                        </feMerge>
                    </filter>

                    {/* Highlight gradient for 3D effect */}
                    <linearGradient id="highlight-lr" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="white" stopOpacity="0.12" />
                        <stop offset="25%" stopColor="white" stopOpacity="0" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.06" />
                        <stop offset="75%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.15" />
                    </linearGradient>

                    {/* Top-bottom shading for depth */}
                    <linearGradient id="shade-tb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.08" />
                        <stop offset="15%" stopColor="white" stopOpacity="0.02" />
                        <stop offset="50%" stopColor="black" stopOpacity="0" />
                        <stop offset="85%" stopColor="black" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.12" />
                    </linearGradient>

                    {/* Fold lines */}
                    <linearGradient id="fold-center" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="black" stopOpacity="0" />
                        <stop offset="48%" stopColor="black" stopOpacity="0.04" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.06" />
                        <stop offset="52%" stopColor="black" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="black" stopOpacity="0" />
                    </linearGradient>

                    {/* Side shadow gradients for sleeve depth */}
                    <radialGradient id="left-sleeve-shadow" cx="1" cy="0.3" r="1.2">
                        <stop offset="0%" stopColor="black" stopOpacity="0" />
                        <stop offset="70%" stopColor="black" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                    </radialGradient>
                    <radialGradient id="right-sleeve-shadow" cx="0" cy="0.3" r="1.2">
                        <stop offset="0%" stopColor="black" stopOpacity="0" />
                        <stop offset="70%" stopColor="black" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                    </radialGradient>

                    {/* Clip path for jersey shape */}
                    <clipPath id="jersey-clip">
                        <path d={bodyPath} />
                    </clipPath>
                </defs>

                {/* ─── JERSEY BODY ─── */}
                <path
                    d={bodyPath}
                    fill={fillRef}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="1"
                    filter="url(#inner-shadow)"
                />

                {/* ─── TEXTURE OVERLAY ─── */}
                {texture !== "smooth" && (
                    <path d={bodyPath} fill={texId} />
                )}

                {/* ─── LEFT-RIGHT HIGHLIGHT (3D cylindrical shading) ─── */}
                <path d={bodyPath} fill="url(#highlight-lr)" />

                {/* ─── TOP-BOTTOM SHADING ─── */}
                <path d={bodyPath} fill="url(#shade-tb)" />

                {/* ─── CENTER FOLD LINE ─── */}
                <rect x="145" y="50" width="10" height="280" fill="url(#fold-center)" clipPath="url(#jersey-clip)" />

                {/* ─── SHOULDER FOLDS ─── */}
                <g clipPath="url(#jersey-clip)" opacity="0.5">
                    {/* Left shoulder fold */}
                    <line x1="105" y1="48" x2="90" y2="100" stroke="white" strokeWidth="0.6" opacity="0.08" />
                    <line x1="100" y1="50" x2="85" y2="105" stroke="black" strokeWidth="0.6" opacity="0.06" />
                    {/* Right shoulder fold */}
                    <line x1="195" y1="48" x2="210" y2="100" stroke="white" strokeWidth="0.6" opacity="0.08" />
                    <line x1="200" y1="50" x2="215" y2="105" stroke="black" strokeWidth="0.6" opacity="0.06" />
                </g>

                {/* ─── SLEEVE SHADOWS ─── */}
                <g clipPath="url(#jersey-clip)">
                    <rect x="-10" y="40" width="80" height="120" fill="url(#left-sleeve-shadow)" />
                    <rect x="230" y="40" width="80" height="120" fill="url(#right-sleeve-shadow)" />
                </g>

                {/* ─── SIDE SEAM STITCHING ─── */}
                <g clipPath="url(#jersey-clip)">
                    <line x1={bottomLeft} y1="105" x2={bottomLeft} y2="340" stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeDasharray="4 3" />
                    <line x1={bottomLeft + 1} y1="105" x2={bottomLeft + 1} y2="340" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4 3" />
                    <line x1={bottomRight} y1="105" x2={bottomRight} y2="340" stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeDasharray="4 3" />
                    <line x1={bottomRight - 1} y1="105" x2={bottomRight - 1} y2="340" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4 3" />
                </g>

                {/* ─── SLEEVE SEAM LINES ─── */}
                <line x1={leftSeam.x1} y1={leftSeam.y1} x2={leftSeam.x2} y2={leftSeam.y2} stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
                <line x1={leftSeam.x1 + 1} y1={leftSeam.y1} x2={leftSeam.x2 + 1} y2={leftSeam.y2} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1={rightSeam.x1} y1={rightSeam.y1} x2={rightSeam.x2} y2={rightSeam.y2} stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
                <line x1={rightSeam.x1 - 1} y1={rightSeam.y1} x2={rightSeam.x2 - 1} y2={rightSeam.y2} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                {/* ─── COLLAR ─── */}
                {collar.includes("V-Neck") ? (
                    <g>
                        <path d="M 128 46 L 150 82 L 172 46" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 130 47 L 150 78 L 170 47" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    </g>
                ) : collar.includes("Polo") || collar.includes("Traditional") ? (
                    <g>
                        <path d="M 112 46 C 110 26, 190 26, 188 46" fill={accentColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        <path d="M 113 44 C 112 28, 188 28, 187 44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                        {/* Collar fold */}
                        <path d="M 125 42 L 125 55 M 175 42 L 175 55" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                        {/* Placket */}
                        <line x1="150" y1="46" x2="150" y2="72" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                        <line x1="151" y1="46" x2="151" y2="72" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                        {/* Buttons */}
                        <circle cx="150" cy="54" r="2" fill="rgba(255,255,255,0.3)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                        <circle cx="150" cy="65" r="2" fill="rgba(255,255,255,0.3)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                    </g>
                ) : collar.includes("Grandad") || collar.includes("Henley") || collar.includes("Mandarin") ? (
                    <g>
                        <path d="M 118 44 C 117 26, 183 26, 182 44" fill={accentColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        <path d="M 119 42 C 118 28, 182 28, 181 42" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
                        <line x1="150" y1="34" x2="150" y2="62" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                        <circle cx="150" cy="42" r="1.5" fill="rgba(255,255,255,0.25)" />
                        <circle cx="150" cy="52" r="1.5" fill="rgba(255,255,255,0.25)" />
                    </g>
                ) : collar.includes("Half-Zip") ? (
                    <g>
                        <path d="M 116 44 C 115 25, 185 25, 184 44" fill={accentColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        <path d="M 117 42 C 116 27, 184 27, 183 42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        {/* Zip track */}
                        <line x1="150" y1="30" x2="150" y2="105" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                        <line x1="150.5" y1="30" x2="150.5" y2="105" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                        {/* Zip teeth */}
                        {[35, 42, 49, 56, 63, 70, 77, 84, 91, 98].map(y => (
                            <g key={y}>
                                <line x1="148" y1={y} x2="150" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                                <line x1="150" y1={y} x2="152" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                            </g>
                        ))}
                        {/* Zip pull */}
                        <rect x="147" y="95" width="6" height="10" rx="2" fill="rgba(200,200,200,0.6)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                        <line x1="150" y1="97" x2="150" y2="103" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                    </g>
                ) : (
                    // Default: Crew neck
                    <g>
                        <ellipse cx="150" cy="42" rx="28" ry="13" fill={accentColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        <ellipse cx="150" cy="42" rx="26" ry="11" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        {/* Inner shadow of neckhole */}
                        <ellipse cx="150" cy="44" rx="20" ry="8" fill="rgba(0,0,0,0.3)" />
                        <ellipse cx="150" cy="43" rx="18" ry="7" fill="rgba(0,0,0,0.5)" />
                        {/* Neck ribbing */}
                        <ellipse cx="150" cy="42" rx="28" ry="13" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeDasharray="2 1.5" />
                    </g>
                )}

                {/* ─── HEM BAND ─── */}
                <g clipPath="url(#jersey-clip)">
                    <rect x={bottomLeft} y="332" width={bottomRight - bottomLeft} height="8" fill={accentColor} opacity="0.8" />
                    <rect x={bottomLeft} y="332" width={bottomRight - bottomLeft} height="8" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                    {/* Hem ribbing texture */}
                    <rect x={bottomLeft} y="332" width={bottomRight - bottomLeft} height="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="2 1.5" />
                </g>

                {/* ─── SLEEVE CUFF BANDS ─── */}
                <g>
                    <line x1={leftCuffStart.split(",")[0]} y1={leftCuffStart.split(",")[1]} x2={leftCuffEnd.split(",")[0]} y2={leftCuffEnd.split(",")[1]} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
                    <line x1={leftCuffStart.split(",")[0]} y1={leftCuffStart.split(",")[1]} x2={leftCuffEnd.split(",")[0]} y2={leftCuffEnd.split(",")[1]} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                </g>
                <g>
                    <line x1={rightCuffStart.split(",")[0]} y1={rightCuffStart.split(",")[1]} x2={rightCuffEnd.split(",")[0]} y2={rightCuffEnd.split(",")[1]} stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
                    <line x1={rightCuffStart.split(",")[0]} y1={rightCuffStart.split(",")[1]} x2={rightCuffEnd.split(",")[0]} y2={rightCuffEnd.split(",")[1]} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                </g>

                {/* ─── ARMPIT SHADOW ─── */}
                <g clipPath="url(#jersey-clip)" opacity="0.6">
                    <ellipse cx={bottomLeft + 5} cy="108" rx="15" ry="8" fill="rgba(0,0,0,0.1)" />
                    <ellipse cx={bottomRight - 5} cy="108" rx="15" ry="8" fill="rgba(0,0,0,0.1)" />
                </g>

                {/* ─── CREST ─── */}
                {showCrest && (
                    <g transform="translate(75, 82)">
                        <rect width="32" height="32" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                        <path d="M16,4 L26,8 L26,18 C26,24 16,28 16,28 C16,28 6,24 6,18 L6,8 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                        <text x="16" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: "8px", fontWeight: 700 }}>AF</text>
                    </g>
                )}

                {/* ─── SPONSOR ─── */}
                {showSponsor && (
                    <g>
                        <rect x="95" y="86" width="110" height="26" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />
                        <text x="150" y="103" textAnchor="middle" fill="rgba(255,255,255,0.75)" style={{ fontSize: "11px", fontWeight: 800, fontFamily: "system-ui", letterSpacing: "1px", textTransform: "uppercase" as const }}>
                            {(sponsorText || "SPONSOR").slice(0, 16)}
                        </text>
                    </g>
                )}

                {/* ─── PLAYER NUMBER ─── */}
                {playerNumber && (
                    <g>
                        {/* Number shadow */}
                        <text x="152" y="222" textAnchor="middle" fill="rgba(0,0,0,0.3)" style={{ fontSize: "85px", fontWeight: 900, fontFamily: "system-ui" }}>
                            {playerNumber}
                        </text>
                        {/* Number body */}
                        <text x="150" y="220" textAnchor="middle" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" style={{ fontSize: "85px", fontWeight: 900, fontFamily: "system-ui" }}>
                            {playerNumber}
                        </text>
                    </g>
                )}

                {/* ─── TEAM NAME ─── */}
                {teamName && (
                    <g>
                        <text x="151" y={playerNumber ? "268" : "198"} textAnchor="middle" fill="rgba(0,0,0,0.3)" style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase" as const, fontFamily: "system-ui" }}>
                            {teamName.slice(0, 20)}
                        </text>
                        <text x="150" y={playerNumber ? "267" : "197"} textAnchor="middle" fill="white" style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase" as const, fontFamily: "system-ui" }}>
                            {teamName.slice(0, 20)}
                        </text>
                    </g>
                )}

                {/* ─── PLAYER NAME ─── */}
                {playerName && (
                    <g>
                        <text x="151" y="308" textAnchor="middle" fill="rgba(0,0,0,0.3)" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase" as const, fontFamily: "system-ui" }}>
                            {playerName.slice(0, 14)}
                        </text>
                        <text x="150" y="307" textAnchor="middle" fill="rgba(255,255,255,0.9)" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase" as const, fontFamily: "system-ui" }}>
                            {playerName.slice(0, 14)}
                        </text>
                    </g>
                )}

                {/* ─── SUBTLE SPECULAR HIGHLIGHT ─── */}
                <g clipPath="url(#jersey-clip)" opacity="0.3">
                    <ellipse cx="130" cy="120" rx="50" ry="80" fill="white" opacity="0.03" />
                </g>

                {/* ─── OUTER EDGE HIGHLIGHT ─── */}
                <path d={bodyPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            </svg>

            {/* Garment label */}
            <div className="text-center mt-3">
                <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest text-white/50 font-bold">
                    {garmentLabel}
                </span>
            </div>
        </div>
    );
}
