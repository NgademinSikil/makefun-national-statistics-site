// views.js — merender tiap halaman situs ke dalam <main id="view">.
// Satu fungsi per rute hash; semua kontrol (tab, sort, filter, cari)
// diikat di sini dan benar-benar mengubah tampilan.

import {
  NASIONAL,
  PENDUDUK_SERIES,
  PDB_SERIES,
  INFLASI_SERIES,
  TPT_SERIES,
  KERJA_LAIN,
  KEMISKINAN_SERIES,
  PERTUMBUHAN_PROVINSI_2024,
  PENDUDUK_PROVINSI_2022,
  DAFTAR_PROVINSI,
  PULAU_KONTRIBUSI_2024,
  SUMBER,
} from './data.js';
import { lineChart, barChart, hbarChart } from './charts.js';

const view = () => document.getElementById('view');
const fmtID = (n, des = 2) => n.toLocaleString('id-ID', { minimumFractionDigits: des, maximumFractionDigits: des });
const persen = (n) => fmtID(n) + '%';

function sumberLine(teks) {
  return `<p class="sumber">Sumber: ${teks}</p>`;
}

function kartu(label, angka, satuan, ket) {
  return `<article class="kpi"><p class="kpi-label">${label}</p>
    <p class="kpi-angka">${angka}<span class="kpi-satuan"> ${satuan}</span></p>
    <p class="kpi-ket">${ket}</p></article>`;
}

function tabBar(tabs, aktif) {
  return `<div class="tabs" role="tablist">${tabs
    .map((t) => `<button type="button" class="tab${t.id === aktif ? ' aktif' : ''}" data-tab="${t.id}" role="tab" aria-selected="${t.id === aktif}">${t.label}</button>`)
    .join('')}</div>`;
}

// Tabel yang bisa di-sort: klik header untuk naik/turun.
function tabelSortable(id, kolom, baris, renderBaris) {
  const head = kolom
    .map((k, i) => `<th data-sort="${i}" data-tipe="${k.tipe}">${k.label}<span class="panah"></span></th>`)
    .join('');
  return `<div class="tabel-wrap"><table class="tabel" id="${id}">
    <thead><tr>${head}</tr></thead>
    <tbody>${baris.map(renderBaris).join('')}</tbody></table></div>`;
}

function ikatSort(id, dataAwal, renderBaris) {
  const tabel = document.getElementById(id);
  if (!tabel) return;
  let arah = 1;
  let kolomAktif = -1;
  tabel.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const i = Number(th.dataset.sort);
      const tipe = th.dataset.tipe;
      arah = kolomAktif === i ? -arah : 1;
      kolomAktif = i;
      const data = [...dataAwal].sort((a, b) => {
        const va = a[i];
        const vb = b[i];
        const hasil = tipe === 'angka' ? va - vb : String(va).localeCompare(String(vb), 'id');
        return hasil * arah;
      });
      tabel.querySelector('tbody').innerHTML = data.map(renderBaris).join('');
      tabel.querySelectorAll('th .panah').forEach((p) => (p.textContent = ''));
      th.querySelector('.panah').textContent = arah === 1 ? ' ▲' : ' ▼';
    });
  });
}

