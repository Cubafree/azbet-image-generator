let currentGenerationId = null;

// ── i18n ──────────────────────────────────────────────────────────────────────
const I18N = {
  ru: {
    badge: 'Внутренний инструмент',
    verticalLabel: 'Вертикаль',
    casino: '🎰 Казино', sport: '⚽ Спорт',
    countryLabel: 'Страна',
    egypt: 'Египет', morocco: 'Марокко', algeria: 'Алжир', libya: 'Ливия',
    subjectLabel: 'Персонаж',
    woman: '👩 Женщина', man: '👨 Мужчина', object: '🎯 Объект',
    sportTypeLabel: 'Вид спорта',
    football: '⚽ Футбол', tennis: '🎾 Теннис', basketball: '🏀 Баскетбол', general: '🏆 Универсальный',
    colorLabel: 'Акцентный цвет',
    colorBlue: 'Синий', colorGreen: 'Зелёный', colorPurple: 'Фиолетовый', colorGold: 'Золотой',
    sizeLabel: 'Размер изображения',
    sizePortrait: '📱 Портрет 9:16', sizeSquare: '⬛ Квадрат 1:1',
    sceneLabel: 'Описание сцены', optional: 'необязательно',
    scenePlaceholder: 'Опишите что хотите увидеть (например: женщина в кафтане держит барабан слота, марокканский риад)',
    line1Label: 'Строка 1', line1Optional: 'без подложки, необязательно',
    line1Hint: '≈ 25–30 латинских / ≈ 15–20 арабских символов',
    line2Label: 'Строка 2', line2Required: 'на плашке, обязательно',
    line2Hint: '≈ 15–20 латинских / ≈ 10–14 арабских символов',
    plashkaStyleLabel: 'Стиль плашки', filled: 'Залитая', bordered: 'Контурная',
    line3Toggle: 'Добавить доп. строку (пилл)', line3Label: 'Доп. строка',
    line3Hint: '≈ 10–15 латинских / ≈ 7–10 арабских символов',
    fontLabel: 'Шрифт',
    generateBtn: 'Генерировать', loadingText: 'Генерация… 20–40 секунд',
    resultTitle: 'Результат', confirmBtn: '✓ Подтвердить', regenBtn: '↻ Перегенерировать',
    downloadBtn: '↓ Скачать', backToLayout: '← Редактировать расположение',
    historyTitle: 'История генераций',
    colVertical: 'Вертикаль', colCountry: 'Страна', colCharacter: 'Персонаж',
    colLine2: 'Строка 2', colStatus: 'Статус', colCreated: 'Создано',
    emptyHistory: 'Генераций пока нет',
    skTitle: 'Расположение слоёв', skReset: '↺ Сброс',
    skLogo: 'Logo', skLine1: 'Строка 1', skLine2: 'Строка 2', skLine3: 'Строка 3', skBadges: 'Badges',
    skHint: 'Перетаскивайте элементы · позиции передаются в генерацию',
    toastLine2Required: 'Строка 2 (на плашке) обязательна',
    toastGenerated: 'Изображение сгенерировано и отправлено в Telegram ✓',
    toastConfirmed: 'Баннер подтверждён ✓',
    toastRegenerated: 'Новая версия сгенерирована ✓',
    toastCopied: 'URL скопирован!',
    errorGenerate: 'Ошибка генерации',
    errorRegen: 'Ошибка перегенерации',
  },
  en: {
    badge: 'Internal tool',
    verticalLabel: 'Vertical',
    casino: '🎰 Casino', sport: '⚽ Sport',
    countryLabel: 'Country',
    egypt: 'Egypt', morocco: 'Morocco', algeria: 'Algeria', libya: 'Libya',
    subjectLabel: 'Character',
    woman: '👩 Woman', man: '👨 Man', object: '🎯 Object',
    sportTypeLabel: 'Sport type',
    football: '⚽ Football', tennis: '🎾 Tennis', basketball: '🏀 Basketball', general: '🏆 General',
    colorLabel: 'Accent color',
    colorBlue: 'Blue', colorGreen: 'Green', colorPurple: 'Purple', colorGold: 'Gold',
    sizeLabel: 'Image size',
    sizePortrait: '📱 Portrait 9:16', sizeSquare: '⬛ Square 1:1',
    sceneLabel: 'Scene description', optional: 'optional',
    scenePlaceholder: 'Describe what you want to see (e.g. woman in kaftan holding a slot drum, Moroccan riad)',
    line1Label: 'Line 1', line1Optional: 'no background, optional',
    line1Hint: '≈ 25–30 Latin / ≈ 15–20 Arabic chars',
    line2Label: 'Line 2', line2Required: 'on badge, required',
    line2Hint: '≈ 15–20 Latin / ≈ 10–14 Arabic chars',
    plashkaStyleLabel: 'Badge style', filled: 'Filled', bordered: 'Bordered',
    line3Toggle: 'Add extra line (pill)', line3Label: 'Extra line',
    line3Hint: '≈ 10–15 Latin / ≈ 7–10 Arabic chars',
    fontLabel: 'Font',
    generateBtn: 'Generate', loadingText: 'Generating… 20–40 sec',
    resultTitle: 'Result', confirmBtn: '✓ Confirm', regenBtn: '↻ Regenerate',
    downloadBtn: '↓ Download', backToLayout: '← Edit layout',
    historyTitle: 'Generation history',
    colVertical: 'Vertical', colCountry: 'Country', colCharacter: 'Character',
    colLine2: 'Line 2', colStatus: 'Status', colCreated: 'Created',
    emptyHistory: 'No generations yet',
    skTitle: 'Layer positions', skReset: '↺ Reset',
    skLogo: 'Logo', skLine1: 'Line 1', skLine2: 'Line 2', skLine3: 'Line 3', skBadges: 'Badges',
    skHint: 'Drag elements · positions are used in generation',
    toastLine2Required: 'Line 2 (on badge) is required',
    toastGenerated: 'Image generated and sent to Telegram ✓',
    toastConfirmed: 'Banner confirmed ✓',
    toastRegenerated: 'New version generated ✓',
    toastCopied: 'URL copied!',
    errorGenerate: 'Generation error',
    errorRegen: 'Regeneration error',
  },
};

