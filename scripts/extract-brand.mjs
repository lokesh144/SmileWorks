/**
 * Extracts the isolated SmileWorks brand mark from the supplied brand board
 * (brand-source/smileworks-brand-board.jpg). The output is a raster derivative
 * of the client-supplied artwork: replace it with the official vector/PNG
 * master files when they are available (see README "Brand assets").
 *
 * Usage: node scripts/extract-brand.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "brand-source/smileworks-brand-board.jpg";
// App-icon tile on the yellow panel of the brand board (1024x768 source).
const TILE = { left: 682, top: 305, width: 184, height: 184 };
const SCALE = 2;
const SIZE = TILE.width * SCALE;
const RADIUS = Math.round(SIZE * 0.2);
const TILE_BG = 17; // #111111

await mkdir("public/brand", { recursive: true });

const tile = sharp(SOURCE).extract(TILE).resize(SIZE, SIZE, { kernel: "lanczos3" });

const roundedMask = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="${RADIUS}" ry="${RADIUS}" fill="#fff"/></svg>`,
);

const icon = await tile
  .clone()
  .ensureAlpha()
  .composite([{ input: roundedMask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(icon).toFile("public/brand/smileworks-icon.png");
await sharp(icon).resize(180, 180).toFile("src/app/apple-icon.png");
await sharp(icon).resize(64, 64).toFile("src/app/icon.png");

/**
 * Separate the mark from the charcoal tile. Both mark colours (white and
 * golden yellow) have a saturated red channel, so red intensity above the
 * tile background is a good estimate of coverage (alpha).
 */
const { data, info } = await tile.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
const onDark = Buffer.alloc(info.width * info.height * 4);
const onLight = Buffer.alloc(info.width * info.height * 4);
// The mark sits well inside the tile; sampling only this region avoids the
// tile's rounded corners and edge highlights.
const insetX = Math.round(SIZE * 0.05);
const insetY = Math.round(SIZE * 0.16);

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    const o = (y * info.width + x) * 4;
    const inside = x > insetX && y > insetY && x < info.width - insetX && y < info.height - insetY;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let alpha = inside ? Math.min(1, Math.max(0, (r - TILE_BG - 20) / (255 - TILE_BG - 50))) : 0;
    if (alpha < 0.08) alpha = 0;

    const un = (c) => Math.min(255, Math.max(0, Math.round((c - TILE_BG * (1 - alpha)) / (alpha || 1))));
    const ug = un(g);
    const ub = un(b);
    // White parts keep a high blue channel; yellow parts do not.
    const isWhite = ub > 150;

    onDark[o] = 255;
    onDark[o + 1] = isWhite ? 255 : Math.max(180, Math.min(214, ug));
    onDark[o + 2] = isWhite ? 255 : 41;
    onDark[o + 3] = Math.round(alpha * 255);

    onLight[o] = isWhite ? 17 : onDark[o];
    onLight[o + 1] = isWhite ? 17 : onDark[o + 1];
    onLight[o + 2] = isWhite ? 17 : onDark[o + 2];
    onLight[o + 3] = onDark[o + 3];
  }
}

const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
const trimOptions = { threshold: 1 };
await sharp(onDark, raw).trim(trimOptions).png({ compressionLevel: 9 }).toFile("public/brand/smileworks-mark-light.png");
await sharp(onLight, raw).trim(trimOptions).png({ compressionLevel: 9 }).toFile("public/brand/smileworks-mark-dark.png");

console.log("Brand assets written to public/brand and src/app (icon.png, apple-icon.png).");
