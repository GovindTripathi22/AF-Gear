const cp = require('child_process');
const fs = require('fs');

try {
    const out = cp.execSync('npx eslint "src/**/*.{ts,tsx}"', { encoding: 'utf8' });
    fs.writeFileSync('raw_lint.txt', out);
} catch (e) {
    fs.writeFileSync('raw_lint.txt', e.stdout);
}
console.log("Done");
