// content/projects/<slug>/ 의 원본 시안을 잘라서 WebP로 변환하고, 앱이 읽을 매니페스트를 만든다.
// 원본이 바뀌지 않은 프로젝트는 건너뛴다. (docs/요구사항.md 4.5, 7절)
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "content/projects");
const OUTPUT_DIR = path.join(ROOT, "public/generated/projects");
const MANIFEST_PATH = path.join(ROOT, "src/generated/project-images.json");
const PUBLIC_BASE = "/generated/projects";

// 설정을 바꾸면 VERSION을 올려서 캐시를 무효화한다.
const VERSION = 1;
const MAX_WIDTH = 3840;
const SLICE_HEIGHT = 2000; // 기준 폭(master) 픽셀 기준
const DESIGN_WIDTHS = [800, 1280, 1920, 2560, 3840];
const THUMBNAIL_WIDTHS = [480, 960];
const THUMBNAIL_RATIO = 10 / 16; // 썸네일이 없을 때 시안 상단을 자르는 비율 (높이/폭)
const WEBP_OPTIONS = { quality: 82, effort: 5 };

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

async function findImage(dir, name) {
  for (const ext of IMAGE_EXTENSIONS) {
    const file = path.join(dir, name + ext);
    if (existsSync(file)) return file;
  }
  return null;
}

async function fingerprint(file) {
  if (!file) return null;
  const { size, mtimeMs } = await stat(file);
  return `${path.basename(file)}:${size}:${Math.round(mtimeMs)}`;
}

// 기준 폭보다 작은 후보 폭 + 기준 폭 자체
function widthsFor(masterWidth, candidates) {
  const widths = candidates.filter((w) => w < masterWidth);
  widths.push(masterWidth);
  return widths;
}

async function resizeRaw(input, width) {
  return sharp(input).rotate().resize({ width }).raw().toBuffer({ resolveWithObject: true });
}

async function processDesign(file, outDir, slug) {
  const meta = await sharp(file).rotate().metadata();
  const sourceWidth = meta.autoOrient?.width ?? meta.width;
  const sourceHeight = meta.autoOrient?.height ?? meta.height;
  const masterWidth = Math.min(sourceWidth, MAX_WIDTH);
  const masterHeight = Math.round((sourceHeight * masterWidth) / sourceWidth);

  // 조각 경계는 기준 폭 좌표로 정하고, 각 폭에서는 비례 좌표로 자른다.
  // 이웃한 조각이 같은 경계를 공유하므로 픽셀이 빠지거나 겹치지 않는다.
  const boundaries = [];
  for (let y = 0; y < masterHeight; y += SLICE_HEIGHT) boundaries.push(y);
  boundaries.push(masterHeight);

  const widths = widthsFor(masterWidth, DESIGN_WIDTHS);
  const slices = boundaries.slice(0, -1).map((top, i) => ({
    width: masterWidth,
    height: boundaries[i + 1] - top,
    srcset: [],
  }));

  for (const width of widths) {
    const { data, info } = await resizeRaw(file, width);
    const scale = info.height / masterHeight;
    const edges = boundaries.map((y, i) => (i === boundaries.length - 1 ? info.height : Math.round(y * scale)));

    for (let i = 0; i < slices.length; i++) {
      const name = `design-${i}-${width}.webp`;
      await sharp(data, { raw: info })
        .extract({ left: 0, top: edges[i], width: info.width, height: edges[i + 1] - edges[i] })
        .webp(WEBP_OPTIONS)
        .toFile(path.join(outDir, name));
      slices[i].srcset.push({ width, url: `${PUBLIC_BASE}/${slug}/${name}` });
    }
  }

  return { width: masterWidth, height: masterHeight, slices };
}

async function processThumbnail(thumbnailFile, designFile, outDir, slug) {
  let input = thumbnailFile;
  if (!input) {
    // 썸네일이 없으면 시안 상단을 잘라 대체한다. (D16)
    const meta = await sharp(designFile).rotate().metadata();
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;
    input = await sharp(designFile)
      .rotate()
      .extract({ left: 0, top: 0, width, height: Math.min(height, Math.round(width * THUMBNAIL_RATIO)) })
      .toBuffer();
  }

  const meta = await sharp(input).rotate().metadata();
  const sourceWidth = meta.autoOrient?.width ?? meta.width;
  const sourceHeight = meta.autoOrient?.height ?? meta.height;
  const widths = widthsFor(Math.min(sourceWidth, THUMBNAIL_WIDTHS.at(-1)), THUMBNAIL_WIDTHS);
  const srcset = [];

  for (const width of widths) {
    const name = `thumbnail-${width}.webp`;
    await sharp(input).rotate().resize({ width }).webp(WEBP_OPTIONS).toFile(path.join(outDir, name));
    srcset.push({ width, url: `${PUBLIC_BASE}/${slug}/${name}` });
  }

  const width = widths.at(-1);
  return {
    width,
    height: Math.round((sourceHeight * width) / sourceWidth),
    srcset,
    generated: !thumbnailFile,
  };
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  const previous = await readManifest();
  const manifest = {};
  const entries = existsSync(SOURCE_DIR) ? await readdir(SOURCE_DIR, { withFileTypes: true }) : [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`프로젝트 폴더 이름은 영문 소문자·숫자·하이픈만 쓸 수 있습니다: "${slug}"`);
    }

    const dir = path.join(SOURCE_DIR, slug);
    const designFile = await findImage(dir, "design");
    if (!designFile) {
      console.warn(`[images] ${slug}: design.jpg 또는 design.png가 없어 건너뜁니다.`);
      continue;
    }
    const thumbnailFile = await findImage(dir, "thumbnail");
    const source = `v${VERSION}|${await fingerprint(designFile)}|${await fingerprint(thumbnailFile)}`;
    const outDir = path.join(OUTPUT_DIR, slug);

    if (previous[slug]?.source === source && existsSync(outDir)) {
      manifest[slug] = previous[slug];
      continue;
    }

    const started = performance.now();
    await rm(outDir, { recursive: true, force: true });
    await mkdir(outDir, { recursive: true });
    const design = await processDesign(designFile, outDir, slug);
    const thumbnail = await processThumbnail(thumbnailFile, designFile, outDir, slug);
    manifest[slug] = { source, design, thumbnail };
    const seconds = ((performance.now() - started) / 1000).toFixed(1);
    console.log(`[images] ${slug}: ${design.slices.length}조각 생성 (${seconds}s)`);
  }

  // 원본이 삭제된 프로젝트의 결과물 정리
  if (existsSync(OUTPUT_DIR)) {
    for (const entry of await readdir(OUTPUT_DIR)) {
      if (!manifest[entry]) await rm(path.join(OUTPUT_DIR, entry), { recursive: true, force: true });
    }
  }

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

await main();
