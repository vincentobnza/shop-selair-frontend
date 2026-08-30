# Sharp Grotesk — vendored web faces

These three WOFF2 files are the entire typographic payload of the storefront.
The admin console runs the same typeface, width and subset but ships only the
first of them — see `shop-selair-admin/src/assets/fonts/README.md`. The subset
and the fallback metrics have to stay in step between the two; the face list
does not.
They are generated from the licensed Sharp Type desktop OTFs, which are **not**
in this repository — the licence covers the app, not redistribution of the
source files, and 68 OTFs is 3.4 MB of dead weight in a clone.

| File | Source OTF | `font-weight` | `font-style` | Size |
| --- | --- | --- | --- | --- |
| `sharp-grotesk-400.woff2` | `SharpGrotesk-Book20.otf` | `100 400` | normal | 27.4 KB |
| `sharp-grotesk-500.woff2` | `SharpGrotesk-Medium20.otf` | `500 900` | normal | 26.7 KB |
| `sharp-grotesk-400-italic.woff2` | `SharpGrotesk-BookItalic20.otf` | `100 900` | italic | 29.7 KB |

**86 KB total**, of which the 54 KB roman pair is preloaded (see `index.html`);
the italic is fetched only when rich text actually contains an `<em>`.

## Why these three

- **Width 20 only.** The numeric suffix on a Sharp Grotesk file is a width, not
  an optical size: `05`/`10`/`15`/`20`/`25` carry OS/2 `usWidthClass`
  `1`/`3`/`4`/`5`/`7`. Only `20` is `normal`. The others are condensed or
  extended and neither app asks for them.
- **Book (400) and Medium (500), and nothing above.** Medium is the
  storefront's bold — headings, the wordmark, buttons and prices all stop
  there. SemiBold, Bold and Black are not shipped. The ~90 `font-semibold` and
  `font-bold` call sites are not rewritten; `--font-weight-semibold` and
  `--font-weight-bold` are re-pointed at `500` in `src/index.css`, which also
  keeps the fallback face from flashing a heavier weight before the swap.
  `<strong>` and `<b>` are pinned there too, since the UA stylesheet asks for
  `bolder` and sanitised product copy is full of them.
- **One italic, at 400.** The only italic in either app is `<em>` — product
  copy in the storefront, the rich-text editor's output in the admin.
  A real face is worth it there — a synthesised slant on a grotesque leans the
  wrong way and keeps the upright terminals — but a second one is not, so the
  italic is declared across `100 900` and an `<em>` in a heading sets a little
  lighter than the roman beside it.

The weight *ranges* in the `@font-face` blocks are a safety net for weights that
reach CSS without going through a Tailwind utility, not the main mechanism.

## Coverage

Subset to Latin and the punctuation a Philippine storefront actually renders:

```
U+0000–00FF  Basic Latin + Latin-1 Supplement   ñ é © ° · ×
U+0100–017F  Latin Extended-A
U+0192, U+01FA–01FF, U+0218–0219, U+0237, U+02C6–02C7, U+02D8–02DD
U+2000–206F  General Punctuation                – — ' " … •
U+2070–209F  Super/subscripts
U+20A0–20BF  Currency                           ₱ € £ ¥
U+2100–2138  Letterlike                         ™ №
U+2150–215F  Vulgar fractions                   ½ ¼ ¾
U+2190–2199  Arrows                             →
U+2202, U+2206, U+220F, U+2211–2212, U+221A, U+221E, U+2248,
U+2260–2261, U+2264–2265                        − ≈ ≠ ≤ ≥ ∞ √
U+2605–2606  Stars                              ★  (admin review alerts)
U+FEFF, U+FFFD
```

Dropped: CJK brackets, geometric shapes and the dingbat block (icons come from
`@phosphor-icons/react`, never from the typeface). OpenType features are
reduced to `kern` and `locl` — the font also ships `aalt`, `c2sc`, `frac`,
`ordn`, `smcp` and `sups`, none of which any stylesheet turns on, and each of
which drags in its own glyph set. That takes 574 glyphs down to 440 and the
per-face payload down about 30% against a straight OTF→WOFF2 conversion.

Anything outside the ranges above falls through to the next family in
`--brand-font` rather than rendering as tofu. If content starts arriving in a
script that is not Latin, widen the ranges here and regenerate — do not reach
for a second family.

## Regenerating

Needs `fonttools[woff]` (`pip install "fonttools[woff]" brotli`) and the
licensed OTFs. Run it from the **repository root**, not from an app — one
subset definition feeds both, and they must not drift. `$SRC` points at the
`Sharp_Grotesk` folder:

```python
import os
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

SRC = os.environ["SRC"]  # .../Sharp_Grotesk
FE = "shop-selair-frontend/src/assets/fonts"
AD = "shop-selair-admin/src/assets/fonts"

# (source OTF, output name, destinations)
FACES = [
    ("SharpGrotesk-Book20.otf",       "sharp-grotesk-400.woff2",        [FE, AD]),
    ("SharpGrotesk-Medium20.otf",     "sharp-grotesk-500.woff2",        [FE]),
    ("SharpGrotesk-BookItalic20.otf", "sharp-grotesk-400-italic.woff2", [FE]),
]

RANGES = [
    (0x0000, 0x00FF), (0x0100, 0x017F), (0x0192, 0x0192), (0x01FA, 0x01FF),
    (0x0218, 0x0219), (0x0237, 0x0237), (0x02C6, 0x02C7), (0x02D8, 0x02DD),
    (0x2000, 0x206F), (0x2070, 0x209F), (0x20A0, 0x20BF), (0x2100, 0x2138),
    (0x2150, 0x215F), (0x2190, 0x2199), (0x2202, 0x2202), (0x2206, 0x2206),
    (0x220F, 0x220F), (0x2211, 0x2212), (0x221A, 0x221A), (0x221E, 0x221E),
    (0x2248, 0x2248), (0x2260, 0x2261), (0x2264, 0x2265), (0x2605, 0x2606),
    (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD),
]
unicodes = [c for a, b in RANGES for c in range(a, b + 1)]

for src, name, dests in FACES:
    opts = Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "locl"]
    opts.notdef_outline = True
    opts.name_IDs = ["*"]
    opts.name_legacy = True
    opts.recalc_bounds = True
    font = TTFont(os.path.join(SRC, src))
    subsetter = Subsetter(options=opts)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(os.path.join(dests[0], name))
    blob = open(os.path.join(dests[0], name), "rb").read()
    for other in dests[1:]:
        open(os.path.join(other, name), "wb").write(blob)
```

If the width ever moves off `20`, the `size-adjust` / `ascent-override` /
`descent-override` on the `Sharp Grotesk Fallback` face in
`src/styles/fonts.css` are derived from these exact files and must be
recalculated with them — in both apps.

## Licence

Commercial, from Sharp Type. Webfont use is bounded by the pageview tier on the
licence — check it before pointing a new property at these files, and keep them
served from our own origin so they are not hotlinked from elsewhere.
