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
    sceneLabel: 'Описание сцены', optional: 'необязательно',
    scenePlaceholder: 'Опишите что хотите увидеть (например: женщина в кафтане держит барабан слота, марокканский риад)',
    line1Label: 'Строка 1', line1Optional: 'без подложки, необязательно',
    line1Hint: '≈ 25–30 латинских / ≈ 15–20 арабских символов',
    line2Label: 'Строка 2', line2Required: 'на плашке, обязательно',
    line2Hint: '≈ 15–20 латинских / ≈ 10–14 арабских символов',
    plashkaStyleLabel: 'Стиль плашки', filled: 'Залитая', bordered: 'Контурная',
    line3Toggle: 'Добавить доп. строку (пилл)', line3Label: 'Доп. строка',
    line3Hint: '≈ 10–15 латинских / ≈ 7–10 арабских символов',
    generateBtn: 'Генерировать', loadingText: 'Генерация… 20–40 секунд',
    resultTitle: 'Результат', confirmBtn: '✓ Подтвердить', regenBtn: '↻ Перегенерировать', downloadBtn: '↓ Скачать',
    historyTitle: 'История генераций',
    colVertical: 'Вертикаль', colCountry: 'Страна', colCharacter: 'Персонаж',
    colLine2: 'Строка 2', colStatus: 'Статус', colCreated: 'Создано',
    emptyHistory: 'Генераций пока нет',
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
    sceneLabel: 'Scene description', optional: 'optional',
    scenePlaceholder: 'Describe what you want to see (e.g. woman in kaftan holding a slot drum, Moroccan riad)',
    line1Label: 'Line 1', line1Optional: 'no background, optional',
    line1Hint: '≈ 25–30 Latin / ≈ 15–20 Arabic chars',
    line2Label: 'Line 2', line2Required: 'on badge, required',
    line2Hint: '≈ 15–20 Latin / ≈ 10–14 Arabic chars',
    plashkaStyleLabel: 'Badge style', filled: 'Filled', bordered: 'Bordered',
    line3Toggle: 'Add extra line (pill)', line3Label: 'Extra line',
    line3Hint: '≈ 10–15 Latin / ≈ 7–10 Arabic chars',
    generateBtn: 'Generate', loadingText: 'Generating… 20–40 sec',
    resultTitle: 'Result', confirmBtn: '✓ Confirm', regenBtn: '↻ Regenerate', downloadBtn: '↓ Download',
    historyTitle: 'Generation history',
    colVertical: 'Vertical', colCountry: 'Country', colCharacter: 'Character',
    colLine2: 'Line 2', colStatus: 'Status', colCreated: 'Created',
    emptyHistory: 'No generations yet',
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

// ── Sport Type visibility ──────────────────────────────────────────────────────
function updateSportTypeVisibility() {
  const vertical = getRadioValue('vertical');
  const subject = getRadioValue('subject');
  const row = document.getElementById('sportTypeRow');
  const show = vertical === 'sport' && subject !== 'object';
  row.classList.toggle('hidden', !show);
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
  if (!show) document.getElementById('line3').value = '';
}

// ── Generate ──────────────────────────────────────────────────────────────────
async function generate() {
  const vertical = getRadioValue('vertical');
  const country = getRadioValue('country');
  const subject = getRadioValue('subject');
  const sportType = getRadioValue('sportType');
  const accentColor = getRadioValue('accentColor');
  const scenePrompt = document.getElementById('scenePrompt').value.trim();
  const line1 = document.getElementById('line1Input').value.trim();
  const line2 = document.getElementById('line2Input').value.trim();
  const plashkaStyle = getRadioValue('plashkaStyle');
  const line3Raw = document.getElementById('line3Toggle').checked
    ? document.getElementById('line3').value.trim()
    : null;

  if (!line2) {
    showToast(t('toastLine2Required'), 'error');
    return;
  }

  setLoading(true);
  hideError();
  hidePreview();

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vertical, country, subject, sportType, accentColor, scenePrompt,
        line1: line1 || null,
        line2,
        plashkaStyle,
        ...(line3Raw ? { line3: line3Raw } : {}),
      }),
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
    const res = await fetch(`/api/generate/${currentGenerationId}/confirm`, { method: 'POST' });
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
    const res = await fetch(`/api/generate/${currentGenerationId}/regenerate`, { method: 'POST' });
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
      <td>${g.country ? capFirst(g.country) : '—'}</td>
      <td>${g.subject ? capFirst(g.subject) : '—'}</td>
      <td title="${escHtml(g.line2 || g.banner_text)}">${escHtml(truncate(g.line2 || g.banner_text || '', 30))}</td>
      <td><span class="status-badge status-${g.status}">${g.status}</span></td>
      <td>${g.final_url ? `<a class="table-url" href="${escHtml(g.final_url)}" target="_blank">Open ↗</a>` : '—'}</td>
      <td>${formatDate(g.created_at)}</td>
    </tr>
  `).join('');
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function showPreview(generation) {
  const finalUrl = generation.final_url;

  document.getElementById('previewImg').src = finalUrl;
  const urlEl = document.getElementById('previewUrl');
  urlEl.href = finalUrl;
  urlEl.textContent = truncate(finalUrl, 60);

  document.getElementById('downloadBtn').href = finalUrl;

  document.getElementById('previewSection').classList.remove('hidden');
}

function hidePreview() {
  document.getElementById('previewSection').classList.add('hidden');
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
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Utils ──────────────────────────────────────────────────────────────────────
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

// Cmd/Ctrl+Enter to generate
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate();
});

applyLang();
loadHistory();
