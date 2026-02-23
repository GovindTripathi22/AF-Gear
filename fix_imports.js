const fs = require('fs');
const path = require('path');

const uiComponents = ['AnnouncementBar', 'AuthButtons', 'Dock', 'FilterBar', 'Footer', 'LoadingScreen', 'Navbar', 'ThemeProvider', 'Hero', 'NewsletterSection'];
const productComponents = ['AvailabilityBadge', 'CartDrawer', 'Collections', 'CollectionsShowcase', 'FeaturedShop', 'JerseyPreview', 'JerseyPreview3D', 'KitBuilderSection', 'ProductCard', 'ProductGrid', 'ProductImageMagnifier', 'ProductModal', 'SchoolUniform'];
const adminComponents = ['ProductForm'];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function updateImports(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  uiComponents.forEach(comp => {
    content = content.replace(new RegExp(`@/components/${comp}`, 'g'), `@/components/ui/${comp}`);
  });

  productComponents.forEach(comp => {
    content = content.replace(new RegExp(`@/components/${comp}`, 'g'), `@/components/products/${comp}`);
  });

  adminComponents.forEach(comp => {
    content = content.replace(new RegExp(`@/components/${comp}`, 'g'), `@/components/admin/${comp}`);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
}

walkDir('src', updateImports);
console.log('Import paths updated.');
