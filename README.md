# Angka Indonesia — Statistik Nasional Indonesia

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/NgademinSikil/makefun-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/NgademinSikil/makefun-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Situs statistik nasional Indonesia untuk [make.fun bounty "Make the best national statistics site"](https://make.fun/bounty/best-national-statistics-site-20261126-0539) — berjalan penuh di browser desktop dan ponsel dari file statis, tanpa network.

Tujuh halaman lewat hash route: Ikhtisar, Penduduk, Ekonomi, Inflasi, Ketenagakerjaan, Daerah, dan Sumber Data. Chart digambar dengan canvas/SVG polos (tanpa library), tabel bisa di-sort dan dicari, filter provinsi berfungsi — semua angka asli dari BPS dengan sumber dan tahunnya di setiap angka.

## Angka di dalamnya (BPS)

- **Penduduk 2025:** 284,67 juta jiwa (SUPAS 2025, rilis 5 Mei 2026); laju 1,08%/tahun; ~55% tinggal di Jawa
- **Pertumbuhan ekonomi:** 2021: 3,70% · 2022: 5,31% · 2023: 5,05% · 2024: 5,03% · 2025: 5,11%
- **Inflasi:** 2021: 1,87% · 2022: 5,51% · 2023: 2,61% · 2024: 1,57% · 2025: 2,92%
- **Pengangguran terbuka (Agustus):** 2025: 4,85%; November 2025: 4,74%, penduduk bekerja 147,91 juta
- **Kemiskinan:** Maret 2025: 8,47% · September 2025: 8,25%
- **Daerah:** Papua Barat tumbuh tertinggi 2024 (20,80%), Kep. Bangka Belitung terendah (0,77%)

## Jalankan

Serve `app/` dengan server statis apa saja dan buka `index.html`:

```sh
npx serve app
```

## Layout

- `main.ts` — menyerahkan situs: menyalin `app/` dan `screenshots/` ke `/output` dan menulis `dossier.json`
- `app/index.html` — halaman + navigasi
- `app/data.js` — semua angka dan sumbernya
- `app/charts.js` — chart canvas/SVG
- `app/views.js` — render tiap halaman, routing, sort/filter/search
- `app/main.js` — init
- `app/style.css` — tampilan + layout ponsel

Screenshot di `screenshots/` adalah render asli situs yang sedang berjalan (desktop 1280×800 dan ponsel 390×844).

Dibangun untuk [make.fun](https://make.fun/r/ds1567x3) — lihat, nilai, dan bangun versimu sendiri.
