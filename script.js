// ================================================================
// MTER Smart Checksheet v5.0 - script.js
// ================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfgmkRb1CC_TSxObOtiyvFuY2Z4Nqz7Pc",
  authDomain: "mter-checksheet-hazma.firebaseapp.com",
  projectId: "mter-checksheet-hazma",
  storageBucket: "mter-checksheet-hazma.firebasestorage.app",
  messagingSenderId: "554080082717",
  appId: "1:554080082717:web:de924275307f8045671ff4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ----------------------------------------------------------------
// DATA
// ----------------------------------------------------------------

// B.1 Opening Mechanism (14 items)
const B1_OPENING = [
  'Opening Step',
  'Side Lock',
  'Parting Lock',
  'Puller Plate',
  'Shoulder Bolt',
  'Puller Chain',
  'Limit Switch',
  'Rack & Pinion',
  'Gear',
  'Runner Lock Pin',
  'Side Straight Block Set',
  'Special Guide Bush',
  'Shot Counter',
  'Need Work Instruction'
];

// B.2 Slider Mechanism (7 items)
const B2_SLIDER = [
  'Slide Core',
  'Guide Rails Hardness',
  'Spring',
  'Ball Plunger',
  'Slide Stopper',
  'Angular Pins',
  'Locking Blocks / Wedge'
];

// B.3 Ejector Mechanism (12 items)
const B3_EJECTOR = [
  'Pin',
  'Blade',
  'Sleeve',
  'Lifter / Angular',
  'Disc',
  'Plate',
  'Bar',
  'Double Ejection',
  'Air Blow',
  'Guide Pin / Bush',
  'Spring',
  'Distance Spacer'
];

// B.4 Hydraulic System (3 items)
const B4_HYDRAULIC = [
  'Unscrewing',
  'Ejector Movement',
  'Slider Movement'
];

// B.5 Cooling System (6 items)
const B5_COOLING = [
  'Cavity',
  'Core',
  'Plate',
  'Stripper',
  'Heat Transfer Rod / Pipe',
  'Nipples Size'
];

// B.6 Hot Runner System (4 items)
const B6_HOTRUNNER = [
  'Sprue Bush Heater',
  'Manifold',
  'Sub-runner Heater',
  'Temp. Controller'
];

// B.7 Unscrewing (2 items)
const B7_UNSCREWING = [
  'Returned Core',
  'Stripper Move Forward'
];

// B.8 Product Take Out (3 items)
const B8_TAKEOUT = [
  'Robot',
  'Space for Robot Arm',
  'Operator'
];

// B.9 Balancing (2 items)
const B9_BALANCING = [
  'Gate',
  'Runner'
];

// C. Demoulding Condition (6 items) — toggle: NO / YES
const C_DEMOULDING = [
  'Runner Sticking',
  'Gate Cracking',
  'Sticking on Cavity',
  'Crack When Opening',
  'Crack When Ejection',
  'Crack When Unscrewing'
];

// D. Product Aesthetic Evaluation (26 items) — toggle: OK / NG
const D_AESTHETIC = [
  'Surface Finish',
  'Flashing',
  'Scratch',
  'Gas Mark / Burnst',
  'Short shoot',
  'Weld Line',
  'Warping/Bending',
  'Sinkmark at body R/L',
  'Flow Mark/ Air Trap',
  'Wrinkle',
  'Gate Mark',
  'White Mark',
  'Parting Line',
  'Logo',
  'Country Marking',
  'Cavity Number',
  'Cover Pull Force',
  'Push Button Force',
  'Hinge Force',
  'Separation Force',
  'Torque Force',
  'Pop-Up',
  'Hinge Lock',
  'Step',
  'Gap',
  'Unequal Gap'
];

// ----------------------------------------------------------------
// SIDEBAR NAVIGATION STRUCTURE
// ----------------------------------------------------------------
const MTER_NAV = [
  {
    type: 'item',
    label: 'Header Informasi',
    panelId: 'panel-header-info',
    key: 'HeaderInfo',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>'
  },
  {
    type: 'item',
    label: 'A. Injection Machine',
    panelId: 'panel-inj-machine',
    key: 'InjMachine',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>'
  },
  {
    type: 'accordion',
    label: 'B. Mold Mechanism',
    key: 'B',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>',
    children: [
      { label: 'B.1 Opening Mechanism', panelId: 'panel-b1-opening', key: 'B1Opening' },
      { label: 'B.2 Slider Mechanism', panelId: 'panel-b2-slider', key: 'B2Slider' },
      { label: 'B.3 Ejector Mechanism', panelId: 'panel-b3-ejector', key: 'B3Ejector' },
      { label: 'B.4 Hydraulic System', panelId: 'panel-b4-hydraulic', key: 'B4Hydraulic' },
      { label: 'B.5 Cooling System', panelId: 'panel-b5-cooling', key: 'B5Cooling' },
      { label: 'B.6 Hot Runner System', panelId: 'panel-b6-hotrunner', key: 'B6HotRunner' },
      { label: 'B.7 Unscrewing', panelId: 'panel-b7-unscrewing', key: 'B7Unscrewing' },
      { label: 'B.8 Product Take Out', panelId: 'panel-b8-takeout', key: 'B8TakeOut' },
      { label: 'B.9 Balancing', panelId: 'panel-b9-balancing', key: 'B9Balancing' }
    ]
  },
  {
    type: 'item',
    label: 'C. Demoulding Condition',
    panelId: 'panel-c-demoulding',
    key: 'CDemoulding',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>'
  },
  {
    type: 'item',
    label: 'D. Product Aesthetic',
    panelId: 'panel-d-aesthetic',
    key: 'DAesthetic',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2"/></svg>'
  },
  {
    type: 'item',
    label: 'E. Cavity Layout',
    panelId: 'panel-e-cavity',
    key: 'ECavity',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
  },
  {
    type: 'item',
    label: 'F. Conclusion',
    panelId: 'panel-f-conclusion',
    key: 'FConclusion',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
  }
];

// ----------------------------------------------------------------
// SVG SNIPPETS
// ----------------------------------------------------------------
const NOTE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
const CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
const SAVE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';

// ----------------------------------------------------------------
// STATE
// ----------------------------------------------------------------
let currentMode = 'parambank';
let activePanelId = null;
let openAccordion = null;

const state = {
  b1: {}, b1Notes: {},
  b2: {}, b2Notes: {},
  b3: {}, b3Notes: {},
  b4: {}, b4Notes: {},
  b5: {}, b5Notes: {},
  b6: {}, b6Notes: {},
  b7: {}, b7Notes: {},
  b8: {}, b8Notes: {},
  b9: {}, b9Notes: {},
  c: {}, cNotes: {},
  d: {}, dNotes: {},
  f_produk: '',
  f_mesin: '',
  f_mold: '',
  f_peripheral: '',
  nippleSize: '',      // '1/4"' | '3/8"' | ''
  b5ZonesCount: 4,
  b5ZonesData: [],
  cavityCount: 4,
  cavities: [],
  moldStatus: '',
  saved: {}
};
for (let i = 0; i < state.cavityCount; i++) state.cavities.push({ status: '', action: '', result: '', remark: '' });

// ----------------------------------------------------------------
// PARAMETER BANK FIELD IDs
// ----------------------------------------------------------------
const PB_FIELD_IDS = [
  // General Information
  'pb_tanggal', 'pb_machine', 'pb_machine_custom', 'pb_mould', 'pb_cavity', 'pb_produksi', 'pb_ket',
  'pb_material', 'pb_material_custom', 'pb_berat_shoot', 'pb_berat_unit', 'pb_berat_runner', 'pb_cycleTime',

  // Temp & Heater
  'pb_nozzle', 'pb_front', 'pb_middle', 'pb_rear', 'pb_hopper', 'pb_coolCavity', 'pb_coolCore', 'pb_oilTemp',
  'pb_heater1', 'pb_heater2', 'pb_heater3', 'pb_heater4', 'pb_block', 'pb_hnSprue',

  // Mould Close / Open
  'pb_mp_time', 'pb_mp_torque', 'pb_mo_time', 'pb_mo_torque',

  // Injection Stage 1-7
  'pb_v1', 'pb_v2', 'pb_v3', 'pb_v4', 'pb_v5', 'pb_v6', 'pb_v7',
  'pb_p1', 'pb_p2', 'pb_p3', 'pb_p4', 'pb_p5', 'pb_p6', 'pb_p7',
  'pb_ls1', 'pb_ls2', 'pb_ls3', 'pb_ls4', 'pb_ls5', 'pb_ls6', 'pb_ls7',

  // Holding Pressure
  'pb_hold_p5', 'pb_hold_p4', 'pb_hold_p3', 'pb_hold_p2', 'pb_hold_p1',
  'pb_hold_t5', 'pb_hold_t4', 'pb_hold_t3', 'pb_hold_t2', 'pb_hold_t1',

  // Plastifikasi & Melt Decomp
  'pb_screwSpeed', 'pb_backPress', 'pb_dosingPos',
  'pb_vsb', 'pb_lsb',

  // Ejector
  'pb_ej_ko', 'pb_ej_semi', 'pb_ej_std', 'pb_ej_pre',

  // Timing
  'pb_coolingTime', 'pb_cureTime', 'pb_injTime', 'pb_suckBack'
];

// ----------------------------------------------------------------
// (Sidebar functions removed — navigation uses home-grid menu)

// ----------------------------------------------------------------
// PANEL SHOW
// ----------------------------------------------------------------
function showPanel(panelId, skipPushState = false) {
  // Determine which mode owns this panel and go there if needed
  const isPbPanel = panelId.startsWith('panel-pb-');
  const targetMode = isPbPanel ? 'parambank' : 'mter';
  if (currentMode !== targetMode) switchMode(targetMode, true);

  activePanelId = panelId;
  sessionStorage.setItem('activePanelId', panelId);
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(panelId)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!skipPushState) {
    history.pushState({ mode: targetMode, panelId: panelId }, '', '#' + targetMode + '-' + panelId);
  }
}

