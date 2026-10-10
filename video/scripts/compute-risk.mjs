// Runs the real prototype classifier (../dist/engine.js) on the 「假檢警・監管帳戶」 scenario
// and writes the risk-index values the video displays. Do not hand-edit src/data/risk.json.
import {writeFileSync} from 'node:fs';
import {analyze, scenarios} from '../../dist/engine.js';

const scenario = scenarios.police;
let previous = [];
const steps = scenario.lines.slice(0, 3).map(([time, text]) => {
  const r = analyze(text, previous);
  previous = r.signals;
  return {time, text, score: r.score, level: r.level, l2: r.l2, hits: r.hits, signals: r.signals, reasons: r.reasons};
});
// Scene 12 comparison: a safety reminder vs. a real request.
const contrast = ['不要提供驗證碼', '請把驗證碼告訴我'].map(text => {
  const r = analyze(text);
  return {text, score: r.score, safety: r.safety, hits: r.hits.map(h => h.id)};
});
const out = {generatedFrom: 'dist/engine.js analyze() · scenarios.police', scenario: scenario.name, number: scenario.number, steps, contrast};
writeFileSync(new URL('../src/data/risk.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(steps.map(s => `${s.time} → ${s.score} (${s.level}) ${s.hits.map(h => h.id).join(',')}`).join('\n'));