function renderIkhtisar() {
  view().innerHTML = `
  <section class="hero">
    <p class="eyebrow">Statistik resmi Indonesia, diringkas untuk dibaca</p>
    <h1>Indonesia dalam angka, <span>tanpa ribet.</span></h1>
    <p class="lede">Penduduk, ekonomi, harga, dan pekerjaan — angka terbaru dari Badan Pusat
    Statistik, lengkap dengan sumber dan tahunnya, dalam satu situs yang bisa dibuka di ponsel.</p>
    <p class="hero-cta"><a class="btn" href="#/penduduk">Lihat penduduk</a>
    <a class="btn ghost" href="#/ekonomi">Lihat ekonomi</a></p>
  </section>
  <section class="kpi-grid">
    ${kartu('Penduduk 2025', fmtID(NASIONAL.penduduk2025.nilai), 'juta jiwa', 'SUPAS 2025, BPS')}
    ${kartu('Pertumbuhan ekonomi 2025', persen(5.11), '', 'BPS, y-on-y')}
    ${kartu('Inflasi 2025', persen(2.92), '', 'BPS, y-on-y')}
    ${kartu('Pengangguran, Nov 2025', persen(KERJA_LAIN.tptNov2025.nilai), '', 'Sakernas, BPS')}
  </section>
  <section class="panel">
    <h2>Ekonomi tumbuh di atas 5% tiga tahun beruntun</h2>
    <canvas id="chart-pdb" aria-label="Grafik garis pertumbuhan ekonomi 2021 sampai 2025"></canvas>
    ${sumberLine(SUMBER.pdb + ', 2021–2025')}
  </section>
  <section class="panel">
    <h2>Jelajahi berdasarkan topik</h2>
    <div class="menu-grid">
      <a class="menu-kartu" href="#/penduduk"><strong>Penduduk</strong><span>284,67 juta jiwa pada 2025; hampir separuhnya di bawah 30 tahun.</span></a>
      <a class="menu-kartu" href="#/ekonomi"><strong>Ekonomi</strong><span>Tumbuh 5,11% pada 2025; Jawa menyumbang 57,02% PDB.</span></a>
      <a class="menu-kartu" href="#/inflasi"><strong>Inflasi</strong><span>2,92% pada 2025, turun dari puncak 5,51% pada 2022.</span></a>
      <a class="menu-kartu" href="#/kerja"><strong>Ketenagakerjaan</strong><span>147,91 juta orang bekerja; pengangguran 4,74% (Nov 2025).</span></a>
      <a class="menu-kartu" href="#/daerah"><strong>Daerah</strong><span>Papua Barat tumbuh 20,80% pada 2024, tertinggi di Indonesia.</span></a>
      <a class="menu-kartu" href="#/sumber"><strong>Sumber data</strong><span>Dari mana setiap angka di situs ini berasal.</span></a>
    </div>
  </section>`;
  lineChart(document.getElementById('chart-pdb'), PDB_SERIES, {
    judul: 'Pertumbuhan ekonomi (% per tahun)',
    format: persen,
  });
}

function renderPenduduk() {
  view().innerHTML = `
  <h1>Penduduk</h1>
  <p class="lede">Indonesia dihuni 284,67 juta jiwa pada 2025 — naik 14,47 juta dari Sensus 2020.
  Laju tumbuhnya 1,08% per tahun, dan sekitar 55% penduduk tinggal di Pulau Jawa.</p>
  <section class="kpi-grid">
    ${kartu('Penduduk 2025', fmtID(NASIONAL.penduduk2025.nilai), 'juta jiwa', 'SUPAS 2025')}
    ${kartu('Laju tumbuh', persen(NASIONAL.lajuPenduduk.nilai), 'per tahun', 'SUPAS 2025')}
    ${kartu('Di bawah 30 tahun', persen(NASIONAL.diBawah30.nilai), '', 'SUPAS 2025')}
    ${kartu('Rasio ketergantungan', fmtID(NASIONAL.rasioKetergantungan.nilai), '', 'per 100 penduduk produktif')}
  </section>
  <section class="panel">
    ${tabBar([{ id: 'grafik', label: 'Grafik' }, { id: 'tabel', label: 'Tabel' }], 'grafik')}
    <div id="tab-grafik">
      <canvas id="chart-penduduk" aria-label="Grafik garis jumlah penduduk 2010 sampai 2025"></canvas>
      ${sumberLine(SUMBER.supas2025 + '; SP2010, SUPAS 2015, SP2020')}
    </div>
    <div id="tab-tabel" hidden>
      ${tabelSortable('tabel-penduduk',
        [{ label: 'Tahun', tipe: 'angka' }, { label: 'Penduduk (juta jiwa)', tipe: 'angka' }, { label: 'Sumber', tipe: 'teks' }],
        PENDUDUK_SERIES.map((p) => [p.tahun, p.juta, p.sumber]),
        (r) => `<tr><td>${r[0]}</td><td>${fmtID(r[1])}</td><td>${r[2]}</td></tr>`)}
      <p class="ket">Klik judul kolom untuk mengurutkan naik atau turun.</p>
    </div>
  </section>
  <section class="panel">
    <h2>Struktur umur: penduduk muda</h2>
    <canvas id="chart-umur" aria-label="Batang kelompok umur penduduk"></canvas>
    <p>46,9% penduduk berusia di bawah 30 tahun. Rasio ketergantungan 45,05 berarti setiap
    100 penduduk usia produktif menanggung sekitar 45 penduduk usia non-produktif.</p>
    ${sumberLine(SUMBER.supas2025)}
  </section>
  <section class="panel">
    <h2>Provinsi terpadat</h2>
    <p>Jawa Barat adalah provinsi terpadat: 50,94 juta jiwa hasil SUPAS 2025, naik dari
    43,05 juta pada SP2010. Diikuti Jawa Timur (42,09 juta) dan Jawa Tengah (38,23 juta)
    menurut Profil Kesehatan Indonesia 2025.</p>
    ${sumberLine('BPS Jawa Barat, Hasil SUPAS 2025; ' + SUMBER.kesehatan2025)}
  </section>`;
  lineChart(document.getElementById('chart-penduduk'), PENDUDUK_SERIES.map((p) => ({ tahun: p.tahun, nilai: p.juta })), {
    judul: 'Jumlah penduduk (juta jiwa)',
    format: (v) => fmtID(v, 0),
    min: 200,
  });
  hbarChart(document.getElementById('chart-umur'), [
    { label: 'Di bawah 30 tahun', nilai: 46.9, warna: '#0f766e' },
    { label: '30 tahun ke atas', nilai: 53.1, warna: '#94a3b8' },
  ], { judul: 'Penduduk menurut kelompok umur (%)', format: persen, labelWidth: 170 });
  ikatTab();
  ikatSort('tabel-penduduk', PENDUDUK_SERIES.map((p) => [p.tahun, p.juta, p.sumber]),
    (r) => `<tr><td>${r[0]}</td><td>${fmtID(r[1])}</td><td>${r[2]}</td></tr>`);
}

