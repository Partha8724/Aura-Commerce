const fs = require('fs');
const path = require('path');

const dir = './src';
const replacements = {
  '#00F0FF': '#D4AF37',
  'rgba(0,240,255': 'rgba(212,175,55',
  '#7B2FFF': '#8C6D23',
  '#00FF88': '#FFD700',
  'rgba(0,255,136': 'rgba(255,215,0'
};

function walkDir(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && filePath.endsWith('.tsx')) {
      callback(filePath);
    } else if (stat.isDirectory()) {
      walkDir(filePath, callback);
    }
  });
}

walkDir(dir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
