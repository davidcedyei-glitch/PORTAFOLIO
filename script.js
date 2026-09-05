// ============================================================
//  LÓGICA DEL PORTAL BI
//  Los datos de los dashboards vienen de dashboards.js
// ============================================================

// ---------- Miniaturas SVG de demostración ----------
const DEMOS = {
  mapa: `
    <svg viewBox="0 0 250 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="140" fill="#f2f7f7"/>
      <path d="M15 45 L90 30 L135 42 L220 34 L235 60 L220 95 L150 110 L90 102 L30 88 Z"
            fill="#cfe6e4" stroke="#9ec6c3" stroke-width="1.5"/>
      <rect x="42" y="52" width="34" height="26" fill="#136f7a" opacity="0.85"/>
      <rect x="110" y="60" width="30" height="22" fill="#2a9d8f" opacity="0.8"/>
      <rect x="168" y="50" width="36" height="30" fill="#7fc8bf" opacity="0.9"/>
      <rect x="80" y="85" width="42" height="18" fill="#a8d8d2"/>
      <rect x="0" y="0" width="250" height="20" fill="#0f4c5c"/>
      <rect x="10" y="6" width="55" height="8" rx="4" fill="#2a9d8f"/>
      <rect x="72" y="6" width="38" height="8" rx="4" fill="#4db6a9"/>
    </svg>`,
  tabla: `
    <svg viewBox="0 0 250 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="140" fill="#f2f7f7"/>
      <rect x="0" y="0" width="250" height="20" fill="#0f4c5c"/>
      <rect x="10" y="6" width="65" height="8" rx="4" fill="#2a9d8f"/>
      ${[0,1,2,3].map(i => `
        <rect x="16" y="${34 + i*22}" width="218" height="16" rx="4"
              fill="${i % 2 ? '#e3efee' : '#d3e6e4'}"/>`).join("")}
      <rect x="16" y="126" width="66" height="10" rx="5" fill="#136f7a"/>
      <rect x="92" y="126" width="66" height="10" rx="5" fill="#2a9d8f"/>
      <rect x="168" y="126" width="66" height="10" rx="5" fill="#7fc8bf"/>
    </svg>`,
  barras: `
    <svg viewBox="0 0 250 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="140" fill="#f2f7f7"/>
      <rect x="0" y="0" width="250" height="20" fill="#0f4c5c"/>
      <line x1="24" y1="118" x2="226" y2="118" stroke="#9ec6c3" stroke-width="2"/>
      <rect x="36"  y="74"  width="22" height="44" fill="#7fc8bf"/>
      <rect x="70"  y="58"  width="22" height="60" fill="#2a9d8f"/>
      <rect x="104" y="88"  width="22" height="30" fill="#a8d8d2"/>
      <rect x="138" y="44"  width="22" height="74" fill="#136f7a"/>
      <rect x="172" y="66"  width="22" height="52" fill="#2a9d8f"/>
      <rect x="206" y="36"  width="22" height="82" fill="#0f4c5c"/>
    </svg>`
};

// ---------- Referencias DOM ----------
const panels = document.querySelectorAll('.panel');
const menuLinks = document.querySelectorAll('.menu-link[data-section]');
const submenu = document.getElementById('dashboards-submenu');
const grid = document.getElementById('cards-grid');
const chips = document.querySelectorAll('.chip');
const filterLinks = document.querySelectorAll('.filter-link');
const viewerTitle = document.getElementById('viewer-title');
const viewerContainer = document.getElementById('viewer-container');
const address = document.getElementById('address');
const excelInput = document.getElementById('excel-input');
const excelList = document.getElementById('excel-list');

let currentFilter = 'all';

// ---------- Navegación entre paneles ----------
function showPanel(name) {
  panels.forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + name);
  if (target) target.classList.add('active');
  menuLinks.forEach(l => l.classList.toggle('active', l.dataset.section === name));
  address.textContent = 'dancontreras.dev/bi-portal/' + name;
}

menuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPanel(link.dataset.section);
  });
});

document.getElementById('dashboards-toggle').addEventListener('click', () => {
  submenu.classList.toggle('open');
  showPanel('dashboards');
});

