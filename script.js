(() => {

const SUPABASE_URL = "https://zdcfvnestdbckibhiakb.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_iPLYQMYoAreDwa66gN7lNw_DUs4xZf8";
  const SUPABASE_BUCKET = "monitoring-files";

  const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;
console.log("Supabase connected:", !!supabaseClient);

  const STORAGE_DB_KEY = 'rcm_json_model_db_v4';
  const STORAGE_SESSION_KEY = 'rcm_json_model_session_v3';
  const STORAGE_UI_KEY = 'rcm_json_model_ui_v1';
  const DATA_FILES = ['users', 'folders', 'risks', 'controls', 'change_logs'];

  const EMPTY_DB_TEMPLATE = {
    users: [
      {
        userId: 'U001',
        username: 'Manager',
        password: '0000',
        role: 'manager',
        displayName: 'Manager',
        isActive: true
      },
      {
        userId: 'U002',
        username: 'User',
        password: '0000',
        role: 'user',
        displayName: 'User',
        isActive: true
      }
    ],
    folders: [],
    risks: [],
    controls: [],
    change_logs: [],
    monitoring_records: [],
    monitoring_evidence_files: []
  };

  function cloneDbTemplate() {
    return JSON.parse(JSON.stringify(EMPTY_DB_TEMPLATE));
  }

  const state = {
    db: null,
    currentUser: loadSession(),
    selectedFolderId: null,
    selectedRiskId: null,
    currentModule: 'rcm',
    monitoringYear: 2026,
    search: '',
    treeSearch: '',
    expanded: new Set(),
    isDirty: false,
    heatmapFilter: null
  };

  const savedUiState = loadUiState();
  if (savedUiState) {
    state.selectedFolderId = savedUiState.selectedFolderId || state.selectedFolderId;
    state.treeSearch = savedUiState.treeSearch || state.treeSearch;
    state.currentModule = savedUiState.currentModule || state.currentModule;
    state.monitoringYear = Number(savedUiState.monitoringYear || state.monitoringYear);
    state.expanded = new Set(Array.isArray(savedUiState.expandedFolderIds) ? savedUiState.expandedFolderIds : []);
  }

  window.__icmGoModule = (moduleName) => {
    state.currentModule = moduleName;
    state.search = '';
    if (state.currentModule !== 'rcm') state.selectedRiskId = null;
    persistUiState();
    render();
  };

  window.__icmSetMonitoringYear = (yearValue) => {
    const year = Number(String(yearValue).replace(/[^0-9]/g, ''));
    if (!Number.isFinite(year) || year < 2026 || year > 2035) return;
    state.currentModule = 'monitoring';
    state.monitoringYear = year;
    state.search = '';
    ensureMonitoringRecordsForYear(year);
    persistUiState();
    render();
  };

  init();

  async function init() {
    renderLoading();
    state.db = await loadDatabase();
    normalizeDatabase();
    initializeExpanded();
    if (state.selectedFolderId && !getFolderById(state.selectedFolderId)) state.selectedFolderId = null;
    persistUiState();
    render();
  }

async function loadDatabase() {
  // localStorage가 이미 최신 데이터라면 우선 사용
  const localRaw = localStorage.getItem(STORAGE_DB_KEY);
  if (localRaw) {
    try {
      return JSON.parse(localRaw);
    } catch (error) {
      console.error('Failed to parse local database:', error);
    }
  }

  const foldersRes = await supabase.from('folders').select('*');
  const risksRes = await supabase.from('risks').select('*');
  const controlsRes = await supabase.from('controls').select('*');
  const logsRes = await supabase.from('change_logs').select('*');
  const monitoringRes = await supabase.from('monitoring_records').select('*');
  const evidenceRes = await supabase.from('monitoring_evidence_files').select('*');

  return {
    users: [
      {
        userId: 'U001',
        username: 'Manager',
        password: '0000',
        role: 'manager',
        displayName: 'Manager',
        isActive: true
      },
      {
        userId: 'U002',
        username: 'User',
        password: '0000',
        role: 'user',
        displayName: 'User',
        isActive: true
      }
    ],

    folders: (foldersRes.data || []).map(row => ({
      folderId: row.folder_id,
      folderName: row.folder_name,
      parentFolderId: row.parent_folder_id,
      folderLevel: row.folder_level,
      sortOrder: row.sort_order,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    })),

    risks: (risksRes.data || []).map(row => ({
      riskId: row.risk_id,
      folderId: row.folder_id,
      riskCode: row.risk_code,
      departmentName: row.department_name,
      teamCode: row.team_code,
      lawCode: row.law_code,
      referenceLaw: row.reference_law,
      regulationDetail: row.regulation_detail,
      sanction: row.sanction,
      riskTitle: row.risk_title,
      riskDescription: row.risk_description,
      riskContent: row.risk_content,
      riskContext: row.risk_context,
      responsibleDepartment: row.responsible_department,
      ownerName: row.owner_name,
      inherentLikelihood: row.inherent_likelihood,
      inherentImpact: row.inherent_impact,
      inherentScore: row.inherent_score,
      inherentRating: row.inherent_rating,
      residualLikelihood: row.residual_likelihood,
      residualImpact: row.residual_impact,
      residualScore: row.residual_score,
      residualRating: row.residual_rating,
      status: row.status,
      entity: row.entity,
      country: row.country,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    })),

    controls: (controlsRes.data || []).map(row => ({
      controlId: row.control_id,
      controlCode: row.control_code,
      riskId: row.risk_id,
      controlTitle: row.control_title,
      controlName: row.control_name,
      controlDescription: row.control_description,
      controlContent: row.control_content,
      controlType: row.control_type,
      controlOperationType: row.control_operation_type,
      controlFrequency: row.control_frequency,
      controlDepartment: row.control_department,
      controlOwnerName: row.control_owner_name,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    })),

    change_logs: (logsRes.data || []).map(row => ({
      logId: row.log_id,
      targetType: row.target_type,
      targetId: row.target_id,
      actionType: row.action_type,
      beforeValue: row.before_value,
      afterValue: row.after_value,
      changedAt: row.changed_at,
      changedBy: row.changed_by
    })),

    monitoring_records: (monitoringRes.data || []).map(row => ({
      recordId: row.record_id,
      year: row.year,
      controlId: row.control_id,
      riskId: row.risk_id,
      evidenceFile: row.evidence_file,
      uploadedAt: row.uploaded_at,
      submissionStatus: row.submission_status,
      reviewResult: row.review_result,
      reviewComment: row.review_comment,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    })),

    monitoring_evidence_files: (evidenceRes.data || []).map(row => ({
      fileId: row.file_id,
      recordId: row.record_id,
      controlId: row.control_id,
      riskId: row.risk_id,
      year: row.year,
      fileName: row.file_name,
      fileLink: row.file_link,
      description: row.description,
      uploadedBy: row.uploaded_by,
      uploadedAt: row.uploaded_at,
      isDeleted: row.is_deleted
    }))

  };
}

  function loadUiState() {
    const raw = localStorage.getItem(STORAGE_UI_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse UI state:', e);
      return null;
    }
  }

  function persistUiState() {
    const payload = {
      selectedFolderId: state.selectedFolderId || null,
      treeSearch: state.treeSearch || '',
      currentModule: state.currentModule || 'rcm',
      monitoringYear: Number(state.monitoringYear || 2026),
      expandedFolderIds: Array.from(state.expanded || [])
    };
    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify(payload));
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
    state.db.monitoring_evidence_files = state.db.monitoring_evidence_files || [];
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
            <div>${renderSidebarSelectionChip(selectedFolder)}</div>
          </div>

          ${state.currentModule === 'rcm' ? `
            <div class="folder-action-panel">
              <div class="folder-action-title">Folder Actions</div>
              <div class="folder-action-row">
                <button id="addRootFolderBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">+ 상위 폴더</button>
                <button id="addChildFolderBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">+ 하위 폴더</button>
              </div>
              <div class="folder-action-row">
                <button id="deleteSelectedFolderBtn" class="danger-btn ${isManager() ? '' : 'viewer-readonly'}">선택 폴더 삭제</button>
              </div>
              <div class="folder-summary">
                ${renderSelectedFolderSummary(selectedFolder)}
              </div>
            </div>
          ` : ''}

          <div class="module-nav">
            <button type="button" class="module-btn ${state.currentModule === 'rcm' ? 'active' : ''}" data-module="rcm" onclick="window.__icmGoModule('rcm')">RCM Master</button>
            <div id="treeRoot" class="tree-root tree-under-rcm ${state.currentModule === 'rcm' ? '' : 'hidden'}"></div>

            <button type="button" class="module-btn ${state.currentModule === 'monitoring' ? 'active' : ''}" data-module="monitoring" onclick="window.__icmGoModule('monitoring')">Monitoring</button>
            <div class="module-subnav">
              <label class="year-select-label" for="monitoringYearSelect">연도 선택</label>
              <select id="monitoringYearSelect" class="year-select" autocomplete="off" onchange="window.__icmSetMonitoringYear(this.value)">
                ${Array.from({ length: 10 }, (_, i) => 2026 + i).map((year) => `
                  <option value="FY${year}" ${Number(state.monitoringYear) === year ? 'selected' : ''}>FY${year}</option>
                `).join('')}
              </select>
            </div>

            <button type="button" class="module-btn ${state.currentModule === 'dashboard' ? 'active' : ''}" data-module="dashboard" onclick="window.__icmGoModule('dashboard')">Dashboard</button>
          </div>

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
    bindHeatmapEvents();
  }

  function renderSidebarSelectionChip(selectedFolder) {
    if (state.currentModule === 'monitoring') {
      return `<span class="selection-chip">Monitoring Year: ${escapeHtml(String(state.monitoringYear))}</span>`;
    }

    if (state.currentModule === 'rcm' && state.heatmapFilter) {
      const modeLabel = state.heatmapFilter.mode === 'inherent' ? '고유 Risk' : '잔여 Risk';
      return `<span class="selection-chip">Heatmap Filter: ${escapeHtml(modeLabel)} / 결과심각성 ${escapeHtml(String(state.heatmapFilter.impact))} / 발생가능성 ${escapeHtml(String(state.heatmapFilter.like))}</span>`;
    }

    if (state.selectedRiskId) {
      return `<span class="selection-chip">선택 Risk: ${escapeHtml(state.selectedRiskId)}</span>`;
    }

    if (selectedFolder) {
      return `<span class="selection-chip">선택 폴더: ${escapeHtml(selectedFolder.folderName)}</span>`;
    }

    return '<span class="selection-chip">선택 폴더 없음 (상위 폴더 생성)</span>';
  }

  function renderSelectedFolderSummary(selectedFolder) {
    if (!selectedFolder) return '<div class="folder-summary-empty">선택된 폴더가 없습니다. 상위 폴더부터 생성해 주세요.</div>';
    const childFolders = getChildrenFolders(selectedFolder.folderId).length;
    const descendantIds = getDescendantFolderIds(selectedFolder.folderId);
    const risks = getActiveRisks().filter((risk) => descendantIds.includes(risk.folderId));
    const controls = getActiveControls().filter((control) => risks.some((risk) => risk.riskId === control.riskId));
    return `
      <div class="folder-summary-path">${escapeHtml(buildFolderPath(selectedFolder.folderId).join(' > '))}</div>
      <div class="folder-summary-stats">하위 폴더 <strong>${childFolders}</strong> · Risk <strong>${risks.length}</strong> · Control <strong>${controls.length}</strong></div>
      <div class="folder-summary-help">폴더 삭제는 하위 폴더가 있더라도 Risk / Control 데이터가 없을 때만 허용됩니다.</div>
    `;
  }

  function renderMainContent(selectedFolder) {
    if (state.currentModule === 'monitoring') return renderMonitoringContent();
    if (state.currentModule === 'dashboard') return renderDashboardContent();
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
          <button id="moveRiskBtn" class="ghost-btn ${isManager() && state.selectedRiskId ? '' : 'viewer-readonly'}">선택 Risk 이동</button>
          <button id="saveBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">저장</button>
          <button id="resetBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">원본으로 되돌리기</button>
          ${state.heatmapFilter ? `<button id="clearHeatmapFilterBtn" class="ghost-btn">Heatmap Filter 해제</button>` : ''}
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
          <div id="currentFilter">${renderCurrentFilterLabel(selectedFolder)}</div>
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

  function renderCurrentFilterLabel(selectedFolder) {
    if (state.heatmapFilter) {
      const modeLabel = state.heatmapFilter.mode === 'inherent' ? '고유 Risk' : '잔여 Risk';
      return `${modeLabel} / 결과심각성 ${state.heatmapFilter.impact} / 발생가능성 ${state.heatmapFilter.like}`;
    }
    if (state.selectedRiskId) return `Risk: ${escapeHtml(state.selectedRiskId)}`;
    if (selectedFolder) return `${escapeHtml(buildFolderPath(selectedFolder.folderId).join(' > '))}`;
    return '전체 보기';
  }

  function renderMonitoringContent() {
    ensureMonitoringRecordsForYear(state.monitoringYear);
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
        <article class="stat-card"><span class="stat-label">Uploaded</span><strong>${rows.filter(r => r.evidenceCount > 0).length}</strong></article>
        <article class="stat-card"><span class="stat-label">적합 / 미흡 / 부적합</span><strong>${rows.filter(r => r.reviewResult === '적합').length} / ${rows.filter(r => r.reviewResult === '미흡').length} / ${rows.filter(r => r.reviewResult === '부적합').length}</strong></article>
        <article class="stat-card"><span class="stat-label">Pending Review</span><strong>${rows.filter(r => r.evidenceCount > 0 && !r.reviewResult).length}</strong></article>
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

  function renderDashboardContent() {
    const monitoringRows = getMonitoringRows();
    const uploaded = monitoringRows.filter(r => r.evidenceCount > 0).length;
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
        <article class="stat-card"><span class="stat-label">미제출</span><strong>${monitoringRows.filter(r => r.evidenceCount === 0).length}</strong></article>
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
              <div><span>검토대기</span><strong>${monitoringRows.filter(r => r.evidenceCount > 0 && !r.reviewResult).length}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section class="table-card heatmap-section">
        <div class="table-meta">
          <div>Risk Heatmap</div>
          <div class="status-text">Company Standard</div>
        </div>
        <div class="dashboard-grid heatmap-grid">
          <div class="dashboard-panel">
            <h3>고유 Risk Heatmap</h3>
            ${renderHeatmapPanel('inherentLikelihood', 'inherentImpact', 'inherent')}
          </div>
          <div class="dashboard-panel">
            <h3>잔여 Risk Heatmap</h3>
            ${renderHeatmapPanel('residualLikelihood', 'residualImpact', 'residual')}
          </div>
        </div>
      </section>
    `;
  }

  function bindAppEvents() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        closeModal();
        localStorage.removeItem(STORAGE_SESSION_KEY);
        state.currentUser = null;
        render();
      });
    }

    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        if (!confirm('브라우저에 저장된 데이터와 로그인 세션을 초기화할까요?')) return;

        localStorage.removeItem(STORAGE_SESSION_KEY);
        localStorage.removeItem('rcm_json_model_db_v2');

        state.currentUser = null;
        state.selectedFolderId = null;
        state.selectedRiskId = null;
        state.search = '';
        state.treeSearch = '';
        state.heatmapFilter = null;
        state.expanded = new Set();

        state.db = cloneDbTemplate();

        persistDatabase();
        normalizeDatabase();

        state.isDirty = false;

        initializeExpanded();
        persistUiState();

        render();
      });
    }

    const treeSearchInput = document.getElementById('treeSearchInput');
    if (treeSearchInput) {
      treeSearchInput.addEventListener('input', (e) => {
        state.treeSearch = e.target.value.trim();
        if (state.currentModule === 'rcm') renderTree();
      });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.search = e.target.value.trim();
        render();
      });
    }

    const monitoringYearSelect = document.getElementById('monitoringYearSelect');
    if (monitoringYearSelect) {
      monitoringYearSelect.value = `FY${state.monitoringYear}`;
      monitoringYearSelect.addEventListener('change', (e) => {
        window.__icmSetMonitoringYear(e.target.value);
      });
    }

    document.querySelectorAll('[data-module]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.currentModule = btn.getAttribute('data-module');
        state.search = '';
        if (state.currentModule !== 'rcm') state.selectedRiskId = null;
        persistUiState();
        render();
      });
    });

    const clearHeatmapFilterBtn = document.getElementById('clearHeatmapFilterBtn');
    if (clearHeatmapFilterBtn) {
      clearHeatmapFilterBtn.addEventListener('click', () => {
        state.heatmapFilter = null;
        state.search = '';
        state.selectedRiskId = null;
        render();
      });
    }

    const addRootFolderBtn = document.getElementById('addRootFolderBtn');
    if (addRootFolderBtn) {
      addRootFolderBtn.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        openFolderModal(null);
      });
    }

    const addChildFolderBtn = document.getElementById('addChildFolderBtn');
    if (addChildFolderBtn) {
      addChildFolderBtn.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        if (!state.selectedFolderId) {
          alert('하위 폴더를 생성하려면 먼저 상위 폴더를 선택해 주세요.');
          return;
        }
        openFolderModal(state.selectedFolderId);
      });
    }

    const deleteSelectedFolderBtn = document.getElementById('deleteSelectedFolderBtn');
    if (deleteSelectedFolderBtn) {
      deleteSelectedFolderBtn.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        if (!state.selectedFolderId) {
          alert('삭제할 폴더를 먼저 선택해 주세요.');
          return;
        }
        deleteFolder(state.selectedFolderId);
      });
    }

    const addRiskBtn = document.getElementById('addRiskBtn');
    if (addRiskBtn) {
      addRiskBtn.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        if (!state.selectedFolderId) {
          alert('리스크를 추가하려면 먼저 폴더를 선택해 주세요.');
          return;
        }
        openRiskModal();
      });
    }

    const moveRiskBtn = document.getElementById('moveRiskBtn');
    if (moveRiskBtn) {
      moveRiskBtn.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        if (!state.selectedRiskId) {
          alert('이동할 Risk를 먼저 선택해 주세요.');
          return;
        }
        openMoveRiskModal(state.selectedRiskId);
      });
    }

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        saveDatabase();
      });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        if (!confirm('모든 데이터를 삭제하고 빈 상태로 되돌릴까요?')) return;

        state.selectedFolderId = null;
        state.selectedRiskId = null;
        state.search = '';
        state.treeSearch = '';
        state.heatmapFilter = null;
        state.expanded = new Set();

        state.db = cloneDbTemplate();

        persistDatabase();
        normalizeDatabase();

        state.isDirty = false;

        initializeExpanded();
        persistUiState();

        render();
      });
    }

    const jsonBtn = document.getElementById('downloadJsonBtn');
    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => {
        const payload = state.currentModule === 'monitoring' ? getMonitoringRowsForExport() : state.db;
        downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }), state.currentModule === 'monitoring' ? `Monitoring_${state.monitoringYear}.json` : 'RCM_DB.json');
      });
    }

    const csvBtn = document.getElementById('downloadCsvBtn');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        const rows = state.currentModule === 'monitoring' ? getMonitoringRowsForExport() : getVisibleRowsForExport();
        const csv = convertRowsToCsv(rows);
        downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), state.currentModule === 'monitoring' ? `Monitoring_${state.monitoringYear}.csv` : 'RCM_Rows.csv');
      });
    }

    const excelBtn = document.getElementById('downloadExcelBtn');
    if (excelBtn) {
      excelBtn.addEventListener('click', () => {
        if (typeof XLSX === 'undefined') {
          alert('Excel 다운로드 라이브러리를 불러오지 못했습니다.');
          return;
        }
        const exportRows = state.currentModule === 'monitoring' ? getMonitoringRowsForExport() : getVisibleRowsForExport();
        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, state.currentModule === 'monitoring' ? 'Monitoring' : 'RCM');
        XLSX.writeFile(workbook, state.currentModule === 'monitoring' ? `Monitoring_${state.monitoringYear}.xlsx` : 'RCM_Rows.xlsx');
      });
    }

    bindMonitoringEvents();
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

  function bindHeatmapEvents() {
    document.querySelectorAll('.heatmap-cell').forEach((cell) => {
      if (cell.dataset.bound === 'Y') return;
      cell.dataset.bound = 'Y';

      cell.addEventListener('click', () => {
        const like = Number(cell.dataset.like || 0);
        const impact = Number(cell.dataset.impact || 0);
        const mode = cell.dataset.mode || 'residual';

        if (!like || !impact) return;

        const sameFilter =
          state.heatmapFilter &&
          state.heatmapFilter.mode === mode &&
          Number(state.heatmapFilter.like) === like &&
          Number(state.heatmapFilter.impact) === impact;

        if (sameFilter) {
          state.heatmapFilter = null;
          state.search = '';
          state.selectedRiskId = null;
          state.currentModule = 'rcm';
          render();
          return;
        }

        state.heatmapFilter = { mode, like, impact };
        state.search = '';
        state.selectedRiskId = null;
        state.currentModule = 'rcm';
        render();
      });
    });
  }

function renderMonitoringEvidenceCell(row) {
  if (!row.controlId) return '<div class="readonly-cell"></div>';

  const files = getEvidenceFilesByRecordId(row.recordId);

  let fileHtml = '';

  if (!files.length) {
    fileHtml = `<div class="readonly-cell muted">미업로드</div>`;
  } else {
    fileHtml = files.map(f => `
      <div class="evidence-file-row">
        ${f.fileLink
          ? `<a href="${f.fileLink}" target="_blank">${escapeHtml(f.fileName)}</a>`
          : `<span>${escapeHtml(f.fileName)}</span>`
        }
      </div>
    `).join('');
  }

  return `
    <div class="evidence-file-list">
      ${fileHtml}
    </div>
    <button class="ghost-btn small-btn" data-monitoring-upload="${row.controlId}">
      ${isManager() ? '증빙 업로드' : 'Upload'}
    </button>
  `;
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

  function ensureMonitoringRecordsForYear(yearValue) {
    const year = Number(String(yearValue).replace(/[^0-9]/g, ''));
    if (!Number.isFinite(year)) return;
    state.monitoringYear = year;
    state.db.monitoring_records = state.db.monitoring_records || [];
    getActiveControls().forEach((control) => {
      const risk = getRiskById(control.riskId);
      let record = state.db.monitoring_records.find((r) => Number(r.year) === year && r.controlId === control.controlId);
      if (!record) {
        record = {
          recordId: nextSimpleId('M', state.db.monitoring_records.map((r) => r.recordId)),
          year,
          controlId: control.controlId,
          riskId: risk?.riskId,
          evidenceFile: '',
          uploadedAt: '',
          submissionStatus: '제출대기',
          reviewResult: '',
          reviewComment: ''
        };
        state.db.monitoring_records.push(record);
      }
    });
  }

function getMonitoringRows() {
  const keyword = state.search.trim().toLowerCase();
  return getActiveControls().map((control) => {
    const risk = getRiskById(control.riskId);
    const record = getOrCreateMonitoringRecord(control.controlId, risk?.riskId);
    const evidenceFiles = getEvidenceFilesByRecordId(record.recordId);

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
      evidenceFiles,
      evidenceCount: evidenceFiles.length,
      uploadedAt: record.uploadedAt || '',
      submissionStatus: record.submissionStatus || '제출대기',
      reviewResult: record.reviewResult || '',
      reviewComment: record.reviewComment || ''
    };
  }).filter((row) => {
    if (Number(row.year) !== Number(state.monitoringYear)) return false;
    if (!keyword) return true;
    const haystack = [
      row.departmentName,
      row.riskId,
      row.controlCode,
      row.controlName,
      row.controlOwnerName,
      row.reviewResult,
      row.submissionStatus
    ].join(' ').toLowerCase();
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
      evidenceCount: row.evidenceCount,
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

function getEvidenceFilesByRecordId(recordId) {
  return (state.db.monitoring_evidence_files || [])
    .filter((file) => !file.isDeleted && file.recordId === recordId)
    .sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
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
  const files = getEvidenceFilesByRecordId(record.recordId);

  openModal(`
    <div class="modal-header">
      <h3>증빙 등록</h3>
      <button id="modalCloseBtn" class="ghost-btn">닫기</button>
    </div>

    <div class="kv-list" style="margin-bottom:16px;">
      <div>연도</div><div>${state.monitoringYear}</div>
      <div>Risk Code</div><div class="mono">${escapeHtml(risk?.riskCode || risk?.riskId || '')}</div>
      <div>Control Code</div><div class="mono">${escapeHtml(control?.controlCode || control?.controlId || '')}</div>
      <div>Control 명</div><div>${escapeHtml(control?.controlName || control?.controlTitle || '')}</div>
    </div>

    <div class="field-group">
      <label>기존 증빙 목록</label>
      <div id="evidenceExistingList" class="evidence-existing-list">
        ${
          files.length
            ? files.map(file => `
              <div class="evidence-existing-item">
                <div><strong>${escapeHtml(file.fileName || '')}</strong></div>
                <div class="mono">${file.fileLink ? `<a href="${file.fileLink}" target="_blank" rel="noopener noreferrer">다운로드</a>` : '-'}</div>
                <div>${escapeHtml(file.description || '')}</div>
              </div>
            `).join('')
            : '<div class="readonly-cell muted">등록된 증빙이 없습니다.</div>'
        }
      </div>
    </div>

    <hr style="margin:16px 0;" />

     <div id="evidenceEntryWrap">
      <div class="evidence-entry" data-evidence-entry="1" style="border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:12px;">
        <div class="field-group">
          <label>첨부파일</label>
          <input type="file" class="field-input" data-evidence-file />
          <div class="readonly-cell muted" data-evidence-file-name style="margin-top:8px;">
            선택된 파일이 없습니다.
          </div>
        </div>
        <div class="field-group" style="margin-top:10px;">
          <label>설명</label>
          <input class="field-input" data-evidence-description placeholder="예: 1분기 수행 증빙" />
        </div>
      </div>
    </div>

    <div class="modal-actions" style="justify-content:space-between;">
      <button id="addEvidenceRowBtn" class="ghost-btn">+ 행 추가</button>
      <div style="display:flex; gap:8px;">
        <button id="evidenceSaveBtn" class="primary-btn">저장</button>
      </div>
    </div>
  `);

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);

  function bindEvidenceFileNamePreview(target) {
    const scope = target || document;

    scope.querySelectorAll('[data-evidence-file]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        const fileNameBox = e.target.parentElement.querySelector('[data-evidence-file-name]');
        if (!fileNameBox) return;
        fileNameBox.textContent = file ? file.name : '선택된 파일이 없습니다.';
      });
    });
  }

  bindEvidenceFileNamePreview(document);

  document.getElementById('addEvidenceRowBtn').addEventListener('click', () => {
    const wrap = document.getElementById('evidenceEntryWrap');
    const div = document.createElement('div');
    div.className = 'evidence-entry';
    div.setAttribute('data-evidence-entry', '1');
    div.style.border = '1px solid #ddd';
    div.style.padding = '12px';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '12px';

    div.innerHTML = `
      <div class="field-group">
        <label>첨부파일</label>
        <input type="file" class="field-input" data-evidence-file />
        <div class="readonly-cell muted" data-evidence-file-name style="margin-top:8px;">
          선택된 파일이 없습니다.
        </div>
      </div>
      <div class="field-group" style="margin-top:10px;">
        <label>설명</label>
        <input class="field-input" data-evidence-description placeholder="예: 1분기 수행 증빙" />
      </div>
      <div style="margin-top:10px;">
        <button type="button" class="danger-btn small-btn" data-remove-evidence-row="1">행 삭제</button>
      </div>
    `;

    wrap.appendChild(div);

    bindEvidenceFileNamePreview(div);

            div.querySelector('[data-remove-evidence-row]').addEventListener('click', () => {
     const rows = document.getElementById('evidenceEntryWrap').querySelectorAll('[data-evidence-entry="1"]');
      if (rows.length <= 1) {
        alert('최소 1개의 입력 행은 필요합니다.');
        return;
      }
      div.remove();
    });
  });

  document.getElementById('evidenceSaveBtn').addEventListener('click', async () => {
            const rawEntries = Array.from(
  document.getElementById('evidenceEntryWrap').querySelectorAll('[data-evidence-entry="1"]')
)
      .map((el) => {
        const fileInput = el.querySelector('[data-evidence-file]');
        const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
        const description = el.querySelector('[data-evidence-description]')?.value?.trim() || '';

        return {
          file: file,
          fileName: file ? file.name : '',
          fileLink: '',
          description: description
        };
      });

    const hasDescriptionOnlyRow = rawEntries.some(item => !item.file && item.description);
    if (hasDescriptionOnlyRow) {
      alert('파일을 선택하지 않은 행에 설명만 입력되어 있습니다. 파일을 선택하거나 설명을 삭제해 주세요.');
      return;
    }

    const entries = rawEntries.filter(item => item.file);

    if (!entries.length) {
  alert('최소 1개의 파일을 선택해 주세요.');
      return;
    }

    state.db.monitoring_evidence_files = state.db.monitoring_evidence_files || [];

        try {
      const uploadedFiles = [];

      for (const item of entries) {
        const uploaded = await uploadEvidenceFileToSupabase(record, item.file);

        const fileRow = {
          fileId: nextSimpleId(
            'E',
            (state.db.monitoring_evidence_files || [])
              .map(f => f.fileId)
              .concat(uploadedFiles.map(f => f.fileId))
          ),
          recordId: record.recordId,
          controlId: record.controlId,
          riskId: record.riskId,
          year: record.year,
          fileName: uploaded.fileName,
          fileLink: uploaded.fileLink,
          storagePath: uploaded.storagePath,
          description: item.description,
          uploadedBy: state.currentUser?.userId || '',
          uploadedAt: nowIso(),
          isDeleted: false
        };

        uploadedFiles.push(fileRow);
      }

      uploadedFiles.forEach(fileRow => {
        state.db.monitoring_evidence_files.push(fileRow);
      });

      record.evidenceFile = uploadedFiles[0]?.fileName || record.evidenceFile || '';
      record.uploadedAt = nowIso();
      record.submissionStatus = '제출완료';

      appendLog('monitoring', record.recordId, 'upload', null, {
        year: record.year,
        files: uploadedFiles.map(item => ({
          fileName: item.fileName,
          fileLink: item.fileLink,
          description: item.description
        }))
      });

      markDirtyAndRender();
      closeModal();
      alert('증빙파일이 업로드되고 저장되었습니다.');
    } catch (error) {
      console.error(error);
      alert(`파일 업로드 중 오류가 발생했습니다: ${error.message || error}`);
    }
  });
} 

function sanitizeFileName(name) {
  return String(name || 'file')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}

async function uploadEvidenceFileToSupabase(record, file) {
  if (!file) throw new Error('업로드할 파일이 없습니다.');
  if (!supabaseClient) throw new Error('Supabase client가 연결되지 않았습니다.');

  const risk = state.db.risks.find(item => item.riskId === record.riskId);
  const control = state.db.controls.find(item => item.controlId === record.controlId);

  const riskCode = risk?.riskCode || record.riskId || 'RISK';
  const controlCode = control?.controlCode || record.controlId || 'CONTROL';
  const year = record.year || state.monitoringYear || new Date().getFullYear();

  const safeFileName = sanitizeFileName(file.name);
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const storagePath = `${year}/${riskCode}/${controlCode}/${timestamp}_${safeFileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(SUPABASE_BUCKET)
    .upload(storagePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabaseClient.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    fileName: file.name,
    fileLink: data.publicUrl,
    storagePath
  };
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
        state.heatmapFilter = null;
        persistUiState();
        render();
      });
    });

    treeRoot.querySelectorAll('[data-toggle-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-toggle-id');
        if (state.expanded.has(id)) state.expanded.delete(id);
        else state.expanded.add(id);
        persistUiState();
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
        state.heatmapFilter = null;
        persistUiState();
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
            <span class="tree-folder-name">${escapeHtml(folder.folderName)}</span>
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
            ${folderRisks.map((risk) => renderRiskNode(risk)).join('')}
            ${children.map((child) => renderTreeNode(child)).join('')}
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
        <td>${renderEditableCell('control', control?.controlId, 'controlDepartment', control?.controlDepartment || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlOwnerName', control?.controlOwnerName || '')}</td>
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

    document.querySelectorAll('[data-rating-btn]').forEach((el) => {
      el.addEventListener('click', () => {
        if (!isManager()) return blockViewerAction();
        updateField(el.dataset.targetType, el.dataset.targetId, el.dataset.field, el.dataset.value);
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
    const current = Number(value || 0);
    const buttons = [1,2,3,4,5].map((n) => `
      <button
        type="button"
        class="rating-dot ${current === n ? 'active' : ''} ${isManager() ? '' : 'readonly'}"
        data-rating-btn="1"
        data-target-type="${targetType}"
        data-target-id="${targetId}"
        data-field="${field}"
        data-value="${n}"
        ${isManager() ? '' : 'disabled'}
      >${n}</button>
    `).join('');
    return `<div class="rating-scale">${buttons}</div>`;
  }

  function renderModalRatingPicker(inputId, value) {
    const current = Number(value || 0);
    const buttons = [1,2,3,4,5].map((n) => `
      <button type="button" class="rating-dot ${current === n ? 'active' : ''}" data-modal-rating="${inputId}" data-value="${n}">${n}</button>
    `).join('');
    return `
      <div class="rating-scale rating-scale-modal">${buttons}</div>
      <input type="hidden" id="${inputId}" value="${current || ''}" />
    `;
  }

  function bindModalRatingPickers() {
    document.querySelectorAll('[data-modal-rating]').forEach((el) => {
      el.addEventListener('click', () => {
        const inputId = el.dataset.modalRating;
        const value = String(el.dataset.value || '');
        const input = document.getElementById(inputId);
        if (!input) return;
        input.value = value;
        document.querySelectorAll(`[data-modal-rating="${inputId}"]`).forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.value === value);
        });
      });
    });
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

function openMoveRiskModal(riskId) {
  const risk = getRiskById(riskId);
  if (!risk) return;

  const options = sortFolders(getActiveFolders())
    .map((folder) => ({
      folderId: folder.folderId,
      label: buildFolderPath(folder.folderId).join(' > ')
    }))
    .filter((item) => item.folderId !== risk.folderId);

  openModal(`
    <div class="modal-header">
      <h3>Risk 폴더 이동</h3>
      <button id="modalCloseBtn" class="ghost-btn">닫기</button>
    </div>
    <div class="kv-list" style="margin-bottom:16px;">
      <div>Risk Code</div><div class="mono">${escapeHtml(risk.riskId)}</div>
      <div>현재 폴더</div><div>${escapeHtml(buildFolderPath(risk.folderId).join(' > '))}</div>
    </div>
    <div class="field-group">
      <label>이동 대상 폴더</label>
      ${options.length ? `
        <select id="moveRiskFolderSelect" class="field-select">
          ${options.map((item) => `<option value="${item.folderId}">${escapeHtml(item.label)}</option>`).join('')}
        </select>
      ` : `<div class="warning-box">이동 가능한 다른 폴더가 없습니다. 먼저 폴더를 추가해 주세요.</div>`}
    </div>
    <div class="warning-box" style="margin-top:12px;">
      Risk를 이동해도 연결된 Control과 Monitoring 데이터는 유지됩니다.
    </div>
    <div class="modal-actions">
      <button id="riskMoveConfirmBtn" class="primary-btn" ${options.length ? '' : 'disabled'}>이동</button>
    </div>
  `);

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  const riskMoveConfirmBtn = document.getElementById('riskMoveConfirmBtn');
  if (riskMoveConfirmBtn) {
    riskMoveConfirmBtn.addEventListener('click', () => {
      const select = document.getElementById('moveRiskFolderSelect');
      const targetFolderId = select ? select.value : '';
      if (!targetFolderId) {
        alert('이동할 폴더를 선택해 주세요.');
        return;
      }
      moveRiskToFolder(riskId, targetFolderId);
      closeModal();
    });
  }
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
        <label>Status</label>
        <select id="statusInput" class="field-select">
          <option>Open</option>
          <option>Mitigated</option>
          <option>Closed</option>
        </select>
      </div>

      <div class="field-group">
        <label>고유 Risk 발생가능성</label>
        ${renderModalRatingPicker('inhLikelihoodInput', 3)}
      </div>
      <div class="field-group">
        <label>고유 Risk 결과 심각성</label>
        ${renderModalRatingPicker('inhImpactInput', 3)}
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
  bindModalRatingPickers();
  document.getElementById('riskCreateBtn').addEventListener('click', () => {
    const payload = {
      departmentName: document.getElementById('departmentNameInput').value.trim(),
      teamCode: document.getElementById('teamCodeInput').value.trim().toUpperCase(),
      lawCode: pad2(document.getElementById('lawCodeInput').value.trim() || '01'),
      referenceLaw: document.getElementById('referenceLawInput').value.trim(),
      regulationDetail: document.getElementById('regulationDetailInput').value.trim(),
      sanction: document.getElementById('sanctionInput').value.trim(),
      riskContent: document.getElementById('riskContentInput').value.trim(),
      responsibleDepartment: '',
      ownerName: '',
      status: document.getElementById('statusInput').value,
      inherentLikelihood: Number(document.getElementById('inhLikelihoodInput').value || 3),
      inherentImpact: Number(document.getElementById('inhImpactInput').value || 3),
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
        <input id="controlDepartmentInput" class="field-input" value="${escapeHtml(risk.departmentName || '')}" />
      </div>
      <div class="field-group">
        <label>담당자</label>
        <input id="controlOwnerNameInput" class="field-input" value="" />
      </div>
      <div class="field-group">
        <label>잔여 Risk 발생 가능성</label>
        ${renderModalRatingPicker('controlResLikelihoodInput', risk.residualLikelihood || 2)}
      </div>
      <div class="field-group">
        <label>잔여 Risk 결과 심각성</label>
        ${renderModalRatingPicker('controlResImpactInput', risk.residualImpact || 2)}
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
  bindModalRatingPickers();
  document.getElementById('controlCreateBtn').addEventListener('click', () => {
    const payload = {
      controlName: document.getElementById('controlNameInput').value.trim(),
      controlContent: document.getElementById('controlContentInput').value.trim(),
      controlType: document.getElementById('controlTypeInput').value,
      controlOperationType: document.getElementById('controlOperationTypeInput').value,
      controlFrequency: document.getElementById('controlFrequencyInput').value,
      controlDepartment: document.getElementById('controlDepartmentInput').value.trim(),
      controlOwnerName: document.getElementById('controlOwnerNameInput').value.trim(),
      residualLikelihood: Number(document.getElementById('controlResLikelihoodInput').value || 2),
      residualImpact: Number(document.getElementById('controlResImpactInput').value || 2)
    };

    if (!payload.controlName) {
      alert('Control 명을 입력해 주세요.');
      return;
    }

    createControl(riskId, payload);
    closeModal();
  });
}

async function createFolder(folderName, parentFolderId) {

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

  const { error } = await supabase
    .from('folders')
    .insert({
      folder_id: folder.folderId,
      folder_name: folder.folderName,
      parent_folder_id: folder.parentFolderId,
      folder_level: folder.folderLevel,
      sort_order: folder.sortOrder,
      is_deleted: folder.isDeleted,
      created_at: folder.createdAt,
      created_by: folder.createdBy,
      updated_at: folder.updatedAt,
      updated_by: folder.updatedBy
    });

  if (error) {
    console.error("Folder insert failed:", error);
    alert("폴더 저장 실패");
    return;
  }

  state.db.folders.push(folder);

  state.expanded.add(folderId);

  if (parentFolderId) state.expanded.add(parentFolderId);

  state.selectedFolderId = folderId;

  state.heatmapFilter = null;

  appendLog('folder', folderId, 'create', null, { folderName, parentFolderId });

  persistUiState();

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
  persistUiState();
  markDirtyAndRender();
}

function deleteFolder(folderId) {
  const folder = getFolderById(folderId);
  if (!folder) return;

  const validation = validateFolderDeletion(folderId);
  if (!validation.ok) {
    alert(validation.message);
    return;
  }

  const childCount = validation.childFolderCount;
  const ok = confirm(`'${folder.folderName}' 폴더를 삭제하시겠습니까?

하위 폴더 ${childCount}개가 함께 삭제됩니다.
이 작업은 되돌릴 수 없습니다.`);
  if (!ok) return;

  validation.subtree.forEach((id) => {
    const target = getFolderById(id);
    if (target) {
      target.isDeleted = true;
      target.updatedAt = nowIso();
      target.updatedBy = state.currentUser.userId;
    }
  });

  appendLog('folder', folderId, 'delete', { folderName: folder.folderName }, null);
  if (validation.subtree.includes(state.selectedFolderId)) state.selectedFolderId = null;
  persistUiState();
  markDirtyAndRender();
}

function validateFolderDeletion(folderId) {
  const subtree = getDescendantFolderIds(folderId);
  const childFolderCount = Math.max(subtree.length - 1, 0);
  const risks = getActiveRisks().filter((r) => subtree.includes(r.folderId));
  const riskIds = risks.map((r) => r.riskId);
  const controls = getActiveControls().filter((c) => riskIds.includes(c.riskId));

  if (risks.length || controls.length) {
    const folderPath = buildFolderPath(folderId).join(' > ');
    return {
      ok: false,
      subtree,
      childFolderCount,
      riskCount: risks.length,
      controlCount: controls.length,
      message: `선택한 폴더는 아직 삭제할 수 없습니다.

경로: ${folderPath}
하위 폴더: ${childFolderCount}개
Risk: ${risks.length}건
Control: ${controls.length}건

먼저 해당 폴더/하위 폴더의 Risk 또는 Control을 다른 폴더로 이동하거나 정리한 뒤 다시 시도해 주세요.`
    };
  }

  return { ok: true, subtree, childFolderCount, riskCount: 0, controlCount: 0 };
}

async function createRisk(payload) {

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

  const { error } = await supabase
    .from('risks')
    .insert({
      risk_id: risk.riskId,
      folder_id: risk.folderId,
      department_code: risk.departmentCode,
      department_name: risk.departmentName,
      team_code: risk.teamCode,
      law_code: risk.lawCode,
      reference_law: risk.referenceLaw,
      regulation_detail: risk.regulationDetail,
      sanction: risk.sanction,
      risk_title: risk.riskTitle,
      risk_description: risk.riskDescription,
      risk_content: risk.riskContent,
      responsible_department: risk.responsibleDepartment,
      owner_name: risk.ownerName,
      owner_user_id: risk.ownerUserId,
      inherent_likelihood: risk.inherentLikelihood,
      inherent_impact: risk.inherentImpact,
      inherent_score: risk.inherentScore,
      inherent_rating: risk.inherentRating,
      residual_likelihood: risk.residualLikelihood,
      residual_impact: risk.residualImpact,
      residual_score: risk.residualScore,
      residual_rating: risk.residualRating,
      status: risk.status,
      entity: risk.entity,
      country: risk.country,
      is_deleted: risk.isDeleted,
      created_at: risk.createdAt,
      created_by: risk.createdBy,
      updated_at: risk.updatedAt,
      updated_by: risk.updatedBy
    });

  if (error) {
    console.error("Risk insert failed:", error);
    alert("Risk 저장 실패");
    return;
  }

  state.db.risks.push(risk);

  appendLog('risk', risk.riskId, 'create', null, pickRiskLogFields(risk));

  markDirtyAndRender();
}


async function createControl(riskId, payload) {
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

  const { error } = await supabase
    .from('controls')
    .insert({
      control_id: control.controlId,
      control_code: control.controlCode,
      risk_id: control.riskId,
      control_title: control.controlTitle,
      control_name: control.controlName,
      control_description: control.controlDescription,
      control_content: control.controlContent,
      control_type: control.controlType,
      control_operation_type: control.controlOperationType,
      control_frequency: control.controlFrequency,
      control_owner: control.controlOwner,
      control_department: control.controlDepartment,
      control_owner_name: control.controlOwnerName,
      effectiveness: control.effectiveness,
      is_deleted: control.isDeleted,
      created_at: control.createdAt,
      created_by: control.createdBy,
      updated_at: control.updatedAt,
      updated_by: control.updatedBy
    });

  if (error) {
    console.error("Control insert failed:", error);
    alert("Control 저장 실패");
    return;
  }

  state.db.controls.push(control);

  appendLog('control', control.controlId, 'create', null, pickControlLogFields(control));

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
    .filter((risk) => {
      if (!state.heatmapFilter) return true;

      const likeValue = Number(
        state.heatmapFilter.mode === 'inherent'
          ? risk.inherentLikelihood || 0
          : risk.residualLikelihood || 0
      );

      const impactValue = Number(
        state.heatmapFilter.mode === 'inherent'
          ? risk.inherentImpact || 0
          : risk.residualImpact || 0
      );

      return likeValue === Number(state.heatmapFilter.like) &&
             impactValue === Number(state.heatmapFilter.impact);
    })
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
  const activeIds = new Set(getActiveFolders().map((folder) => folder.folderId));
  if (state.expanded && state.expanded.size) {
    state.expanded = new Set(Array.from(state.expanded).filter((id) => activeIds.has(id)));
    return;
  }
  state.expanded.clear();
  getActiveFolders().forEach((folder) => {
    state.expanded.add(folder.folderId);
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

function moveRiskToFolder(riskId, targetFolderId) {
  const risk = getRiskById(riskId);
  const targetFolder = getFolderById(targetFolderId);
  if (!risk || !targetFolder) return;

  const before = pickRiskLogFields(risk);
  risk.folderId = targetFolderId;
  risk.departmentName = risk.departmentName || targetFolder.folderName;
  risk.updatedAt = nowIso();
  risk.updatedBy = state.currentUser.userId;

  appendLog('risk', risk.riskId, 'move', before, {
    ...pickRiskLogFields(risk),
    targetFolderId
  });

  state.selectedFolderId = targetFolderId;
  state.selectedRiskId = riskId;
  state.heatmapFilter = null;
  persistUiState();
  markDirtyAndRender();
}

function heatmapCellClass(likelihood, impact) {
  const score = Number(likelihood) * Number(impact);
  if (score <= 7) return 'low';
  if (score <= 12) return 'medium';
  return 'high';
}

function renderHeatmapPanel(likeField, impactField, mode) {
  const counts = {};

  for (let impact = 1; impact <= 5; impact += 1) {
    for (let like = 1; like <= 5; like += 1) {
      counts[`${impact}-${like}`] = 0;
    }
  }

  getActiveRisks().forEach((risk) => {
    const like = Number(risk[likeField] || 0);
    const impact = Number(risk[impactField] || 0);

    if (like >= 1 && like <= 5 && impact >= 1 && impact <= 5) {
      counts[`${impact}-${like}`] += 1;
    }
  });

  const rows = [];

  for (let impact = 1; impact <= 5; impact += 1) {
    const cells = [];

    for (let like = 1; like <= 5; like += 1) {
      const count = counts[`${impact}-${like}`] || 0;

      cells.push(`
        <td
          class="heatmap-cell ${heatmapCellClass(like, impact)}"
          data-impact="${impact}"
          data-like="${like}"
          data-mode="${mode}"
          title="${mode === 'inherent' ? '고유 Risk' : '잔여 Risk'} / 결과심각성 ${impact} / 발생가능성 ${like}"
        >
          <span>${count}</span>
        </td>
      `);
    }

    rows.push(`
      <tr>
        <th class="axis-label">${impact}</th>
        ${cells.join('')}
      </tr>
    `);
  }

  return `
    <div class="heatmap-wrap">
      <div class="heatmap-axis-title top">발생가능성</div>

      <div class="heatmap-matrix-wrap">
        <div class="heatmap-axis-title left">결과심각성</div>

        <table class="heatmap-table dashboard-heatmap-table">
          <thead>
            <tr>
              <th class="corner-label"></th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join('')}
          </tbody>
        </table>
      </div>

      <div class="heatmap-legend-inline">
        <span><i class="legend-box low"></i> Low (1~7)</span>
        <span><i class="legend-box medium"></i> Medium (8~12)</span>
        <span><i class="legend-box high"></i> High (13~25)</span>
      </div>
    </div>
  `;
}

function calculateRating(likelihood, impact) {
  const score = Number(likelihood) * Number(impact);
  const rating = score <= 7 ? 'Low' : score <= 12 ? 'Medium' : 'High';
  return { score, rating };
}

function renderBadge(value) {
  const key = String(value || '').toLowerCase();
  const cls = key === 'low' ? 'low' : key === 'medium' ? 'medium' : key === 'high' ? 'high' : 'empty';
  return `<span class="badge ${cls}">${escapeHtml(value || '-')}</span>`;
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
  persistUiState();
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