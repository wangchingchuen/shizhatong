# 識詐通 產品影片（Remotion）

片名：【有「識」無恐，詐騙不通】。概念展示影片，2:29，30 fps，畫面全部由程式繪製（React／SVG／CSS／three.js），音效全部由程式合成。

## 交付檔案

| 檔案 | 內容 |
|---|---|
| `shizhatong-tech.mp4` | 橫式 1920×1080，字幕＋合成音效 |
| `shizhatong-tech-vertical.mp4` | 直式 1080×1920，字幕＋合成音效 |
| `shizhatong-tech-nosfx.mp4`、`shizhatong-tech-vertical-nosfx.mp4` | 無音效版（沒有音軌），方便另外配樂或配音 |
| `shizhatong-tech-voice.mp4`、`shizhatong-tech-vertical-voice.mp4` | 加上 TTS 旁白配音的版本（見下方說明） |
| `storyboard.md` | 每個場景的秒數、旁白、台詞與動態事件（由 timeline 自動產生） |
| `sources.md` | 外部事實與來源（本片：無） |

## 重新渲染

需求：Node 22（可直接執行 `.ts` 的 type stripping）、Python 3、ffmpeg。可選：espeak-ng＋pypinyin（旁白配音版）。

```bash
cd video
npm install
pip install fonttools brotli pypinyin     # 字型子集化；pypinyin 只在配音版需要
npm run render                            # 全部重做：風險值 → logo → 字型 → 音效 → 橫式＋直式 → 各版本 mux
npm run render -- --only=Main             # 只渲染橫式
npm run render -- --shots                 # 重新用 Playwright 擷取 dist/ 原型截圖
npm run render -- --skip-video            # 只重做音效並重新 mux（沿用 out/ 裡已渲染的畫面）
npm run studio                            # Remotion Studio 預覽、調整
```

`npm run render` 依序執行：

1. `scripts/compute-risk.mjs`：用 `../dist/engine.js` 的 `analyze()` 跑「假檢警」情境，寫出 `src/data/risk.json`。影片中的風險指標全部來自這份檔案，不要手動修改。
2. 把 `../assets/logos/` 裡的 png／jpg／svg／webp 複製進 `public/logos/`，片尾字卡會自動排上去。程式不會從網路下載任何 logo。
3. `scripts/subset-fonts.py`：把 Noto Sans TC（400/500/700/900）與 JetBrains Mono 子集化成 woff2。只要 `src/` 裡有字型缺少的字，就會報錯停止（缺字檢查）。
4. `scripts/synth-audio.mjs`：依 `src/timeline.ts` 的 cue 合成音效（`out/audio/sfx.wav`）。`scripts/tts-voice.py` 產生旁白音軌（`out/audio/voice.wav`）。
5. Remotion 渲染無聲畫面（`out/Main.video.mp4`、`out/Vertical.video.mp4`）。3D 場景使用軟體 WebGL（`--gl=swangle`），4 核心約需 1 小時。
6. ffmpeg mux 出各版本，音量統一到 −16 LUFS。

如果機器上有 `/opt/pw-browsers/chromium_headless_shell-*`，渲染會優先使用它。也可以用 `REMOTION_BROWSER=/path/to/chrome` 指定瀏覽器；兩者都沒有時，由 Remotion 自行下載。

只修了一小段時，可以只重渲染那段再接回去：`node scripts/rerender-range.mjs Main 510 1169`，接著執行 `npm run render -- --skip-video`。

QA 預覽單張畫面：`node scripts/stills.mjs Main 150 1080 2925`（輸出到 `out/stills/`）。分鏡表：`node scripts/storyboard.mjs`。

## 旁白配音（TTS）說明

製作環境連不到線上 TTS 服務，也無法下載神經網路語音模型，唯一可安裝的是離線的 **espeak-ng**。它的中文字典不完整，直接讀中文字會亂念，所以先用 pypinyin 把旁白轉成帶聲調的拼音，再交給 `cmn-latn-pinyin` 語音朗讀。`-voice` 版是**機械感明顯的合成男聲**，只適合當節奏與時間參考。正式發表建議用無音效版或主版本，另外錄真人旁白，或改用品質較好的 TTS。旁白的字幕時間點都在 `src/timeline.ts`。

## 程式結構

```
src/
  timeline.ts        唯一時間表：場景秒數、旁白字幕、台詞、音效 cue（畫面與音效共用）
  Video.tsx          依時間表排場景、掃描轉場、HUD、字幕
  scenes/            19 個場景（Open1 … End）
  components/        可重複使用元件：Phone、CallScreen、AlertCard、Chip、RingBuffer、Scanner、
                     SignalChannel、SmsNotification、FieldList、MemoryGrid、RiskChart、Waveform、
                     LiveTranscript（台詞＝即時逐字稿）、Subtitles（旁白＝一般字幕）、LockBox、Logo、
                     Silhouette、Cursor、ScanWipe、GridBg、DepthBlur …
  components/three/  three.js 元件：CityWindows（城市窗格立面）、LivingRoom、CityTopDown、SignalArc、CameraRig
  data/risk.json     由 dist/engine.js 產生的風險數值
public/shots/        Playwright 擷取的 dist/ 原型截圖
public/fonts/        子集化字型（OFL）
scripts/             渲染、截圖、音效、TTS、字型、分鏡腳本
```

## 用語與誠實原則

- 畫面上的分數一律標示為「風險指標」，不顯示機率或準確率。
- 用語是「不保存錄音」「分析不上傳通話音訊」；簡訊畫面角落標「示意畫面」；聯邦學習與 model v1.1 都標「研究中」。
- 原型截圖刻意避開原型首頁的「✓ 不錄音／✓ 不上傳」標語和通話卡內的「只分析，不錄音」字樣，因為這些措辭不符合本片的用語規範。
