// One-command rebuild:  npm run render   (flags: --shots  re-capture prototype screenshots, --only=Main|Vertical, --skip-video)
// 1. risk values from ../dist/engine.js  2. logos from ../assets/logos  3. font subset + glyph check
// 4. synthesised SFX (+ optional espeak-ng narration)  5. Remotion render (muted)  6. ffmpeg mux of all variants
import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {browserExecutable} from './browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const args = process.argv.slice(2);
const only = args.find(a => a.startsWith('--only='))?.split('=')[1];
const run = (cmd, a, opts = {}) => execFileSync(cmd, a, {cwd: root, stdio: 'inherit', ...opts});
const out = path.join(root, 'out');
mkdirSync(out, {recursive: true});

run('node', ['scripts/compute-risk.mjs']);

// logos placed by the user in ../assets/logos (never downloaded)
const logoSrc = path.resolve(root, '../assets/logos');
const logoDst = path.join(root, 'public/logos');
rmSync(logoDst, {recursive: true, force: true});
const logos = [];
if (existsSync(logoSrc)) {
  mkdirSync(logoDst, {recursive: true});
  for (const f of readdirSync(logoSrc).sort()) if (/\.(png|jpe?g|svg|webp)$/i.test(f)) { copyFileSync(path.join(logoSrc, f), path.join(logoDst, f)); logos.push(`logos/${f}`); }
}
writeFileSync(path.join(root, 'src/data/logos.json'), JSON.stringify(logos) + '\n');
console.log('logos:', logos.length ? logos.join(', ') : '(none)');

run('python3', ['scripts/subset-fonts.py']);
if (args.includes('--shots') || !existsSync(path.join(root, 'public/shots/03-risk.png'))) run('node', ['scripts/capture-demo.mjs']);
run('node', ['scripts/synth-audio.mjs']);
let voice = false;
try { run('python3', ['scripts/tts-voice.py']); voice = true; } catch { console.warn('voice track skipped (needs espeak-ng + pypinyin)'); }

const comps = [['Main', 'shizhatong-tech'], ['Vertical', 'shizhatong-tech-vertical']].filter(([c]) => !only || c === only);
if (!args.includes('--skip-video')) {
  const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
  for (const [id] of comps) {
    const opts = {serveUrl, browserExecutable, chromiumOptions: {gl: 'swangle'}};
    const composition = await selectComposition({...opts, id});
    let last = 0;
    await renderMedia({...opts, composition, codec: 'h264', crf: 23, x264Preset: 'slow', pixelFormat: 'yuv420p', muted: true, concurrency: 4,
      outputLocation: path.join(out, `${id}.video.mp4`),
      onProgress: ({progress}) => { if (progress - last >= 0.05) { last = progress; console.log(`${id} ${(progress * 100).toFixed(0)}%`); } }});
  }
}

// mux variants (loudness-normalised to -16 LUFS)
const sfx = path.join(out, 'audio/sfx.wav'), vo = path.join(out, 'audio/voice.wav');
for (const [id, name] of comps) {
  const v = path.join(out, `${id}.video.mp4`);
  const enc = ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart'];
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', v, '-i', sfx, '-map', '0:v', '-map', '1:a', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', ...enc, `${name}.mp4`]);
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', v, '-map', '0:v', '-c:v', 'copy', '-an', '-movflags', '+faststart', `${name}-nosfx.mp4`]);
  if (voice) run('ffmpeg', ['-y', '-loglevel', 'error', '-i', v, '-i', sfx, '-i', vo, '-filter_complex',
    '[1]volume=0.45[s];[2]volume=1.6[n];[s][n]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]', '-map', '0:v', '-map', '[a]', ...enc, `${name}-voice.mp4`]);
  console.log('wrote', `${name}.mp4`, `${name}-nosfx.mp4`, voice ? `${name}-voice.mp4` : '');
}
