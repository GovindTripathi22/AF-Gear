const fs = require('fs');
const path = require('path');

const files = [
    "eslint.config.mjs",
    "package-lock.json",
    "src/lib/kit-builder-config.ts",
    "src/contexts/CartContext.tsx",
    "src/components/ui/Navbar.tsx",
    "src/components/products/ProductModal.tsx",
    "src/components/ui/Hero.tsx",
    "src/components/products/ProductGrid.tsx",
    "src/components/products/ProductCard.tsx",
    "src/components/products/KitBuilderSection.tsx",
    "src/components/products/JerseyPreview3D.tsx",
    "src/components/products/JerseyPreview.tsx",
    "src/components/products/CollectionsShowcase.tsx",
    "src/components/products/CartDrawer.tsx",
    "src/components/admin/ProductForm.tsx",
    "src/app/(public)/collections/[slug]/CollectionClient.tsx",
    "src/app/(public)/success/page.tsx",
    "src/app/(public)/products/[id]/ProductClient.tsx",
    "src/app/(public)/kit-builder/page.tsx",
    "src/app/(public)/products/[id]/page.tsx",
    "src/app/(public)/kit-builder/[sport]/page.tsx",
    "src/app/(public)/contact/page.tsx",
    "src/app/(public)/about/page.tsx",
    "src/app/(admin)/admin/layout.tsx",
    "src/app/(admin)/admin/products/actions.ts",
    "src/app/(admin)/admin/products/page.tsx",
    "src/app/(admin)/admin/content/page.tsx",
    "src/app/(admin)/admin/page.tsx",
    "src/app/api/checkout/route.ts",
    "src/app/globals.css",
    ".gitignore"
];

let fixedCount = 0;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Not found: ${file}`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the conflict block with the remote version
    // Match <<<<<<< HEAD ... ======= ... >>>>>>> [commit or branch]
    const conflictRegex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>>[^\r\n]*\r?\n?/g;

    const newContent = content.replace(conflictRegex, '$2');

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Fixed ${file}`);
        fixedCount++;
    }
});

console.log(`Total files fixed: ${fixedCount}`);
