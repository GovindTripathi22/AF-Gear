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
    pubjerseycollection: 'Pub Jerseys',
    pubjerseyscollection: 'Pub Jerseys',
    pubjerseydesign: 'Pub Jerseys',
    pubjerseysdesign: 'Pub Jerseys',
    socialgear: 'Pub Jerseys',
    thatch: 'Pub Jerseys',
    limerick: 'Limerick',
    limerik: 'Limerick',
    limerickcollection: 'Limerick',
    limerikcollection: 'Limerick',
    treatycity: 'Limerick',
    tipperary: 'Tipperary',
    tipperarycollection: 'Tipperary',
    premiercounty: 'Tipperary',
};

const CANONICAL_CATEGORY_ORDER = [
    'Gaeilge',
    'Club Sweaters',
    'Pub Jerseys',
    'Limerick',
    'Tipperary',
    'Club',
] as const;

const CATEGORY_MATCHERS: Record<(typeof CANONICAL_CATEGORY_ORDER)[number], string[]> = {
    Gaeilge: ['gaeilge', 'irishlanguage', 'irishcollection', 'irish'],
    'Club Sweaters': ['clubsweater', 'clubsweaters', 'quarterzip', '14zip', 'hoodie', 'hoodies', 'sweater', 'sweaters'],
    'Pub Jerseys': ['pubjersey', 'pubjerseys', 'pubcollection', 'socialgear', 'thatch'],
    Limerick: ['limerick', 'limerik', 'treatycity'],
    Tipperary: ['tipperary', 'premiercounty'],
    Club: ['clubbeforeeverything', 'clubcollection', 'club'],
};

type ProductCategoryInput = {
    name?: string | null;
    category?: string | null;
    slug?: string | null;
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

function inferCanonicalCategoryFromTokens(tokens: string[]): string | null {
    for (const category of CANONICAL_CATEGORY_ORDER) {
        const matchers = CATEGORY_MATCHERS[category];
        if (tokens.some((token) => matchers.some((matcher) => token.includes(matcher)))) {
            return category;
        }
    }

    return null;
}

/**
 * Shared utility for determining the effective storefront category of a product.
 * It accepts both CMS labels and URL-style slugs so collection pages stay in sync
 * with the home-page grouping.
 */
export function getEffectiveCategory(product: ProductCategoryInput): string {
    const normalizedCategory = normalizeCategoryName(product.category);
    const categoryToken = normalizeProductToken(normalizedCategory);
    const originalCategoryToken = normalizeProductToken(product.category);
    const nameToken = normalizeProductToken(product.name);
    const slugToken = normalizeProductToken(product.slug);

    const directCategory = inferCanonicalCategoryFromTokens([categoryToken, originalCategoryToken]);
    if (directCategory && directCategory !== 'Club') {
        return directCategory;
    }

    const contentCategory = inferCanonicalCategoryFromTokens([nameToken, slugToken]);
    if (contentCategory && contentCategory !== 'Club') {
        return contentCategory;
    }

    return directCategory || normalizedCategory;
}

export function productBelongsToCategory(
    product: ProductCategoryInput,
    targetCategoryOrSlug?: string | null
): boolean {
    const targetCategory = normalizeCategoryName(targetCategoryOrSlug);
    const targetTokens = [
        normalizeProductToken(targetCategoryOrSlug),
        normalizeProductToken(targetCategory),
    ];

    const inferredTarget = inferCanonicalCategoryFromTokens(targetTokens);
    const effectiveCategory = getEffectiveCategory(product);

    if (inferredTarget) {
        return effectiveCategory === inferredTarget;
    }

    const effectiveToken = normalizeProductToken(effectiveCategory);
    return targetTokens.some((targetToken) =>
        Boolean(targetToken) &&
        (effectiveToken === targetToken ||
            effectiveToken.startsWith(targetToken) ||
            targetToken.startsWith(effectiveToken))
    );
}