function ikatTab() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => {
        b.classList.toggle('aktif', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      document.querySelectorAll('[id^="tab-"]').forEach((panel) => {
        panel.hidden = panel.id !== 'tab-' + btn.dataset.tab;
      });
    });
  });
}

function renderEkonomi() {
  view().innerHTML = `
  <h1>Ekonomi</h1>
  <p class="lede">Produk Domestik Bruto Indonesia tumbuh 5,11% pada 2025 — tahun ketiga
  berturut-turut di atas 5%. Pulau Jawa masih menjadi penopang utama dengan kontribusi 57,02%.</p>
  <section class="panel">
    ${tabBar([{ id: 'grafik', label: 'Grafik' }, { id: 'tabel', label: 'Tabel' }], 'grafik')}
    <div id="tab-grafik">
      <canvas id="chart-pdb2" aria-label="Grafik garis pertumbuhan ekonomi 2021 sampai 2025"></canvas>
      ${sumberLine(SUMBER.pdb + ', 2021–2025')}
    </div>
    <div id="tab-tabel" hidden>
      ${tabelSortable('tabel-pdb',
        [{ label: 'Tahun', tipe: 'angka' }, { label: 'Pertumbuhan (%)', tipe: 'angka' }],
        PDB_SERIES.map((p) => [p.tahun, p.nilai]),
        (r) => `<tr><td>${r[0]}</td><td>${persen(r[1])}</td></tr>`)}
      <p class="ket">Klik judul kolom untuk mengurutkan naik atau turun.</p>
    </div>
  </section>
  <section class="panel">
    <h2>Kontribusi dan pertumbuhan menurut pulau, 2024</h2>
    ${tabelSortable('tabel-pulau',
      [{ label: 'Pulau', tipe: 'teks' }, { label: 'Kontribusi thd PDB (%)', tipe: 'angka' }, { label: 'Tumbuh (%)', tipe: 'angka' }],
      PULAU_KONTRIBUSI_2024.map((p) => [p.pulau, p.kontribusi ?? '—', p.tumbuh ?? '—']),
      (r) => `<tr><td>${r[0]}</td><td>${typeof r[1] === 'number' ? persen(r[1]) : r[1]}</td><td>${typeof r[2] === 'number' ? persen(r[2]) : r[2]}</td></tr>`)}
    <p>Maluku dan Papua tumbuh paling cepat (7,81%), sementara Jawa tumbuh 4,92% namun
    menyumbang lebih dari separuh perekonomian nasional.</p>
    ${sumberLine(SUMBER.pdb + ' dan ' + SUMBER.pdrb2024 + ', 2024')}
  </section>
  <section class="panel">
    <h2>Kemiskinan menurun</h2>
    <p>Tingkat kemiskinan turun dari 8,47% pada Maret 2025 menjadi 8,25% pada September 2025.</p>
    ${sumberLine(SUMBER.kemiskinan)}
  </section>`;
  lineChart(document.getElementById('chart-pdb2'), PDB_SERIES, { judul: 'Pertumbuhan ekonomi (% per tahun)', format: persen });
  ikatTab();
  ikatSort('tabel-pdb', PDB_SERIES.map((p) => [p.tahun, p.nilai]),
    (r) => `<tr><td>${r[0]}</td><td>${persen(r[1])}</td></tr>`);
}