document.getElementById('go-dashboards').addEventListener('click', () => showPanel('dashboards'));

// ---------- Filtros ----------
function setFilter(f) {
  currentFilter = f;
  chips.forEach(c => c.classList.toggle('active', c.dataset.filter === f));
  filterLinks.forEach(l => l.classList.toggle('active', l.dataset.filter === f));
  renderCards();
}

chips.forEach(c => c.addEventListener('click', () => setFilter(c.dataset.filter)));
filterLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  showPanel('dashboards');
  setFilter(l.dataset.filter);
}));

// ---------- Render de tarjetas ----------
function renderCards() {
  grid.innerHTML = '';
  const list = DASHBOARDS.filter(d => currentFilter === 'all' || d.tool === currentFilter);

  list.forEach(d => {
    const meta = TOOL_META[d.tool];
    const card = document.createElement('div');
    card.className = 'dash-card';
    card.innerHTML = `
      <div class="dash-thumb">
        ${DEMOS[d.demo] || DEMOS.barras}
        <span class="tool-badge" style="color:${meta.color};background:${meta.badge}">${meta.label}</span>
      </div>
      <div class="dash-info">
        <h3>${d.title}</h3>
        <p>${d.description}</p>
        <div class="open-hint">${d.url ? '▶ Abrir dashboard en vivo' : '▶ Ver detalle'}</div>
      </div>`;
    card.addEventListener('click', () => openDashboard(d));
    grid.appendChild(card);
  });
}

// ---------- Visor de dashboard ----------
function openDashboard(d) {
  showPanel('viewer');
  viewerTitle.textContent = d.title;
  address.textContent = 'dancontreras.dev/bi-portal/viewer/' + d.id;

  if (d.url) {
    // Dashboard real embebido
    viewerContainer.innerHTML = `<iframe src="${d.url}" allowfullscreen></iframe>`;
  } else {
    // Placeholder con instrucciones para conectar el dashboard real
    const meta = TOOL_META[d.tool];
    viewerContainer.innerHTML = `
      <div class="demo-placeholder">
        <div class="big-icon">${d.tool === 'tableau' ? '🗺️' : '📊'}</div>
        <h3>${d.title}</h3>
        <p><strong style="color:${meta.color}">${meta.label}</strong> — vista de demostración.</p>
        <p>Para mostrar tu dashboard real aquí, abre el archivo
           <code>dashboards.js</code> y pega la URL de inserción en el campo
           <code>url</code> de este proyecto.</p>
        <p>${d.tool === 'tableau'
          ? 'En Tableau Public: abre tu dashboard → <strong>Share</strong> → copia el enlace de inserción.'
          : 'En Power BI Service: <strong>Compartir</strong> → <strong>Insertar informe</strong> → copia el <code>src</code> del iframe.'}</p>
      </div>`;
  }
}

document.getElementById('back-btn').addEventListener('click', () => showPanel('dashboards'));

// ---------- Archivos Excel ----------
function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'array' });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

excelInput.addEventListener('change', async () => {
  if (!excelInput.files.length) return;

  excelList.innerHTML = '<p class="empty-state">Leyendo archivos...</p>';
  const results = await Promise.all([...excelInput.files].map(async file => {
    try {
      const sheets = await readExcelFile(file);
      return { file, sheets };
    } catch {
      return { file, sheets: null };
    }
  }));

  excelList.innerHTML = results.map(({ file, sheets }) => `
    <article class="excel-item">
      <strong>📄 ${file.name}</strong>
      <span>${formatFileSize(file.size)}</span>
      <p>${sheets ? `Hojas: ${sheets.join(', ')}` : 'No se pudo leer este archivo.'}</p>
    </article>`).join('');
});

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------- Estadísticas del inicio ----------
function renderStats() {
  document.getElementById('stat-total').textContent = DASHBOARDS.length;
  document.getElementById('stat-tableau').textContent = DASHBOARDS.filter(d => d.tool === 'tableau').length;
  document.getElementById('stat-powerbi').textContent = DASHBOARDS.filter(d => d.tool === 'powerbi').length;
}

// ---------- Init ----------
renderStats();
renderCards();
