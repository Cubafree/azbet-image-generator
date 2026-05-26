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
    sizePortrait: '📱 Портрет 9:16', sizeSquare: '⬛ Квадрат 1:1', sizeLandscape: '📺 Горизонт. 16:9',
    sceneLabel: 'Описание сцены', optional: 'необязательно',
    scenePlaceholder: 'Опишите что хотите увидеть (например: женщина в кафтане держит барабан слота, марокканский риад)',
    line1Label: 'Строка 1', line1Optional: 'без подложки, необязательно',
    line1Hint: '≈ 25–30 латинских / ≈ 15–20 арабских символов',
    line2Label: 'Строка 2', line2Required: 'на плашке, обязательно',
    line2Hint: '≈ 15–20 латинских / ≈ 10–14 арабских символов',
    plashkaStyleLabel: 'Стиль плашки', filled: 'Залитая', bordered: 'Контурная',
    line3Toggle: 'Добавить доп. строку (пилл)', line3Label: 'Доп. строка',
    line3Hint: '≈ 10–15 латинских / ≈ 7–10 арабских символов',
    fontLabel: 'Шрифт', fontSizeLabel: 'Размер шрифта (px)',
    generateBtn: 'Генерировать', loadingText: 'Генерация… 20–40 секунд',
    resultTitle: 'Результат', confirmBtn: '✓ Подтвердить', regenBtn: '↻ Перегенерировать',
    downloadBtn: '↓ Скачать', backToLayout: '← Редактировать расположение',
    historyTitle: 'История генераций',
    colVertical: 'Вертикаль', colCountry: 'Страна',
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
    accTheme: 'Тематика', accVisual: 'Визуал', accText: 'Текст', accFont: 'Типографика',
    customLayout: 'custom layout',
    addVariant: '➕ Сгенерировать с другим промокодом',
    noTextMode: '🖼 Без баннера — только картинка',
    noTextModeHint: 'Логотип + иконки приложений, без плашки и текста',
    noTextSummary: 'без текста',
    noFrameMode: '📵 Без нижней плашки с иконками',
    noFrameModeHint: 'Убирает панель App Store / Google Play снизу',
    noFrameSummary: 'без фрейма',
    presetBannerMode: '🗂 Использовать готовый баннер',
    presetBannerHint: 'Готовый SVG по стране вместо текстовых слоёв',
    presetBannerSummary: 'пресет',
    presetBannerNoLibya: 'Для Ливии нет готового баннера',
    skPresetBanner: '📋 Готовый баннер',
    accThemes: 'Темы сцены',
    themesHint: 'Каждая тема — отдельная картинка',
    themesNoCasino: 'Только для казино',
    themesNoLibya: 'Для Ливии нет тем',
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
    sizePortrait: '📱 Portrait 9:16', sizeSquare: '⬛ Square 1:1', sizeLandscape: '📺 Landscape 16:9',
    sceneLabel: 'Scene description', optional: 'optional',
    scenePlaceholder: 'Describe what you want to see (e.g. woman in kaftan holding a slot drum, Moroccan riad)',
    line1Label: 'Line 1', line1Optional: 'no background, optional',
    line1Hint: '≈ 25–30 Latin / ≈ 15–20 Arabic chars',
    line2Label: 'Line 2', line2Required: 'on badge, required',
    line2Hint: '≈ 15–20 Latin / ≈ 10–14 Arabic chars',
    plashkaStyleLabel: 'Badge style', filled: 'Filled', bordered: 'Bordered',
    line3Toggle: 'Add extra line (pill)', line3Label: 'Extra line',
    line3Hint: '≈ 10–15 Latin / ≈ 7–10 Arabic chars',
    fontLabel: 'Font', fontSizeLabel: 'Font size (px)',
    generateBtn: 'Generate', loadingText: 'Generating… 20–40 sec',
    resultTitle: 'Result', confirmBtn: '✓ Confirm', regenBtn: '↻ Regenerate',
    downloadBtn: '↓ Download', backToLayout: '← Edit layout',
    historyTitle: 'Generation history',
    colVertical: 'Vertical', colCountry: 'Country',
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
    accTheme: 'Theme', accVisual: 'Visual', accText: 'Text', accFont: 'Typography',
    customLayout: 'custom layout',
    addVariant: '➕ Generate with another promo',
    noTextMode: '🖼 No banner — image only',
    noTextModeHint: 'Logo + app badges, no plashka or text',
    noTextSummary: 'no text',
    noFrameMode: '📵 No bottom badge panel',
    noFrameModeHint: 'Removes the App Store / Google Play panel at the bottom',
    noFrameSummary: 'no frame',
    presetBannerMode: '🗂 Use preset banner',
    presetBannerHint: 'Country-specific SVG replaces text layers',
    presetBannerSummary: 'preset',
    presetBannerNoLibya: 'No preset banner available for Libya',
    skPresetBanner: '📋 Preset banner',
    accThemes: 'Scene themes',
    themesHint: 'Each theme generates a separate image',
    themesNoCasino: 'Casino only',
    themesNoLibya: 'No themes for Libya',
  },
};

