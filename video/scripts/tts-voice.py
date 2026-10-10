"""Optional narration track with offline TTS (espeak-ng, Mandarin via tone-numbered pinyin from pypinyin).
espeak-ng in this environment has no full Chinese dictionary, so text is converted to pinyin first.
Output: out/audio/voice.wav (48 kHz mono), each line placed at its subtitle start and sped up to fit its slot."""
import json, pathlib, shutil, subprocess, sys, tempfile

root = pathlib.Path(__file__).resolve().parent.parent
if not shutil.which('espeak-ng'):
    sys.exit('espeak-ng not installed — skipping voice track')
from pypinyin import lazy_pinyin, Style

lines = json.loads(subprocess.check_output(['node', '-e', '''
import("./src/timeline.ts").then(m => {
  const out = [];
  for (const s of m.SCENES) for (const [a, b, text] of s.narration) out.push({start: m.sceneStart[s.id] + a, end: m.sceneStart[s.id] + b, text});
  console.log(JSON.stringify(out));
})'''], cwd=root))
tmp = pathlib.Path(tempfile.mkdtemp())
inputs, filters = [], []
for i, l in enumerate(lines):
    text = l['text'].replace('「', '').replace('」', '')
    py = ' '.join(lazy_pinyin(text, style=Style.TONE3, neutral_tone_with_five=True)).replace('，', ',').replace('。', '.').replace('：', ',')
    raw = tmp / f'{i}.wav'
    subprocess.run(['espeak-ng', '-v', 'cmn-latn-pinyin', '-s', '175', '-p', '40', '-g', '2', '-w', str(raw), py], check=True)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(raw)]))
    slot = l['end'] - l['start'] - 0.2
    tempo = max(1.0, min(2.0, dur / slot))
    inputs += ['-i', str(raw)]
    filters.append(f'[{i}]atempo={tempo:.3f},aresample=48000,adelay={int(l["start"] * 1000)}|{int(l["start"] * 1000)}[v{i}]')
    print(f'{l["start"]:6.1f}s  {dur:4.1f}s → slot {slot:4.1f}s  tempo {tempo:.2f}  {l["text"]}')
mix = ''.join(f'[v{i}]' for i in range(len(lines))) + f'amix=inputs={len(lines)}:normalize=0,lowpass=7000,highpass=90[out]'
out = root / 'out' / 'audio' / 'voice.wav'
out.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(filters) + ';' + mix, '-map', '[out]', '-ac', '1', '-ar', '48000', str(out)], check=True)
print('voice.wav written')
