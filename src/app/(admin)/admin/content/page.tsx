'use client'

import { useState, useEffect } from 'react'
import { updateContent } from './actions'
<<<<<<< HEAD
import { Loader2, Save, Type, BarChart3, Image, Link2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
=======
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
>>>>>>> target/main

type HeroContent = {
    title: string
    subtitle: string
    ctaText: string
    ctaLink: string
    backgroundImage: string
}

type StatsContent = {
    happyCustomers: string
    projectsComplete: string
    citiesCovered: string
    energyInstalled: string
}

<<<<<<< HEAD
function InputField({ label, value, onChange, placeholder, icon: Icon, type = 'text' }: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    icon?: React.ComponentType<{ className?: string }>
    type?: string
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                {Icon && <Icon className="w-3.5 h-3.5 text-primary/60" />}
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[48px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200 hover:border-white/15"
            />
        </div>
    )
}

=======
>>>>>>> target/main
export default function ContentPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [hero, setHero] = useState<HeroContent>({ title: '', subtitle: '', ctaText: '', ctaLink: '', backgroundImage: '' })
    const [stats, setStats] = useState<StatsContent>({ happyCustomers: '', projectsComplete: '', citiesCovered: '', energyInstalled: '' })

<<<<<<< HEAD
=======
    // Fetch existing data on mount
>>>>>>> target/main
    useEffect(() => {
        async function loadContent() {
            try {
                const [heroResult, statsResult] = await Promise.all([
                    supabase.from('site_content').select('content').eq('key', 'homepage_hero').single(),
                    supabase.from('site_content').select('content').eq('key', 'statistics').single(),
                ])

                if (heroResult.data?.content) {
<<<<<<< HEAD
                    setHero(prev => ({ ...prev, ...heroResult.data.content }))
                }
                if (statsResult.data?.content) {
                    setStats(prev => ({ ...prev, ...statsResult.data.content }))
=======
                    setHero({ ...hero, ...heroResult.data.content })
                }
                if (statsResult.data?.content) {
                    setStats({ ...stats, ...statsResult.data.content })
>>>>>>> target/main
                }
            } catch (e) {
                console.error('Error loading content:', e)
            } finally {
                setFetching(false)
            }
        }

        loadContent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSave = async (section: string, data: Record<string, unknown>) => {
        setLoading(true)
        const formData = new FormData()
        formData.append('section', section)
        formData.append('content', JSON.stringify(data))

        const result = await updateContent(null, formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(`${section.replace('_', ' ')} updated!`)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
<<<<<<< HEAD
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Loading Content</span>
                </div>
=======
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
>>>>>>> target/main
            </div>
        )
    }

    return (
<<<<<<< HEAD
        <div className="space-y-6 md:space-y-8 px-1">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
                    Content <span className="text-primary">Manager</span>
                </h2>
                <p className="mt-1 text-sm text-white/40">Update your website&apos;s content sections.</p>
            </motion.div>

            {/* Hero Section Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden backdrop-blur-sm"
            >
                <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Image className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Homepage Hero</h3>
                        <p className="text-[11px] text-white/30">Banner text and call-to-action.</p>
                    </div>
                </div>
                <div className="px-5 md:px-6 py-5 md:py-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Title" icon={Type} value={hero.title} onChange={v => setHero({ ...hero, title: v })} placeholder="Main headline" />
                        <InputField label="Subtitle" icon={FileText} value={hero.subtitle} onChange={v => setHero({ ...hero, subtitle: v })} placeholder="Supporting text" />
                        <InputField label="CTA Text" icon={Type} value={hero.ctaText} onChange={v => setHero({ ...hero, ctaText: v })} placeholder="Button label" />
                        <InputField label="CTA Link" icon={Link2} value={hero.ctaLink} onChange={v => setHero({ ...hero, ctaLink: v })} placeholder="/shop or external URL" />
                    </div>
                </div>
                <div className="flex items-center justify-end border-t border-white/[0.06] px-5 md:px-6 py-4 bg-white/[0.02]">
                    <button
                        onClick={() => handleSave('homepage_hero', hero)}
                        disabled={loading}
                        className="rounded-lg bg-primary text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(102,187,106,0.3)] disabled:opacity-50 flex items-center gap-2 transition-all duration-200 min-h-[44px]"
                    >
=======
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Content Manager</h2>
                <p className="mt-1 text-sm text-gray-500">Update your website&apos;s content sections.</p>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">Homepage Hero</h3>
                    <p className="text-sm text-gray-500">Update the main banner text and call-to-action.</p>
                </div>
                <div className="px-6 py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input type="text" value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                            <input type="text" value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                            <input type="text" value={hero.ctaText} onChange={e => setHero({ ...hero, ctaText: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                            <input type="text" value={hero.ctaLink} onChange={e => setHero({ ...hero, ctaLink: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-4 border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                    <button onClick={() => handleSave('homepage_hero', hero)} disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2 transition-colors">
>>>>>>> target/main
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Hero
                    </button>
                </div>
<<<<<<< HEAD
            </motion.div>

            {/* Stats Section Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden backdrop-blur-sm"
            >
                <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <BarChart3 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Statistics</h3>
                        <p className="text-[11px] text-white/30">Numbers displayed on the website.</p>
                    </div>
                </div>
                <div className="px-5 md:px-6 py-5 md:py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Happy Customers" value={stats.happyCustomers} onChange={v => setStats({ ...stats, happyCustomers: v })} placeholder="e.g. 500+" />
                        <InputField label="Projects Complete" value={stats.projectsComplete} onChange={v => setStats({ ...stats, projectsComplete: v })} placeholder="e.g. 200+" />
                        <InputField label="Cities Covered" value={stats.citiesCovered} onChange={v => setStats({ ...stats, citiesCovered: v })} placeholder="e.g. 30+" />
                        <InputField label="Energy Installed" value={stats.energyInstalled} onChange={v => setStats({ ...stats, energyInstalled: v })} placeholder="e.g. 1000+ kW" />
                    </div>
                </div>
                <div className="flex items-center justify-end border-t border-white/[0.06] px-5 md:px-6 py-4 bg-white/[0.02]">
                    <button
                        onClick={() => handleSave('statistics', stats)}
                        disabled={loading}
                        className="rounded-lg bg-primary text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(102,187,106,0.3)] disabled:opacity-50 flex items-center gap-2 transition-all duration-200 min-h-[44px]"
                    >
=======
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">Statistics</h3>
                    <p className="text-sm text-gray-500">Update the numbers shown on the website.</p>
                </div>
                <div className="px-6 py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Happy Customers</label>
                            <input type="text" value={stats.happyCustomers} onChange={e => setStats({ ...stats, happyCustomers: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Projects Complete</label>
                            <input type="text" value={stats.projectsComplete} onChange={e => setStats({ ...stats, projectsComplete: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cities Covered</label>
                            <input type="text" value={stats.citiesCovered} onChange={e => setStats({ ...stats, citiesCovered: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Energy Installed</label>
                            <input type="text" value={stats.energyInstalled} onChange={e => setStats({ ...stats, energyInstalled: e.target.value })} className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-4 border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                    <button onClick={() => handleSave('statistics', stats)} disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2 transition-colors">
>>>>>>> target/main
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Statistics
                    </button>
                </div>
<<<<<<< HEAD
            </motion.div>
=======
            </div>
>>>>>>> target/main
        </div>
    )
}