const CASINO_THEMES_UI = {
  egypt: [
    { key: 'day',            label: 'День' },
    { key: 'night',          label: 'Ночь' },
    { key: 'palms',          label: 'Пальмы' },
    { key: 'sea',            label: 'Море' },
    { key: 'pyramids',       label: 'Пирамиды' },
    { key: 'sphinx',         label: 'Сфинкс' },
    { key: 'yachts',         label: 'Яхты' },
    { key: 'gold_room',      label: 'Золото' },
    { key: 'sportscar',      label: 'Спорткар' },
    { key: 'villa_pyramids', label: 'Вилла у пирамид' },
    { key: 'villa_sea',      label: 'Вилла у моря' },
  ],
  morocco: [
    { key: 'day',              label: 'День' },
    { key: 'night',            label: 'Ночь' },
    { key: 'kasbah',           label: 'Касба' },
    { key: 'bahia_palace',     label: 'Дворец Бахия' },
    { key: 'jemaa_fna',        label: 'Пл. Джемаа-эль-Фна' },
    { key: 'draa_valley',      label: 'Долина Драа' },
    { key: 'minaret',          label: 'Минарет' },
    { key: 'tall_palms',       label: 'Пышные пальмы' },
    { key: 'red_walls',        label: 'Красные стены' },
    { key: 'red_columns',      label: 'Красные колонны' },
    { key: 'desert_oasis',     label: 'Пустыня с оазисом' },
    { key: 'sportscar_desert', label: 'Спорткар в пустыне' },
    { key: 'canyon',           label: 'Ущелье' },
    { key: 'blue_city',        label: 'Голубой город' },
    { key: 'majorelle',        label: 'Сад Мажорель' },
    { key: 'marrakesh',        label: 'Марракеш' },
    { key: 'essaouira',        label: 'Эс-Сувейра' },
    { key: 'agadir',           label: 'Агадир' },
  ],
  algeria: [
    { key: 'day',             label: 'День' },
    { key: 'night',           label: 'Ночь' },
    { key: 'roman_ruins',     label: 'Римские руины' },
    { key: 'mountain_sahara', label: 'Горная Сахара' },
    { key: 'timgad',          label: 'Тимгад' },
    { key: 'trajans_arch',    label: 'Арка Траяна' },
    { key: 'amphitheater',    label: 'Амфитеатр' },
    { key: 'djemila',         label: 'Джемила' },
    { key: 'tipaza',          label: 'Типаза' },
    { key: 'kasbah_algiers',  label: 'Касба Алжира' },
    { key: 'stele',           label: 'Стела' },
    { key: 'algiers_tower',   label: 'Алжирская башня' },
    { key: 'constantine',     label: 'Константина' },
    { key: 'assekrem',        label: 'Плато Асекрем' },
    { key: 'oran',            label: 'Оран' },
    { key: 'tlemcen',         label: 'Тлемсен' },
    { key: 'ghardaia',        label: 'Гардая' },
  ],
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
  // Refresh summaries after language change
  onThemeChange();
  onVisualChange();
  onFontSummaryChange();
  updateSkeletonText();
  updateThemesSummary();
}

