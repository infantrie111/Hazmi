// ================================================================
// MTER Smart Checksheet v4.0 — script.js
// Design: Shadcn UI Light Mode | Logic: MTER Checksheet + Parameter Bank
// ================================================================

// ================================================================
// DATA DEFINITIONS
// ================================================================
const MOLD_MECH_ITEMS = [
  'Guide Pin & Guide Bush',
  'Locking Block / Interlock',
  'Slide Core Movement',
  'Ejector Pin & Ejector Plate',
  'Return Pin',
  'Angular Pin / Lifter',
  'Sprue Bush Condition',
  'Runner System',
  'Gate Condition',
  'Parting Line Fitting',
  'Venting / Gas Vent',
  'Mold Base Condition',
  'Bolting & Clamping',
  'Locating Ring Alignment',
  'Hot Runner System (if any)',
  'Hydraulic Cylinder (if any)',
  'Cooling Nipples Condition'
];

const DEMOULDING_ITEMS = [
  'Part sticking on Core side',
  'Part sticking on Cavity side',
  'Part sticking on Slide',
  'Ejector mark / Push mark',
  'Ejector pin interference',
  'Undercut issue',
  'Drag mark saat eject',
  'Part jatuh tidak sempurna',
  'Gate vestige / Gate break issue',
  'Cycle time terlalu lama karena eject'
];

const AESTHETIC_ITEMS = [
  'Short Shot',
  'Flash / Burr',
  'Sink Mark',
  'Weld Line',
  'Flow Mark',
  'Silver Streak',
  'Burn Mark',
  'Warpage / Deformasi',
  'Bubble / Void',
  'Jetting',
  'Gate Mark',
  'Ejector Mark (visible)',
  'Scratches / Goresan',
  'Color Uneven / Belang',
  'Surface Gloss Consistency',
  'Dimension Accuracy'
];

const SECTIONS = [
  { id: 1, key: 'A', label: 'Info Umum',        sub: 'Data Trial & Mesin' },
  { id: 2, key: 'B', label: 'Mold Mechanism',   sub: 'Kondisi Mekanisme' },
  { id: 3, key: 'C', label: 'Demoulding',        sub: 'Kondisi Eject' },
  { id: 4, key: 'D', label: 'Aesthetic Eval.',   sub: 'Visual Produk' },
  { id: 5, key: 'E', label: 'Cavity Layout',     sub: 'Status Per Cavity' },
  { id: 6, key: 'F', label: 'Conclusion',        sub: 'Judgment & Ringkasan' },
  { id: 7, key: 'G', label: 'Cooling Analysis',  sub: 'Temp Inlet vs Outlet' }
];

