"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSportById, SPORT_COLORS } from "@/lib/kit-builder-config";
import type { ColorOption } from "@/lib/kit-builder-config";
import { JerseyPreview } from "@/components/JerseyPreview";
import { JerseyPreview3D } from "@/components/JerseyPreview3D";
import {
    ChevronDown, ChevronUp, Check,
    RotateCcw, ShoppingBag, ArrowLeft
} from "lucide-react";

export default function SportCustomisePage() {
    const params = useParams();
    const sportId = params.sport as string;
    const sport = getSportById(sportId);

    // ─── STATE ───
    const [activeTab, setActiveTab] = useState<"colours" | "details">("colours");
    const [activeZone, setActiveZone] = useState<string | null>("body");

    // Customization State
    const [colors, setColors] = useState<Record<string, string>>({});
    const [pattern, setPattern] = useState("solid");
    const [collar, setCollar] = useState(sport?.collars[0] || "Crew Neck");
    const [teamName, setTeamName] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerNumber, setPlayerNumber] = useState("");
    const [showCrest, setShowCrest] = useState(false);
    const [crestImage, setCrestImage] = useState<string | null>(null);
    const [sponsorText, setSponsorText] = useState("");
    const [sponsorImage, setSponsorImage] = useState<string | null>(null);
    const [showSponsor, setShowSponsor] = useState(false);

    // Initialize Default Colors
    useEffect(() => {
        if (sport && Object.keys(colors).length === 0) {
            const defaults: Record<string, string> = {};
            sport.zones.forEach(z => {
                defaults[z.id] = "#ffffff";
            });
            // Set some smart defaults based on gradient/theme if possible, but white is safe
            if (defaults["body"]) defaults["body"] = "#ffffff";
            if (defaults["sleeves"]) defaults["sleeves"] = "#ffffff";
            setColors(defaults);
        }
    }, [sport]);

    const handleColorChange = (zoneId: string, colorHex: string) => {
        setColors(prev => ({ ...prev, [zoneId]: colorHex }));
    };

    if (!sport) return null; // Or 404 component

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black flex flex-col pt-24">

            {/* ─── HEADER ─── */}
            <header className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-16 z-40 px-4 md:px-8 py-4">
                <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link href="/kit-builder" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-widest">
                                <span>Kit Builder</span>
                                <span>/</span>
                                <span>{sport.name}</span>
                                <span>/</span>
                                <span className="text-primary font-bold">Customise</span>
                            </div>
                            <h1 className="text-xl font-display font-black text-white uppercase tracking-wide">
                                {sport.name} Design
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none bg-white text-black font-bold uppercase text-xs tracking-widest px-6 py-3 rounded hover:bg-gray-200 transition">
                            Save Design
                        </button>
                        <button className="flex-1 md:flex-none bg-primary text-black font-bold uppercase text-xs tracking-widest px-6 py-3 rounded hover:bg-primary/90 transition flex items-center justify-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Next
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 md:grid md:grid-cols-12 max-w-[1800px] mx-auto w-full">

                {/* ─── LEFT: CONTROLS ─── */}
                <div className="md:col-span-4 lg:col-span-3 bg-[#111] border-r border-white/5 flex flex-col h-[calc(100vh-140px)] sticky top-[140px]">

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab("colours")}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "colours" ? "bg-white/5 text-primary border-b-2 border-primary" : "text-muted hover:text-white"}`}
                        >
                            Choose Colours
                        </button>
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "details" ? "bg-white/5 text-primary border-b-2 border-primary" : "text-muted hover:text-white"}`}
                        >
                            Club Details
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                        {activeTab === "colours" ? (
                            <div className="space-y-2">
                                {/* Pattern Selector */}
                                <div className="mb-8">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted mb-3 block">Pattern Style</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {sport.patterns.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setPattern(p.id)}
                                                className={`p-2 rounded border text-[10px] font-bold uppercase transition-all ${pattern === p.id ? "border-primary bg-primary/10 text-white" : "border-white/10 text-muted hover:border-white/30"}`}
                                            >
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-white/10 my-6" />

                                {/* Zone Accordions */}
                                {sport.zones.map((zone) => {
                                    const isOpen = activeZone === zone.id;
                                    return (
                                        <div key={zone.id} className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
                                            <button
                                                onClick={() => setActiveZone(isOpen ? null : zone.id)}
                                                className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? "bg-white/5" : "hover:bg-white/5"}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded border border-white/20 shadow-sm" style={{ backgroundColor: colors[zone.id] || "#fff" }} />
                                                    <span className="text-sm font-bold text-white uppercase">{zone.name}</span>
                                                </div>
                                                {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: "auto" }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-4 border-t border-white/10 bg-black/20">
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {/* Common Colors */}
                                                                {SPORT_COLORS.map(c => (
                                                                    <button
                                                                        key={c.hex}
                                                                        onClick={() => handleColorChange(zone.id, c.hex)}
                                                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${colors[zone.id] === c.hex ? "border-white ring-2 ring-primary/50" : "border-white/10"}`}
                                                                        style={{ backgroundColor: c.hex }}
                                                                        title={c.name}
                                                                    />
                                                                ))}
                                                                {/* Custom Picker */}
                                                                <div className="relative w-8 h-8 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center hover:border-primary cursor-pointer overflow-hidden">
                                                                    <input
                                                                        type="color"
                                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 opacity-0"
                                                                        onChange={(e) => handleColorChange(zone.id, e.target.value)}
                                                                        value={colors[zone.id] || "#ffffff"}
                                                                    />
                                                                    <span className="text-[10px] text-white/50">+</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}

                                <div className="h-px bg-white/10 my-6" />

                                {/* Collar Selector */}
                                <div className="mb-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted mb-3 block">Collar Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {sport.collars.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setCollar(c)}
                                                className={`px-3 py-2 rounded text-[10px] font-bold uppercase border transition-all ${collar === c ? "bg-primary/10 border-primary text-white" : "border-white/10 text-muted hover:border-white/30"}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Club Details Form */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Team Name</label>
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={e => setTeamName(e.target.value)}
                                        placeholder="e.g. Match Pro City"
                                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <div className="p-4 bg-white/5 rounded border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white">Club Crest</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted">{showCrest ? "Shown" : "Hidden"}</span>
                                            <button
                                                onClick={() => setShowCrest(!showCrest)}
                                                className={`w-8 h-4 rounded-full transition-colors relative ${showCrest ? "bg-primary" : "bg-white/10"}`}
                                            >
                                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showCrest ? "left-4.5" : "left-0.5"}`} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        setCrestImage(ev.target?.result as string);
                                                        setShowCrest(true);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <p className="text-[10px] uppercase font-bold text-muted group-hover:text-primary transition-colors">
                                            {crestImage ? "Change Crest Image" : "Upload Crest"}
                                        </p>
                                        <p className="text-[9px] text-white/30 mt-1">PNG, JPG, SVG</p>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10" />

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Sponsor</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={sponsorText}
                                            onChange={e => setSponsorText(e.target.value)}
                                            placeholder="Sponsor Name"
                                            className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-primary focus:outline-none"
                                        />
                                        <div className="relative overflow-hidden shrink-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            setSponsorImage(ev.target?.result as string);
                                                            setShowSponsor(true);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <button className="h-full px-3 border rounded border-white/10 text-muted hover:border-primary/50 transition-colors text-xs font-bold uppercase tracking-widest">
                                                {sponsorImage ? "Change Logo" : "Upload Logo"}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setShowSponsor(!showSponsor)}
                                            className={`px-3 border rounded transition-colors ${showSponsor ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted"}`}
                                        >
                                            {showSponsor ? <Check className="w-4 h-4" /> : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Player Name</label>
                                        <input
                                            type="text"
                                            value={playerName}
                                            onChange={e => setPlayerName(e.target.value)}
                                            placeholder="Name"
                                            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Number</label>
                                        <input
                                            type="text"
                                            value={playerNumber}
                                            onChange={e => setPlayerNumber(e.target.value)}
                                            placeholder="15"
                                            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>

                {/* ─── RIGHT: PREVIEW ─── */}
                <div className="md:col-span-8 lg:col-span-9 bg-neutral-900/50 flex items-center justify-center p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/assets/grid-pattern.png')] opacity-[0.03]" />

                    <div className="w-full max-w-[600px] relative z-10">
                        <JerseyPreview3D
                            colors={colors}
                            title={sport.name}
                            customizations={{
                                teamName,
                                playerName,
                                playerNumber,
                                showCrest,
                                crestImage,
                                sponsorText,
                                sponsorImage,
                                showSponsor,
                            }}
                        />

                        {/* Floating Reset */}
                        <button
                            onClick={() => {
                                setColors({});
                                setPattern("solid");
                                setTeamName("");
                                setPlayerName("");
                                setPlayerNumber("");
                            }}
                            className="absolute bottom-4 right-4 text-xs text-muted hover:text-white flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur z-50"
                        >
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}
