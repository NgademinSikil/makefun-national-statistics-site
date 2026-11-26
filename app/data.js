// Angka Indonesia — semua angka dan sumbernya.
// Setiap angka di situs ini berasal dari baris di bawah; tiap halaman
// menampilkan sumber + tahun di catatan kakinya. Tidak ada angka karangan.
export const SUMBER = {
  supas2025: 'BPS, Hasil SUPAS 2025 (BRS 5 Mei 2026)',
  pdb: 'BPS, Berita Resmi Statistik Pertumbuhan Ekonomi',
  inflasi: 'BPS, Berita Resmi Statistik Inflasi',
  sakernas: 'BPS, Sakernas (Survei Angkatan Kerja Nasional)',
  kemiskinan: 'BPS, Profil Kemiskinan di Indonesia',
  pdrb2024: 'BPS, PDRB Provinsi-Provinsi di Indonesia Menurut Pengeluaran 2020–2024',
  penduduk2022: 'BPS, Jumlah Penduduk Menurut Provinsi (proyeksi hasil SP2020)',
  kesehatan2025: 'Kemenkes, Profil Kesehatan Indonesia 2025 (tabel penduduk per provinsi)',
};

export const NASIONAL = {
  penduduk2025: { nilai: 284.67, satuan: 'juta jiwa', sumber: SUMBER.supas2025 },
  lajuPenduduk: { nilai: 1.08, satuan: '% per tahun', sumber: SUMBER.supas2025 },
  diBawah30: { nilai: 46.9, satuan: '% penduduk', sumber: SUMBER.supas2025 },
  rasioKetergantungan: { nilai: 45.05, satuan: 'per 100 penduduk produktif', sumber: SUMBER.supas2025 },
  jawaShare: { nilai: 55, satuan: '% penduduk tinggal di Jawa', sumber: SUMBER.supas2025 },
  jabar2025: { nilai: 50.94, satuan: 'juta jiwa', sumber: 'BPS Jawa Barat, Hasil SUPAS 2025' },
};

// Jumlah penduduk menurut sensus/survei (juta jiwa).
export const PENDUDUK_SERIES = [
  { tahun: 2010, juta: 237.64, sumber: 'SP2010' },
  { tahun: 2015, juta: 255.18, sumber: 'SUPAS 2015' },
  { tahun: 2020, juta: 270.2, sumber: 'SP2020' },
  { tahun: 2025, juta: 284.67, sumber: 'SUPAS 2025' },
];

// Pertumbuhan ekonomi tahunan, % (y-on-y).
export const PDB_SERIES = [
  { tahun: 2021, nilai: 3.7 },
  { tahun: 2022, nilai: 5.31 },
  { tahun: 2023, nilai: 5.05 },
  { tahun: 2024, nilai: 5.03 },
  { tahun: 2025, nilai: 5.11 },
];

// Inflasi tahunan (IHK, y-on-y), %.
export const INFLASI_SERIES = [
  { tahun: 2021, nilai: 1.87 },
  { tahun: 2022, nilai: 5.51 },
  { tahun: 2023, nilai: 2.61 },
  { tahun: 2024, nilai: 1.57 },
  { tahun: 2025, nilai: 2.92 },
];

// Tingkat Pengangguran Terbuka, Agustus, %.
export const TPT_SERIES = [
  { tahun: 2021, nilai: 6.49 },
  { tahun: 2022, nilai: 5.86 },
  { tahun: 2023, nilai: 5.32 },
  { tahun: 2024, nilai: 4.91 },
  { tahun: 2025, nilai: 4.85 },
];

export const KERJA_LAIN = {
  tptNov2025: { nilai: 4.74, satuan: '%', sumber: SUMBER.sakernas + ', November 2025' },
  bekerjaNov2025: { nilai: 147.91, satuan: 'juta orang', sumber: SUMBER.sakernas + ', November 2025' },
};

export const KEMISKINAN_SERIES = [
  { periode: 'Maret 2025', nilai: 8.47 },
  { periode: 'September 2025', nilai: 8.25 },
];

