let currentGenerationId = null;

// ── Generate ──────────────────────────────────────────────────────────────────
async function generate() {
  const prompt = document.getElementById('prompt').value.trim();
  const bannerText = document.getElementById('bannerText').value.trim();

  if (!prompt || !bannerText) {
    showToast('Fill in both prompt and banner text', 'error');
    return;
  }

  setLoading(true);
  hideError();
  hidePreview();

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, bannerText }),
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
async function confirm() {
  if (!currentGenerationId) return;

  try {
    const res = await fetch(`/api/generate/${currentGenerationId}/confirm`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    updatePreviewStatus('confirmed');
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
  } catch {
    // silently ignore history load errors
  }
}

function renderTable(rows) {
  const tbody = document.getElementById('historyBody');
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">No generations yet</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map((g) => `
    <tr>
      <td>${g.id}</td>
      <td title="${escHtml(g.prompt)}">${escHtml(truncate(g.prompt, 50))}</td>
      <td title="${escHtml(g.banner_text)}">${escHtml(truncate(g.banner_text, 40))}</td>
      <td><span class="status-badge status-${g.status}">${g.status}</span></td>
      <td>
        ${g.final_url
          ? `<a class="table-url" href="${escHtml(g.final_url)}" target="_blank" title="${escHtml(g.final_url)}">Open ↗</a>`
          : '—'}
      </td>
      <td>${formatDate(g.created_at)}</td>
    </tr>
  `).join('');
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function showPreview(generation) {
  document.getElementById('previewImg').src = generation.final_url;
  const urlEl = document.getElementById('previewUrl');
  urlEl.href = generation.final_url;
  urlEl.textContent = generation.final_url;
  document.getElementById('preview').classList.remove('hidden');
}

function hidePreview() {
  document.getElementById('preview').classList.add('hidden');
}

function updatePreviewStatus() {
  // visual feedback only — table update comes from loadHistory()
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

function copyUrl() {
  const url = document.getElementById('previewUrl').href;
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
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Allow Ctrl+Enter to generate
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate();
});

// Load history on startup
loadHistory();
