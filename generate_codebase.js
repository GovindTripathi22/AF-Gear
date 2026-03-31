const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'codebase.txt');

const includeExtensions = new Set([
  '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json',
  '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.vue', '.svelte'
]);

const excludeFolders = new Set([
  'node_modules', 'venv', '__pycache__', '.git', 'dist', 'build', '.next', '.vscode'
]);

function getFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      if (!excludeFolders.has(file)) {
        getFiles(name, allFiles);
      }
    } else {
      if (includeExtensions.has(path.extname(file).toLowerCase())) {
        allFiles.push(name);
      }
    }
  }
  return allFiles;
}

function generateTree(dir, prefix = '') {
  let tree = '';
  const files = fs.readdirSync(dir).sort();
  
  const filtered = files.filter(file => {
    const name = path.join(dir, file);
    const isDir = fs.statSync(name).isDirectory();
    if (isDir) return !excludeFolders.has(file);
    return includeExtensions.has(path.extname(file).toLowerCase());
  });

  filtered.forEach((file, index) => {
    const isLast = index === filtered.length - 1;
    const name = path.join(dir, file);
    const isDir = fs.statSync(name).isDirectory();
    
    tree += prefix + (isLast ? '└── ' : '├── ') + file + '\n';
    
    if (isDir) {
        tree += generateTree(name, prefix + (isLast ? '    ' : '│   '));
    }
  });
  return tree;
}

console.log('Gathering files...');
const allFiles = getFiles(rootDir);
console.log(`Found ${allFiles.length} files.`);

let output = '============================================================\n';
output += 'PROJECT STRUCTURE:\n';
output += '============================================================\n';
output += generateTree(rootDir);
output += '\n';

for (const file of allFiles) {
  const relativePath = path.relative(rootDir, file);
  console.log(`Processing: ${relativePath}`);
  const content = fs.readFileSync(file, 'utf8');
  output += '============================================================\n';
  output += `FILE: ${relativePath}\n`;
  output += '============================================================\n';
  output += content + '\n\n';
}

fs.writeFileSync(outputFile, output);
console.log(`File created at: ${outputFile}`);
