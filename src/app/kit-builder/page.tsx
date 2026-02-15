"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Dock } from "@/components/Dock";
import {
    Shirt,
    Paintbrush,
    Type,
    Shield,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
    Download,
    ShoppingBag,
    Check,
    Palette,
    Image as ImageIcon,
    Layers
} from "lucide-react";

/* ─── CONFIG ────────────────────────────────────────────── */

const GARMENT_TYPES = [
    { id: "jersey", name: "Jersey", icon: Shirt, basePrice: 54.99 },
    { id: "hoodie", name: "Hoodie", icon: Shirt, basePrice: 64.99 },
    { id: "quarter-zip", name: "Quarter-Zip", icon: Shirt, basePrice: 49.99 },
    { id: "polo", name: "Polo", icon: Shirt, basePrice: 39.99 },
    { id: "training-top", name: "Training Top", icon: Shirt, basePrice: 44.99 },
    { id: "shorts", name: "Shorts", icon: Shirt, basePrice: 29.99 },
];

const COLORS = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#f5f5f5" },
    { name: "Navy", hex: "#1e3a5f" },
    { name: "Royal Blue", hex: "#2563eb" },
    { name: "Sky Blue", hex: "#38bdf8" },
    { name: "Red", hex: "#dc2626" },
    { name: "Maroon", hex: "#7f1d1d" },
    { name: "Green", hex: "#16a34a" },
    { name: "Emerald", hex: "#059669" },
    { name: "Gold", hex: "#ca8a04" },
    { name: "Orange", hex: "#ea580c" },
    { name: "Purple", hex: "#7c3aed" },
    { name: "Grey", hex: "#6b7280" },
    { name: "Pink", hex: "#ec4899" },
];

const COLLAR_STYLES = ["Crew Neck", "V-Neck", "Polo Collar", "Half-Zip"];

const PATTERNS = [
    { id: "solid", name: "Solid" },
    { id: "stripes", name: "Vertical Stripes" },
    { id: "hoops", name: "Hoops" },
    { id: "half-half", name: "Half & Half" },
    { id: "gradient", name: "Gradient" },
    { id: "pinstripe", name: "Pinstripe" },
];

const SIZES_KIDS = ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"];
const SIZES_ADULT = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const STEPS = [
    { id: 1, label: "Garment", icon: Shirt },
    { id: 2, label: "Design", icon: Paintbrush },
    { id: 3, label: "Details", icon: Type },
    { id: 4, label: "Sizing", icon: Layers },
    { id: 5, label: "Review", icon: Check },
];

/* ─── COMPONENT ────────────────────────────────────────── */

