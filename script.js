(() => {

  const SUPABASE_URL = "https://zdcfvnestdbckibhiakb.supabase.co";
  const SUPABASE_KEY = "sb_publishable_iPLYQMYoAreDwa66gN7lNw_DUs4xZf8";

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
    monitoring_records: []
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
    }))
  };
}

  function normalizeDatabase() {
    if (!state.db || typeof state.db !== 'object') {
      state.db = cloneDbTemplate();
      persistDatabase();
      return;
    }

    state.db.users = Array.isArray(state.db.users) && state.db.users.length ? state.db.users : cloneDbTemplate().users;
    state.db.folders = Array.isArray(state.db.folders) ? state.db.folders : [];
    state.db.risks = Array.isArray(state.db.risks) ? state.db.risks : [];
    state.db.controls = Array.isArray(state.db.controls) ? state.db.controls : [];
    state.db.change_logs = Array.isArray(state.db.change_logs) ? state.db.change_logs : [];
    state.db.monitoring_records = Array.isArray(state.db.monitoring_records) ? state.db.monitoring_records : [];

    state.db.folders = state.db.folders.map((folder, index) => ({
      folderId: folder.folderId || `F${String(index + 1).padStart(3, '0')}`,
      folderName: folder.folderName || 'New Folder',
      parentFolderId: folder.parentFolderId || null,
      folderLevel: Number(folder.folderLevel) || 1,
      sortOrder: Number(folder.sortOrder) || (index + 1) * 10,
      isDeleted: !!folder.isDeleted,
      createdAt: folder.createdAt || nowIso(),
      createdBy: folder.createdBy || getCurrentUserIdSafe(),
      updatedAt: folder.updatedAt || folder.createdAt || nowIso(),
      updatedBy: folder.updatedBy || folder.createdBy || getCurrentUserIdSafe()
    }));

    state.db.risks = state.db.risks.map((risk, index) => ({
      riskId: risk.riskId || `R${String(index + 1).padStart(3, '0')}`,
      folderId: risk.folderId || null,
      riskCode: risk.riskCode || '',
      departmentName: risk.departmentName || '',
      teamCode: risk.teamCode || '',
      lawCode: risk.lawCode || '',
      referenceLaw: risk.referenceLaw || '',
      regulationDetail: risk.regulationDetail || '',
      sanction: risk.sanction || '',
      riskTitle: risk.riskTitle || '',
      riskDescription: risk.riskDescription || '',
      riskContent: risk.riskContent || '',
      riskContext: risk.riskContext || '',
      responsibleDepartment: risk.responsibleDepartment || '',
      ownerName: risk.ownerName || '',
      inherentLikelihood: normalizeScore(risk.inherentLikelihood),
      inherentImpact: normalizeScore(risk.inherentImpact),
      inherentScore: normalizeScore(risk.inherentScore),
      inherentRating: risk.inherentRating || '',
      residualLikelihood: normalizeScore(risk.residualLikelihood),
      residualImpact: normalizeScore(risk.residualImpact),
      residualScore: normalizeScore(risk.residualScore),
      residualRating: risk.residualRating || '',
      status: risk.status || 'Open',
      entity: risk.entity || '',
      country: risk.country || '',
      isDeleted: !!risk.isDeleted,
      createdAt: risk.createdAt || nowIso(),
      createdBy: risk.createdBy || getCurrentUserIdSafe(),
      updatedAt: risk.updatedAt || risk.createdAt || nowIso(),
      updatedBy: risk.updatedBy || risk.createdBy || getCurrentUserIdSafe()
    }));

    state.db.controls = state.db.controls.map((control, index) => ({
      controlId: control.controlId || `C${String(index + 1).padStart(3, '0')}`,
      controlCode: control.controlCode || '',
      riskId: control.riskId || null,
      controlTitle: control.controlTitle || '',
      controlName: control.controlName || '',
      controlDescription: control.controlDescription || '',
      controlContent: control.controlContent || '',
      controlType: control.controlType || '',
      controlOperationType: control.controlOperationType || '',
      controlFrequency: control.controlFrequency || '',
      controlDepartment: control.controlDepartment || '',
      controlOwnerName: control.controlOwnerName || '',
      isDeleted: !!control.isDeleted,
      createdAt: control.createdAt || nowIso(),
      createdBy: control.createdBy || getCurrentUserIdSafe(),
      updatedAt: control.updatedAt || control.createdAt || nowIso(),
      updatedBy: control.updatedBy || control.createdBy || getCurrentUserIdSafe()
    }));

    state.db.change_logs = state.db.change_logs.map((log, index) => ({
      logId: log.logId || `L${String(index + 1).padStart(3, '0')}`,
      targetType: log.targetType || '',
      targetId: log.targetId || '',
      actionType: log.actionType || '',
      beforeValue: log.beforeValue ?? '',
      afterValue: log.afterValue ?? '',
      changedAt: log.changedAt || nowIso(),
      changedBy: log.changedBy || getCurrentUserIdSafe()
    }));

    state.db.monitoring_records = state.db.monitoring_records.map((record, index) => ({
      recordId: record.recordId || `M${String(index + 1).padStart(4, '0')}`,
      year: Number(record.year) || state.monitoringYear || 2026,
      controlId: record.controlId || '',
      riskId: record.riskId || getControlById(record.controlId)?.riskId || '',
      evidenceFile: record.evidenceFile || null,
      uploadedAt: record.uploadedAt || '',
      submissionStatus: record.submissionStatus || 'Not Submitted',
      reviewResult: record.reviewResult || 'Pending',
      reviewComment: record.reviewComment || '',
      isDeleted: !!record.isDeleted,
      createdAt: record.createdAt || nowIso(),
      createdBy: record.createdBy || getCurrentUserIdSafe(),
      updatedAt: record.updatedAt || record.createdAt || nowIso(),
      updatedBy: record.updatedBy || record.createdBy || getCurrentUserIdSafe()
    }));

    state.db.folders.sort((a, b) => a.sortOrder - b.sortOrder || a.folderName.localeCompare(b.folderName));
    persistDatabase();
  }

  function initializeExpanded() {
    if (state.expanded.size) return;
    getRootFolders().forEach((folder) => state.expanded.add(folder.folderId));
  }

  function renderLoading() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="brand">ICM</div>
          <div class="sidebar-loading">Loading...</div>
        </aside>
        <main class="main-panel">
          <div class="loading-panel">Loading data...</div>
        </main>
      </div>
    `;
  }

  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (!state.currentUser) {
      app.innerHTML = renderLoginPage();
      bindGlobalEvents();
      return;
    }

    const isRcm = state.currentModule === 'rcm';
    const isDashboard = state.currentModule === 'dashboard';
    const isMonitoring = state.currentModule === 'monitoring';

    app.innerHTML = `
      <div class="app-shell">
        ${renderSidebar()}
        <main class="main-panel">
          ${renderHeader()}
          <section class="content-area">
            ${isDashboard ? renderDashboardModule() : ''}
            ${isRcm ? renderRcmModule() : ''}
            ${isMonitoring ? renderMonitoringModule() : ''}
          </section>
        </main>
      </div>
    `;

    bindGlobalEvents();
  }

  function renderLoginPage() {
    return `
      <div class="login-shell">
        <div class="login-card">
          <div class="login-brand">ICM Portal</div>
          <div class="login-title">Sign in</div>
          <label class="login-label">Username</label>
          <input id="login-username" class="login-input" type="text" placeholder="Manager or User" />
          <label class="login-label">Password</label>
          <input id="login-password" class="login-input" type="password" placeholder="0000" />
          <button id="login-submit" class="btn btn-primary btn-block">Login</button>
          <div class="login-help">Manager / 0000 또는 User / 0000</div>
        </div>
      </div>
    `;
  }

  function renderSidebar() {
    const folderTree = renderFolderTree();
    return `
      <aside class="sidebar">
        <div class="sidebar-top">
          <div class="brand-wrap">
            <div class="brand">ICM</div>
            <div class="brand-sub">Integrated Compliance Management</div>
          </div>
          <div class="user-badge ${state.currentUser.role}">
            <span class="dot"></span>
            <span>${escapeHtml(state.currentUser.displayName)} (${escapeHtml(state.currentUser.role)})</span>
          </div>
        </div>

        <nav class="menu-group">
          <button class="menu-item ${state.currentModule === 'dashboard' ? 'active' : ''}" data-action="switch-module" data-module="dashboard">
            <span class="menu-icon">🏠</span><span>Welcome</span>
          </button>
          <button class="menu-item ${state.currentModule === 'rcm' ? 'active' : ''}" data-action="switch-module" data-module="rcm">
            <span class="menu-icon">🧩</span><span>RCM</span>
          </button>
          <div class="menu-section">Monitoring</div>
          <div class="monitoring-year-list">
            ${Array.from({ length: 10 }, (_, i) => 2026 + i).map((year) => `
              <button class="menu-item monitoring-year ${state.currentModule === 'monitoring' && state.monitoringYear === year ? 'active' : ''}" data-action="monitoring-year" data-year="${year}">
                <span class="menu-icon">📅</span><span>FY${year}</span>
              </button>
            `).join('')}
          </div>
        </nav>

        ${state.currentModule === 'rcm' ? `
          <section class="tree-panel">
            <div class="tree-tools">
              <div class="tree-title">Folders</div>
              <div class="tree-actions">
                ${isManager() ? `<button class="icon-btn" data-action="add-folder-root" title="상위 폴더 추가">＋</button>` : ''}
              </div>
            </div>
            <div class="tree-search-wrap">
              <input id="tree-search-input" class="tree-search-input" type="text" placeholder="폴더 검색" value="${escapeAttr(state.treeSearch)}" />
            </div>
            <div class="tree-scroll">
              ${folderTree}
            </div>
          </section>
        ` : '<div class="sidebar-spacer"></div>'}

        <div class="sidebar-footer">
          <button class="menu-item subtle" data-action="logout">Logout</button>
        </div>
      </aside>
    `;
  }

  function renderHeader() {
    const folder = getFolderById(state.selectedFolderId);
    const folderPath = folder ? getFolderPath(folder.folderId).map((item) => item.folderName).join(' > ') : '';
    return `
      <header class="topbar">
        <div class="topbar-left">
          <div class="topbar-title">${state.currentModule === 'dashboard' ? 'Welcome' : state.currentModule === 'monitoring' ? `Monitoring FY${state.monitoringYear}` : 'Risk Control Matrix'}</div>
          <div class="topbar-subtitle">${escapeHtml(folderPath || '')}</div>
        </div>
        <div class="topbar-right">
          <div class="sync-status ${state.isDirty ? 'dirty' : 'ready'}">${state.isDirty ? 'Unsaved' : 'Ready'}</div>
        </div>
      </header>
    `;
  }

  function renderDashboardModule() {
    const activeFolders = getActiveFolders();
    const activeRisks = getActiveRisks();
    const activeControls = getActiveControls();
    const openRisks = activeRisks.filter((risk) => (risk.status || 'Open') !== 'Closed');

    const folderCount = activeFolders.length;
    const riskCount = activeRisks.length;
    const controlCount = activeControls.length;
    const highRiskCount = activeRisks.filter((risk) => (risk.inherentRating || '').toLowerCase() === 'high').length;

    const heatmap = buildHeatmapMatrix();
    const maxCell = Math.max(1, ...heatmap.flat().map((v) => v.count));

    return `
      <section class="dashboard-grid">
        <div class="stat-card">
          <div class="stat-label">Folders</div>
          <div class="stat-value">${folderCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Risks</div>
          <div class="stat-value">${riskCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Controls</div>
          <div class="stat-value">${controlCount}</div>
        </div>
        <div class="stat-card danger">
          <div class="stat-label">High Inherent Risk</div>
          <div class="stat-value">${highRiskCount}</div>
        </div>
      </section>

      <section class="dashboard-panels">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Recent Risks</div>
          </div>
          <div class="panel-body">
            ${openRisks.slice(0, 8).map((risk) => `
              <div class="recent-item">
                <div class="recent-title">${escapeHtml(risk.riskCode || risk.riskTitle || risk.riskId)}</div>
                <div class="recent-sub">${escapeHtml(risk.riskContent || '')}</div>
              </div>
            `).join('') || '<div class="empty-state small">No risks available.</div>'}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Risk Heatmap</div>
            <div class="panel-actions">
              ${state.heatmapFilter ? `<button class="btn btn-light btn-xs" data-action="clear-heatmap-filter">필터 해제</button>` : ''}
            </div>
          </div>
          <div class="panel-body">
            <div class="heatmap-wrap">
              <div class="heatmap-grid">
                <div class="heatmap-axis top">Result Severity</div>
                <div class="heatmap-axis left">Likelihood</div>
                <div class="heatmap-board">
                  ${[5, 4, 3, 2, 1].map((impact) => `
                    <div class="heatmap-row">
                      ${[1, 2, 3, 4, 5].map((likelihood) => {
                        const cell = heatmap[impact - 1][likelihood - 1];
                        const intensity = cell.count / maxCell;
                        const levelClass = getHeatmapLevelClass(impact * likelihood);
                        const active = state.heatmapFilter && state.heatmapFilter.likelihood === likelihood && state.heatmapFilter.impact === impact;
                        return `
                          <button
                            class="heatmap-cell ${levelClass} ${active ? 'active' : ''}"
                            data-action="heatmap-filter"
                            data-likelihood="${likelihood}"
                            data-impact="${impact}"
                            title="Likelihood ${likelihood}, Impact ${impact}, Count ${cell.count}"
                            style="--cell-intensity:${Math.max(0.15, intensity)}"
                          >
                            <span class="heatmap-count">${cell.count}</span>
                          </button>
                        `;
                      }).join('')}
                    </div>
                  `).join('')}
                </div>
                <div class="heatmap-scale x">
                  ${[1, 2, 3, 4, 5].map((n) => `<span>${n}</span>`).join('')}
                </div>
                <div class="heatmap-scale y">
                  ${[5, 4, 3, 2, 1].map((n) => `<span>${n}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderRcmModule() {
    const selectedFolder = getFolderById(state.selectedFolderId);
    const risks = getVisibleRisksByFolder(state.selectedFolderId);

    return `
      <section class="workspace">
        <div class="workspace-toolbar">
          <div class="workspace-left">
            <div class="workspace-title">${escapeHtml(selectedFolder ? selectedFolder.folderName : 'Select a folder')}</div>
            <div class="workspace-subtitle">${selectedFolder ? `${risks.length} risk(s)` : '폴더를 선택하면 위험 및 통제 목록이 표시됩니다.'}</div>
          </div>
          <div class="workspace-actions">
            <input id="risk-search-input" class="search-input" type="text" placeholder="Risk / Control 검색" value="${escapeAttr(state.search)}" />
            ${isManager() && selectedFolder ? `<button class="btn btn-primary" data-action="add-risk">+ Add Risk</button>` : ''}
            ${isManager() ? `<button class="btn btn-light" data-action="save-db">Save</button>` : ''}
          </div>
        </div>

        <div class="rcm-table-wrap">
          ${selectedFolder ? renderRcmTable(risks) : '<div class="empty-state">왼쪽에서 폴더를 선택해 주세요.</div>'}
        </div>
      </section>
    `;
  }

  function renderRcmTable(risks) {
    return `
      <div class="table-scroll">
        <table class="rcm-table">
          <thead>
            <tr>
              <th class="sticky-col th-folder">부서</th>
              <th class="th-riskcode">Risk Code</th>
              <th class="th-law">관련규정</th>
              <th class="th-detail">규정세부내용</th>
              <th class="th-sanction">관련 제재</th>
              <th class="th-riskcontent">Risk 내용</th>
              <th class="th-score">고유 Risk<br/>발생가능성</th>
              <th class="th-score">고유 Risk<br/>결과 심각성</th>
              <th class="th-score">고유 Risk<br/>Score</th>
              <th class="th-score">고유 Risk<br/>Rating</th>
              <th class="th-controlcode">Control Code</th>
              <th class="th-controlname">통제 명</th>
              <th class="th-controlcontent">통제활동</th>
              <th class="th-controltype">통제유형</th>
              <th class="th-controlop">운영유형</th>
              <th class="th-controlfreq">빈도</th>
              <th class="th-controlowner">통제부서</th>
              <th class="th-controlperson">통제담당자</th>
              <th class="th-score">잔여 Risk<br/>발생가능성</th>
              <th class="th-score">잔여 Risk<br/>결과 심각성</th>
              <th class="th-score">잔여 Risk<br/>Score</th>
              <th class="th-score">잔여 Risk<br/>Rating</th>
              <th class="th-actions">작업</th>
            </tr>
          </thead>
          <tbody>
            ${risks.map((risk) => renderRiskRow(risk)).join('') || `
              <tr>
                <td colspan="23">
                  <div class="empty-state inline">표시할 Risk가 없습니다.</div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderRiskRow(risk) {
    const controls = getControlsByRiskId(risk.riskId);
    const riskScoreInherent = computeRiskScore(risk.inherentLikelihood, risk.inherentImpact);
    const riskRatingInherent = computeRiskRating(riskScoreInherent);
    const riskScoreResidual = computeRiskScore(risk.residualLikelihood, risk.residualImpact);
    const riskRatingResidual = computeRiskRating(riskScoreResidual);
    const controlRows = controls.length ? controls : [null];

    return controlRows.map((control, index) => {
      const rowClass = state.selectedRiskId === risk.riskId ? 'selected' : '';
      const isFirst = index === 0;
      return `
        <tr class="risk-row ${rowClass}" data-risk-id="${risk.riskId}">
          ${isFirst ? `
            <td class="sticky-col">${renderEditableCell('risk', risk.riskId, 'departmentName', risk.departmentName, { type: 'text', rows: 1 })}</td>
            <td>${renderReadonlyText(risk.riskCode)}</td>
            <td>${renderEditableCell('risk', risk.riskId, 'referenceLaw', risk.referenceLaw, { type: 'textarea', rows: 2 })}</td>
            <td>${renderEditableCell('risk', risk.riskId, 'regulationDetail', risk.regulationDetail, { type: 'textarea', rows: 3 })}</td>
            <td>${renderEditableCell('risk', risk.riskId, 'sanction', risk.sanction, { type: 'textarea', rows: 2 })}</td>
            <td>${renderEditableCell('risk', risk.riskId, 'riskContent', risk.riskContent, { type: 'textarea', rows: 3 })}</td>
            <td>${renderRatingButtons('risk', risk.riskId, 'inherentLikelihood', risk.inherentLikelihood)}</td>
            <td>${renderRatingButtons('risk', risk.riskId, 'inherentImpact', risk.inherentImpact)}</td>
            <td>${renderReadonlyBadge(String(riskScoreInherent || ''))}</td>
            <td>${renderRiskBadge(riskRatingInherent)}</td>
          ` : `
            <td class="sticky-col continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
          `}

          <td>${control ? renderReadonlyText(control.controlCode) : '<div class="readonly-cell"></div>'}</td>
          <td>${control ? renderEditableCell('control', control.controlId, 'controlName', control.controlName, { type: 'text', rows: 1 }) : '<div class="readonly-cell"></div>'}</td>
          <td>${control ? renderEditableCell('control', control.controlId, 'controlContent', control.controlContent, { type: 'textarea', rows: 3 }) : '<div class="readonly-cell"></div>'}</td>
          <td>${control ? renderControlTypeCell(control) : '<div class="readonly-cell"></div>'}</td>
          <td>${control ? renderControlOperationTypeCell(control) : '<div class="readonly-cell"></div>'}</td>
          <td>${control ? renderControlFrequencyCell(control) : '<div class="readonly-cell"></div>'}</td>
          <td>${control ? renderEditableCell('control', control.controlId, 'controlDepartment', control.controlDepartment, { type: 'text', rows: 1 }) : '<div class="readonly-cell"></div>'}</td>
          <td>${control ? renderEditableCell('control', control.controlId, 'controlOwnerName', control.controlOwnerName, { type: 'text', rows: 1 }) : '<div class="readonly-cell"></div>'}</td>

          ${isFirst ? `
            <td>${renderRatingButtons('risk', risk.riskId, 'residualLikelihood', risk.residualLikelihood)}</td>
            <td>${renderRatingButtons('risk', risk.riskId, 'residualImpact', risk.residualImpact)}</td>
            <td>${renderReadonlyBadge(String(riskScoreResidual || ''))}</td>
            <td>${renderRiskBadge(riskRatingResidual)}</td>
          ` : `
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
            <td class="continued-cell"></td>
          `}

          <td>
            <div class="row-actions">
              ${isFirst && isManager() ? `<button class="icon-btn" data-action="add-control" data-risk-id="${risk.riskId}" title="Control 추가">＋C</button>` : ''}
              ${isManager() && control ? `<button class="icon-btn danger" data-action="delete-control" data-control-id="${control.controlId}" title="Control 삭제">🗑</button>` : ''}
              ${isFirst && isManager() ? `<button class="icon-btn danger" data-action="delete-risk" data-risk-id="${risk.riskId}" title="Risk 삭제">✕R</button>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderMonitoringModule() {
    ensureMonitoringRecordsForYear(state.monitoringYear);
    const rows = getMonitoringRows(state.monitoringYear);

    return `
      <section class="workspace">
        <div class="workspace-toolbar">
          <div class="workspace-left">
            <div class="workspace-title">Monitoring FY${state.monitoringYear}</div>
            <div class="workspace-subtitle">${rows.length} control monitoring item(s)</div>
          </div>
          <div class="workspace-actions">
            <input id="monitoring-search-input" class="search-input" type="text" placeholder="Control / 담당자 검색" value="${escapeAttr(state.search)}" />
          </div>
        </div>

        <div class="rcm-table-wrap">
          <div class="table-scroll">
            <table class="monitoring-table">
              <thead>
                <tr>
                  <th>Risk Code</th>
                  <th>Risk</th>
                  <th>Control Code</th>
                  <th>통제 명</th>
                  <th>통제활동</th>
                  <th>통제유형</th>
                  <th>빈도</th>
                  <th>담당부서</th>
                  <th>담당자</th>
                  <th>제출상태</th>
                  <th>증빙</th>
                  <th>업로드일시</th>
                  <th>검토결과</th>
                  <th>검토의견</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map((row) => renderMonitoringRow(row)).join('') || `
                  <tr>
                    <td colspan="14"><div class="empty-state inline">표시할 Monitoring 항목이 없습니다.</div></td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function renderMonitoringRow(row) {
    const { risk, control, record } = row;
    return `
      <tr>
        <td>${renderReadonlyText(risk?.riskCode || '')}</td>
        <td>${renderReadonlyText(risk?.riskContent || risk?.riskTitle || '')}</td>
        <td>${renderReadonlyText(control?.controlCode || '')}</td>
        <td>${renderReadonlyText(control?.controlName || '')}</td>
        <td>${renderReadonlyText(control?.controlContent || '')}</td>
        <td>${renderReadonlyText(control?.controlType || '')}</td>
        <td>${renderReadonlyText(control?.controlFrequency || '')}</td>
        <td>${renderReadonlyText(control?.controlDepartment || '')}</td>
        <td>${renderReadonlyText(control?.controlOwnerName || '')}</td>
        <td>${renderSubmissionStatusCell(record)}</td>
        <td>${renderEvidenceCell(record)}</td>
        <td>${renderReadonlyText(record.uploadedAt ? formatDateTime(record.uploadedAt) : '')}</td>
        <td>${renderReviewResultCell(record)}</td>
        <td>${renderMonitoringCommentCell(record)}</td>
      </tr>
    `;
  }

  function renderFolderTree() {
    const roots = getFilteredTreeRoots();
    if (!roots.length) {
      return `<div class="empty-state small">폴더가 없습니다.</div>`;
    }
    return `<div class="tree-root">${roots.map((folder) => renderFolderNode(folder)).join('')}</div>`;
  }

  function renderFolderNode(folder) {
    const children = getChildFolders(folder.folderId).filter((child) => matchesTreeSearch(child));
    const hasChildren = children.length > 0;
    const expanded = state.expanded.has(folder.folderId);
    const selected = state.selectedFolderId === folder.folderId;

    return `
      <div class="tree-node ${selected ? 'selected' : ''}">
        <div class="tree-row">
          <button class="tree-toggle ${hasChildren ? '' : 'placeholder'}" data-action="toggle-folder" data-folder-id="${folder.folderId}">
            ${hasChildren ? (expanded ? '▾' : '▸') : ''}
          </button>
          <button class="tree-label" data-action="select-folder" data-folder-id="${folder.folderId}">
            <span class="tree-folder-icon">${hasChildren ? '📁' : '📄'}</span>
            <span class="tree-folder-name">${escapeHtml(folder.folderName)}</span>
          </button>
          ${isManager() ? `
            <div class="tree-inline-actions">
              <button class="icon-btn mini" data-action="add-folder-child" data-folder-id="${folder.folderId}" title="하위 폴더 추가">＋</button>
              <button class="icon-btn mini danger" data-action="delete-folder" data-folder-id="${folder.folderId}" title="폴더 삭제">🗑</button>
            </div>
          ` : ''}
        </div>
        ${hasChildren && expanded ? `
          <div class="tree-children">
            ${children.map((child) => renderFolderNode(child)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderEditableCell(targetType, targetId, field, value, options = {}) {
    const rows = options.rows || 1;
    const readonly = !isManager();
    const safeValue = value ?? '';

    if (readonly) {
      return `<div class="readonly-cell ${rows > 1 ? 'multiline' : ''}">${escapeHtml(String(safeValue))}</div>`;
    }

    if (options.type === 'textarea') {
      return `
        <textarea
          class="cell-input cell-textarea"
          data-field-input="1"
          data-target-type="${targetType}"
          data-target-id="${targetId}"
          data-field="${field}"
          rows="${rows}"
        >${escapeHtml(String(safeValue))}</textarea>
      `;
    }

    return `
      <input
        class="cell-input"
        data-field-input="1"
        data-target-type="${targetType}"
        data-target-id="${targetId}"
        data-field="${field}"
        type="text"
        value="${escapeAttr(String(safeValue))}"
      />
    `;
  }

  function renderReadonlyText(value) {
    return `<div class="readonly-cell">${escapeHtml(value || '')}</div>`;
  }

  function renderReadonlyBadge(value) {
    return `<div class="readonly-badge">${escapeHtml(value || '')}</div>`;
  }

  function renderRiskBadge(rating) {
    const normalized = String(rating || '').toLowerCase();
    const cls = normalized === 'high' ? 'high' : normalized === 'medium' ? 'medium' : normalized === 'low' ? 'low' : 'none';
    return `<div class="rating-badge ${cls}">${escapeHtml(rating || '')}</div>`;
  }

  function renderRatingButtons(targetType, targetId, field, value) {
    if (!isManager()) {
      return `
        <div class="rating-group readonly">
          ${[1, 2, 3, 4, 5].map((n) => `
            <span class="rating-pill ${Number(value) === n ? 'selected' : ''}">${n}</span>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="rating-group" data-rating-group="1" data-target-type="${targetType}" data-target-id="${targetId}" data-field="${field}">
        ${[1, 2, 3, 4, 5].map((n) => `
          <button
            class="rating-pill ${Number(value) === n ? 'selected' : ''}"
            data-action="set-rating"
            data-target-type="${targetType}"
            data-target-id="${targetId}"
            data-field="${field}"
            data-value="${n}"
          >${n}</button>
        `).join('')}
      </div>
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
    const value = control?.controlOperationType || '';
    const options = ['Manual', 'Semi-Automated', 'Automated'];
    if (!control?.controlId) return `<div class="readonly-cell"></div>`;
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-target-type="control" data-target-id="${control.controlId}" data-field="controlOperationType">
        ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    `;
  }

  function renderControlFrequencyCell(control) {
    const value = control?.controlFrequency || '';
    const options = ['상시 (Continuous)', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Ad-hoc'];
    if (!control?.controlId) return `<div class="readonly-cell"></div>`;
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-target-type="control" data-target-id="${control.controlId}" data-field="controlFrequency">
        ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    `;
  }

  function renderSubmissionStatusCell(record) {
    const value = record.submissionStatus || 'Not Submitted';
    if (!isManager()) {
      return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
    }
    const options = ['Not Submitted', 'Submitted', 'Reviewed'];
    return `
      <select class="cell-select" data-field-input="1" data-target-type="monitoring" data-target-id="${record.recordId}" data-field="submissionStatus">
        ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    `;
  }

  function renderReviewResultCell(record) {
    const value = record.reviewResult || 'Pending';
    if (!isManager()) {
      return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
    }
    const options = ['Pending', 'Pass', 'Fail', 'Need Follow-up'];
    return `
      <select class="cell-select" data-field-input="1" data-target-type="monitoring" data-target-id="${record.recordId}" data-field="reviewResult">
        ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    `;
  }

  function renderMonitoringCommentCell(record) {
    if (!isManager()) {
      return `<div class="readonly-cell multiline">${escapeHtml(record.reviewComment || '')}</div>`;
    }
    return `
      <textarea
        class="cell-input cell-textarea"
        data-field-input="1"
        data-target-type="monitoring"
        data-target-id="${record.recordId}"
        data-field="reviewComment"
        rows="2"
      >${escapeHtml(record.reviewComment || '')}</textarea>
    `;
  }

  function renderEvidenceCell(record) {
    const fileName = record.evidenceFile?.name || '';
    return `
      <div class="evidence-cell">
        <div class="evidence-name">${escapeHtml(fileName)}</div>
        ${isManager() ? `
          <label class="file-btn">
            Upload
            <input type="file" data-action="upload-evidence" data-record-id="${record.recordId}" hidden />
          </label>
        ` : ''}
      </div>
    `;
  }

  function bindGlobalEvents() {
    const app = document.getElementById('app');
    if (!app) return;

    app.querySelectorAll('[data-action]').forEach((el) => {
      const action = el.dataset.action;
      if (action === 'upload-evidence') {
        el.addEventListener('change', onAction);
      } else {
        el.addEventListener('click', onAction);
      }
    });

    app.querySelectorAll('[data-field-input="1"]').forEach((el) => {
      const eventName = el.tagName === 'SELECT' ? 'change' : 'blur';
      el.addEventListener(eventName, onFieldInput);
    });

    const loginSubmit = document.getElementById('login-submit');
    if (loginSubmit) loginSubmit.addEventListener('click', handleLogin);

    const loginPassword = document.getElementById('login-password');
    if (loginPassword) {
      loginPassword.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') handleLogin();
      });
    }

    const treeSearchInput = document.getElementById('tree-search-input');
    if (treeSearchInput) {
      treeSearchInput.addEventListener('input', (event) => {
        state.treeSearch = event.target.value || '';
        persistUiState();
        render();
      });
    }

    const riskSearchInput = document.getElementById('risk-search-input');
    if (riskSearchInput) {
      riskSearchInput.addEventListener('input', (event) => {
        state.search = event.target.value || '';
        render();
      });
    }

    const monitoringSearchInput = document.getElementById('monitoring-search-input');
    if (monitoringSearchInput) {
      monitoringSearchInput.addEventListener('input', (event) => {
        state.search = event.target.value || '';
        render();
      });
    }
  }

  function onAction(event) {
    const el = event.currentTarget;
    const action = el.dataset.action;
    if (!action) return;

    switch (action) {
      case 'switch-module':
        state.currentModule = el.dataset.module || 'dashboard';
        if (state.currentModule !== 'rcm') state.selectedRiskId = null;
        persistUiState();
        render();
        break;

      case 'monitoring-year': {
        const year = Number(el.dataset.year);
        if (!Number.isFinite(year)) return;
        state.currentModule = 'monitoring';
        state.monitoringYear = year;
        ensureMonitoringRecordsForYear(year);
        persistUiState();
        render();
        break;
      }

      case 'select-folder':
        state.selectedFolderId = el.dataset.folderId || null;
        state.selectedRiskId = null;
        persistUiState();
        render();
        break;

      case 'toggle-folder': {
        const folderId = el.dataset.folderId;
        if (!folderId) return;
        if (state.expanded.has(folderId)) state.expanded.delete(folderId);
        else state.expanded.add(folderId);
        persistUiState();
        render();
        break;
      }

      case 'add-folder-root':
        if (!isManager()) return;
        addFolder(null);
        break;

      case 'add-folder-child':
        if (!isManager()) return;
        addFolder(el.dataset.folderId || null);
        break;

      case 'delete-folder':
        if (!isManager()) return;
        deleteFolder(el.dataset.folderId || null);
        break;

      case 'add-risk':
        if (!isManager()) return;
        addRisk();
        break;

      case 'delete-risk':
        if (!isManager()) return;
        deleteRisk(el.dataset.riskId || null);
        break;

      case 'add-control':
        if (!isManager()) return;
        addControl(el.dataset.riskId || null);
        break;

      case 'delete-control':
        if (!isManager()) return;
        deleteControl(el.dataset.controlId || null);
        break;

      case 'set-rating':
        if (!isManager()) return;
        setRating(el.dataset.targetType, el.dataset.targetId, el.dataset.field, Number(el.dataset.value));
        break;

      case 'save-db':
        if (!isManager()) return;
        saveDatabase();
        break;

      case 'logout':
        logout();
        break;

      case 'upload-evidence':
        if (!isManager()) return;
        uploadEvidence(el.dataset.recordId, event);
        break;

      case 'heatmap-filter': {
        const likelihood = Number(el.dataset.likelihood);
        const impact = Number(el.dataset.impact);
        if (!Number.isFinite(likelihood) || !Number.isFinite(impact)) return;
        if (state.heatmapFilter && state.heatmapFilter.likelihood === likelihood && state.heatmapFilter.impact === impact) {
          state.heatmapFilter = null;
        } else {
          state.heatmapFilter = { likelihood, impact };
        }
        render();
        break;
      }

      case 'clear-heatmap-filter':
        state.heatmapFilter = null;
        render();
        break;

      default:
        break;
    }
  }

  function onFieldInput(event) {
    const el = event.currentTarget;
    const targetType = el.dataset.targetType;
    const targetId = el.dataset.targetId;
    const field = el.dataset.field;
    if (!targetType || !targetId || !field) return;

    const value = el.value;
    updateFieldValue(targetType, targetId, field, value);
  }

  function handleLogin() {
    const username = (document.getElementById('login-username')?.value || '').trim();
    const password = (document.getElementById('login-password')?.value || '').trim();

    const user = state.db?.users?.find((item) =>
      item.username.toLowerCase() === username.toLowerCase() &&
      String(item.password) === String(password) &&
      item.isActive
    );

    if (!user) {
      alert('아이디 또는 비밀번호를 확인해 주세요.');
      return;
    }

    state.currentUser = user;
    persistSession();
    render();
  }

  function logout() {
    state.currentUser = null;
    state.selectedFolderId = null;
    state.selectedRiskId = null;
    localStorage.removeItem(STORAGE_SESSION_KEY);
    render();
  }

  function addFolder(parentFolderId) {
    const name = prompt(parentFolderId ? '하위 폴더명을 입력하세요.' : '상위 폴더명을 입력하세요.');
    if (!name || !name.trim()) return;

    const folderLevel = parentFolderId ? (getFolderById(parentFolderId)?.folderLevel || 0) + 1 : 1;
    const newFolder = {
      folderId: generateId('F', state.db.folders, 'folderId'),
      folderName: name.trim(),
      parentFolderId: parentFolderId || null,
      folderLevel,
      sortOrder: getNextFolderSortOrder(parentFolderId),
      isDeleted: false,
      createdAt: nowIso(),
      createdBy: getCurrentUserIdSafe(),
      updatedAt: nowIso(),
      updatedBy: getCurrentUserIdSafe()
    };

    state.db.folders.push(newFolder);
    state.expanded.add(newFolder.folderId);
    if (parentFolderId) state.expanded.add(parentFolderId);
    markDirtyAndPersist('folder', newFolder.folderId, 'create', '', JSON.stringify(newFolder));
    state.selectedFolderId = newFolder.folderId;
    persistUiState();
    render();
  }

  function deleteFolder(folderId) {
    if (!folderId) return;
    const folder = getFolderById(folderId);
    if (!folder) return;

    const hasChildren = getChildFolders(folderId).length > 0;
    const hasRisks = getActiveRisks().some((risk) => risk.folderId === folderId);

    const message = hasChildren || hasRisks
      ? '하위 폴더 또는 Risk가 함께 삭제됩니다. 계속하시겠습니까?'
      : '선택한 폴더를 삭제하시겠습니까?';
    if (!confirm(message)) return;

    const folderIds = collectDescendantFolderIds(folderId);
    const riskIds = getActiveRisks().filter((risk) => folderIds.includes(risk.folderId)).map((risk) => risk.riskId);
    const controlIds = getActiveControls().filter((control) => riskIds.includes(control.riskId)).map((control) => control.controlId);

    folderIds.forEach((id) => {
      const item = getFolderById(id);
      if (item) item.isDeleted = true;
    });
    riskIds.forEach((id) => {
      const item = getRiskById(id);
      if (item) item.isDeleted = true;
    });
    controlIds.forEach((id) => {
      const item = getControlById(id);
      if (item) item.isDeleted = true;
    });

    markDirtyAndPersist('folder', folderId, 'delete', JSON.stringify({ folderIds, riskIds, controlIds }), '');
    if (folderIds.includes(state.selectedFolderId)) state.selectedFolderId = null;
    persistUiState();
    render();
  }

  function addRisk() {
    if (!state.selectedFolderId) {
      alert('먼저 폴더를 선택해 주세요.');
      return;
    }

    const riskCode = generateRiskCode(state.selectedFolderId);
    const newRisk = {
      riskId: generateId('R', state.db.risks, 'riskId'),
      folderId: state.selectedFolderId,
      riskCode,
      departmentName: '',
      teamCode: '',
      lawCode: '',
      referenceLaw: '',
      regulationDetail: '',
      sanction: '',
      riskTitle: '',
      riskDescription: '',
      riskContent: '',
      riskContext: '',
      responsibleDepartment: '',
      ownerName: '',
      inherentLikelihood: 0,
      inherentImpact: 0,
      inherentScore: 0,
      inherentRating: '',
      residualLikelihood: 0,
      residualImpact: 0,
      residualScore: 0,
      residualRating: '',
      status: 'Open',
      entity: '',
      country: '',
      isDeleted: false,
      createdAt: nowIso(),
      createdBy: getCurrentUserIdSafe(),
      updatedAt: nowIso(),
      updatedBy: getCurrentUserIdSafe()
    };

    state.db.risks.push(newRisk);
    state.selectedRiskId = newRisk.riskId;
    markDirtyAndPersist('risk', newRisk.riskId, 'create', '', JSON.stringify(newRisk));
    render();
  }

  function deleteRisk(riskId) {
    if (!riskId) return;
    const risk = getRiskById(riskId);
    if (!risk) return;

    if (!confirm('선택한 Risk와 연결된 Control을 삭제하시겠습니까?')) return;

    const relatedControls = getActiveControls().filter((control) => control.riskId === riskId);
    risk.isDeleted = true;
    relatedControls.forEach((control) => { control.isDeleted = true; });

    markDirtyAndPersist('risk', riskId, 'delete', JSON.stringify(risk), '');
    if (state.selectedRiskId === riskId) state.selectedRiskId = null;
    render();
  }

  function addControl(riskId) {
    if (!riskId) return;
    const risk = getRiskById(riskId);
    if (!risk) return;

    const newControl = {
      controlId: generateId('C', state.db.controls, 'controlId'),
      controlCode: generateControlCode(riskId),
      riskId,
      controlTitle: '',
      controlName: '',
      controlDescription: '',
      controlContent: '',
      controlType: '',
      controlOperationType: '',
      controlFrequency: '',
      controlDepartment: '',
      controlOwnerName: '',
      isDeleted: false,
      createdAt: nowIso(),
      createdBy: getCurrentUserIdSafe(),
      updatedAt: nowIso(),
      updatedBy: getCurrentUserIdSafe()
    };

    state.db.controls.push(newControl);
    ensureMonitoringRecordsForAllYears(newControl);
    markDirtyAndPersist('control', newControl.controlId, 'create', '', JSON.stringify(newControl));
    render();
  }

  function deleteControl(controlId) {
    if (!controlId) return;
    const control = getControlById(controlId);
    if (!control) return;
    if (!confirm('선택한 Control을 삭제하시겠습니까?')) return;

    control.isDeleted = true;
    state.db.monitoring_records.forEach((record) => {
      if (record.controlId === controlId) record.isDeleted = true;
    });

    markDirtyAndPersist('control', controlId, 'delete', JSON.stringify(control), '');
    render();
  }

  function setRating(targetType, targetId, field, value) {
    updateFieldValue(targetType, targetId, field, value);
  }

  function updateFieldValue(targetType, targetId, field, value) {
    const target = getTargetRecord(targetType, targetId);
    if (!target) return;

    const beforeValue = target[field] ?? '';
    const normalizedValue = normalizeFieldValue(field, value);
    if (String(beforeValue) === String(normalizedValue)) return;

    target[field] = normalizedValue;

    if (targetType === 'risk') {
      if (field === 'inherentLikelihood' || field === 'inherentImpact') {
        target.inherentScore = computeRiskScore(target.inherentLikelihood, target.inherentImpact);
        target.inherentRating = computeRiskRating(target.inherentScore);
      }
      if (field === 'residualLikelihood' || field === 'residualImpact') {
        target.residualScore = computeRiskScore(target.residualLikelihood, target.residualImpact);
        target.residualRating = computeRiskRating(target.residualScore);
      }
    }

    target.updatedAt = nowIso();
    target.updatedBy = getCurrentUserIdSafe();

    markDirtyAndPersist(targetType, targetId, 'update', JSON.stringify({ [field]: beforeValue }), JSON.stringify({ [field]: normalizedValue }));
    render();
  }

  function saveDatabase() {
    persistDatabase();
    state.isDirty = false;
    render();
  }

  function markDirtyAndPersist(targetType, targetId, actionType, beforeValue, afterValue) {
    state.isDirty = true;
    appendChangeLog({
      targetType,
      targetId,
      actionType,
      beforeValue,
      afterValue
    });
    persistDatabase();
  }

  function appendChangeLog(log) {
    state.db.change_logs.unshift({
      logId: generateId('L', state.db.change_logs, 'logId'),
      targetType: log.targetType,
      targetId: log.targetId,
      actionType: log.actionType,
      beforeValue: log.beforeValue ?? '',
      afterValue: log.afterValue ?? '',
      changedAt: nowIso(),
      changedBy: getCurrentUserIdSafe()
    });
    if (state.db.change_logs.length > 5000) {
      state.db.change_logs = state.db.change_logs.slice(0, 5000);
    }
  }

  function uploadEvidence(recordId, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const record = getMonitoringRecordById(recordId);
    if (!record) return;

    record.evidenceFile = { name: file.name, size: file.size, type: file.type };
    record.uploadedAt = nowIso();
    record.submissionStatus = 'Submitted';
    record.updatedAt = nowIso();
    record.updatedBy = getCurrentUserIdSafe();

    markDirtyAndPersist('monitoring', record.recordId, 'update', '', JSON.stringify({ evidenceFile: record.evidenceFile, uploadedAt: record.uploadedAt }));
    render();
  }

  function getTargetRecord(targetType, targetId) {
    if (targetType === 'risk') return getRiskById(targetId);
    if (targetType === 'control') return getControlById(targetId);
    if (targetType === 'monitoring') return getMonitoringRecordById(targetId);
    return null;
  }

  function getRootFolders() {
    return getActiveFolders().filter((folder) => !folder.parentFolderId);
  }

  function getActiveFolders() {
    return (state.db?.folders || []).filter((folder) => !folder.isDeleted);
  }

  function getActiveRisks() {
    return (state.db?.risks || []).filter((risk) => !risk.isDeleted);
  }

  function getActiveControls() {
    return (state.db?.controls || []).filter((control) => !control.isDeleted);
  }

  function getFolderById(folderId) {
    return getActiveFolders().find((folder) => folder.folderId === folderId) || null;
  }

  function getRiskById(riskId) {
    return getActiveRisks().find((risk) => risk.riskId === riskId) || null;
  }

  function getControlById(controlId) {
    return getActiveControls().find((control) => control.controlId === controlId) || null;
  }

  function getMonitoringRecordById(recordId) {
    return (state.db?.monitoring_records || []).find((record) => record.recordId === recordId && !record.isDeleted) || null;
  }

  function getChildFolders(parentFolderId) {
    return getActiveFolders()
      .filter((folder) => folder.parentFolderId === parentFolderId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.folderName.localeCompare(b.folderName));
  }

  function getFolderPath(folderId) {
    const path = [];
    let current = getFolderById(folderId);
    while (current) {
      path.unshift(current);
      current = current.parentFolderId ? getFolderById(current.parentFolderId) : null;
    }
    return path;
  }

  function collectDescendantFolderIds(folderId) {
    const result = [];
    const stack = [folderId];
    while (stack.length) {
      const current = stack.pop();
      result.push(current);
      getChildFolders(current).forEach((child) => stack.push(child.folderId));
    }
    return result;
  }

  function getVisibleRisksByFolder(folderId) {
    let risks = getActiveRisks().filter((risk) => risk.folderId === folderId);

    if (state.search.trim()) {
      const keyword = state.search.trim().toLowerCase();
      risks = risks.filter((risk) => {
        const controls = getControlsByRiskId(risk.riskId);
        const haystack = [
          risk.riskCode,
          risk.departmentName,
          risk.referenceLaw,
          risk.regulationDetail,
          risk.sanction,
          risk.riskTitle,
          risk.riskDescription,
          risk.riskContent,
          risk.ownerName,
          ...controls.flatMap((control) => [
            control.controlCode,
            control.controlName,
            control.controlContent,
            control.controlType,
            control.controlOwnerName
          ])
        ].join(' ').toLowerCase();
        return haystack.includes(keyword);
      });
    }

    if (state.heatmapFilter) {
      risks = risks.filter((risk) =>
        Number(risk.inherentLikelihood) === state.heatmapFilter.likelihood &&
        Number(risk.inherentImpact) === state.heatmapFilter.impact
      );
    }

    return risks.sort((a, b) => (a.riskCode || '').localeCompare(b.riskCode || '') || a.createdAt.localeCompare(b.createdAt));
  }

  function getControlsByRiskId(riskId) {
    return getActiveControls()
      .filter((control) => control.riskId === riskId)
      .sort((a, b) => (a.controlCode || '').localeCompare(b.controlCode || '') || a.createdAt.localeCompare(b.createdAt));
  }

  function getMonitoringRows(year) {
    const records = (state.db?.monitoring_records || []).filter((record) => !record.isDeleted && Number(record.year) === Number(year));

    let rows = records.map((record) => {
      const control = getControlById(record.controlId);
      const risk = control ? getRiskById(control.riskId) : getRiskById(record.riskId);
      return { record, control, risk };
    }).filter((row) => row.control && row.risk);

    if (state.search.trim()) {
      const keyword = state.search.trim().toLowerCase();
      rows = rows.filter(({ control, risk }) => [
        risk.riskCode,
        risk.riskContent,
        control.controlCode,
        control.controlName,
        control.controlContent,
        control.controlDepartment,
        control.controlOwnerName
      ].join(' ').toLowerCase().includes(keyword));
    }

    return rows.sort((a, b) =>
      (a.risk.riskCode || '').localeCompare(b.risk.riskCode || '') ||
      (a.control.controlCode || '').localeCompare(b.control.controlCode || '')
    );
  }

  function ensureMonitoringRecordsForYear(year) {
    const controls = getActiveControls();
    controls.forEach((control) => {
      const existing = (state.db.monitoring_records || []).find((record) =>
        !record.isDeleted &&
        Number(record.year) === Number(year) &&
        record.controlId === control.controlId
      );
      if (!existing) {
        state.db.monitoring_records.push({
          recordId: generateId('M', state.db.monitoring_records, 'recordId'),
          year: Number(year),
          controlId: control.controlId,
          riskId: control.riskId,
          evidenceFile: null,
          uploadedAt: '',
          submissionStatus: 'Not Submitted',
          reviewResult: 'Pending',
          reviewComment: '',
          isDeleted: false,
          createdAt: nowIso(),
          createdBy: getCurrentUserIdSafe(),
          updatedAt: nowIso(),
          updatedBy: getCurrentUserIdSafe()
        });
      }
    });
    persistDatabase();
  }

  function ensureMonitoringRecordsForAllYears(control) {
    for (let year = 2026; year <= 2035; year += 1) {
      const existing = (state.db.monitoring_records || []).find((record) =>
        !record.isDeleted &&
        Number(record.year) === Number(year) &&
        record.controlId === control.controlId
      );
      if (!existing) {
        state.db.monitoring_records.push({
          recordId: generateId('M', state.db.monitoring_records, 'recordId'),
          year,
          controlId: control.controlId,
          riskId: control.riskId,
          evidenceFile: null,
          uploadedAt: '',
          submissionStatus: 'Not Submitted',
          reviewResult: 'Pending',
          reviewComment: '',
          isDeleted: false,
          createdAt: nowIso(),
          createdBy: getCurrentUserIdSafe(),
          updatedAt: nowIso(),
          updatedBy: getCurrentUserIdSafe()
        });
      }
    }
    persistDatabase();
  }

  function buildHeatmapMatrix() {
    const matrix = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ count: 0 })));
    getActiveRisks().forEach((risk) => {
      const l = Number(risk.inherentLikelihood);
      const i = Number(risk.inherentImpact);
      if (l >= 1 && l <= 5 && i >= 1 && i <= 5) {
        matrix[i - 1][l - 1].count += 1;
      }
    });
    return matrix;
  }

  function getHeatmapLevelClass(score) {
    if (score >= 15) return 'high';
    if (score >= 7) return 'medium';
    return 'low';
  }

  function matchesTreeSearch(folder) {
    if (!state.treeSearch.trim()) return true;
    const keyword = state.treeSearch.trim().toLowerCase();
    if ((folder.folderName || '').toLowerCase().includes(keyword)) return true;
    const descendants = collectDescendantFolderIds(folder.folderId);
    return descendants.some((id) => {
      const item = getFolderById(id);
      return item && (item.folderName || '').toLowerCase().includes(keyword);
    });
  }

  function getFilteredTreeRoots() {
    const roots = getRootFolders();
    if (!state.treeSearch.trim()) return roots;
    return roots.filter((folder) => matchesTreeSearch(folder));
  }

  function generateRiskCode(folderId) {
    const folder = getFolderById(folderId);
    const deptToken = getDepartmentToken(folder?.folderName || 'GEN');
    const siblings = getActiveRisks().filter((risk) => risk.folderId === folderId);
    const seq = String(siblings.length + 1).padStart(2, '0');
    return `R-${deptToken}-${seq}`;
  }

  function generateControlCode(riskId) {
    const risk = getRiskById(riskId);
    const existing = getControlsByRiskId(riskId);
    const seq = String(existing.length + 1).padStart(2, '0');
    return `${risk?.riskCode || 'C-UNK'}-${seq}`;
  }

  function getDepartmentToken(folderName) {
    const token = String(folderName || 'GEN').replace(/[^A-Za-z]/g, '').toUpperCase();
    return (token || 'GEN').slice(0, 3);
  }

  function getNextFolderSortOrder(parentFolderId) {
    const siblings = getChildFolders(parentFolderId || null);
    if (!siblings.length) return 10;
    return Math.max(...siblings.map((item) => Number(item.sortOrder) || 0)) + 10;
  }

  function computeRiskScore(likelihood, impact) {
    const l = Number(likelihood) || 0;
    const i = Number(impact) || 0;
    if (!l || !i) return 0;
    return l * i;
  }

  function computeRiskRating(score) {
    const num = Number(score) || 0;
    if (num >= 15) return 'High';
    if (num >= 7) return 'Medium';
    if (num >= 1) return 'Low';
    return '';
  }

  function normalizeScore(value) {
    const num = Number(value) || 0;
    if (num < 0) return 0;
    if (num > 25) return 25;
    return num;
  }

  function normalizeFieldValue(field, value) {
    if (['inherentLikelihood', 'inherentImpact', 'inherentScore', 'residualLikelihood', 'residualImpact', 'residualScore', 'year'].includes(field)) {
      return Number(value) || 0;
    }
    return value ?? '';
  }

  function generateId(prefix, list, keyField) {
    const ids = (list || [])
      .map((item) => item[keyField] || '')
      .filter(Boolean)
      .map((id) => {
        const matched = String(id).match(/(\d+)$/);
        return matched ? Number(matched[1]) : 0;
      });
    const next = (ids.length ? Math.max(...ids) : 0) + 1;
    const width = prefix === 'M' ? 4 : 3;
    return `${prefix}${String(next).padStart(width, '0')}`;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function formatDateTime(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  }

  function persistDatabase() {
    localStorage.setItem(STORAGE_DB_KEY, JSON.stringify(state.db));
  }

  function persistSession() {
    if (!state.currentUser) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return;
    }
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({
      userId: state.currentUser.userId,
      username: state.currentUser.username,
      role: state.currentUser.role,
      displayName: state.currentUser.displayName
    }));
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function persistUiState() {
    const payload = {
      selectedFolderId: state.selectedFolderId,
      currentModule: state.currentModule,
      monitoringYear: state.monitoringYear,
      treeSearch: state.treeSearch,
      expandedFolderIds: Array.from(state.expanded)
    };
    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify(payload));
  }

  function loadUiState() {
    try {
      const raw = localStorage.getItem(STORAGE_UI_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function getCurrentUserIdSafe() {
    return state.currentUser?.userId || 'SYSTEM';
  }

  function isManager() {
    return state.currentUser?.role === 'manager';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

})();