import * as fs from 'fs';
import * as path from 'path';

function findRecentFiles(dir: string, depth = 0) {
  if (depth > 5) return;
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file === 'node_modules' || file === '.git' || file === 'proc' || file === 'sys' || file === 'dev' || file === 'var/lib') {
        continue;
      }
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          findRecentFiles(fullPath, depth + 1);
        } else {
          const minsAgo = (Date.now() - stat.mtimeMs) / (1000 * 60);
          if (minsAgo < 5) {
            console.log(`RECENT-FILE: ${fullPath} (${stat.size} bytes, modified ${minsAgo.toFixed(2)} mins ago)`);
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

console.log("Searching entire system for any file modified in the last 5 minutes...");
findRecentFiles('/');
console.log("Search complete.");
