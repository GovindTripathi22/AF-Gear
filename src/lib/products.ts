
export const COLLECTIONS = {
    Club: {
        title: "CLUB BEFORE EVERYTHING",
        subtitle: "Premium teamwear for your club identity",
        products: [
            { id: 1, title: "Club Elite Home Jersey", category: "Club", price: "€54.99", image: "/assets/1000030808.png", status: "live" },
            { id: 2, title: "Club Away Jersey", category: "Club", price: "€54.99", image: "/assets/1000030809.png", status: "coming_soon" },
            { id: 3, title: "Club Training Jacket", category: "Club", price: "€69.99", image: "/assets/1000031016.png", status: "coming_soon" },
            { id: 4, title: "Club Quarter-Zip", category: "Club", price: "€44.99", image: "/assets/1000030821.png", status: "coming_soon" },
            { id: 5, title: "Club Performance Top", category: "Club", price: "€39.99", image: "/assets/1000031017.png", status: "coming_soon" },
            { id: 6, title: "Club Rain Shell", category: "Club", price: "€74.99", image: "/assets/1000031016.png", status: "coming_soon" },
            { id: 7, title: "Club Match Jersey", category: "Club", price: "€54.99", image: "/assets/1000030808.png", status: "coming_soon" },
            { id: 8, title: "Club Elite Shorts", category: "Club", price: "€29.99", image: "/assets/1000031017.png", status: "coming_soon" },
        ]
    },
    Limerick: {
        title: "THE LIMERICK COLLECTION",
        subtitle: "Treaty City pride in every stitch",
        products: [
            { id: 9, title: "Limerick Home Jersey", category: "Limerick", price: "€54.99", image: "/assets/1000030323.png", status: "live" },
            { id: 10, title: "Limerick Away Jersey", category: "Limerick", price: "€54.99", image: "/assets/1000030251.png", status: "coming_soon" },
            { id: 11, title: "Limerick Training Kit", category: "Limerick", price: "€49.99", image: "/assets/1000029834.png", status: "coming_soon" },
            { id: 12, title: "Limerick Official Crest Tee", category: "Limerick", price: "€29.99", image: "/assets/1000015896.png", status: "coming_soon" },
            { id: 13, title: "Limerick Performance Polo", category: "Limerick", price: "€39.99", image: "/assets/1000016812.jpg", status: "coming_soon" },
            { id: 14, title: "Limerick Match Shorts", category: "Limerick", price: "€27.99", image: "/assets/1000026154.jpg", status: "coming_soon" },
            { id: 15, title: "Treaty City Hoodie", category: "Limerick", price: "€64.99", image: "/assets/1000030323.png", status: "coming_soon" },
            { id: 16, title: "Limerick Training Shell", category: "Limerick", price: "€72.50", image: "/assets/1000030251.png", status: "coming_soon" },
        ]
    },
    Tipperary: {
        title: "THE TIPPERARY COLLECTION",
        subtitle: "Premier County excellence on and off the field",
        products: [
            { id: 17, title: "Tipperary Home Jersey", category: "Tipperary", price: "€54.99", image: "/assets/1000030324.png", status: "live" },
            { id: 18, title: "Tipperary Away Jersey", category: "Tipperary", price: "€54.99", image: "/assets/1000030248.png", status: "coming_soon" },
            { id: 19, title: "Tipperary Training Top", category: "Tipperary", price: "€49.99", image: "/assets/1000031376.png", status: "coming_soon" },
            { id: 20, title: "Tipperary Match Kit", category: "Tipperary", price: "€59.99", image: "/assets/1000029954.png", status: "coming_soon" },
            { id: 21, title: "Tipperary Performance Jacket", category: "Tipperary", price: "€82.50", image: "/assets/1000029835.png", status: "coming_soon" },
            { id: 22, title: "Tipperary Polo Shirt", category: "Tipperary", price: "€38.99", image: "/assets/1000028906.png", status: "coming_soon" },
            { id: 23, title: "Tipperary Training Jersey", category: "Tipperary", price: "€44.99", image: "/assets/1000024963.jpg", status: "coming_soon" },
            { id: 24, title: "Tipperary Retro Tee", category: "Tipperary", price: "€32.50", image: "/assets/1000025706.jpg", status: "coming_soon" },
        ]
    },
    Irish: {
        title: "IRISH LANGUAGE COLLECTION",
        subtitle: "Promote Gaeilge in your school or club — Custom Irish language jerseys available for teams",
        products: [
            { id: 25, title: "Tóg go Bog é Tee", category: "Gaeilge", price: "€34.99", image: "/assets/1000016844.png", status: "coming_soon" },
            { id: 26, title: "Fan Socair Hoodie", category: "Gaeilge", price: "€62.50", image: "/assets/1000016604.png", status: "coming_soon" },
            { id: 27, title: "Heritage Graphic Tee", category: "Gaeilge", price: "€32.99", image: "/assets/1000017537.jpg", status: "coming_soon" },
            { id: 28, title: "Celtic Script Polo", category: "Gaeilge", price: "€39.99", image: "/assets/1000017694.jpg", status: "coming_soon" },
            { id: 29, title: "Shamrock Performance Tee", category: "Gaeilge", price: "€34.99", image: "/assets/1000018054.jpg", status: "coming_soon" },
            { id: 30, title: "Emerald Isle Sweatshirt", category: "Gaeilge", price: "€54.99", image: "/assets/1000018063.jpg", status: "coming_soon" },
            { id: 31, title: "Tradition Crest Tee", category: "Gaeilge", price: "€29.99", image: "/assets/1000018066.jpg", status: "coming_soon" },
            { id: 32, title: "Irish Legend Zip", category: "Gaeilge", price: "€67.50", image: "/assets/1000018069.jpg", status: "coming_soon" },
        ]
    }
};

export const ALL_PRODUCTS = Object.values(COLLECTIONS).flatMap(c => c.products);
