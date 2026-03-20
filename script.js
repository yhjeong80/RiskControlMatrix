(() => {

  const SUPABASE_URL = "https://zdcfvnestdbckibhiakb.supabase.co";
  const SUPABASE_KEY = "sb_publishable_iPLYQMYoAreDwa66gN7lNw_DUs4xZf8";
  const SUPABASE_BUCKET = "monitoring-files";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
    heatmapFilter: null,
    isEditMode: false
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
  try {
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
        departmentCode: row.department_code,
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
        ownerUserId: row.owner_user_id,
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
        controlOwner: row.control_owner,
        controlDepartment: row.control_department,
        controlOwnerName: row.control_owner_name,
        controlMonths: normalizeControlMonths(row.control_months),
        effectiveness: row.effectiveness,
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
        storagePath: row.storage_path,
        description: row.description,
        uploadedBy: row.uploaded_by,
        uploadedAt: row.uploaded_at,
        isDeleted: row.is_deleted
      }))
    };
  } catch (error) {
    console.error('Failed to load from Supabase, falling back to local cache:', error);
    const localRaw = localStorage.getItem(STORAGE_DB_KEY);
    if (localRaw) {
      try {
        return JSON.parse(localRaw);
      } catch (parseError) {
        console.error('Failed to parse local database:', parseError);
      }
    }
    return createDefaultDb();
  }
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
      controlOperationType: control.controlOperationType || 'Manual',
      controlMonths: normalizeControlMonths(control.controlMonths)
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
                <button id="addRootFolderBtn" class="ghost-btn ${canEdit() ? '' : 'viewer-readonly'}">+ 상위 폴더</button>
                <button id="addChildFolderBtn" class="ghost-btn ${canEdit() ? '' : 'viewer-readonly'}">+ 하위 폴더</button>
              </div>
              <div class="folder-action-row">
                <button id="deleteSelectedFolderBtn" class="danger-btn ${canEdit() ? '' : 'viewer-readonly'}">선택 폴더 삭제</button>
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
            권한: <strong>${isManager() ? (state.isEditMode ? 'Manager (Edit Mode)' : 'Manager (조회 모드)') : 'User (조회 전용)'}</strong><br /><br />
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
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">${isManager() ? (state.isEditMode ? 'EDIT MODE ENABLED' : 'VIEW ONLY') : 'VIEW ONLY'}</span>
          <input id="searchInput" type="text" placeholder="Risk / Control / 법령 / 담당부서 검색" value="${escapeHtml(state.search)}" />
          <button id="clearCacheBtn" class="ghost-btn">캐시 초기화</button>
          <button id="logoutBtn" class="ghost-btn">Log out</button>
        </div>
      </section>

      <section class="toolbar">
        <div class="toolbar-left">
          ${isManager() ? `<button id="editModeBtn" class="${state.isEditMode ? 'primary-btn' : 'ghost-btn'}">${state.isEditMode ? '수정 종료' : '수정'}</button>` : ''}
          <button id="addRiskBtn" class="primary-btn ${canEdit() ? '' : 'viewer-readonly'}">+ Risk 추가</button>
          <button id="moveRiskBtn" class="ghost-btn ${canEdit() && state.selectedRiskId ? '' : 'viewer-readonly'}">선택 Risk 이동</button>
          <button id="saveBtn" class="ghost-btn ${canEdit() ? '' : 'viewer-readonly'}">저장</button>
          <button id="resetBtn" class="ghost-btn ${canEdit() ? '' : 'viewer-readonly'}">원본으로 되돌리기</button>
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
                <th>필요 표본 수</th>
                <th>제출 표본 수</th>
                <th>
  <div class="th-help-wrap">
    <span>충족 여부</span>
    <button type="button" id="sampleGuideBtn" class="help-icon-btn" title="표본 산정 기준 보기">?</button>
  </div>