function renderInflasi() {
  view().innerHTML = `
  <h1>Inflasi</h1>
  <p class="lede">Inflasi tahunan 2025 tercatat 2,92% — masih dalam sasaran, setelah sempat
  melonjak ke 5,51% pada 2022, tertinggi dalam lima tahun terakhir.</p>
  <section class="panel">
    ${tabBar([{ id: 'grafik', label: 'Grafik' }, { id: 'tabel', label: 'Tabel' }], 'grafik')}
    <div id="tab-grafik">
      <canvas id="chart-inflasi" aria-label="Grafik batang inflasi 2021 sampai 2025"></canvas>
      ${sumberLine(SUMBER.inflasi + ', 2021–2025')}
    </div>
    <div id="tab-tabel" hidden>
      ${tabelSortable('tabel-inflasi',
        [{ label: 'Tahun', tipe: 'angka' }, { label: 'Inflasi y-on-y (%)', tipe: 'angka' }],
        INFLASI_SERIES.map((p) => [p.tahun, p.nilai]),
        (r) => `<tr><td>${r[0]}</td><td>${persen(r[1])}</td></tr>`)}
      <p class="ket">Klik judul kolom untuk mengurutkan naik atau turun.</p>
    </div>
  </section>
  <section class="panel">
    <h2>Membaca angka ini</h2>
    <p>Inflasi 2022 yang mencapai 5,51% adalah yang tertinggi pada periode ini; pada 2024
    inflasi turun ke 1,57%, terendah dalam lima tahun, sebelum naik lagi ke 2,92% pada 2025.
    Batang berwarna jingga menandai tahun dengan inflasi tertinggi.</p>
    ${sumberLine(SUMBER.inflasi)}
  </section>`;
  barChart(document.getElementById('chart-inflasi'), INFLASI_SERIES, {
    judul: 'Inflasi tahunan (% y-on-y)',
    format: persen,
    peak: 5.51,
  });
  ikatTab();
  ikatSort('tabel-inflasi', INFLASI_SERIES.map((p) => [p.tahun, p.nilai]),
    (r) => `<tr><td>${r[0]}</td><td>${persen(r[1])}</td></tr>`);
}

