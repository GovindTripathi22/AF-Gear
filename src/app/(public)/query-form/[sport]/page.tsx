"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSportById } from "@/lib/query-form-config";
import {
    ArrowLeft, Send, User, Mail, Phone, Users, Hash,
    Palette, FileText, Upload, CheckCircle, Loader2, Shield
} from "lucide-react";
import { submitQueryForm, uploadCrestAction } from "@/app/actions/queryFormActions";
import { getSportIcon } from "@/components/products/QueryFormSection";

function FormInput({ label, icon: Icon, value, onChange, placeholder, type = "text", required = false }: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
    required?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                {label}
                {required && <span className="text-primary">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full min-h-[48px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200 hover:border-white/15"
            />
        </div>
    );
}

function FormTextarea({ label, icon: Icon, value, onChange, placeholder, rows = 4 }: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    value: string
    onChange: (v: string) => void
    placeholder?: string
    rows?: number
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                {label}
            </label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200 hover:border-white/15 resize-none"
            />
        </div>
    );
}

function FormSelect({ label, icon: Icon, value, onChange, options, required = false }: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    value: string
    onChange: (v: string) => void
    options: { value: string; label: string }[]
    required?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                {label}
                {required && <span className="text-primary">*</span>}
            </label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                className="w-full min-h-[48px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200 hover:border-white/15 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
                <option value="" className="bg-[#111]">Select...</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#111]">{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

export default function SportInquiryPage() {
    const params = useParams();
    const sportId = params.sport as string;
    const sport = getSportById(sportId);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [clubName, setClubName] = useState("");
    const [teamLevel, setTeamLevel] = useState("");
    const [quantity, setQuantity] = useState("");
    const [preferredColors, setPreferredColors] = useState("");
    const [requirements, setRequirements] = useState("");
    const [crestFile, setCrestFile] = useState<File | null>(null);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    if (!sport) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-display font-black text-white uppercase">Sport Not Found</h1>
                    <Link href="/query-form" className="text-primary text-sm mt-4 inline-block hover:underline">
                        ← Back to Query Form
                    </Link>
                </div>
            </main>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!fullName.trim() || !email.trim() || !phone.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedCrestUrl = "";
            if (crestFile) {
                const formData = new FormData();
                formData.append("file", crestFile);
                const uploadRes = await uploadCrestAction(formData);
                if (uploadRes.error) {
                    setError(`Failed to upload crest: ${uploadRes.error}`);
                    setIsSubmitting(false);
                    return;
                }
                uploadedCrestUrl = uploadRes.url || "";
            }

            const result = await submitQueryForm({
                sportId,
                sportName: sport.name,
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                clubName: clubName.trim(),
                teamLevel,
                quantity,
                preferredColors: preferredColors.trim(),
                requirements: requirements.trim(),
                crestUrl: uploadedCrestUrl,
            });

            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">

            {/* Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-white/[0.06] sticky top-16 z-40 px-4 md:px-8 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/query-form" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            {getSportIcon(sport.id, "w-5 h-5 text-primary")}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                                <span>Query Form</span>
                                <span>/</span>
                                <span className="text-primary font-bold">{sport.name}</span>
                            </div>
                            <h1 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-wide">
                                Form Inquiry
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">

                <AnimatePresence mode="wait">
                    {submitted ? (
                        /* Success State */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 md:py-24"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
                            >
                                <CheckCircle className="w-10 h-10 text-primary" />
                            </motion.div>
                            <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase mb-3">
                                Form <span className="text-primary">Submitted!</span>
                            </h2>
                            <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
                                Thank you for your interest! Our team will review your requirements and get back to you within 24-48 hours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/query-form"
                                    className="inline-flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white font-bold uppercase text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-white/10 transition-all min-h-[48px]"
                                >
                                    Browse More Sports
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-black font-bold uppercase text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-primary/90 transition-all min-h-[48px]"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        /* Form */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Intro */}
                            <div className="text-center mb-8 md:mb-10">
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-2">
                                    {sport.name} <span className="text-primary">Query Form</span>
                                </h2>
                                <p className="text-white/40 text-sm max-w-lg mx-auto">
                                    Fill in your details below and our team will get in touch to discuss your custom {sport.name.toLowerCase()} kit requirements, colours, and design options.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden"
                                >
                                    <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Contact Information</h3>
                                            <p className="text-[11px] text-white/30">How can we reach you?</p>
                                        </div>
                                    </div>
                                    <div className="px-5 md:px-6 py-5 md:py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput label="Full Name" icon={User} value={fullName} onChange={setFullName} placeholder="John Murphy" required />
                                            <FormInput label="Email Address" icon={Mail} value={email} onChange={setEmail} placeholder="john@club.ie" type="email" required />
                                            <FormInput label="Phone Number" icon={Phone} value={phone} onChange={setPhone} placeholder="+353 87 123 4567" type="tel" required />
                                            <FormInput label="Club / Organisation" icon={Shield} value={clubName} onChange={setClubName} placeholder="e.g. Limerick GAA" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Kit Requirements */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden"
                                >
                                    <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <Users className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Kit Requirements</h3>
                                            <p className="text-[11px] text-white/30">Tell us about your kit needs.</p>
                                        </div>
                                    </div>
                                    <div className="px-5 md:px-6 py-5 md:py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormSelect
                                                label="Team Level"
                                                icon={Users}
                                                value={teamLevel}
                                                onChange={setTeamLevel}
                                                options={[
                                                    { value: "senior", label: "Senior" },
                                                    { value: "junior", label: "Junior" },
                                                    { value: "minor", label: "Minor" },
                                                    { value: "u21", label: "Under 21" },
                                                    { value: "u16", label: "Under 16" },
                                                    { value: "u14", label: "Under 14" },
                                                    { value: "u12", label: "Under 12" },
                                                    { value: "u10", label: "Under 10" },
                                                    { value: "school", label: "School Team" },
                                                    { value: "other", label: "Other" },
                                                ]}
                                            />
                                            <FormSelect
                                                label="Estimated Quantity"
                                                icon={Hash}
                                                value={quantity}
                                                onChange={setQuantity}
                                                options={[
                                                    { value: "1", label: "1 set (Single Item)" },
                                                    { value: "2-5", label: "2 – 5 sets" },
                                                    { value: "5-10", label: "5 – 10 sets" },
                                                    { value: "10-20", label: "10 – 20 sets" },
                                                    { value: "20-30", label: "20 – 30 sets" },
                                                    { value: "30-50", label: "30 – 50 sets" },
                                                    { value: "50-100", label: "50 – 100 sets" },
                                                    { value: "100+", label: "100+ sets" },
                                                ]}
                                            />
                                            <div className="md:col-span-2">
                                                <FormInput label="Preferred Colours" icon={Palette} value={preferredColors} onChange={setPreferredColors} placeholder="e.g. Green and White, Navy and Gold" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormTextarea label="Special Requirements" icon={FileText} value={requirements} onChange={setRequirements} placeholder="Tell us about any specific design ideas, patterns, sponsor logos, crests, or deadlines you have in mind..." rows={4} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Crest Upload (Visual Only for now as per original code) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden"
                                >
                                    <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <Upload className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Club Crest / Logo</h3>
                                            <p className="text-[11px] text-white/30">Optional — upload your crest or logo.</p>
                                        </div>
                                    </div>
                                    <div className="px-5 md:px-6 py-5 md:py-6">
                                        <div className="relative border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setCrestFile(file);
                                                }}
                                            />
                                            <Upload className="w-8 h-8 text-white/20 group-hover:text-primary/60 mx-auto mb-3 transition-colors" />
                                            <p className="text-sm font-bold text-white/40 group-hover:text-white/60 transition-colors">
                                                {crestFile ? crestFile.name : "Click to upload crest or logo"}
                                            </p>
                                            <p className="text-[11px] text-white/20 mt-1">PNG, JPG, SVG up to 5MB</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm font-medium"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col sm:flex-row items-center gap-4 justify-between"
                                >
                                    <p className="text-[11px] text-white/25 text-center sm:text-left">
                                        We&apos;ll respond within 24-48 hours with design options and a quote.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-black font-black uppercase text-xs tracking-[0.15em] px-8 py-4 rounded-lg hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[52px]"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Submit Inquiry</>
                                        )}
                                    </button>
                                </motion.div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
