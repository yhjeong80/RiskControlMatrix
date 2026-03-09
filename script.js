(() => {
  const STORAGE_DB_KEY = 'rcm_json_model_db_v3';
  const STORAGE_SESSION_KEY = 'rcm_json_model_session_v2';
  const DATA_FILES = ['users', 'folders', 'risks', 'controls', 'change_logs'];

  const state = {
    db: null,
    currentUser: loadSession(),
    selectedFolderId: null,
    selectedRiskId: null,
    currentModule: 'rcm',
    monitoringYear: new Date().getFullYear(),
    search: '',
    treeSearch: '',
    expanded: new Set(),
    isDirty: false
  };

  init();

  async function init() {
    renderLoading();
    state.db = await loadDatabase();
    normalizeDatabase();
    initializeExpanded();
    render();
  }

  async function loadDatabase() {
    const cached = localStorage.getItem(STORAGE_DB_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached DB:', e);
      }
    }

    const legacy = localStorage.getItem('rcm_json_model_db_v2');
    if (legacy) {
      try {
        return JSON.parse(legacy);
      } catch (e) {
        console.error('Failed to parse legacy cached DB:', e);
      }
    }

    const db = {};
    for (const name of DATA_FILES) {
      const res = await fetch(`./data/${name}.json`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`데이터 파일을 불러오지 못했습니다: ${name}.json`);
      }
      db[name] = await res.json();
    }
    return db;
  }

  function normalizeDatabase() {
    state.db.users = state.db.users || [];
    state.db.folders = state.db.folders || [];
    state.db.risks = (state.db.risks || []).map((risk) => ({
      ...risk,
      teamCode: risk.teamCode || inferTeamCodeFromRisk(risk) || inferDepartmentCode(risk.folderId),
      lawCode: pad2(risk.lawCode || '01'),
      regulationDetail: risk.regulationDetail || '',
      sanction: risk.sanction || '',
      riskContent: risk.riskContent || risk.riskDescription || risk.riskTitle || '',
      responsibleDepartment: risk.responsibleDepartment || risk.departmentName || '',
      ownerName: risk.ownerName || ''
    }));
    state.db.controls = (state.db.controls || []).map((control) => ({
      ...control,
      controlCode: control.controlCode || control.controlId || '',
      controlName: control.controlName || control.controlTitle || '',
      controlContent: control.controlContent || control.controlDescription || '',
      controlFrequency: control.controlFrequency || '',
      controlDepartment: control.controlDepartment || control.controlOwner || '',
      controlOwnerName: control.controlOwnerName || '',
      controlOperationType: control.controlOperationType || 'Manual'
    }));
    state.db.change_logs = state.db.change_logs || [];
    state.db.monitoring_records = state.db.monitoring_records || [];
  }

  function renderLoading() {
    document.getElementById('app').innerHTML = `
      <div class="loading-screen">
        <div class="loading-card">RCM JSON 모델을 불러오는 중입니다...</div>
      </div>
    `;
  }

  function render() {
    if (!state.db) return renderLoading();
    if (!state.currentUser) renderLoginPage();
    else renderAppPage();
  }

  function renderLoginPage() {
    document.getElementById('app').innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <h1>RCM Portal Login</h1>
          <p>JSON 기반 데이터 모델 버전입니다. GitHub Pages 배포 후 사용하면 가장 안정적입니다.</p>

          <div class="field">
            <label>ID</label>
            <input id="loginId" placeholder="ID 입력" />
          </div>
          <div class="field">
            <label>Password</label>
            <input id="loginPw" type="password" placeholder="Password 입력" />
          </div>

          <div class="login-actions">
            <button id="loginBtn" class="primary-btn">Log in</button>
          </div>

          <div class="note-box">
            데모 계정<br>
            - Manager / 0000 → 수정 가능<br>
            - User / 0000 → 조회 전용<br><br>
            현재 버전은 정적 사이트이므로 변경사항은 브라우저 LocalStorage에 저장됩니다.
          </div>
        </div>
      </div>
    `;

    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('loginPw').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  function handleLogin() {
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPw').value.trim();
    const user = state.db.users.find((u) => u.username === id && u.password === pw && u.isActive);
    if (!user) {
      alert('ID 또는 Password가 올바르지 않습니다.');
      return;
    }
    state.currentUser = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      displayName: user.displayName
    };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(state.currentUser));
    render();
  }

  function renderAppPage() {
    const selectedFolder = getFolderById(state.selectedFolderId);
    document.getElementById('app').innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div>
              <h2>ICM Menu</h2>
              <p>RCM / Monitoring / Dashboard</p>
            </div>
          </div>

          <div class="sidebar-tools">
            <input id="treeSearchInput" type="text" placeholder="폴더 또는 Risk 검색" value="${escapeHtml(state.treeSearch)}" />
            <div>${state.currentModule === 'monitoring'
              ? `<span class="selection-chip">Monitoring Year: ${escapeHtml(String(state.monitoringYear))}</span>`
              : (state.selectedRiskId
                  ? `<span class="selection-chip">선택 Risk: ${escapeHtml(state.selectedRiskId)}</span>`
                  : (selectedFolder
                      ? `<span class="selection-chip">선택 폴더: ${escapeHtml(selectedFolder.folderName)}</span>`
                      : '<span class="selection-chip">선택 폴더 없음 (상위 폴더 생성)</span>'))}</div>
          </div>

          <div class="module-nav">
            <button class="module-btn ${state.currentModule === 'rcm' ? 'active' : ''}" data-module="rcm">RCM Explorer</button>
            <button class="module-btn ${state.currentModule === 'monitoring' ? 'active' : ''}" data-module="monitoring">Monitoring</button>
            <div class="module-subnav ${state.currentModule === 'monitoring' ? '' : 'hidden'}">
              ${[2025, 2026, 2027, 2028].map((year) => `
                <button class="year-btn ${Number(state.monitoringYear) === year ? 'active' : ''}" data-monitoring-year="${year}">${year}</button>
              `).join('')}
            </div>
            <button class="module-btn ${state.currentModule === 'dashboard' ? 'active' : ''}" data-module="dashboard">Dashboard</button>
          </div>

          <div id="treeRoot" class="tree-root ${state.currentModule === 'rcm' ? '' : 'hidden'}"></div>

          <div class="sidebar-note">
            현재 로그인: <strong>${escapeHtml(state.currentUser.displayName)}</strong><br />
            권한: <strong>${isManager() ? 'Manager (수정 가능)' : 'User (조회 전용)'}</strong><br /><br />
            ${state.currentModule === 'rcm'
              ? 'Risk Code 형식: <strong>R-SC-01-01</strong><br />Control Code 형식: <strong>C-SC-01-01-01</strong>'
              : state.currentModule === 'monitoring'
                ? 'Monitoring 메뉴는 연도별 통제 수행 증빙과 검토 결과를 관리하기 위한 영역입니다.'
                : 'Dashboard 메뉴는 요약 현황과 모니터링 결과를 확인하기 위한 영역입니다.'}
          </div>
        </aside>

        <main class="content">
          ${renderMainContent(selectedFolder)}
        </main>
      </div>
      <div id="modalRoot"></div>
    `;

    bindAppEvents();
    renderTree();
    renderTable();
  }


  function renderMainContent(selectedFolder) {
    if (state.currentModule === 'monitoring') return renderMonitoringContent();
    if (state.currentModule === 'dashboard') return renderDashboardContent(selectedFolder);
    return renderRCMContent(selectedFolder);
  }

  function renderRCMContent(selectedFolder) {
    return `
      <section class="hero">
        <div>
          <h2>Risk and Control Matrix</h2>
          <p>Risk 1건에 여러 Control을 연결할 수 있는 RCM 구조입니다. Supabase 연동 전 단계로 화면/데이터 구조를 정리한 버전입니다.</p>
        </div>
        <div class="hero-tools">
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">${isManager() ? 'EDIT MODE ENABLED' : 'VIEW ONLY'}</span>
          <input id="searchInput" type="text" placeholder="Risk / Control / 법령 / 담당부서 검색" value="${escapeHtml(state.search)}" />
          <button id="clearCacheBtn" class="ghost-btn">캐시 초기화</button>
          <button id="logoutBtn" class="ghost-btn">Log out</button>
        </div>
      </section>

      <section class="toolbar">
        <div class="toolbar-left">
          <button id="addRiskBtn" class="primary-btn ${isManager() ? '' : 'viewer-readonly'}">+ Risk 추가</button>
          <button id="saveBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">저장</button>
          <button id="resetBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">원본으로 되돌리기</button>
        </div>
        <div class="toolbar-right">
          <span class="export-chip">Power BI / KNIME Ready</span>
          <button id="downloadJsonBtn" class="ghost-btn">Download JSON</button>
          <button id="downloadCsvBtn" class="ghost-btn">Download CSV</button>
          <button id="downloadExcelBtn" class="primary-btn">Download Excel</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">Visible Risks</span><strong>${getVisibleRisks().length}</strong></article>
        <article class="stat-card"><span class="stat-label">Visible Controls</span><strong>${getActiveControls().length}</strong></article>
        <article class="stat-card"><span class="stat-label">Rows in RCM</span><strong>${getVisibleRCMRows().length}</strong></article>
        <article class="stat-card"><span class="stat-label">Medium / High</span><strong>${getVisibleRisks().filter(r => ['Medium','High'].includes(r.residualRating)).length}</strong></article>
      </section>

      <section class="table-card">
        <div class="table-meta">
          <div id="currentFilter">${state.selectedRiskId ? `Risk: ${escapeHtml(state.selectedRiskId)}` : (selectedFolder ? `${escapeHtml(buildFolderPath(selectedFolder.folderId).join(' > '))}` : '전체 보기')}</div>
          <div id="statusText" class="status-text">${state.isDirty ? '변경사항 있음 (저장 필요)' : 'Ready'}</div>
        </div>
        <div class="table-wrap">
          <table id="riskTable">
            <thead></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="footer-note">
          현재 버전은 LocalStorage 저장 기반입니다. UI/코드 규칙이 확정되면 Supabase 연동으로 전환하면 됩니다.
        </div>
      </section>
    `;
  }

  function renderMonitoringContent() {
    const rows = getMonitoringRows();
    return `
      <section class="hero">
        <div>
          <h2>Monitoring</h2>
          <p>${state.monitoringYear}년도 기준으로 통제 수행 증빙과 검토 결과를 관리합니다.</p>
        </div>
        <div class="hero-tools">
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">${isManager() ? 'MANAGER REVIEW' : 'USER SUBMISSION'}</span>
          <input id="searchInput" type="text" placeholder="Control / 담당자 / 검토결과 검색" value="${escapeHtml(state.search)}" />
          <button id="clearCacheBtn" class="ghost-btn">캐시 초기화</button>
          <button id="logoutBtn" class="ghost-btn">Log out</button>
        </div>
      </section>

      <section class="toolbar">
        <div class="toolbar-left">
          <button id="saveBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">저장</button>
          <button id="resetBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">원본으로 되돌리기</button>
        </div>
        <div class="toolbar-right">
          <span class="export-chip">${state.monitoringYear} Monitoring</span>
          <button id="downloadJsonBtn" class="ghost-btn">Download JSON</button>
          <button id="downloadCsvBtn" class="ghost-btn">Download CSV</button>
          <button id="downloadExcelBtn" class="primary-btn">Download Excel</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">Monitoring Rows</span><strong>${rows.length}</strong></article>
        <article class="stat-card"><span class="stat-label">Uploaded</span><strong>${rows.filter(r => r.evidenceFile).length}</strong></article>
        <article class="stat-card"><span class="stat-label">적합 / 미흡 / 부적합</span><strong>${rows.filter(r => r.reviewResult === '적합').length} / ${rows.filter(r => r.reviewResult === '미흡').length} / ${rows.filter(r => r.reviewResult === '부적합').length}</strong></article>
        <article class="stat-card"><span class="stat-label">Pending Review</span><strong>${rows.filter(r => r.evidenceFile && !r.reviewResult).length}</strong></article>
      </section>

      <section class="table-card">
        <div class="table-meta">
          <div>${state.monitoringYear}년 Monitoring</div>
          <div id="statusText" class="status-text">${state.isDirty ? '변경사항 있음 (저장 필요)' : 'Ready'}</div>
        </div>
        <div class="table-wrap">
          <table id="monitoringTable">
            <thead>
              <tr>
                <th>연도</th>
                <th>부서</th>
                <th>Risk Code</th>
                <th>Control Code</th>
                <th>Control 명</th>
                <th>담당부서</th>
                <th>담당자</th>
                <th>증빙 파일</th>
                <th>업로드일</th>
                <th>제출 상태</th>
                <th>검토 결과</th>
                <th>검토 의견</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows.map((row) => `
                <tr>
                  <td class="readonly-cell center-cell">${row.year}</td>
                  <td class="readonly-cell">${escapeHtml(row.departmentName || '')}</td>
                  <td class="readonly-cell mono">${escapeHtml(row.riskId || '')}</td>
                  <td class="readonly-cell mono">${escapeHtml(row.controlCode || '')}</td>
                  <td class="readonly-cell">${escapeHtml(row.controlName || '')}</td>
                  <td class="readonly-cell">${escapeHtml(row.controlDepartment || '')}</td>
                  <td class="readonly-cell">${escapeHtml(row.controlOwnerName || '')}</td>
                  <td>${renderMonitoringEvidenceCell(row)}</td>
                  <td class="readonly-cell">${escapeHtml(row.uploadedAt ? formatDate(row.uploadedAt) : '')}</td>
                  <td class="readonly-cell center-cell">${escapeHtml(row.submissionStatus || '제출대기')}</td>
                  <td>${renderMonitoringReviewCell(row)}</td>
                  <td>${renderMonitoringCommentCell(row)}</td>
                </tr>
              `).join('') : `<tr><td colspan="12" class="empty-state">Monitoring 대상 항목이 없습니다.</td></tr>`}
            </tbody>
          </table>
        </div>
        <div class="footer-note">
          현재 단계에서는 증빙 파일명을 기록하는 형태로 Monitoring 구조를 구현했습니다. DB/Storage 연동 시 실제 파일 업로드로 확장할 수 있습니다.
        </div>
      </section>
    `;
  }

  function renderDashboardContent(selectedFolder) {
    const monitoringRows = getMonitoringRows();
    const uploaded = monitoringRows.filter(r => r.evidenceFile).length;
    const suitable = monitoringRows.filter(r => r.reviewResult === '적합').length;
    const insufficient = monitoringRows.filter(r => r.reviewResult === '미흡').length;
    const unsuitable = monitoringRows.filter(r => r.reviewResult === '부적합').length;
    return `
      <section class="hero">
        <div>
          <h2>Dashboard</h2>
          <p>RCM 및 Monitoring 운영 현황을 요약해서 보여주는 Dashboard입니다.</p>
        </div>
        <div class="hero-tools">
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">SUMMARY</span>
          <button id="clearCacheBtn" class="ghost-btn">캐시 초기화</button>
          <button id="logoutBtn" class="ghost-btn">Log out</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">Total Risks</span><strong>${getActiveRisks().length}</strong></article>
        <article class="stat-card"><span class="stat-label">Total Controls</span><strong>${getActiveControls().length}</strong></article>
        <article class="stat-card"><span class="stat-label">${state.monitoringYear} Uploaded</span><strong>${uploaded}</strong></article>
        <article class="stat-card"><span class="stat-label">High Residual Risk</span><strong>${getActiveRisks().filter(r => r.residualRating === 'High').length}</strong></article>
      </section>

      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">적합</span><strong>${suitable}</strong></article>
        <article class="stat-card"><span class="stat-label">미흡</span><strong>${insufficient}</strong></article>
        <article class="stat-card"><span class="stat-label">부적합</span><strong>${unsuitable}</strong></article>
        <article class="stat-card"><span class="stat-label">미제출</span><strong>${monitoringRows.filter(r => !r.evidenceFile).length}</strong></article>
      </section>

      <section class="table-card">
        <div class="table-meta">
          <div>Dashboard Summary</div>
          <div class="status-text">Ready</div>
        </div>
        <div class="dashboard-grid">
          <div class="dashboard-panel">
            <h3>부서별 Risk 현황</h3>
            <div class="dashboard-list">
              ${Object.entries(groupBy(getActiveRisks(), 'departmentName')).map(([k, v]) => `<div><span>${escapeHtml(k || '-')}</span><strong>${v.length}</strong></div>`).join('')}
            </div>
          </div>
          <div class="dashboard-panel">
            <h3>${state.monitoringYear} 검토결과</h3>
            <div class="dashboard-list">
              <div><span>적합</span><strong>${suitable}</strong></div>
              <div><span>미흡</span><strong>${insufficient}</strong></div>
              <div><span>부적합</span><strong>${unsuitable}</strong></div>
              <div><span>검토대기</span><strong>${monitoringRows.filter(r => r.evidenceFile && !r.reviewResult).length}</strong></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function bindAppEvents() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
      closeModal();
      localStorage.removeItem(STORAGE_SESSION_KEY);
      state.currentUser = null;
      render();
    });

    document.getElementById('clearCacheBtn').addEventListener('click', async () => {
      if (!confirm('브라우저에 저장된 편집 데이터와 로그인 세션을 모두 초기화할까요?')) return;
      localStorage.removeItem(STORAGE_DB_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem('rcm_json_model_db_v2');
      state.currentUser = null;
      state.selectedFolderId = null;
      state.selectedRiskId = null;
      state.search = '';
      state.treeSearch = '';
      state.db = await loadDatabase();
      normalizeDatabase();
      state.isDirty = false;
      initializeExpanded();
      render();
    });

    document.getElementById('treeSearchInput').addEventListener('input', (e) => {
      state.treeSearch = e.target.value.trim();
      renderTree();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
      state.search = e.target.value.trim();
      renderTable();
    });

    document.getElementById('addRootFolderBtn').addEventListener('click', () => {
      if (!isManager()) return blockViewerAction();
      openFolderModal(state.selectedFolderId);
    });

    document.getElementById('addRiskBtn').addEventListener('click', () => {
      if (!isManager()) return blockViewerAction();
      if (!state.selectedFolderId) {
        alert('리스크를 추가하려면 먼저 폴더를 선택해 주세요.');
        return;
      }
      openRiskModal();
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
      if (!isManager()) return blockViewerAction();
      saveDatabase();
    });

    document.getElementById('resetBtn').addEventListener('click', async () => {
      if (!isManager()) return blockViewerAction();
      if (!confirm('현재 브라우저에 저장된 변경사항을 버리고 원본 JSON 파일 기준으로 되돌릴까요?')) return;
      localStorage.removeItem(STORAGE_DB_KEY);
      localStorage.removeItem('rcm_json_model_db_v2');
      state.db = await loadDatabase();
      normalizeDatabase();
      state.isDirty = false;
      initializeExpanded();
      render();
    });

    document.getElementById('downloadExcelBtn').addEventListener('click', () => {
      if (typeof XLSX === 'undefined') {
        alert('Excel 다운로드 라이브러리를 불러오지 못했습니다.');
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(getVisibleRowsForExport());
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'RCM');
      XLSX.writeFile(workbook, 'RCM_Rows.xlsx');
    });
  }


  function bindMonitoringEvents() {
    document.querySelectorAll('[data-monitoring-upload]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openMonitoringUploadModal(btn.getAttribute('data-monitoring-upload'));
      });
    });

    document.querySelectorAll('[data-monitoring-review]').forEach((el) => {
      el.addEventListener('change', () => {
        if (!isManager()) return blockViewerAction();
        updateMonitoringRecord(el.dataset.recordId, 'reviewResult', el.value);
      });
    });

    document.querySelectorAll('[data-monitoring-comment]').forEach((el) => {
      el.addEventListener('change', () => {
        if (!isManager()) return blockViewerAction();
        updateMonitoringRecord(el.dataset.recordId, 'reviewComment', el.value);
      });
    });
  }

  function renderMonitoringEvidenceCell(row) {
    if (!row.controlId) return '<div class="readonly-cell"></div>';
    const fileName = row.evidenceFile ? `<div class="readonly-cell mono">${escapeHtml(row.evidenceFile)}</div>` : '<div class="readonly-cell muted">미업로드</div>';
    return `${fileName}<button class="ghost-btn small-btn" data-monitoring-upload="${row.controlId}">${isManager() ? '증빙 등록' : 'Upload'}</button>`;
  }

  function renderMonitoringReviewCell(row) {
    if (!isManager()) return `<div class="readonly-cell center-cell">${escapeHtml(row.reviewResult || '')}</div>`;
    return `
      <select class="cell-select" data-monitoring-review="1" data-record-id="${row.recordId}">
        <option value="" ${!row.reviewResult ? 'selected' : ''}>-</option>
        <option value="적합" ${row.reviewResult === '적합' ? 'selected' : ''}>적합</option>
        <option value="미흡" ${row.reviewResult === '미흡' ? 'selected' : ''}>미흡</option>
        <option value="부적합" ${row.reviewResult === '부적합' ? 'selected' : ''}>부적합</option>
      </select>
    `;
  }

  function renderMonitoringCommentCell(row) {
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(row.reviewComment || '')}</div>`;
    return `<input class="cell-input" data-monitoring-comment="1" data-record-id="${row.recordId}" value="${escapeHtml(row.reviewComment || '')}" />`;
  }

  function getMonitoringRows() {
    const keyword = state.search.trim().toLowerCase();
    return getActiveControls().map((control) => {
      const risk = getRiskById(control.riskId);
      const record = getOrCreateMonitoringRecord(control.controlId, risk?.riskId);
      return {
        recordId: record.recordId,
        year: record.year,
        controlId: control.controlId,
        riskId: risk?.riskId || '',
        departmentName: risk?.departmentName || '',
        controlCode: control.controlCode || control.controlId || '',
        controlName: control.controlName || control.controlTitle || '',
        controlDepartment: control.controlDepartment || control.controlOwner || '',
        controlOwnerName: control.controlOwnerName || '',
        evidenceFile: record.evidenceFile || '',
        uploadedAt: record.uploadedAt || '',
        submissionStatus: record.submissionStatus || '제출대기',
        reviewResult: record.reviewResult || '',
        reviewComment: record.reviewComment || ''
      };
    }).filter((row) => {
      if (Number(row.year) !== Number(state.monitoringYear)) return false;
      if (!keyword) return true;
      const haystack = [row.departmentName, row.riskId, row.controlCode, row.controlName, row.controlOwnerName, row.reviewResult, row.submissionStatus].join(' ').toLowerCase();
      return haystack.includes(keyword);
    });
  }

  function getMonitoringRowsForExport() {
    return getMonitoringRows().map((row) => ({
      year: row.year,
      departmentName: row.departmentName,
      riskId: row.riskId,
      controlCode: row.controlCode,
      controlName: row.controlName,
      controlDepartment: row.controlDepartment,
      controlOwnerName: row.controlOwnerName,
      evidenceFile: row.evidenceFile,
      uploadedAt: row.uploadedAt,
      submissionStatus: row.submissionStatus,
      reviewResult: row.reviewResult,
      reviewComment: row.reviewComment
    }));
  }

  function getOrCreateMonitoringRecord(controlId, riskId) {
    let record = (state.db.monitoring_records || []).find((r) => Number(r.year) === Number(state.monitoringYear) && r.controlId === controlId);
    if (!record) {
      record = {
        recordId: nextSimpleId('M', (state.db.monitoring_records || []).map((r) => r.recordId)),
        year: Number(state.monitoringYear),
        controlId,
        riskId,
        evidenceFile: '',
        uploadedAt: '',
        submissionStatus: '제출대기',
        reviewResult: '',
        reviewComment: ''
      };
      state.db.monitoring_records.push(record);
    }
    return record;
  }

  function updateMonitoringRecord(recordId, field, value) {
    const record = (state.db.monitoring_records || []).find((r) => r.recordId === recordId);
    if (!record) return;
    record[field] = value;
    if (field === 'reviewResult' && value && record.submissionStatus === '제출완료') {
      record.submissionStatus = '검토완료';
    }
    appendLog('monitoring', recordId, 'update', null, { [field]: value, year: record.year });
    markDirtyAndRender();
  }

  function openMonitoringUploadModal(controlId) {
    const control = getControlById(controlId);
    const risk = control ? getRiskById(control.riskId) : null;
    const record = getOrCreateMonitoringRecord(controlId, risk?.riskId);

    openModal(`
      <div class="modal-header">
        <h3>증빙 등록</h3>
        <button id="modalCloseBtn" class="ghost-btn">닫기</button>
      </div>
      <div class="kv-list" style="margin-bottom:16px;">
        <div>연도</div><div>${state.monitoringYear}</div>
        <div>Risk Code</div><div class="mono">${escapeHtml(risk?.riskId || '')}</div>
        <div>Control Code</div><div class="mono">${escapeHtml(control?.controlCode || control?.controlId || '')}</div>
        <div>Control 명</div><div>${escapeHtml(control?.controlName || control?.controlTitle || '')}</div>
      </div>
      <div class="field-group">
        <label>증빙 파일명</label>
        <input id="evidenceFileInput" class="field-input" value="${escapeHtml(record.evidenceFile || '')}" placeholder="예: 2026_SC_계약검토증빙.pdf" />
      </div>
      <div class="warning-box" style="margin-top:12px;">
        현재 단계에서는 파일 자체 업로드 대신 파일명을 기록하는 형태입니다. DB/Storage 연동 시 실제 파일 업로드로 변경할 수 있습니다.
      </div>
      <div class="modal-actions">
        <button id="evidenceSaveBtn" class="primary-btn">저장</button>
      </div>
    `);

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('evidenceSaveBtn').addEventListener('click', () => {
      const fileName = document.getElementById('evidenceFileInput').value.trim();
      if (!fileName) {
        alert('증빙 파일명을 입력해 주세요.');
        return;
      }
      record.evidenceFile = fileName;
      record.uploadedAt = nowIso();
      record.submissionStatus = '제출완료';
      appendLog('monitoring', record.recordId, 'upload', null, { year: record.year, evidenceFile: fileName });
      markDirtyAndRender();
      closeModal();
    });
  }

  function groupBy(list, field) {
    return list.reduce((acc, item) => {
      const key = item[field] || '-';
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  function renderTree() {
    const treeRoot = document.getElementById('treeRoot');
    if (!treeRoot) return;

    const roots = sortFolders(getChildrenFolders(null));
    const html = roots.map((folder) => renderTreeNode(folder)).join('');
    treeRoot.innerHTML = html || '<div class="empty-state">표시할 폴더가 없습니다.</div>';

    treeRoot.querySelectorAll('[data-folder-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedFolderId = btn.getAttribute('data-folder-id');
        state.selectedRiskId = null;
        render();
      });
    });

    treeRoot.querySelectorAll('[data-toggle-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-toggle-id');
        if (state.expanded.has(id)) state.expanded.delete(id);
        else state.expanded.add(id);
        renderTree();
      });
    });

    treeRoot.querySelectorAll('[data-add-child]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isManager()) return blockViewerAction();
        openFolderModal(btn.getAttribute('data-add-child'));
      });
    });

    treeRoot.querySelectorAll('[data-delete-folder]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isManager()) return blockViewerAction();
        deleteFolder(btn.getAttribute('data-delete-folder'));
      });
    });

    treeRoot.querySelectorAll('[data-edit-folder]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isManager()) return blockViewerAction();
        openFolderEditModal(btn.getAttribute('data-edit-folder'));
      });
    });

    treeRoot.querySelectorAll('[data-risk-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.selectedRiskId = btn.getAttribute('data-risk-id');
        const folderId = btn.getAttribute('data-risk-folder-id');
        if (folderId) state.selectedFolderId = folderId;
        render();
      });
    });
  }

  function renderTreeNode(folder) {
    const visible = matchesTreeSearch(folder.folderId);
    if (!visible) return '';

    const children = sortFolders(getChildrenFolders(folder.folderId));
    const folderRisks = getFolderRisks(folder.folderId);
    const expanded = state.expanded.has(folder.folderId);
    const isActive = state.selectedFolderId === folder.folderId && !state.selectedRiskId;

    return `
      <div class="tree-item">
        <div class="tree-row">
          <button class="tree-button ${isActive ? 'active' : ''}" data-folder-id="${folder.folderId}">
            <span class="tree-toggle" data-toggle-id="${folder.folderId}">${(children.length || folderRisks.length) ? (expanded ? '▾' : '▸') : '•'}</span>
            <span class="tree-icon">📁</span>
            <span>${escapeHtml(folder.folderName)}</span>
          </button>
          ${isManager() ? `
          <div class="tree-actions">
            <button class="icon-btn" title="하위 폴더 추가" data-add-child="${folder.folderId}">+</button>
            <button class="icon-btn" title="폴더명 수정" data-edit-folder="${folder.folderId}">✎</button>
            <button class="icon-btn delete" title="폴더 삭제" data-delete-folder="${folder.folderId}">🗑</button>
          </div>` : ''}
        </div>
        ${(children.length || folderRisks.length) && expanded ? `
          <div class="tree-children">
            ${children.map((child) => renderTreeNode(child)).join('')}
            ${folderRisks.map((risk) => renderRiskNode(risk)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderRiskNode(risk) {
    const isActive = state.selectedRiskId === risk.riskId;
    return `
      <div class="tree-item tree-risk-item">
        <button class="tree-button tree-risk-button ${isActive ? 'active' : ''}" data-risk-id="${risk.riskId}" data-risk-folder-id="${risk.folderId}">
          <span class="tree-toggle">•</span>
          <span class="tree-icon">📄</span>
          <span class="mono">${escapeHtml(risk.riskId)}</span>
        </button>
      </div>
    `;
  }

  function getFolderRisks(folderId) {
    return getActiveRisks()
      .filter((risk) => risk.folderId === folderId)
      .sort((a, b) => a.riskId.localeCompare(b.riskId));
  }

  function renderTable() {
    const table = document.getElementById('riskTable');
    if (!table) return;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const rows = getVisibleRCMRows();

    const columns = [
      'departmentName',
      'riskId',
      'referenceLaw',
      'regulationDetail',
      'sanction',
      'riskContent',
      'inherentLikelihood',
      'inherentImpact',
      'inherentRating',
      'controlCode',
      'controlName',
      'controlContent',
      'controlType',
      'controlOperationType',
      'controlFrequency',
      'responsibleDepartment',
      'ownerName',
      'residualLikelihood',
      'residualImpact',
      'residualRating',
      'status',
      'actions'
    ];

    thead.innerHTML = `<tr>${columns.map((col) => `<th>${formatHeaderLabel(columnLabel(col))}</th>`).join('')}</tr>`;

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${columns.length}" class="empty-state">조건에 맞는 항목이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = rows.map(({ risk, control }) => `
      <tr>
        <td>${renderEditableCell('risk', risk.riskId, 'departmentName', risk.departmentName)}</td>
        <td class="mono readonly-cell">${escapeHtml(risk.riskId)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'referenceLaw', risk.referenceLaw)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'regulationDetail', risk.regulationDetail, true)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'sanction', risk.sanction, true)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'riskContent', risk.riskContent || risk.riskDescription || risk.riskTitle, true)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'inherentLikelihood', risk.inherentLikelihood)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'inherentImpact', risk.inherentImpact)}</td>
        <td class="readonly-cell">${renderBadge(risk.inherentRating)}</td>
        <td class="mono readonly-cell">${escapeHtml(control?.controlCode || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlName', control?.controlName || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlContent', control?.controlContent || '', true)}</td>
        <td>${renderControlTypeCell(control)}</td>
        <td>${renderControlOperationTypeCell(control)}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlFrequency', control?.controlFrequency || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlDepartment', control?.controlDepartment || risk.responsibleDepartment || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlOwnerName', control?.controlOwnerName || risk.ownerName || '')}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'residualLikelihood', risk.residualLikelihood)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'residualImpact', risk.residualImpact)}</td>
        <td class="readonly-cell">${renderBadge(risk.residualRating)}</td>
        <td>${renderStatusCell(risk)}</td>
        <td>${renderActionsCell(risk, control)}</td>
      </tr>
    `).join('');

    bindTableEvents();
  }

  function bindTableEvents() {
    document.querySelectorAll('[data-field-input]').forEach((el) => {
      el.addEventListener('change', () => {
        if (!isManager()) return blockViewerAction();
        updateField(el.dataset.targetType, el.dataset.targetId, el.dataset.field, el.value);
      });
    });

    document.querySelectorAll('[data-add-control]').forEach((el) => {
      el.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        openControlModal(el.dataset.addControl);
      });
    });

    document.querySelectorAll('[data-delete-risk]').forEach((el) => {
      el.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        deleteRisk(el.dataset.deleteRisk);
      });
    });

    document.querySelectorAll('[data-delete-control]').forEach((el) => {
      el.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        deleteControl(el.dataset.deleteControl);
      });
    });
  }

  function renderEditableCell(targetType, targetId, field, value, longText = false) {
    if (!targetId) return `<div class="readonly-cell">${escapeHtml(value ?? '')}</div>`;
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(value ?? '')}</div>`;
    if (longText) {
      return `<textarea class="cell-input cell-textarea" data-field-input="1" data-target-type="${targetType}" data-target-id="${targetId}" data-field="${field}">${escapeHtml(value ?? '')}</textarea>`;
    }
    return `<input class="cell-input" data-field-input="1" data-target-type="${targetType}" data-target-id="${targetId}" data-field="${field}" value="${escapeHtml(value ?? '')}" />`;
  }

  function renderRatingSelectCell(targetType, targetId, field, value) {
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(String(value ?? ''))}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-target-type="${targetType}" data-target-id="${targetId}" data-field="${field}">
        ${[1,2,3,4,5].map((n) => `<option value="${n}" ${Number(value) === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select>
    `;
  }

  function renderControlTypeCell(control) {
    const value = control?.controlType || '';
    const options = ['승인', '권한부여', '업무분장', '감독 및 모니터링', '대사 및 검증', '확인서 징구', '교육실시', '기타'];
    if (!control?.controlId) return `<div class="readonly-cell"></div>`;
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-target-type="control" data-target-id="${control.controlId}" data-field="controlType">
        ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    `;
  }

  function renderControlOperationTypeCell(control) {
    const value = control?.controlOperationType || 'Manual';
    const options = ['Auto', 'Manual'];
    if (!control?.controlId) return `<div class="readonly-cell"></div>`;
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-target-type="control" data-target-id="${control.controlId}" data-field="controlOperationType">
        ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    `;
  }

  function renderStatusCell(risk) {
    const options = ['Open', 'Mitigated', 'Closed'];
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(risk.status ?? '')}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-target-type="risk" data-target-id="${risk.riskId}" data-field="status">
        ${options.map((v) => `<option value="${v}" ${risk.status === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    `;
  }

  function renderActionsCell(risk, control) {
    if (!isManager()) return `<div class="readonly-cell muted">-</div>`;
    return `
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="ghost-btn small-btn" data-add-control="${risk.riskId}">+ Control</button>
        ${control ? `<button class="danger-btn small-btn" data-delete-control="${control.controlId}">Del C</button>` : ''}
        <button class="danger-btn small-btn" data-delete-risk="${risk.riskId}">Del R</button>
      </div>
    `;
  }

  function openFolderModal(parentFolderId) {
    const parent = getFolderById(parentFolderId);
    openModal(`
      <div class="modal-header">
        <h3>${parent ? '하위 폴더 추가' : '상위 폴더 추가'}</h3>
        <button id="modalCloseBtn" class="ghost-btn">닫기</button>
      </div>
      <div class="field-group">
        <label>폴더명</label>
        <input id="folderNameInput" class="field-input" placeholder="예: Sales Compliance / HR / Legal" />
      </div>
      <div class="help-text" style="margin-top:12px;">
        ${parent ? `선택한 상위 폴더: <strong>${escapeHtml(parent.folderName)}</strong>` : '선택한 폴더가 없으므로 상위 폴더로 생성됩니다.'}
      </div>
      <div class="warning-box" style="margin-top:12px;">
        Manager 계정만 폴더 생성 및 삭제가 가능합니다.
      </div>
      <div class="modal-actions">
        <button id="folderCreateBtn" class="primary-btn">생성</button>
      </div>
    `);

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('folderCreateBtn').addEventListener('click', () => {
      const name = document.getElementById('folderNameInput').value.trim();
      if (!name) {
        alert('폴더명을 입력해 주세요.');
        return;
      }
      createFolder(name, parentFolderId || null);
      closeModal();
    });
  }

  function openFolderEditModal(folderId) {
    const folder = getFolderById(folderId);
    if (!folder) return;

    openModal(`
      <div class="modal-header">
        <h3>폴더명 수정</h3>
        <button id="modalCloseBtn" class="ghost-btn">닫기</button>
      </div>
      <div class="field-group">
        <label>현재 폴더명</label>
        <input class="field-input" value="${escapeHtml(folder.folderName)}" disabled />
      </div>
      <div class="field-group" style="margin-top:12px;">
        <label>새 폴더명</label>
        <input id="folderRenameInput" class="field-input" value="${escapeHtml(folder.folderName)}" />
      </div>
      <div class="warning-box" style="margin-top:12px;">
        폴더명을 변경해도 하위 폴더 및 연결된 Risk / Control 데이터는 유지됩니다.
      </div>
      <div class="modal-actions">
        <button id="folderRenameBtn" class="primary-btn">수정</button>
      </div>
    `);

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('folderRenameBtn').addEventListener('click', () => {
      const newName = document.getElementById('folderRenameInput').value.trim();
      if (!newName) {
        alert('새 폴더명을 입력해 주세요.');
        return;
      }
      renameFolder(folderId, newName);
      closeModal();
    });
  }

  function openRiskModal() {
    const folder = getFolderById(state.selectedFolderId);
    const defaultDept = folder?.folderName || '';

    openModal(`
      <div class="modal-header">
        <h3>Risk 추가</h3>
        <button id="modalCloseBtn" class="ghost-btn">닫기</button>
      </div>
      <div class="kv-list" style="margin-bottom:16px;">
        <div>대상 폴더</div><div>${escapeHtml(buildFolderPath(folder.folderId).join(' > '))}</div>
        <div>코드 형식</div><div class="mono">R-SC-01-01 / C-SC-01-01-01</div>
      </div>

      <div class="modal-grid three">
        <div class="field-group">
          <label>부서</label>
          <input id="departmentNameInput" class="field-input" value="${escapeHtml(defaultDept)}" />
        </div>
        <div class="field-group">
          <label>팀 약자</label>
          <input id="teamCodeInput" class="field-input" placeholder="예: SC" />
        </div>
        <div class="field-group">
          <label>법령 코드</label>
          <input id="lawCodeInput" class="field-input" placeholder="예: 01" value="01" />
        </div>

        <div class="field-group field-span-3">
          <label>관련 규정</label>
          <input id="referenceLawInput" class="field-input" placeholder="예: 하도급법" />
        </div>
        <div class="field-group field-span-3">
          <label>규정 세부내용</label>
          <textarea id="regulationDetailInput" class="field-input"></textarea>
        </div>
        <div class="field-group field-span-3">
          <label>관련 제재</label>
          <textarea id="sanctionInput" class="field-input"></textarea>
        </div>
        <div class="field-group field-span-3">
          <label>Risk 내용</label>
          <textarea id="riskContentInput" class="field-input"></textarea>
        </div>

        <div class="field-group">
          <label>담당부서</label>
          <input id="responsibleDepartmentInput" class="field-input" value="${escapeHtml(defaultDept)}" />
        </div>
        <div class="field-group">
          <label>담당자</label>
          <input id="ownerNameInput" class="field-input" />
        </div>
        <div class="field-group">
          <label>Status</label>
          <select id="statusInput" class="field-select">
            <option>Open</option>
            <option>Mitigated</option>
            <option>Closed</option>
          </select>
        </div>

        <div class="field-group">
          <label>고유 Risk 발생가능성</label>
          <select id="inhLikelihoodInput" class="field-select">${ratingOptions(3)}</select>
        </div>
        <div class="field-group">
          <label>고유 Risk 결과 심각성</label>
          <select id="inhImpactInput" class="field-select">${ratingOptions(3)}</select>
        </div>

      </div>

      <div class="warning-box" style="margin-top:16px;">
        Risk Code는 <strong>R-팀약자-법령코드-일련번호</strong> 형식으로 자동 생성됩니다.<br>
        잔여 Risk 발생가능성과 잔여 Risk 결과 심각성은 <strong>Control 추가</strong> 화면에서 입력합니다.
      </div>

      <div class="modal-actions">
        <button id="riskCreateBtn" class="primary-btn">추가</button>
      </div>
    `);

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('riskCreateBtn').addEventListener('click', () => {
      const payload = {
        departmentName: document.getElementById('departmentNameInput').value.trim(),
        teamCode: document.getElementById('teamCodeInput').value.trim().toUpperCase(),
        lawCode: pad2(document.getElementById('lawCodeInput').value.trim() || '01'),
        referenceLaw: document.getElementById('referenceLawInput').value.trim(),
        regulationDetail: document.getElementById('regulationDetailInput').value.trim(),
        sanction: document.getElementById('sanctionInput').value.trim(),
        riskContent: document.getElementById('riskContentInput').value.trim(),
        responsibleDepartment: document.getElementById('responsibleDepartmentInput').value.trim(),
        ownerName: document.getElementById('ownerNameInput').value.trim(),
        status: document.getElementById('statusInput').value,
        inherentLikelihood: Number(document.getElementById('inhLikelihoodInput').value),
        inherentImpact: Number(document.getElementById('inhImpactInput').value),
        residualLikelihood: 2,
        residualImpact: 2
      };

      if (!payload.teamCode) {
        alert('팀 약자를 입력해 주세요. 예: SC');
        return;
      }
      if (!payload.referenceLaw) {
        alert('관련 규정을 입력해 주세요.');
        return;
      }
      if (!payload.riskContent) {
        alert('Risk 내용을 입력해 주세요.');
        return;
      }

      createRisk(payload);
      closeModal();
    });
  }

  function openControlModal(riskId) {
    const risk = getRiskById(riskId);
    if (!risk) return;

    openModal(`
      <div class="modal-header">
        <h3>Control 추가</h3>
        <button id="modalCloseBtn" class="ghost-btn">닫기</button>
      </div>

      <div class="kv-list" style="margin-bottom:16px;">
        <div>Risk Code</div><div class="mono">${escapeHtml(risk.riskId)}</div>
        <div>부서</div><div>${escapeHtml(risk.departmentName || '')}</div>
        <div>관련 규정</div><div>${escapeHtml(risk.referenceLaw || '')}</div>
      </div>

      <div class="modal-grid three">
        <div class="field-group field-span-3">
          <label>Control 명</label>
          <input id="controlNameInput" class="field-input" />
        </div>
        <div class="field-group field-span-3">
          <label>Control 내용</label>
          <textarea id="controlContentInput" class="field-input"></textarea>
        </div>
        <div class="field-group">
          <label>통제 유형</label>
          <select id="controlTypeInput" class="field-select">
            <option>승인</option>
            <option>권한부여</option>
            <option>업무분장</option>
            <option>감독 및 모니터링</option>
            <option>대사 및 검증</option>
            <option>확인서 징구</option>
            <option>교육실시</option>
            <option>기타</option>
          </select>
        </div>
        <div class="field-group">
          <label>통제 수행 방식</label>
          <select id="controlOperationTypeInput" class="field-select">
            <option>Auto</option>
            <option selected>Manual</option>
          </select>
        </div>
        <div class="field-group">
          <label>Control 주기</label>
          <select id="controlFrequencyInput" class="field-select">
            <option>상시(Continuous)</option>
            <option>건별(Ad-hoc)</option>
            <option>일별(Daily)</option>
            <option>주별(Weekly)</option>
            <option>월별(Monthly)</option>
            <option>분기별(Quarterly)</option>
            <option>반기별(Semi-annual)</option>
            <option>연간(Annual)</option>
          </select>
        </div>
        <div class="field-group">
          <label>담당부서</label>
          <input id="controlDepartmentInput" class="field-input" value="${escapeHtml(risk.responsibleDepartment || risk.departmentName || '')}" />
        </div>
        <div class="field-group">
          <label>담당자</label>
          <input id="controlOwnerNameInput" class="field-input" value="${escapeHtml(risk.ownerName || '')}" />
        </div>
        <div class="field-group">
          <label>잔여 Risk 발생 가능성</label>
          <select id="controlResLikelihoodInput" class="field-select">${ratingOptions(risk.residualLikelihood || 2)}</select>
        </div>
        <div class="field-group">
          <label>잔여 Risk 결과 심각성</label>
          <select id="controlResImpactInput" class="field-select">${ratingOptions(risk.residualImpact || 2)}</select>
        </div>
      </div>

      <div class="warning-box" style="margin-top:16px;">
        Control Code는 <strong>C-팀약자-법령코드-리스크일련번호-컨트롤일련번호</strong> 형식으로 자동 생성됩니다.
      </div>

      <div class="modal-actions">
        <button id="controlCreateBtn" class="primary-btn">추가</button>
      </div>
    `);

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('controlCreateBtn').addEventListener('click', () => {
      const payload = {
        controlName: document.getElementById('controlNameInput').value.trim(),
        controlContent: document.getElementById('controlContentInput').value.trim(),
        controlType: document.getElementById('controlTypeInput').value,
        controlOperationType: document.getElementById('controlOperationTypeInput').value,
        controlFrequency: document.getElementById('controlFrequencyInput').value,
        controlDepartment: document.getElementById('controlDepartmentInput').value.trim(),
        controlOwnerName: document.getElementById('controlOwnerNameInput').value.trim(),
        residualLikelihood: Number(document.getElementById('controlResLikelihoodInput').value),
        residualImpact: Number(document.getElementById('controlResImpactInput').value)
      };

      if (!payload.controlName) {
        alert('Control 명을 입력해 주세요.');
        return;
      }

      createControl(riskId, payload);
      closeModal();
    });
  }

  function createFolder(folderName, parentFolderId) {
    const now = nowIso();
    const folderId = nextSimpleId('F', state.db.folders.map((f) => f.folderId));
    const siblings = sortFolders(getChildrenFolders(parentFolderId));
    const folder = {
      folderId,
      folderName,
      parentFolderId,
      folderLevel: calculateFolderLevel(parentFolderId),
      sortOrder: siblings.length + 1,
      isDeleted: false,
      createdAt: now,
      createdBy: state.currentUser.userId,
      updatedAt: now,
      updatedBy: state.currentUser.userId
    };
    state.db.folders.push(folder);
    state.expanded.add(folderId);
    if (parentFolderId) state.expanded.add(parentFolderId);
    state.selectedFolderId = folderId;
    appendLog('folder', folderId, 'create', null, { folderName, parentFolderId });
    markDirtyAndRender();
  }

  function renameFolder(folderId, newName) {
    const folder = getFolderById(folderId);
    if (!folder) return;

    const before = { folderName: folder.folderName };
    folder.folderName = newName;
    folder.updatedAt = nowIso();
    folder.updatedBy = state.currentUser.userId;

    appendLog('folder', folderId, 'rename', before, { folderName: newName });
    markDirtyAndRender();
  }

  function deleteFolder(folderId) {
    const folder = getFolderById(folderId);
    if (!folder) return;

    const subtree = getDescendantFolderIds(folderId);
    const riskIds = getActiveRisks().filter((r) => subtree.includes(r.folderId)).map((r) => r.riskId);
    const controlCount = getActiveControls().filter((c) => riskIds.includes(c.riskId)).length;
    const ok = confirm(`'${folder.folderName}' 폴더를 삭제하시겠습니까?\n\n하위 폴더 ${Math.max(subtree.length - 1, 0)}개, 리스크 ${riskIds.length}건, 컨트롤 ${controlCount}건이 함께 삭제 처리됩니다.`);
    if (!ok) return;

    subtree.forEach((id) => {
      const target = getFolderById(id);
      if (target) {
        target.isDeleted = true;
        target.updatedAt = nowIso();
        target.updatedBy = state.currentUser.userId;
      }
    });

    state.db.risks.forEach((risk) => {
      if (subtree.includes(risk.folderId)) {
        risk.isDeleted = true;
        risk.updatedAt = nowIso();
        risk.updatedBy = state.currentUser.userId;
      }
    });

    state.db.controls.forEach((control) => {
      if (riskIds.includes(control.riskId)) {
        control.isDeleted = true;
        control.updatedAt = nowIso();
        control.updatedBy = state.currentUser.userId;
      }
    });

    appendLog('folder', folderId, 'delete', { folderName: folder.folderName }, null);
    if (subtree.includes(state.selectedFolderId)) state.selectedFolderId = null;
    markDirtyAndRender();
  }

  function createRisk(payload) {
    const now = nowIso();
    const inherent = calculateRating(payload.inherentLikelihood, payload.inherentImpact);
    const residual = calculateRating(payload.residualLikelihood, payload.residualImpact);
    const riskId = generateRiskCode(payload.teamCode, payload.lawCode);

    const risk = {
      riskId,
      folderId: state.selectedFolderId,
      departmentCode: payload.teamCode,
      departmentName: payload.departmentName,
      teamCode: payload.teamCode,
      lawCode: payload.lawCode,
      referenceLaw: payload.referenceLaw,
      regulationDetail: payload.regulationDetail,
      sanction: payload.sanction,
      riskTitle: payload.riskContent,
      riskDescription: payload.riskContent,
      riskContent: payload.riskContent,
      responsibleDepartment: payload.responsibleDepartment,
      ownerName: payload.ownerName,
      ownerUserId: state.currentUser.userId,
      inherentLikelihood: payload.inherentLikelihood,
      inherentImpact: payload.inherentImpact,
      inherentScore: inherent.score,
      inherentRating: inherent.rating,
      residualLikelihood: payload.residualLikelihood,
      residualImpact: payload.residualImpact,
      residualScore: residual.score,
      residualRating: residual.rating,
      status: payload.status,
      entity: inferEntity(state.selectedFolderId),
      country: 'KR',
      isDeleted: false,
      createdAt: now,
      createdBy: state.currentUser.userId,
      updatedAt: now,
      updatedBy: state.currentUser.userId
    };

    state.db.risks.push(risk);
    appendLog('risk', risk.riskId, 'create', null, pickRiskLogFields(risk));
    markDirtyAndRender();
  }

  function createControl(riskId, payload) {
    const risk = getRiskById(riskId);
    if (!risk) return;

    const now = nowIso();
    const controlCode = generateControlCode(risk);
    const control = {
      controlId: controlCode,
      controlCode,
      riskId,
      controlTitle: payload.controlName,
      controlName: payload.controlName,
      controlDescription: payload.controlContent,
      controlContent: payload.controlContent,
      controlType: payload.controlType,
      controlOperationType: payload.controlOperationType,
      controlFrequency: payload.controlFrequency,
      controlOwner: payload.controlDepartment,
      controlDepartment: payload.controlDepartment,
      controlOwnerName: payload.controlOwnerName,
      effectiveness: '',
      isDeleted: false,
      createdAt: now,
      createdBy: state.currentUser.userId,
      updatedAt: now,
      updatedBy: state.currentUser.userId
    };

    state.db.controls.push(control);

    risk.residualLikelihood = Number(payload.residualLikelihood);
    risk.residualImpact = Number(payload.residualImpact);
    const residual = calculateRating(risk.residualLikelihood, risk.residualImpact);
    risk.residualScore = residual.score;
    risk.residualRating = residual.rating;
    risk.updatedAt = now;
    risk.updatedBy = state.currentUser.userId;

    appendLog('control', control.controlId, 'create', null, pickControlLogFields(control));
    appendLog('risk', risk.riskId, 'update', null, pickRiskLogFields(risk));
    markDirtyAndRender();
  }

  function deleteRisk(riskId) {
    const risk = getRiskById(riskId);
    if (!risk) return;

    const controlCount = getControlsByRiskId(riskId).length;
    const ok = confirm(`Risk '${risk.riskId}' 를 삭제하시겠습니까?\n연결된 Control ${controlCount}건도 함께 삭제 처리됩니다.`);
    if (!ok) return;

    const before = pickRiskLogFields(risk);
    risk.isDeleted = true;
    risk.updatedAt = nowIso();
    risk.updatedBy = state.currentUser.userId;

    state.db.controls.forEach((control) => {
      if (control.riskId === riskId && !control.isDeleted) {
        control.isDeleted = true;
        control.updatedAt = nowIso();
        control.updatedBy = state.currentUser.userId;
      }
    });

    appendLog('risk', risk.riskId, 'delete', before, null);
    markDirtyAndRender();
  }

  function deleteControl(controlId) {
    const control = getControlById(controlId);
    if (!control) return;

    const ok = confirm(`Control '${control.controlCode || control.controlId}' 를 삭제하시겠습니까?`);
    if (!ok) return;

    const before = pickControlLogFields(control);
    control.isDeleted = true;
    control.updatedAt = nowIso();
    control.updatedBy = state.currentUser.userId;

    appendLog('control', control.controlId, 'delete', before, null);
    markDirtyAndRender();
  }

  function updateField(targetType, targetId, field, value) {
    if (targetType === 'risk') {
      const risk = getRiskById(targetId);
      if (!risk) return;

      const before = shallowClone(risk);
      risk[field] = ['inherentLikelihood', 'inherentImpact', 'residualLikelihood', 'residualImpact'].includes(field) ? Number(value) : value;

      const inherent = calculateRating(risk.inherentLikelihood, risk.inherentImpact);
      const residual = calculateRating(risk.residualLikelihood, risk.residualImpact);
      risk.inherentScore = inherent.score;
      risk.inherentRating = inherent.rating;
      risk.residualScore = residual.score;
      risk.residualRating = residual.rating;
      risk.updatedAt = nowIso();
      risk.updatedBy = state.currentUser.userId;

      appendLog('risk', risk.riskId, 'update', pickRiskLogFields(before), pickRiskLogFields(risk));
    } else if (targetType === 'control') {
      const control = getControlById(targetId);
      if (!control) return;

      const before = shallowClone(control);
      control[field] = value;
      if (field === 'controlName') control.controlTitle = value;
      if (field === 'controlContent') control.controlDescription = value;
      if (field === 'controlDepartment') control.controlOwner = value;
      control.updatedAt = nowIso();
      control.updatedBy = state.currentUser.userId;

      appendLog('control', control.controlId, 'update', pickControlLogFields(before), pickControlLogFields(control));
    }

    state.isDirty = true;
    render();
  }

  function getVisibleRisks() {
    if (state.selectedRiskId) {
      return getActiveRisks()
        .filter((risk) => risk.riskId === state.selectedRiskId)
        .sort((a, b) => a.riskId.localeCompare(b.riskId));
    }

    const activeFolderIds = state.selectedFolderId ? getDescendantFolderIds(state.selectedFolderId) : getActiveFolders().map((f) => f.folderId);
    return getActiveRisks()
      .filter((risk) => activeFolderIds.includes(risk.folderId))
      .sort((a, b) => a.riskId.localeCompare(b.riskId));
  }

  function getVisibleRCMRows() {
    const keyword = state.search.trim().toLowerCase();

    return getVisibleRisks()
      .flatMap((risk) => {
        const controls = getControlsByRiskId(risk.riskId);
        if (!controls.length) return [{ risk, control: null }];
        return controls.map((control) => ({ risk, control }));
      })
      .filter(({ risk, control }) => {
        if (!keyword) return true;
        const haystack = [
          risk.departmentName,
          risk.riskId,
          risk.referenceLaw,
          risk.regulationDetail,
          risk.sanction,
          risk.riskContent,
          risk.responsibleDepartment,
          risk.ownerName,
          control?.controlCode,
          control?.controlName,
          control?.controlContent,
          control?.controlType,
          control?.controlFrequency,
          control?.controlDepartment,
          control?.controlOwnerName
        ].join(' ').toLowerCase();
        return haystack.includes(keyword);
      });
  }

  function getVisibleRowsForExport() {
    return getVisibleRCMRows().map(({ risk, control }) => ({
      departmentName: risk.departmentName || '',
      riskCode: risk.riskId || '',
      referenceLaw: risk.referenceLaw || '',
      regulationDetail: risk.regulationDetail || '',
      sanction: risk.sanction || '',
      riskContent: risk.riskContent || '',
      inherentLikelihood: risk.inherentLikelihood || '',
      inherentImpact: risk.inherentImpact || '',
      inherentRating: risk.inherentRating || '',
      controlCode: control?.controlCode || '',
      controlName: control?.controlName || '',
      controlContent: control?.controlContent || '',
      controlType: control?.controlType || '',
      controlOperationType: control?.controlOperationType || '',
      controlFrequency: control?.controlFrequency || '',
      responsibleDepartment: control?.controlDepartment || risk.responsibleDepartment || '',
      ownerName: control?.controlOwnerName || risk.ownerName || '',
      residualLikelihood: risk.residualLikelihood || '',
      residualImpact: risk.residualImpact || '',
      residualRating: risk.residualRating || '',
      status: risk.status || ''
    }));
  }

  function getActiveFolders() {
    return (state.db.folders || []).filter((f) => !f.isDeleted);
  }

  function getActiveRisks() {
    return (state.db.risks || []).filter((r) => !r.isDeleted);
  }

  function getActiveControls() {
    return (state.db.controls || []).filter((c) => !c.isDeleted);
  }

  function getFolderById(folderId) {
    return (state.db.folders || []).find((f) => f.folderId === folderId && !f.isDeleted) || null;
  }

  function getRiskById(riskId) {
    return (state.db.risks || []).find((r) => r.riskId === riskId && !r.isDeleted) || null;
  }

  function getControlById(controlId) {
    return (state.db.controls || []).find((c) => c.controlId === controlId && !c.isDeleted) || null;
  }

  function getControlsByRiskId(riskId) {
    return getActiveControls()
      .filter((c) => c.riskId === riskId)
      .sort((a, b) => (a.controlCode || a.controlId).localeCompare(b.controlCode || b.controlId));
  }

  function getChildrenFolders(parentFolderId) {
    return getActiveFolders().filter((f) => (f.parentFolderId || null) === (parentFolderId || null));
  }

  function getDescendantFolderIds(folderId) {
    const ids = [folderId];
    const walk = (parentId) => {
      getChildrenFolders(parentId).forEach((child) => {
        ids.push(child.folderId);
        walk(child.folderId);
      });
    };
    walk(folderId);
    return ids;
  }

  function matchesTreeSearch(folderId) {
    const keyword = state.treeSearch.trim().toLowerCase();
    if (!keyword) return true;
    const folder = getFolderById(folderId);
    if (!folder) return false;
    if (folder.folderName.toLowerCase().includes(keyword)) return true;
    return getDescendantFolderIds(folderId).some((id) => {
      const child = getFolderById(id);
      return child && child.folderName.toLowerCase().includes(keyword);
    });
  }

  function initializeExpanded() {
    state.expanded.clear();
    getActiveFolders().forEach((folder) => {
      if (!folder.parentFolderId) state.expanded.add(folder.folderId);
    });
  }

  function buildFolderPath(folderId) {
    const parts = [];
    let current = getFolderById(folderId);
    while (current) {
      parts.unshift(current.folderName);
      current = current.parentFolderId ? getFolderById(current.parentFolderId) : null;
    }
    return parts;
  }

  function calculateFolderLevel(parentFolderId) {
    const parent = parentFolderId ? getFolderById(parentFolderId) : null;
    return parent ? Number(parent.folderLevel || 1) + 1 : 1;
  }

  function inferDepartmentCode(folderId) {
    const path = buildFolderPath(folderId);
    const base = (path[0] || 'GEN').replace(/[^A-Za-z]/g, '').toUpperCase();
    return (base || 'GEN').slice(0, 3);
  }

  function inferEntity(folderId) {
    const path = buildFolderPath(folderId);
    return path[0] || '';
  }

  function inferTeamCodeFromRisk(risk) {
    const match = String(risk.riskId || '').match(/^R-([A-Z]+)-(\d{2})-(\d{2})$/);
    return match ? match[1] : '';
  }

  function generateRiskCode(teamCode, lawCode) {
    const sequence = nextRiskSequence(teamCode, lawCode);
    return `R-${teamCode}-${pad2(lawCode)}-${pad2(sequence)}`;
  }

  function generateControlCode(risk) {
    const match = String(risk.riskId).match(/^R-([A-Z]+)-(\d{2})-(\d{2})$/);
    if (!match) {
      const fallbackSeq = pad2(getControlsByRiskId(risk.riskId).length + 1);
      return `C-${String(risk.riskId).replace(/[^A-Za-z0-9-]/g, '').slice(0, 20)}-${fallbackSeq}`;
    }
    const [, teamCode, lawCode, riskSeq] = match;
    const controlSeq = pad2(nextControlSequence(risk.riskId));
    return `C-${teamCode}-${lawCode}-${riskSeq}-${controlSeq}`;
  }

  function nextRiskSequence(teamCode, lawCode) {
    const prefix = `R-${teamCode}-${pad2(lawCode)}-`;
    const seqs = getActiveRisks()
      .map((risk) => {
        const id = String(risk.riskId || '');
        if (!id.startsWith(prefix)) return 0;
        const parts = id.split('-');
        return Number(parts[3] || 0);
      });
    return Math.max(0, ...seqs) + 1;
  }

  function nextControlSequence(riskId) {
    const riskMatch = String(riskId).match(/^R-([A-Z]+)-(\d{2})-(\d{2})$/);
    if (!riskMatch) return getControlsByRiskId(riskId).length + 1;
    const [, teamCode, lawCode, riskSeq] = riskMatch;
    const prefix = `C-${teamCode}-${lawCode}-${riskSeq}-`;
    const seqs = getActiveControls()
      .map((control) => {
        const code = String(control.controlCode || control.controlId || '');
        if (!code.startsWith(prefix)) return 0;
        const parts = code.split('-');
        return Number(parts[4] || 0);
      });
    return Math.max(0, ...seqs) + 1;
  }

  function calculateRating(likelihood, impact) {
    const score = Number(likelihood) * Number(impact);
    const rating = score <= 6 ? 'Low' : score <= 14 ? 'Medium' : 'High';
    return { score, rating };
  }

  function renderBadge(value) {
    const key = String(value || '').toLowerCase();
    const cls = key === 'low' ? 'low' : key === 'medium' ? 'medium' : key === 'high' ? 'high' : 'empty';
    return `<span class="badge ${cls}">${escapeHtml(value || '-')}</span>`;
  }

  function ratingOptions(selected) {
    return [1,2,3,4,5].map((n) => `<option value="${n}" ${Number(selected) === n ? 'selected' : ''}>${n}</option>`).join('');
  }

  function sortFolders(list) {
    return [...list].sort((a, b) => {
      const byOrder = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
      return byOrder || a.folderName.localeCompare(b.folderName, 'ko');
    });
  }

  function saveDatabase() {
    persistDatabase();
    state.isDirty = false;
    render();
  }

  function markDirtyAndRender() {
    state.isDirty = true;
    persistDatabase();
    render();
  }

  function persistDatabase() {
    localStorage.setItem(STORAGE_DB_KEY, JSON.stringify(state.db));
  }

  function appendLog(targetType, targetId, actionType, beforeValue, afterValue) {
    const log = {
      logId: nextSimpleId('L', state.db.change_logs.map((l) => l.logId)),
      targetType,
      targetId,
      actionType,
      beforeValue,
      afterValue,
      changedAt: nowIso(),
      changedBy: state.currentUser.userId
    };
    state.db.change_logs.push(log);
  }

  function pickRiskLogFields(risk) {
    return {
      riskId: risk.riskId,
      departmentName: risk.departmentName,
      referenceLaw: risk.referenceLaw,
      regulationDetail: risk.regulationDetail,
      sanction: risk.sanction,
      riskContent: risk.riskContent,
      inherentLikelihood: risk.inherentLikelihood,
      inherentImpact: risk.inherentImpact,
      inherentRating: risk.inherentRating,
      responsibleDepartment: risk.responsibleDepartment,
      ownerName: risk.ownerName,
      residualLikelihood: risk.residualLikelihood,
      residualImpact: risk.residualImpact,
      residualRating: risk.residualRating
    };
  }

  function pickControlLogFields(control) {
    return {
      controlId: control.controlId,
      controlCode: control.controlCode,
      riskId: control.riskId,
      controlName: control.controlName,
      controlContent: control.controlContent,
      controlType: control.controlType,
      controlOperationType: control.controlOperationType,
      controlFrequency: control.controlFrequency,
      controlDepartment: control.controlDepartment,
      controlOwnerName: control.controlOwnerName
    };
  }

  function nextSimpleId(prefix, values) {
    const max = values.reduce((acc, value) => {
      const num = Number(String(value || '').replace(prefix, ''));
      return Number.isFinite(num) ? Math.max(acc, num) : acc;
    }, 0);
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  }

  function pad2(value) {
    return String(value || '').replace(/\D/g, '').padStart(2, '0').slice(-2);
  }

  function convertRowsToCsv(rows) {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const escapeCsv = (v) => {
      const text = String(v ?? '');
      if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
      return text;
    };
    return [headers.join(','), ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(','))].join('\n');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function openModal(content) {
    document.body.classList.add('modal-open');
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-box">${content}</div>
      </div>
    `;
    const overlay = document.getElementById('modalOverlay');
    overlay.addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') closeModal();
    });
  }

  function closeModal() {
    document.body.classList.remove('modal-open');
    const root = document.getElementById('modalRoot');
    if (root) root.innerHTML = '';
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function shallowClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isManager() {
    return state.currentUser && String(state.currentUser.role).toLowerCase() === 'manager';
  }

  function blockViewerAction() {
    alert('Manager 계정만 수정할 수 있습니다.');
  }

  function columnLabel(col) {
    const labels = {
      departmentName: '부서',
      riskId: 'Risk Code',
      referenceLaw: '관련규정',
      regulationDetail: '규정세부내용',
      sanction: '관련 제재',
      riskContent: 'Risk 내용',
      inherentLikelihood: '고유 Risk\n발생가능성',
      inherentImpact: '고유 Risk\n결과 심각성',
      inherentRating: '고유 Risk\nRating',
      controlCode: 'Control\nCode',
      controlName: 'Control 명',
      controlContent: 'Control 내용',
      controlType: '통제 유형',
      controlOperationType: '통제 수행\n방식',
      controlFrequency: '통제\n주기',
      responsibleDepartment: '담당부서',
      ownerName: '담당자',
      residualLikelihood: '잔여 Risk\n발생 가능성',
      residualImpact: '잔여 Risk\n결과 심각성',
      residualRating: '잔여 Risk\nRating',
      status: 'Status',
      actions: 'Actions'
    };
    return labels[col] || col;
  }

  function formatHeaderLabel(value) {
    return escapeHtml(value).replace(/\n/g, '<br>');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();