function renderKerja() {
  view().innerHTML = `
  <h1>Ketenagakerjaan</h1>
  <p class="lede">Pada November 2025, 147,91 juta orang bekerja dan tingkat pengangguran terbuka
  (TPT) tercatat 4,74% — melanjutkan tren penurunan sejak 2021.</p>
  <section class="kpi-grid">
    ${kartu('Bekerja, Nov 2025', fmtID(KERJA_LAIN.bekerjaNov2025.nilai), 'juta orang', 'Sakernas, BPS')}
    ${kartu('TPT, Nov 2025', persen(KERJA_LAIN.tptNov2025.nilai), '', 'Sakernas, BPS')}
    ${kartu('TPT, Agu 2025', persen(4.85), '', 'Sakernas, BPS')}
    ${kartu('TPT, Agu 2021', persen(6.49), '', 'Sakernas, BPS')}
  </section>
  <section class="panel">
    ${tabBar([{ id: 'grafik', label: 'Grafik' }, { id: 'tabel', label: 'Tabel' }], 'grafik')}
    <div id="tab-grafik">
      <canvas id="chart-tpt" aria-label="Grafik batang TPT Agustus 2021 sampai 2025"></canvas>
      ${sumberLine(SUMBER.sakernas + ', Agustus 2021–2025')}
    </div>
    <div id="tab-tabel" hidden>
      ${tabelSortable('tabel-tpt',
        [{ label: 'Tahun', tipe: 'angka' }, { label: 'TPT Agustus (%)', tipe: 'angka' }],
        TPT_SERIES.map((p) => [p.tahun, p.nilai]),
        (r) => `<tr><td>${r[0]}</td><td>${persen(r[1])}</td></tr>`)}
      <p class="ket">Klik judul kolom untuk mengurutkan naik atau turun.</p>
    </div>
  </section>
  <section class="panel">
    <h2>Penurunan yang konsisten</h2>
    <p>TPT Agustus turun dari 6,49% pada 2021 menjadi 4,85% pada 2025 — turun 1,64 poin
    persentase dalam empat tahun. Pengukuran November 2025 mencatat 4,74%.</p>
    ${sumberLine(SUMBER.sakernas)}
  </section>`;
  barChart(document.getElementById('chart-tpt'), TPT_SERIES, {
    judul: 'Tingkat Pengangguran Terbuka, Agustus (% )',
    format: persen,
  });
  ikatTab();
  ikatSort('tabel-tpt', TPT_SERIES.map((p) => [p.tahun, p.nilai]),
    (r) => `<tr><td>${r[0]}</td><td>${persen(r[1])}</td></tr>`);
}

function renderDaerah() {
  view().innerHTML = `
  <h1>Daerah</h1>
  <p class="lede">38 provinsi, satu peta angka. Cari provinsi, urutkan tabel, dan bandingkan
  siapa yang tumbuh paling cepat pada 2024.</p>
  <section class="panel">
    <h2>Pertumbuhan ekonomi provinsi 2024</h2>
    <canvas id="chart-provinsi" aria-label="Batang pertumbuhan ekonomi provinsi 2024"></canvas>
    <p>Papua Barat tumbuh 20,80% — tertinggi di Indonesia, didorong ekspor LNG. Kepulauan
    Bangka Belitung tumbuh 0,77%, terendah dan satu-satunya di bawah 1%.</p>
    ${sumberLine(SUMBER.pdrb2024 + '; BPS, rilis 5 Februari 2025')}
  </section>
  <section class="panel">
    <label class="cari-label" for="cari-provinsi">Cari provinsi</label>
    <input id="cari-provinsi" class="cari" type="search" placeholder="Ketik nama provinsi, mis. Jawa Barat…" autocomplete="off">
    <div id="hasil-cari" class="hasil-cari" aria-live="polite"></div>
    <h2>Provinsi terpadat, 2022</h2>
    ${tabelSortable('tabel-daerah',
      [{ label: 'Provinsi', tipe: 'teks' }, { label: 'Penduduk (juta jiwa)', tipe: 'angka' }],
      PENDUDUK_PROVINSI_2022.map((p) => [p.provinsi, p.juta]),
      (r) => `<tr><td>${r[0]}</td><td>${fmtID(r[1])}</td></tr>`)}
    <p class="ket">Klik judul kolom untuk mengurutkan. Angka 2022 adalah proyeksi BPS hasil SP2020;
    angka terbaru Jawa Barat dari SUPAS 2025 adalah 50,94 juta jiwa.</p>
    ${sumberLine(SUMBER.penduduk2022 + '; BPS Jawa Barat, SUPAS 2025')}
  </section>
  <section class="panel">
    <h2>Semua 38 provinsi</h2>
    <p>Daftar lengkap provinsi beserta pulaunya. Gunakan kolom cari di atas untuk menyaring daftar ini juga.</p>
    <ul id="daftar-provinsi" class="daftar-provinsi">
      ${DAFTAR_PROVINSI.map(([nama, pulau]) => `<li data-nama="${nama.toLowerCase()}"><strong>${nama}</strong><span>${pulau}</span></li>`).join('')}
    </ul>
  </section>`;
  hbarChart(document.getElementById('chart-provinsi'), PERTUMBUHAN_PROVINSI_2024.map((p) => ({
    label: p.provinsi, nilai: p.nilai, warna: p.nilai >= 10 ? '#d97706' : '#0f766e',
  })), { judul: 'Pertumbuhan PDRB 2024 (% y-on-y)', format: persen, labelWidth: 175 });
  ikatSort('tabel-daerah', PENDUDUK_PROVINSI_2022.map((p) => [p.provinsi, p.juta]),
    (r) => `<tr><td>${r[0]}</td><td>${fmtID(r[1])}</td></tr>`);
  const input = document.getElementById('cari-provinsi');
  const hasil = document.getElementById('hasil-cari');
  const daftar = document.getElementById('daftar-provinsi');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let cocok = 0;
    daftar.querySelectorAll('li').forEach((li) => {
      const pas = !q || li.dataset.nama.includes(q);
      li.style.display = pas ? '' : 'none';
      if (pas) cocok++;
    });
    hasil.textContent = q
      ? (cocok === 0 ? 'Tidak ada provinsi yang cocok dengan “' + input.value.trim() + '”.' : cocok + ' provinsi cocok.')
      : '';
  });
}