// ----------------------------------------------------------------
// MODE SWITCHING
// ----------------------------------------------------------------
function switchMode(mode, skipPushState = false) {
  const pl = document.getElementById('printLayout');
  if (pl) pl.style.display = 'none';
  
  currentMode = mode;
  sessionStorage.setItem('currentMode', mode);
  document.body.classList.toggle('is-home', mode === 'home');

  const mterEl = document.getElementById('mterMode');
  const mterMenuEl = document.getElementById('mterMenuMode');
  const homeEl = document.getElementById('homeMode');
  const pbEl = document.getElementById('paramBankMode');
  const pbMenuEl = document.getElementById('paramBankMenuMode');
  const rhEl = document.getElementById('reportHistoryMode');
  const reportMenuEl = document.getElementById('reportMenuMode');
  const csEl = document.getElementById('coolingSketchMode');
  const appHeader = document.getElementById('appHeader');
  const hTitle = document.getElementById('headerTitle');
  const hSub = document.getElementById('headerSub');

  // Hide all modes
  [mterEl, mterMenuEl, homeEl, pbEl, pbMenuEl, rhEl, reportMenuEl, csEl].forEach(el => {
    if (el) el.style.display = 'none';
  });
  document.getElementById('analyticsMode').style.display = 'none';

  // Show/hide app header based on mode
  if (['home', 'mtermenu', 'parambankmenu', 'reportmenu', 'coolingsketch'].includes(mode)) {
    appHeader.style.display = 'none';
  } else {
    appHeader.style.display = 'flex';
  }

  // Activate the right container
  if (mode === 'home') {
    if (homeEl) homeEl.style.display = 'block';
  } else if (mode === 'mtermenu') {
    if (mterMenuEl) { mterMenuEl.style.display = 'block'; renderMterMenu(); }
  } else if (mode === 'parambankmenu') {
    if (pbMenuEl) { pbMenuEl.style.display = 'block'; renderParamBankMenu(); }
  } else if (mode === 'reportmenu') {
    if (reportMenuEl) { reportMenuEl.style.display = 'block'; renderReportMenu(); }
  } else if (mode === 'mter') {
    if (mterEl) mterEl.style.display = '';
    hTitle.textContent = 'MTER Checksheet';
    hSub.textContent = 'Mold Trial & Evaluation Report';
    if (!activePanelId) {
      activePanelId = 'panel-header-info';
      document.getElementById('panel-header-info')?.classList.add('active');
    }
  } else if (mode === 'parambank') {
    if (pbEl) pbEl.style.display = '';
    hTitle.textContent = 'Parameter Bank';
    hSub.textContent = 'Standardisasi Parameter Mesin';
    // Show first panel if nothing active
    if (!activePanelId || !activePanelId.startsWith('panel-pb-')) {
      activePanelId = 'panel-pb-umum';
    }
    document.querySelectorAll('#paramBankMode .step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(activePanelId)?.classList.add('active');
  } else if (mode === 'coolingsketch') {
    if (csEl) csEl.style.display = '';
    hTitle.textContent = 'Cooling Sketch';
    hSub.textContent = 'Sketsa Jalur Pendingin Mould';
  } else if (mode === 'reporthistory') {
    if (rhEl) rhEl.style.display = 'block';
    hTitle.textContent = 'Report History';
    hSub.textContent = 'Arsip Laporan MTER';
    renderReportHistory();
  } else if (mode === 'analytics') {
    document.getElementById('analyticsMode').style.display = 'block';
    hTitle.textContent = 'Analisa & Dashboard';
    hSub.textContent = 'Visualisasi Data KPI';
    renderAnalyticsDashboard();
  }

  if (!skipPushState && !['mter', 'parambank'].includes(mode)) {
    history.pushState({ mode: mode }, '', '#' + mode);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderMterMenu() {
  const container = document.getElementById('mterMenuContainer');
  if (!container) return;

  const mterMenuData = [
    {
      title: 'Informasi Umum', items: [
        { label: 'Header Info', id: 'HeaderInfo', panel: 'panel-header-info', bg: '#dcfce7', col: '#16a34a', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
        { label: 'A. Mesin Injeksi', id: 'InjMachine', panel: 'panel-inj-machine', bg: '#dcfce7', col: '#16a34a', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 14v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><circle cx="12" cy="18" r="2"/></svg>' }
      ]
    },
    {
      title: 'B. Mold Mechanism', items: [
        { label: 'B.1 Opening', id: 'B1Opening', panel: 'panel-b1-opening', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' },
        { label: 'B.2 Slider', id: 'B2Slider', panel: 'panel-b2-slider', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
        { label: 'B.3 Ejector', id: 'B3Ejector', panel: 'panel-b3-ejector', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>' },
        { label: 'B.4 Hydraulic', id: 'B4Hydraulic', panel: 'panel-b4-hydraulic', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg>' },
        { label: 'B.5 Cooling', id: 'B5Cooling', panel: 'panel-b5-cooling', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>' },
        { label: 'B.6 Hot Runner', id: 'B6HotRunner', panel: 'panel-b6-hotrunner', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3-3 3 3"/></svg>' },
        { label: 'B.7 Unscrewing', id: 'B7Unscrewing', panel: 'panel-b7-unscrewing', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12a4 4 0 0 0-8 0"/></svg>' },
        { label: 'B.8 Take Out', id: 'B8TakeOut', panel: 'panel-b8-takeout', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5.5"/><polyline points="7 12 3 15 7 18"/><line x1="21" y1="3" x2="16" y2="8"/><line x1="16" y1="3" x2="21" y2="8"/></svg>' },
        { label: 'B.9 Balancing', id: 'B9Balancing', panel: 'panel-b9-balancing', bg: '#f3e8ff', col: '#9333ea', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
      ]
    },
    {
      title: 'Evaluasi Part', items: [
        { label: 'C. Demoulding', id: 'CDemoulding', panel: 'panel-c-demoulding', bg: '#e0f2fe', col: '#0284c7', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>' },
        { label: 'D. Aesthetic', id: 'DAesthetic', panel: 'panel-d-aesthetic', bg: '#e0f2fe', col: '#0284c7', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' },
        { label: 'E. Cavity', id: 'ECavity', panel: 'panel-e-cavity', bg: '#e0f2fe', col: '#0284c7', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="9"/><rect x="14" y="7" width="3" height="5"/></svg>' },
        { label: 'F. Conclusion', id: 'FConclusion', panel: 'panel-f-conclusion', bg: '#e0f2fe', col: '#0284c7', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' }
      ]
    }
  ];

  let html = '';
  mterMenuData.forEach(cat => {
    html += `<div class="mter-menu-category">
      <div class="mter-menu-category-title">${cat.title}</div>
      <div class="mter-grid">`;
    cat.items.forEach(item => {
      const isSaved = state.saved[item.id] || localStorage.getItem(`mter-saved-${item.id}`) === '1';
      html += `
        <div class="mter-item" onclick="showPanel('${item.panel}')">
          <div class="mter-icon-wrap" style="background:${item.bg || ''}; color:${item.col || ''};">
            ${item.icon}
            ${isSaved ? '<div class="mter-check"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
          </div>
          <div class="mter-item-label">${item.label}</div>
        </div>
      `;
    });
    html += `</div></div>`;
  });
  container.innerHTML = html;
}
function renderParamBankMenu() {
  const container = document.getElementById('paramBankMenuContainer');
  if (!container) return;

  const pbMenuData = [
    {
      label: 'Informasi Umum', panel: 'panel-pb-umum', color: '#3b82f6',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    },
    {
      label: 'Material & Berat', panel: 'panel-pb-material', color: '#8b5cf6',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
    },
    {
      label: 'Temperatur (\u00b0C)', panel: 'panel-pb-temp', color: '#06b6d4',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>'
    },
    {
      label: 'Heater Control (\u00b0C)', panel: 'panel-pb-heater', color: '#f59e0b',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
    },
    {
      label: 'Mould Close / Open', panel: 'panel-pb-mouldclose', color: '#10b981',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
    },
    {
      label: 'Injection', panel: 'panel-pb-injection', color: '#ef4444',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>'
    },
    {
      label: 'Holding Pressure', panel: 'panel-pb-holding', color: '#6366f1',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>'
    },
    {
      label: 'Plastifikasi & Melt Decomp', panel: 'panel-pb-plastifikasi', color: '#0ea5e9',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 8v4l3 3"/></svg>'
    },
    {
      label: 'Ejector', panel: 'panel-pb-ejector', color: '#84cc16',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 21 7 17 3"/><line x1="21" y1="7" x2="9" y2="7"/><polyline points="7 21 3 17 7 13"/><line x1="15" y1="17" x2="3" y2="17"/></svg>'
    },
    {
      label: 'Cycle Time & Timing', panel: 'panel-pb-cycletime', color: '#f97316',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    },
  ];

  let html = '<div class="mter-menu-category"><div class="mter-grid">';
  pbMenuData.forEach(item => {
    const panelEl = document.getElementById(item.panel);
    let isFilled = false;
    if (panelEl) {
      // Ambil semua input dan select, abaikan tombol pencarian otomatis atau field tersembunyi
      const inputs = panelEl.querySelectorAll('input:not([type="hidden"]):not([style*="display: none"]), select');
      for (let inp of inputs) {
        // Jika ada value yang bukan string kosong dan bukan value default select
        if (inp.value && inp.value.trim() !== '' && inp.value !== 'tambah_baru') {
          isFilled = true;
          break;
        }
      }
    }

    html += `
      <div class="mter-item" onclick="showPanel('${item.panel}')">
        <div class="mter-icon-wrap" style="background:${item.color}20; color:${item.color};">
          ${item.icon}
          ${isFilled ? '<div class="mter-check"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
        </div>
        <div class="mter-item-label">${item.label}</div>
      </div>
    `;
  });
  html += '</div></div>';
  container.innerHTML = html;
}

function renderReportMenu() {
  const container = document.getElementById('reportMenuContainer');
  if (!container) return;

  const reportMenuData = [
    {
      label: 'Report History\n(Arsip)', mode: 'reporthistory', color: '#3b82f6',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18M3 9h18M3 15h18M3 21h18"/></svg>'
    },
    {
      label: 'Analisa &amp;\nDashboard (KPI)', mode: 'analytics', color: '#10b981',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>'
    },
  ];

  let html = '<div class="mter-menu-category"><div class="mter-grid">';
  reportMenuData.forEach(item => {
    const labelHtml = item.label.replace('\n', '<br>');
    html += `
      <div class="mter-item" onclick="switchMode('${item.mode}')">
        <div class="mter-icon-wrap" style="background:${item.color}20; color:${item.color};">
          ${item.icon}
        </div>
        <div class="mter-item-label">${labelHtml}</div>
      </div>
    `;
  });
  html += '</div></div>';
  container.innerHTML = html;
}


window.addEventListener('popstate', (e) => {
  if (e.state) {
    if (e.state.mode === 'mter' && e.state.panelId) {
      showPanel(e.state.panelId, true);
    } else if (e.state.mode) {
      switchMode(e.state.mode, true);
    }
  } else {
    // If no state exists (e.g. initial load or wiped history), force fallback to home
    switchMode('home', false);
  }
});

// ----------------------------------------------------------------
// REPORT HISTORY RENDER
// ----------------------------------------------------------------
async function renderReportHistory() {
  const listEl = document.getElementById('rhList');
  const emptyEl = document.getElementById('rhEmpty');
  if (!listEl || !emptyEl) return;

  listEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-light);">Memuat laporan dari database...</div>';

  let saved = [];
  try {
    const querySnapshot = await getDocs(collection(db, "reports"));
    querySnapshot.forEach((doc) => {
      saved.push({ id: doc.id, ...doc.data() });
    });
    // Sort descending by date
    saved.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } catch (e) {
    console.error("Firebase fetch reports error:", e);
    showToast('Gagal memuat riwayat laporan.', 'error');
  }

  listEl.innerHTML = '';

  if (saved.length === 0) {
    emptyEl.style.display = 'flex';
  } else {
    emptyEl.style.display = 'none';
    saved.forEach(report => {
      const d = new Date(report.date || Date.now());
      const div = document.createElement('div');
      div.className = 'rh-item';
      let badgeClass = '';
      if (report.judgment === 'REJECTED') badgeClass = ' rh-badge-ng';
      else if (report.judgment === 'CONDITIONAL') badgeClass = ' rh-badge-conditional';
      div.innerHTML = `
        <div class="rh-item-meta"><span class="rh-item-badge${badgeClass}">${report.trialNumber || 'Trial #?'}</span><span class="rh-item-date">${d.toISOString().split('T')[0]}</span></div>
        <div class="rh-item-info"><p class="rh-item-mold">${report.moldCode || 'MOLD-?'} &mdash; ${report.partName || 'Unknown Part'}</p><p class="rh-item-detail">Mesin: ${report.machine || '-'} &bull; Material: ${report.material || '-'} &bull; Judgment: ${report.judgment || 'N/A'}</p></div>
        <div class="rh-item-actions">
          <button class="rh-btn-view" onclick="showToast('Fitur View Report belum tersedia.','info')"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> View</button>
        </div>`;
      listEl.appendChild(div);
    });
  }
}

// ----------------------------------------------------------------
// TOGGLE ITEMS (OK/NG with expandable notes) — generic for all sections except B5
// ----------------------------------------------------------------
function buildToggleItems(containerId, items, stateKey, notesKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  items.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'toggle-item';

    const s = state[stateKey][i] || '';
    const notes = state[notesKey][i] || {};
    const hasData = !!(notes.action || notes.result || notes.remark);

    wrap.innerHTML = `
      <div class="toggle-item-row">
        <div class="ti-label">
          <span class="ti-num">${i + 1}</span>
          <span class="ti-text">${item}</span>
        </div>
        <div class="ti-controls">
          <button class="t-btn ok${s === 'OK' ? ' sel' : ''}" data-val="OK">OK</button>
          <button class="t-btn ng${s === 'NG' ? ' sel' : ''}" data-val="NG">NG</button>
          <button class="t-btn na${s === 'N/A' ? ' sel' : ''}" data-val="N/A">N/A</button>
          <button class="note-icon-btn${hasData ? ' is-open' : ''}" title="Tambah Catatan">${NOTE_SVG}</button>
        </div>
      </div>
      <div class="toggle-notes${hasData ? ' open' : ''}" id="tn-${stateKey}-${i}">
        <div class="notes-inner">
          <div class="note-row"><span class="note-row-label">Action</span><input type="text" placeholder="Tindakan yang dilakukan..." value="${notes.action || ''}" data-field="action"/></div>
          <div class="note-row"><span class="note-row-label">Result</span><input type="text" placeholder="Hasil yang diperoleh..."    value="${notes.result || ''}" data-field="result"/></div>
          <div class="note-row"><span class="note-row-label">Remark</span><input type="text" placeholder="Catatan tambahan..."         value="${notes.remark || ''}" data-field="remark"/></div>
        </div>
      </div>`;

    container.appendChild(wrap);

    wrap.querySelectorAll('.t-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (state[stateKey][i] === val) {
          state[stateKey][i] = '';
          wrap.querySelectorAll('.t-btn').forEach(b => b.classList.remove('sel'));
        } else {
          state[stateKey][i] = val;
          wrap.querySelectorAll('.t-btn').forEach(b => b.classList.remove('sel'));
          btn.classList.add('sel');
        }
        if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
      });
    });

    const noteBtn = wrap.querySelector('.note-icon-btn');
    noteBtn?.addEventListener('click', () => {
      const notesEl = document.getElementById(`tn-${stateKey}-${i}`);
      const isOpen = notesEl?.classList.contains('open');
      if (isOpen) { notesEl?.classList.remove('open'); noteBtn.classList.remove('is-open'); }
      else { notesEl?.classList.add('open'); noteBtn.classList.add('is-open'); setTimeout(() => notesEl?.querySelector('input')?.focus(), 280); }
    });

    wrap.querySelectorAll('.notes-inner input').forEach(inp => {
      inp.addEventListener('input', () => {
        if (!state[notesKey][i]) state[notesKey][i] = {};
        state[notesKey][i][inp.dataset.field] = inp.value;
      });
    });
  });
}

// ----------------------------------------------------------------
// TOGGLE ITEMS (NO/YES with expandable notes) — specialized for Section C
// ----------------------------------------------------------------
function buildToggleItemsNoYes(containerId, items, stateKey, notesKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  items.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'toggle-item';

    const s = state[stateKey][i] || '';
    const notes = state[notesKey][i] || {};
    const hasData = !!(notes.action || notes.result || notes.remark);

    wrap.innerHTML = `
      <div class="toggle-item-row">
        <div class="ti-label">
          <span class="ti-num">${i + 1}</span>
          <span class="ti-text">${item}</span>
        </div>
        <div class="ti-controls">
          <button class="t-btn ok${s === 'YES' ? ' sel' : ''}" data-val="YES">YES</button>
          <button class="t-btn ng${s === 'NO' ? ' sel' : ''}" data-val="NO">NO</button>
          <button class="t-btn na${s === 'N/A' ? ' sel' : ''}" data-val="N/A">N/A</button>
          <button class="note-icon-btn${hasData ? ' is-open' : ''}" title="Tambah Catatan">${NOTE_SVG}</button>
        </div>
      </div>
      <div class="toggle-notes${hasData ? ' open' : ''}" id="tn-${stateKey}-${i}">
        <div class="notes-inner">
          <div class="note-row"><span class="note-row-label">Action</span><input type="text" placeholder="Tindakan yang dilakukan..." value="${notes.action || ''}" data-field="action"/></div>
          <div class="note-row"><span class="note-row-label">Result</span><input type="text" placeholder="Hasil yang diperoleh..."    value="${notes.result || ''}" data-field="result"/></div>
          <div class="note-row"><span class="note-row-label">Remark</span><input type="text" placeholder="Catatan tambahan..."         value="${notes.remark || ''}" data-field="remark"/></div>
        </div>
      </div>`;

    container.appendChild(wrap);

    wrap.querySelectorAll('.t-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (state[stateKey][i] === val) {
          state[stateKey][i] = '';
          wrap.querySelectorAll('.t-btn').forEach(b => b.classList.remove('sel'));
        } else {
          state[stateKey][i] = val;
          wrap.querySelectorAll('.t-btn').forEach(b => b.classList.remove('sel'));
          btn.classList.add('sel');
        }
      if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
      });
    });

    const noteBtn = wrap.querySelector('.note-icon-btn');
    noteBtn?.addEventListener('click', () => {
      const notesEl = document.getElementById(`tn-${stateKey}-${i}`);
      const isOpen = notesEl?.classList.contains('open');
      if (isOpen) { notesEl?.classList.remove('open'); noteBtn.classList.remove('is-open'); }
      else { notesEl?.classList.add('open'); noteBtn.classList.add('is-open'); setTimeout(() => notesEl?.querySelector('input')?.focus(), 280); }
    });

    wrap.querySelectorAll('.notes-inner input').forEach(inp => {
      inp.addEventListener('input', () => {
        if (!state[notesKey][i]) state[notesKey][i] = {};
        state[notesKey][i][inp.dataset.field] = inp.value;
      });
    });
  });
}

// ----------------------------------------------------------------
// B5 SPECIAL BUILDER — handles Nipples Size differently
// ----------------------------------------------------------------
function buildB5CoolingItems() {
  const container = document.getElementById('b5_coolingItems');
  if (!container) return;
  container.innerHTML = '';

  B5_COOLING.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'toggle-item';

    if (item === 'Nipples Size') {
      const notes = state.b5Notes[i] || {};
      const hasData = !!(notes.action || notes.result || notes.remark);
      wrap.innerHTML = `
        <div class="toggle-item-row">
          <div class="ti-label">
            <span class="ti-num">${i + 1}</span>
            <span class="ti-text">${item}</span>
          </div>
          <div class="ti-controls">
            <button class="nipple-btn${state.nippleSize === '1/4"' ? ' sel' : ''}" data-nip='1/4"'>1/4"</button>
            <button class="nipple-btn${state.nippleSize === '3/8"' ? ' sel' : ''}" data-nip='3/8"'>3/8"</button>
            <button class="note-icon-btn${hasData ? ' is-open' : ''}" title="Tambah Catatan">${NOTE_SVG}</button>
          </div>
        </div>
        <div class="toggle-notes${hasData ? ' open' : ''}" id="tn-b5-${i}">
          <div class="notes-inner">
            <div class="note-row"><span class="note-row-label">Action</span><input type="text" placeholder="Tindakan yang dilakukan..." value="${notes.action || ''}" data-field="action"/></div>
            <div class="note-row"><span class="note-row-label">Result</span><input type="text" placeholder="Hasil yang diperoleh..."    value="${notes.result || ''}" data-field="result"/></div>
            <div class="note-row"><span class="note-row-label">Remark</span><input type="text" placeholder="Catatan tambahan..."         value="${notes.remark || ''}" data-field="remark"/></div>
          </div>
        </div>`;
      container.appendChild(wrap);
      wrap.querySelectorAll('.nipple-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.nip;
          if (state.nippleSize === val) {
            state.nippleSize = '';
            wrap.querySelectorAll('.nipple-btn').forEach(b => b.classList.remove('sel'));
          } else {
            state.nippleSize = val;
            wrap.querySelectorAll('.nipple-btn').forEach(b => b.classList.remove('sel'));
            btn.classList.add('sel');
          }
        if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
      });
      });
      const noteBtn = wrap.querySelector('.note-icon-btn');
      noteBtn?.addEventListener('click', () => {
        const notesEl = document.getElementById(`tn-b5-${i}`);
        const isOpen = notesEl?.classList.contains('open');
        if (isOpen) { notesEl?.classList.remove('open'); noteBtn.classList.remove('is-open'); }
        else { notesEl?.classList.add('open'); noteBtn.classList.add('is-open'); setTimeout(() => notesEl?.querySelector('input')?.focus(), 280); }
      });
      wrap.querySelectorAll('.notes-inner input').forEach(inp => {
        inp.addEventListener('input', () => {
          if (!state.b5Notes[i]) state.b5Notes[i] = {};
          state.b5Notes[i][inp.dataset.field] = inp.value;
        });
      });
      return;
    }

    // Normal OK/NG toggle item
    const s = state.b5[i] || '';
    const notes = state.b5Notes[i] || {};
    const hasData = !!(notes.action || notes.result || notes.remark);

    wrap.innerHTML = `
      <div class="toggle-item-row">
        <div class="ti-label">
          <span class="ti-num">${i + 1}</span>
          <span class="ti-text">${item}</span>
        </div>
        <div class="ti-controls">
          <button class="t-btn ok${s === 'OK' ? ' sel' : ''}" data-val="OK">OK</button>
          <button class="t-btn ng${s === 'NG' ? ' sel' : ''}" data-val="NG">NG</button>
          <button class="t-btn na${s === 'N/A' ? ' sel' : ''}" data-val="N/A">N/A</button>
          <button class="note-icon-btn${hasData ? ' is-open' : ''}" title="Tambah Catatan">${NOTE_SVG}</button>
        </div>
      </div>
      <div class="toggle-notes${hasData ? ' open' : ''}" id="tn-b5-${i}">
        <div class="notes-inner">
          <div class="note-row"><span class="note-row-label">Action</span><input type="text" placeholder="Tindakan yang dilakukan..." value="${notes.action || ''}" data-field="action"/></div>
          <div class="note-row"><span class="note-row-label">Result</span><input type="text" placeholder="Hasil yang diperoleh..."    value="${notes.result || ''}" data-field="result"/></div>
          <div class="note-row"><span class="note-row-label">Remark</span><input type="text" placeholder="Catatan tambahan..."         value="${notes.remark || ''}" data-field="remark"/></div>
        </div>
      </div>`;

    container.appendChild(wrap);

    wrap.querySelectorAll('.t-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (state.b5[i] === val) {
          state.b5[i] = '';
          wrap.querySelectorAll('.t-btn').forEach(b => b.classList.remove('sel'));
        } else {
          state.b5[i] = val;
          wrap.querySelectorAll('.t-btn').forEach(b => b.classList.remove('sel'));
          btn.classList.add('sel');
        }
      if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
      });
    });

    const noteBtn = wrap.querySelector('.note-icon-btn');
    noteBtn?.addEventListener('click', () => {
      const notesEl = document.getElementById(`tn-b5-${i}`);
      const isOpen = notesEl?.classList.contains('open');
      if (isOpen) { notesEl?.classList.remove('open'); noteBtn.classList.remove('is-open'); }
      else { notesEl?.classList.add('open'); noteBtn.classList.add('is-open'); setTimeout(() => notesEl?.querySelector('input')?.focus(), 280); }
    });

    wrap.querySelectorAll('.notes-inner input').forEach(inp => {
      inp.addEventListener('input', () => {
        if (!state.b5Notes[i]) state.b5Notes[i] = {};
        state.b5Notes[i][inp.dataset.field] = inp.value;
      });
    });
  });
}

