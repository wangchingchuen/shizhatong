// Render preview stills for QA: node scripts/stills.mjs Main 150 240 ...  → $STILLS_DIR (default ./out/stills)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {browserExecutable} from './browser.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const [comp, ...frames] = process.argv.slice(2);
const outDir = process.env.STILLS_DIR ?? path.resolve(here, '../out/stills');
mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve(here, '../src/index.ts')});
const opts = {serveUrl, browserExecutable, chromiumOptions: {gl: 'swangle'}};
const composition = await selectComposition({...opts, id: comp});
for (const f of frames) {
  await renderStill({...opts, composition, frame: Number(f), output: `${outDir}/${comp}-${f}.jpg`, imageFormat: 'jpeg', jpegQuality: 85});
  console.log('ok', f);
}
