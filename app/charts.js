// charts.js — menggambar chart di <canvas> dengan API canvas polos.
// Tanpa library, tanpa network. Setiap chart menerima id canvas dan data,
// lalu menggambar sumbu, grid, label, dan nilainya sendiri.

const INK = '#173f3f';
const MUTED = '#5d7373';
const TEAL = '#0f766e';
const AMBER = '#d97706';
const GRID = '#dbe4e2';
const FONT = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
const FONT_BOLD = 'bold 12px system-ui, -apple-system, "Segoe UI", sans-serif';

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = FONT;
  return { ctx, width, height };
}

function niceMax(max) {
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

// Chart garis: dipakai untuk tren pertumbuhan ekonomi dan penduduk.
export function lineChart(canvas, points, opts) {
  const { ctx, width, height } = setup(canvas, opts.height || 260);
  const pad = { l: 52, r: 16, t: 18, b: 34 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const max = niceMax(Math.max(...points.map((p) => p.nilai)) * 1.15);
  const min = opts.min ?? 0;
  const x = (i) => pad.l + (plotW * i) / (points.length - 1);
  const y = (v) => pad.t + plotH - ((v - min) / (max - min)) * plotH;

  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = min + ((max - min) * t) / ticks;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(pad.l, yy);
    ctx.lineTo(width - pad.r, yy);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(opts.format(v), pad.l - 8, yy + 4);
  }
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(x(i), y(p.nilai)) : ctx.lineTo(x(i), y(p.nilai))));
  ctx.stroke();
  points.forEach((p, i) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x(i), y(p.nilai), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = FONT_BOLD;
    ctx.textAlign = 'center';
    ctx.fillText(opts.format(p.nilai), x(i), y(p.nilai) - 10);
    ctx.font = FONT;
    ctx.fillStyle = MUTED;
    ctx.fillText(String(p.tahun), x(i), height - 10);
  });
  ctx.fillStyle = INK;
  ctx.font = FONT_BOLD;
  ctx.textAlign = 'left';
  ctx.fillText(opts.judul, pad.l, 12);
}

// Chart batang vertikal: dipakai untuk inflasi dan TPT.
export function barChart(canvas, points, opts) {
  const { ctx, width, height } = setup(canvas, opts.height || 260);
  const pad = { l: 52, r: 16, t: 18, b: 34 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const max = niceMax(Math.max(...points.map((p) => p.nilai)) * 1.2);
  const slot = plotW / points.length;
  const barW = Math.min(56, slot * 0.55);
  const y = (v) => pad.t + plotH - (v / max) * plotH;

  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  for (let t = 0; t <= 4; t++) {
    const v = (max * t) / 4;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(pad.l, yy);
    ctx.lineTo(width - pad.r, yy);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(opts.format(v), pad.l - 8, yy + 4);
  }
  points.forEach((p, i) => {
    const cx = pad.l + slot * i + slot / 2;
    const top = y(p.nilai);
    const peak = opts.peak != null && p.nilai === opts.peak;
    ctx.fillStyle = peak ? AMBER : TEAL;
    ctx.fillRect(cx - barW / 2, top, barW, pad.t + plotH - top);
    ctx.fillStyle = INK;
    ctx.font = FONT_BOLD;
    ctx.textAlign = 'center';
    ctx.fillText(opts.format(p.nilai), cx, top - 7);
    ctx.font = FONT;
    ctx.fillStyle = MUTED;
    ctx.fillText(String(p.tahun), cx, height - 10);
  });
  ctx.fillStyle = INK;
  ctx.font = FONT_BOLD;
  ctx.textAlign = 'left';
  ctx.fillText(opts.judul, pad.l, 12);
}

// Chart batang horizontal: dipakai untuk pertumbuhan provinsi dan kelompok umur.
export function hbarChart(canvas, rows, opts) {
  const rowH = 34;
  const height = (opts.heightTop || 30) + rows.length * rowH + 8;
  const { ctx, width } = setup(canvas, height);
  const pad = { l: opts.labelWidth || 150, r: 56, t: opts.heightTop || 30, b: 8 };
  const plotW = width - pad.l - pad.r;
  const max = niceMax(Math.max(...rows.map((r) => r.nilai)) * 1.12);
  rows.forEach((r, i) => {
    const yy = pad.t + i * rowH;
    const w = (r.nilai / max) * plotW;
    ctx.fillStyle = r.warna || TEAL;
    ctx.fillRect(pad.l, yy, w, 20);
    ctx.fillStyle = INK;
    ctx.font = FONT;
    ctx.textAlign = 'right';
    ctx.fillText(r.label, pad.l - 10, yy + 14);
    ctx.font = FONT_BOLD;
    ctx.textAlign = 'left';
    ctx.fillText(opts.format(r.nilai), pad.l + w + 8, yy + 14);
  });
  ctx.fillStyle = INK;
  ctx.font = FONT_BOLD;
  ctx.textAlign = 'left';
  ctx.fillText(opts.judul, pad.l, 12);
}