// Pertumbuhan ekonomi provinsi 2024, % (BPS, rilis 5 Februari 2025).
export const PERTUMBUHAN_PROVINSI_2024 = [
  { provinsi: 'Papua Barat', nilai: 20.8, catatan: 'tertinggi, didorong ekspor LNG' },
  { provinsi: 'Maluku Utara', nilai: 13.73, catatan: 'didorong ekspor nikel' },
  { provinsi: 'DI Yogyakarta', nilai: 5.03, catatan: 'tertinggi di Pulau Jawa' },
  { provinsi: 'Jawa Barat', nilai: 4.95, catatan: '' },
  { provinsi: 'Aceh', nilai: 4.66, catatan: '' },
  { provinsi: 'Nusa Tenggara Timur', nilai: 3.73, catatan: '' },
  { provinsi: 'Riau', nilai: 3.52, catatan: '' },
  { provinsi: 'Kep. Bangka Belitung', nilai: 0.77, catatan: 'terendah, satu-satunya di bawah 1%' },
];

// Penduduk provinsi terpilih, 2022 (juta jiwa, BPS).
export const PENDUDUK_PROVINSI_2022 = [
  { provinsi: 'Jawa Barat', juta: 49.41 },
  { provinsi: 'Jawa Timur', juta: 41.15 },
  { provinsi: 'Jawa Tengah', juta: 37.03 },
  { provinsi: 'Sumatera Utara', juta: 15.12 },
  { provinsi: 'Banten', juta: 12.25 },
  { provinsi: 'DKI Jakarta', juta: 10.68 },
  { provinsi: 'Lampung', juta: 9.18 },
  { provinsi: 'Sumatera Selatan', juta: 8.66 },
  { provinsi: 'Riau', juta: 6.61 },
  { provinsi: 'Sumatera Barat', juta: 5.64 },
  { provinsi: 'Aceh', juta: 5.41 },
  { provinsi: 'DI Yogyakarta', juta: 3.76 },
];

// 38 provinsi + pulau, untuk daftar yang bisa dicari.
export const DAFTAR_PROVINSI = [
  ['Aceh', 'Sumatera'], ['Sumatera Utara', 'Sumatera'], ['Sumatera Barat', 'Sumatera'],
  ['Riau', 'Sumatera'], ['Kepulauan Riau', 'Sumatera'], ['Jambi', 'Sumatera'],
  ['Sumatera Selatan', 'Sumatera'], ['Kep. Bangka Belitung', 'Sumatera'],
  ['Bengkulu', 'Sumatera'], ['Lampung', 'Sumatera'],
  ['DKI Jakarta', 'Jawa'], ['Jawa Barat', 'Jawa'], ['Banten', 'Jawa'],
  ['Jawa Tengah', 'Jawa'], ['DI Yogyakarta', 'Jawa'], ['Jawa Timur', 'Jawa'],
  ['Bali', 'Bali dan Nusa Tenggara'], ['Nusa Tenggara Barat', 'Bali dan Nusa Tenggara'],
  ['Nusa Tenggara Timur', 'Bali dan Nusa Tenggara'],
  ['Kalimantan Barat', 'Kalimantan'], ['Kalimantan Tengah', 'Kalimantan'],
  ['Kalimantan Selatan', 'Kalimantan'], ['Kalimantan Timur', 'Kalimantan'],
  ['Kalimantan Utara', 'Kalimantan'],
  ['Sulawesi Utara', 'Sulawesi'], ['Gorontalo', 'Sulawesi'], ['Sulawesi Tengah', 'Sulawesi'],
  ['Sulawesi Barat', 'Sulawesi'], ['Sulawesi Selatan', 'Sulawesi'],
  ['Sulawesi Tenggara', 'Sulawesi'],
  ['Maluku', 'Maluku'], ['Maluku Utara', 'Maluku'],
  ['Papua Barat', 'Papua'], ['Papua Barat Daya', 'Papua'], ['Papua', 'Papua'],
  ['Papua Selatan', 'Papua'], ['Papua Tengah', 'Papua'], ['Papua Pegunungan', 'Papua'],
];

export const PULAU_KONTRIBUSI_2024 = [
  { pulau: 'Jawa', kontribusi: 57.02, tumbuh: 4.92 },
  { pulau: 'Sumatera', kontribusi: 22.12, tumbuh: null },
  { pulau: 'Kalimantan', kontribusi: null, tumbuh: 5.52 },
  { pulau: 'Sulawesi', kontribusi: null, tumbuh: 6.18 },
  { pulau: 'Bali dan Nusa Tenggara', kontribusi: null, tumbuh: 5.04 },
  { pulau: 'Maluku dan Papua', kontribusi: null, tumbuh: 7.81 },
];