let lang = localStorage.getItem('lang') || 'ru';

function t(key) { return I18N[lang][key] || key; }

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (I18N[lang][key] !== undefined) el.textContent = I18N[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (I18N[lang][key] !== undefined) el.placeholder = I18N[lang][key];
  });
  document.getElementById('langToggle').textContent = lang === 'ru' ? 'EN' : 'RU';
}

function toggleLang() {
  lang = lang === 'ru' ? 'en' : 'ru';
  localStorage.setItem('lang', lang);
  applyLang();
}

// ── Font ──────────────────────────────────────────────────────────────────────
const GOOGLE_FONTS = [
  'Oswald','Bebas Neue','Anton','Barlow Condensed','Teko',
  'Montserrat','Raleway','Roboto','Poppins','Inter','Exo 2','Orbitron',
];

function onFontChange(value) {
  // Load Google Font dynamically
  const encoded = value.replace(/ /g, '+');
  document.getElementById('googleFontLink').href =
    `https://fonts.googleapis.com/css2?family=${encoded}:wght@700&display=swap`;
  document.getElementById('fontPreview').style.fontFamily = `'${value}', sans-serif`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SK_SCALE    = 256 / 1024;   // 0.25 — canvas px per image px
const SK_CANVAS_H = { portrait: 384, square: 256 };
const SK_IMAGE_H  = { portrait: 1536, square: 1024 };

// Default Y positions in IMAGE space (px from top, except frameY = px from bottom)
const SK_DEFAULTS = {
  portrait: { logo: 55, line1: 220, plashka: 275, frameY: 80 },
  square:   { logo: 40, line1: 150, plashka: 185, frameY: 60 },
};

// Element heights in canvas px (derived from image space with SK_SCALE)
const SK_H = { logo: 15, line1: 13, plashka: 25, pill: 17, frame: 34 };

let skPositions = {};  // overridden positions in IMAGE space

const SK_ACCENT_COLORS = {
  cyan:   'rgba(6,182,212,',
  green:  'rgba(0,230,118,',
  purple: 'rgba(139,92,246,',
  gold:   'rgba(255,215,0,',
};

function getImageSize() {
  return getRadioValue('imageSize') || 'portrait';
}

function skInit() {
  const size    = getImageSize();
  const canvasH = SK_CANVAS_H[size];
  const d       = SK_DEFAULTS[size];

  document.getElementById('skCanvas').style.height = canvasH + 'px';
  skPositions = {};

  skPlace('skLogo',    d.logo    * SK_SCALE);
  skPlace('skLine1',   d.line1   * SK_SCALE);
  skPlace('skPlashka', d.plashka * SK_SCALE);

  const pillCanvasY = (d.plashka + 100 + 6) * SK_SCALE;
  skPlace('skPill', pillCanvasY);

  // Frame: positioned from bottom
  const frameCanvasTop = canvasH - d.frameY * SK_SCALE - SK_H.frame;
  skPlace('skFrame', frameCanvasTop);

  updateSkeletonColor();
}

function skPlace(id, canvasY) {
  const el = document.getElementById(id);
  if (el) el.style.top = Math.round(canvasY) + 'px';
}

function updateSkeletonColor() {
  const color = getRadioValue('accentColor') || 'cyan';
  const base  = SK_ACCENT_COLORS[color] || SK_ACCENT_COLORS.cyan;

  const plashka = document.getElementById('skPlashka');
  const pill    = document.getElementById('skPill');

  if (plashka) {
    plashka.style.background   = base + '0.35)';
    plashka.style.borderColor  = base + '0.7)';
    plashka.style.color        = base + '0.95)';
  }
  if (pill) {
    pill.style.borderColor = base + '0.7)';
    pill.style.color       = base + '0.8)';
    pill.style.background  = base + '0.06)';
  }
}

function onColorChange() {
  updateSkeletonColor();
}

function makeDraggable(elId, layer) {
  const el = document.getElementById(elId);
  if (!el) return;

  el.addEventListener('mousedown', startDrag);
  el.addEventListener('touchstart', startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();
    const startClientY = e.touches ? e.touches[0].clientY : e.clientY;
    const startTop     = parseInt(el.style.top) || 0;

    el.classList.add('is-dragging');

    // Tooltip
    const tip = document.createElement('div');
    tip.className = 'sk-tooltip';
    el.appendChild(tip);

    function onMove(e) {
      const curY  = e.touches ? e.touches[0].clientY : e.clientY;
      const dy    = curY - startClientY;
      const canvas = document.getElementById('skCanvas');
      const maxTop = canvas.offsetHeight - el.offsetHeight;
      const newTop = Math.max(0, Math.min(maxTop, startTop + dy));

      el.style.top = newTop + 'px';

      const size    = getImageSize();
      const canvasH = SK_CANVAS_H[size];

      if (layer === 'frame') {
        // distance from bottom: (canvasH - top - elemH) / SK_SCALE
        const fromBottom = Math.round((canvasH - newTop - SK_H.frame) / SK_SCALE);
        skPositions.frameY = Math.max(0, fromBottom);
        tip.textContent = `↑ ${skPositions.frameY}px`;
      } else {
        const imageY = Math.round(newTop / SK_SCALE);
        skPositions[layer] = imageY;
        tip.textContent = `y: ${imageY}px`;

        // Plashka drags pill along
        if (layer === 'plashka') {
          const pillTop = newTop + SK_H.plashka + Math.round(6 * SK_SCALE);
          skPlace('skPill', pillTop);
        }
      }
    }

    function onUp() {
      el.classList.remove('is-dragging');
      tip.remove();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  }
}

function resetPositions() {
  skInit();
}

function skCollectCustomY() {
  const size = getImageSize();
  const d    = SK_DEFAULTS[size];
  const out  = {};

  if (skPositions.logo    !== undefined && skPositions.logo    !== d.logo)    out.logo    = skPositions.logo;
  if (skPositions.line1   !== undefined && skPositions.line1   !== d.line1)   out.line1   = skPositions.line1;
  if (skPositions.plashka !== undefined && skPositions.plashka !== d.plashka) out.plashka = skPositions.plashka;
  if (skPositions.frameY  !== undefined && skPositions.frameY  !== d.frameY)  out.frameY  = skPositions.frameY;

  return Object.keys(out).length > 0 ? out : undefined;
}

function backToSkeleton() {
  hidePreview();
}

// ── Sport Type visibility ─────────────────────────────────────────────────────
function updateSportTypeVisibility() {
  const vertical = getRadioValue('vertical');
  const subject  = getRadioValue('subject');
  const row      = document.getElementById('sportTypeRow');
  row.classList.toggle('hidden', !(vertical === 'sport' && subject !== 'object'));
}

document.querySelectorAll('input[name="vertical"], input[name="subject"]').forEach((el) => {
  el.addEventListener('change', updateSportTypeVisibility);
});
updateSportTypeVisibility();

// ── Helpers ───────────────────────────────────────────────────────────────────
function getRadioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

// ── Line3 toggle ──────────────────────────────────────────────────────────────
function toggleLine3() {
  const show = document.getElementById('line3Toggle').checked;
  document.getElementById('line3Row').classList.toggle('hidden', !show);
  document.getElementById('skPill').classList.toggle('hidden', !show);
  if (!show) document.getElementById('line3').value = '';
}

// ── Generate ──────────────────────────────────────────────────────────────────
async function generate() {
  const vertical    = getRadioValue('vertical');
  const country     = getRadioValue('country');
  const subject     = getRadioValue('subject');
  const sportType   = getRadioValue('sportType');
  const accentColor = getRadioValue('accentColor');
  const imageSize   = getRadioValue('imageSize') || 'portrait';
  const scenePrompt = document.getElementById('scenePrompt').value.trim();
  const line1       = document.getElementById('line1Input').value.trim();
  const line2       = document.getElementById('line2Input').value.trim();
  const plashkaStyle = getRadioValue('plashkaStyle');
  const line3Raw    = document.getElementById('line3Toggle').checked
    ? document.getElementById('line3').value.trim()
    : null;
  const fontFamily  = document.getElementById('fontFamily').value || 'Oswald';
  const fontSize    = {
    line1: parseInt(document.getElementById('size1').value) || 52,
    line2: parseInt(document.getElementById('size2').value) || 58,
    line3: parseInt(document.getElementById('size3').value) || 44,
  };
  const customY = skCollectCustomY();

  if (!line2) {
    showToast(t('toastLine2Required'), 'error');
    return;
  }

  setLoading(true);
  hideError();
  hidePreview();

  try {
    const body = {
      vertical, country, subject, sportType, accentColor,
      scenePrompt, imageSize, fontFamily, fontSize,
      line1: line1 || null,
      line2,
      plashkaStyle,
      ...(line3Raw ? { line3: line3Raw } : {}),
      ...(customY  ? { customY }         : {}),
    };

    const res  = await fetch('/api/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || t('errorGenerate'));

    currentGenerationId = data.generation.id;
    showPreview(data.generation);
    loadHistory();
    showToast(t('toastGenerated'), 'success');
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

// ── Confirm ───────────────────────────────────────────────────────────────────
async function confirmGen() {
  if (!currentGenerationId) return;
  try {
    const res  = await fetch(`/api/generate/${currentGenerationId}/confirm`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    loadHistory();
    showToast(t('toastConfirmed'), 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Regenerate ────────────────────────────────────────────────────────────────
async function regenerate() {
  if (!currentGenerationId) return;
  setLoading(true);
  hidePreview();
  hideError();
  try {
    const res  = await fetch(`/api/generate/${currentGenerationId}/regenerate`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || t('errorRegen'));
    currentGenerationId = data.generation.id;
    showPreview(data.generation);
    loadHistory();
    showToast(t('toastRegenerated'), 'success');
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

// ── History ───────────────────────────────────────────────────────────────────
async function loadHistory() {
  try {
    const res = await fetch('/api/generations');
    const { generations } = await res.json();
    renderTable(generations);
  } catch { /* silent */ }
}

function renderTable(rows) {
  const tbody = document.getElementById('historyBody');
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty">${t('emptyHistory')}</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map((g) => `
    <tr>
      <td>${g.id}</td>
      <td>${g.vertical ? capFirst(g.vertical) : '—'}</td>
      <td>${g.country  ? capFirst(g.country)  : '—'}</td>
      <td>${g.subject  ? capFirst(g.subject)  : '—'}</td>
      <td title="${escHtml(g.line2 || g.banner_text)}">${escHtml(truncate(g.line2 || g.banner_text || '', 30))}</td>
      <td><span class="status-badge status-${g.status}">${g.status}</span></td>
      <td>${g.final_url ? `<a class="table-url" href="${escHtml(g.final_url)}" target="_blank">Open ↗</a>` : '—'}</td>
      <td>${formatDate(g.created_at)}</td>
    </tr>
  `).join('');
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function showPreview(generation) {
  document.getElementById('skeletonPanel').classList.add('hidden');
  document.getElementById('previewImg').src = generation.final_url;

  const urlEl = document.getElementById('previewUrl');
  urlEl.href = generation.final_url;
  urlEl.textContent = truncate(generation.final_url, 60);

  document.getElementById('downloadBtn').href = generation.final_url;
  document.getElementById('previewSection').classList.remove('hidden');
}

function hidePreview() {
  document.getElementById('previewSection').classList.add('hidden');
  document.getElementById('skeletonPanel').classList.remove('hidden');
}

function setLoading(on) {
  document.getElementById('loading').classList.toggle('hidden', !on);
  document.getElementById('generateBtn').disabled = on;
}

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = `Error: ${msg}`;
  el.classList.remove('hidden');
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

function copyUrl(elId) {
  const url = document.getElementById(elId).href;
  navigator.clipboard.writeText(url).then(() => showToast(t('toastCopied'), 'success'));
}

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function truncate(str, n) { return str.length > n ? str.slice(0, n) + '…' : str; }
function capFirst(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function formatDate(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
// Cmd/Ctrl+Enter to generate
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate();
});

// Listen for accent color changes to update skeleton
document.querySelectorAll('input[name="accentColor"]').forEach((el) => {
  el.addEventListener('change', updateSkeletonColor);
});

// Init everything
applyLang();
skInit();
['skLogo','skLine1','skPlashka','skPill','skFrame'].forEach((id) => {
  const layer = document.getElementById(id)?.dataset.layer;
  if (layer) makeDraggable(id, layer);
});
onFontChange('Oswald');
loadHistory();
