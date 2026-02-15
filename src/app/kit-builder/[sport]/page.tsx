"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSportById, SPORT_COLORS } from "@/lib/kit-builder-config";
import type { ColorOption } from "@/lib/kit-builder-config";
import { JerseyPreview } from "@/components/JerseyPreview";
import {
    Shirt, Paintbrush, Type, Layers, Check,
    ChevronRight, ChevronLeft, RotateCcw,
    Shield, Palette, ShoppingBag,
    Scissors, Ruler
} from "lucide-react";

const STEPS = [
    { id: 1, label: "Garment", icon: Shirt },
    { id: 2, label: "Fabric", icon: Scissors },
    { id: 3, label: "Design", icon: Paintbrush },
    { id: 4, label: "Personalise", icon: Type },
    { id: 5, label: "Sizing", icon: Ruler },
    { id: 6, label: "Review", icon: Check },
];

export default function SportCustomisePage() {
    const params = useParams();
    const sportId = params.sport as string;
    const sport = getSportById(sportId);

    // Step state
    const [step, setStep] = useState(1);

    // Step 1: Garment(s)
    const [selectedGarments, setSelectedGarments] = useState<string[]>([]);

    // Step 2: Fabric
    const [fabric, setFabric] = useState("standard");

    // Step 3: Design
    const [primaryColor, setPrimaryColor] = useState<ColorOption>(SPORT_COLORS[0]);
    const [secondaryColor, setSecondaryColor] = useState<ColorOption>(SPORT_COLORS[1]);
    const [accentColor, setAccentColor] = useState<ColorOption>(SPORT_COLORS[3]);
    const [pattern, setPattern] = useState("solid");
    const [collar, setCollar] = useState("");
    const [texture, setTexture] = useState("smooth");
    const [sleeveStyle, setSleeveStyle] = useState("short");

    // Step 4: Personalise
    const [teamName, setTeamName] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerNumber, setPlayerNumber] = useState("");
    const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({});
    const [sponsorText, setSponsorText] = useState("");
    const [notes, setNotes] = useState("");

    // Step 5: Sizing
    const [sizeCategory, setSizeCategory] = useState("Adults");
    const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

    const toggleGarment = (id: string) => {
        setSelectedGarments(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const toggleFeature = (id: string) => {
        setEnabledFeatures(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const adjustSize = (size: string, delta: number) => {
        setSelectedSizes(prev => {
            const current = prev[size] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const { [size]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [size]: next };
        });
    };

    if (!sport) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-4">Sport Not Found</h1>
                    <Link href="/kit-builder" className="text-primary hover:underline">Back to Kit Builder</Link>
                </div>
            </main>
        );
    }

    // Calculations
    const totalQty = Object.values(selectedSizes).reduce((a, b) => a + b, 0);
    const fabricAddon = sport.fabrics.find(f => f.id === fabric)?.priceAddon || 0;
    const featureAddon = sport.features
        .filter(f => enabledFeatures[f.id])
        .reduce((sum, f) => sum + f.price, 0);
    const nameAddon = playerName ? 4 : 0;
    const numberAddon = playerNumber ? 2 : 0;

    const garmentBaseTotal = selectedGarments.reduce((sum, gId) => {
        const g = sport.garments.find(ga => ga.id === gId);
        return sum + (g?.basePrice || 0);
    }, 0);

    const unitPrice = garmentBaseTotal + fabricAddon + featureAddon + nameAddon + numberAddon;
    const totalPrice = unitPrice * Math.max(totalQty, 1);

    const TEXTURES = [
        { id: "smooth", name: "Smooth", desc: "Clean, flat surface" },
        { id: "mesh", name: "Mesh", desc: "Air-flow perforated" },
        { id: "honeycomb", name: "Honeycomb", desc: "Hexagonal texture" },
        { id: "carbon", name: "Carbon Fibre", desc: "Racing-grade weave" },
        { id: "dots", name: "Micro Dots", desc: "Subtle dot texture" },
        { id: "lines", name: "Diagonal Lines", desc: "45° line texture" },
        { id: "knit", name: "Knit", desc: "Woven fabric look" },
    ];

    const SLEEVE_STYLES = [
        { id: "short", name: "Short Sleeve" },
        { id: "long", name: "Long Sleeve" },
    ];

    const reset = () => {
        setStep(1);
        setSelectedGarments([]);
        setFabric("standard");
        setPrimaryColor(SPORT_COLORS[0]);
        setSecondaryColor(SPORT_COLORS[1]);
        setAccentColor(SPORT_COLORS[3]);
        setPattern("solid");
        setCollar("");
        setTexture("smooth");
        setSleeveStyle("short");
        setTeamName("");
        setPlayerName("");
        setPlayerNumber("");
        setEnabledFeatures({});
        setSponsorText("");
        setNotes("");
        setSizeCategory("Adults");
        setSelectedSizes({});
    };

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1500px] mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/kit-builder" className="hover:text-primary transition-colors">Kit Builder</Link>
                    <span>/</span>
                    <span className="text-white font-bold">{sport.name}</span>
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <span className="text-5xl mb-3 block">{sport.emoji}</span>
                    <h1 className="text-3xl md:text-5xl font-display font-black text-white uppercase mb-2">
                        {sport.name} <span className="text-primary">Kit Builder</span>
                    </h1>
                    <p className="text-muted">{sport.subtitle}</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-1.5 md:gap-3 mb-10 flex-wrap">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-1.5 md:gap-3">
                            <button
                                onClick={() => setStep(s.id)}
                                className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${step === s.id
                                    ? "bg-primary text-black"
                                    : step > s.id
                                        ? "bg-primary/20 text-primary"
                                        : "bg-white/5 text-muted border border-white/10"
                                    }`}
                            >
                                <s.icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-white/15" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT: Controls (3 cols) */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
                            >
                                {/* ───── STEP 1: GARMENT ───── */}
                                {step === 1 && (
                                    <div>
                                        <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Select Garments</h2>
                                        <p className="text-sm text-muted mb-6">Pick one or more items for your kit.</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {sport.garments.map((g) => {
                                                const selected = selectedGarments.includes(g.id);
                                                return (
                                                    <button
                                                        key={g.id}
                                                        onClick={() => toggleGarment(g.id)}
                                                        className={`p-4 rounded-xl border text-left transition-all group relative ${selected ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-primary/30"
                                                            }`}
                                                    >
                                                        {selected && (
                                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-black" />
                                                            </div>
                                                        )}
                                                        <Shirt className={`w-6 h-6 mb-2 ${selected ? "text-primary" : "text-muted"} transition-colors`} />
                                                        <p className="text-white font-bold text-sm">{g.name}</p>
                                                        <p className="text-muted text-[10px] mt-1 leading-tight">{g.description}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {selectedGarments.length > 0 && (
                                            <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                                <span className="text-sm text-white font-bold">{selectedGarments.length} item{selectedGarments.length > 1 ? "s" : ""} selected</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ───── STEP 2: FABRIC ───── */}
                                {step === 2 && (
                                    <div>
                                        <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Choose Fabric</h2>
                                        <p className="text-sm text-muted mb-6">Higher-grade fabrics offer better performance and durability.</p>
                                        <div className="space-y-3">
                                            {sport.fabrics.map(f => (
                                                <button
                                                    key={f.id}
                                                    onClick={() => setFabric(f.id)}
                                                    className={`w-full p-5 rounded-xl border text-left transition-all flex items-center justify-between ${fabric === f.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-primary/30"
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{f.name}</p>
                                                        <p className="text-muted text-xs mt-1">{f.description}</p>
                                                    </div>
                                                    <span className={`text-sm font-bold ${f.priceAddon > 0 ? "text-primary" : "text-white/40"}`}>
                                                        {f.priceAddon > 0 ? "Premium" : "Standard"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ───── STEP 3: DESIGN ───── */}
                                {step === 3 && (
                                    <div className="space-y-8">
                                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">Design Your Kit</h2>

                                        {/* Pattern */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-primary" /> Pattern
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {sport.patterns.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => setPattern(p.id)}
                                                        className={`px-3 py-3 rounded-lg text-left border transition-all ${pattern === p.id ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/30"
                                                            }`}
                                                    >
                                                        <p className={`text-xs font-bold uppercase ${pattern === p.id ? "text-primary" : "text-white"}`}>{p.name}</p>
                                                        <p className="text-[10px] text-muted mt-0.5">{p.description}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Primary Colour */}
                                        <ColorPicker label="Primary Colour" current={primaryColor} onChange={setPrimaryColor} />

                                        {/* Secondary Colour */}
                                        <ColorPicker label="Secondary Colour" current={secondaryColor} onChange={setSecondaryColor} />

                                        {/* Accent Colour */}
                                        <ColorPicker label="Accent Colour (collar, cuffs)" current={accentColor} onChange={setAccentColor} />

                                        {/* Collar */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Collar Style</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {sport.collars.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setCollar(c)}
                                                        className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${collar === c ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted hover:text-white"
                                                            }`}
                                                    >
                                                        {c}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Texture */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-primary" /> Fabric Texture
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {TEXTURES.map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setTexture(t.id)}
                                                        className={`px-3 py-3 rounded-lg text-left border transition-all ${texture === t.id ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/30"
                                                            }`}
                                                    >
                                                        <p className={`text-xs font-bold uppercase ${texture === t.id ? "text-primary" : "text-white"}`}>{t.name}</p>
                                                        <p className="text-[10px] text-muted mt-0.5">{t.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sleeve Style */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Sleeve Style</h3>
                                            <div className="flex gap-2">
                                                {SLEEVE_STYLES.map(s => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => setSleeveStyle(s.id)}
                                                        className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${sleeveStyle === s.id ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted hover:text-white"
                                                            }`}
                                                    >
                                                        {s.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ───── STEP 4: PERSONALISE ───── */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">Personalise Your Kit</h2>

                                        {/* Team Name */}
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Team / Club Name</label>
                                            <input
                                                type="text"
                                                value={teamName}
                                                onChange={e => setTeamName(e.target.value)}
                                                placeholder="e.g. Ballymore GAA"
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition"
                                            />
                                        </div>

                                        {/* Player Name + Number */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Player Name</label>
                                                <input
                                                    type="text"
                                                    value={playerName}
                                                    onChange={e => setPlayerName(e.target.value)}
                                                    placeholder="Optional"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition"
                                                />
                                                <p className="text-[10px] text-muted mt-1">+€4.00 per unit</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Number</label>
                                                <input
                                                    type="text"
                                                    value={playerNumber}
                                                    onChange={e => setPlayerNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                                                    placeholder="e.g. 7"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition"
                                                />
                                                <p className="text-[10px] text-muted mt-1">+€2.00 per unit</p>
                                            </div>
                                        </div>

                                        {/* Feature Toggles */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Add-ons & Extras</h3>
                                            <div className="space-y-2">
                                                {sport.features.map(f => (
                                                    <label
                                                        key={f.id}
                                                        className={`flex items-center justify-between bg-white/5 border rounded-lg px-4 py-3.5 cursor-pointer transition-colors ${enabledFeatures[f.id] ? "border-primary/40 bg-primary/5" : "border-white/10 hover:border-primary/20"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Shield className={`w-4 h-4 ${enabledFeatures[f.id] ? "text-primary" : "text-muted"}`} />
                                                            <div>
                                                                <p className="text-white text-sm font-bold">{f.name}</p>
                                                                <p className="text-muted text-[10px]">{f.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-xs font-bold ${f.price > 0 ? "text-primary" : "text-white/30"}`}>
                                                                {f.price > 0 ? "Add-on" : "Included"}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!enabledFeatures[f.id]}
                                                                onChange={() => toggleFeature(f.id)}
                                                                className="w-4 h-4 accent-[#66BB6A] rounded"
                                                            />
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sponsor Text */}
                                        {(enabledFeatures["sponsor-front"] || enabledFeatures["sponsor-back"] || enabledFeatures["sponsor-sleeve"]) && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Sponsor Name / Logo</label>
                                                <input
                                                    type="text"
                                                    value={sponsorText}
                                                    onChange={e => setSponsorText(e.target.value)}
                                                    placeholder="Sponsor name or upload later"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Notes */}
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Additional Notes</label>
                                            <textarea
                                                value={notes}
                                                onChange={e => setNotes(e.target.value)}
                                                placeholder="Any special requirements (e.g. specific PMS colours, different names per jersey, etc.)"
                                                rows={3}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition resize-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ───── STEP 5: SIZING ───── */}
                                {step === 5 && (
                                    <div>
                                        <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Select Sizes & Quantities</h2>
                                        <p className="text-sm text-muted mb-6">Add quantities for each size needed.</p>

                                        <div className="flex gap-2 mb-6">
                                            {["Kids", "Adults"].map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSizeCategory(cat)}
                                                    className={`text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full transition-all ${sizeCategory === cat ? "bg-primary text-black" : "bg-white/5 text-muted border border-white/10"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            {(sizeCategory === "Kids" ? sport.sizesKids : sport.sizesAdults).map(size => (
                                                <div key={size} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-5 py-3 hover:border-primary/20 transition">
                                                    <span className="text-white font-bold text-sm w-20">{size}</span>
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => adjustSize(size, -1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-all">−</button>
                                                        <span className="w-8 text-center text-white font-bold">{selectedSizes[size] || 0}</span>
                                                        <button onClick={() => adjustSize(size, 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-all">+</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg px-5 py-4 flex justify-between items-center">
                                            <span className="text-white font-bold text-sm">Total Items</span>
                                            <span className="text-primary font-black text-lg">{totalQty}</span>
                                        </div>
                                    </div>
                                )}

                                {/* ───── STEP 6: REVIEW ───── */}
                                {step === 6 && (
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">Review Your Kit</h2>

                                        {/* Config Summary */}
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2.5">
                                            <Row label="Sport" value={sport.name} />
                                            <Row label="Garments" value={selectedGarments.map(gId => sport.garments.find(g => g.id === gId)?.name).filter(Boolean).join(", ") || "None"} />
                                            <Row label="Fabric" value={sport.fabrics.find(f => f.id === fabric)?.name || "Standard"} />
                                            <Row label="Pattern" value={sport.patterns.find(p => p.id === pattern)?.name || "Solid"} />
                                            <Row label="Primary" value={primaryColor.name} colorHex={primaryColor.hex} />
                                            <Row label="Secondary" value={secondaryColor.name} colorHex={secondaryColor.hex} />
                                            <Row label="Accent" value={accentColor.name} colorHex={accentColor.hex} />
                                            {collar && <Row label="Collar" value={collar} />}
                                            {teamName && <Row label="Team" value={teamName} />}
                                            {playerName && <Row label="Name Print" value={`${playerName} (+€4.00)`} />}
                                            {playerNumber && <Row label="Number" value={`#${playerNumber} (+€2.00)`} />}
                                            {sport.features.filter(f => enabledFeatures[f.id]).map(f => (
                                                <Row key={f.id} label={f.name} value={f.price > 0 ? `+€${f.price.toFixed(2)}` : "Free"} />
                                            ))}
                                            {notes && <Row label="Notes" value={notes} />}
                                        </div>

                                        {/* Size Breakdown */}
                                        {totalQty > 0 && (
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Size Breakdown</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(selectedSizes).map(([size, qty]) => (
                                                        <span key={size} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-bold">
                                                            {size} × {qty}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Pricing */}
                                        <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-5">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-muted text-sm">Garments</span>
                                                <span className="text-white font-bold">{selectedGarments.length} item{selectedGarments.length > 1 ? "s" : ""}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-muted text-sm">Quantity</span>
                                                <span className="text-white font-bold">{totalQty || 1}</span>
                                            </div>
                                            <div className="border-t border-white/10 pt-3 text-center">
                                                <span className="text-muted text-sm">Contact us for pricing</span>
                                            </div>
                                        </div>

                                        <button className="w-full bg-primary text-black font-black uppercase tracking-[0.15em] py-5 rounded-sm hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)] transition-all flex items-center justify-center gap-3">
                                            <ShoppingBag className="w-5 h-5" />
                                            Submit Kit Request
                                        </button>
                                        <p className="text-center text-muted text-xs">Our team will confirm your design and send a final quote within 24 hours.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Nav Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:border-primary transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                            {step < 6 && (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 transition"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Live Preview (2 cols) */}
                    <div className="lg:col-span-2 lg:sticky lg:top-32 h-fit">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Live Preview</h3>
                                <button onClick={reset} className="text-muted hover:text-primary transition flex items-center gap-1 text-xs">
                                    <RotateCcw className="w-3 h-3" /> Reset All
                                </button>
                            </div>

                            {/* Jersey SVG Preview */}
                            <JerseyPreview
                                primaryColor={primaryColor.hex}
                                secondaryColor={secondaryColor.hex}
                                accentColor={accentColor.hex}
                                pattern={pattern}
                                collar={collar}
                                teamName={teamName}
                                playerName={playerName}
                                playerNumber={playerNumber}
                                showCrest={!!enabledFeatures["club-crest"]}
                                sponsorText={sponsorText}
                                showSponsor={!!enabledFeatures["sponsor-front"]}
                                garmentLabel={selectedGarments.length > 0 ? selectedGarments.map(gId => sport.garments.find(g => g.id === gId)?.name).filter(Boolean).join(" + ") : sport.name + " Kit"}
                                texture={texture}
                                sleeveStyle={sleeveStyle}
                            />

                            {/* Quick Info */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: primaryColor.hex }} />
                                    <span className="text-muted text-xs">{primaryColor.name}</span>
                                    <span className="text-white/20">+</span>
                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: secondaryColor.hex }} />
                                    <span className="text-muted text-xs">{secondaryColor.name}</span>
                                    <span className="text-white/20">+</span>
                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: accentColor.hex }} />
                                    <span className="text-muted text-xs">{accentColor.name}</span>
                                </div>
                                {totalQty > 0 && (
                                    <div className="flex justify-between pt-2 border-t border-white/10">
                                        <span className="text-muted">Total ({totalQty} items)</span>
                                        <span className="text-primary font-black">€{totalPrice.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}

/* ─── Helpers ──────────────────────────────────────────── */

function Row({ label, value, colorHex }: { label: string; value: string; colorHex?: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-muted text-sm">{label}</span>
            <span className="text-white font-bold text-sm flex items-center gap-2">
                {colorHex && <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: colorHex }} />}
                {value}
            </span>
        </div>
    );
}

function ColorPicker({ label, current, onChange }: { label: string; current: ColorOption; onChange: (c: ColorOption) => void }) {
    return (
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" /> {label}
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
                {SPORT_COLORS.map(c => (
                    <button
                        key={c.name}
                        onClick={() => onChange(c)}
                        title={c.name}
                        className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${current.name === c.name ? "border-primary scale-110 ring-2 ring-primary/30" : "border-white/10"
                            }`}
                        style={{ backgroundColor: c.hex }}
                    />
                ))}
                {/* Full Colour Palette Picker */}
                <div className="relative group">
                    <input
                        type="color"
                        value={current.hex}
                        onChange={(e) => onChange({ name: e.target.value.toUpperCase(), hex: e.target.value })}
                        className="w-9 h-9 rounded-full cursor-pointer border-2 border-dashed border-white/20 hover:border-primary/50 transition-all bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none"
                        title="Custom Colour"
                    />
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Custom</span>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: current.hex }} />
                <p className="text-[10px] text-muted">{current.name}</p>
                <span className="text-[9px] text-white/20 font-mono">{current.hex}</span>
            </div>
        </div>
    );
}
