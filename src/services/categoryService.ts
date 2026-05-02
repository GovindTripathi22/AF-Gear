export interface Category {
    id: string;
    name: string;          // Display name, e.g. "Pub Jerseys"
    slug: string;          // URL slug, e.g. "pub-jerseys"
    tagline?: string;      // CMS tagline, e.g. "SOCIAL GEAR"
    subtitle?: string;     // Subtitle shown on collection page
    crest?: string;        // Path to crest image
    accent?: string;       // Accent colour (hex or tailwind var)
    image?: string;        // Card image
    order?: number;        // Display order
}

/** Default hardcoded categories — used as fallback if DB has no data */
export const DEFAULT_CATEGORIES: Category[] = [
    { id: "club",        name: "Club",         slug: "club",         tagline: "CLUB GEAR",       subtitle: "Before Everything",              image: "/assets/club-1.png",                 order: 1 },
    { id: "irish",       name: "Gaeilge",      slug: "gaeilge",      tagline: "GAEILGE",         subtitle: "Heritage Collection",            image: "/assets/irish-1.png",                accent: "#FFFFFF", order: 2 },
    { id: "pub-jerseys", name: "Pub Jerseys",  slug: "pub-jerseys",  tagline: "SOCIAL GEAR",     subtitle: "Social Collection",              image: "/assets/pub-jerseys/1000038099.png", order: 3 },
    { id: "limerick",    name: "Limerick",     slug: "limerick",     tagline: "TREATY CITY",     subtitle: "Treaty City",                    image: "/assets/limerick-1.png",             crest: "/assets/limerick_crest_final.png",  order: 4 },
    { id: "tipperary",   name: "Tipperary",    slug: "tipperary",    tagline: "PREMIER COUNTY",  subtitle: "Premier County",                 image: "/assets/tipperary-1.png",            crest: "/assets/tipperary_crest_final.png", order: 5 },
];

/**
 * Fetch categories from site_content (key = "store_categories").
 * Falls back to DEFAULT_CATEGORIES when the table is empty or unavailable.
 * This function is safe to call from both server components and API routes.
 */
export async function fetchCategories(
    supabase: { from: (t: string) => any } | null
): Promise<Category[]> {
    if (!supabase) return DEFAULT_CATEGORIES;
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', 'store_categories')
            .single();

        if (error || !data?.content) return DEFAULT_CATEGORIES;

        const parsed: Category[] = Array.isArray(data.content) ? data.content : [];
        return parsed.length > 0
            ? parsed.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
            : DEFAULT_CATEGORIES;
    } catch {
        return DEFAULT_CATEGORIES;
    }
}
