let currentGenerationId = null;

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
  const bannerText = document.getElementById('bannerText').value.trim();
  const plashkaStyle = getRadioValue('plashkaStyle');
  const line3Raw = document.getElementById('line3Toggle').checked
    ? document.getElementById('line3').value.trim()
    : null;

  if (!bannerText) {
    showToast('Banner text is required', 'error');
    return;
  }

  setLoading(true);
  hideError();
  hidePreview();

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vertical, country, subject, sportType, accentColor, scenePrompt, bannerText, plashkaStyle, ...(line3Raw ? { line3: line3Raw } : {}) }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Generation failed');

    currentGenerationId = data.generation.id;
    showPreview(data.generation);
    loadHistory();
    showToast('Image generated and sent to Telegram ✓', 'success');
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
    showToast('Banner confirmed ✓', 'success');
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
    if (!res.ok) throw new Error(data.error || 'Regeneration failed');
    currentGenerationId = data.generation.id;
    showPreview(data.generation);
    loadHistory();
    showToast('New version generated ✓', 'success');
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
    tbody.innerHTML = '<tr><td colspan="8" class="empty">No generations yet</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map((g) => `
    <tr>
      <td>${g.id}</td>
      <td>${g.vertical ? capFirst(g.vertical) : '—'}</td>
      <td>${g.country ? capFirst(g.country) : '—'}</td>
      <td>${g.subject ? capFirst(g.subject) : '—'}</td>
      <td title="${escHtml(g.banner_text)}">${escHtml(truncate(g.banner_text, 30))}</td>
      <td><span class="status-badge status-${g.status}">${g.status}</span></td>
      <td>${g.final_url ? `<a class="table-url" href="${escHtml(g.final_url)}" target="_blank">Open ↗</a>` : '—'}</td>
      <td>${formatDate(g.created_at)}</td>
    </tr>
  `).join('');
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function showPreview(generation) {
  const finalUrl = generation.final_url;
  const rawUrl = `https://res.cloudinary.com/${generation.cloudinary_public_id || ''}`;

  document.getElementById('previewImg').src = finalUrl;
  const urlEl = document.getElementById('previewUrl');
  urlEl.href = finalUrl;
  urlEl.textContent = truncate(finalUrl, 60);

  document.getElementById('downloadBtn').href = finalUrl;

  document.getElementById('preview').classList.remove('hidden');
}

function hidePreview() {
  document.getElementById('preview').classList.add('hidden');
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
  navigator.clipboard.writeText(url).then(() => showToast('URL copied!', 'success'));
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

loadHistory();