function toggleLang() {
  lang = lang === 'ru' ? 'en' : 'ru';
  localStorage.setItem('lang', lang);
  applyLang();
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function toggleAcc(id) {
  const item = document.getElementById(id);
  if (!item || item.classList.contains('is-fixed')) return;
  item.classList.toggle('is-open');
}

// ── Scene theme picker ────────────────────────────────────────────────────────
function renderThemePicker() {
  const grid    = document.getElementById('themesGrid');
  const hint    = document.querySelector('#accThemes .field-hint');
  if (!grid) return;

  const vertical = getRadioValue('vertical');
  const country  = getRadioValue('country');
  const themes   = CASINO_THEMES_UI[country];

  if (vertical !== 'casino' || !themes) {
    const msg = vertical !== 'casino' ? t('themesNoCasino') : t('themesNoLibya');
    grid.innerHTML = `<span class="themes-unavailable">${msg}</span>`;
    updateThemesSummary();
    return;
  }

  // Preserve current checked state before re-render
  const checked = new Set(collectThemes());

  grid.innerHTML = themes.map(({ key, label }) => `
    <label class="theme-chip${checked.has(key) ? ' is-checked' : ''}" id="themeChip_${key}">
      <input type="checkbox" value="${key}" ${checked.has(key) ? 'checked' : ''}
        onchange="onThemeChipChange('${key}')" />
      ${label}
    </label>
  `).join('');

  updateThemesSummary();
}

function onThemeChipChange(key) {
  const chip = document.getElementById(`themeChip_${key}`);
  const cb   = chip?.querySelector('input[type=checkbox]');
  if (chip && cb) chip.classList.toggle('is-checked', cb.checked);
  updateThemesSummary();
}

function collectThemes() {
  const grid = document.getElementById('themesGrid');
  if (!grid) return [];
  return Array.from(grid.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
}

function updateThemesSummary() {
  const el     = document.getElementById('sumThemes');
  if (!el) return;
  const themes = collectThemes();
  el.textContent = themes.length > 0 ? `${themes.length} тем` : '';
}

// ── Accordion summaries ───────────────────────────────────────────────────────
function onThemeChange() {
  updateSportTypeVisibility();

  const vertical = getRadioValue('vertical');
  const country  = getRadioValue('country');
  const subject  = getRadioValue('subject');
  const sport    = getRadioValue('sportType');

  // If country switched to Libya while preset mode is on — disable preset
  const cb = document.getElementById('presetBannerMode');
  if (cb?.checked && !PRESET_BANNER_COUNTRIES.has(country)) {
    cb.checked = false;
    onPresetBannerChange();
    showToast(t('presetBannerNoLibya'), 'error');
  }

  const parts = [
    vertical ? capFirst(vertical) : null,
    country  ? capFirst(country)  : null,
    subject  ? capFirst(subject)  : null,
    (vertical === 'sport' && subject !== 'object' && sport) ? capFirst(sport) : null,
  ].filter(Boolean);

  const el = document.getElementById('sumTheme');
  if (el) el.textContent = parts.join(' · ');

  renderThemePicker();
}

function onVisualChange() {
  updateSkeletonColor();

  const color        = getRadioValue('accentColor') || 'cyan';
  const size         = getRadioValue('imageSize')   || 'portrait';
  const style        = getRadioValue('plashkaStyle');
  const noText       = document.getElementById('noTextMode')?.checked;
  const noFrame      = document.getElementById('noFrameMode')?.checked;
  const presetBanner = document.getElementById('presetBannerMode')?.checked;

  const colorNames = { cyan: 'Cyan', green: 'Green', purple: 'Purple', gold: 'Gold' };
  const sizeNames  = { portrait: '9:16', square: '1:1', landscape: '16:9 · 4K' };

  const parts = [
    colorNames[color] || capFirst(color),
    sizeNames[size]   || size,
    presetBanner ? t('presetBannerSummary') : (noText ? t('noTextSummary') : (style ? capFirst(style) : null)),
    noFrame ? t('noFrameSummary') : null,
  ].filter(Boolean);

  const el = document.getElementById('sumVisual');
  if (el) el.textContent = parts.join(' · ');
}

// ── No-text mode ──────────────────────────────────────────────────────────────
function onNoTextModeChange() {
  const noText      = document.getElementById('noTextMode')?.checked;
  const textFields  = document.getElementById('textOverlayFields');
  const styleGroup  = document.getElementById('plashkaStyleGroup');
  const accFont     = document.getElementById('accFont');
  const fontPreview = document.getElementById('fontPreview');

  if (textFields) {
    textFields.style.opacity        = noText ? '0.35' : '';
    textFields.style.pointerEvents  = noText ? 'none' : '';
    textFields.style.userSelect     = noText ? 'none' : '';
  }
  // Plashka style becomes irrelevant — dim it
  if (styleGroup) {
    styleGroup.style.opacity       = noText ? '0.35' : '';
    styleGroup.style.pointerEvents = noText ? 'none' : '';
  }
  // Typography accordion less relevant — dim header
  if (accFont) accFont.style.opacity = noText ? '0.4' : '';

  // Hide font preview block since there's no text to preview
  const fontPreviewBlock = document.getElementById('fontPreview');
  if (fontPreviewBlock) fontPreviewBlock.style.display = noText ? 'none' : '';

  // Skeleton: hide plashka/pill/line1 elements
  ['skLine1', 'skPlashka', 'skPill'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.opacity = noText ? '0.2' : '';
  });
}

function onNoFrameModeChange() {
  const noFrame = document.getElementById('noFrameMode')?.checked;
  const skFrame = document.getElementById('skFrame');
  if (skFrame) skFrame.style.opacity = noFrame ? '0.2' : '';
}

function onPresetBannerChange() {
  const cb      = document.getElementById('presetBannerMode');
  const preset  = cb?.checked || false;
  const country = getRadioValue('country');

  // Libya has no preset — block and warn
  if (preset && !PRESET_BANNER_COUNTRIES.has(country)) {
    if (cb) cb.checked = false;
    showToast(t('presetBannerNoLibya'), 'error');
    return;
  }

  // Dim/restore text fields, plashka style, font accordion
  const textFields  = document.getElementById('textOverlayFields');
  const styleGroup  = document.getElementById('plashkaStyleGroup');
  const accFont     = document.getElementById('accFont');
  if (textFields) {
    textFields.style.opacity       = preset ? '0.35' : '';
    textFields.style.pointerEvents = preset ? 'none'  : '';
    textFields.style.userSelect    = preset ? 'none'  : '';
  }
  if (styleGroup) {
    styleGroup.style.opacity       = preset ? '0.35' : '';
    styleGroup.style.pointerEvents = preset ? 'none'  : '';
  }
  if (accFont) accFont.style.opacity = preset ? '0.4' : '';

  // Skeleton: dim text-related elements, show/hide preset banner block
  ['skLine1', 'skPlashka', 'skPill'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.opacity = preset ? '0.15' : '';
  });

  const skPreset = document.getElementById('skPresetBanner');
  if (skPreset) {
    skPreset.classList.toggle('hidden', !preset);
    if (preset) {
      const size  = getImageSize();
      const defY  = PRESET_BANNER_DEFAULT_Y[size] || 400;
      skPlace('skPresetBanner', defY * getSkScale());
      skPositions.presetBanner = defY;
    } else {
      delete skPositions.presetBanner;
    }
  }

  updateCustomBadge();
}