// SVG Icons for sidebar items (Lucide style)
const SECTION_ICONS = {
  1: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`,
  2: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
  3: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  4: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  5: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  6: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  7: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
};

// Note SVG icon
const NOTE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;

// Check SVG icon
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// ================================================================
// STATE
// ================================================================
let currentStep = 1;
const TOTAL = 7;

// Current active mode: 'mter' or 'parambank'
let currentMode = 'parambank'; // Parameter Bank is default active

const state = {
  moldMech:        {},
  moldMechNotes:   {},
  nippleSize:      '',
  demoulding:      {},
  demouldingNotes: {},
  aesthetic:       {},
  aestheticNotes:  {},
  cavities:        {},
  coolingData: {
    1: { inlet: '', outlet: '' },
    2: { inlet: '', outlet: '' },
    3: { inlet: '', outlet: '' },
    4: { inlet: '', outlet: '' }
  }
};

const savedSections = {};
let coolingChart = null;

// ================================================================
// SIDEBAR BUILD — 2 Main Modes + MTER sub-sections
// ================================================================
function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;
  nav.innerHTML = '';

  // --- Mode Items ---
  const modeLabel = document.createElement('div');
  modeLabel.className = 'sidebar-section-label';
  modeLabel.textContent = 'Mode Utama';
  nav.appendChild(modeLabel);

  // Parameter Bank mode button
  const pbBtn = document.createElement('button');
  pbBtn.className = `sidebar-mode-item${currentMode === 'parambank' ? ' active' : ''}`;
  pbBtn.id = 'mode-parambank';
  pbBtn.innerHTML = `
    <span class="smi-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
    </span>
    <span class="smi-text">
      Parameter Bank
      <span class="smi-sub">Mitsubishi MEt II</span>
    </span>
  `;
  pbBtn.addEventListener('click', () => { switchMode('parambank'); closeSidebar(); });
  nav.appendChild(pbBtn);

  // MTER Checksheet mode button
  const mterBtn = document.createElement('button');
  mterBtn.className = `sidebar-mode-item${currentMode === 'mter' ? ' active' : ''}`;
  mterBtn.id = 'mode-mter';
  mterBtn.innerHTML = `
    <span class="smi-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    </span>
    <span class="smi-text">
      MTER Checksheet
      <span class="smi-sub">Mold Trial Evaluation</span>
    </span>
  `;
  mterBtn.addEventListener('click', () => { switchMode('mter'); closeSidebar(); });
  nav.appendChild(mterBtn);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'sidebar-divider';
  nav.appendChild(divider);

  // --- MTER Sub-sections (only shown in mter mode) ---
  if (currentMode === 'mter') {
    const secLabel = document.createElement('div');
    secLabel.className = 'sidebar-section-label';
    secLabel.textContent = 'Sections A – G';
    nav.appendChild(secLabel);

    SECTIONS.forEach(sec => {
      const btn = document.createElement('button');
      btn.className = `sidebar-item${sec.id === currentStep ? ' active' : ''}`;
      btn.id = `si-${sec.id}`;
      btn.innerHTML = `
        <span class="si-icon">${SECTION_ICONS[sec.id]}</span>
        <span style="flex:1; min-width:0;">
          <span style="display:block; font-size:0.78rem; font-weight:500;">${sec.label}</span>
          <span style="display:block; font-size:0.6rem; color:var(--text-muted); font-weight:400;">${sec.sub}</span>
        </span>
        ${savedSections[sec.key] ? `<span class="si-badge">${CHECK_SVG}</span>` : ''}
      `;
      btn.addEventListener('click', () => { goToStep(sec.id); closeSidebar(); });
      nav.appendChild(btn);
    });

    // Export button
    const divider2 = document.createElement('div');
    divider2.className = 'sidebar-divider';
    nav.appendChild(divider2);

    const exportBtn = document.createElement('button');
    exportBtn.className = 'sidebar-item export-item';
    exportBtn.innerHTML = `
      <span class="si-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </span>
      <span style="font-size:0.78rem; font-weight:600;">Export PDF Report</span>
    `;
    exportBtn.addEventListener('click', () => { closeSidebar(); exportReport(); });
    nav.appendChild(exportBtn);
  }
}

// ================================================================
// MODE SWITCHING
// ================================================================
function switchMode(mode) {
  currentMode = mode;
  const mterEl = document.getElementById('mterMode');
  const pbEl   = document.getElementById('paramBankMode');
  const progress = document.getElementById('topProgress');
  const progressPill = document.getElementById('progressPill');
  const headerTitle = document.getElementById('headerTitle');
  const headerSub   = document.getElementById('headerSub');

  if (mode === 'mter') {
    mterEl.style.display = '';
    pbEl.style.display   = 'none';
    progress.style.display  = '';
    progressPill.style.display = '';
    headerTitle.textContent = 'MTER Checksheet';
    headerSub.textContent   = 'Mold Trial & Evaluation Report';
    // Init chart if we return to section G
    if (currentStep === 7) {
      setTimeout(() => { initCoolingChart(); updateCoolingStats(); }, 50);
    }
  } else {
    mterEl.style.display = 'none';
    pbEl.style.display   = '';
    progress.style.display  = 'none';
    progressPill.style.display = 'none';
    headerTitle.textContent = 'Parameter Bank';
    headerSub.textContent   = 'Mitsubishi MEt II — CRUD Parameters';
  }

  buildSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================================================
// SIDEBAR OPEN / CLOSE
// ================================================================
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
  document.getElementById('hamburger').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('is-open');
  document.body.style.overflow = '';
}

// ================================================================
// NAVIGATION (MTER steps)
// ================================================================
function goToStep(step) {
  if (step < 1 || step > TOTAL) return;
  currentStep = step;

  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel${step}`)?.classList.add('active');

  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`si-${step}`)?.classList.add('active');

  const pct = Math.round((step / TOTAL) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${step}/${TOTAL}`;

  if (step === 5) generateCavityGrid();
  if (step === 6) updateConclusion();
  if (step === 7) {
    setTimeout(() => { initCoolingChart(); updateCoolingStats(); }, 50);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================================================
// TOGGLE ITEMS (Sections B, C, D)
// ================================================================
function buildToggleItems(containerId, items, type, stateKey, notesKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const triggerVal = type === 'okng' ? 'NG' : 'YES';

  items.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'toggle-item';

    const isNipple = item === 'Cooling Nipples Condition';

    let btnsHTML = '';
    if (type === 'okng') {
      btnsHTML = `
        <button class="t-btn ok${state[stateKey][i] === 'OK' ? ' sel' : ''}" data-val="OK">OK</button>
        <button class="t-btn ng${state[stateKey][i] === 'NG' ? ' sel' : ''}" data-val="NG">NG</button>
      `;
    } else {
      btnsHTML = `
        <button class="t-btn no${state[stateKey][i] === 'NO' ? ' sel' : ''}" data-val="NO">NO</button>
        <button class="t-btn yes${state[stateKey][i] === 'YES' ? ' sel' : ''}" data-val="YES">YES</button>
      `;
    }

    const savedNote = state[notesKey][i] || {};
    const notesOpen = state[stateKey][i] === triggerVal ? 'open' : '';
    const notesBtnOpen = notesOpen ? 'is-open' : '';

    wrap.innerHTML = `
      <div class="toggle-item-row">
        <div class="ti-label">
          <span class="ti-num">${i + 1}</span>
          <span class="ti-text">${item}</span>
        </div>
        <div class="ti-controls">
          <div class="t-opts">${btnsHTML}</div>
          <button class="note-icon-btn ${notesBtnOpen}" title="Tambah Catatan">${NOTE_ICON_SVG}</button>
        </div>
      </div>
      <div class="toggle-notes ${notesOpen}" id="tn-${stateKey}-${i}">
        <div class="notes-inner">
          <div class="note-row">
            <span class="note-row-label">Action</span>
            <input type="text" placeholder="Tindakan yang dilakukan..." value="${savedNote.action || ''}" data-field="action" />
          </div>
          <div class="note-row">
            <span class="note-row-label">Result</span>
            <input type="text" placeholder="Hasil yang diperoleh..." value="${savedNote.result || ''}" data-field="result" />
          </div>
          <div class="note-row">
            <span class="note-row-label">Remark</span>
            <input type="text" placeholder="Catatan tambahan..." value="${savedNote.remark || ''}" data-field="remark" />
          </div>
        </div>
      </div>
    `;

    container.appendChild(wrap);

    // Wire toggle buttons
    wrap.querySelectorAll('.t-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        state[stateKey][i] = val;
        wrap.querySelectorAll('.t-btn').forEach(b => b.classList.remove('sel'));
        btn.classList.add('sel');

        const notesEl = document.getElementById(`tn-${stateKey}-${i}`);
        const noteBtn = wrap.querySelector('.note-icon-btn');
        const hasData = !!(state[notesKey][i]?.action || state[notesKey][i]?.result || state[notesKey][i]?.remark);

        if (val === triggerVal) {
          notesEl?.classList.add('open');
          noteBtn?.classList.add('is-open');
        } else if (!hasData) {
          notesEl?.classList.remove('open');
          noteBtn?.classList.remove('is-open');
        }
      });
    });

    // Wire note icon button
    const noteBtn = wrap.querySelector('.note-icon-btn');
    noteBtn?.addEventListener('click', () => {
      const notesEl = document.getElementById(`tn-${stateKey}-${i}`);
      const isOpen = notesEl?.classList.contains('open');
      if (isOpen) {
        notesEl?.classList.remove('open');
        noteBtn.classList.remove('is-open');
      } else {
        notesEl?.classList.add('open');
        noteBtn.classList.add('is-open');
        setTimeout(() => notesEl?.querySelector('input')?.focus(), 300);
      }
    });

    // Wire note inputs
    wrap.querySelectorAll('.notes-inner input').forEach(inp => {
      inp.addEventListener('input', () => {
        if (!state[notesKey][i]) state[notesKey][i] = {};
        state[notesKey][i][inp.dataset.field] = inp.value;
      });
    });

    // Nipple special row
    if (isNipple) {
      const nippleWrap = document.createElement('div');
      nippleWrap.className = 'nipple-row';
      nippleWrap.innerHTML = `
        <span class="nipple-label">&#8627; Nipples Size</span>
        <button class="nipple-btn${state.nippleSize === '1/4"' ? ' sel' : ''}" data-size='1/4"'>1/4"</button>
        <button class="nipple-btn${state.nippleSize === '3/8"' ? ' sel' : ''}" data-size='3/8"'>3/8"</button>
      `;
      nippleWrap.querySelectorAll('.nipple-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.nippleSize = btn.dataset.size;
          nippleWrap.querySelectorAll('.nipple-btn').forEach(b => b.classList.remove('sel'));
          btn.classList.add('sel');
        });
      });
      container.appendChild(nippleWrap);
    }
  });
}

// ================================================================
// CAVITY GRID (Section E)
// ================================================================
function generateCavityGrid() {
  const count = parseInt(document.getElementById('cavityCount')?.value) || 4;
  const grid = document.getElementById('cavityGrid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const cell = document.createElement('div');
    const s = state.cavities[i] || '';
    cell.className = `cav-cell ${s}`;
    cell.innerHTML = `<span class="c-num">C${i}</span><span class="c-status">${s ? s.toUpperCase() : '\u2014'}</span>`;
    cell.addEventListener('click', () => {
      const cur = state.cavities[i] || '';
      const next = cur === '' ? 'ok' : cur === 'ok' ? 'ng' : '';
      state.cavities[i] = next;
      cell.className = `cav-cell ${next}`;
      cell.querySelector('.c-status').textContent = next ? next.toUpperCase() : '\u2014';
    });
    grid.appendChild(cell);
  }
}

function setCavAll(status) {
  const count = parseInt(document.getElementById('cavityCount')?.value) || 4;
  for (let i = 1; i <= count; i++) state.cavities[i] = status;
  generateCavityGrid();
}

// ================================================================
// CONCLUSION (Section F)
// ================================================================
function updateConclusion() {
  const el = document.getElementById('conclusionSummary');
  if (!el) return;

  const mechOK  = Object.values(state.moldMech).filter(v => v === 'OK').length;
  const mechNG  = Object.values(state.moldMech).filter(v => v === 'NG').length;
  const demoNO  = Object.values(state.demoulding).filter(v => v === 'NO').length;
  const demoYES = Object.values(state.demoulding).filter(v => v === 'YES').length;
  const aesOK   = Object.values(state.aesthetic).filter(v => v === 'OK').length;
  const aesNG   = Object.values(state.aesthetic).filter(v => v === 'NG').length;
  const cavOK   = Object.values(state.cavities).filter(v => v === 'ok').length;
  const cavNG   = Object.values(state.cavities).filter(v => v === 'ng').length;

  el.innerHTML = `
    <div class="conc-table">
      <div class="conc-row">
        <span class="conc-label">Mold Mechanism (B)</span>
        <span class="conc-val"><span class="ok">${mechOK} OK</span> / <span class="${mechNG > 0 ? 'ng' : ''}">${mechNG} NG</span> / ${MOLD_MECH_ITEMS.length} total</span>
      </div>
      <div class="conc-row">
        <span class="conc-label">Demoulding (C)</span>
        <span class="conc-val"><span class="ok">${demoNO} NO-issue</span> / <span class="${demoYES > 0 ? 'ng' : ''}">${demoYES} YES</span> / ${DEMOULDING_ITEMS.length} total</span>
      </div>
      <div class="conc-row">
        <span class="conc-label">Aesthetic (D)</span>
        <span class="conc-val"><span class="ok">${aesOK} OK</span> / <span class="${aesNG > 0 ? 'ng' : ''}">${aesNG} NG</span> / ${AESTHETIC_ITEMS.length} total</span>
      </div>
      <div class="conc-row">
        <span class="conc-label">Cavity Status</span>
        <span class="conc-val"><span class="ok">${cavOK} OK</span> / <span class="${cavNG > 0 ? 'ng' : ''}">${cavNG} NG</span></span>
      </div>
      <div class="conc-row">
        <span class="conc-label">Nipples Size</span>
        <span class="conc-val">${state.nippleSize || '\u2014'}</span>
      </div>
    </div>
  `;
}

// ================================================================
// COOLING CHART (Chart.js) — Section G
// ================================================================
function initCoolingChart() {
  const canvas = document.getElementById('coolingChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  const labels = ['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4'];
  const inletData  = [1,2,3,4].map(z => parseFloat(state.coolingData[z].inlet)  || null);
  const outletData = [1,2,3,4].map(z => parseFloat(state.coolingData[z].outlet) || null);

  const commonDs = {
    tension: 0.4, pointRadius: 5, pointHoverRadius: 7,
    pointBorderWidth: 2, borderWidth: 2, spanGaps: true
  };

  const data = {
    labels,
    datasets: [
      {
        ...commonDs,
        label: 'Inlet Temp (°C)',
        data: inletData,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.08)',
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        fill: true
      },
      {
        ...commonDs,
        label: 'Outlet Temp (°C)',
        data: outletData,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.08)',
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#fff',
        fill: true
      }
    ]
  };

  if (coolingChart) {
    coolingChart.data = data;
    coolingChart.update('active');
    return;
  }

  coolingChart = new Chart(ctx, {
    type: 'line',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#64748b',
            font: { family: 'Inter', size: 11, weight: '600' },
            padding: 14,
            usePointStyle: true,
            pointStyleWidth: 8
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#0f172a',
          bodyColor: '#64748b',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          titleFont: { family: 'Inter', weight: '700' },
          bodyFont: { family: 'Inter' },
          padding: 10,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.raw !== null ? ctx.raw + ' °C' : 'N/A'}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(15,23,42,0.05)' },
          ticks: { color: '#64748b', font: { family: 'Inter', size: 10, weight: '600' } }
        },
        y: {
          suggestedMin: 0,
          suggestedMax: 60,
          grid: { color: 'rgba(15,23,42,0.05)' },
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 10 },
            stepSize: 5,
            precision: 0,
            callback: v => Math.round(v) + '°'
          },
          title: {
            display: true,
            text: 'Temperature (°C)',
            color: '#64748b',
            font: { family: 'Inter', size: 10, weight: '600' }
          }
        }
      }
    }
  });
}

function updateCoolingChart() {
  if (!coolingChart) return;
  coolingChart.data.datasets[0].data = [1,2,3,4].map(z => parseFloat(state.coolingData[z].inlet)  || null);
  coolingChart.data.datasets[1].data = [1,2,3,4].map(z => parseFloat(state.coolingData[z].outlet) || null);
  coolingChart.update('active');
  updateCoolingStats();
}

function updateCoolingStats() {
  const inlets  = [1,2,3,4].map(z => parseFloat(state.coolingData[z].inlet)  || 0).filter(v => v > 0);
  const outlets = [1,2,3,4].map(z => parseFloat(state.coolingData[z].outlet) || 0).filter(v => v > 0);

  const avgIn  = inlets.length  ? (inlets.reduce((a,b)=>a+b,0)/inlets.length).toFixed(1)   : '\u2014';
  const avgOut = outlets.length ? (outlets.reduce((a,b)=>a+b,0)/outlets.length).toFixed(1) : '\u2014';
  const delta  = (avgIn !== '\u2014' && avgOut !== '\u2014') ? Math.abs(avgIn - avgOut).toFixed(1) : '\u2014';

  const elIn  = document.getElementById('statAvgInlet');
  const elOut = document.getElementById('statAvgOutlet');
  const elDel = document.getElementById('statDelta');
  if (elIn)  elIn.textContent  = avgIn  !== '\u2014' ? avgIn  + '°' : '\u2014';
  if (elOut) elOut.textContent = avgOut !== '\u2014' ? avgOut + '°' : '\u2014';
  if (elDel) elDel.textContent = delta  !== '\u2014' ? delta  + '°' : '\u2014';
}

function buildCoolingInputs() {
  for (let z = 1; z <= 4; z++) {
    const inletEl  = document.getElementById(`z${z}_inlet`);
    const outletEl = document.getElementById(`z${z}_outlet`);
    if (inletEl) {
      inletEl.value = state.coolingData[z].inlet || '';
      inletEl.addEventListener('input', () => {
        state.coolingData[z].inlet = inletEl.value;
        updateCoolingChart();
      });
    }
    if (outletEl) {
      outletEl.value = state.coolingData[z].outlet || '';
      outletEl.addEventListener('input', () => {
        state.coolingData[z].outlet = outletEl.value;
        updateCoolingChart();
      });
    }
  }
}

// ================================================================
// SAVE SECTION (MTER)
// ================================================================
function saveSection(key) {
  if (key === 'A') {
    if (!document.getElementById('trialDate')?.value) {
      showToast('Tanggal Trial wajib diisi!', 'error'); return;
    }
    if (!document.getElementById('moldName')?.value.trim()) {
      showToast('Nama Mold wajib diisi!', 'error'); return;
    }
    if (!document.getElementById('machineSelect')?.value) {
      showToast('Mesin harus dipilih!', 'error'); return;
    }
  }
  if (key === 'F') {
    if (!document.getElementById('overallJudgment')?.value) {
      showToast('Overall Judgment harus dipilih!', 'error'); return;
    }
  }

  savedSections[key] = true;
  buildSidebar();
  localStorage.setItem(`mter-saved-${key}`, '1');

  const btn = document.getElementById(`saveBtn${key}`);
  if (btn) {
    const orig = btn.innerHTML;
    btn.classList.add('saved');
    btn.innerHTML = `${CHECK_SVG} Tersimpan!`;
    setTimeout(() => { btn.classList.remove('saved'); btn.innerHTML = orig; }, 2000);
  }

  showToast(`Section ${key} berhasil disimpan!`, 'success');
}

// ================================================================
// PARAMETER BANK — Collect all input field IDs
// ================================================================
const PB_FIELD_IDS = [
  // Temperature
  'pb_nozzle','pb_front','pb_middle','pb_rear','pb_coolCavity','pb_coolCore','pb_oilTemp',
  // Injection stages V
  'pb_v1','pb_v2','pb_v3','pb_v4','pb_v5','pb_v6','pb_v7',
  // Injection stages P
  'pb_p1','pb_p2','pb_p3','pb_p4','pb_p5','pb_p6','pb_p7',
  // Injection stages LS
  'pb_ls1','pb_ls2','pb_ls3','pb_ls4','pb_ls5','pb_ls6','pb_ls7',
  // Holding & Plastifikasi
  'pb_holdPressure','pb_holdTime','pb_screwSpeed','pb_backPress','pb_dosingPos','pb_cushion',
  // Mould Close
  'pb_cl1_sp','pb_cl1_pos','pb_cl1_pr',
  'pb_cl2_sp','pb_cl2_pos','pb_cl2_pr',
  'pb_cl3_sp','pb_cl3_pos','pb_cl3_pr',
  // Mould Open
  'pb_op1_sp','pb_op1_pos','pb_op1_pr',
  'pb_op2_sp','pb_op2_pos','pb_op2_pr',
  'pb_op3_sp','pb_op3_pos','pb_op3_pr',
  // Ejector
  'pb_ejectFwdSpd','pb_ejectFwdPr','pb_ejectFwdPos',
  'pb_ejectRetSpd','pb_ejectRetPr','pb_ejectCount',
  // Cycle
  'pb_coolingTime','pb_cureTime','pb_injTime','pb_cycleTotal','pb_suckBack'
];

function getPBKey() {
  const machine  = document.getElementById('pb_machine')?.value;
  const mould    = document.getElementById('pb_mould')?.value;
  const material = document.getElementById('pb_material')?.value;
  if (!machine || !mould || !material) return null;
  // Sanitize key
  const sanitize = s => s.replace(/[^a-zA-Z0-9\-_]/g, '_');
  return `paramBank_${sanitize(machine)}_${sanitize(mould)}_${sanitize(material)}`;
}

function saveParamBank() {
  const key = getPBKey();
  if (!key) {
    showToast('Pilih Mesin, Mould, dan Material terlebih dahulu!', 'error');
    return;
  }

  const data = {};
  PB_FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);
    data[id] = el ? el.value : '';
  });

  localStorage.setItem(key, JSON.stringify(data));
  showToast(`Parameter tersimpan untuk ${document.getElementById('pb_machine').value} / ${document.getElementById('pb_mould').value} / ${document.getElementById('pb_material').value}`, 'success');
}

function loadParamBank() {
  const key = getPBKey();
  if (!key) {
    showToast('Pilih Mesin, Mould, dan Material terlebih dahulu!', 'error');
    return;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    // Clear all fields
    PB_FIELD_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    showToast('Data parameter belum tersedia untuk kombinasi ini.', 'info');
    return;
  }

  try {
    const data = JSON.parse(raw);
    PB_FIELD_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id] !== undefined) el.value = data[id];
    });
    showToast(`Parameter berhasil dimuat untuk ${document.getElementById('pb_machine').value} / ${document.getElementById('pb_mould').value} / ${document.getElementById('pb_material').value}`, 'success');
  } catch(e) {
    showToast('Gagal membaca data parameter. Data mungkin rusak.', 'error');
  }
}

// ================================================================
// TOAST
// ================================================================
function showToast(msg, type = 'info') {
  const stack = document.getElementById('toastStack');
  if (!stack) return;

  let iconSVG = '';
  if (type === 'success') iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  else if (type === 'error') iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  else iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${iconSVG}</span><span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(() => t.parentNode?.removeChild(t), 3100);
}

// ================================================================
// EXPORT REPORT (html2pdf.js)
// ================================================================
function exportReport() {
  if (typeof html2pdf === 'undefined') {
    showToast('Library export belum siap, coba refresh.', 'error');
    return;
  }

  buildPrintLayout();
  const el = document.getElementById('printLayout');
  el.style.display = 'block';

  const moldName = document.getElementById('moldName')?.value || 'MOLD-XXX';
  const today = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });

  const opt = {
    margin:       [12, 10, 12, 10],
    filename:     `MTER_Report_${moldName}_${today}.pdf`,
    image:        { type: 'jpeg', quality: 0.97 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: 'css', avoid: ['.print-section-wrap', 'tr'] }
  };

  html2pdf().set(opt).from(el).save().then(() => {
    el.style.display = 'none';
    showToast('PDF berhasil diunduh!', 'success');
  });
}

function buildPrintLayout() {
  const el = document.getElementById('printLayout');
  if (!el) return;

  const v = (id) => document.getElementById(id)?.value || '—';
  const today = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });
  const moldName = v('moldName');
  const trialNum = v('trialNumber');

  const idFields = [
    ['Tanggal Trial', v('trialDate')],  ['Trial Ke-', `#${trialNum}`],
    ['Nama Mold',    moldName],         ['Part Name',   v('partName')],
    ['Part Number',  v('partNumber')],  ['Customer',    v('customer')],
    ['Mesin',        v('machineSelect')],['Tonnage',     v('tonnage') ? v('tonnage')+'T' : '—'],
    ['Material',     v('resinMaterial')],['Warna',       v('materialColor')],
    ['Jml Cavity',   v('cavityCount')], ['Cycle Target', v('cycleTarget') ? v('cycleTarget')+'s' : '—'],
    ['PIC',          v('inspector')],   ['Judgment',     v('overallJudgment') || '—']
  ];

  let idHTML = '';
  for (let i = 0; i < idFields.length; i += 2) {
    idHTML += `<div class="print-id-row">
      <div class="print-id-cell"><span class="print-id-label">${idFields[i][0]}</span><span class="print-id-value">${idFields[i][1]}</span></div>
      <div class="print-id-cell"><span class="print-id-label">${idFields[i+1]?.[0]||''}</span><span class="print-id-value">${idFields[i+1]?.[1]||''}</span></div>
    </div>`;
  }

  let mechRows = '';
  MOLD_MECH_ITEMS.forEach((item, i) => {
    const s = state.moldMech[i] || '—';
    const n = state.moldMechNotes[i] || {};
    const cls = s === 'OK' ? 'status-ok' : s === 'NG' ? 'status-ng' : '';
    mechRows += `<tr><td class="col-no">${i+1}</td><td>${item}</td><td class="col-stat ${cls}">${s}</td><td>${n.action||''}</td><td>${n.result||''}</td><td>${n.remark||''}</td></tr>`;
  });

  let demoRows = '';
  DEMOULDING_ITEMS.forEach((item, i) => {
    const s = state.demoulding[i] || '—';
    const n = state.demouldingNotes[i] || {};
    const cls = s === 'YES' ? 'status-yes' : s === 'NO' ? 'status-no' : '';
    demoRows += `<tr><td class="col-no">${i+1}</td><td>${item}</td><td class="col-stat ${cls}">${s}</td><td>${n.action||''}</td><td>${n.result||''}</td><td>${n.remark||''}</td></tr>`;
  });

  let aesRows = '';
  AESTHETIC_ITEMS.forEach((item, i) => {
    const s = state.aesthetic[i] || '—';
    const n = state.aestheticNotes[i] || {};
    const cls = s === 'OK' ? 'status-ok' : s === 'NG' ? 'status-ng' : '';
    aesRows += `<tr><td class="col-no">${i+1}</td><td>${item}</td><td class="col-stat ${cls}">${s}</td><td>${n.action||''}</td><td>${n.result||''}</td><td>${n.remark||''}</td></tr>`;
  });

  const cavCount = parseInt(document.getElementById('cavityCount')?.value) || 4;
  let cavCells = '';
  for (let i = 1; i <= cavCount; i++) {
    const s = state.cavities[i] || '';
    cavCells += `<div class="print-cavity-cell ${s}">C${i}<br>${s ? s.toUpperCase() : '—'}</div>`;
  }

  let coolRows = '';
  for (let z = 1; z <= 4; z++) {
    const inlet  = parseFloat(state.coolingData[z].inlet)  || null;
    const outlet = parseFloat(state.coolingData[z].outlet) || null;
    const delta  = (inlet !== null && outlet !== null) ? Math.abs(outlet - inlet).toFixed(1) : '—';
    const dCls   = delta !== '—' && parseFloat(delta) > 3 ? 'delta-high' : 'delta-ok';
    coolRows += `<tr><td>Zona ${z}</td><td>${inlet !== null ? inlet+'°C' : '—'}</td><td>${outlet !== null ? outlet+'°C' : '—'}</td><td class="${dCls}">${delta !== '—' ? delta+'°C' : '—'}</td></tr>`;
  }

  const judgment = v('overallJudgment');
  const jColor = judgment === 'APPROVED' ? '#059669' : judgment === 'REJECTED' ? '#DC2626' : '#D97706';

  el.innerHTML = `
    <div class="print-page">
      <div class="print-header">
        <div class="print-header-left">
          <img class="print-logo" src="Logo.png" alt="ALBEA" onerror="this.style.display='none'" />
          <div class="print-title">
            <h1>Mold Trial Evaluation Report</h1>
            <p>MTER Smart Checksheet — Digital Inspection Record</p>
          </div>
        </div>
        <div class="print-doc-num">
          <div><strong>Doc No:</strong> MTER-${moldName}-${trialNum}</div>
          <div><strong>Date:</strong> ${today}</div>
          <div><strong>Rev:</strong> 00</div>
        </div>
      </div>

      <div class="print-section-wrap">
        <div class="print-sec-title">A — Identitas Trial</div>
        <div class="print-identity">${idHTML}</div>
      </div>

      <div class="print-section-wrap">
        <div class="print-sec-title">B — Mold Mechanism Condition</div>
        <table class="print-table">
          <thead><tr><th class="col-no">No</th><th>Checking Item</th><th class="col-stat">Status</th><th>Action</th><th>Result</th><th>Remark</th></tr></thead>
          <tbody>${mechRows}</tbody>
        </table>
      </div>

      <div class="print-section-wrap">
        <div class="print-sec-title">C — Demoulding Condition</div>
        <table class="print-table">
          <thead><tr><th class="col-no">No</th><th>Checking Item</th><th class="col-stat">Found?</th><th>Action</th><th>Result</th><th>Remark</th></tr></thead>
          <tbody>${demoRows}</tbody>
        </table>
      </div>

      <div class="print-section-wrap">
        <div class="print-sec-title">D — Product Aesthetic Evaluation</div>
        <table class="print-table">
          <thead><tr><th class="col-no">No</th><th>Defect Type</th><th class="col-stat">Status</th><th>Action</th><th>Result</th><th>Remark</th></tr></thead>
          <tbody>${aesRows}</tbody>
        </table>
      </div>

      <div class="print-section-wrap">
        <div class="print-sec-title">E — Cavity Layout Status</div>
        <div class="print-cavity-grid">${cavCells}</div>
      </div>

      <div class="print-section-wrap">
        <div class="print-sec-title">G — Cooling Channel Analysis</div>
        <table class="print-cooling-table">
          <thead><tr><th>Zone</th><th>Inlet Temp</th><th>Outlet Temp</th><th>Delta T</th></tr></thead>
          <tbody>${coolRows}</tbody>
        </table>
      </div>

      <div class="print-section-wrap">
        <div class="print-sec-title">F — Conclusion &amp; Judgment</div>
        <div style="border:2px solid ${jColor};border-radius:6px;padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:14pt;font-weight:800;color:${jColor};">${judgment || '—'}</span>
          <div style="flex:1;font-size:7.5pt;color:#475569;">${document.getElementById('conclusionNotes')?.value || 'Tidak ada catatan.'}</div>
        </div>
        ${document.getElementById('generalNotes')?.value ? `<p style="font-size:7pt;color:#475569;"><strong>Catatan Umum:</strong> ${document.getElementById('generalNotes').value}</p>` : ''}
      </div>

      <div class="print-section-wrap">
        <div class="print-signatures">
          <div class="print-sig-box">
            <div class="print-sig-role">Dibuat oleh (Inspector)</div>
            <div class="print-sig-line"><div class="print-sig-name">${v('inspector')}</div></div>
          </div>
          <div class="print-sig-box">
            <div class="print-sig-role">Diperiksa oleh (QC)</div>
            <div class="print-sig-line"><div class="print-sig-name">................................</div></div>
          </div>
          <div class="print-sig-box">
            <div class="print-sig-role">Disetujui oleh (Manager)</div>
            <div class="print-sig-line"><div class="print-sig-name">................................</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ================================================================
// MODAL
// ================================================================
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// ================================================================
// INIT
// ================================================================
function init() {
  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('trialDate');
  if (dateEl) dateEl.value = today;

  // Build sidebar (default: parambank mode)
  buildSidebar();

  // Apply default mode UI
  switchMode('parambank');

  // Build MTER toggle items (still build them even in parambank mode)
  buildToggleItems('moldMechItems',   MOLD_MECH_ITEMS,   'okng',  'moldMech',  'moldMechNotes');
  buildToggleItems('demouldingItems', DEMOULDING_ITEMS,  'noyes', 'demoulding','demouldingNotes');
  buildToggleItems('aestheticItems',  AESTHETIC_ITEMS,   'okng',  'aesthetic', 'aestheticNotes');

  // Build cooling inputs
  buildCoolingInputs();

  // Wire hamburger
  document.getElementById('hamburger')?.addEventListener('click', () => {
    const isOpen = document.getElementById('sidebar').classList.contains('open');
    isOpen ? closeSidebar() : openSidebar();
  });

  // Wire sidebar overlay
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);

  // Wire MTER save buttons
  document.querySelectorAll('[data-save-section]').forEach(btn => {
    btn.addEventListener('click', () => saveSection(btn.dataset.saveSection));
  });

  // Wire cavity controls
  document.getElementById('cavAllOk')?.addEventListener('click', () => setCavAll('ok'));
  document.getElementById('cavAllNg')?.addEventListener('click', () => setCavAll('ng'));
  document.getElementById('cavReset')?.addEventListener('click', () => setCavAll(''));

  // Wire modal closes
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  // Wire Parameter Bank buttons
  document.getElementById('pb_saveBtn')?.addEventListener('click', saveParamBank);
  document.getElementById('pb_loadBtn')?.addEventListener('click', loadParamBank);

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });

  // Window resize — update chart
  window.addEventListener('resize', () => {
    if (currentStep === 7 && coolingChart) coolingChart.resize();
  });
}

document.addEventListener('DOMContentLoaded', init);
