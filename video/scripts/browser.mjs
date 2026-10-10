// Use a local Chromium headless shell (Playwright's) if present; otherwise let Remotion download its own.
import {existsSync, readdirSync} from 'node:fs';
const fromEnv = process.env.REMOTION_BROWSER;
const pw = '/opt/pw-browsers';
let found = null;
if (existsSync(pw)) for (const d of readdirSync(pw)) if (d.startsWith('chromium_headless_shell')) {
  const p = `${pw}/${d}/chrome-linux/headless_shell`;
  if (existsSync(p)) found = p;
}
export const browserExecutable = fromEnv || found || null;
