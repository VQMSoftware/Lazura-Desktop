import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Read version from package.json dynamically
const packageJsonPath = path.resolve(__dirname, '../package.json');
const pkgRaw = fs.readFileSync(packageJsonPath, 'utf-8');
const pkg = JSON.parse(pkgRaw);
const appVersion = pkg.version || 'unknown';

const sourceDir = path.resolve(__dirname, '../static/pages');
const targetDir = path.resolve(__dirname, '../build');

console.log(`\n📦 Lazura@v${appVersion}\n`);

function copyFileSync(src: string, dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDirRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function runYarnScript(script: string) {
  try {
    execSync(`yarn ${script}`, { stdio: 'inherit' });
  } catch {
    process.exit(1);
  }
}

copyDirRecursive(sourceDir, targetDir);
runYarnScript('build:main');
runYarnScript('build:renderer');

console.log(`\n build finished successfully!\n`);
