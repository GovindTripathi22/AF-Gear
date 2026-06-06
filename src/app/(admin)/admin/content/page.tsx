'use client'

import { useState, useEffect } from 'react'
import { updateContent } from './actions'
import { Loader2, Save, Type, BarChart3, Image as ImageIcon, Link2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@clerk/nextjs'

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
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500" />}
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[48px] bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
            />
        </div>
    )
}

export default function ContentPage() {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [hero, setHero] = useState<HeroContent>({ title: '', subtitle: '', ctaText: '', ctaLink: '', backgroundImage: '' })
    const [stats, setStats] = useState<StatsContent>({ happyCustomers: '', projectsComplete: '', citiesCovered: '', energyInstalled: '' })

    useEffect(() => {
        async function loadContent() {
            try {
                const clerkToken = await getToken({ template: 'supabase' }) || undefined
                const supabase = createClient(clerkToken)
                const [heroResult, statsResult] = await Promise.all([
                    supabase.from('site_content').select('content').eq('key', 'homepage_hero').single(),
                    supabase.from('site_content').select('content').eq('key', 'statistics').single(),
                ])

                if (heroResult.data?.content) {
                    setHero(prev => ({ ...prev, ...heroResult.data.content }))
                }
                if (statsResult.data?.content) {
                    setStats(prev => ({ ...prev, ...statsResult.data.content }))
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
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Loading Content</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8 px-1">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                    Content Manager
                </h1>
                <p className="text-gray-500 text-sm mt-1">Update your website&apos;s content sections.</p>
            </div>

            {/* Hero Section Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Homepage Hero</h3>
                        <p className="text-[11px] text-gray-400">Banner text and call-to-action.</p>
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
                <div className="flex items-center justify-end border-t border-gray-100 px-5 md:px-6 py-4 bg-gray-50/50">
                    <button
                        onClick={() => handleSave('homepage_hero', hero)}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200 min-h-[44px]"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Hero
                    </button>
                </div>
            </div>

            {/* Stats Section Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Statistics</h3>
                        <p className="text-[11px] text-gray-400">Numbers displayed on the website.</p>
                    </div>
                </div>
                <div className="px-5 md:px-6 py-5 md:py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Happy Customers" value={stats.happyCustomers} onChange={v => setStats({ ...stats, happyCustomers: v })} placeholder="e.g. 500+" />
                        <InputField label="Projects Complete" value={stats.projectsComplete} onChange={v => setStats({ ...stats, projectsComplete: v })} placeholder="e.g. 200+" />
                        <InputField label="Clubs Partnered" value={stats.citiesCovered} onChange={v => setStats({ ...stats, citiesCovered: v })} placeholder="e.g. 120+" />
                        <InputField label="Garments Manufactured" value={stats.energyInstalled} onChange={v => setStats({ ...stats, energyInstalled: v })} placeholder="e.g. 50,000+" />
                    </div>
                </div>
                <div className="flex items-center justify-end border-t border-gray-100 px-5 md:px-6 py-4 bg-gray-50/50">
                    <button
                        onClick={() => handleSave('statistics', stats)}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200 min-h-[44px]"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Statistics
                    </button>
                </div>
            </div>
        </div>
    )
}
