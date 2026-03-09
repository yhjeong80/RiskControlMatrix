(() => {
  const STORAGE_DB_KEY = 'rcm_json_model_db_v1';
  const STORAGE_SESSION_KEY = 'rcm_json_model_session_v1';
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
              <p>Folder / Risk / JSON Model</p>
            </div>
            <button id="addRootFolderBtn" class="ghost-btn">+ Folder</button>
          </div>

          <div class="sidebar-tools">
            <input id="treeSearchInput" type="text" placeholder="폴더 검색" value="${escapeHtml(state.treeSearch)}" />
            <div>${selectedFolder ? `<span class="selection-chip">선택 폴더: ${escapeHtml(selectedFolder.folderName)}</span>` : '<span class="selection-chip">선택 폴더 없음 (상위 폴더 생성)</span>'}</div>
          </div>

          <div id="treeRoot" class="tree-root"></div>

          <div class="sidebar-note">
            현재 로그인: <strong>${escapeHtml(state.currentUser.displayName)}</strong><br />
            권한: <strong>${isManager() ? 'Manager (수정 가능)' : 'User (조회 전용)'}</strong><br /><br />
            + Folder 버튼은 선택 위치에 따라 상위 / 하위 폴더를 생성합니다.
          </div>
        </aside>

        <main class="content">
          <section class="hero">
            <div>
              <h2>Risk and Control Matrix</h2>
              <p>폴더, 리스크, 변경이력을 분리한 데이터 모델입니다. Power BI / DB / KNIME 확장을 고려한 구조입니다.</p>
            </div>
            <div class="hero-tools">
              <span class="role-badge">${isManager() ? 'EDIT MODE ENABLED' : 'VIEW ONLY'}</span>
              <input id="searchInput" type="text" placeholder="Risk / Law / Entity 검색" value="${escapeHtml(state.search)}" />
              <button id="logoutBtn" class="ghost-btn">Log out</button>
            </div>
          </section>

          <section class="toolbar">
            <div class="toolbar-left">
              <button id="addRiskBtn" class="primary-btn">+ Risk 추가</button>
              <button id="saveBtn" class="ghost-btn">저장</button>
              <button id="resetBtn" class="ghost-btn">원본으로 되돌리기</button>
            </div>
            <div class="toolbar-right">
              <button id="downloadJsonBtn" class="ghost-btn">Download JSON</button>
              <button id="downloadCsvBtn" class="ghost-btn">Download CSV</button>
              <button id="downloadExcelBtn" class="primary-btn">Download Excel</button>
            </div>
          </section>

          <section class="stats-grid">
            <article class="stat-card"><span class="stat-label">Visible Risks</span><strong>${getVisibleRisks().length}</strong></article>
            <article class="stat-card"><span class="stat-label">Visible Folders</span><strong>${getActiveFolders().length}</strong></article>
            <article class="stat-card"><span class="stat-label">Medium / High</span><strong>${getVisibleRisks().filter(r => ['Medium','High'].includes(r.residualRating)).length}</strong></article>
            <article class="stat-card"><span class="stat-label">Change Logs</span><strong>${(state.db.change_logs || []).length}</strong></article>
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
              JSON 원본 파일은 정적 사이트에서 직접 수정되지 않으며, 현재 편집 내용은 브라우저 저장소에 저장됩니다. 운영 단계에서는 DB/API 연동 구조로 전환하는 것이 적합합니다.
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
      localStorage.removeItem(STORAGE_SESSION_KEY);
      state.currentUser = null;
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
      state.db = await loadDatabase();
      state.isDirty = false;
      initializeExpanded();
      render();
    });

    document.getElementById('downloadJsonBtn').addEventListener('click', () => {
      downloadBlob(new Blob([JSON.stringify(state.db, null, 2)], { type: 'application/json;charset=utf-8' }), 'RCM_DB.json');
    });

    document.getElementById('downloadCsvBtn').addEventListener('click', () => {
      const csv = convertRowsToCsv(getVisibleRisksForExport());
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'RCM_Risks.csv');
    });

    document.getElementById('downloadExcelBtn').addEventListener('click', () => {
      if (typeof XLSX === 'undefined') {
        alert('Excel 다운로드 라이브러리를 불러오지 못했습니다.');
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(getVisibleRisksForExport());
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Risks');
      XLSX.writeFile(workbook, 'RCM_Risks.xlsx');
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
        const id = btn.getAttribute('data-folder-id');
        state.selectedFolderId = id;
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
    const rows = getVisibleRisks();

    const columns = [
      'riskId', 'folderPath', 'departmentName', 'riskTitle', 'referenceLaw',
      'inherentLikelihood', 'inherentImpact', 'inherentRating',
      'residualLikelihood', 'residualImpact', 'residualRating',
      'status', 'entity', 'country', 'updatedAt'
    ];

    thead.innerHTML = `<tr>${columns.map((col) => `<th>${escapeHtml(columnLabel(col))}</th>`).join('')}</tr>`;

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="15" class="empty-state">조건에 맞는 리스크가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map((risk) => {
      return `
        <tr>
          <td class="mono readonly-cell">${escapeHtml(risk.riskId)}</td>
          <td class="readonly-cell">${escapeHtml(buildFolderPath(risk.folderId).join(' > '))}</td>
          <td>${renderEditableCell(risk, 'departmentName')}</td>
          <td>${renderEditableCell(risk, 'riskTitle', true)}</td>
          <td>${renderEditableCell(risk, 'referenceLaw')}</td>
          <td>${renderRatingSelectCell(risk, 'inherentLikelihood')}</td>
          <td>${renderRatingSelectCell(risk, 'inherentImpact')}</td>
          <td class="readonly-cell">${renderBadge(risk.inherentRating)}</td>
          <td>${renderRatingSelectCell(risk, 'residualLikelihood')}</td>
          <td>${renderRatingSelectCell(risk, 'residualImpact')}</td>
          <td class="readonly-cell">${renderBadge(risk.residualRating)}</td>
          <td>${renderStatusCell(risk)}</td>
          <td>${renderEditableCell(risk, 'entity')}</td>
          <td>${renderEditableCell(risk, 'country')}</td>
          <td class="readonly-cell">${escapeHtml(formatDate(risk.updatedAt))}</td>
        </tr>
      `;
    }).join('');

    bindTableEvents();
  }

  function bindTableEvents() {
    document.querySelectorAll('[data-field-input]').forEach((el) => {
      el.addEventListener('change', () => {
        if (!isManager()) return blockViewerAction();
        updateRiskField(el.dataset.riskId, el.dataset.field, el.value);
      });
    });
  }

  function renderEditableCell(risk, field, longText = false) {
    if (!isManager()) return `<div class="readonly-cell ${longText ? '' : ''}">${escapeHtml(risk[field] ?? '')}</div>`;
    if (longText) {
      return `<textarea class="cell-input cell-textarea" data-field-input="1" data-risk-id="${risk.riskId}" data-field="${field}">${escapeHtml(risk[field] ?? '')}</textarea>`;
    }
    return `<input class="cell-input" data-field-input="1" data-risk-id="${risk.riskId}" data-field="${field}" value="${escapeHtml(risk[field] ?? '')}" />`;
  }

  function renderRatingSelectCell(risk, field) {
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(String(risk[field] ?? ''))}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-risk-id="${risk.riskId}" data-field="${field}">
        ${[1,2,3,4,5].map((n) => `<option value="${n}" ${Number(risk[field]) === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select>
    `;
  }

  function renderStatusCell(risk) {
    const options = ['Open', 'Mitigated', 'Monitoring', 'Closed'];
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(risk.status ?? '')}</div>`;
    return `
      <select class="cell-select" data-field-input="1" data-risk-id="${risk.riskId}" data-field="status">
        ${options.map((v) => `<option value="${v}" ${risk.status === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
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
        <input id="folderNameInput" class="field-input" placeholder="예: MCA / 공정거래 / HR" />
      </div>
      <div class="help-text" style="margin-top:12px;">
        ${parent ? `선택한 상위 폴더: <strong>${escapeHtml(parent.folderName)}</strong>` : '선택한 폴더가 없으므로 상위 폴더로 생성됩니다.'}
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
    openModal(`
      <div class="modal-header">
        <h3>Risk 추가</h3>
        <button id="modalCloseBtn" class="ghost-btn">닫기</button>
      </div>
      <div class="kv-list" style="margin-bottom:16px;">
        <div>대상 폴더</div><div>${escapeHtml(buildFolderPath(folder.folderId).join(' > '))}</div>
        <div>folderId</div><div class="mono">${escapeHtml(folder.folderId)}</div>
      </div>
      <div class="modal-grid three">
        <div class="field-group field-span-3">
          <label>Risk Title</label>
          <input id="riskTitleInput" class="field-input" />
        </div>
        <div class="field-group field-span-3">
          <label>Risk Description</label>
          <textarea id="riskDescriptionInput" class="field-input"></textarea>
        </div>
        <div class="field-group">
          <label>Department Name</label>
          <input id="departmentNameInput" class="field-input" value="${escapeHtml(folder.folderName)}" />
        </div>
        <div class="field-group">
          <label>Reference Law</label>
          <input id="referenceLawInput" class="field-input" value="${escapeHtml(folder.folderName)}" />
        </div>
        <div class="field-group">
          <label>Status</label>
          <select id="statusInput" class="field-select">
            <option>Open</option>
            <option>Mitigated</option>
            <option>Monitoring</option>
            <option>Closed</option>
          </select>
        </div>
        <div class="field-group">
          <label>Entity</label>
          <input id="entityInput" class="field-input" value="${escapeHtml(inferEntity(folder.folderId))}" />
        </div>
        <div class="field-group">
          <label>Country</label>
          <input id="countryInput" class="field-input" value="KR" />
        </div>
        <div class="field-group">
          <label>Inherent Likelihood</label>
          <select id="inhLikelihoodInput" class="field-select">${ratingOptions(3)}</select>
        </div>
        <div class="field-group">
          <label>Inherent Impact</label>
          <select id="inhImpactInput" class="field-select">${ratingOptions(3)}</select>
        </div>
        <div class="field-group">
          <label>Residual Likelihood</label>
          <select id="resLikelihoodInput" class="field-select">${ratingOptions(2)}</select>
        </div>
        <div class="field-group">
          <label>Residual Impact</label>
          <select id="resImpactInput" class="field-select">${ratingOptions(2)}</select>
        </div>
      </div>
      <div class="modal-actions">
        <button id="riskCreateBtn" class="primary-btn">추가</button>
      </div>
    `);

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('riskCreateBtn').addEventListener('click', () => {
      const payload = {
        riskTitle: document.getElementById('riskTitleInput').value.trim(),
        riskDescription: document.getElementById('riskDescriptionInput').value.trim(),
        departmentName: document.getElementById('departmentNameInput').value.trim(),
        referenceLaw: document.getElementById('referenceLawInput').value.trim(),
        status: document.getElementById('statusInput').value,
        entity: document.getElementById('entityInput').value.trim(),
        country: document.getElementById('countryInput').value.trim(),
        inherentLikelihood: Number(document.getElementById('inhLikelihoodInput').value),
        inherentImpact: Number(document.getElementById('inhImpactInput').value),
        residualLikelihood: Number(document.getElementById('resLikelihoodInput').value),
        residualImpact: Number(document.getElementById('resImpactInput').value)
      };
      if (!payload.riskTitle) {
        alert('Risk Title을 입력해 주세요.');
        return;
      }
      createRisk(payload);
      closeModal();
    });
  }

  function createFolder(folderName, parentFolderId) {
    const now = nowIso();
    const folderId = nextId('F', state.db.folders.map((f) => f.folderId));
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
    const riskCount = getActiveRisks().filter((r) => subtree.includes(r.folderId)).length;
    const ok = confirm(`'${folder.folderName}' 폴더를 삭제하시겠습니까?\n\n하위 폴더 ${Math.max(subtree.length - 1, 0)}개와 리스크 ${riskCount}건이 함께 삭제 처리됩니다.`);
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

    appendLog('folder', folderId, 'delete', { folderName: folder.folderName }, null);
    if (subtree.includes(state.selectedFolderId)) state.selectedFolderId = null;
    markDirtyAndRender();
  }

  function createRisk(payload) {
    const now = nowIso();
    const inherent = calculateRating(payload.inherentLikelihood, payload.inherentImpact);
    const residual = calculateRating(payload.residualLikelihood, payload.residualImpact);
    const folder = getFolderById(state.selectedFolderId);
    const risk = {
      riskId: nextId('R', state.db.risks.map((r) => r.riskId)),
      folderId: state.selectedFolderId,
      departmentCode: inferDepartmentCode(folder.folderId),
      departmentName: payload.departmentName,
      riskTitle: payload.riskTitle,
      riskDescription: payload.riskDescription,
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
      referenceLaw: payload.referenceLaw,
      country: payload.country,
      entity: payload.entity,
      isDeleted: false,
      createdAt: now,
      createdBy: state.currentUser.userId,
      updatedAt: now,
      updatedBy: state.currentUser.userId
    };
    state.db.risks.push(risk);
    appendLog('risk', risk.riskId, 'create', null, {
      folderId: risk.folderId,
      riskTitle: risk.riskTitle,
      status: risk.status
    });
    markDirtyAndRender();
  }

  function updateRiskField(riskId, field, value) {
    const risk = state.db.risks.find((r) => r.riskId === riskId && !r.isDeleted);
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

    appendLog('risk', risk.riskId, 'update', pickLogFields(before), pickLogFields(risk));
    state.isDirty = true;
    render();
  }

  function getVisibleRisks() {
    const activeFolderIds = state.selectedFolderId ? getDescendantFolderIds(state.selectedFolderId) : getActiveFolders().map((f) => f.folderId);
    const keyword = state.search.trim().toLowerCase();
    return getActiveRisks().filter((risk) => {
      const matchesFolder = activeFolderIds.includes(risk.folderId);
      if (!matchesFolder) return false;
      if (!keyword) return true;
      const haystack = [
        risk.riskId, risk.departmentName, risk.riskTitle, risk.riskDescription,
        risk.referenceLaw, risk.entity, risk.country, risk.status
      ].join(' ').toLowerCase();
      return haystack.includes(keyword);
    }).sort((a, b) => a.riskId.localeCompare(b.riskId));
  }

  function getVisibleRisksForExport() {
    return getVisibleRisks().map((risk) => ({
      riskId: risk.riskId,
      folderId: risk.folderId,
      folderPath: buildFolderPath(risk.folderId).join(' > '),
      departmentCode: risk.departmentCode,
      departmentName: risk.departmentName,
      riskTitle: risk.riskTitle,
      riskDescription: risk.riskDescription,
      referenceLaw: risk.referenceLaw,
      inherentLikelihood: risk.inherentLikelihood,
      inherentImpact: risk.inherentImpact,
      inherentScore: risk.inherentScore,
      inherentRating: risk.inherentRating,
      residualLikelihood: risk.residualLikelihood,
      residualImpact: risk.residualImpact,
      residualScore: risk.residualScore,
      residualRating: risk.residualRating,
      status: risk.status,
      entity: risk.entity,
      country: risk.country,
      ownerUserId: risk.ownerUserId,
      updatedAt: risk.updatedAt,
      updatedBy: risk.updatedBy
    }));
  }

  function getActiveFolders() {
    return (state.db.folders || []).filter((f) => !f.isDeleted);
  }

  function getActiveRisks() {
    return (state.db.risks || []).filter((r) => !r.isDeleted);
  }

  function getFolderById(folderId) {
    return (state.db.folders || []).find((f) => f.folderId === folderId && !f.isDeleted) || null;
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
    return path[0] || 'GEN';
  }

  function inferEntity(folderId) {
    const path = buildFolderPath(folderId);
    return path[0] || '';
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
    localStorage.setItem(STORAGE_DB_KEY, JSON.stringify(state.db));
    state.isDirty = false;
    render();
  }

  function markDirtyAndRender() {
    state.isDirty = true;
    render();
  }

  function appendLog(targetType, targetId, actionType, beforeValue, afterValue) {
    const log = {
      logId: nextId('L', state.db.change_logs.map((l) => l.logId)),
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

  function pickLogFields(risk) {
    return {
      folderId: risk.folderId,
      riskTitle: risk.riskTitle,
      inherentLikelihood: risk.inherentLikelihood,
      inherentImpact: risk.inherentImpact,
      inherentRating: risk.inherentRating,
      residualLikelihood: risk.residualLikelihood,
      residualImpact: risk.residualImpact,
      residualRating: risk.residualRating,
      status: risk.status,
      entity: risk.entity,
      country: risk.country
    };
  }

  function nextId(prefix, values) {
    const max = values.reduce((acc, value) => {
      const num = Number(String(value || '').replace(prefix, ''));
      return Number.isFinite(num) ? Math.max(acc, num) : acc;
    }, 0);
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
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
    document.getElementById('modalRoot').innerHTML = `<div class="modal-overlay"><div class="modal-box">${content}</div></div>`;
  }

  function closeModal() {
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
      riskId: 'Risk ID',
      folderPath: 'Folder Path',
      departmentName: 'Department',
      riskTitle: 'Risk Title',
      referenceLaw: 'Reference Law',
      inherentLikelihood: 'Inherent L',
      inherentImpact: 'Inherent I',
      inherentRating: 'Inherent Rating',
      residualLikelihood: 'Residual L',
      residualImpact: 'Residual I',
      residualRating: 'Residual Rating',
      status: 'Status',
      entity: 'Entity',
      country: 'Country',
      updatedAt: 'Updated At'
    };
    return labels[col] || col;
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
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