function onFontSummaryChange() {
  const family = document.getElementById('fontFamily')?.value || 'Oswald';
  const s1     = document.getElementById('size1')?.value     || '52';
  const s2     = document.getElementById('size2')?.value     || '58';
  const s3     = document.getElementById('size3')?.value     || '44';

  const el = document.getElementById('sumFont');
  if (el) el.textContent = `${family} · ${s1}/${s2}/${s3}`;

  // Reflect size change in font preview
  updateFontPreview();
}

// ── Char counters ─────────────────────────────────────────────────────────────
function updateCharCount(inputId, countId, max) {
  const input   = document.getElementById(inputId);
  const counter = document.getElementById(countId);
  if (!input || !counter) return;

  const len   = input.value.length;
  counter.textContent = len;

  const ratio = max ? len / max : 0;
  if (ratio >= 1)   counter.style.color = 'var(--danger)';
  else if (ratio >= 0.8) counter.style.color = 'var(--warning)';
  else              counter.style.color = 'var(--text-muted)';
}

// ── Skeleton text labels ──────────────────────────────────────────────────────
function updateSkeletonText() {
  const line1 = document.getElementById('line1Input')?.value.trim() || '';
  const line2 = document.getElementById('line2Input')?.value.trim() || '';
  const line3 = document.getElementById('line3')?.value.trim()      || '';

  const skLine1Span   = document.querySelector('#skLine1 span');
  const skPlashkaSpan = document.querySelector('#skPlashka span');
  const skPillSpan    = document.querySelector('#skPill span');

  if (skLine1Span)   skLine1Span.textContent   = line1 ? truncate(line1, 22) : t('skLine1');
  if (skPlashkaSpan) skPlashkaSpan.textContent = line2 ? truncate(line2, 16) : t('skLine2');
  if (skPillSpan)    skPillSpan.textContent    = line3 ? truncate(line3, 13) : t('skLine3');
}

// ── Font preview ──────────────────────────────────────────────────────────────
// Scale factor: preview box (~400px) / banner width in px
// Dynamic so landscape (4096px wide, 4× font sizes) looks proportionally the same
function updateFontPreview() {
  const size    = getImageSize();
  const imgW    = PREVIEW_IMG_W[size] || 1024;
  const scale   = 400 / imgW;
  const line2   = document.getElementById('line2Input')?.value.trim();
  const size2   = parseInt(document.getElementById('size2')?.value) || 58;
  const preview = document.getElementById('fontPreview');
  if (!preview) return;

  preview.textContent = line2 || 'AaBb 100% BONUS 78K';

  // Scaled size gives realistic sense of proportion on the final banner
  const scaledPx = Math.max(10, Math.round(size2 * scale));
  preview.style.fontSize = scaledPx + 'px';
}

// ── Custom position badge ─────────────────────────────────────────────────────
function updateCustomBadge() {
  const badge = document.getElementById('customPosBadge');
  if (!badge) return;
  badge.classList.toggle('hidden', Object.keys(skPositions).length === 0);
}

