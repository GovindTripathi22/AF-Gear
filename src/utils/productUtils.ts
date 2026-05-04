const CATEGORY_ALIASES: Record<string, string> = {
    club: 'Club',
    clubs: 'Club',
    clubcollection: 'Club',
    clubbeforeeverything: 'Club',
    clubsweater: 'Club Sweaters',
    clubsweaters: 'Club Sweaters',
    sweater: 'Club Sweaters',
    sweaters: 'Club Sweaters',
    hoodie: 'Club Sweaters',
    hoodies: 'Club Sweaters',
    irish: 'Gaeilge',
    gaeilge: 'Gaeilge',
    irishlanguage: 'Gaeilge',
    irishlanguagecollection: 'Gaeilge',
    gaeilgecollection: 'Gaeilge',
    pub: 'Pub Jerseys',
    pubjersey: 'Pub Jerseys',
    pubjerseys: 'Pub Jerseys',
    pubjerseyscollection: 'Pub Jerseys',
    socialgear: 'Pub Jerseys',
    limerick: 'Limerick',
    limerik: 'Limerick',
    limerickcollection: 'Limerick',
    limerikcollection: 'Limerick',
    treatycity: 'Limerick',
    tipperary: 'Tipperary',
    tipperarycollection: 'Tipperary',
    premiercounty: 'Tipperary',
};

export function normalizeProductToken(value?: string | null): string {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '');
}

export function slugifyProductPath(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function normalizeCategoryName(category?: string | null): string {
    const token = normalizeProductToken(category);
    return CATEGORY_ALIASES[token] || category?.trim() || 'Uncategorized';
}

/**
 * Shared utility for determining the effective storefront category of a product.
 * It accepts both CMS labels and URL-style slugs so collection pages stay in sync
 * with the home-page grouping.
 */
export function getEffectiveCategory(product: { name?: string; category?: string }): string {
    const category = normalizeCategoryName(product.category);
    const nameLower = (product.name || '').toLowerCase();
    const catToken = normalizeProductToken(category);

    if (catToken === 'club' || catToken === 'jersey' || catToken === 'jerseys') {
        if (nameLower.includes('sweater') || nameLower.includes('1/4 zip') || nameLower.includes('hoodie')) {
            return 'Club Sweaters';
        }
        if (nameLower.includes('irish') || nameLower.includes('gaeilge') || nameLower.includes('fag') || nameLower.includes('croi')) {
            return 'Gaeilge';
        }
        if (nameLower.includes('thatch') || nameLower.includes('pub')) {
            return 'Pub Jerseys';
        }
    }

    return category;
}
