// main.js — titik masuk situs: memasang router hash dan merender halaman.
// Tidak ada network: semua modul sudah dimuat dari file lokal di bawah app/.

import { renderRute } from './views.js';

function ruteSekarang() {
  renderRute(window.location.hash);
}

window.addEventListener('hashchange', ruteSekarang);
document.addEventListener('DOMContentLoaded', ruteSekarang);
if (document.readyState !== 'loading') ruteSekarang();
