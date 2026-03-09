(() => {
  const STORAGE_DB_KEY = 'rcm_json_model_db_v3';
  const STORAGE_SESSION_KEY = 'rcm_json_model_session_v2';
  const DATA_FILES = ['users', 'folders', 'risks', 'controls', 'change_logs'];

  const state = {
    db: null,
    currentUser: loadSession(),
    selectedFolderId: null,
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
      controlOwnerName: control.controlOwnerName || ''
    }));
    state.db.change_logs = state.db.change_logs || [];
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
              <h2>RCM Explorer</h2>
              <p>Folder / Risk / Control Matrix</p>
            </div>
            <button id="addRootFolderBtn" class="ghost-btn ${isManager() ? '' : 'viewer-readonly'}">+ Folder</button>
          </div>

          <div class="sidebar-tools">
            <input id="treeSearchInput" type="text" placeholder="폴더 검색" value="${escapeHtml(state.treeSearch)}" />
            <div>${selectedFolder ? `<span class="selection-chip">선택 폴더: ${escapeHtml(selectedFolder.folderName)}</span>` : '<span class="selection-chip">선택 폴더 없음 (상위 폴더 생성)</span>'}</div>
          </div>

          <div id="treeRoot" class="tree-root"></div>

          <div class="sidebar-note">
            현재 로그인: <strong>${escapeHtml(state.currentUser.displayName)}</strong><br />
            권한: <strong>${isManager() ? 'Manager (수정 가능)' : 'User (조회 전용)'}</strong><br /><br />
            Risk Code 형식: <strong>R-SC-01-01</strong><br />
            Control Code 형식: <strong>C-SC-01-01-01</strong>
          </div>
        </aside>

        <main class="content">
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
              <div id="currentFilter">${selectedFolder ? `${escapeHtml(buildFolderPath(selectedFolder.folderId).join(' > '))}` : '전체 보기'}</div>
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
        </main>
      </div>
      <div id="modalRoot"></div>
    `;

    bindAppEvents();
    renderTree();
    renderTable();
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

    document.getElementById('downloadJsonBtn').addEventListener('click', () => {
      downloadBlob(new Blob([JSON.stringify(state.db, null, 2)], { type: 'application/json;charset=utf-8' }), 'RCM_DB.json');
    });

    document.getElementById('downloadCsvBtn').addEventListener('click', () => {
      const csv = convertRowsToCsv(getVisibleRowsForExport());
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'RCM_Rows.csv');
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

  function renderTree() {
    const treeRoot = document.getElementById('treeRoot');
    if (!treeRoot) return;

    const roots = sortFolders(getChildrenFolders(null));
    const html = roots.map((folder) => renderTreeNode(folder)).join('');
    treeRoot.innerHTML = html || '<div class="empty-state">표시할 폴더가 없습니다.</div>';

    treeRoot.querySelectorAll('[data-folder-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedFolderId = btn.getAttribute('data-folder-id');
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
  }

  function renderTreeNode(folder) {
    const visible = matchesTreeSearch(folder.folderId);
    if (!visible) return '';

    const children = sortFolders(getChildrenFolders(folder.folderId));
    const expanded = state.expanded.has(folder.folderId);
    const isActive = state.selectedFolderId === folder.folderId;

    return `
      <div class="tree-item">
        <div class="tree-row">
          <button class="tree-button ${isActive ? 'active' : ''}" data-folder-id="${folder.folderId}">
            <span class="tree-toggle" data-toggle-id="${folder.folderId}">${children.length ? (expanded ? '▾' : '▸') : '•'}</span>
            <span class="tree-icon">📁</span>
            <span>${escapeHtml(folder.folderName)}</span>
          </button>
          ${isManager() ? `
          <div class="tree-actions">
            <button class="icon-btn" title="하위 폴더 추가" data-add-child="${folder.folderId}">+</button>
            <button class="icon-btn delete" title="폴더 삭제" data-delete-folder="${folder.folderId}">🗑</button>
          </div>` : ''}
        </div>
        ${children.length && expanded ? `<div class="tree-children">${children.map((child) => renderTreeNode(child)).join('')}</div>` : ''}
      </div>
    `;
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
      'controlFrequency',
      'responsibleDepartment',
      'ownerName',
      'residualLikelihood',
      'residualImpact',
      'residualRating',
      'actions'
    ];

    thead.innerHTML = `<tr>${columns.map((col) => `<th>${escapeHtml(columnLabel(col))}</th>`).join('')}</tr>`;

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
        <td>${renderEditableCell('control', control?.controlId, 'controlFrequency', control?.controlFrequency || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlDepartment', control?.controlDepartment || risk.responsibleDepartment || '')}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlOwnerName', control?.controlOwnerName || risk.ownerName || '')}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'residualLikelihood', risk.residualLikelihood)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'residualImpact', risk.residualImpact)}</td>
        <td class="readonly-cell">${renderBadge(risk.residualRating)}</td>
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
    const options = ['승인', '권한부여', '업무분장', '감독 및 모니터링', '다시 읽 검증', '확인서 징구', '교육실시', '기타'];
    if (!control?.controlId) return `<div class="readonly-cell"></div>`;
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(value)}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-target-type="control" data-target-id="${control.controlId}" data-field="controlType">
        ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${v}</option>`).join('')}
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
          <label>Control 유형</label>
          <select id="controlTypeInput" class="field-select">
            <option>승인</option>
            <option>권한부여</option>
            <option>업무분장</option>
            <option>감독 및 모니터링</option>
            <option>다시 읽 검증</option>
            <option>확인서 징구</option>
            <option>교육실시</option>
            <option>기타</option>
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
      controlFrequency: control?.controlFrequency || '',
      responsibleDepartment: control?.controlDepartment || risk.responsibleDepartment || '',
      ownerName: control?.controlOwnerName || risk.ownerName || '',
      residualLikelihood: risk.residualLikelihood || '',
      residualImpact: risk.residualImpact || '',
      residualRating: risk.residualRating || ''
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
      inherentLikelihood: '고유 Risk 발생가능성',
      inherentImpact: '고유 Risk 결과 심각성',
      inherentRating: '고유 Risk Rating',
      controlCode: 'Control Code',
      controlName: 'Control 명',
      controlContent: 'Control 내용',
      controlType: 'Control 유형',
      controlFrequency: 'Control 주기',
      responsibleDepartment: '담당부서',
      ownerName: '담당자',
      residualLikelihood: '잔여 Risk 발생 가능성',
      residualImpact: '잔여 Risk 결과 심각성',
      residualRating: '잔여 Risk Rating',
      actions: 'Actions'
    };
    return labels[col] || col;
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