</th>
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
                  <td class="readonly-cell center-cell">${row.requiredSampleCount || 0}</td>
                  <td class="readonly-cell center-cell">${row.submittedSampleCount || 0}</td>
                  <td class="readonly-cell center-cell">${escapeHtml(row.sampleSufficiency || '-')}</td>
                  <td class="readonly-cell">${escapeHtml(row.uploadedAt ? formatDate(row.uploadedAt) : '')}</td>
                  <td class="readonly-cell center-cell">${escapeHtml(row.submissionStatus || '제출대기')}</td>
                  <td>${renderMonitoringReviewCell(row)}</td>
                  <td>${renderMonitoringCommentCell(row)}</td>
                </tr>
              `).join('') : `<tr><td colspan="15" class="empty-state">Monitoring 대상 항목이 없습니다.</td></tr>`}
            </tbody>
          </table>
        </div>
        <div class="footer-note">
          고유 Risk 등급, 통제 유형, 통제 주기에 따라 필요한 테스트 표본 수를 자동 산정합니다. 현재는 업로드 파일 1건을 표본 1건으로 계산합니다.
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

        state.isEditMode = false;
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

    const editModeBtn = document.getElementById('editModeBtn');
    if (editModeBtn) {
      editModeBtn.addEventListener('click', () => {
        state.isEditMode = !state.isEditMode;
        render();
      });
    }

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
        if (!canEdit()) return blockViewerAction();
        openFolderModal(null);
      });
    }

    const addChildFolderBtn = document.getElementById('addChildFolderBtn');
    if (addChildFolderBtn) {
      addChildFolderBtn.addEventListener('click', () => {
        if (!canEdit()) return blockViewerAction();
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
        if (!canEdit()) return blockViewerAction();
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
        if (!canEdit()) return blockViewerAction();
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
        if (!canEdit()) return blockViewerAction();
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
        if (!canEdit()) return blockViewerAction();
        saveDatabase();
        state.isEditMode = false;
        render();
      });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!canEdit()) return blockViewerAction();
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
        if (!canEdit()) return blockViewerAction();
        updateMonitoringRecord(el.dataset.recordId, 'reviewResult', el.value);
      });
    });

    document.querySelectorAll('[data-monitoring-comment]').forEach((el) => {
      el.addEventListener('change', () => {
        if (!canEdit()) return blockViewerAction();
        updateMonitoringRecord(el.dataset.recordId, 'reviewComment', el.value);
      });
    });

const sampleGuideBtn = document.getElementById('sampleGuideBtn');
if (sampleGuideBtn) {
  sampleGuideBtn.addEventListener('click', () => {
    openSampleGuideModal();
  });
}  
}

function openSampleGuideModal() {
  openModal(`
    <div class="modal-header">
      <h3>필요 증빙 표본 수 산정 기준</h3>
      <button id="modalCloseBtn" class="ghost-btn">닫기</button>
    </div>

    <div class="help-text" style="margin-bottom:16px;">
      필요 표본 수는 <strong>고유 Risk Rating</strong>, <strong>통제 수행 방식(Auto / Manual)</strong>,
      <strong>통제 주기</strong>를 기준으로 자동 산정됩니다.
    </div>

    <div class="sample-guide-section">
      <h4>Auto Control</h4>
      <div class="table-wrap">
        <table class="sample-guide-table">
          <thead>
            <tr>
              <th>통제 주기</th>
              <th>고유 Risk Rating 중간 이하</th>
              <th>고유 Risk Rating High</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>상시(Continuous)</td><td>1</td><td>2</td></tr>
            <tr><td>건별(Ad-hoc)</td><td>1</td><td>2</td></tr>
            <tr><td>일별(Daily)</td><td>1</td><td>2</td></tr>
            <tr><td>주별(Weekly)</td><td>1</td><td>2</td></tr>
            <tr><td>월별(Monthly)</td><td>1</td><td>2</td></tr>
            <tr><td>분기별(Quarterly)</td><td>1</td><td>2</td></tr>
            <tr><td>반기별(Semi-annual)</td><td>1</td><td>2</td></tr>
            <tr><td>연간(Annual)</td><td>1</td><td>1</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="sample-guide-section" style="margin-top:20px;">
      <h4>Manual Control</h4>
      <div class="table-wrap">
        <table class="sample-guide-table">
          <thead>
            <tr>
              <th>통제 주기</th>
              <th>고유 Risk Rating 중간 이하</th>
              <th>고유 Risk Rating High</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>상시(Continuous)</td><td>3</td><td>5</td></tr>
            <tr><td>건별(Ad-hoc)</td><td>3</td><td>5</td></tr>
            <tr><td>일별(Daily)</td><td>3</td><td>5</td></tr>
            <tr><td>주별(Weekly)</td><td>2</td><td>4</td></tr>
            <tr><td>월별(Monthly)</td><td>2</td><td>4</td></tr>
            <tr><td>분기별(Quarterly)</td><td>1</td><td>3</td></tr>
            <tr><td>반기별(Semi-annual)</td><td>1</td><td>2</td></tr>
            <tr><td>연간(Annual)</td><td>1</td><td>1</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="warning-box" style="margin-top:16px;">
      현재 시스템에서는 <strong>업로드 파일 1건 = 표본 1건</strong>으로 계산됩니다.
    </div>

    <div class="modal-actions">
      <button id="sampleGuideCloseBtn" class="primary-btn">닫기</button>
    </div>
  `);

  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const sampleGuideCloseBtn = document.getElementById('sampleGuideCloseBtn');
  if (sampleGuideCloseBtn) sampleGuideCloseBtn.addEventListener('click', closeModal);
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

    const requiredSampleCount = getRequiredSampleCount(
      risk?.inherentRating || '',
      control.controlOperationType || control.controlType || '',
      control.controlFrequency || ''
    );
    const submittedSampleCount = evidenceFiles.length;
    const sampleSufficiency = submittedSampleCount >= requiredSampleCount ? '충족' : '부족';

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
      controlOperationType: control.controlOperationType || control.controlType || '',
      controlFrequency: control.controlFrequency || '',
      inherentRating: risk?.inherentRating || '',
      evidenceFile: record.evidenceFile || '',
      evidenceFiles,
      evidenceCount: evidenceFiles.length,
      requiredSampleCount,
      submittedSampleCount,
      sampleSufficiency,
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
      requiredSampleCount: row.requiredSampleCount,
      submittedSampleCount: row.submittedSampleCount,
      sampleSufficiency: row.sampleSufficiency,
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

function sanitizeFileName(name) {
  return String(name || 'file')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}

async function uploadEvidenceFileToSupabase(record, control, risk, file) {
  if (!file) throw new Error('업로드할 파일이 없습니다.');

  const riskCode = risk?.riskId || 'RISK';
  const controlCode = control?.controlCode || control?.controlId || 'CONTROL';
  const year = record.year || state.monitoringYear || new Date().getFullYear();

  const safeFileName = sanitizeFileName(file.name);
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const storagePath = `${year}/${riskCode}/${controlCode}/${timestamp}_${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream'
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    fileName: file.name,
    fileLink: data?.publicUrl || '',
    storagePath
  };
}

function normalizeControlMode(value) {
  const v = String(value || '').trim().toLowerCase();
  if (v.includes('auto')) return 'AUTO';
  if (v.includes('manual')) return 'MANUAL';
  return '';
}

function normalizeFrequency(value) {
  const v = String(value || '').trim();
  const lower = v.toLowerCase();

  if (v.includes('상시') || lower.includes('continuous')) return '상시';
  if (v.includes('건별') || lower.includes('ad-hoc')) return '건별';
  if (v.includes('일별') || lower.includes('daily')) return '일별';
  if (v.includes('주별') || lower.includes('weekly')) return '주별';
  if (v.includes('월별') || lower.includes('monthly')) return '월별';
  if (v.includes('분기별') || lower.includes('quarterly')) return '분기별';
  if (v.includes('반기별') || lower.includes('semi-annual')) return '반기별';
  if (v.includes('연간') || lower.includes('annual')) return '연간';

  return v;
}

function normalizeControlMonths(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((month) => Number(month)).filter((month) => month >= 1 && month <= 12))].sort((a, b) => a - b);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return normalizeControlMonths(parsed);
    } catch (e) {
      return normalizeControlMonths(trimmed.split(',').map((item) => Number(String(item).trim())));
    }
  }

  return [];
}

function parseControlMonthsInput(value) {
  return normalizeControlMonths(value);
}

function formatControlMonths(months) {
  const normalized = normalizeControlMonths(months);
  if (!normalized.length) return '-';
  return normalized.map((month) => `${month}월`).join(', ');
}

function getSuggestedControlMonths(frequencyValue) {
  const normalized = normalizeFrequency(frequencyValue);
  if (['상시', '건별', '일별', '주별', '월별'].includes(normalized)) return [1,2,3,4,5,6,7,8,9,10,11,12];
  if (normalized === '분기별') return [3, 6, 9, 12];
  if (normalized === '반기별') return [6, 12];
  return [];
}

function setControlMonthsSelection(monthsWrapId, inputId, months) {
  const normalized = normalizeControlMonths(months);
  const wrap = document.getElementById(monthsWrapId);
  const input = document.getElementById(inputId);
  if (!wrap || !input) return;

  input.value = JSON.stringify(normalized);

  wrap.querySelectorAll('[data-control-month]').forEach((button) => {
    const month = Number(button.dataset.controlMonth || 0);
    const selected = normalized.includes(month);
    button.dataset.selected = selected ? 'Y' : 'N';
    button.style.background = selected ? '#dbeafe' : '#fff';
    button.style.borderColor = selected ? '#60a5fa' : '';
    button.style.color = selected ? '#1d4ed8' : '';
    button.style.fontWeight = selected ? '700' : '400';
  });
}

