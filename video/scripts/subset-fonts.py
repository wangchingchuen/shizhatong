"""Subset Noto Sans TC / JetBrains Mono (OFL) to the glyphs used in src/ and write woff2 to public/fonts.
Also fails loudly if any character used in src/ is missing from the fonts (缺字檢查)."""
import pathlib, sys
from fontTools import subset
from fontTools.ttLib import TTFont

root = pathlib.Path(__file__).resolve().parent.parent
nm = root / 'node_modules' / '@expo-google-fonts'
out = root / 'public' / 'fonts'
out.mkdir(parents=True, exist_ok=True)
text = ''.join(p.read_text(encoding='utf-8') for p in (root / 'src').rglob('*') if p.suffix in {'.ts', '.tsx', '.json'})
chars = set(text) | set(chr(c) for c in range(0x20, 0x7f)) | set('●›→↓✓☎…—「」『』，。！？；：、（）／｜・·')
chars = {c for c in chars if c >= ' '}
faces = {
    'NotoSansTC-Regular': nm / 'noto-sans-tc/400Regular/NotoSansTC_400Regular.ttf',
    'NotoSansTC-Medium': nm / 'noto-sans-tc/500Medium/NotoSansTC_500Medium.ttf',
    'NotoSansTC-Bold': nm / 'noto-sans-tc/700Bold/NotoSansTC_700Bold.ttf',
    'NotoSansTC-Black': nm / 'noto-sans-tc/900Black/NotoSansTC_900Black.ttf',
    'JetBrainsMono-Regular': nm / 'jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf',
    'JetBrainsMono-SemiBold': nm / 'jetbrains-mono/600SemiBold/JetBrainsMono_600SemiBold.ttf',
}
tc = TTFont(faces['NotoSansTC-Regular']).getBestCmap()
mono = TTFont(faces['JetBrainsMono-Regular']).getBestCmap()
missing = sorted(c for c in chars if ord(c) not in tc and ord(c) not in mono and not c.isspace() and ord(c) > 0x7f and c not in '​﻿')
# glyphs drawn only by fallback (emoji etc.) are reported but symbols we draw ourselves are fine
if missing:
    print('MISSING GLYPHS:', ''.join(missing))
for name, src in faces.items():
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
    font = TTFont(src)
    sub = subset.Subsetter(opts); sub.populate(text=''.join(chars)); sub.subset(font)
    font.flavor = 'woff2'; font.save(out / f'{name}.woff2')
    print(name, (out / f'{name}.woff2').stat().st_size // 1024, 'KB')
sys.exit(1 if missing else 0)