function renderSumber() {
  view().innerHTML = `
  <h1>Sumber data</h1>
  <p class="lede">Setiap angka di situs ini bisa dilacak ke publikasi resminya. Situs ini
  merangkum data publik; situs ini bukan situs resmi BPS.</p>
  <section class="panel">
    <ul class="sumber-list">
      <li><strong>Badan Pusat Statistik (BPS)</strong> — Hasil Survei Penduduk Antar Sensus 2025 (SUPAS 2025), Berita Resmi Statistik 5 Mei 2026: jumlah penduduk 284,67 juta jiwa, laju tumbuh 1,08%/tahun, penduduk di bawah 30 tahun 46,9%, rasio ketergantungan 45,05.</li>
      <li><strong>BPS</strong> — Berita Resmi Statistik Pertumbuhan Ekonomi 2021–2025: 3,70%; 5,31%; 5,05%; 5,03%; 5,11%.</li>
      <li><strong>BPS</strong> — Berita Resmi Statistik Inflasi 2021–2025: 1,87%; 5,51%; 2,61%; 1,57%; 2,92%.</li>
      <li><strong>BPS</strong> — Survei Angkatan Kerja Nasional (Sakernas): TPT Agustus 2021–2025 (6,49%; 5,86%; 5,32%; 4,91%; 4,85%), TPT November 2025 4,74%, penduduk bekerja 147,91 juta.</li>
      <li><strong>BPS</strong> — Profil Kemiskinan di Indonesia: Maret 2025 8,47%, September 2025 8,25%.</li>
      <li><strong>BPS</strong> — Produk Domestik Regional Bruto Provinsi-Provinsi di Indonesia Menurut Pengeluaran 2020–2024 (rilis 5 Februari 2025): pertumbuhan provinsi 2024, kontribusi Pulau Jawa 57,02%.</li>
      <li><strong>BPS</strong> — Jumlah Penduduk Menurut Provinsi, proyeksi hasil SP2020: penduduk provinsi 2022.</li>
      <li><strong>BPS Jawa Barat</strong> — Hasil SUPAS 2025 Provinsi Jawa Barat: 50,94 juta jiwa.</li>
      <li><strong>Kementerian Kesehatan</strong> — Profil Kesehatan Indonesia 2025: penduduk Jawa Timur 42,09 juta dan Jawa Tengah 38,23 juta pada 2025.</li>
    </ul>
    <p>Angka-angka di atas dikutip apa adanya dari publikasi tersebut. Bila sebuah publikasi
    diperbarui, angka di situs ini mengikuti publikasi yang tercantum.</p>
  </section>`;
}

export const RUTES = {
  '': renderIkhtisar,
  '/': renderIkhtisar,
  '/penduduk': renderPenduduk,
  '/ekonomi': renderEkonomi,
  '/inflasi': renderInflasi,
  '/kerja': renderKerja,
  '/daerah': renderDaerah,
  '/sumber': renderSumber,
};

export function renderRute(hash) {
  const path = (hash || '#/').replace(/^#/, '') || '/';
  const render = RUTES[path] || renderIkhtisar;
  render();
  document.querySelectorAll('.nav-link').forEach((a) => {
    const target = a.getAttribute('href').replace(/^#/, '') || '/';
    a.classList.toggle('aktif', target === path || (target === '/' && (path === '' || path === '/')));
    if (target === path || (target === '/' && (path === '' || path === '/'))) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}
