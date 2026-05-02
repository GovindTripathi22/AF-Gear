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
    { id: "limerick",    name: "Limerick",     slug: "limerick",     tagline: "TREATY CITY",    subtitle: "Premium Limerick GAA Selection",   crest: "/assets/limerick_crest_final.png",   order: 1 },
    { id: "tipperary",   name: "Tipperary",    slug: "tipperary",    tagline: "PREMIER COUNTY",  subtitle: "Premium Tipperary GAA Selection",  crest: "/assets/tipperary_crest_final.png",  order: 2 },
    { id: "club",        name: "Club",         slug: "club",         tagline: "CLUB GEAR",       subtitle: "Premium Club Collection",          order: 3 },
    { id: "irish",       name: "Irish",        slug: "irish",        tagline: "GAEILGE",         subtitle: "Irish Heritage Collection",         order: 4 },
    { id: "pub-jerseys", name: "Pub Jerseys",  slug: "pub-jerseys",  tagline: "SOCIAL GEAR",     subtitle: "Social Gear for Your Local",        order: 5 },
    { id: "schooluniform", name: "School Uniform", slug: "schooluniform", tagline: "SCHOOL GEAR", subtitle: "Premium School Uniforms",         order: 6 },
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
