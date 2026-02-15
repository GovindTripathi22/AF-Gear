// Sport-specific Kit Builder configuration
// Each sport has its own garments, colours, patterns, collar options, and features.

export interface GarmentOption {
    id: string;
    name: string;
    basePrice: number;
    description: string;
}

export interface ColorOption {
    name: string;
    hex: string;
}

export interface PatternOption {
    id: string;
    name: string;
    description: string;
}

export interface SportConfig {
    id: string;
    name: string;
    subtitle: string;
    emoji: string;
    bgGradient: string;
    garments: GarmentOption[];
    patterns: PatternOption[];
    collars: string[];
    features: { id: string; name: string; description: string; price: number }[];
    sizesKids: string[];
    sizesAdults: string[];
    fabrics: { id: string; name: string; description: string; priceAddon: number }[];
}

export const SPORT_COLORS: ColorOption[] = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#f5f5f5" },
    { name: "Navy", hex: "#1e3a5f" },
    { name: "Royal Blue", hex: "#2563eb" },
    { name: "Sky Blue", hex: "#38bdf8" },
    { name: "Red", hex: "#dc2626" },
    { name: "Maroon", hex: "#7f1d1d" },
    { name: "Green", hex: "#16a34a" },
    { name: "Emerald", hex: "#059669" },
    { name: "Gold", hex: "#ca8a04" },
    { name: "Amber", hex: "#d97706" },
    { name: "Orange", hex: "#ea580c" },
    { name: "Grey", hex: "#6b7280" },
    { name: "Charcoal", hex: "#374151" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Teal", hex: "#14b8a6" },
    { name: "Lime", hex: "#84cc16" },
    { name: "Burgundy", hex: "#881337" },
];

