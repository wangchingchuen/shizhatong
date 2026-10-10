// Re-render one frame range and splice it into an existing out/<Comp>.video.mp4 (saves a full re-render after a small fix).
// usage: node scripts/rerender-range.mjs Main 510 1169
import {execFileSync} from 'node:child_process';
import {renameSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {browserExecutable} from './browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../out');
const [id, a, b] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4])];
const serveUrl = await bundle({entryPoint: path.resolve(here, '../src/index.ts')});
const opts = {serveUrl, browserExecutable, chromiumOptions: {gl: 'swangle'}};
const composition = await selectComposition({...opts, id});
const seg = path.join(out, `${id}.seg.mp4`), full = path.join(out, `${id}.video.mp4`), tmp = path.join(out, `${id}.splice.mp4`);
await renderMedia({...opts, composition, codec: 'h264', crf: 16, muted: true, concurrency: 4, frameRange: [a, b], outputLocation: seg});
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', full, '-i', seg, '-filter_complex',
  `[0:v]trim=end_frame=${a},setpts=PTS-STARTPTS[x];[1:v]setpts=PTS-STARTPTS[y];[0:v]trim=start_frame=${b + 1},setpts=PTS-STARTPTS[z];[x][y][z]concat=n=3:v=1[v]`,
  '-map', '[v]', '-c:v', 'libx264', '-crf', '23', '-preset', 'slow', '-pix_fmt', 'yuv420p', tmp], {stdio: 'inherit'});
renameSync(tmp, full);
console.log('spliced', id, a, b);