// ── Font ──────────────────────────────────────────────────────────────────────
function onFontChange(value) {
  const preview = document.getElementById('fontPreview');
  if (preview) preview.style.fontFamily = `'${value}', sans-serif`;
  onFontSummaryChange();
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
// Canvas is always 256px wide; scale maps image pixels → canvas pixels
const SK_SCALE_MAP = {
  portrait:  256 / 1024,   // 0.25
  square:    256 / 1024,   // 0.25
  landscape: 256 / 4096,   // 0.0625
};
const SK_CANVAS_H = { portrait: 384, square: 256, landscape: 143 };
const SK_IMAGE_H  = { portrait: 1536, square: 1024, landscape: 2286 };

// Default Y positions in IMAGE space (px from top, except frameY = px from bottom)
// Landscape values are in 4096×2286 coordinate space
const SK_DEFAULTS = {
  portrait:  { logo: 55,  line1: 220, plashka: 275, frameY: 80  },
  square:    { logo: 40,  line1: 150, plashka: 185, frameY: 60  },
  landscape: { logo: 82,  line1: 327, plashka: 409, frameY: 119 },
};

// Default font sizes per image size (landscape uses 4× because the image is 4× wider)
const FONT_DEFAULTS = {
  portrait:  { s1: 52,  s2: 58,  s3: 44  },
  square:    { s1: 52,  s2: 58,  s3: 44  },
  landscape: { s1: 208, s2: 232, s3: 176 },
};

// Image widths for font preview scaling
const PREVIEW_IMG_W = { portrait: 1024, square: 1024, landscape: 4096 };

function getSkScale() {
  return SK_SCALE_MAP[getImageSize()] || SK_SCALE_MAP.portrait;
}

// Element heights in canvas px
const SK_H = { logo: 15, line1: 13, plashka: 25, pill: 17, frame: 34, presetBanner: 48 };

// Countries that have a preset banner SVG
const PRESET_BANNER_COUNTRIES = new Set(['egypt', 'morocco', 'algeria']);

// Default Y position (image-space, from north) for preset banner per format
const PRESET_BANNER_DEFAULT_Y = { portrait: 400, square: 280, landscape: 600 };

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
  const skScale = getSkScale();
  const canvasH = SK_CANVAS_H[size];
  const d       = SK_DEFAULTS[size];

  document.getElementById('skCanvas').style.height = canvasH + 'px';
  skPositions = {};

  skPlace('skLogo',    d.logo    * skScale);
  skPlace('skLine1',   d.line1   * skScale);
  skPlace('skPlashka', d.plashka * skScale);

  const pillCanvasY = (d.plashka + 100 + 6) * skScale;
  skPlace('skPill', pillCanvasY);

  // Frame: positioned from bottom
  const frameCanvasTop = canvasH - d.frameY * skScale - SK_H.frame;
  skPlace('skFrame', frameCanvasTop);

  // Auto-set font size defaults for this image size
  const fd = FONT_DEFAULTS[size] || FONT_DEFAULTS.portrait;
  document.getElementById('size1').value = fd.s1;
  document.getElementById('size2').value = fd.s2;
  document.getElementById('size3').value = fd.s3;
  onFontSummaryChange();

  updateSkeletonColor();
  updateCustomBadge();

  // Dimensions label
  const dimLabels = { portrait: '1024 × 1536', square: '1024 × 1024', landscape: '4096 × 2286' };
  const dimsEl = document.getElementById('skDimensions');
  if (dimsEl) dimsEl.textContent = dimLabels[size] || '1024 × 1536';
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
    plashka.style.background  = base + '0.35)';
    plashka.style.borderColor = base + '0.7)';
    plashka.style.color       = base + '0.95)';
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

    const tip = document.createElement('div');
    tip.className = 'sk-tooltip';
    el.appendChild(tip);

    function onMove(e) {
      const curY   = e.touches ? e.touches[0].clientY : e.clientY;
      const dy     = curY - startClientY;
      const canvas = document.getElementById('skCanvas');
      const maxTop = canvas.offsetHeight - el.offsetHeight;
      const newTop = Math.max(0, Math.min(maxTop, startTop + dy));

      el.style.top = newTop + 'px';

      const size    = getImageSize();
      const canvasH = SK_CANVAS_H[size];
      const skScale = getSkScale();

      if (layer === 'frame') {
        const fromBottom = Math.round((canvasH - newTop - SK_H.frame) / skScale);
        skPositions.frameY = Math.max(0, fromBottom);
        tip.textContent = `↑ ${skPositions.frameY}px`;
      } else {
        const imageY = Math.round(newTop / skScale);
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
      updateCustomBadge(); // show badge when custom position set
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
  skInit(); // also calls updateCustomBadge() inside
}

function skCollectCustomY() {
  const size = getImageSize();
  const d    = SK_DEFAULTS[size];
  const out  = {};

  if (skPositions.logo         !== undefined && skPositions.logo    !== d.logo)    out.logo    = skPositions.logo;
  if (skPositions.line1        !== undefined && skPositions.line1   !== d.line1)   out.line1   = skPositions.line1;
  if (skPositions.plashka      !== undefined && skPositions.plashka !== d.plashka) out.plashka = skPositions.plashka;
  if (skPositions.frameY       !== undefined && skPositions.frameY  !== d.frameY)  out.frameY  = skPositions.frameY;
  if (skPositions.presetBanner !== undefined) out.presetBanner = skPositions.presetBanner;

  return Object.keys(out).length > 0 ? out : undefined;
}

function backToSkeleton() {
  hidePreview();
  currentGenerationId = null;
}

// ── Sport Type visibility ─────────────────────────────────────────────────────
function updateSportTypeVisibility() {
  const vertical = getRadioValue('vertical');
  const subject  = getRadioValue('subject');
  const row      = document.getElementById('sportTypeRow');
  if (row) row.classList.toggle('hidden', !(vertical === 'sport' && subject !== 'object'));
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getRadioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

function setRadio(name, value) {
  const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (el) el.checked = true;
}

// ── Multi-variant blocks ──────────────────────────────────────────────────────
function addVariantBlock(triggerN) {
  const newBlockN = triggerN + 1;
  const textNum   = newBlockN + 1; // "ТЕКСТ 2", "ТЕКСТ 3" ...
  const cb        = document.getElementById(`variantCb${triggerN}`);

  if (cb && cb.checked) {
    const container = document.getElementById('extraVariants');
    const el = document.createElement('div');
    el.id        = `vblock${newBlockN}`;
    el.className = 'variant-block';
    el.innerHTML = `
      <div class="variant-hdr">
        <span class="variant-num">ТЕКСТ ${textNum}</span>
        <button class="variant-remove" type="button" onclick="removeVariantsFrom(${newBlockN})">✕</button>
      </div>
      <label class="field-label line-label-row">
        <span>Строка 1</span>
        <span class="optional">необязательно</span>
        <span class="char-count" id="vcnt1_${newBlockN}">0</span>
      </label>
      <input type="text" class="input-field" id="vline1_${newBlockN}"
        placeholder="BONUS DE DÉPÔT"
        oninput="updateCharCount('vline1_${newBlockN}','vcnt1_${newBlockN}',28)" />
      <label class="field-label line-label-row">
        <span>Строка 2</span>
        <span class="required">на плашке, обязательно</span>
        <span class="char-count" id="vcnt2_${newBlockN}">0</span>
      </label>
      <input type="text" class="input-field" id="vline2_${newBlockN}"
        placeholder="100% + 30 TOURS"
        oninput="updateCharCount('vline2_${newBlockN}','vcnt2_${newBlockN}',18)" />
      <label class="toggle-label">
        <input type="checkbox" id="vl3toggle_${newBlockN}"
          onchange="toggleVariantLine3(${newBlockN})" />
        <span>Добавить доп. строку (пилл)</span>
      </label>
      <div id="vl3row_${newBlockN}" class="hidden">
        <label class="field-label line-label-row" style="margin-top:4px">
          <span>Доп. строка</span>
          <span class="char-count" id="vcnt3_${newBlockN}">0</span>
        </label>
        <input type="text" class="input-field" id="vline3_${newBlockN}"
          placeholder="78K + 150FS"
          oninput="updateCharCount('vline3_${newBlockN}','vcnt3_${newBlockN}',14)" />
      </div>
      <label class="toggle-label variant-trigger">
        <input type="checkbox" id="variantCb${newBlockN}"
          onchange="addVariantBlock(${newBlockN})" />
        <span>➕ Сгенерировать с другим промокодом</span>
      </label>
    `;
    container.appendChild(el);
  } else {
    // Cascade-remove this block and all subsequent
    removeVariantsFrom(newBlockN);
  }
}

function removeVariantsFrom(startN) {
  for (let i = startN; ; i++) {
    const el = document.getElementById(`vblock${i}`);
    if (!el) break;
    el.remove();
  }
  // Uncheck the trigger that spawned startN
  const triggerCb = document.getElementById(`variantCb${startN - 1}`);
  if (triggerCb) triggerCb.checked = false;
}

function toggleVariantLine3(blockN) {
  const show = document.getElementById(`vl3toggle_${blockN}`)?.checked;
  const row  = document.getElementById(`vl3row_${blockN}`);
  if (row) row.classList.toggle('hidden', !show);
  if (!show) {
    const inp = document.getElementById(`vline3_${blockN}`);
    if (inp) inp.value = '';
    const cnt = document.getElementById(`vcnt3_${blockN}`);
    if (cnt) cnt.textContent = '0';
  }
}

function collectAllVariants() {
  const variants = [];

  // Main block
  variants.push({
    line1: document.getElementById('line1Input')?.value.trim() || null,
    line2: document.getElementById('line2Input')?.value.trim() || '',
    line3: document.getElementById('line3Toggle')?.checked
      ? (document.getElementById('line3')?.value.trim() || null)
      : null,
  });

  // Extra blocks
  for (let i = 1; ; i++) {
    if (!document.getElementById(`vblock${i}`)) break;
    const line2 = document.getElementById(`vline2_${i}`)?.value.trim() || '';
    if (!line2) continue; // skip empty extra blocks
    variants.push({
      line1: document.getElementById(`vline1_${i}`)?.value.trim() || null,
      line2,
      line3: document.getElementById(`vl3toggle_${i}`)?.checked
        ? (document.getElementById(`vline3_${i}`)?.value.trim() || null)
        : null,
    });
  }

  return variants;
}

// ── Line3 toggle ──────────────────────────────────────────────────────────────
function toggleLine3() {
  const show = document.getElementById('line3Toggle').checked;
  document.getElementById('line3Row').classList.toggle('hidden', !show);
  document.getElementById('skPill').classList.toggle('hidden', !show);
  if (!show) {
    document.getElementById('line3').value = '';
    document.getElementById('size3').value = '44';
    updateCharCount('line3', 'cnt3', 14);
    updateSkeletonText();
  }
}

// ── Load from history row ─────────────────────────────────────────────────────
function loadFromHistory(g) {
  // Radios
  if (g.vertical)     setRadio('vertical',     g.vertical);
  if (g.country)      setRadio('country',      g.country);
  if (g.subject)      setRadio('subject',      g.subject);
  if (g.sport_type)   setRadio('sportType',    g.sport_type);
  if (g.accent_color) setRadio('accentColor',  g.accent_color);
  if (g.image_size)   setRadio('imageSize',    g.image_size);
  if (g.plashka_style) setRadio('plashkaStyle', g.plashka_style);

  // Text fields
  const line2val = g.line2 || g.banner_text || '';
  document.getElementById('scenePrompt').value = g.scene_prompt || '';
  document.getElementById('line1Input').value  = g.line1 || '';
  document.getElementById('line2Input').value  = line2val;

  // Line3
  const hasLine3 = !!g.line3;
  document.getElementById('line3Toggle').checked = hasLine3;
  document.getElementById('line3Row').classList.toggle('hidden', !hasLine3);
  document.getElementById('skPill').classList.toggle('hidden', !hasLine3);
  document.getElementById('line3').value = g.line3 || '';

  // Font
  if (g.font_family) {
    document.getElementById('fontFamily').value = g.font_family;
    onFontChange(g.font_family);
  }

  // Update all derived UI
  updateSportTypeVisibility();
  onThemeChange();
  onVisualChange();
  onFontSummaryChange();
  skInit();

  updateCharCount('line1Input', 'cnt1', 28);
  updateCharCount('line2Input', 'cnt2', 18);
  updateCharCount('line3',      'cnt3', 14);
  updateSkeletonText();
  updateFontPreview();

  // Scroll left panel to top
  document.querySelector('.panel-left')?.scrollTo({ top: 0, behavior: 'smooth' });

  showToast(lang === 'ru' ? 'Параметры загружены из истории' : 'Parameters loaded from history', 'success');
}

// ── Generate ──────────────────────────────────────────────────────────────────
async function generate() {
  const vertical     = getRadioValue('vertical');
  const country      = getRadioValue('country');
  const subject      = getRadioValue('subject');
  const sportType    = getRadioValue('sportType');
  const accentColor  = getRadioValue('accentColor');
  const imageSize    = getRadioValue('imageSize') || 'portrait';
  const scenePrompt  = document.getElementById('scenePrompt').value.trim();
  const plashkaStyle = getRadioValue('plashkaStyle');
  const fontFamily   = document.getElementById('fontFamily').value || 'Oswald';
  const fontSize     = {
    line1: parseInt(document.getElementById('size1').value) || 52,
    line2: parseInt(document.getElementById('size2').value) || 58,
    line3: parseInt(document.getElementById('size3').value) || 44,
  };
  const customY      = skCollectCustomY();
  const noText       = document.getElementById('noTextMode')?.checked      || false;
  const noFrame      = document.getElementById('noFrameMode')?.checked     || false;
  const presetBanner = document.getElementById('presetBannerMode')?.checked || false;
  const variants     = (noText || presetBanner) ? null : collectAllVariants();
  const themes       = collectThemes();

  if (!noText && !variants[0]?.line2) {
    showToast(t('toastLine2Required'), 'error');
    return;
  }

  setLoading(true);
  hideError();
  hidePreview();

  try {
    const body = {
      vertical, country, subject, sportType, accentColor,
      scenePrompt, imageSize, fontFamily, fontSize, plashkaStyle,
      ...(noText        ? { noText: true }        : {}),
      ...(presetBanner  ? { presetBanner: true }  : {}),
      ...(!noText && !presetBanner ? { variants } : {}),
      ...(noFrame           ? { noFrame: true }    : {}),
      ...(customY           ? { customY }          : {}),
      ...(themes.length > 0 ? { themes }           : {}),
    };

    const res  = await fetch('/api/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || t('errorGenerate'));

    // Backend always returns { generations: [...] }
    const gens = data.generations || (data.generation ? [data.generation] : []);
    currentGenerationId = gens[0]?.id || null;

    if (gens.length === 1) {
      showPreview(gens[0]);
    } else {
      showVariantResults(gens);
    }
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
    tbody.innerHTML = `<tr><td colspan="7" class="empty">${t('emptyHistory')}</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((g, i) => `
    <tr class="hist-row" data-idx="${i}">
      <td class="hist-thumb-cell">
        ${g.final_url
          ? `<img class="hist-thumb" src="${escHtml(g.final_url)}" alt="" loading="lazy" />`
          : '<span style="opacity:.3">—</span>'}
      </td>
      <td>${g.id}</td>
      <td>${g.vertical ? capFirst(g.vertical) : '—'}</td>
      <td>${g.country  ? capFirst(g.country)  : '—'}</td>
      <td title="${escHtml(g.line2 || g.banner_text)}">${escHtml(truncate(g.line2 || g.banner_text || '', 25))}</td>
      <td>${g.final_url ? `<a class="table-url" href="${escHtml(g.final_url)}" target="_blank" onclick="event.stopPropagation()">URL ↗</a>` : '—'}</td>
      <td>${formatDate(g.created_at)}</td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.hist-row').forEach((tr) => {
    const idx = parseInt(tr.dataset.idx);
    tr.addEventListener('click', () => loadFromHistory(rows[idx]));
  });
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function showPreview(generation) {
  document.getElementById('skeletonPanel').classList.add('hidden');
  document.getElementById('previewImg').src = generation.final_url;

  const urlEl = document.getElementById('previewUrl');
  urlEl.href        = generation.final_url;
  urlEl.textContent = truncate(generation.final_url, 60);

  document.getElementById('downloadBtn').href = generation.final_url;
  document.getElementById('previewSection').classList.remove('hidden');
}

function hidePreview() {
  document.getElementById('previewSection').classList.add('hidden');
  document.getElementById('variantsSection').classList.add('hidden');
  document.getElementById('skeletonPanel').classList.remove('hidden');
}

// ── Multi-variant results ─────────────────────────────────────────────────────
function showVariantResults(generations) {
  document.getElementById('skeletonPanel').classList.add('hidden');
  document.getElementById('previewSection').classList.add('hidden');

  const sec = document.getElementById('variantsSection');
  sec.innerHTML = `
    <div class="variants-hdr">
      <span class="preview-section-title">
        ${lang === 'ru' ? 'Результат' : 'Result'} · ${generations.length} ${lang === 'ru' ? 'варианта' : 'variants'}
      </span>
      <button class="btn-reset-pos" onclick="backToSkeleton()">← ${lang === 'ru' ? 'Назад' : 'Back'}</button>
    </div>
    <div class="variants-list">
      ${generations.map((g, i) => `
        <div class="variant-result-card" id="vrc_${g.id}">
          <a class="vrc-thumb" href="${escHtml(g.final_url)}" target="_blank">
            <img src="${escHtml(g.final_url)}" alt="Вариант ${i + 1}" />
          </a>
          <div class="vrc-body">
            <span class="vrc-label">${lang === 'ru' ? 'Текст' : 'Text'} ${i + 1}</span>
            <span class="vrc-line2">${escHtml(g.line2 || g.banner_text || '')}</span>
            <div class="vrc-actions">
              <button class="btn btn-confirm vrc-btn" id="vrc_confirm_${g.id}"
                onclick="confirmGenById(${g.id})">✓ ${lang === 'ru' ? 'Подтвердить' : 'Confirm'}</button>
              <a href="${escHtml(g.final_url)}" download="banner_v${i + 1}.jpg"
                class="btn btn-download vrc-btn">↓</a>
              <a href="${escHtml(g.final_url)}" target="_blank" class="table-url vrc-url">URL ↗</a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-secondary" onclick="backToSkeleton()" style="margin-top:12px">
      ← ${lang === 'ru' ? 'Редактировать расположение' : 'Edit layout'}
    </button>
  `;
  sec.classList.remove('hidden');
}

async function confirmGenById(id) {
  try {
    const res  = await fetch(`/api/generate/${id}/confirm`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    loadHistory();
    showToast(t('toastConfirmed'), 'success');
    const btn = document.getElementById(`vrc_confirm_${id}`);
    if (btn) { btn.textContent = '✓'; btn.disabled = true; btn.style.opacity = '.5'; }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function setLoading(on) {
  document.getElementById('loading').classList.toggle('hidden', !on);
  document.getElementById('generateBtn').disabled = on;
  const canvas = document.getElementById('skCanvas');
  if (canvas) {
    canvas.style.pointerEvents = on ? 'none' : '';
    canvas.style.opacity       = on ? '0.45' : '';
    canvas.style.transition    = 'opacity 0.2s';
  }
}

function showError(msg) {
  const el    = document.getElementById('error');
  const msgEl = document.getElementById('errorMsg');
  if (msgEl) msgEl.textContent = `Error: ${msg}`;
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
  toast.className   = `toast toast-${type}`;
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

// Init everything
applyLang();
updateSportTypeVisibility();
skInit();

['skLogo','skLine1','skPlashka','skPill','skFrame','skPresetBanner'].forEach((id) => {
  const layer = document.getElementById(id)?.dataset.layer;
  if (layer) makeDraggable(id, layer);
});

onFontChange('Oswald');
onThemeChange();
onVisualChange();
onFontSummaryChange();
loadHistory();
