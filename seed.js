// Use global fetch
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const products = [
    {
        name: "Pro Elite Jersey",
        slug: "pro-elite-jersey",
        description: "Our top-tier performance jersey engineered for professional athletes. Features advanced moisture-wicking fabric, reinforced stitching flatlock seams, and an athletic tailored fit for maximum mobility on the pitch. Made entirely from recycled polyester.",
        price: 45.00,
        category: "jersey",
        images: ["/products/p1-front.png", "/products/p1-back.png"],
        tags: ["Moisture-wicking technology", "Athletic fit", "100% Recycled polyester", "Reinforced stitching"],
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published"
    },
    {
        name: "Classic Training Top",
        slug: "classic-training-top",
        description: "The essential mid-layer for every training session. Brushed interior for warmth without bulk, quarter-zip collar for temperature regulation, and thumbholes to keep sleeves securely in place during high-intensity drills.",
        price: 35.00,
        category: "training",
        images: ["/products/p2-front.png"],
        tags: ["Quarter-zip design", "Brushed fleece interior", "Thumb loops", "Breathable side panels"],
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published"
    },
    {
        name: "Performance Shorts",
        slug: "performance-shorts",
        description: "Lightweight, unrestrictive performance shorts designed for speed and agility. Features a mesh-lined elastic waistband with internal drawcord, laser-cut ventilation holes, and hidden zip pockets for secure storage.",
        price: 25.00,
        category: "shorts",
        images: ["/products/p3-front.png"],
        tags: ["4-way stretch fabric", "Hidden zip pockets", "Laser-cut ventilation", "Internal drawcord"],
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published"
    },
    {
        name: "Match Day Full Kit",
        slug: "match-day-full-kit",
        description: "The complete setup for match day. Includes the Pro Elite Jersey, Performance Shorts, and compression socks. Everything your team needs to look unified and play at their highest level. Custom cresting included.",
        price: 85.00,
        category: "bundle",
        images: ["/products/p4-bundle.png"],
        tags: ["Complete 3-piece kit", "Custom cresting included", "Team discounts available", "Premium materials"],
        product_status: "booking_only",
        stock_status: "limited",
        visibility: "published"
    },
    {
        name: "Sideline Jacket",
        slug: "sideline-jacket",
        description: "Stay warm and dry on the sidelines with our weather-resistant jacket. Features a DWR water-repellent finish, lightweight thermal insulation, adjustable storm hood, and deep fleece-lined pockets.",
        price: 75.00,
        category: "outerwear",
        images: ["/products/p5-jacket.png"],
        tags: ["Water-resistant (DWR)", "Thermal insulation", "Adjustable hood", "Fleece-lined pockets"],
        product_status: "coming_soon",
        stock_status: "out_of_stock",
        visibility: "published"
    }
];

async function seedProducts() {
    console.log('Sending raw HTTP POST to insert products with the correct schema...');

    const response = await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(products)
    });

    if (!response.ok) {
        console.error('Failed to insert products:', response.status, await response.text());
    } else {
        const data = await response.json();
        console.log(`Successfully seeded ${data.length} products!`);
    }
}

seedProducts();
