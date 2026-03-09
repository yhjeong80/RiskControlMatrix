
(function(){
  const STORAGE_ROWS_KEY = "rcm_rows_role_v2";
  const STORAGE_FOLDERS_KEY = "rcm_custom_folders_role_v2";
  const STORAGE_SESSION_KEY = "rcm_login_session_v2";

  const source = window.RCM_DATA || { headers: [], rows: [], treeData: [], users: [] };
  const headers = source.headers || [];
  const longTextHints = ["Risk", "Control", "제재", "법령", "Description", "Sub Compliance", "명칭", "배경", "목적"];

  const COL = {
    inherentLikelihood: findHeader(["고유 Risk\n발생 가능성", "고유 Risk 발생 가능성"]),
    inherentSeverity: findHeader(["고유 Risk\n결과의 심각성", "고유 Risk 결과의 심각성"]),
    inherentRating: findHeader(["고유 Risk\nRating", "고유 Risk Rating"]),
    residualLikelihood: findHeader(["잔여 Risk\n발생 가능성", "잔여 Risk 발생 가능성"]),
    residualSeverity: findHeader(["잔여 Risk\n결과의 심각성", "잔여 Risk 결과의 심각성"]),
    residualRating: findHeader(["잔여 Risk\nRating", "잔여 Risk Rating"])
  };

  const state = {
    rows: normalizeRows(loadRows()),
    selectedType: "all",
    selectedName: "",
    search: "",
    treeSearch: "",
    expanded: new Set(),
    treeData: mergeStoredFolders(clone(source.treeData || [])),
    currentUser: loadSession()
  };

  render();

  function render(){
    if (!state.currentUser) renderLoginPage();
    else renderAppPage();
  }

  function renderLoginPage(){
    document.getElementById("app").innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <h1>RCM Portal Login</h1>
          <p>로그인 후 권한에 따라 수정 가능 여부가 달라집니다.</p>

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
            현재 버전은 정적 사이트용 데모라서 계정 정보가 파일 안에 들어 있습니다.
          </div>
        </div>
      </div>
    `;

    document.getElementById("loginBtn").addEventListener("click", handleLogin);
    document.getElementById("loginPw").addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }

  function handleLogin(){
    const id = document.getElementById("loginId").value.trim();
    const pw = document.getElementById("loginPw").value.trim();
    const user = (source.users || []).find(u => u.id === id && u.password === pw);
    if (!user) {
      alert("ID 또는 Password가 올바르지 않습니다.");
      return;
    }
    state.currentUser = { id: user.id, role: user.role, displayName: user.displayName };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(state.currentUser));
    render();
  }

  function renderAppPage(){
    document.getElementById("app").innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div>
              <h2>RCM Explorer</h2>
              <p>Department / Compliance Tree</p>
            </div>
            <button id="addFolderBtn" class="ghost-btn">+ Folder</button>
          </div>

          <div class="sidebar-tools">
            <input id="treeSearchInput" type="text" placeholder="폴더 검색" />
          </div>

          <div id="treeRoot" class="tree-root"></div>

          <div class="sidebar-note">
            현재 로그인: <strong>${escapeHtml(state.currentUser.displayName)}</strong><br />
            권한: <strong>${state.currentUser.role === "manager" ? "Manager (수정 가능)" : "User (조회 전용)"}</strong><br /><br />
            Risk Rating은 발생 가능성과 결과의 심각성 값(1~5)에 따라 자동 계산됩니다.
          </div>
        </aside>

        <main class="content">
          <section class="hero">
            <div>
              <h2>Risk and Control Matrix</h2>
              <p>Manager는 1~5 점수를 드롭다운으로 선택하면 Risk Rating이 자동 계산됩니다.</p>
            </div>
            <div class="hero-tools">
              <span class="role-badge">${state.currentUser.role === "manager" ? "EDIT MODE ENABLED" : "VIEW ONLY"}</span>
              <input id="searchInput" type="text" placeholder="Risk / Control / 법령 검색" />
              <button id="logoutBtn" class="ghost-btn">Log out</button>
            </div>
          </section>

          <section class="toolbar">
            <div class="toolbar-left">
              <button id="addRowBtn" class="primary-btn">+ 행 추가</button>
              <button id="saveBtn" class="ghost-btn">저장</button>
              <button id="resetBtn" class="ghost-btn">원본으로 되돌리기</button>
            </div>
            <div class="toolbar-right">
              <button id="downloadExcelBtn" class="primary-btn">Download Excel</button>
              <button id="downloadJsonBtn" class="ghost-btn">Download JSON</button>
            </div>
          </section>

          <section class="stats-grid">
            <article class="stat-card"><span class="stat-label">Visible Rows</span><strong id="visibleRows">0</strong></article>
            <article class="stat-card"><span class="stat-label">Departments</span><strong id="visibleDepts">0</strong></article>
            <article class="stat-card"><span class="stat-label">Medium / High</span><strong id="riskRows">0</strong></article>
            <article class="stat-card"><span class="stat-label">Auto Controls</span><strong id="autoRows">0</strong></article>
          </section>

          <section class="table-card">
            <div class="table-meta">
              <div id="currentFilter">전체 보기</div>
              <div id="statusText" class="status-text">Ready</div>
            </div>
            <div class="table-wrap">
              <table id="rcmTable">
                <thead></thead>
                <tbody></tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
      <div id="modalRoot"></div>
    `;

    if (!state.expanded.size) initializeExpanded(state.treeData);

    bindAppEvents();
    applyRoleUI();
    renderTree();
    renderTable();
    setStatus("Ready");
  }

  function bindAppEvents(){
    document.getElementById("searchInput").addEventListener("input", (e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderTable();
    });

    document.getElementById("treeSearchInput").addEventListener("input", (e) => {
      state.treeSearch = e.target.value.trim().toLowerCase();
      renderTree();
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      state.currentUser = null;
      render();
    });

    document.getElementById("downloadJsonBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state.rows, null, 2)], { type: "application/json;charset=utf-8" });
      triggerDownload(blob, "RCM_Data.json");
      setStatus("JSON 파일을 다운로드했습니다.");
    });

    document.getElementById("downloadExcelBtn").addEventListener("click", () => {
      try {
        if (typeof XLSX === "undefined") {
          alert("Excel 다운로드 라이브러리를 불러오지 못했습니다. 인터넷 연결 상태에서 다시 시도해 주세요.");
          return;
        }

        const exportRows = state.rows.map((row) => {
          const next = { ...row };
          applyRiskFormula(next);
          return next;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportRows, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "RCM (Risk Control Matrix)");
        XLSX.writeFile(workbook, "RCM_Export.xlsx");
        setStatus("Excel 파일을 다운로드했습니다.");
      } catch (e) {
        console.error(e);
        alert("Excel 다운로드 중 오류가 발생했습니다.");
      }
    });

    const canEdit = isManager();
    document.getElementById("addFolderBtn").addEventListener("click", () => {
      if (!canEdit) return blockViewerAction();
      openSimplePrompt("새 부서 폴더 이름", (value) => {
        const name = (value || "").trim();
        if (!name) return;
        state.treeData.push({
          id: "custom-folder-" + Date.now(),
          name,
          type: "folder",
          children: []
        });
        persistFolders();
        renderTree();
        setStatus("새 폴더가 추가되었습니다.");
      });
    });

    document.getElementById("addRowBtn").addEventListener("click", () => {
      if (!canEdit) return blockViewerAction();
      openRowModal();
    });

    document.getElementById("saveBtn").addEventListener("click", () => {
      if (!canEdit) return blockViewerAction();
      state.rows = normalizeRows(state.rows);
      persistRows();
      refreshTreeFromRows();
      renderTree();
      renderTable();
      setStatus("브라우저에 저장되었습니다.");
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!canEdit) return blockViewerAction();
      if (!confirm("편집 내용을 버리고 원본 Excel 기준 데이터로 되돌릴까요?")) return;
      localStorage.removeItem(STORAGE_ROWS_KEY);
      state.rows = normalizeRows(clone(source.rows || []));
      refreshTreeFromRows();
      renderTree();
      renderTable();
      setStatus("원본 데이터로 되돌렸습니다.");
    });
  }

  function applyRoleUI(){
    if (isManager()) return;
    ["addFolderBtn","addRowBtn","saveBtn","resetBtn"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = true;
        el.style.opacity = ".45";
      }
    });
  }

  function isManager(){
    return state.currentUser && state.currentUser.role === "manager";
  }

  function blockViewerAction(){
    alert("현재 계정은 조회 전용(User)입니다. 수정 권한이 없습니다.");
  }

  function loadRows(){
    try{
      const stored = JSON.parse(localStorage.getItem(STORAGE_ROWS_KEY) || "null");
      return Array.isArray(stored) ? stored : clone(source.rows || []);
    }catch(e){
      return clone(source.rows || []);
    }
  }

  function persistRows(){
    localStorage.setItem(STORAGE_ROWS_KEY, JSON.stringify(state.rows));
  }

  function loadSession(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY) || "null");
    }catch(e){
      return null;
    }
  }

  function mergeStoredFolders(baseTree){
    try{
      const stored = JSON.parse(localStorage.getItem(STORAGE_FOLDERS_KEY) || "[]");
      return [...baseTree, ...(Array.isArray(stored) ? stored : [])];
    }catch(e){
      return baseTree;
    }
  }

  function persistFolders(){
    const custom = state.treeData.filter(node => String(node.id || "").startsWith("custom-folder-"));
    localStorage.setItem(STORAGE_FOLDERS_KEY, JSON.stringify(custom));
  }

  function clone(v){ return JSON.parse(JSON.stringify(v)); }

  function initializeExpanded(nodes){
    nodes.forEach(node => {
      state.expanded.add(node.id);
      if(node.children && node.children.length) initializeExpanded(node.children);
    });
  }

  function refreshTreeFromRows(){
    const custom = state.treeData.filter(node => String(node.id || "").startsWith("custom-folder-"));
    const rebuilt = buildTreeFromRows(state.rows);
    state.treeData = [...rebuilt, ...custom];
    state.expanded = new Set();
    initializeExpanded(state.treeData);
  }

  function buildTreeFromRows(rows){
    const map = {};
    rows.forEach(row => {
      const dept = String(row["부서명"] || "Unknown").trim() || "Unknown";
      const comp = String(row["Compliance 명"] || "Unknown").trim() || "Unknown";
      const sub = String(row["Sub Compliance 명"] || "").trim();
      if(!map[dept]) map[dept] = {};
      if(!map[dept][comp]) map[dept][comp] = [];
      if(sub && !map[dept][comp].includes(sub)) map[dept][comp].push(sub);
    });

    return Object.entries(map).map(([dept, comps], deptIdx) => ({
      id: "dept-auto-" + deptIdx + "-" + safeKey(dept),
      name: dept,
      type: "folder",
      children: Object.entries(comps).map(([comp, subs], compIdx) => ({
        id: "comp-auto-" + deptIdx + "-" + compIdx + "-" + safeKey(comp),
        name: comp,
        type: "folder",
        children: subs.map((sub, subIdx) => ({
          id: "sub-auto-" + deptIdx + "-" + compIdx + "-" + subIdx + "-" + safeKey(sub),
          name: sub,
          type: "file"
        }))
      }))
    }));
  }

  function safeKey(v){
    return String(v || "").toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || "item";
  }

  function normalizeRows(rows){
    return rows.map((row) => {
      const next = { ...row };
      applyRiskFormula(next);
      return next;
    });
  }

  function applyRiskFormula(row){
    if (COL.inherentLikelihood && COL.inherentSeverity && COL.inherentRating) {
      row[COL.inherentRating] = calcRating(row[COL.inherentLikelihood], row[COL.inherentSeverity]);
    }
    if (COL.residualLikelihood && COL.residualSeverity && COL.residualRating) {
      row[COL.residualRating] = calcRating(row[COL.residualLikelihood], row[COL.residualSeverity]);
    }
    return row;
  }

  function calcRating(a, b){
    const x = Number(a);
    const y = Number(b);
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 1 || x > 5 || y < 1 || y > 5) return "";
    const score = x * y;
    if (score >= 1 && score <= 6) return "Low";
    if (score >= 7 && score <= 14) return "Medium";
    if (score >= 15 && score <= 25) return "High";
    return "";
  }

  function ratingBadge(value){
    const text = String(value || "");
    const lower = text.toLowerCase();
    const cls = lower === "low" ? "low" : lower === "medium" ? "medium" : lower === "high" ? "high" : "empty";
    return `<span class="badge ${cls}">${escapeHtml(text || "-")}</span>`;
  }

  function createEmptyRow(){
    const obj = {};
    headers.forEach(h => obj[h] = "");
    return applyRiskFormula(obj);
  }

  function findHeader(candidates){
    return candidates.find((c) => headers.includes(c)) || null;
  }

  function isScoreColumn(header){
    return [COL.inherentLikelihood, COL.inherentSeverity, COL.residualLikelihood, COL.residualSeverity].includes(header);
  }

  function isRatingColumn(header){
    return [COL.inherentRating, COL.residualRating].includes(header);
  }

  function makeScoreSelect(value, idx, field){
    const select = document.createElement("select");
    select.className = "cell-select";
    select.dataset.index = String(idx);
    select.dataset.field = field;

    const first = document.createElement("option");
    first.value = "";
    first.textContent = "선택";
    select.appendChild(first);

    for (let i = 1; i <= 5; i++) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = String(i);
      if (String(value) === String(i)) opt.selected = true;
      select.appendChild(opt);
    }

    select.addEventListener("change", onCellChange);
    return select;
  }

  function openSimplePrompt(title, onConfirm){
    const modalRoot = ensureModalRoot();
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box" style="width:420px">
        <div class="modal-header">
          <h3>${escapeHtml(title)}</h3>
          <button class="ghost-btn" data-close>닫기</button>
        </div>
        <div class="field-group">
          <label>이름</label>
          <input class="field-input" id="promptValue" />
        </div>
        <div class="modal-actions">
          <button class="ghost-btn" data-close>취소</button>
          <button class="primary-btn" id="confirmPromptBtn">확인</button>
        </div>
      </div>
    `;
    modalRoot.innerHTML = "";
    modalRoot.appendChild(overlay);
    overlay.querySelector("#promptValue").focus();
    overlay.querySelectorAll("[data-close]").forEach(btn => btn.onclick = () => modalRoot.innerHTML = "");
    overlay.querySelector("#confirmPromptBtn").onclick = () => {
      onConfirm(overlay.querySelector("#promptValue").value);
      modalRoot.innerHTML = "";
    };
  }

  function openRowModal(editIndex){
    if (!isManager()) return blockViewerAction();

    const modalRoot = ensureModalRoot();
    const editing = Number.isInteger(editIndex);
    const row = editing ? clone(state.rows[editIndex]) : createEmptyRow();

    const fields = headers.map((h) => {
      const value = row[h] ?? "";
      const isLong = isLongTextField(h);
      const isScore = isScoreColumn(h);
      const isRating = isRatingColumn(h);

      let fieldHtml = "";
      if (isRating) {
        fieldHtml = `<div data-rating-preview="${escapeAttr(h)}">${ratingBadge(value)}</div><div class="help-text">자동 계산 항목</div>`;
      } else if (isScore) {
        fieldHtml = `
          <select class="field-select" data-field="${escapeAttr(h)}">
            <option value="">선택</option>
            ${[1,2,3,4,5].map(n => `<option value="${n}" ${String(value)===String(n) ? "selected" : ""}>${n}</option>`).join("")}
          </select>
        `;
      } else if (isLong) {
        fieldHtml = `<textarea class="field-input" data-field="${escapeAttr(h)}" rows="4">${escapeHtml(value)}</textarea>`;
      } else {
        fieldHtml = `<input class="field-input" data-field="${escapeAttr(h)}" value="${escapeAttr(value)}" />`;
      }

      return `
        <div class="field-group">
          <label>${escapeHtml(String(h))}</label>
          ${fieldHtml}
        </div>
      `;
    }).join("");

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3>${editing ? "행 수정" : "행 추가"}</h3>
          <button class="ghost-btn" data-close>닫기</button>
        </div>
        <div class="modal-grid">${fields}</div>
        <div class="modal-actions">
          ${editing ? '<button class="danger-btn" id="deleteRowBtn">삭제</button>' : ''}
          <button class="ghost-btn" data-close>취소</button>
          <button class="primary-btn" id="saveRowBtn">${editing ? "수정 저장" : "행 추가"}</button>
        </div>
      </div>
    `;

    modalRoot.innerHTML = "";
    modalRoot.appendChild(overlay);
    overlay.querySelectorAll("[data-close]").forEach(btn => btn.onclick = () => modalRoot.innerHTML = "");

    overlay.querySelectorAll("[data-field]").forEach((el) => {
      if (isScoreColumn(el.dataset.field)) {
        el.addEventListener("change", () => updateModalRiskPreview(overlay));
      }
    });
    updateModalRiskPreview(overlay);

    if (editing) {
      overlay.querySelector("#deleteRowBtn").onclick = () => {
        if (!confirm("이 행을 삭제할까요?")) return;
        state.rows.splice(editIndex, 1);
        persistRows();
        refreshTreeFromRows();
        renderTree();
        renderTable();
        modalRoot.innerHTML = "";
        setStatus("행이 삭제되었습니다.");
      };
    }

    overlay.querySelector("#saveRowBtn").onclick = () => {
      const nextRow = {};
      overlay.querySelectorAll("[data-field]").forEach(el => {
        nextRow[el.dataset.field] = el.value;
      });
      applyRiskFormula(nextRow);

      if (editing) state.rows[editIndex] = nextRow;
      else state.rows.unshift(nextRow);

      persistRows();
      refreshTreeFromRows();
      renderTree();
      renderTable();
      modalRoot.innerHTML = "";
      setStatus(editing ? "행이 수정되었습니다." : "행이 추가되었습니다.");
    };
  }

  function updateModalRiskPreview(overlay){
    const values = {};
    overlay.querySelectorAll("[data-field]").forEach((el) => {
      values[el.dataset.field] = el.value;
    });
    applyRiskFormula(values);

    if (COL.inherentRating) {
      const target = overlay.querySelector(`[data-rating-preview="${cssEscape(COL.inherentRating)}"]`);
      if (target) target.innerHTML = ratingBadge(values[COL.inherentRating]);
    }
    if (COL.residualRating) {
      const target = overlay.querySelector(`[data-rating-preview="${cssEscape(COL.residualRating)}"]`);
      if (target) target.innerHTML = ratingBadge(values[COL.residualRating]);
    }
  }

  function isLongTextField(header){
    return longTextHints.some(k => String(header).includes(k));
  }

  function renderTree(){
    const treeRoot = document.getElementById("treeRoot");
    if (!treeRoot) return;

    treeRoot.innerHTML = "";
    const nodes = filterTree(state.treeData, state.treeSearch);
    if(!nodes.length){
      treeRoot.innerHTML = `<div class="empty-state">표시할 폴더가 없습니다.</div>`;
      return;
    }
    nodes.forEach(node => treeRoot.appendChild(buildTreeNode(node, 0)));
  }

  function filterTree(nodes, query){
    if(!query) return nodes;
    const result = [];
    nodes.forEach(node => {
      const matches = String(node.name || "").toLowerCase().includes(query);
      const children = node.children ? filterTree(node.children, query) : [];
      if(matches || children.length) result.push({ ...node, children });
    });
    return result;
  }

  function buildTreeNode(node, level){
    const wrapper = document.createElement("div");
    wrapper.className = "tree-item";

    const btn = document.createElement("button");
    btn.className = "tree-button";
    if(state.selectedName === node.name && state.selectedType === node.type) btn.classList.add("active");
    btn.style.paddingLeft = (10 + level * 16) + "px";

    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isOpen = state.expanded.has(node.id);

    btn.innerHTML = `
      <span class="tree-toggle">${hasChildren ? (isOpen ? "▾" : "▸") : "•"}</span>
      <span class="tree-icon">${node.type === "folder" ? "📁" : "📄"}</span>
      <span>${escapeHtml(node.name)}</span>
    `;

    btn.addEventListener("click", () => {
      if(hasChildren){
        if(isOpen) state.expanded.delete(node.id);
        else state.expanded.add(node.id);
      }
      state.selectedType = node.type;
      state.selectedName = node.name;
      renderTree();
      renderTable();
    });

    wrapper.appendChild(btn);

    if(hasChildren && isOpen){
      const childrenWrap = document.createElement("div");
      childrenWrap.className = "tree-children";
      node.children.forEach(child => childrenWrap.appendChild(buildTreeNode(child, level + 1)));
      wrapper.appendChild(childrenWrap);
    }

    return wrapper;
  }

  function getFilteredRows(){
    return state.rows.filter(row => {
      let matchesTree = true;
      if(state.selectedName){
        if(state.selectedType === "folder"){
          matchesTree =
            String(row["부서명"] || "") === state.selectedName ||
            String(row["Compliance 명"] || "") === state.selectedName;
        } else if(state.selectedType === "file"){
          matchesTree = String(row["Sub Compliance 명"] || "") === state.selectedName;
        }
      }

      let matchesSearch = true;
      if(state.search){
        matchesSearch = Object.values(row).some(v => String(v ?? "").toLowerCase().includes(state.search));
      }

      return matchesTree && matchesSearch;
    });
  }

  function renderTable(){
    const table = document.getElementById("rcmTable");
    if (!table) return;

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    const currentFilterEl = document.getElementById("currentFilter");
    currentFilterEl.textContent = state.selectedName ? `현재 필터: ${state.selectedName}` : "전체 보기";

    const rows = getFilteredRows();
    thead.innerHTML = "";
    tbody.innerHTML = "";

    const trh = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = String(h || "").replace(/\n/g, " ");
      trh.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "작업";
    trh.appendChild(actionTh);
    thead.appendChild(trh);

    if(!rows.length){
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = headers.length + 1;
      td.className = "empty-state";
      td.textContent = "조건에 맞는 데이터가 없습니다.";
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      rows.forEach(filteredRow => {
        const actualIndex = state.rows.indexOf(filteredRow);
        const tr = document.createElement("tr");

        headers.forEach(h => {
          const td = document.createElement("td");
          const value = filteredRow[h] ?? "";

          if (isRatingColumn(h)) {
            td.innerHTML = ratingBadge(value);
          } else if (isManager()) {
            if (isScoreColumn(h)) {
              td.appendChild(makeScoreSelect(value, actualIndex, h));
            } else {
              const isTextArea = isLongTextField(h);
              const input = document.createElement(isTextArea ? "textarea" : "input");
              input.className = "cell-input" + (isTextArea ? " cell-textarea" : "");
              input.value = value;
              input.dataset.index = String(actualIndex);
              input.dataset.field = h;
              input.addEventListener("change", onCellChange);
              td.appendChild(input);
            }
          } else {
            const div = document.createElement("div");
            div.className = "readonly-cell";
            div.textContent = value;
            td.appendChild(div);
          }
          tr.appendChild(td);
        });

        const actionTd = document.createElement("td");
        if (isManager()) {
          const editBtn = document.createElement("button");
          editBtn.className = "small-btn";
          editBtn.textContent = "상세 수정";
          editBtn.onclick = () => openRowModal(actualIndex);

          const delBtn = document.createElement("button");
          delBtn.className = "danger-btn";
          delBtn.textContent = "삭제";
          delBtn.onclick = () => {
            if(!confirm("이 행을 삭제할까요?")) return;
            state.rows.splice(actualIndex, 1);
            persistRows();
            refreshTreeFromRows();
            renderTree();
            renderTable();
            setStatus("행이 삭제되었습니다.");
          };

          actionTd.appendChild(editBtn);
          actionTd.appendChild(document.createTextNode(" "));
          actionTd.appendChild(delBtn);
        } else {
          actionTd.textContent = "조회 전용";
        }
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
      });
    }

    const deptSet = new Set(rows.map(r => r["부서명"]).filter(Boolean));
    document.getElementById("visibleRows").textContent = rows.length;
    document.getElementById("visibleDepts").textContent = deptSet.size;
    document.getElementById("riskRows").textContent = rows.filter(r => {
      const v = String((COL.inherentRating && r[COL.inherentRating]) || "");
      return ["medium","high"].includes(v.toLowerCase());
    }).length;
    document.getElementById("autoRows").textContent = rows.filter(r => String(r["Control 방법"] || "").toLowerCase() === "auto").length;
  }

  function onCellChange(e){
    if (!isManager()) return blockViewerAction();
    const idx = Number(e.target.dataset.index);
    const field = e.target.dataset.field;
    if (!Number.isInteger(idx) || !field) return;
    state.rows[idx][field] = e.target.value;
    applyRiskFormula(state.rows[idx]);
    persistRows();
    renderTable();
    setStatus("셀 변경 내용이 저장되었습니다.");
  }

  function setStatus(text){
    const el = document.getElementById("statusText");
    if (el) el.textContent = text;
  }

  function triggerDownload(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function ensureModalRoot(){
    let modalRoot = document.getElementById("modalRoot");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modalRoot";
      document.body.appendChild(modalRoot);
    }
    return modalRoot;
  }

  function cssEscape(str){
    return String(str).replace(/["\\]/g, "\\$&");
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(str){
    return escapeHtml(str).replace(/\n/g, "&#10;");
  }
})();