// ----------------------------------------------------------------
// DYNAMIC B5 COOLING ZONES
// ----------------------------------------------------------------
function addB5Zone() {
  state.b5ZonesCount++;
  state.b5ZonesData.push({ inTemp: '', outTemp: '', flow: '', remark: '' });
  renderB5Zones();
  if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
}

function removeB5Zone() {
  if (state.b5ZonesCount > 1) {
    state.b5ZonesCount--;
    state.b5ZonesData.pop();
    renderB5Zones();
    if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
  }
}

function renderB5Zones() {
  const container = document.getElementById('b5_dynamicZones');
  if (!container) return;

  if (state.b5ZonesData.length < state.b5ZonesCount) {
    for (let i = state.b5ZonesData.length; i < state.b5ZonesCount; i++) {
      state.b5ZonesData.push({ inTemp: '', outTemp: '', flow: '', remark: '' });
    }
  }

  let html = '';
  for (let i = 0; i < state.b5ZonesCount; i++) {
    const d = state.b5ZonesData[i];
    html += `
      <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px;">
        <h5 style="margin-top: 0; margin-bottom: 12px; font-size: 0.85rem; color: var(--text-dark);">Zona ${i + 1}</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
          <div class="form-group mb-0">
            <label class="form-label" style="font-size: 0.75rem;">IN Temp (°C)</label>
            <input type="number" class="form-input" style="padding: 6px; font-size: 0.8rem;" oninput="state.b5ZonesData[${i}].inTemp = this.value" value="${d.inTemp || ''}" placeholder="0" />
          </div>
          <div class="form-group mb-0">
            <label class="form-label" style="font-size: 0.75rem;">OUT Temp (°C)</label>
            <input type="number" class="form-input" style="padding: 6px; font-size: 0.8rem;" oninput="state.b5ZonesData[${i}].outTemp = this.value" value="${d.outTemp || ''}" placeholder="0" />
          </div>
          <div class="form-group mb-0">
            <label class="form-label" style="font-size: 0.75rem;">Flow (L/min)</label>
            <input type="number" class="form-input" style="padding: 6px; font-size: 0.8rem;" oninput="state.b5ZonesData[${i}].flow = this.value" value="${d.flow || ''}" placeholder="0" />
          </div>
          <div class="form-group mb-0">
            <label class="form-label" style="font-size: 0.75rem;">Remark</label>
            <input type="text" class="form-input" style="padding: 6px; font-size: 0.8rem;" oninput="state.b5ZonesData[${i}].remark = this.value" value="${d.remark || ''}" placeholder="..." />
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

// ----------------------------------------------------------------
// CAVITY LAYOUT — redesigned to match toggle-item style
// ----------------------------------------------------------------
function renderCavityList() {
  const container = document.getElementById('cavityList');
  if (!container) return;
  container.innerHTML = '';

  state.cavities.forEach((cav, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'toggle-item';
    const isNG = cav.status === 'ng';
    const hasData = !!(cav.action || cav.result || cav.remark);
    const notesOpen = isNG || hasData;

    wrap.innerHTML = `
      <div class="toggle-item-row">
        <div class="ti-label">
          <span class="ti-num" style="border-radius:var(--r-sm);font-size:.65rem;width:26px;height:22px;">C${i + 1}</span>
          <span class="ti-text" style="font-weight:600;">Cavity ${i + 1}</span>
        </div>
        <div class="ti-controls">
          <button class="cav-tok${cav.status === 'ok' ? ' ok-sel' : ''}" data-s="ok">OK</button>
          <button class="cav-tok${cav.status === 'ng' ? ' ng-sel' : ''}" data-s="ng">NG</button>
          <button class="cav-tok${cav.status === 'na' ? ' na-sel' : ''}" data-s="na">N/A</button>
          <button class="note-icon-btn${notesOpen ? ' is-open' : ''}" title="Tambah Catatan">${NOTE_SVG}</button>
        </div>
      </div>
      <div class="toggle-notes${notesOpen ? ' open' : ''}" id="cav-notes-${i}">
        <div class="notes-inner">
          <div class="note-row"><span class="note-row-label">Action</span><input type="text" placeholder="Tindakan yang dilakukan..." value="${cav.action || ''}" data-field="action"/></div>
          <div class="note-row"><span class="note-row-label">Result</span><input type="text" placeholder="Hasil yang diperoleh..."    value="${cav.result || ''}" data-field="result"/></div>
          <div class="note-row"><span class="note-row-label">Remark</span><input type="text" placeholder="Catatan tambahan..."         value="${cav.remark || ''}" data-field="remark"/></div>
        </div>
      </div>`;

    container.appendChild(wrap);

    // Status toggle
    wrap.querySelectorAll('.cav-tok').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.s;
        if (state.cavities[i].status === val) {
          state.cavities[i].status = '';
        } else {
          state.cavities[i].status = val;
        }
        // Update DOM for this row only to preserve focus
        wrap.querySelectorAll('.cav-tok').forEach(b => {
          b.className = 'cav-tok';
          if (b.dataset.s === 'ok' && state.cavities[i].status === 'ok') b.classList.add('ok-sel');
          if (b.dataset.s === 'ng' && state.cavities[i].status === 'ng') b.classList.add('ng-sel');
          if (b.dataset.s === 'na' && state.cavities[i].status === 'na') b.classList.add('na-sel');
        });
        if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
      });
    });

    // Notes toggle
    const noteBtn = wrap.querySelector('.note-icon-btn');
    noteBtn?.addEventListener('click', () => {
      const notesEl = document.getElementById(`cav-notes-${i}`);
      const isOpen = notesEl?.classList.contains('open');
      if (isOpen) { notesEl?.classList.remove('open'); noteBtn.classList.remove('is-open'); }
      else { notesEl?.classList.add('open'); noteBtn.classList.add('is-open'); setTimeout(() => notesEl?.querySelector('input')?.focus(), 280); }
    });

    // Save note fields to state
    wrap.querySelectorAll('.notes-inner input').forEach(inp => {
      inp.addEventListener('input', () => {
        state.cavities[i][inp.dataset.field] = inp.value;
      });
    });
  });
}

// ----------------------------------------------------------------
// SAVE SECTION
// ----------------------------------------------------------------
function saveSection(key) {
  state.saved[key] = true;
  localStorage.setItem(`mter-saved-${key}`, '1');

  const btn = document.querySelector(`[data-save-section="${key}"]`);
  if (btn) {
    const orig = btn.innerHTML;
    btn.classList.add('saved');
    btn.innerHTML = `${CHECK_SVG} Tersimpan!`;
    setTimeout(() => { btn.classList.remove('saved'); btn.innerHTML = orig; }, 2200);
  }
  showToast(`Section ${key} berhasil disimpan!`, 'success');
}

// ----------------------------------------------------------------
// RADIO GROUP
// ----------------------------------------------------------------
function initRadioGroup(groupId, stateKey) {
  const grp = document.getElementById(groupId);
  if (!grp) return;
  grp.querySelectorAll('.radio-btn').forEach(btn => {
    if (btn.dataset.val === state[stateKey]) btn.classList.add('sel');
    btn.addEventListener('click', () => {
      state[stateKey] = btn.dataset.val;
      grp.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
    });
  });
}

// ----------------------------------------------------------------
// DYNAMIC MOULD DROPDOWN (localStorage CRUD)
// ----------------------------------------------------------------
const MOULD_LS_KEY = 'mter-mould-list';

async function getMouldList() {
  try {
    const docSnap = await getDoc(doc(db, "moulds", "data"));
    if (docSnap.exists()) return docSnap.data().list || [];
    return [];
  } catch (e) {
    console.error("Firebase getMouldList Error:", e);
    return [];
  }
}

async function saveMouldList(list) {
  try {
    await setDoc(doc(db, "moulds", "data"), { list: list });
  } catch (e) {
    console.error("Firebase saveMouldList Error:", e);
  }
}

async function renderMouldSelect(selectValue) {
  const sel = document.getElementById('pb_mould');
  if (!sel) return;
  const list = await getMouldList();
  const curr = selectValue !== undefined ? selectValue : sel.value;
  sel.innerHTML = '<option value="">-- Pilih Mould --</option>';
  list.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    if (m === curr) opt.selected = true;
    sel.appendChild(opt);
  });
  // Always-last static option
  const addOpt = document.createElement('option');
  addOpt.value = 'tambah_baru';
  addOpt.textContent = '[+] Tambah Mould Baru...';
  sel.appendChild(addOpt);
}

async function initMouldDropdown() {
  await renderMouldSelect('');
  const sel = document.getElementById('pb_mould');
  if (!sel) return;
  sel.addEventListener('change', async () => {
    if (sel.value !== 'tambah_baru') return;
    const name = prompt('Masukkan nama Mould baru:')?.trim();
    if (!name) { await renderMouldSelect(''); return; }
    sel.disabled = true;
    showToast('Menyimpan...', 'info');
    const list = await getMouldList();
    if (list.includes(name)) { showToast('Nama Mould sudah ada.', 'info'); await renderMouldSelect(name); sel.disabled = false; return; }
    list.push(name);
    await saveMouldList(list);
    await renderMouldSelect(name);
    sel.disabled = false;
    showToast(`Mould "${name}" berhasil ditambahkan!`, 'success');
  });

  const delBtn = document.getElementById('pb_mould_del');
  if (!delBtn) return;
  delBtn.addEventListener('click', async () => {
    const val = document.getElementById('pb_mould')?.value;
    if (!val || val === '' || val === 'tambah_baru') {
      showToast('Pilih Mould yang ingin dihapus terlebih dahulu.', 'info'); return;
    }
    if (!confirm(`Hapus Mould "${val}" dari daftar?`)) return;
    delBtn.disabled = true;
    showToast('Menghapus...', 'info');
    const list = (await getMouldList()).filter(m => m !== val);
    await saveMouldList(list);
    await renderMouldSelect('');
    delBtn.disabled = false;
    showToast(`Mould "${val}" berhasil dihapus.`, 'success');
  });
}

// ----------------------------------------------------------------
// PARAMETER BANK KEY
// ----------------------------------------------------------------
function getPBKey() {
  const machine = document.getElementById('pb_machine')?.value;
  const machCust = document.getElementById('pb_machine_custom')?.value;
  const mould = document.getElementById('pb_mould')?.value;
  const material = document.getElementById('pb_material')?.value;
  const matCust = document.getElementById('pb_material_custom')?.value;
  const mach = machine === 'Lainnya' ? machCust : machine;
  const mat = material === 'Lainnya' ? matCust : material;
  if (!mach || !mould || !mat) return null;
  const s = str => str.replace(/[^a-zA-Z0-9\-_]/g, '_');
  return `paramBank_${s(mach)}_${s(mould)}_${s(mat)}`;
}

// ----------------------------------------------------------------
// DYNAMIC MOULD CLOSE / OPEN
// ----------------------------------------------------------------
let mouldCloseRows = 3;
let mouldOpenRows = 3;

function pbAddMouldRow(type) {
  if (type === 'close') mouldCloseRows++;
  else mouldOpenRows++;
  renderMouldRows(type);
}

function pbRemoveMouldRow(type) {
  if (type === 'close' && mouldCloseRows > 1) mouldCloseRows--;
  else if (type === 'open' && mouldOpenRows > 1) mouldOpenRows--;
  renderMouldRows(type);
}

function renderMouldRows(type) {
  const tbody = document.getElementById(`tbody-mould-${type}`);
  if (!tbody) return;
  const count = type === 'close' ? mouldCloseRows : mouldOpenRows;
  const label = type === 'close' ? 'CL' : 'OP';
  const labelTxt = type === 'close' ? 'CLOSE' : 'OPEN';

  let html = `<tr class="pb-group-header">
                <td colspan="3">
                  <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-start;">
                    <span>${labelTxt}</span>
                    <button type="button" class="pb-btn-add-outline" onclick="pbAddMouldRow('${type}')">+ Tambah ${label}</button>
                    <button type="button" class="pb-btn-remove-outline" onclick="pbRemoveMouldRow('${type}')">- Kurangi ${label}</button>
                  </div>
                </td>
              </tr>`;

  for (let i = 1; i <= count; i++) {
    html += `<tr>
                <td class="pb-td-label">${label} ${i}</td>
                <td><input type="number" class="pb-input-sm" id="pb_${type}_sp_${i}" placeholder="0" /></td>
                <td><input type="number" class="pb-input-sm" id="pb_${type}_pos_${i}" placeholder="0" /></td>
              </tr>`;
  }
  tbody.innerHTML = html;
}

// ----------------------------------------------------------------
// CANVAS DRAWING — Cooling Layout Sketch
// ----------------------------------------------------------------
let canvasHistory = [];
let canvasIsDrawing = false;
let canvasIsPanning = false;
let canvasStartX = 0;
let canvasStartY = 0;
let canvasSnapshot = null;

let canvasTransform = { scale: 1, offsetX: 0, offsetY: 0 };
let mainOffscreenCanvas = null;

function initCoolingCanvas() {
  const canvas = document.getElementById('coolingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  mainOffscreenCanvas = document.createElement('canvas');
  mainOffscreenCanvas.width = canvas.width;
  mainOffscreenCanvas.height = canvas.height;
  const offCtx = mainOffscreenCanvas.getContext('2d');
  if (!offCtx) return;
  offCtx.fillStyle = '#ffffff';
  offCtx.fillRect(0, 0, canvas.width, canvas.height);

  window.saveCanvasDraft = function() {
    try {
      localStorage.setItem('mter_sketch_draft', canvas.toDataURL());
    } catch (e) { console.error('Save sketch error:', e); }
  };

  const draftImgData = localStorage.getItem('mter_sketch_draft');
  if (draftImgData) {
    const draftImg = new Image();
    draftImg.onload = () => {
      offCtx.clearRect(0, 0, canvas.width, canvas.height);
      offCtx.drawImage(draftImg, 0, 0);
      redrawToScreen();
    };
    draftImg.src = draftImgData;
  }

  window.loadSketchToCanvas = function (base64) {
    const img = new Image();
    img.onload = () => {
      offCtx.clearRect(0, 0, canvas.width, canvas.height);
      offCtx.drawImage(img, 0, 0);
      canvasHistory = []; // Reset history after load
      redrawToScreen();
    };
    img.src = base64;
  };

  window.getSketchBase64 = function () {
    return mainOffscreenCanvas ? mainOffscreenCanvas.toDataURL('image/png') : '';
  };

  function cloneOffscreen(source) {
    const clone = document.createElement('canvas');
    clone.width = source.width;
    clone.height = source.height;
    clone.getContext('2d').drawImage(source, 0, 0);
    return clone;
  }

  function redrawToScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvasTransform.offsetX, canvasTransform.offsetY);
    ctx.scale(canvasTransform.scale, canvasTransform.scale);
    ctx.drawImage(mainOffscreenCanvas, 0, 0);
    ctx.restore();
  }

  redrawToScreen();

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let cx, cy;
    if (e.touches && e.touches.length > 0) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }
    const logicalX = (cx - rect.left) * scaleX;
    const logicalY = (cy - rect.top) * scaleY;

    return {
      x: (logicalX - canvasTransform.offsetX) / canvasTransform.scale,
      y: (logicalY - canvasTransform.offsetY) / canvasTransform.scale
    };
  }

  function getTool() {
    const activeBtn = document.querySelector('.canvas-tool-btn.active');
    return activeBtn ? activeBtn.dataset.tool : 'pencil';
  }
  function getColor() { return document.getElementById('canvasColor')?.value || '#1e40af'; }
  function getWidth() { return parseInt(document.getElementById('canvasLineWidth')?.value || '2', 10); }
  function saveSnapshot() { canvasHistory.push(cloneOffscreen(mainOffscreenCanvas)); }

  let lastDist = 0;
  let lastPan = { x: 0, y: 0 };

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      if (e.cancelable) e.preventDefault();
      canvasIsDrawing = false;
      canvasIsPanning = true;
      lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      lastPan = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2 };
      return;
    }
    if (e.touches.length === 1 && !canvasIsPanning) {
      startDraw(e);
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2 && canvasIsPanning) {
      if (e.cancelable) e.preventDefault();
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const pan = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2 };

      if (lastDist > 0) {
        const zoomDelta = dist / lastDist;
        const oldScale = canvasTransform.scale;
        let newScale = oldScale * zoomDelta;
        newScale = Math.min(Math.max(0.5, newScale), 5);

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const logicalCx = (pan.x - rect.left) * scaleX;
        const logicalCy = (pan.y - rect.top) * scaleY;

        canvasTransform.offsetX = logicalCx - (logicalCx - canvasTransform.offsetX) * (newScale / oldScale);
        canvasTransform.offsetY = logicalCy - (logicalCy - canvasTransform.offsetY) * (newScale / oldScale);
        canvasTransform.scale = newScale;
      }

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      canvasTransform.offsetX += (pan.x - lastPan.x) * scaleX;
      canvasTransform.offsetY += (pan.y - lastPan.y) * scaleY;

      lastDist = dist;
      lastPan = pan;
      redrawToScreen();
      return;
    }
    if (e.touches.length === 1 && !canvasIsPanning) {
      draw(e);
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length < 2) {
      canvasIsPanning = false;
      lastDist = 0;
    }
    if (e.touches.length === 0) {
      endDraw(e);
    }
  }

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const oldScale = canvasTransform.scale;
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    let newScale = oldScale * zoomDelta;
    newScale = Math.min(Math.max(0.5, newScale), 5);

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const logicalCx = (e.clientX - rect.left) * scaleX;
    const logicalCy = (e.clientY - rect.top) * scaleY;

    canvasTransform.offsetX = logicalCx - (logicalCx - canvasTransform.offsetX) * (newScale / oldScale);
    canvasTransform.offsetY = logicalCy - (logicalCy - canvasTransform.offsetY) * (newScale / oldScale);
    canvasTransform.scale = newScale;
    redrawToScreen();
  }, { passive: false });

  function setupCtx(context) {
    context.strokeStyle = getColor();
    context.lineWidth = getWidth();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    if (getTool() === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
    } else {
      context.globalCompositeOperation = 'source-over';
    }
  }

  function startDraw(e) {
    if (e.cancelable) e.preventDefault();
    canvasIsDrawing = true;
    const pos = getPos(e);
    canvasStartX = pos.x;
    canvasStartY = pos.y;
    saveSnapshot();
    canvasSnapshot = cloneOffscreen(mainOffscreenCanvas);

    setupCtx(offCtx);
    if (getTool() === 'pencil' || getTool() === 'eraser') {
      offCtx.beginPath();
      offCtx.moveTo(pos.x, pos.y);
    }
  }

  function draw(e) {
    if (!canvasIsDrawing) return;
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    const tool = getTool();
    setupCtx(offCtx);

    if (tool === 'pencil' || tool === 'eraser') {
      offCtx.lineTo(pos.x, pos.y);
      offCtx.stroke();
    } else {
      offCtx.globalCompositeOperation = 'source-over';
      offCtx.clearRect(0, 0, canvas.width, canvas.height);
      offCtx.drawImage(canvasSnapshot, 0, 0);
      setupCtx(offCtx);

      offCtx.beginPath();
      if (tool === 'line') {
        offCtx.moveTo(canvasStartX, canvasStartY);
        offCtx.lineTo(pos.x, pos.y);
        offCtx.stroke();
      } else if (tool === 'rect') {
        offCtx.strokeRect(canvasStartX, canvasStartY, pos.x - canvasStartX, pos.y - canvasStartY);
      } else if (tool === 'circle') {
        const rx = (pos.x - canvasStartX) / 2;
        const ry = (pos.y - canvasStartY) / 2;
        const cx = canvasStartX + rx;
        const cy = canvasStartY + ry;
        offCtx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
        offCtx.stroke();
      }
    }
    redrawToScreen();
  }

  function endDraw(e) {
    if (!canvasIsDrawing) return;
    if (e.cancelable) e.preventDefault();
    canvasIsDrawing = false;
    const tool = getTool();
    if (tool === 'pencil' || tool === 'eraser') {
      offCtx.closePath();
    }
    offCtx.globalCompositeOperation = 'source-over';
    redrawToScreen();
    if (typeof saveCanvasDraft === 'function') saveCanvasDraft();
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);

  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

  document.getElementById('canvasUndo')?.addEventListener('click', () => {
    if (canvasHistory.length > 0) {
      offCtx.clearRect(0, 0, canvas.width, canvas.height);
      offCtx.drawImage(canvasHistory.pop(), 0, 0);
      redrawToScreen();
      if (typeof saveCanvasDraft === 'function') saveCanvasDraft();
    } else {
      showToast('Tidak ada yang bisa di-undo.', 'info');
    }
  });

  const toolBtns = document.querySelectorAll('.canvas-tool-btn');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('canvasClear')?.addEventListener('click', () => {
    saveSnapshot();
    offCtx.fillStyle = '#ffffff';
    offCtx.fillRect(0, 0, canvas.width, canvas.height);
    redrawToScreen();
    if (typeof saveCanvasDraft === 'function') saveCanvasDraft();
    showToast('Canvas dikosongkan.', 'info');
  });

  document.getElementById('canvasResetView')?.addEventListener('click', () => {
    canvasTransform = { scale: 1, offsetX: 0, offsetY: 0 };
    redrawToScreen();
  });

  document.getElementById('canvasLineWidth')?.addEventListener('input', function () {
    const d = document.getElementById('canvasLineWidthDisplay');
    if (d) d.textContent = this.value;
  });

  document.getElementById('saveSketchBtn')?.addEventListener('click', async () => {
    const key = getPBKey();
    if (!key) { showToast('Pilih Mesin, Mould, dan Material terlebih dahulu (di tab Parameter Bank)!', 'error'); return; }

    showToast('Menyimpan sketsa...', 'info');
    try {
      const docRef = doc(db, "parameters", key);
      const docSnap = await getDoc(docRef);
      let pbData = docSnap.exists() ? docSnap.data() : {};

      pbData.canvasSketch = mainOffscreenCanvas.toDataURL('image/png');
      await setDoc(docRef, pbData);
      showToast('Sketsa Cooling Layout berhasil disimpan!', 'success');
    } catch (e) {
      console.error("Firebase saveSketch Error:", e);
      showToast('Gagal menyimpan sketsa.', 'error');
    }
  });
}

async function saveParamBank() {
  const key = getPBKey();
  if (!key) { showToast('Pilih Mesin, Mould, dan Material terlebih dahulu!', 'error'); return; }
  const data = {};
  PB_FIELD_IDS.forEach(id => { const el = document.getElementById(id); data[id] = el ? el.value : ''; });

  // Save dynamic rows
  data.mouldCloseRows = mouldCloseRows;
  data.mouldOpenRows = mouldOpenRows;
  data.mouldCloseData = [];
  data.mouldOpenData = [];

  for (let i = 1; i <= mouldCloseRows; i++) {
    data.mouldCloseData.push({
      sp: document.getElementById(`pb_close_sp_${i}`)?.value || '',
      pos: document.getElementById(`pb_close_pos_${i}`)?.value || ''
    });
  }

  for (let i = 1; i <= mouldOpenRows; i++) {
    data.mouldOpenData.push({
      sp: document.getElementById(`pb_open_sp_${i}`)?.value || '',
      pos: document.getElementById(`pb_open_pos_${i}`)?.value || ''
    });
  }

  // Save B5 zones
  data.b5ZonesCount = state.b5ZonesCount;
  data.b5ZonesData = state.b5ZonesData;

  // Save canvas sketch as Base64
  const canvas = document.getElementById('coolingCanvas');
  if (canvas) data.canvasSketch = canvas.toDataURL('image/png');

  showToast('Menyimpan parameter...', 'info');
  const btn = document.getElementById('pb_saveBtn');
  if (btn) btn.disabled = true;
  try {
    await setDoc(doc(db, "parameters", key), data);
    showToast('Parameter berhasil disimpan!', 'success');
  } catch (e) {
    console.error("Firebase saveParamBank Error:", e);
    showToast('Gagal menyimpan parameter.', 'error');
  }
  if (btn) btn.disabled = false;
}

async function loadParamBank() {
  const key = getPBKey();
  if (!key) { showToast('Pilih Mesin, Mould, dan Material terlebih dahulu!', 'error'); return; }

  showToast('Memuat data parameter...', 'info');
  const btn = document.getElementById('pb_loadBtn');
  if (btn) btn.disabled = true;
  try {
    const docSnap = await getDoc(doc(db, "parameters", key));
    if (!docSnap.exists()) {
      PB_FIELD_IDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      mouldCloseRows = 3; mouldOpenRows = 3;
      renderMouldRows('close'); renderMouldRows('open');
      
      if (currentMode === 'parambankmenu') {
        renderParamBankMenu();
      }
      
      showToast('Data parameter belum tersedia untuk kombinasi ini.', 'info');
      if (btn) btn.disabled = false;
      return;
    }

    const data = docSnap.data();
    PB_FIELD_IDS.forEach(id => { const el = document.getElementById(id); if (el && data[id] !== undefined) el.value = data[id]; });

    // Load dynamic rows
    mouldCloseRows = data.mouldCloseRows || 3;
    mouldOpenRows = data.mouldOpenRows || 3;
    renderMouldRows('close');
    renderMouldRows('open');

    if (data.mouldCloseData) {
      for (let i = 1; i <= mouldCloseRows; i++) {
        const rowData = data.mouldCloseData[i - 1];
        if (rowData) {
          const spEl = document.getElementById(`pb_close_sp_${i}`);
          const posEl = document.getElementById(`pb_close_pos_${i}`);
          if (spEl) spEl.value = rowData.sp;
          if (posEl) posEl.value = rowData.pos;
        }
      }
    }

    if (data.mouldOpenData) {
      for (let i = 1; i <= mouldOpenRows; i++) {
        const rowData = data.mouldOpenData[i - 1];
        if (rowData) {
          const spEl = document.getElementById(`pb_open_sp_${i}`);
          const posEl = document.getElementById(`pb_open_pos_${i}`);
          if (spEl) spEl.value = rowData.sp;
          if (posEl) posEl.value = rowData.pos;
        }
      }
    }

    // Load B5 zones
    if (data.b5ZonesData) {
      state.b5ZonesCount = data.b5ZonesCount || 4;
      state.b5ZonesData = data.b5ZonesData;
      renderB5Zones();
    }

    // Load canvas sketch from Base64
    if (data.canvasSketch && typeof window.loadSketchToCanvas === 'function') {
      window.loadSketchToCanvas(data.canvasSketch);
    }

    if (currentMode === 'parambankmenu') {
      renderParamBankMenu();
    }
    showToast('Parameter berhasil dimuat!', 'success');
  } catch (e) {
    console.error("Firebase loadParamBank Error:", e);
    showToast('Gagal membaca data parameter.', 'error');
  }
  if (btn) btn.disabled = false;
}

// ----------------------------------------------------------------
// TOAST
// ----------------------------------------------------------------
function showToast(msg, type = 'info') {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(() => t.parentNode?.removeChild(t), 3100);
}

async function saveChecksheet() {
  const v = id => document.getElementById(id)?.value || '-';
  showToast('Menyimpan laporan ke Cloud...', 'info');

  const reportData = {
    date: document.getElementById('hi_date')?.value || new Date().toISOString().split('T')[0],
    trialNumber: document.getElementById('hi_trialNumber')?.value || '',
    moldCode: document.getElementById('hi_moldCode')?.value || '',
    partName: document.getElementById('hi_partName')?.value || '',
    machine: document.getElementById('pb_machine')?.value || '',
    material: document.getElementById('pb_material')?.value || '',
    judgment: state.moldStatus || 'N/A',
    createdAt: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, "reports"), reportData);
    localStorage.removeItem('mter_draft');
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('mter-saved-')) {
        localStorage.removeItem(key);
      }
    });
    state.saved = {};
    
    showToast('Laporan berhasil disimpan ke Cloud!', 'success');
  } catch (e) {
    console.error("Firebase saveChecksheet Error:", e);
    showToast('Gagal menyimpan laporan.', 'error');
  }
}

// ----------------------------------------------------------------
// EXPORT PDF — Full Report
// ----------------------------------------------------------------
function exportReport(action = 'download') {
  showToast(action === 'view' ? 'Menyiapkan pratinjau PDF...' : 'Menyiapkan PDF...', 'info');
  const el = document.getElementById('printLayout');
  if (!el) return;

  const v = id => document.getElementById(id)?.value || '-';

  // Collect canvas sketch
  const canvas = document.getElementById('coolingCanvas');
  const canvasDataUrl = typeof window.getSketchBase64 === 'function' ? window.getSketchBase64() : (canvas ? canvas.toDataURL('image/png') : '');
  const canvasImgHtml = canvasDataUrl ? `<img src="${canvasDataUrl}" style="max-width:100%; border:1px solid #e5e7eb; border-radius:6px; margin-top:8px;" />` : '<em style="color:#9ca3af;">Tidak ada sketsa.</em>';

  // Helper: render toggle-state badge
  const badge = (val) => {
    if (val === 'OK') return `<span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:4px;font-weight:700;">OK</span>`;
    if (val === 'NG') return `<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:4px;font-weight:700;">NG</span>`;
    if (val === 'YES') return `<span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:4px;font-weight:700;">YES</span>`;
    if (val === 'NO') return `<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-weight:700;">NO</span>`;
    if (val === 'N/A' || val === 'na') return `<span style="background:#f3f4f6;color:#4b5563;padding:2px 8px;border-radius:4px;font-weight:700;">N/A</span>`;
    return `<span style="color:#9ca3af;">-</span>`;
  };

  // Helper: build toggle-item rows for a section
  const buildToggleRows = (items, stateObj, notesObj) => {
    return items.map((item, i) => {
      const s = stateObj[i] || '';
      const n = notesObj[i] || {};
      const notes = [n.action ? `Action: ${n.action}` : '', n.result ? `Result: ${n.result}` : '', n.remark ? `Remark: ${n.remark}` : ''].filter(Boolean).join(' | ');
      return `<tr>
        <td style="width:32px;text-align:center;color:#6b7280;">${i + 1}</td>
        <td>${item}</td>
        <td style="text-align:center;">${badge(s)}</td>
        <td style="color:#6b7280;font-size:.8rem;">${notes || '-'}</td>
      </tr>`;
    }).join('');
  };

  // Helper: build NO/YES rows for section C
  const buildToggleRowsNY = (items, stateObj, notesObj) => {
    return items.map((item, i) => {
      const s = stateObj[i] || '';
      const n = notesObj[i] || {};
      const notes = [n.action ? `Action: ${n.action}` : '', n.result ? `Result: ${n.result}` : '', n.remark ? `Remark: ${n.remark}` : ''].filter(Boolean).join(' | ');
      return `<tr>
        <td style="width:32px;text-align:center;color:#6b7280;">${i + 1}</td>
        <td>${item}</td>
        <td style="text-align:center;">${badge(s)}</td>
        <td style="color:#6b7280;font-size:.8rem;">${notes || '-'}</td>
      </tr>`;
    }).join('');
  };

  // Mould Close / Open rows
  const closeRows = Array.from({ length: mouldCloseRows }, (_, i) => {
    const sp = document.getElementById(`pb_close_sp_${i + 1}`)?.value || '-';
    const pos = document.getElementById(`pb_close_pos_${i + 1}`)?.value || '-';
    return `<tr><td>CL ${i + 1}</td><td>${sp}</td><td>${pos}</td></tr>`;
  }).join('');
  const openRows = Array.from({ length: mouldOpenRows }, (_, i) => {
    const sp = document.getElementById(`pb_open_sp_${i + 1}`)?.value || '-';
    const pos = document.getElementById(`pb_open_pos_${i + 1}`)?.value || '-';
    return `<tr><td>OP ${i + 1}</td><td>${sp}</td><td>${pos}</td></tr>`;
  }).join('');

  // B5 Cooling Zone rows
  const b5ZoneRows = state.b5ZonesData.slice(0, state.b5ZonesCount).map((z, i) => `
    <tr>
      <td>Zona ${i + 1}</td>
      <td>${z.inTemp || '-'}</td>
      <td>${z.outTemp || '-'}</td>
      <td>${z.flow || '-'}</td>
      <td>${z.remark || '-'}</td>
    </tr>`).join('');

  // Cavity rows
  const cavityRows = state.cavities.map((cav, i) => {
    const statusLabel = cav.status === 'ok' ? `<span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:4px;font-weight:700;">OK</span>` :
      cav.status === 'ng' ? `<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:4px;font-weight:700;">NG</span>` : '-';
    return `<tr>
      <td style="text-align:center;">C${i + 1}</td>
      <td style="text-align:center;">${statusLabel}</td>
      <td>${cav.action || '-'}</td>
      <td>${cav.result || '-'}</td>
      <td>${cav.remark || '-'}</td>
    </tr>`;
  }).join('');

  const sec = (title) => `<div class="print-sec-title">${title}</div>`;
  const tblHead = (...cols) => `<thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;

  el.innerHTML = `<div class="print-page">
    <!-- HEADER -->
    <div class="print-header">
      <div class="print-header-left">
        <img class="print-logo" src="Logo.png" alt="ALBEA" onerror="this.style.display='none'"/>
        <div class="print-title"><h1>Mold Trial Evaluation Report</h1><p>MTER Smart Checksheet v5.0</p></div>
      </div>
      <div class="print-doc-num">
        <div><strong>Date:</strong> ${new Date().toLocaleDateString('id-ID')}</div>
        <div><strong>Trial No:</strong> ${v('hi_trialNumber')}</div>
      </div>
    </div>

    <!-- HEADER INFORMASI -->
    <div class="print-section-wrap">
      ${sec('Header Informasi')}
      <table class="print-table">${tblHead('Field', 'Value')}<tbody>
        <tr><td class="pb-td-label">Trial Number</td><td>${v('hi_trialNumber')}</td></tr>
        <tr><td class="pb-td-label">Date</td><td>${v('hi_date')}</td></tr>
        <tr><td class="pb-td-label">Prepared</td><td>${v('hi_prepared')}</td></tr>
        <tr><td class="pb-td-label">Reviewed</td><td>${v('hi_reviewed')}</td></tr>
        <tr><td class="pb-td-label">Approved</td><td>${v('hi_approved')}</td></tr>
        <tr><td class="pb-td-label">Product Code</td><td>${v('hi_productCode')}</td></tr>
        <tr><td class="pb-td-label">Mold Code</td><td>${v('hi_moldCode')}</td></tr>
        <tr><td class="pb-td-label">Product Name</td><td>${v('hi_productName')}</td></tr>
        <tr><td class="pb-td-label">Mold Maker</td><td>${v('hi_moldMaker')}</td></tr>
        <tr><td class="pb-td-label">Part Name</td><td>${v('hi_partName')}</td></tr>
        <tr><td class="pb-td-label">Mold Status</td><td>${state.moldStatus || '-'}</td></tr>
        <tr><td class="pb-td-label">Resin</td><td>${v('hi_resin')}</td></tr>
        <tr><td class="pb-td-label">Brand / Grade</td><td>${v('hi_brandGrade')}</td></tr>
      </tbody></table>
    </div>

    <!-- PARAMETER BANK -->
    <div class="print-section-wrap">
      ${sec('Parameter Bank — General Information')}
      <table class="print-table">${tblHead('Field', 'Value')}<tbody>
        <tr><td class="pb-td-label">Tanggal</td><td>${v('pb_tanggal')}</td></tr>
        <tr><td class="pb-td-label">Mesin</td><td>${v('pb_machine') === 'Lainnya' ? v('pb_machine_custom') : v('pb_machine')}</td></tr>
        <tr><td class="pb-td-label">Nama Mould</td><td>${v('pb_mould')}</td></tr>
        <tr><td class="pb-td-label">Cavity</td><td>${v('pb_cavity')}</td></tr>
        <tr><td class="pb-td-label">Produksi</td><td>${v('pb_produksi')}</td></tr>
        <tr><td class="pb-td-label">Material</td><td>${v('pb_material') === 'Lainnya' ? v('pb_material_custom') : v('pb_material')}</td></tr>
        <tr><td class="pb-td-label">Berat Shoot (g)</td><td>${v('pb_berat_shoot')}</td></tr>
        <tr><td class="pb-td-label">Berat Unit (g)</td><td>${v('pb_berat_unit')}</td></tr>
        <tr><td class="pb-td-label">Berat Runner (g)</td><td>${v('pb_berat_runner')}</td></tr>
        <tr><td class="pb-td-label">Cycle Time (s)</td><td>${v('pb_cycleTime')}</td></tr>
      </tbody></table>

      ${sec('Temperatur & Heater (°C)')}
      <table class="print-table">${tblHead('Parameter', 'Nilai')}<tbody>
        <tr><td>Nozzle</td><td>${v('pb_nozzle')}</td></tr>
        <tr><td>Front</td><td>${v('pb_front')}</td></tr>
        <tr><td>Middle</td><td>${v('pb_middle')}</td></tr>
        <tr><td>Rear</td><td>${v('pb_rear')}</td></tr>
        <tr><td>Hopper Dryer</td><td>${v('pb_hopper')}</td></tr>
        <tr><td>Cooling Cavity</td><td>${v('pb_coolCavity')}</td></tr>
        <tr><td>Cooling Core</td><td>${v('pb_coolCore')}</td></tr>
        <tr><td>Oil Temp</td><td>${v('pb_oilTemp')}</td></tr>
        <tr><td>Heater 1-4</td><td>${v('pb_heater1')} / ${v('pb_heater2')} / ${v('pb_heater3')} / ${v('pb_heater4')}</td></tr>
        <tr><td>Block / HN Sprue</td><td>${v('pb_block')} / ${v('pb_hnSprue')}</td></tr>
      </tbody></table>

      ${sec('Injection Data (Stage 1–7)')}
      <table class="print-table">
        ${tblHead('Stage', 'V (mm/s)', 'P (bar)', 'LS (mm)')}
        <tbody>${[1, 2, 3, 4, 5, 6, 7].map(s => `<tr>
          <td style="text-align:center;">${s}</td>
          <td>${v('pb_v' + s)}</td><td>${v('pb_p' + s)}</td><td>${v('pb_ls' + s)}</td>
        </tr>`).join('')}</tbody>
      </table>

      ${sec('Holding Pressure')}
      <table class="print-table">
        ${tblHead('Stage', 'P (bar)', 'T (s)')}
        <tbody>${[5, 4, 3, 2, 1].map(s => `<tr>
          <td style="text-align:center;">P${s}</td>
          <td>${v('pb_hold_p' + s)}</td><td>${v('pb_hold_t' + s)}</td>
        </tr>`).join('')}</tbody>
      </table>

      ${sec('Plastifikasi & Melt Decomp')}
      <table class="print-table">${tblHead('Parameter', 'Nilai')}<tbody>
        <tr><td>Screw Speed</td><td>${v('pb_screwSpeed')} rpm</td></tr>
        <tr><td>Back Pressure</td><td>${v('pb_backPress')} bar</td></tr>
        <tr><td>Dosing Position</td><td>${v('pb_dosingPos')} mm</td></tr>
        <tr><td>Speed VSB</td><td>${v('pb_vsb')} mm/s</td></tr>
        <tr><td>Stroke LSB</td><td>${v('pb_lsb')} mm</td></tr>
      </tbody></table>

      ${sec('Ejector')}
      <table class="print-table">${tblHead('Parameter', 'Nilai')}<tbody>
        <tr><td>Knock Out No</td><td>${v('pb_ej_ko')}</td></tr>
        <tr><td>Semi-Auto</td><td>${v('pb_ej_semi')}</td></tr>
        <tr><td>Standard</td><td>${v('pb_ej_std')}</td></tr>
        <tr><td>Pre-Eject</td><td>${v('pb_ej_pre')}</td></tr>
      </tbody></table>

      ${sec('Cycle Time & Timing')}
      <table class="print-table">${tblHead('Parameter', 'Nilai')}<tbody>
        <tr><td>Cooling Time</td><td>${v('pb_coolingTime')} s</td></tr>
        <tr><td>Cure Time</td><td>${v('pb_cureTime')} s</td></tr>
        <tr><td>Injection Time</td><td>${v('pb_injTime')} s</td></tr>
        <tr><td>Suck Back</td><td>${v('pb_suckBack')} mm</td></tr>
      </tbody></table>
    </div>

    <!-- MOULD CLOSE / OPEN -->
    <div class="print-section-wrap">
      ${sec('Mould Close / Open')}
      <table class="print-table">${tblHead('Step', 'SP', 'Position')}<tbody>
        ${closeRows}${openRows}
      </tbody></table>
    </div>

    <!-- COOLING CHANNEL ZONES -->
    <div class="print-section-wrap">
      ${sec('Cooling Channel Zones')}
      <table class="print-table">${tblHead('Zona', 'IN Temp (°C)', 'OUT Temp (°C)', 'Flow (L/min)', 'Remark')}<tbody>
        ${b5ZoneRows || '<tr><td colspan="5" style="text-align:center;color:#9ca3af;">Tidak ada data zona.</td></tr>'}
      </tbody></table>
    </div>

    <!-- COOLING LAYOUT SKETCH -->
    <div class="print-section-wrap" style="page-break-before: always; break-before: page;">
      ${sec('Cooling Layout Sketch')}
      ${canvasImgHtml}
    </div>

    <!-- MTER CHECKSHEET B.1–B.9 -->
    <div class="print-section-wrap">
      ${sec('B.1 — Opening Mechanism')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B1_OPENING, state.b1, state.b1Notes)}</tbody></table>

      ${sec('B.2 — Slider Mechanism')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B2_SLIDER, state.b2, state.b2Notes)}</tbody></table>

      ${sec('B.3 — Ejector Mechanism')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B3_EJECTOR, state.b3, state.b3Notes)}</tbody></table>

      ${sec('B.4 — Hydraulic System')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B4_HYDRAULIC, state.b4, state.b4Notes)}</tbody></table>

      ${sec('B.5 — Cooling System')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B5_COOLING, state.b5, state.b5Notes)}</tbody></table>

      ${sec('B.6 — Hot Runner System')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B6_HOTRUNNER, state.b6, state.b6Notes)}</tbody></table>

      ${sec('B.7 — Unscrewing')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B7_UNSCREWING, state.b7, state.b7Notes)}</tbody></table>

      ${sec('B.8 — Take-Out Robot')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B8_TAKEOUT, state.b8, state.b8Notes)}</tbody></table>

      ${sec('B.9 — Balancing')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(B9_BALANCING, state.b9, state.b9Notes)}</tbody></table>

      ${sec('C — Demoulding')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRowsNY(C_DEMOULDING, state.c, state.cNotes)}</tbody></table>

      ${sec('D — Aesthetic Inspection')}
      <table class="print-table">${tblHead('#', 'Item', 'Status', 'Notes')}<tbody>${buildToggleRows(D_AESTHETIC, state.d, state.dNotes)}</tbody></table>
    </div>

    <!-- CAVITY LAYOUT -->
    <div class="print-section-wrap">
      ${sec('Cavity Layout')}
      <table class="print-table">${tblHead('Cavity', 'Status', 'Action', 'Result', 'Remark')}<tbody>
        ${cavityRows}
      </tbody></table>
    </div>

    <!-- CONCLUSION (F) -->
    <div class="print-section-wrap">
      ${sec('F — Conclusion & Recommendation')}
      <table class="print-table">${tblHead('Kategori', 'Keterangan')}<tbody>
        <tr><td class="pb-td-label">Produk</td><td>${document.getElementById('f_produk')?.value || '-'}</td></tr>
        <tr><td class="pb-td-label">Mesin</td><td>${document.getElementById('f_mesin')?.value || '-'}</td></tr>
        <tr><td class="pb-td-label">Mold</td><td>${document.getElementById('f_mold')?.value || '-'}</td></tr>
        <tr><td class="pb-td-label">Peripheral</td><td>${document.getElementById('f_peripheral')?.value || '-'}</td></tr>
      </tbody></table>
    </div>

    <!-- SIGNATURES -->
    <div class="print-signatures">
      <div class="print-sig-box"><div class="print-sig-role">Prepared</div><div class="print-sig-line"><div class="print-sig-name">${v('hi_prepared')}</div></div></div>
      <div class="print-sig-box"><div class="print-sig-role">Reviewed</div><div class="print-sig-line"><div class="print-sig-name">${v('hi_reviewed')}</div></div></div>
      <div class="print-sig-box"><div class="print-sig-role">Approved</div><div class="print-sig-line"><div class="print-sig-name">${v('hi_approved')}</div></div></div>
    </div>
  </div>`;

  if (typeof html2pdf === 'undefined') { showToast('Library PDF belum siap.', 'error'); return; }
  el.style.display = 'block';
  html2pdf().set({
    margin: [5, 10, 12, 10],
    filename: `MTER_Report_${v('hi_moldCode')}_${v('hi_date')}.pdf`,
    image: { type: 'jpeg', quality: .97 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  });
  
  if (action === 'view') {
    pdf.from(el).outputPdf('bloburl').then((pdfUrl) => { 
      el.style.display = 'none'; 
      window.open(pdfUrl, '_blank');
      showToast('PDF berhasil dibuka di tab baru.', 'success'); 
    }).catch((err) => {
      el.style.display = 'none';
      console.error("Error generating PDF view:", err);
      showToast('Gagal memuat pratinjau PDF', 'error');
    });
  } else {
    pdf.from(el).save().then(() => { 
      el.style.display = 'none'; 
      showToast('PDF berhasil diunduh!', 'success'); 
    });
  }
}

window.viewReportPDF = () => exportReport('view');

// ----------------------------------------------------------------
// (openSidebar / closeSidebar removed — sidebar has been eliminated)

// ----------------------------------------------------------------
// ANALYTICS DASHBOARD
// ----------------------------------------------------------------
let trendChartInstance = null;
let judgmentChartInstance = null;

async function renderAnalyticsDashboard() {
  if (typeof Chart === 'undefined') {
    showToast('Library Chart.js belum siap.', 'error');
    return;
  }

  const chartContainers = document.querySelectorAll('.chart-wrapper');
  chartContainers.forEach(c => c.style.opacity = '0.5'); // visual loading

  let saved = [];
  try {
    const querySnapshot = await getDocs(collection(db, "reports"));
    querySnapshot.forEach((doc) => {
      saved.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error("Firebase fetch analytics error:", e);
    showToast('Gagal memuat data analitik.', 'error');
    chartContainers.forEach(c => c.style.opacity = '1');
    return;
  }
  chartContainers.forEach(c => c.style.opacity = '1');

  // Update Machine Filter Dropdown
  const machineSelect = document.getElementById('analyticsMachine');
  const startDateInput = document.getElementById('analyticsStartDate');
  const endDateInput = document.getElementById('analyticsEndDate');
  if (machineSelect && machineSelect.options.length <= 1) {
    const machines = [...new Set(saved.map(r => r.machine).filter(Boolean))];
    machines.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      machineSelect.appendChild(opt);
    });
  }

  const startDate = startDateInput ? startDateInput.value : '';
  const endDate = endDateInput ? endDateInput.value : '';
  const machine = machineSelect ? machineSelect.value : 'all';

  let filtered = saved;

  // Filter By Machine
  if (machine !== 'all') {
    filtered = filtered.filter(r => r.machine === machine);
  }

  // Filter By Date Range
  if (startDate || endDate) {
    filtered = filtered.filter(r => {
      if (!r.date) return false;
      const rDate = new Date(r.date);
      // Remove time for accurate day comparison
      rDate.setHours(0, 0, 0, 0);

      let passStart = true;
      let passEnd = true;

      if (startDate) {
        const sDate = new Date(startDate);
        sDate.setHours(0, 0, 0, 0);
        if (rDate < sDate) passStart = false;
      }
      if (endDate) {
        const eDate = new Date(endDate);
        eDate.setHours(0, 0, 0, 0);
        if (rDate > eDate) passEnd = false;
      }

      return passStart && passEnd;
    });
  }

  // Calculate KPIs
  const totalTrial = filtered.length;
  const approved = filtered.filter(r => r.judgment === 'APPROVED').length;
  const conditional = filtered.filter(r => r.judgment === 'CONDITIONAL').length;
  const rejected = filtered.filter(r => r.judgment === 'REJECTED').length;

  const approvedRate = totalTrial > 0 ? Math.round((approved / totalTrial) * 100) : 0;

  const kpiTotalEl = document.getElementById('kpiTotalTrial');
  const kpiAppEl = document.getElementById('kpiApprovedRate');
  const kpiDefEl = document.getElementById('kpiTotalDefect');

  if (kpiTotalEl) kpiTotalEl.textContent = totalTrial;
  if (kpiAppEl) kpiAppEl.textContent = approvedRate + '%';
  if (kpiDefEl) kpiDefEl.textContent = rejected;

  // Chart 1: Judgment Pie
  const ctxJudgment = document.getElementById('judgmentChart')?.getContext('2d');
  if (ctxJudgment) {
    if (judgmentChartInstance) judgmentChartInstance.destroy();
    judgmentChartInstance = new Chart(ctxJudgment, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Conditional', 'Rejected'],
        datasets: [{
          data: [approved, conditional, rejected],
          backgroundColor: ['#16a34a', '#eab308', '#dc2626'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, boxHeight: 12, font: { size: 11 }, padding: 10 }
          }
        }
      }
    });
  }

  // Chart 2: Trend Trend Reject (Dummy Grouping By Date)
  const ctxTrend = document.getElementById('trendChart')?.getContext('2d');
  if (ctxTrend) {
    if (trendChartInstance) trendChartInstance.destroy();

    // Group by Date for simple trend (with null/invalid date guard)
    const trendMap = {};
    filtered.forEach(r => {
      if (!r.date) return; // skip entries with no date
      const parsed = new Date(r.date);
      if (isNaN(parsed.getTime())) return; // skip invalid dates
      const d = parsed.toISOString().split('T')[0];
      if (!trendMap[d]) trendMap[d] = { total: 0, ng: 0 };
      trendMap[d].total++;
      if (r.judgment === 'REJECTED') trendMap[d].ng++;
    });

    const labels = Object.keys(trendMap).sort();
    const dataTotal = labels.map(l => trendMap[l].total);
    const dataNG = labels.map(l => trendMap[l].ng);

    trendChartInstance = new Chart(ctxTrend, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['-'],
        datasets: [
          {
            label: 'Total Trial',
            data: dataTotal.length > 0 ? dataTotal : [0],
            backgroundColor: '#3b82f6',
            borderRadius: 4
          },
          {
            label: 'NG / Rejected',
            data: dataNG.length > 0 ? dataNG : [0],
            backgroundColor: '#dc2626',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, boxHeight: 12, font: { size: 11 }, padding: 10 }
          }
        }
      }
    });
  }
}

// ----------------------------------------------------------------
// AUTO-SAVE DRAFT LOCAL STORAGE
// ----------------------------------------------------------------
function saveDraftToLocal() {
  const inputs = document.querySelectorAll('input[id], select[id], textarea[id]');
  const draftData = { formData: {}, state: JSON.parse(JSON.stringify(state)) };
  inputs.forEach(el => {
    if (el.id && (el.id.startsWith('hi_') || el.id.startsWith('a_') || el.id.startsWith('pb_') || el.id.startsWith('f_'))) {
      if (el.type === 'checkbox' || el.type === 'radio') draftData.formData[el.id] = el.checked;
      else draftData.formData[el.id] = el.value;
    }
  });
  localStorage.setItem('mter_draft', JSON.stringify(draftData));
}

function loadDraftFromLocal() {
  const saved = localStorage.getItem('mter_draft');
  if (!saved) return;
  try {
    const draftData = JSON.parse(saved);
    if (draftData.state) Object.assign(state, draftData.state);
    if (draftData.formData) {
      for (const [id, val] of Object.entries(draftData.formData)) {
        const el = document.getElementById(id);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') el.checked = val;
          else el.value = val;
        }
      }
    }
    // Re-render UI based on loaded state
    buildToggleItems('b1_openingItems', B1_OPENING, 'b1', 'b1Notes');
    buildToggleItems('b2_sliderItems', B2_SLIDER, 'b2', 'b2Notes');
    buildToggleItems('b3_ejectorItems', B3_EJECTOR, 'b3', 'b3Notes');
    buildToggleItems('b4_hydraulicItems', B4_HYDRAULIC, 'b4', 'b4Notes');
    buildB5CoolingItems();
    buildToggleItems('b6_hotrunnerItems', B6_HOTRUNNER, 'b6', 'b6Notes');
    buildToggleItems('b7_unscrewingItems', B7_UNSCREWING, 'b7', 'b7Notes');
    buildToggleItems('b8_takeoutItems', B8_TAKEOUT, 'b8', 'b8Notes');
    buildToggleItems('b9_balancingItems', B9_BALANCING, 'b9', 'b9Notes');
    buildToggleItemsNoYes('c_demouldingItems', C_DEMOULDING, 'c', 'cNotes');
    buildToggleItems('d_aestheticItems', D_AESTHETIC, 'd', 'dNotes');
  } catch (e) {
    console.error('Error loading draft:', e);
  }
}

// ----------------------------------------------------------------
// INIT
// ----------------------------------------------------------------
function init() {
  document.addEventListener('input', saveDraftToLocal);
  document.addEventListener('change', saveDraftToLocal);

  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('hi_date');
  if (dateEl) dateEl.value = today;

  buildToggleItems('b1_openingItems', B1_OPENING, 'b1', 'b1Notes');
  buildToggleItems('b2_sliderItems', B2_SLIDER, 'b2', 'b2Notes');
  buildToggleItems('b3_ejectorItems', B3_EJECTOR, 'b3', 'b3Notes');
  buildToggleItems('b4_hydraulicItems', B4_HYDRAULIC, 'b4', 'b4Notes');
  buildB5CoolingItems(); // B.5 uses special builder for Nipples Size
  buildToggleItems('b6_hotrunnerItems', B6_HOTRUNNER, 'b6', 'b6Notes');
  buildToggleItems('b7_unscrewingItems', B7_UNSCREWING, 'b7', 'b7Notes');
  buildToggleItems('b8_takeoutItems', B8_TAKEOUT, 'b8', 'b8Notes');
  buildToggleItems('b9_balancingItems', B9_BALANCING, 'b9', 'b9Notes');
  buildToggleItemsNoYes('c_demouldingItems', C_DEMOULDING, 'c', 'cNotes'); // C: NO/YES
  buildToggleItems('d_aestheticItems', D_AESTHETIC, 'd', 'dNotes');        // D: OK/NG

  // F. Conclusion textareas
  ['f_produk', 'f_mesin', 'f_mold', 'f_peripheral'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = state[id] || '';
      el.addEventListener('input', e => { state[id] = e.target.value; });
    }
  });

  loadDraftFromLocal();
  renderCavityList();
  renderB5Zones();
  document.getElementById('cavAddBtn')?.addEventListener('click', () => {
    state.cavities.push({ status: '', action: '', result: '', remark: '' });
    state.cavityCount = state.cavities.length;
    renderCavityList();
    if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
  });
  document.getElementById('cavRemoveBtn')?.addEventListener('click', () => {
    if (state.cavities.length > 1) { 
      state.cavities.pop(); 
      state.cavityCount = state.cavities.length; 
      renderCavityList(); 
      if (typeof saveDraftToLocal === 'function') saveDraftToLocal();
    }
    else showToast('Minimal 1 cavity harus ada.', 'info');
  });

  initRadioGroup('hi_moldStatusGroup', 'moldStatus');

  ['pb_machine', 'pb_material'].forEach(selId => {
    const sel = document.getElementById(selId);
    const inp = document.getElementById(selId + '_custom');
    if (!sel || !inp) return;
    sel.addEventListener('change', () => { inp.style.display = sel.value === 'Lainnya' ? '' : 'none'; });
  });

  document.querySelectorAll('[data-save-section]').forEach(btn => {
    btn.addEventListener('click', () => saveSection(btn.dataset.saveSection));
  });

  initMouldDropdown();
  // Attach save/load to ALL matching buttons (menu page has pb_saveBtn too)
  document.querySelectorAll('#pb_saveBtn').forEach(b => b.addEventListener('click', saveParamBank));
  document.querySelectorAll('#pb_loadBtn').forEach(b => b.addEventListener('click', loadParamBank));
  renderMouldRows('close');
  renderMouldRows('open');
  initCoolingCanvas();

  document.getElementById('rh_filterBtn')?.addEventListener('click', () => showToast('Filter laporan memerlukan koneksi backend.', 'info'));
  document.getElementById('rh_clearBtn')?.addEventListener('click', () => {
    const dp = document.getElementById('rh_datePicker');
    if (dp) dp.value = '';
    showToast('Filter direset.', 'info');
  });

  document.getElementById('analyticsFilterBtn')?.addEventListener('click', () => {
    renderAnalyticsDashboard();
    showToast('Filter diterapkan.', 'success');
  });

  // Inject 'Back to Menu' button dynamically into each step-panel
  // The destination depends on which mode owns the panel
  document.querySelectorAll('.step-panel').forEach(panel => {
    if (!panel.querySelector('.btn-back-to-menu')) {
      const btn = document.createElement('button');
      btn.className = 'btn-back-to-menu';
      btn.innerHTML = '\u2190 Kembali ke Menu';
      // panel-pb-* panels go back to parambankmenu; all others go to mtermenu
      const targetMenu = panel.id.startsWith('panel-pb-') ? 'parambankmenu' : 'mtermenu';
      btn.onclick = () => switchMode(targetMenu);
      panel.insertBefore(btn, panel.firstChild);
    }
  });

  // Restore state from sessionStorage or fallback to home
  const savedMode = sessionStorage.getItem('currentMode');
  const savedPanel = sessionStorage.getItem('activePanelId');
  if (savedPanel) activePanelId = savedPanel;

  if (savedMode) {
    switchMode(savedMode, false);
  } else {
    // Default navigation on first load
    history.replaceState({ mode: 'home' }, '', '#home');
    switchMode('home', false);
  }
}

// ----------------------------------------------------------------
// AUTHENTICATION LOGIC
// ----------------------------------------------------------------
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi!';
  if (hour < 15) return 'Selamat Siang!';
  if (hour < 18) return 'Selamat Sore!';
  return 'Selamat Malam!';
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const greetingEl = document.getElementById('userGreeting');
    if (greetingEl) greetingEl.textContent = getGreeting();
    
    const emailEl = document.getElementById('userEmailDisplay');
    if (emailEl) emailEl.textContent = user.email || '';

    // If we are currently showing loginMode, switch to home
    if (document.getElementById('loginMode').style.display === 'flex') {
      document.getElementById('loginMode').style.display = 'none';
      switchMode('home', false);
    }
  } else {
    // Hide all modes except homeMode to allow overlay effect
    const homeEl = document.getElementById('homeMode');
    if (homeEl) homeEl.style.display = 'block';
    
    const modes = [
      'mterMode', 'mterMenuMode', 'paramBankMode',
      'paramBankMenuMode', 'coolingSketchMode', 'reportHistoryMode',
      'reportMenuMode', 'analyticsMode'
    ];
    modes.forEach(m => {
      const el = document.getElementById(m);
      if (el) el.style.display = 'none';
    });
    const loginEl = document.getElementById('loginMode');
    if (loginEl) loginEl.style.display = 'flex';
  }
});

window.togglePasswordVisibility = function() {
  const passInput = document.getElementById('loginPassword');
  if (passInput) {
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
  }
};

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  const remember = document.getElementById('loginRemember').checked;

  if (!email || !pass) {
    showToast('Harap masukkan email dan password.', 'error');
    return;
  }

  try {
    const persistenceType = remember ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistenceType);
    await signInWithEmailAndPassword(auth, email, pass);
    showToast('Berhasil masuk!', 'success');
    switchMode('home');
  } catch (error) {
    console.error('Login error:', error);
    showToast('Gagal masuk. Coba periksa kembali.', 'error');
  }
}

async function handleLogout() {
  if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
    try {
      await signOut(auth);
      showToast('Anda telah keluar.', 'info');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

// ----------------------------------------------------------------
// GLOBAL SCOPE EXPOSURE
// ----------------------------------------------------------------
window.switchMode = switchMode;
window.showPanel = showPanel;
window.exportReport = exportReport;
window.addB5Zone = addB5Zone;
window.removeB5Zone = removeB5Zone;
window.pbAddMouldRow = pbAddMouldRow;
window.pbRemoveMouldRow = pbRemoveMouldRow;
window.showToast = showToast;
window.handleLogin = handleLogin;
window.startNewTrial = function() {
  if (!confirm("Yakin ingin memulai trial baru? Semua isian yang belum disimpan ke Cloud akan terhapus!")) return;

  localStorage.removeItem('mter_draft');
  localStorage.removeItem('mter_sketch_draft');
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('mter-saved-')) localStorage.removeItem(key);
  });

  document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea').forEach(el => {
    if (el.id !== 'loginEmail' && el.id !== 'loginPassword') {
      el.value = '';
    }
  });

  const dateEl = document.getElementById('hi_date');
  if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];

  const pbMould = document.getElementById('pb_mould');
  if (pbMould) pbMould.value = '';

  state.saved = {};
  state.b1 = {}; state.b1Notes = {};
  state.b2 = {}; state.b2Notes = {};
  state.b3 = {}; state.b3Notes = {};
  state.b4 = {}; state.b4Notes = {};
  state.b5 = {}; state.b5Notes = {};
  state.b6 = {}; state.b6Notes = {};
  state.b7 = {}; state.b7Notes = {};
  state.b8 = {}; state.b8Notes = {};
  state.b9 = {}; state.b9Notes = {};
  state.c = {}; state.cNotes = {};
  state.d = {}; state.dNotes = {};
  state.moldStatus = '';
  
  state.cavities.forEach(cav => {
    cav.status = '';
    cav.action = '';
    cav.result = '';
    cav.remark = '';
  });

  mouldCloseRows = 3; 
  mouldOpenRows = 3;
  if (typeof renderMouldRows === 'function') {
    renderMouldRows('close'); 
    renderMouldRows('open');
  }

  const clearBtn = document.getElementById('canvasClear');
  if (clearBtn) {
    clearBtn.click();
  } else {
    const canvas = document.getElementById('coolingCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  document.querySelectorAll('.t-btn, .cav-tok, .nipple-btn').forEach(btn => btn.classList.remove('sel', 'ok-sel', 'ng-sel', 'na-sel'));

  if (typeof renderMterMenu === 'function') renderMterMenu();
  if (typeof renderParamBankMenu === 'function') renderParamBankMenu();
  
  showToast('Siap untuk Trial Baru!', 'success');
};

window.handleLogout = handleLogout;

document.addEventListener('DOMContentLoaded', init);