function bindControlMonthButtons(monthsWrapId, inputId) {
  const wrap = document.getElementById(monthsWrapId);
  if (!wrap) return;

  wrap.querySelectorAll('[data-control-month]').forEach((button) => {
    button.addEventListener('click', () => {
      const current = parseControlMonthsInput(document.getElementById(inputId)?.value || '');
      const month = Number(button.dataset.controlMonth || 0);
      const next = current.includes(month)
        ? current.filter((item) => item !== month)
        : current.concat(month);
      setControlMonthsSelection(monthsWrapId, inputId, next);
    });
  });
}

function applySuggestedControlMonths(frequencyValue, monthsWrapId, inputId) {
  setControlMonthsSelection(monthsWrapId, inputId, getSuggestedControlMonths(frequencyValue));
}

async function insertControlRow(control) {
  const basePayload = {
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
  };

  const payloadWithMonths = {
    ...basePayload,
    control_months: normalizeControlMonths(control.controlMonths)
  };

  let result = await supabase.from('controls').insert(payloadWithMonths);
  if (!result.error) return result;

  const message = String(result.error.message || '');
  const code = String(result.error.code || '');
  const missingColumn = code === 'PGRST204' || message.toLowerCase().includes('control_months') || message.toLowerCase().includes('column');
  if (!missingColumn) return result;

  console.warn('controls.control_months column is not available yet. Falling back to insert without control_months.');
  return supabase.from('controls').insert(basePayload);
}

function normalizeRiskGrade(value) {
  const v = String(value || '').trim().toLowerCase();
  if (v === 'high') return 'HIGH';
  return 'MEDIUM_OR_BELOW';
}

function getRequiredSampleCount(riskRating, controlMode, controlFrequency) {
  const grade = normalizeRiskGrade(riskRating);
  const mode = normalizeControlMode(controlMode);
  const freq = normalizeFrequency(controlFrequency);

  const RULES = {
    AUTO: {
      '상시': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '건별': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '일별': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '주별': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '월별': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '분기별': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '반기별': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '연간': { MEDIUM_OR_BELOW: 1, HIGH: 1 }
    },
    MANUAL: {
      '상시': { MEDIUM_OR_BELOW: 3, HIGH: 5 },
      '건별': { MEDIUM_OR_BELOW: 3, HIGH: 5 },
      '일별': { MEDIUM_OR_BELOW: 3, HIGH: 5 },
      '주별': { MEDIUM_OR_BELOW: 2, HIGH: 4 },
      '월별': { MEDIUM_OR_BELOW: 2, HIGH: 4 },
      '분기별': { MEDIUM_OR_BELOW: 1, HIGH: 3 },
      '반기별': { MEDIUM_OR_BELOW: 1, HIGH: 2 },
      '연간': { MEDIUM_OR_BELOW: 1, HIGH: 1 }
    }
  };

  return RULES[mode]?.[freq]?.[grade] ?? 0;
}

