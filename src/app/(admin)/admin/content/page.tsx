'use client'

import { useState, useEffect } from 'react'
import { updateContent } from './actions'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

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

export default function ContentPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [hero, setHero] = useState<HeroContent>({ title: '', subtitle: '', ctaText: '', ctaLink: '', backgroundImage: '' })
    const [stats, setStats] = useState<StatsContent>({ happyCustomers: '', projectsComplete: '', citiesCovered: '', energyInstalled: '' })

    // Fetch existing data on mount
    useEffect(() => {
        async function loadContent() {
            try {
                const [heroResult, statsResult] = await Promise.all([
                    supabase.from('site_content').select('content').eq('key', 'homepage_hero').single(),
                    supabase.from('site_content').select('content').eq('key', 'statistics').single(),
                ])

                if (heroResult.data?.content) {
                    setHero({ ...hero, ...heroResult.data.content })
                }
                if (statsResult.data?.content) {
                    setStats({ ...stats, ...statsResult.data.content })
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
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
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
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Hero
                    </button>
                </div>
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
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Statistics
                    </button>
                </div>
            </div>
        </div>
    )
}
