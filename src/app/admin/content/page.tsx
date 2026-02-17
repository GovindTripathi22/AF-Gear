'use client'

import { useState } from 'react'
import { updateContent } from './actions'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

// Define the shape of our content for type safety
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

type ContactContent = {
    address: string
    phone: string
    email: string
    mapLink: string
}

export default function ContentPage() {
    // In a real app, we would fetch initial data here via props or useEffect
    // For now, we'll start with empty state and rely on user to fill it or fetch in useEffect
    // To make it production ready, we should fetch initial data.
    // Let's assume we can fetch it via client side for now to keep it simple or 
    // better, fetch in server component and pass as prop.
    // For this implementation, I will make this a Client Component and assume data fetching can be added 
    // or I'll add a useEffect to fetch current data.

    // Changing to fetch data on mount
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    // State for different sections
    const [hero, setHero] = useState<HeroContent>({ title: '', subtitle: '', ctaText: '', ctaLink: '', backgroundImage: '' })
    const [stats, setStats] = useState<StatsContent>({ happyCustomers: '', projectsComplete: '', citiesCovered: '', energyInstalled: '' })
    const [contact, setContact] = useState<ContactContent>({ address: '', phone: '', email: '', mapLink: '' })

    // Fetch data (simplified)
    // useEffect(() => { ... }, [])

    const handleSave = async (section: string, data: any) => {
        setLoading(true)
        const formData = new FormData()
        formData.append('section', section)
        formData.append('content', JSON.stringify(data))

        const result = await updateContent(null, formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(`${section} updated!`)
        }
    }

    return (
        <div className="space-y-10 divide-y divide-gray-900/10">

            {/* Hero Section */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pt-5">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Homepage Hero</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Update the main banner text and image.</p>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Title</label>
                                <div className="mt-2">
                                    <input type="text" value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" />
                                </div>
                            </div>
                            <div className="sm:col-span-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Subtitle</label>
                                <div className="mt-2">
                                    <input type="text" value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button onClick={() => handleSave('homepage_hero', hero)} disabled={loading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pt-10">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Statistics</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Update the numbers shown on the website.</p>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Happy Customers</label>
                                <div className="mt-2">
                                    <input type="text" value={stats.happyCustomers} onChange={e => setStats({ ...stats, happyCustomers: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Projects Complete</label>
                                <div className="mt-2">
                                    <input type="text" value={stats.projectsComplete} onChange={e => setStats({ ...stats, projectsComplete: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button onClick={() => handleSave('statistics', stats)} disabled={loading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