function getSampleSufficiencyLabel(requiredSampleCount, submittedSampleCount) {
  if (!requiredSampleCount) return '-';
  if (submittedSampleCount >= requiredSampleCount) return '충족';
  return '부족';
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
      <div>Risk Code</div><div class="mono">${escapeHtml(getDisplayRiskCode(risk?.riskId || ''))}</div>
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
          <div class="readonly-cell muted" data-evidence-file-name style="margin-top:8px;">선택된 파일이 없습니다.</div>
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

  function bindEvidenceFilePreview(scope) {
    (scope || document).querySelectorAll('[data-evidence-file]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        const box = e.target.parentElement.querySelector('[data-evidence-file-name]');
        if (box) box.textContent = file ? file.name : '선택된 파일이 없습니다.';
      });
    });
  }

  bindEvidenceFilePreview(document);

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
        <div class="readonly-cell muted" data-evidence-file-name style="margin-top:8px;">선택된 파일이 없습니다.</div>
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
    bindEvidenceFilePreview(div);

    div.querySelector('[data-remove-evidence-row]').addEventListener('click', () => {
      const rows = document.querySelectorAll('[data-evidence-entry="1"]');
      if (rows.length <= 1) {
        alert('최소 1개의 입력 행은 필요합니다.');
        return;
      }
      div.remove();
    });
  });

  document.getElementById('evidenceSaveBtn').addEventListener('click', async () => {
    const rawEntries = Array.from(document.querySelectorAll('[data-evidence-entry="1"]'))
      .map((el) => {
        const fileInput = el.querySelector('[data-evidence-file]');
        const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
        const description = el.querySelector('[data-evidence-description]')?.value?.trim() || '';

        return {
          file,
          fileName: file ? file.name : '',
          fileLink: '',
          description
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
        const uploaded = await uploadEvidenceFileToSupabase(record, control, risk, item.file);

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
        if (!canEdit()) return blockViewerAction();
        openFolderModal(btn.getAttribute('data-add-child'));
      });
    });

    treeRoot.querySelectorAll('[data-delete-folder]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!canEdit()) return blockViewerAction();
        deleteFolder(btn.getAttribute('data-delete-folder'));
      });
    });

    treeRoot.querySelectorAll('[data-edit-folder]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!canEdit()) return blockViewerAction();
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
          ${canEdit() ? `
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
          <span class="mono">${escapeHtml(getDisplayRiskCode(risk.riskId))}</span>
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
        <td class="mono readonly-cell"><div>${escapeHtml(getDisplayRiskCode(risk.riskId))}</div>${renderViewButton('risk', risk.riskId)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'referenceLaw', risk.referenceLaw, true)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'regulationDetail', risk.regulationDetail, true)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'sanction', risk.sanction, true)}</td>
        <td>${renderEditableCell('risk', risk.riskId, 'riskContent', risk.riskContent || risk.riskDescription || risk.riskTitle, true)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'inherentLikelihood', risk.inherentLikelihood)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'inherentImpact', risk.inherentImpact)}</td>
        <td class="readonly-cell">${renderBadge(risk.inherentRating)}</td>
        <td class="mono readonly-cell">${control?.controlCode ? `<div>${escapeHtml(control.controlCode)}</div>${renderViewButton('control', control.controlId)}` : ''}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlName', control?.controlName || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlContent', control?.controlContent || '', true)}</td>
        <td>${renderControlTypeCell(control)}</td>
        <td>${renderControlOperationTypeCell(control)}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlFrequency', control?.controlFrequency || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlDepartment', control?.controlDepartment || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlOwnerName', control?.controlOwnerName || '')}</td>
        <td>${control ? renderRatingSelectCell('risk', risk.riskId, 'residualLikelihood', risk.residualLikelihood) : '<div class="readonly-cell"></div>'}</td>
        <td>${control ? renderRatingSelectCell('risk', risk.riskId, 'residualImpact', risk.residualImpact) : '<div class="readonly-cell"></div>'}</td>
        <td class="readonly-cell">${control && risk.residualRating ? renderBadge(risk.residualRating) : ''}</td>
        <td>${renderStatusCell(risk)}</td>
        <td>${renderActionsCell(risk, control)}</td>
      </tr>
    `).join('');

    bindTableEvents();
  }

  function bindTableEvents() {
    document.querySelectorAll('[data-field-input]').forEach((el) => {
      el.addEventListener('change', async () => {
        if (!canEdit()) return blockViewerAction();
        await updateField(el.dataset.targetType, el.dataset.targetId, el.dataset.field, el.value);
      });
    });

    document.querySelectorAll('[data-rating-btn]').forEach((el) => {
      el.addEventListener('click', async () => {
        if (!canEdit()) return blockViewerAction();
        await updateField(el.dataset.targetType, el.dataset.targetId, el.dataset.field, el.dataset.value);
      });
    });

    document.querySelectorAll('[data-add-control]').forEach((el) => {
      el.addEventListener('click', () => {
        if (!canEdit()) return blockViewerAction();
        openControlModal(el.dataset.addControl);
      });
    });

    document.querySelectorAll('[data-delete-risk]').forEach((el) => {
      el.addEventListener('click', async () => {
        if (!canEdit()) return blockViewerAction();
        await deleteRisk(el.dataset.deleteRisk);
      });
    });

    document.querySelectorAll('[data-delete-control]').forEach((el) => {
      el.addEventListener('click', async () => {
        if (!canEdit()) return blockViewerAction();
        await deleteControl(el.dataset.deleteControl);
      });
    });

    document.querySelectorAll('[data-view-risk]').forEach((el) => {
      el.addEventListener('click', () => {
        openRiskDetail(el.dataset.viewRisk);
      });
    });

    document.querySelectorAll('[data-view-control]').forEach((el) => {
      el.addEventListener('click', () => {
        openControlDetail(el.dataset.viewControl);
      });
    });

    autoResizeTextareas(document);
    requestAnimationFrame(() => autoResizeTextareas(document));
  }

 function autoResizeTextareas(scope = document) {
  const textareas = scope.querySelectorAll('.cell-textarea');

  const resize = (el) => {
    if (!el) return;
    el.style.overflowY = 'hidden';
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  textareas.forEach((el) => {
    resize(el);

    if (!el.dataset.autoresizeBound) {
      el.addEventListener('input', () => resize(el));
      el.addEventListener('change', () => resize(el));
      el.dataset.autoresizeBound = 'Y';
    }
  });

  requestAnimationFrame(() => {
    textareas.forEach((el) => resize(el));
  });

  setTimeout(() => {
    textareas.forEach((el) => resize(el));
  }, 0);
}

  function renderEditableCell(targetType, targetId, field, value, longText = false, withView = false) {
    if (!targetId) return `<div class="readonly-cell">${escapeHtml(value ?? '')}</div>`;

    const detailButton = withView ? renderViewButton(targetType, targetId) : '';

    if (!canEdit()) {
      const displayValue = withView ? truncateText(value ?? '', longText ? 40 : 24) : (value ?? '');
      return `<div class="readonly-cell">${escapeHtml(displayValue)}</div>${detailButton}`;
    }

    if (longText) {
      return `
        <textarea class="cell-input cell-textarea" data-field-input="1" data-target-type="${targetType}" data-target-id="${targetId}" data-field="${field}">${escapeHtml(value ?? '')}</textarea>
        ${detailButton}
      `;
    }

    const displayValue = withView ? truncateText(value ?? '', 24) : (value ?? '');
    return `
      <input class="cell-input" data-field-input="1" data-target-type="${targetType}" data-target-id="${targetId}" data-field="${field}" value="${escapeHtml(displayValue)}" />
      ${detailButton}
    `;
  }

 function renderRatingSelectCell(targetType, targetId, field, value) {
  const current = Number(value || 0);
  const buttons = [1,2,3,4,5].map((n) => `
      <button
        type="button"
        class="rating-dot ${current === n ? 'active' : ''} ${canEdit() ? '' : 'readonly'}"
        data-rating-btn="1"
        data-target-type="${targetType}"
        data-target-id="${targetId}"
        data-field="${field}"
        data-value="${n}"
        ${canEdit() ? '' : 'disabled'}
      >${n}</button>
    `).join('');
  return `<div class="rating-scale">${buttons}</div>`;
}

  
function getRiskCriteriaPopoverContent(type) {
  const likelihoodRows = [
    ['1', 'Low', '사실상 발생 불가능 or 과거 유사 위반사례 전무'],
    ['2', 'Lower-Medium', '발생 가능성 희박 or 극히 드문 예외적 상황에서만 발생 or 과거 유사 위반사례 거의 없음'],
    ['3', 'Medium', '특정 조건 및 상황에서 발생가능 or 향후 발생 가능성 있음'],
    ['4', 'Medium-High', '반복 · 주기적으로 발생소지 높음 or 과거 유사 위반사례 다수 존재'],
    ['5', 'High', '발생이 거의 확실 or 거의 모든 경우에 발생할 것으로 예상']
  ];

  const severityRows = [
    ['1', 'Low', '내부 시정 조치 수준 or 금전 · 평판 피해 거의 없음'],
    ['2', 'Lower-Medium', '경미한 제재(주의, 경고 등) or 제한적 금전적 손실 발생 or 대외 노출 적음'],
    ['3', 'Medium', '과태료 또는 과징금 부과 or 일반적 손해배상 발생 or 일정 수준의 대외 인지도 하락'],
    ['4', 'Medium-High', '최대 벌금형 부과 or 상당한 규모의 과징금 or 손해배상 발생 or 언론 보도 및 평판 리스크 확대'],
    ['5', 'High', '최대 징역형 부과 or 대규모 손해배상 또는 징벌적 손해배상 발생 or 사업 중단 또는 시장 퇴출']
  ];

  const rows = type === 'severity' ? severityRows : likelihoodRows;
  const title = type === 'severity' ? '결과심각성 / Severity' : '발생가능성 / Likelihood';

  return `
    <div class="risk-help-popover-card ${type === 'severity' ? 'severity' : 'likelihood'}">
      <div class="risk-help-popover-title">${title}</div>
      <div class="risk-help-popover-table-wrap">
        <table class="risk-help-popover-table">
          <thead>
            <tr>
              <th>점수</th>
              <th>등급</th>
              <th>기준</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="risk-help-popover-note">
        <strong>등급구분 방법</strong><br>
        열거된 항목 중 하나라도 해당될 경우 해당 등급으로 평가하며, 복수 항목에 해당하는 경우에는 그 중 가장 높은 등급으로 평가합니다.
      </div>
    </div>
  `;
}

function renderRiskHelpLabel(labelText, helpType) {
  return `${escapeHtml(labelText)} <button type="button" class="help-icon-btn risk-help-trigger" data-risk-help="${helpType}" title="평가 기준 보기">?</button>`;
}

function bindRiskHelpPopovers(scope = document) {
  const root = scope || document;

  const closeAll = () => {
    root.querySelectorAll('.risk-help-popover').forEach((el) => el.remove());
  };

  root.querySelectorAll('[data-risk-help]').forEach((button) => {
    if (button.dataset.helpBound === 'Y') return;
    button.dataset.helpBound = 'Y';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const existing = button.parentElement.querySelector('.risk-help-popover');
      closeAll();
      if (existing) return;

      const popover = document.createElement('div');
      popover.className = 'risk-help-popover';
      popover.innerHTML = getRiskCriteriaPopoverContent(button.dataset.riskHelp || 'likelihood');
      button.parentElement.style.position = 'relative';
      button.parentElement.appendChild(popover);
    });
  });

  if (!document.body.dataset.riskHelpBodyBound) {
    document.body.dataset.riskHelpBodyBound = 'Y';
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.risk-help-popover') && !event.target.closest('[data-risk-help]')) {
        document.querySelectorAll('.risk-help-popover').forEach((el) => el.remove());
      }
    });
  }
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
  if (!canEdit()) return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
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
  if (!canEdit()) return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
  return `
    <select class="cell-select" data-field-input="1" data-target-type="control" data-target-id="${control.controlId}" data-field="controlOperationType">
      ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
    </select>
  `;
}