export const SPORTS: SportConfig[] = [
    {
        id: "gaa",
        name: "Official GAA",
        subtitle: "Hurling & Football kits for clubs and counties",
        emoji: "🏑",
        bgGradient: "from-green-600/20 to-emerald-900/20",
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 54.99, description: "Premium sublimated match-day jersey" },
            { id: "shorts", name: "Match Shorts", basePrice: 29.99, description: "Lightweight performance shorts" },
            { id: "socks", name: "Match Socks", basePrice: 12.99, description: "Cushioned knee-high socks" },
            { id: "half-zip", name: "Half-Zip Top", basePrice: 49.99, description: "Training half-zip with brushed inner" },
            { id: "hoodie", name: "Pullover Hoodie", basePrice: 59.99, description: "Heavyweight fleece hoodie" },
            { id: "skinny-pants", name: "Skinny Pants", basePrice: 39.99, description: "Tapered fit training pants" },
            { id: "training-vest", name: "Training Vest", basePrice: 24.99, description: "Breathable mesh training bib" },
            { id: "polo", name: "Polo Shirt", basePrice: 39.99, description: "Smart casual team polo" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 69.99, description: "Waterproof quarter-zip rain jacket" },
            { id: "beanie", name: "Beanie Hat", basePrice: 14.99, description: "Embroidered acrylic beanie" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Large holdall kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "hoops", name: "Hoops", description: "Traditional horizontal hoops" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour transition" },
            { id: "pinstripe", name: "Pinstripes", description: "Subtle thin stripes" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
            { id: "diamond", name: "Diamond Check", description: "Diamond pattern overlay" },
        ],
        collars: ["Crew Neck", "V-Neck", "Grandad Collar", "Half-Zip Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Embroidered or printed club crest", price: 5 },
            { id: "county-crest", name: "County Crest", description: "Official county crest placement", price: 6 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest area", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on upper back", price: 3 },
            { id: "sponsor-sleeve", name: "Sleeve Sponsor", description: "Logo on sleeve", price: 2 },
            { id: "memorial-text", name: "Memorial Text", description: "In memory text on collar/hem", price: 3 },
            { id: "irish-text", name: "Irish Language Text", description: "Team name in Irish (as Gaeilge)", price: 0 },
            { id: "gaa-logo", name: "GAA Logo", description: "Official GAA logo placement", price: 0 },
        ],
        sizesKids: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester — great value", priceAddon: 0 },
            { id: "pro", name: "Pro Mesh", description: "180gsm micro-mesh — breathable", priceAddon: 5 },
            { id: "elite", name: "Elite Lycra", description: "200gsm 4-way stretch — premium fit", priceAddon: 10 },
        ],
    },
    {
        id: "lgfa-camogie",
        name: "LGFA / Camogie",
        subtitle: "Ladies football and camogie teamwear",
        emoji: "🏐",
        bgGradient: "from-pink-600/20 to-rose-900/20",
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 54.99, description: "Women's fit sublimated jersey" },
            { id: "skort", name: "Skort", basePrice: 32.99, description: "Built-in shorts skort" },
            { id: "shorts", name: "Match Shorts", basePrice: 29.99, description: "Women's fit match shorts" },
            { id: "socks", name: "Match Socks", basePrice: 12.99, description: "Cushioned knee-high socks" },
            { id: "half-zip", name: "Half-Zip Top", basePrice: 49.99, description: "Fitted half-zip training top" },
            { id: "hoodie", name: "Pullover Hoodie", basePrice: 59.99, description: "Women's fit fleece hoodie" },
            { id: "leggings", name: "Training Leggings", basePrice: 34.99, description: "High-waist compression leggings" },
            { id: "polo", name: "Polo Shirt", basePrice: 39.99, description: "Women's fit team polo" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 69.99, description: "Waterproof quarter-zip" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Large holdall kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "hoops", name: "Hoops", description: "Traditional horizontal hoops" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour transition" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
        ],
        collars: ["Crew Neck", "V-Neck", "Grandad Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Embroidered or printed club crest", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest area", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on upper back", price: 3 },
            { id: "irish-text", name: "Irish Language Text", description: "Team name in Irish", price: 0 },
            { id: "lgfa-logo", name: "LGFA/Camogie Logo", description: "Official logo placement", price: 0 },
        ],
        sizesKids: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester", priceAddon: 0 },
            { id: "pro", name: "Pro Mesh", description: "180gsm micro-mesh", priceAddon: 5 },
            { id: "elite", name: "Elite Lycra", description: "200gsm 4-way stretch", priceAddon: 10 },
        ],
    },
    {
        id: "soccer",
        name: "Soccer",
        subtitle: "Football kits for clubs, leagues, and schools",
        emoji: "⚽",
        bgGradient: "from-blue-600/20 to-indigo-900/20",
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 49.99, description: "Sublimated soccer jersey" },
            { id: "gk-jersey", name: "Goalkeeper Jersey", basePrice: 54.99, description: "Padded elbow goalkeeper jersey" },
            { id: "shorts", name: "Match Shorts", basePrice: 27.99, description: "Lightweight match shorts" },
            { id: "socks", name: "Match Socks", basePrice: 11.99, description: "Knee-high football socks" },
            { id: "training-top", name: "Training Top", basePrice: 44.99, description: "Long-sleeve training top" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 64.99, description: "Waterproof training jacket" },
            { id: "hoodie", name: "Zip Hoodie", basePrice: 59.99, description: "Full-zip team hoodie" },
            { id: "tracksuit-top", name: "Tracksuit Top", basePrice: 54.99, description: "Woven track jacket" },
            { id: "tracksuit-pants", name: "Tracksuit Pants", basePrice: 44.99, description: "Tapered track pants" },
            { id: "polo", name: "Polo Shirt", basePrice: 39.99, description: "Matchday travel polo" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Large holdall kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour transition" },
            { id: "sash", name: "Diagonal Sash", description: "Diagonal band across chest" },
            { id: "pinstripe", name: "Pinstripes", description: "Subtle thin stripes" },
            { id: "block", name: "Colour Block", description: "Large block sections" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
        ],
        collars: ["Crew Neck", "V-Neck", "Polo Collar", "Henley Collar", "Mandarin Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Embroidered or printed club crest", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "captain-armband", name: "Captain Armband", description: "Matching captain armband", price: 8 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest area", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on upper back", price: 3 },
            { id: "sponsor-sleeve", name: "Sleeve Sponsor", description: "Logo on sleeve", price: 2 },
            { id: "flag-badge", name: "League/Flag Badge", description: "Sleeve league badge", price: 4 },
        ],
        sizesKids: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester", priceAddon: 0 },
            { id: "pro", name: "Aero Mesh", description: "180gsm perforated mesh", priceAddon: 5 },
            { id: "elite", name: "Dri-Fit Pro", description: "200gsm moisture-wicking premium", priceAddon: 10 },
        ],
    },
    {
        id: "rugby",
        name: "Rugby",
        subtitle: "Reinforced kits built for contact sport",
        emoji: "🏉",
        bgGradient: "from-red-600/20 to-red-900/20",
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 59.99, description: "Reinforced sublimated rugby jersey" },
            { id: "shorts", name: "Match Shorts", basePrice: 29.99, description: "Reinforced seam rugby shorts" },
            { id: "socks", name: "Match Socks", basePrice: 12.99, description: "Cushioned rugby socks" },
            { id: "contact-suit", name: "Contact Suit", basePrice: 44.99, description: "Skin-tight base layer for contact" },
            { id: "training-top", name: "Training Top", basePrice: 49.99, description: "Quarter-zip training top" },
            { id: "hoodie", name: "Pullover Hoodie", basePrice: 59.99, description: "Heavyweight fleece hoodie" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 69.99, description: "Waterproof shell jacket" },
            { id: "tracksuit-top", name: "Tracksuit Top", basePrice: 54.99, description: "Full-zip track jacket" },
            { id: "tracksuit-pants", name: "Tracksuit Pants", basePrice: 44.99, description: "Side-zip track pants" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "XL reinforced kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "hoops", name: "Hoops", description: "Traditional rugby hoops" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
            { id: "gradient", name: "Gradient Fade", description: "Colour fade effect" },
        ],
        collars: ["Collar (Traditional)", "Crew Neck", "Grandad Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Woven or embroidered crest", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on back", price: 3 },
            { id: "reinforced-seams", name: "Reinforced Seams", description: "Triple-stitched stress points", price: 5 },
            { id: "grip-strips", name: "Grip Strips", description: "Rubber grip on hem interior", price: 4 },
        ],
        sizesKids: ["5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester", priceAddon: 0 },
            { id: "pro", name: "Rugby Pro", description: "220gsm reinforced mesh", priceAddon: 8 },
            { id: "elite", name: "Combat Elite", description: "280gsm anti-tear fabric", priceAddon: 15 },
        ],
    },
    {
        id: "basketball",
        name: "Basketball",
        subtitle: "Performance vests and shorts for the court",
        emoji: "🏀",
        bgGradient: "from-orange-600/20 to-amber-900/20",
        garments: [
            { id: "vest", name: "Match Vest / Singlet", basePrice: 44.99, description: "Sublimated basketball vest" },
            { id: "shorts", name: "Match Shorts", basePrice: 34.99, description: "Knee-length basketball shorts" },
            { id: "reversible-vest", name: "Reversible Vest", basePrice: 54.99, description: "Two-tone reversible training vest" },
            { id: "warm-up-top", name: "Warm-Up Shooting Top", basePrice: 49.99, description: "Long-sleeve warm-up top" },
            { id: "hoodie", name: "Team Hoodie", basePrice: 59.99, description: "Oversized team hoodie" },
            { id: "tracksuit-pants", name: "Breakaway Pants", basePrice: 49.99, description: "Side-button breakaway pants" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Backpack-style kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "stripes", name: "Side Stripes", description: "Racing stripes down sides" },
            { id: "gradient", name: "Gradient Fade", description: "Top-to-bottom fade" },
            { id: "block", name: "Colour Block", description: "Large panel sections" },
            { id: "camo", name: "Camo", description: "Digital camouflage pattern" },
        ],
        collars: ["Scoop Neck", "V-Neck", "Crew Neck"],
        features: [
            { id: "club-crest", name: "Team Logo", description: "Printed or embroidered logo", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Large front + back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on back waistband", price: 3 },
        ],
        sizesKids: ["5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["S", "M", "L", "XL", "2XL", "3XL"],
        fabrics: [
            { id: "standard", name: "Standard Mesh", description: "150gsm basketball mesh", priceAddon: 0 },
            { id: "pro", name: "Pro Breathe", description: "180gsm micro-perforated", priceAddon: 5 },
            { id: "elite", name: "NBA-Grade", description: "210gsm moisture-control", priceAddon: 12 },
        ],
    },
    {
        id: "athletics",
        name: "Athletics",
        subtitle: "Track & field singlets, shorts, and warm-ups",
        emoji: "🏃",
        bgGradient: "from-yellow-600/20 to-yellow-900/20",
        garments: [
            { id: "singlet", name: "Racing Singlet", basePrice: 39.99, description: "Lightweight sublimated singlet" },
            { id: "crop-top", name: "Crop Top", basePrice: 34.99, description: "Women's athletics crop" },
            { id: "shorts", name: "Running Shorts", basePrice: 27.99, description: "Split-side race shorts" },
            { id: "tights", name: "Running Tights", basePrice: 39.99, description: "Full-length compression tights" },
            { id: "tracksuit-top", name: "Tracksuit Top", basePrice: 54.99, description: "Full-zip warm-up jacket" },
            { id: "tracksuit-pants", name: "Tracksuit Pants", basePrice: 44.99, description: "Tapered warm-up pants" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 64.99, description: "Packable waterproof shell" },
            { id: "kitbag", name: "Kit Bag", basePrice: 29.99, description: "Drawstring kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour fade" },
            { id: "stripes", name: "Side Stripes", description: "Racing stripes" },
            { id: "block", name: "Colour Block", description: "Panel sections" },
            { id: "lightning", name: "Lightning Bolt", description: "Dynamic bolt graphic" },
        ],
        collars: ["Scoop Neck", "Crew Neck", "Racerback"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Printed club logo", price: 5 },
            { id: "player-name", name: "Athlete Name", description: "Name on back or hip", price: 4 },
            { id: "player-number", name: "Race Number Panel", description: "Pin-on number panel area", price: 0 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest", price: 3 },
            { id: "ai-branding", name: "Athletics Ireland Logo", description: "Official AI logo", price: 0 },
        ],
        sizesKids: ["5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "120gsm ultralight", priceAddon: 0 },
            { id: "pro", name: "AeroLite", description: "100gsm perforated race-day", priceAddon: 6 },
            { id: "elite", name: "SpeedSkin", description: "90gsm wind-tunnel tested", priceAddon: 14 },
        ],
    },
];

export function getSportById(id: string): SportConfig | undefined {
    return SPORTS.find(s => s.id === id);
}