export default function KitBuilderPage() {
    const [step, setStep] = useState(1);

    // Step 1: Garment
    const [garment, setGarment] = useState(GARMENT_TYPES[0]);

    // Step 2: Design
    const [primaryColor, setPrimaryColor] = useState(COLORS[0]);
    const [secondaryColor, setSecondaryColor] = useState(COLORS[1]);
    const [pattern, setPattern] = useState(PATTERNS[0]);
    const [collar, setCollar] = useState(COLLAR_STYLES[0]);

    // Step 3: Details
    const [teamName, setTeamName] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerNumber, setPlayerNumber] = useState("");
    const [hasCrest, setHasCrest] = useState(false);
    const [hasSponsor, setHasSponsor] = useState(false);
    const [sponsorText, setSponsorText] = useState("");

    // Step 4: Sizing
    const [sizeCategory, setSizeCategory] = useState("Adults");
    const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

    const toggleSize = (size: string, delta: number) => {
        setSelectedSizes((prev) => {
            const current = prev[size] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const { [size]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [size]: next };
        });
    };

    const totalQty = Object.values(selectedSizes).reduce((a, b) => a + b, 0);
    const unitPrice = garment.basePrice + (hasCrest ? 5 : 0) + (hasSponsor ? 3 : 0) + (playerName ? 4 : 0) + (playerNumber ? 2 : 0);
    const totalPrice = unitPrice * Math.max(totalQty, 1);

    const canNext = () => {
        if (step === 1) return !!garment;
        if (step === 4) return totalQty > 0;
        return true;
    };

    // Generate preview gradient/pattern based on selections
    const previewStyle = (): React.CSSProperties => {
        const p = primaryColor.hex;
        const s = secondaryColor.hex;
        switch (pattern.id) {
            case "gradient":
                return { background: `linear-gradient(180deg, ${p} 0%, ${s} 100%)` };
            case "stripes":
                return { background: `repeating-linear-gradient(90deg, ${p} 0px, ${p} 30px, ${s} 30px, ${s} 60px)` };
            case "hoops":
                return { background: `repeating-linear-gradient(0deg, ${p} 0px, ${p} 25px, ${s} 25px, ${s} 50px)` };
            case "half-half":
                return { background: `linear-gradient(90deg, ${p} 50%, ${s} 50%)` };
            case "pinstripe":
                return { background: `repeating-linear-gradient(90deg, ${p} 0px, ${p} 28px, ${s} 28px, ${s} 30px)` };
            default:
                return { background: p };
        }
    };

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <Navbar />

            <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-5 py-2 rounded-full border border-primary/20">
                        Custom Teamwear
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase mt-6 mb-3">
                        Kit Builder
                    </h1>
                    <p className="text-muted max-w-xl mx-auto">
                        Design your perfect team kit. Choose garment, colours, patterns, and add your team details.
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={() => setStep(s.id)}
                                className={`flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${step === s.id
                                        ? "bg-primary text-black"
                                        : step > s.id
                                            ? "bg-primary/20 text-primary"
                                            : "bg-white/5 text-muted border border-white/10"
                                    }`}
                            >
                                <s.icon className="w-4 h-4" />
                                <span className="hidden md:inline">{s.label}</span>
                            </button>
                            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-white/20" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT: Controls */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
                            >
                                {/* STEP 1: Garment */}
                                {step === 1 && (
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-6">Choose Your Garment</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {GARMENT_TYPES.map((g) => (
                                                <button
                                                    key={g.id}
                                                    onClick={() => setGarment(g)}
                                                    className={`p-6 rounded-xl border text-center transition-all group ${garment.id === g.id
                                                            ? "border-primary bg-primary/10"
                                                            : "border-white/10 bg-white/5 hover:border-primary/30"
                                                        }`}
                                                >
                                                    <g.icon className={`w-8 h-8 mx-auto mb-3 ${garment.id === g.id ? "text-primary" : "text-muted group-hover:text-primary"} transition-colors`} />
                                                    <p className="text-white font-bold text-sm">{g.name}</p>
                                                    <p className="text-primary text-xs mt-1">From €{g.basePrice.toFixed(2)}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: Design */}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wide">Design Your Kit</h2>

                                        {/* Pattern */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-primary" /> Pattern
                                            </h3>
                                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                                {PATTERNS.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => setPattern(p)}
                                                        className={`px-3 py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${pattern.id === p.id ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted hover:text-white"
                                                            }`}
                                                    >
                                                        {p.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Primary Color */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-primary" /> Primary Colour
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {COLORS.map((c) => (
                                                    <button
                                                        key={c.name}
                                                        onClick={() => setPrimaryColor(c)}
                                                        title={c.name}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${primaryColor.name === c.name ? "border-primary scale-110 ring-2 ring-primary/30" : "border-white/10"
                                                            }`}
                                                        style={{ backgroundColor: c.hex }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Secondary Color */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-primary" /> Secondary Colour
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {COLORS.map((c) => (
                                                    <button
                                                        key={c.name}
                                                        onClick={() => setSecondaryColor(c)}
                                                        title={c.name}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${secondaryColor.name === c.name ? "border-primary scale-110 ring-2 ring-primary/30" : "border-white/10"
                                                            }`}
                                                        style={{ backgroundColor: c.hex }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Collar */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Collar Style</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {COLLAR_STYLES.map((c) => (
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
                                    </div>
                                )}

                                {/* STEP 3: Details */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wide">Personalise Your Kit</h2>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Team / Club Name</label>
                                            <input
                                                type="text"
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                placeholder="e.g. Ballymore GAA"
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Player Name</label>
                                                <input
                                                    type="text"
                                                    value={playerName}
                                                    onChange={(e) => setPlayerName(e.target.value)}
                                                    placeholder="Optional"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors"
                                                />
                                                <p className="text-[10px] text-muted mt-1">+€4.00 per unit</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Number</label>
                                                <input
                                                    type="text"
                                                    value={playerNumber}
                                                    onChange={(e) => setPlayerNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                                                    placeholder="e.g. 7"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors"
                                                />
                                                <p className="text-[10px] text-muted mt-1">+€2.00 per unit</p>
                                            </div>
                                        </div>

                                        {/* Toggles */}
                                        <div className="space-y-4">
                                            <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-5 py-4 cursor-pointer hover:border-primary/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <p className="text-white text-sm font-bold">Add Club Crest</p>
                                                        <p className="text-muted text-xs">Upload your crest or we'll source it (+€5.00)</p>
                                                    </div>
                                                </div>
                                                <input type="checkbox" checked={hasCrest} onChange={() => setHasCrest(!hasCrest)} className="w-5 h-5 accent-[#66BB6A] rounded" />
                                            </label>

                                            <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-5 py-4 cursor-pointer hover:border-primary/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <ImageIcon className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <p className="text-white text-sm font-bold">Add Sponsor Logo</p>
                                                        <p className="text-muted text-xs">Front or back placement (+€3.00)</p>
                                                    </div>
                                                </div>
                                                <input type="checkbox" checked={hasSponsor} onChange={() => setHasSponsor(!hasSponsor)} className="w-5 h-5 accent-[#66BB6A] rounded" />
                                            </label>

                                            {hasSponsor && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                                                    <input
                                                        type="text"
                                                        value={sponsorText}
                                                        onChange={(e) => setSponsorText(e.target.value)}
                                                        placeholder="Sponsor name or upload logo later"
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors"
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: Sizing */}
                                {step === 4 && (
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-6">Select Sizes & Quantities</h2>

                                        {/* Kids/Adults Toggle */}
                                        <div className="flex gap-2 mb-6">
                                            {["Kids", "Adults"].map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSizeCategory(cat)}
                                                    className={`text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full transition-all ${sizeCategory === cat ? "bg-primary text-black" : "bg-white/5 text-muted border border-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            {(sizeCategory === "Kids" ? SIZES_KIDS : SIZES_ADULT).map((size) => (
                                                <div key={size} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-5 py-3 hover:border-primary/20 transition-colors">
                                                    <span className="text-white font-bold text-sm w-20">{size}</span>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleSize(size, -1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-all"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-8 text-center text-white font-bold">
                                                            {selectedSizes[size] || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => toggleSize(size, 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-all"
                                                        >
                                                            +
                                                        </button>
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

                                {/* STEP 5: Review */}
                                {step === 5 && (
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-6">Review Your Kit</h2>
                                        <div className="space-y-4">
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                                                <Row label="Garment" value={garment.name} />
                                                <Row label="Pattern" value={pattern.name} />
                                                <Row label="Primary" value={primaryColor.name} colorHex={primaryColor.hex} />
                                                <Row label="Secondary" value={secondaryColor.name} colorHex={secondaryColor.hex} />
                                                <Row label="Collar" value={collar} />
                                                {teamName && <Row label="Team" value={teamName} />}
                                                {playerName && <Row label="Name Print" value={`${playerName} (+€4.00)`} />}
                                                {playerNumber && <Row label="Number" value={`#${playerNumber} (+€2.00)`} />}
                                                {hasCrest && <Row label="Club Crest" value="Yes (+€5.00)" />}
                                                {hasSponsor && <Row label="Sponsor" value={sponsorText || "Logo to be provided (+€3.00)"} />}
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
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-muted text-sm">Unit Price</span>
                                                    <span className="text-white font-bold">€{unitPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-muted text-sm">Quantity</span>
                                                    <span className="text-white font-bold">{totalQty || 1}</span>
                                                </div>
                                                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                                                    <span className="text-white font-bold text-lg">Estimated Total</span>
                                                    <span className="text-primary font-black text-2xl">€{totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Submit */}
                                            <button className="w-full bg-primary text-black font-black uppercase tracking-[0.15em] py-5 rounded-sm hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)] transition-all flex items-center justify-center gap-3">
                                                <ShoppingBag className="w-5 h-5" />
                                                Request Quote / Add to Cart
                                            </button>
                                            <p className="text-center text-muted text-xs">
                                                Our team will confirm your design and send a final quote within 24 hours.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Nav Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                            {step < 5 ? (
                                <button
                                    onClick={() => canNext() && setStep(step + 1)}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 transition-all"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* RIGHT: Live Preview */}
                    <div className="lg:col-span-2 lg:sticky lg:top-32 h-fit">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Live Preview</h3>
                                <button
                                    onClick={() => {
                                        setGarment(GARMENT_TYPES[0]);
                                        setPrimaryColor(COLORS[0]);
                                        setSecondaryColor(COLORS[1]);
                                        setPattern(PATTERNS[0]);
                                        setCollar(COLLAR_STYLES[0]);
                                        setTeamName("");
                                        setPlayerName("");
                                        setPlayerNumber("");
                                        setHasCrest(false);
                                        setHasSponsor(false);
                                        setSponsorText("");
                                        setSelectedSizes({});
                                        setStep(1);
                                    }}
                                    className="text-muted hover:text-primary transition-colors flex items-center gap-1 text-xs"
                                >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                            </div>

                            {/* Jersey Preview */}
                            <div
                                className="aspect-[3/4] rounded-xl overflow-hidden relative flex items-center justify-center border border-white/5 mb-6"
                                style={previewStyle()}
                            >
                                {/* SVG Jersey Shape Overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                    {/* Collar indicator */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                                        {collar}
                                    </div>

                                    {/* Crest area */}
                                    {hasCrest && (
                                        <div className="absolute top-16 left-8 w-12 h-12 border-2 border-white/40 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                            <Shield className="w-6 h-6 text-white/60" />
                                        </div>
                                    )}

                                    {/* Sponsor area */}
                                    {hasSponsor && (
                                        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded text-xs font-bold border border-white/20">
                                            {sponsorText || "SPONSOR"}
                                        </div>
                                    )}

                                    {/* Team Name */}
                                    {teamName && (
                                        <p className="text-lg md:text-xl font-black uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mt-8">
                                            {teamName}
                                        </p>
                                    )}

                                    {/* Number */}
                                    {playerNumber && (
                                        <p className="text-6xl md:text-8xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] leading-none mt-2" style={{ fontFamily: "system-ui" }}>
                                            {playerNumber}
                                        </p>
                                    )}

                                    {/* Player Name */}
                                    {playerName && (
                                        <p className="text-sm md:text-base font-bold uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mt-2">
                                            {playerName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted">{garment.name}</span>
                                    <span className="text-white font-bold">€{unitPrice.toFixed(2)}/unit</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: primaryColor.hex }} />
                                    <span className="text-muted text-xs">{primaryColor.name}</span>
                                    <span className="text-white/20">+</span>
                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: secondaryColor.hex }} />
                                    <span className="text-muted text-xs">{secondaryColor.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <Dock />
        </main>
    );
}

/* ─── Helper ────────────────────────────────────────────── */

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