function renderStatusCell(risk) {
  const options = ['Open', 'Mitigated', 'Closed'];
  if (!canEdit()) return `<div class="readonly-cell">${escapeHtml(risk.status ?? '')}</div>`;
  return `
    <select class="cell-select" data-field-input="1" data-target-type="risk" data-target-id="${risk.riskId}" data-field="status">
      ${options.map((v) => `<option value="${v}" ${risk.status === v ? 'selected' : ''}>${v}</option>`).join('')}
    </select>
  `;
}

function renderActionsCell(risk, control) {
  if (!canEdit()) return `<div class="readonly-cell muted">-</div>`;
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
      <div>Risk Code</div><div class="mono">${escapeHtml(getDisplayRiskCode(risk.riskId))}</div>
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
        <label>프로세스</label>
        <input id="departmentNameInput" class="field-input" value="${escapeHtml(defaultDept)}" />
      </div>
      <div class="field-group">
        <label>부서 약자</label>
        <input id="teamCodeInput" class="field-input" placeholder="예: SC" />
      </div>
      <div class="field-group">
        <label>구분 코드</label>
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
        <label>${renderRiskHelpLabel('고유 Risk 발생가능성', 'likelihood')}</label>
        ${renderModalRatingPicker('inhLikelihoodInput', 3)}
      </div>
      <div class="field-group">
        <label>${renderRiskHelpLabel('고유 Risk 결과 심각성', 'severity')}</label>
        ${renderModalRatingPicker('inhImpactInput', 3)}
      </div>

    </div>
    <div class="warning-box" style="margin-top:16px;">
      Risk Code는 <strong>R-부서약자-구분코드-일련번호</strong> 형식으로 자동 생성됩니다.<br>
      잔여 Risk 발생가능성과 잔여 Risk 결과 심각성은 <strong>Control 추가</strong> 화면에서 입력합니다.
    </div>

    <div class="modal-actions">
      <button id="riskCreateBtn" class="primary-btn">추가</button>
    </div>
  `);

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  bindModalRatingPickers();
  bindRiskHelpPopovers(document.getElementById('modalRoot'));
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
      residualLikelihood: null,
      residualImpact: null
    };

    if (!payload.teamCode) {
      alert('부서 약자를 입력해 주세요. 예: HR');
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
      <div>프로세스</div><div>${escapeHtml(risk.departmentName || '')}</div>
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
      <div class="field-group field-span-3">
        <label>통제활동 수행 월</label>
        <div id="controlMonthsWrap" style="display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:8px;">
          ${Array.from({ length: 12 }, (_, i) => `
            <button type="button"
              class="ghost-btn small-btn"
              data-control-month="${i + 1}"
              style="width:100%; padding:8px 6px;"
            >${i + 1}월</button>
          `).join('')}
        </div>
        <input type="hidden" id="controlMonthsInput" value="" />
        <div class="help-text">통제 주기 선택 시 권장 월이 자동 선택되며, 필요하면 자유롭게 수정할 수 있습니다.</div>
      </div>
      <div class="field-group">
        <label>팀 명</label>
        <input id="controlDepartmentInput" class="field-input" value="${escapeHtml(inferTeamName(risk.folderId) || '')}" />
      </div>
      <div class="field-group">
        <label>담당자</label>
        <input id="controlOwnerNameInput" class="field-input" value="" />
      </div>
      <div class="field-group">
        <label>${renderRiskHelpLabel('잔여 Risk 발생 가능성', 'likelihood')}</label>
        ${renderModalRatingPicker('controlResLikelihoodInput', risk.residualLikelihood || 2)}
      </div>
      <div class="field-group">
        <label>${renderRiskHelpLabel('잔여 Risk 결과 심각성', 'severity')}</label>
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
  bindRiskHelpPopovers(document.getElementById('modalRoot'));
  bindControlMonthButtons('controlMonthsWrap', 'controlMonthsInput');
  applySuggestedControlMonths(document.getElementById('controlFrequencyInput')?.value || '', 'controlMonthsWrap', 'controlMonthsInput');

  const controlFrequencyInput = document.getElementById('controlFrequencyInput');
  if (controlFrequencyInput) {
    controlFrequencyInput.addEventListener('change', (e) => {
      applySuggestedControlMonths(e.target.value, 'controlMonthsWrap', 'controlMonthsInput');
    });
  }

  document.getElementById('controlCreateBtn').addEventListener('click', () => {
    const payload = {
      controlName: document.getElementById('controlNameInput').value.trim(),
      controlContent: document.getElementById('controlContentInput').value.trim(),
      controlType: document.getElementById('controlTypeInput').value,
      controlOperationType: document.getElementById('controlOperationTypeInput').value,
      controlFrequency: document.getElementById('controlFrequencyInput').value,
      controlMonths: parseControlMonthsInput(document.getElementById('controlMonthsInput')?.value || ''),
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

async function renameFolder(folderId, newName) {
  const folder = getFolderById(folderId);
  if (!folder) return;

  const before = { folderName: folder.folderName };
  const now = nowIso();
  const userId = state.currentUser.userId;

  const { error } = await supabase
    .from('folders')
    .update({
      folder_name: newName,
      updated_at: now,
      updated_by: userId
    })
    .eq('folder_id', folderId);

  if (error) {
    console.error('Folder rename failed:', error);
    alert('폴더명 변경 실패');
    return;
  }

  folder.folderName = newName;
  folder.updatedAt = now;
  folder.updatedBy = userId;

  appendLog('folder', folderId, 'rename', before, { folderName: newName });
  persistUiState();
  markDirtyAndRender();
}

async function deleteFolder(folderId) {
  closeModal();
  const folder = getFolderById(folderId);
  if (!folder) return;

  const validation = validateFolderDeletion(folderId);
  if (!validation.ok) {
    closeModal();
    alert(validation.message);
    return;
  }

  const childCount = validation.childFolderCount;
  const ok = confirm(`'${folder.folderName}' 폴더를 삭제하시겠습니까?

하위 폴더 ${childCount}개가 함께 삭제됩니다.
이 작업은 되돌릴 수 없습니다.`);
  if (!ok) return;

  const now = nowIso();
  const userId = state.currentUser.userId;

  const { error } = await supabase
    .from('folders')
    .update({ is_deleted: true, updated_at: now, updated_by: userId })
    .in('folder_id', validation.subtree);

  if (error) {
    console.error('Folder delete failed:', error);
    closeModal();
    alert('폴더 삭제 실패');
    return;
  }

  validation.subtree.forEach((id) => {
    const target = getFolderById(id);
    if (target) {
      target.isDeleted = true;
      target.updatedAt = now;
      target.updatedBy = userId;
    }
  });

  appendLog('folder', folderId, 'delete', { folderName: folder.folderName }, null);
  if (validation.subtree.includes(state.selectedFolderId)) state.selectedFolderId = null;
  closeModal();
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
  const hasResidual = Number.isFinite(Number(payload.residualLikelihood)) && Number.isFinite(Number(payload.residualImpact));
  const residual = hasResidual ? calculateRating(payload.residualLikelihood, payload.residualImpact) : { score: null, rating: '' };

  let riskId = generateRiskCode(payload.teamCode, payload.lawCode);
  let reviveRow = null;

  while (true) {
    const { data: existingRisk, error: existingRiskError } = await supabase
      .from('risks')
      .select('*')
      .eq('risk_id', riskId)
      .maybeSingle();

    if (existingRiskError) {
      console.error('Risk lookup failed:', existingRiskError);
      alert('Risk 저장 실패');
      return;
    }

    if (!existingRisk) break;

    if (existingRisk.is_deleted) {
      reviveRow = existingRisk;
      break;
    }

    const match = String(riskId).match(/^R-([A-Z]+)-(\d{2})-(\d{2})$/);
    if (!match) {
      riskId = generateRiskCode(payload.teamCode, payload.lawCode);
      break;
    }

    const [, teamCode, lawCode, seq] = match;
    riskId = `R-${teamCode}-${lawCode}-${pad2(Number(seq) + 1)}`;
  }

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
    residualLikelihood: hasResidual ? Number(payload.residualLikelihood) : null,
    residualImpact: hasResidual ? Number(payload.residualImpact) : null,
    residualScore: residual.score,
    residualRating: residual.rating,
    status: payload.status,
    entity: inferEntity(state.selectedFolderId),
    country: 'KR',
    isDeleted: false,
    createdAt: reviveRow?.created_at || reviveRow?.createdAt || now,
    createdBy: reviveRow?.created_by || reviveRow?.createdBy || state.currentUser.userId,
    updatedAt: now,
    updatedBy: state.currentUser.userId
  };

  const dbPayload = {
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
    is_deleted: false,
    updated_at: risk.updatedAt,
    updated_by: risk.updatedBy
  };

  let error = null;

  if (reviveRow) {
    const reviveResult = await supabase
      .from('risks')
      .update({
        ...dbPayload,
        created_at: risk.createdAt,
        created_by: risk.createdBy
      })
      .eq('risk_id', riskId);

    error = reviveResult.error || null;
  } else {
    const insertResult = await supabase
      .from('risks')
      .insert({
        risk_id: risk.riskId,
        ...dbPayload,
        created_at: risk.createdAt,
        created_by: risk.createdBy
      });

    error = insertResult.error || null;
  }

  if (error) {
    console.error(reviveRow ? 'Risk revive failed:' : 'Risk insert failed:', error);
    alert('Risk 저장 실패');
    return;
  }

  const existingLocalIndex = (state.db.risks || []).findIndex((r) => r.riskId === risk.riskId);
  if (existingLocalIndex >= 0) {
    state.db.risks[existingLocalIndex] = risk;
  } else {
    state.db.risks.push(risk);
  }

  appendLog('risk', risk.riskId, reviveRow ? 'revive' : 'create', null, pickRiskLogFields(risk));
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
    controlMonths: normalizeControlMonths(payload.controlMonths),
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

  const { error } = await insertControlRow(control);

  if (error) {
    console.error("Control insert failed:", error);
    alert("Control 저장 실패");
    return;
  }

  state.db.controls.push(control);

  const residual = calculateRating(payload.residualLikelihood, payload.residualImpact);
  risk.residualLikelihood = Number(payload.residualLikelihood);
  risk.residualImpact = Number(payload.residualImpact);
  risk.residualScore = residual.score;
  risk.residualRating = residual.rating;
  risk.updatedAt = now;
  risk.updatedBy = state.currentUser.userId;

  const { error: riskUpdateError } = await supabase
    .from('risks')
    .update({
      residual_likelihood: risk.residualLikelihood,
      residual_impact: risk.residualImpact,
      residual_score: risk.residualScore,
      residual_rating: risk.residualRating,
      updated_at: now,
      updated_by: state.currentUser.userId
    })
    .eq('risk_id', riskId);

  if (riskUpdateError) {
    console.error('Risk residual update failed:', riskUpdateError);
    alert('잔여 Risk 저장 실패');
    return;
  }

  appendLog('control', control.controlId, 'create', null, pickControlLogFields(control));

  markDirtyAndRender();
}


async function deleteRisk(riskId) {
  const risk = getRiskById(riskId);
  if (!risk) return;

  const controlCount = getControlsByRiskId(riskId).length;
  const ok = confirm(`Risk '${risk.riskId}' 를 삭제하시겠습니까?\n연결된 Control ${controlCount}건도 함께 삭제 처리됩니다.`);
  if (!ok) return;

  const before = pickRiskLogFields(risk);
  const now = nowIso();
  const userId = state.currentUser.userId;

  const { error: riskError } = await supabase
    .from('risks')
    .update({ is_deleted: true, updated_at: now, updated_by: userId })
    .eq('risk_id', riskId);

  if (riskError) {
    console.error('Risk delete failed:', riskError);
    alert('Risk 삭제 실패');
    return;
  }

  const { error: controlsError } = await supabase
    .from('controls')
    .update({ is_deleted: true, updated_at: now, updated_by: userId })
    .eq('risk_id', riskId);

  if (controlsError) {
    console.error('Linked controls delete failed:', controlsError);
    alert('연결된 Control 삭제 실패');
    return;
  }

  risk.isDeleted = true;
  risk.updatedAt = now;
  risk.updatedBy = userId;

  state.db.controls.forEach((control) => {
    if (control.riskId === riskId && !control.isDeleted) {
      control.isDeleted = true;
      control.updatedAt = now;
      control.updatedBy = userId;
    }
  });

  appendLog('risk', risk.riskId, 'delete', before, null);
  markDirtyAndRender();
}

async function deleteControl(controlId) {
  const control = getControlById(controlId);
  if (!control) return;

  const ok = confirm(`Control '${control.controlCode || control.controlId}' 를 삭제하시겠습니까?`);
  if (!ok) return;

  const before = pickControlLogFields(control);
  const now = nowIso();
  const userId = state.currentUser.userId;

  const { error } = await supabase
    .from('controls')
    .update({ is_deleted: true, updated_at: now, updated_by: userId })
    .eq('control_id', controlId);

  if (error) {
    console.error('Control delete failed:', error);
    alert('Control 삭제 실패');
    return;
  }

  control.isDeleted = true;
  control.updatedAt = now;
  control.updatedBy = userId;

  appendLog('control', control.controlId, 'delete', before, null);
  markDirtyAndRender();
}

async function updateField(targetType, targetId, field, value) {
  const now = nowIso();
  const userId = state.currentUser.userId;

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
    risk.updatedAt = now;
    risk.updatedBy = userId;

    const patch = {
      updated_at: now,
      updated_by: userId
    };
    const fieldMap = {
      departmentName: 'department_name',
      referenceLaw: 'reference_law',
      regulationDetail: 'regulation_detail',
      sanction: 'sanction',
      riskContent: 'risk_content',
      inherentLikelihood: 'inherent_likelihood',
      inherentImpact: 'inherent_impact',
      inherentScore: 'inherent_score',
      inherentRating: 'inherent_rating',
      residualLikelihood: 'residual_likelihood',
      residualImpact: 'residual_impact',
      residualScore: 'residual_score',
      residualRating: 'residual_rating',
      status: 'status'
    };
    if (fieldMap[field]) patch[fieldMap[field]] = risk[field];
    patch.inherent_score = risk.inherentScore;
    patch.inherent_rating = risk.inherentRating;
    patch.residual_score = risk.residualScore;
    patch.residual_rating = risk.residualRating;

    const { error } = await supabase
      .from('risks')
      .update(patch)
      .eq('risk_id', targetId);

    if (error) {
      console.error('Risk update failed:', error);
      alert('Risk 수정 실패');
      state.db.risks[state.db.risks.findIndex(r => r.riskId === targetId)] = before;
      render();
      return;
    }

    appendLog('risk', risk.riskId, 'update', pickRiskLogFields(before), pickRiskLogFields(risk));
  } else if (targetType === 'control') {
    const control = getControlById(targetId);
    if (!control) return;

    const before = shallowClone(control);
    control[field] = value;
    if (field === 'controlName') control.controlTitle = value;
    if (field === 'controlContent') control.controlDescription = value;
    if (field === 'controlDepartment') control.controlOwner = value;
    control.updatedAt = now;
    control.updatedBy = userId;

    const fieldMap = {
      controlName: 'control_name',
      controlContent: 'control_content',
      controlType: 'control_type',
      controlOperationType: 'control_operation_type',
      controlFrequency: 'control_frequency',
      controlDepartment: 'control_department',
      controlOwnerName: 'control_owner_name'
    };
    const patch = {
      updated_at: now,
      updated_by: userId
    };
    if (fieldMap[field]) patch[fieldMap[field]] = control[field];
    if (field === 'controlName') patch.control_title = control.controlTitle;
    if (field === 'controlContent') patch.control_description = control.controlDescription;
    if (field === 'controlDepartment') patch.control_owner = control.controlOwner;

    const { error } = await supabase
      .from('controls')
      .update(patch)
      .eq('control_id', targetId);

    if (error) {
      console.error('Control update failed:', error);
      alert('Control 수정 실패');
      state.db.controls[state.db.controls.findIndex(c => c.controlId === targetId)] = before;
      render();
      return;
    }

    appendLog('control', control.controlId, 'update', pickControlLogFields(before), pickControlLogFields(control));
  }

  state.isDirty = false;
  markDirtyAndRender();
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
    controlMonths: formatControlMonths(control?.controlMonths || []),
    responsibleDepartment: control?.controlDepartment || risk.responsibleDepartment || '',
    ownerName: control?.controlOwnerName || risk.ownerName || '',
    residualLikelihood: control ? (risk.residualLikelihood || '') : '',
    residualImpact: control ? (risk.residualImpact || '') : '',
    residualRating: control ? (risk.residualRating || '') : '',
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

function inferTeamName(folderId) {
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
  const baseRiskCode = getBaseRiskCode(risk?.riskId || '');
  const match = baseRiskCode.match(/^R-([A-Z]+)-(\d{2})-(\d{2})$/);
  const controlSeq = pad2(getControlsByRiskId(risk.riskId).length + 1);

  if (!match) {
    return `C-${String(baseRiskCode).replace(/[^A-Za-z0-9-]/g, '').slice(0, 20)}-${controlSeq}`;
  }

  const [, teamCode, lawCode, riskSeq] = match;
  return `C-${teamCode}-${lawCode}-${riskSeq}-${controlSeq}`;
}

function nextRiskSequence(teamCode, lawCode) {
  const prefix = `R-${teamCode}-${pad2(lawCode)}-`;
  const used = getActiveRisks()
    .map((risk) => {
      const id = String(risk.riskId || '');
      if (!id.startsWith(prefix)) return 0;
      const parts = id.split('-');
      return Number(parts[3] || 0);
    })
    .filter((num) => Number.isFinite(num) && num > 0)
    .sort((a, b) => a - b);

  let next = 1;
  for (const num of used) {
    if (num === next) next += 1;
    else if (num > next) break;
  }
  return next;
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

async function moveRiskToFolder(riskId, targetFolderId) {
  const risk = getRiskById(riskId);
  const targetFolder = getFolderById(targetFolderId);
  if (!risk || !targetFolder) return;

  const before = pickRiskLogFields(risk);
  const now = nowIso();
  const userId = state.currentUser.userId;

  const { error } = await supabase
    .from('risks')
    .update({
      folder_id: targetFolderId,
      updated_at: now,
      updated_by: userId
    })
    .eq('risk_id', riskId);

  if (error) {
    console.error('Risk move failed:', error);
    alert('Risk 이동 실패');
    return;
  }

  risk.folderId = targetFolderId;
  risk.departmentName = risk.departmentName || targetFolder.folderName;
  risk.updatedAt = now;
  risk.updatedBy = userId;

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
    controlMonths: normalizeControlMonths(control.controlMonths),
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
      <div class="modal-box">
        <style>
          .risk-help-trigger{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;margin-left:6px;border:1px solid #93c5fd;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:700;cursor:pointer;vertical-align:middle;line-height:1;padding:0;}
          .risk-help-trigger:hover{background:#dbeafe;}
          .risk-help-popover{position:absolute;top:calc(100% + 8px);left:0;z-index:50;width:min(760px, calc(100vw - 80px));max-height:340px;overflow:auto;background:#fff;border:1px solid #cbd5e1;border-radius:12px;box-shadow:0 12px 32px rgba(15,23,42,.18);padding:14px;}
          .risk-help-popover-title{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:10px;}
          .risk-help-popover-table{width:100%;border-collapse:collapse;font-size:12px;}
          .risk-help-popover-table th,.risk-help-popover-table td{border:1px solid #cbd5e1;padding:8px 10px;vertical-align:top;text-align:left;word-break:keep-all;}
          .risk-help-popover-table th{background:#f8fafc;font-weight:700;}
          .risk-help-popover-note{margin-top:10px;padding:10px 12px;background:#fff7ed;border:1px solid #fdba74;border-radius:10px;font-size:12px;line-height:1.5;color:#9a3412;}
        </style>
        ${content}
      </div>
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


function truncateText(value, maxLength = 24) {
  const text = String(value ?? '');
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function renderViewButton(type, id) {
  if (!id) return '';
  const attr = type === 'risk' ? 'data-view-risk' : 'data-view-control';
  return `<button type="button" class="ghost-btn small-btn" ${attr}="${escapeHtml(id)}">View</button>`;
}

function openRiskDetail(riskId) {
  const risk = getRiskById(riskId);
  if (!risk) return;

  openModal(`
    <div class="modal-header">
      <h3>Risk Detail</h3>
      <button id="modalCloseBtn" class="ghost-btn">닫기</button>
    </div>
    <div class="kv-list" style="margin-bottom:16px;">
      <div>Risk Code</div><div class="mono">${escapeHtml(getDisplayRiskCode(risk.riskId || ''))}</div>
      <div>프로세스</div><div>${escapeHtml(risk.departmentName || '')}</div>
      <div>관련규정</div><div class="detail-block">${escapeHtml(risk.referenceLaw || '')}</div>
      <div>규정세부내용</div><div class="detail-block">${escapeHtml(risk.regulationDetail || '')}</div>
      <div>관련 제재</div><div class="detail-block">${escapeHtml(risk.sanction || '')}</div>
      <div>Risk 내용</div><div class="detail-block">${escapeHtml(risk.riskContent || risk.riskDescription || risk.riskTitle || '')}</div>
      <div>고유 Risk 발생가능성</div><div>${escapeHtml(risk.inherentLikelihood || '')}</div>
      <div>고유 Risk 결과 심각성</div><div>${escapeHtml(risk.inherentImpact || '')}</div>
      <div>고유 Risk Rating</div><div>${renderBadge(risk.inherentRating || '')}</div>
    </div>
  `);
  const btn = document.getElementById('modalCloseBtn');
  if (btn) btn.addEventListener('click', closeModal);
}

function openControlDetail(controlId) {
  const control = getControlById(controlId);
  if (!control) return;
  const risk = getRiskById(control.riskId);

  openModal(`
    <div class="modal-header">
      <h3>Control Detail</h3>
      <button id="modalCloseBtn" class="ghost-btn">닫기</button>
    </div>
    <div class="kv-list" style="margin-bottom:16px;">
      <div>Control Code</div><div class="mono">${escapeHtml(control.controlCode || control.controlId || '')}</div>
      <div>Control 명</div><div>${escapeHtml(control.controlName || control.controlTitle || '')}</div>
      <div>Control 내용</div><div class="detail-block">${escapeHtml(control.controlContent || control.controlDescription || '')}</div>
      <div>통제 유형</div><div>${escapeHtml(control.controlType || '')}</div>
      <div>통제 수행 방식</div><div>${escapeHtml(control.controlOperationType || '')}</div>
      <div>통제 주기</div><div>${escapeHtml(control.controlFrequency || '')}</div>
      <div>수행 월</div><div>${escapeHtml(formatControlMonths(control.controlMonths || []))}</div>
      <div>팀 명</div><div>${escapeHtml(control.controlDepartment || control.controlOwner || '')}</div>
      <div>담당자</div><div>${escapeHtml(control.controlOwnerName || '')}</div>
      <div>잔여 Risk 발생가능성</div><div>${escapeHtml(risk?.residualLikelihood || '')}</div>
      <div>잔여 Risk 결과 심각성</div><div>${escapeHtml(risk?.residualImpact || '')}</div>
      <div>잔여 Risk Rating</div><div>${renderBadge(risk?.residualRating || '')}</div>
    </div>
  `);
  const btn = document.getElementById('modalCloseBtn');
  if (btn) btn.addEventListener('click', closeModal);
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

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function isManager() {
  return state.currentUser && String(state.currentUser.role).toLowerCase() === 'manager';
}

function canEdit() {
  return isManager() && state.isEditMode === true;
}

function blockViewerAction() {
  if (!isManager()) {
    alert('Manager 계정만 수정할 수 있습니다.');
    return;
  }
  alert('수정 버튼을 눌러 Edit Mode를 활성화한 후 수정할 수 있습니다.');
}

function columnLabel(col) {
  const labels = {
    departmentName: '프로세스',
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
    responsibleDepartment: '팀 명',
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

function getBaseRiskCode(riskId) {
  const text = String(riskId || '');
  const match = text.match(/^(R-[A-Z]+-\d{2}-\d{2})/);
  return match ? match[1] : text;
}

function getDisplayRiskCode(riskId) {
  return getBaseRiskCode(riskId);
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
