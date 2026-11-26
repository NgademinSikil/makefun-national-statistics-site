// Angka Indonesia — program penyerahan entri (Node 22, standard library only).
//
// Situsnya adalah file statis di app/: dibuka langsung oleh browser, tanpa
// build step dan tanpa permintaan jaringan. Tugas program ini hanya menyerahkan
// situs itu: menyalin app/ dan screenshots/ dari samping file ini ke direktori
// keluaran, lalu menulis dossier.json memakai pustaka make.fun yang divendor
// di vendor/makefun-frontend.ts (file itu tidak diubah).
//
// Di luar kontainer grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const appSource = join(repoRoot, 'app');
const shotsSource = join(repoRoot, 'screenshots');

// Gagal cepat dengan pesan yang jelas bila file wajibnya tidak ada,
// daripada menyerahkan dossier dari situs yang setengah jadi.
if (!existsSync(join(appSource, 'index.html'))) {
  throw new Error('app/index.html tidak ditemukan di ' + appSource);
}
if (!existsSync(shotsSource)) {
  throw new Error('screenshots/ tidak ditemukan di ' + shotsSource);
}

mkdirSync(outputDir, { recursive: true });
cpSync(appSource, join(outputDir, 'app'), { recursive: true });

const shotsTarget = join(outputDir, 'screenshots');
mkdirSync(shotsTarget, { recursive: true });
if (existsSync(shotsSource)) {
  cpSync(shotsSource, shotsTarget, { recursive: true });
}

// Batas diambil dari aturan gate: teks dossier dibatasi 160 KiB, paling banyak
// 4 screenshot @ 256 KiB, app/ paling banyak 993 file dan 16 MiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
