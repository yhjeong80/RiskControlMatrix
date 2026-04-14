window.__directRiskInsertTest = true;
console.log('REST INSERT BUILD restfix5');
(() => {

  const SUPABASE_URL = "https://zdcfvnestdbckibhiakb.supabase.co";
  const SUPABASE_KEY = "sb_publishable_iPLYQMYoAreDwa66gN7lNw_DUs4xZf8";
  const SUPABASE_BUCKET = "monitoring-files";
  const LOGIN_LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAApCAYAAADNoTDMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAsSSURBVHhe7VpnbFRJEn7jMTmKnLNhbZNzhrsl2D5ETiJnERYJRBRR5B9HTiIJkQRrYwNCIGRsEwQICYQQ/ACRg42zl2wb8LhWX8/U2349M8a32LO3d/1Z5TfTr7q7uvt7VdX9xiANDR/AUAs0NAoDmmgaPoEmmoZPoImm4RNoomn4BJpoGj6BJpqGT6CJpuETaKJp+ASaaBo+wQ8TzTAMr7Ju3TqLbk5ODtWvX99Nj2X27NlCLysrizp27Oh2nyUkJMTS7n+C7Oxsqlu3rmjHZrOZbe7Zs0dVNeFwOMR1165dbrbUq1ePvn79qlb5r8fixYst4xgzZoyqUqDQRHO12b17d9GvN2RmZgod1RZNtPxBE026xsXFqeomLl68aOrKBNVEyx/+r4kGkYkzfPhwVd3E0KFD3eyAFCbRcnNz1aICw/800b59+0YNGjRw02PxNdFUj1aqVCm6f/++WoXu3r1LJUqUsOiyqERTyZGamkovX76kt2/fWspVIA9U6zK4/N27d6KttLQ0j7qeyoBPnz6J/jnXBJhoPJ7vEe3Lly8UHx9Pr169EnbI4H699Q8UONHkhVi/fr1FFx6tYcOGbnVY/gqiqWRbtGiR0MOk8cTNmTPH0r+30Mn6WJTw8HAaNWoUNWnShCpUqECtWrWiiRMn0tWrV+ny5cs0fvx4mjRpkihbsGCBqAMcPXpU3JsyZYpY/IiICEGshQsXijYqVqxIgYGBNGHCBNGOCrbh8+fPdOzYMRo7dix16dKFWrZsSYMHD6Zly5YJwixfvtwyFploMiGvX78u1qV3795UvXp1qly5MrVt25bGjRtHhw8fNh8geb48oVCJhsm6efMmXblyRUxwbGysMFatw+JrorG9fn5+5nd4XHghRkJCAtWpU8eiL9uiejTU9RZmIaVLl6bGjRtbyjAnIAYwffp0y70ePXpQ69at3dqBFCtWjA4dOiTqyR7x6dOnop6qz1KrVi1q166d+MzjGT16tDkGAOSeOXMmFSlSxK2+LM2bN6d79+6JOj4lGhsPgZHFixcXE4Jr0aJF3RZKlr+CaOXKlaM2bdpY2j948KCpv3PnTlHGYwKxMBbWlYmGnWn//v0t+t7GK5eDyKgLzJo1y03Xk3B9kObFixemvSA6k4j18rLBE9EQGvv27eumo4psA5PNGwqFaHmJN6Mh+SVaaEioYgU/SQ6iXLh9SI5LXGHApaISrUyZMrR161YRkrisRYsWIpTBywQFBZnl8DxLly4lf39/s0wm2u7du91sRagZNGgQjRw5kjp06GCWy14UROOjFSaaPE/ID7Hww4YNo2rVqpnlrIMQyUAYVuujDh6AgQMHmvXVdZBD56pVq9z6gO1oGyEX44HTkO9369ZN5ODe4HOi5SXfJZrNeQ0NZY+W6/oDwfAVV3xwiDKnuBjm4ptKNHgn5DoI81xmt9vFcca5c+cs/c+fP5+OHz9uKQPRMMEIXU2bNrXca9asmWVzgb5Xr15t0YF4Ipos8mHyrVu3xMOBcl7kGTNmiHvPnz8XxJbr9urVi548eWLWf/bsGQ0ZMsStDyZaUlIS1a5dW5TxwwBiYUMhAw+nSlbkbN7wtyGazbAJwee+YU6iOUkEBv1BJjlNEJ9dwsWeiHbjxg26c+eO2HVyOZ5+hGj+jhD74MEDOnHihMUuEA1ADso7UwjIgN2q0w5rojx58mRLG3kRDRuA9+/fm3VBaDUH7NOnj7i3b98+8Z0JAA+MXSKDbUB4RW4l63LoPHLkiKUcc4Jxc31uAw8XvBh0mJDw2t7wNyKanfwNu/gcwh5NjFlNQDlsOr0Z/st6noh26dIlcQ+7MtUmnnDsIAFeCBYm2ubNm8V3nnTYzyGVE3VepLNnzwqvyW3kRTTuVwbCt6wTFhYmytlbss1z584166BvecOwYcMGSxvs0Xbs2GFpA+P78OGD2Yb8wOD4StatUaOGeU9FoRKtZMmSVKlSJZH/sMi5iSp5EQ1ic11/Dg0jDD09hygjx0FJjlxKdhClOojSHA5KceTSe4eDHISFRt7wx3Y9L6JhV2z2JYUFkAIeC/ge0VimTZtm9sngRXr48KE48mDdvIjmyUuoZ2BMNCYgl+/fv1+UM0Fkoqj2MtFWrlxpaaNnz56mbSrRtm/fbtGFF/eGQiXakiVLxNOArXJ6ejolJydbFlmVPIlmN8hmx4CKU6NRC6jP9VT65+XX1OfSa/r5UgL1jkum3nFJ1Csumf4R84aW30qg9w6OnU6i4X9eRAOQ06Ack8cT2K9fP/O+N6Jt2rTJrIcrknecG8rgRUJOKIdZT0TjdkaMGGFpA1BP9UNDnZujFStWWOrCawHcr0wUtpeFQ6c6DtmjMbiNjRs3WnSRH3pDgRNN9gTqm4EfegVld15LNGhLNfbeJL+IRLKfeCPECH9NtvDX5H/iFfkfTyTjWDz1j35BKTmYkBzKRSh1PYjfI9rp06fdxnH+/HnzPg5UZbuYaKgne+vy5cvTo0ePxD2ELPkQFIevchsFRbQtW7ZYyrE54fM5mWTIr5DXybrs0Q4cOGDpH16K8zy5DVwHDBhgaQNnd95Q4ESThYnGxoFof/YVlB+u9uJUbda/qfSZFDKiUsl+8jfyO/mWbJGpZESlkHEa5WlkhKdQv9h4SshBjubcfXrbdeKMTybax48fqX379uZ9/GKDT+0B7Kxku3jXiXMwfoh4kbChyMjIMOsCOOkvW7aspY2CItrt27fd2sabDjncgfDI5bh9vrJHe/z4MVWpUsXSBu9qZcTExLi9ltu2bZuqZqLAiSZ7grVr1wodmWh/1qMhPyvWKoyqHH1AtlOJZJxOIuNUEhmRKU6JSiHbKVyTyfj1DQ2IeU1JwqO5kA+PxnZGRkZS165dheCIQ77nKXTy+REWVdgqhd2AgABBjL1794pwqi4O5EeJxjkaANKhjL0r2sEBLvI1eKtOnTpZNiLcj3yOJr+d4Ps44gC5rl27Js7ZOMfk+3gthhTJGwqcaLKooRMLkhfRfnERLTsrkzq3dx1uus7O/EtVpzprI8l+Jl14Mz+Q7VSy8GY2JlpkKvlFppERkUgDYl5Rqoto4j8TLStbkIP7VIkmP/2eylSiYTy8u8REy6fy3xNeJE9EY8kP0dijATiKqFq1qltfnkR+IOQ3AxiHfLjsSeQHBYe3Z86cMet7QqESbc2aNUJHzg3kRVZl5sxfhF5m1ifqoCxY2ZBJVC78KRlRGWSLSCVbRDwZJ5PIiEgm42QiGRHwbonOsvB4+lfsc+HR0LNKNDV08u/QVFIx5HK8W5Ttwnjk0Ir3jPK7STVEwZtgJy63gVc4nEshTMn3ZKKxDew5WeApZVy4cMGcZyYTPBzbgLyrZs2aljbUd534lQh2nDKhuD35O34kERUVJep4mjvGDxMNr2hUCQ4OFiGDT7R5oTgJxUtli35QEAU0CqA1a50eMDP7s9jWBwQE0k/BwfRT527U8/AVCr78iQKjf6PmMekUfDGFgmLSKSgmjQJjUykoJkNIcEwGBUSn0fSbiZQudp1OMOFACvwSATbA3eNAFC/+ZTtVyGVI+tlutIG2mGic8GOHjWMC9QcE0EcIRZ6Hz5gn/LoDO132aEg3MHdov1GjRjRv3jyzbwaOJuBJ2QaEOradbQVRpk6dasnZQLbOnTtTdHS02F2CJNgwoB/+1QrAbSDNgAdHuOXXbkxcEBmvo1JSUtzqecIPE01DIz/QRNPwCTTRNHwCTTQNn0ATTcMn0ETT8Ak00TR8Ak00DZ9AE03DJ9BE0/AJfgeCa0e2+j3OdQAAAABJRU5ErkJggg==";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const STORAGE_DB_KEY = 'rcm_json_model_db_v4';
  const STORAGE_SESSION_KEY = 'rcm_json_model_session_v3';
  const STORAGE_UI_KEY = 'rcm_json_model_ui_v1';
  const DATA_FILES = ['users', 'folders', 'risks', 'controls', 'change_logs'];

  const EMPTY_DB_TEMPLATE = {
    users: [],
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
    currentUser: null,
    selectedFolderId: null,
    selectedRiskId: null,
    currentModule: 'rcm',
    monitoringYear: 2026,
    monitoringQuarter: 2,
    search: '',
    treeSearch: '',
    language: 'ko',
    expanded: new Set(),
    isDirty: false,
    heatmapFilter: null,
    heatmapPreviousFolderId: null,
    isEditMode: false,
    assignableUsers: [],
    riskUserAccess: [],
    calendarFilters: {
      process: '',
      owner: '',
      status: '',
      keyword: ''
    },
    calendarDetail: {
      month: null,
      status: ''
    }
  };

  const savedUiState = loadUiState();
  if (savedUiState) {
    state.selectedFolderId = savedUiState.selectedFolderId || state.selectedFolderId;
    state.language = savedUiState.language || state.language;
    state.treeSearch = savedUiState.treeSearch || state.treeSearch;
    state.currentModule = savedUiState.currentModule || state.currentModule;
    state.monitoringYear = Number(savedUiState.monitoringYear || state.monitoringYear);
    state.monitoringQuarter = Number(savedUiState.monitoringQuarter || state.monitoringQuarter);
    state.expanded = new Set(Array.isArray(savedUiState.expandedFolderIds) ? savedUiState.expandedFolderIds : []);
    state.calendarFilters = {
      process: savedUiState.calendarFilters?.process || '',
      owner: savedUiState.calendarFilters?.owner || '',
      status: savedUiState.calendarFilters?.status || '',
      keyword: savedUiState.calendarFilters?.keyword || ''
    };
    state.calendarDetail = {
      month: Number(savedUiState.calendarDetail?.month || 0) || null,
      status: savedUiState.calendarDetail?.status || ''
    };
  }

  window.__icmGoModule = (moduleName) => {
    state.currentModule = moduleName;
    state.search = '';
    if (state.currentModule !== 'rcm') state.selectedRiskId = null;
    persistUiState();
    render();
  };

  window.__icmSetMonitoringPeriod = (periodValue) => {
    const [yearText, quarterText] = String(periodValue || '').split('|');
    const year = Number(yearText);
    const quarter = Number(quarterText);

    if (!Number.isFinite(year) || year < 2026 || year > 2035) return;
    if (![1, 2, 3, 4].includes(quarter)) return;
    if (year === 2026 && quarter < 2) return;

    state.currentModule = 'monitoring';
    state.monitoringYear = year;
    state.monitoringQuarter = quarter;
    state.search = '';

    ensureMonitoringRecordsForPeriod(year, quarter);
    persistUiState();
    render();
  };

  window.__icmSetCalendarYear = (yearValue) => {
    const year = Number(yearValue);
    if (!Number.isFinite(year) || year < 2026 || year > 2035) return;

    state.currentModule = 'calendar';
    state.monitoringYear = year;
    state.search = '';
    state.calendarDetail = { month: null, status: '' };

    persistUiState();
    render();
  };



  const I18N = {
    ko: {
      loginTitle: 'Compliance Portal Login',
      loginDesc: 'Supabase Auth 기반 로그인 화면입니다. 부여된 이메일 계정과 비밀번호로 로그인해 주세요.',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: '이메일 입력',
      passwordPlaceholder: 'Password 입력',
      loginBtn: 'Log in',
      loginNote1: '로그인 계정은 Supabase Authentication과 profiles 권한 테이블을 기준으로 관리됩니다.',
      loginNote2: 'Manager / User 권한은 비밀번호가 아니라',
      loginAlertMissing: '이메일과 비밀번호를 입력해 주세요.',
      loginAlertInvalid: '이메일 또는 비밀번호가 올바르지 않습니다.',
      loginAlertProfile: '로그인 권한 정보를 불러오지 못했습니다. 관리자에게 문의해 주세요.',
      portalMenu: 'Portal Menu',
      portalMenuDesc: 'RCM / Monitoring / Dashboard',
      searchFolderRisk: '폴더 또는 Risk 검색',
      folderActions: 'Folder Actions',
      addRootFolder: '+ 상위 폴더',
      addChildFolder: '+ 하위 폴더',
      deleteSelectedFolder: '선택 폴더 삭제',
      monitoring: '모니터링',
      dashboard: '대시보드',
      calendar: '캘린더',
      periodSelect: '기간 선택',
      yearSelect: '연도 선택',
      currentLogin: '현재 로그인',
      role: '권한',
      rcmNote: 'Risk Code 형식: <strong>R-SC-01-01</strong><br />Control Code 형식: <strong>C-SC-01-01-01</strong>',
      monitoringNote: 'Monitoring 메뉴는 분기별 통제 수행 증빙과 검토 결과를 관리하기 위한 영역입니다.',
      calendarNote: 'Calendar 메뉴는 연간 유효 통제의 월별 수행 계획을 확인하기 위한 영역입니다.',
      dashboardNote: 'Dashboard 메뉴는 RCM 및 Monitoring 운영 현황을 요약해서 보여줍니다.',
      monitoringPeriodChip: 'Monitoring Period',
      calendarYearChip: 'Calendar Year',
      heatmapFilter: 'Heatmap Filter',
      selectedRisk: '선택 Risk',
      selectedFolder: '선택 폴더',
      noFolderSelected: '선택 폴더 없음 (상위 폴더 생성)',
      noFolderSummary: '선택된 폴더가 없습니다. 상위 폴더부터 생성해 주세요.',
      childFolders: '하위 폴더',
      risk: 'Risk',
      control: 'Control',
      folderDeleteHelp: '폴더 삭제는 하위 폴더가 있더라도 Risk / Control 데이터가 없을 때만 허용됩니다.',
      riskControlMatrix: 'Risk and Control Matrix',
      rcmHeroDesc: 'Risk 1건에 여러 Control을 연결할 수 있는 RCM 구조입니다. Supabase 연동 전 단계로 화면/데이터 구조를 정리한 버전입니다.',
      editModeEnabled: 'EDIT MODE ENABLED',
      viewOnly: 'VIEW ONLY',
      searchRcm: 'Risk / Control / 법령 / 담당부서 검색',
      logout: 'Log out',
      editDone: '수정 종료',
      edit: '수정',
      totalRisks: '총 Risk 수',
      totalControls: '총 통제 수',
      visibleRisks: '표시 Risk 수',
      visibleControls: '표시 Control 수',
      rowsInRcm: 'RCM 행 수',
      mediumHigh: '잔여 Risk 중간/높음',
      changesPending: '변경사항 있음 (저장 필요)',
      ready: 'Ready',
      localStorageNote: 'LocalStorage 기반 임시 저장이 포함되어 있습니다. Supabase 연동 시 데이터 persistence를 대체할 예정입니다.',
      allView: '전체 보기',
      monitoringHeroDesc: '{period} 기준으로 통제 수행 증빙과 검토 결과를 관리합니다.',
      managerReview: '관리자 검토',
      userSubmission: '사용자 제출',
      searchMonitoring: 'Control / 담당자 / 검토결과 검색',
      reviewDone: '검토 종료',
      reviewStart: '검토',
      save: '저장',
      monitoringRows: '모니터링 건수',
      uploaded: '업로드 완료',
      reviewResult: '검토결과',
      pendingReview: '검토 대기',
      periodMonitoring: '{period} 모니터링',
      department: '부서',
      controlName: 'Control 명',
      controlDepartment: '담당부서',
      owner: '담당자',
      evidenceFiles: '증빙 파일',
      requiredSampleSize: '필요 표본 수',
      submittedSampleSize: '제출 표본 수',
      sufficiency: '충족 여부',
      uploadDate: '업로드일',
      submissionStatus: '제출 상태',
      reviewComment: '검토 의견',
      noMonitoringRows: 'Monitoring 대상 항목이 없습니다.',
      sampleGuide: '표본 산정 기준 보기',
      monitoringFooter: '동일 분기 내 증빙 업로드 현황과 검토 결과를 기준으로 제출/검토 상태를 계산합니다.',
      calendarHeroDesc: '{label} 기준으로 유효한 Control의 월별 수행 계획을 확인합니다.',
      allControls: 'ALL CONTROLS',
      assignedOnly: 'ASSIGNED ONLY',
      allValidControls: '전체 유효 통제',
      assignedControlsOnly: '배정 통제만 보기',
      dashboardHeroDesc: 'RCM 및 Monitoring 운영 현황을 요약해서 보여주는 Dashboard입니다.',
      summary: '요약',
      highResidualRisk: '고위험 잔여 Risk',
      dashboardSummary: '대시보드 요약',
      processRiskSummary: '프로세스별 Risk 현황',
      notSubmitted: '미제출',
      submissionPending: '제출 대기',
      fit: '적합',
      gap: '미흡',
      fail: '부적합',
      monthCount: '계획 월 수',
      noDetailPrompt: '상세 목록을 보려면 캘린더의 월 셀을 클릭해 주세요.',
      monthDetail: '월별 상세',
      detailReset: 'Clear Detail Selection',
      full: 'All',
      noMonthlyDetailRows: '선택한 조건에 해당하는 월별 상세 항목이 없습니다.',
      process: 'Process',
      status: 'Status',
      search: 'Search',
      resetFilter: 'Reset Filters',
      overallStatus: '종합 상태',
      controlFrequency: '통제 주기',
      footerCalendar: '연간 캘린더는 Control 수행월 기준으로 표시되며, 신설일은 해당 월부터 반영되고 종료일이 포함된 월까지 표시됩니다.',
      roleManagerEdit: 'Manager (Review/Edit Access)',
      roleManagerRead: 'Manager (View/Pending Review)',
      roleUser: 'User (Evidence Upload Available in Monitoring)',
      blockRcmManagerOnly: 'RCM Master의 Risk / Control 수정은 Manager 계정만 가능합니다.',
      blockRcmEditMode: '수정 버튼을 눌러 Edit Mode를 활성화한 후 수정할 수 있습니다.',
      blockUploadLogin: '로그인한 사용자만 증빙 업로드를 할 수 있습니다.',
      blockReviewManager: 'Monitoring의 검토 결과와 검토 의견은 Manager만 수정할 수 있습니다.',
      blockReviewMode: '검토 버튼을 눌러 검토 모드를 활성화한 후 저장할 수 있습니다.',
      tooltipAddChildFolder: '하위 폴더 추가',
      tooltipEditFolder: '폴더명 수정',
      tooltipDeleteFolder: '폴더 삭제',
      tooltipRiskCriteria: '평가 기준 보기',
      roleValueSuffix: '값으로 구분됩니다.',
      period: '기간',
      addRisk: '+ Risk 추가',
      moveSelectedRisk: 'Move Selected Risk',
      clearHeatmapFilterBtn: 'Clear Heatmap Filter',
      reviewResultsSummaryTitle: '{period} Review Results',
      conformingKo: 'Conforming',
      needsImprovementKo: 'Needs Improvement',
      nonconformingKo: 'Nonconforming',
      pendingSubmissionKo: 'Pending Submission',
      pendingReviewKo: 'Pending Review',
      heatmapTitle: 'Risk Heatmap',
      companyStandard: 'Company Standard',
      inherentRiskHeatmap: 'Inherent Risk Heatmap',
      residualRiskHeatmap: 'Residual Risk Heatmap',
      likelihoodAxis: 'Likelihood',
      impactAxis: 'Impact',
      riskCount: 'Risk Count',
      caseCount: 'Cases',
      inactiveMonth: 'Inactive Month',
      noControlsMatch: '필터 조건에 맞는 Control이 없습니다.',
      periodLabel: 'Period',
      submittedCompleted: 'Submitted',
      reviewCompleted: 'Review Completed',
      reviewShort: 'REV',
      submitShort: 'SUB',
      sufficient: 'Sufficient',
      resetBrowserData: '브라우저에 저장된 데이터와 로그인 세션을 초기화할까요?',
      sampleGuideTitle: 'Required Evidence Sample Size Criteria',
      sampleGuideAuto: 'Auto Control',
      sampleGuideManual: 'Manual Control',
      sampleGuideDesc: 'The required sample size is determined automatically based on the <strong>Inherent Risk Rating</strong>, <strong>Control Operation Type (Auto / Manual)</strong>, and <strong>Control Frequency</strong>.',
      controlCycle: 'Control Frequency',
      inherentRiskMidOrBelow: 'Inherent Risk Rating Medium or Below',
      inherentRiskHigh: 'Inherent Risk Rating High',
      uploadOneEqualsOne: 'In the current system, one uploaded file is counted as one submitted sample.',
      close: 'Close',
      inherentRiskLikelihood: 'Inherent Risk Likelihood',
      inherentRiskImpact: 'Inherent Risk Impact',
      riskCodeAutoMessage: 'Risk Code는 <strong>R-부서약자-구분코드-일련번호</strong> 형식으로 자동 생성됩니다.<br>잔여 Risk 발생가능성과 잔여 Risk 결과 심각성은 <strong>Control 추가</strong> 화면에서 입력합니다.',
      add: 'Add',
      departmentAbbrRequired: '부서 약자를 입력해 주세요. 예: HR',
      referenceLawRequired: '관련 규정을 입력해 주세요.',
      riskContentRequired: 'Risk 내용을 입력해 주세요.',
      noAssignableUser: 'No Assignable User Available',
      referenceLawLabel: 'Applicable Regulation',
      regulationDetailLabel: 'Regulation Details',
      sanctionLabel: 'Related Penalty',
      riskContentLabel: 'Risk Description',
      inherentRiskRating: '고유 Risk Rating',
      controlDetail: 'Control Detail',
      controlContentLabel: 'Control Description',
      controlTypeLabel: 'Control Type',
      controlOperationTypeLabel: 'Control Operation Type',
      scheduledMonthsLabel: 'Scheduled Month(s)',
      teamNameLabel: 'Team',
      authorizedUserLabel: 'Assigned User',
      residualRiskLikelihood: 'Residual Risk Likelihood',
      residualRiskImpact: 'Residual Risk Impact',
      residualRiskRating: '잔여 Risk Rating',

      addControlTitle: 'Control 추가',
      score: '점수',
      grade: '등급',
      criteria: '기준',
      gradingMethod: '등급구분 방법',
      gradingMethodDesc: '열거된 항목 중 하나라도 해당될 경우 해당 등급으로 평가하며, 복수 항목에 해당하는 경우에는 그 중 가장 높은 등급으로 평가합니다.',
      january: '1월',
      february: '2월',
      march: '3월',
      april: '4월',
      may: '5월',
      june: '6월',
      july: '7월',
      august: '8월',
      september: '9월',
      october: '10월',
      november: '11월',
      december: '12월',
      scheduleMonthHelp: '주기를 변경하면 권장 월이 자동 적용되며, 월 버튼으로 다시 조정할 수 있습니다.',
      selectOneAssignableUser: '선택한 User에게 관련 Risk / Control 열람 권한과 Monitoring 증빙 업로드 권한이 자동 부여됩니다.',
      controlProcessLabel: '프로세스',
      controlApplicableRegulationLabel: '적용 규정',
      controlNameModalLabel: 'Control 명',
      controlContentModalLabel: 'Control 내용',
      controlTypeModalLabel: 'Control 유형',
      controlExecutionTypeModalLabel: '통제 수행 방식',
      controlFrequencyModalLabel: '통제 주기',
      ownerNameModalLabel: '업무 담당자',
      assignedUserModalLabel: '권한 User',
      controlCodeAutoNote: 'Control Code는 <strong>C-TeamCode-RegulationCode-RiskSeq-ControlSeq</strong> 형식으로 자동 생성됩니다.',
      createBtn: '생성',
      loadingData: 'RCM JSON 모델을 불러오는 중입니다...',
      monthDetailTitle: '{year}년 {month}월 상세 목록',
      countSuffix: '{count}건',
      monthShortPattern: '{month}월',
      monthDetailTooltip: '{month}월 {status} 상세보기',
      sampleGuideDesc: '필요 표본 수는 <strong>고유 Risk Rating</strong>, <strong>통제 수행 방식(Auto / Manual)</strong>, <strong>통제 주기</strong>를 기준으로 자동 산정됩니다.',
      continuous: '상시',
      adhoc: '건별',
      daily: '일별',
      weekly: '주별',
      monthly: '월별',
      quarterly: '분기별',
      semiAnnual: '반기별',
      annual: '연간',
      inherentRiskShort: '고유 Risk',
      residualRiskShort: '잔여 Risk',
      resultSeverity: '결과심각성',
      likelihoodKo: '발생가능성',
      noUpload: '미업로드',
      uploadEvidence: '증빙 업로드',
      insufficient: '부족',
      uploadModalTitle: '증빙 등록',
      existingEvidenceList: '기존 증빙 목록',
      download: '다운로드',
      noEvidenceRegistered: '등록된 증빙이 없습니다.',
      attachment: '첨부파일',
      noFileSelected: '선택된 파일이 없습니다.',
      descriptionLabel: '설명',
      evidenceDescriptionPlaceholder: '예: 1분기 수행 증빙',
      exceptionReasonLabel: '예외 사유',
      exceptionReasonPlaceholder: '예외 사유 선택',
      exceptionReasonNone: '없음',
      exceptionReasonNoOccurrence: '해당 기간 통제활동 발생 없음',
      exceptionReasonLessThanSample: '실제 발생 건수가 필요 표본 수보다 적음',
      exceptionCommentHelp: '첨부파일이 없는 경우에만 예외 사유를 선택하여 저장할 수 있습니다.',
      exceptionNoSelectionAlert: '첨부파일이 없는 경우에는 예외 사유를 선택해 주세요.',
      exceptionSubmitted: '예외 제출',
      addRow: '+ 행 추가',
      removeRow: '행 삭제',
      minimumOneRowRequired: '최소 1개의 입력 행은 필요합니다.',
      descriptionWithoutFileAlert: '파일을 선택하지 않은 행에 설명만 입력되어 있습니다. 파일을 선택하거나 설명을 삭제해 주세요.',
      minimumOneFileRequired: '최소 1개의 파일을 선택해 주세요.',
      evidenceUploadSuccess: '증빙파일이 업로드되고 DB에 저장되었습니다.',
      evidenceUploadError: '파일 업로드 중 오류가 발생했습니다: {message}',
      noFoldersToDisplay: '표시할 폴더가 없습니다.',
      noItemsMatch: '조건에 맞는 항목이 없습니다.',
      addChildFolderFirst: '하위 폴더를 생성하려면 먼저 상위 폴더를 선택해 주세요.',
      selectFolderToDelete: '삭제할 폴더를 먼저 선택해 주세요.',
      selectFolderForRisk: '리스크를 추가하려면 먼저 폴더를 선택해 주세요.',
      selectRiskToMove: '이동할 Risk를 먼저 선택해 주세요.',
      confirmResetAllData: '모든 데이터를 삭제하고 빈 상태로 되돌릴까요?',
      excelLibraryLoadFailed: 'Excel 다운로드 라이브러리를 불러오지 못했습니다.',
      noActiveUserAlert: '사용자 권한 정보가 없거나 비활성 계정입니다. 관리자에게 문의해 주세요.',
      folderNameLabel: '폴더명',
      folderNamePlaceholder: '예: Sales Compliance / HR / Legal',
      addChildFolderTitle: '하위 폴더 추가',
      addRootFolderTitle: '상위 폴더 추가',
      selectedParentFolder: '선택한 상위 폴더',
      noFolderCreateAsRoot: '선택한 폴더가 없으므로 상위 폴더로 생성됩니다.',
      managerFolderOnly: 'Manager 계정만 폴더 생성 및 삭제가 가능합니다.',
      enterFolderName: '폴더명을 입력해 주세요.',
      editFolderNameTitle: '폴더명 수정',
      currentFolderName: '현재 폴더명',
      newFolderName: '새 폴더명',
      folderRenameHelp: '폴더명을 변경해도 하위 폴더 및 연결된 Risk / Control 데이터는 유지됩니다.',
      enterNewFolderName: '새 폴더명을 입력해 주세요.',
      moveRiskTitle: 'Risk 폴더 이동',
      currentFolder: '현재 폴더',
      targetFolder: '이동 대상 폴더',
      noMovableFolder: '이동 가능한 다른 폴더가 없습니다. 먼저 폴더를 추가해 주세요.',
      moveRiskHelp: 'Risk를 이동해도 연결된 Control과 Monitoring 데이터는 유지됩니다.',
      move: '이동',
      controlTypeApproval: '승인',
      controlTypeAuthorization: '권한부여',
      controlTypeSegregation: '업무분장',
      controlTypeMonitoring: '감독 및 모니터링',
      controlTypeReconciliation: '대사 및 검증',
      controlTypeConfirmation: '확인서 징구',
      controlTypeTraining: '교육실시',
      controlTypeOther: '기타',
      assignedUserMeta: '권한 사용자',
      assignableUsersLoadFailed: '배정 가능한 User 목록을 불러오지 못했습니다.',
      ownerAssignmentHelp: '업무 담당자와 권한 사용자를 분리해서 관리합니다.',
      downloadJson: 'JSON 다운로드',
      downloadExcel: '엑셀 다운로드',
      uploadedForPeriod: '{period} 업로드 완료',
      quartersuffix: '분기'
    },
    en: {
      loginTitle: 'Compliance Portal Login',
      loginDesc: 'Sign in with your assigned email account and password using Supabase Auth.',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'Enter email',
      passwordPlaceholder: 'Enter password',
      loginBtn: 'Log in',
      loginNote1: 'Login accounts are managed through Supabase Authentication and the profiles authorization table.',
      loginNote2: 'Manager / User permissions are determined by',
      loginAlertMissing: 'Please enter your email and password.',
      loginAlertInvalid: 'The email or password is incorrect.',
      loginAlertProfile: 'Unable to load your authorization profile. Please contact the administrator.',
      portalMenu: 'Portal Menu',
      portalMenuDesc: 'RCM / Monitoring / Dashboard',
      searchFolderRisk: 'Search folder or risk',
      folderActions: 'Folder Actions',
      addRootFolder: '+ Add Root Folder',
      addChildFolder: '+ Add Child Folder',
      deleteSelectedFolder: 'Delete Selected Folder',
      monitoring: 'Monitoring',
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      periodSelect: 'Period',
      yearSelect: 'Year',
      currentLogin: 'Signed in as',
      role: 'Role',
      rcmNote: 'Risk Code format: <strong>R-SC-01-01</strong><br />Control Code format: <strong>C-SC-01-01-01</strong>',
      monitoringNote: 'Use Monitoring to manage quarterly control evidence and review results.',
      calendarNote: 'Use Calendar to review annual valid controls and monthly schedules.',
      dashboardNote: 'Use Dashboard to review summary metrics and monitoring results.',
      monitoringPeriodChip: 'Monitoring Period',
      calendarYearChip: 'Calendar Year',
      heatmapFilter: 'Heatmap Filter',
      selectedRisk: 'Selected Risk',
      selectedFolder: 'Selected Folder',
      noFolderSelected: 'No folder selected (create a root folder)',
      noFolderSummary: 'No folder is selected. Create a root folder first.',
      childFolders: 'Child Folders',
      risk: 'Risk',
      control: 'Control',
      folderDeleteHelp: 'Folder deletion is allowed only when there is no Risk / Control data, even if child folders exist.',
      riskControlMatrix: 'Risk and Control Matrix',
      rcmHeroDesc: 'This RCM structure allows multiple controls to be linked to a single risk. This version organizes the UI and data structure before full Supabase integration.',
      editModeEnabled: 'EDIT MODE ENABLED',
      viewOnly: 'VIEW ONLY',
      searchRcm: 'Search risk / control / regulation / department',
      logout: 'Log out',
      editDone: 'Finish Editing',
      edit: 'Edit',
      totalRisks: 'Total Risks',
      totalControls: 'Total Controls',
      visibleRisks: 'Visible Risks',
      visibleControls: 'Visible Controls',
      rowsInRcm: 'Rows in RCM',
      mediumHigh: 'Residual Risk Medium / High',
      changesPending: 'Unsaved changes',
      ready: 'Ready',
      localStorageNote: 'This version currently uses LocalStorage. Once the UI and code rules are finalized, it can be migrated to Supabase.',
      allView: 'All Items',
      monitoringHeroDesc: 'Manage control evidence and review results for {period}.',
      managerReview: 'Manager Review',
      userSubmission: 'User Submission',
      searchMonitoring: 'Search control / owner / review result',
      reviewDone: 'Finish Review',
      reviewStart: 'Review',
      save: 'Save',
      monitoringRows: 'Monitoring Rows',
      uploaded: 'Uploaded',
      reviewResult: 'Review Result',
      pendingReview: 'Pending Review',
      periodMonitoring: '{period} Monitoring',
      department: 'Department',
      controlName: 'Control Name',
      controlDepartment: 'Control Department',
      owner: 'Owner',
      evidenceFiles: 'Evidence Files',
      requiredSampleSize: 'Required Sample Size',
      submittedSampleSize: 'Submitted Sample Size',
      sufficiency: 'Sufficiency',
      uploadDate: 'Upload Date',
      submissionStatus: 'Submission Status',
      reviewComment: 'Review Comment',
      noMonitoringRows: 'No monitoring items are available for this period.',
      sampleGuide: 'View sample sizing criteria',
      monitoringFooter: 'Required sample sizes are calculated automatically based on inherent risk rating, control type, and control frequency. Currently, one uploaded file is counted as one sample.',
      calendarHeroDesc: 'Review valid controls and monthly schedules for {label}.',
      allControls: 'ALL CONTROLS',
      assignedOnly: 'ASSIGNED ONLY',
      allValidControls: 'All Valid Controls',
      assignedControlsOnly: 'Assigned Controls Only',
      dashboardHeroDesc: 'Dashboard summarizing RCM and Monitoring operations.',
      summary: 'Summary',
      highResidualRisk: 'High Residual Risk',
      dashboardSummary: 'Dashboard Summary',
      processRiskSummary: 'Process Risk Summary',
      notSubmitted: 'Not Submitted',
      submissionPending: 'Pending Submission',
      fit: 'Conforming',
      gap: 'Needs Improvement',
      fail: 'Nonconforming',
      monthCount: 'Scheduled Months',
      noDetailPrompt: 'Click a month cell in the calendar to display the detailed list.',
      monthDetail: 'Monthly Detail',
      detailReset: 'Clear Detail Selection',
      full: 'All',
      noMonthlyDetailRows: 'No monthly detail items match the selected condition.',
      process: 'Process',
      status: 'Status',
      search: 'Search',
      resetFilter: 'Reset Filters',
      overallStatus: 'Overall Status',
      controlFrequency: 'Control Frequency',
      footerCalendar: 'The annual calendar is shown by scheduled control months. Effective dates apply from the relevant month, and closed dates remain visible through the month in which they occur.',
      roleManagerEdit: 'Manager (review/edit enabled)',
      roleManagerRead: 'Manager (read/review pending)',
      roleUser: 'User (evidence upload available in Monitoring)',
      blockRcmManagerOnly: 'Only Manager accounts can modify risks and controls in RCM Master.',
      blockRcmEditMode: 'Click Edit to enable edit mode before making changes.',
      blockUploadLogin: 'Only signed-in users can upload evidence.',
      blockReviewManager: 'Only Managers can modify the review result and review comment in Monitoring.',
      blockReviewMode: 'Click Review to enable review mode before saving changes.',
      tooltipAddChildFolder: 'Add child folder',
      tooltipEditFolder: 'Rename folder',
      tooltipDeleteFolder: 'Delete folder',
      tooltipRiskCriteria: 'View evaluation criteria',
      roleValueSuffix: 'value.',
      period: 'Period',
      addRisk: '+ Add Risk',
      moveSelectedRisk: 'Move Selected Risk',
      clearHeatmapFilterBtn: 'Clear Heatmap Filter',
      reviewResultsSummaryTitle: '{period} Review Results',
      conformingKo: 'Conforming',
      needsImprovementKo: 'Needs Improvement',
      nonconformingKo: 'Nonconforming',
      pendingSubmissionKo: 'Pending Submission',
      pendingReviewKo: 'Pending Review',
      heatmapTitle: 'Risk Heatmap',
      companyStandard: 'Company Standard',
      inherentRiskHeatmap: 'Inherent Risk Heatmap',
      residualRiskHeatmap: 'Residual Risk Heatmap',
      likelihoodAxis: 'Likelihood',
      impactAxis: 'Impact',
      riskCount: 'Risk Count',
      caseCount: 'Count',
      inactiveMonth: 'Inactive Month',
      noControlsMatch: 'No controls match the selected filters.',
      periodLabel: 'Period',
      submittedCompleted: 'Submitted',
      reviewCompleted: 'Review Completed',
      reviewShort: 'Review',
      submitShort: 'Submit',
      sufficient: 'Sufficient',
      resetBrowserData: 'Reset the locally stored data and login session?',
      sampleGuideTitle: 'Sample Sizing Criteria',
      sampleGuideAuto: 'Automated Control',
      sampleGuideManual: 'Manual Control',
      sampleGuideDesc: 'The required sample size is determined automatically based on the <strong>Inherent Risk Rating</strong>, <strong>Control Operation Type (Auto / Manual)</strong>, and <strong>Control Frequency</strong>.',
      controlCycle: 'Control Frequency',
      inherentRiskMidOrBelow: 'Inherent Risk Rating Medium or Below',
      inherentRiskHigh: 'Inherent Risk Rating High',
      continuous: 'Continuous',
      adhoc: 'Ad-hoc',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      semiAnnual: 'Semi-annual',
      annual: 'Annual',
      uploadOneEqualsOne: 'In the current system, one uploaded file is counted as one sample.',
      close: 'Close',
      inherentRiskLikelihood: 'Inherent Risk Likelihood',
      inherentRiskImpact: 'Inherent Risk Impact',
      riskCodeAutoMessage: 'Risk Codes are generated automatically in the format <strong>R-DEPT-CATEGORY-SEQ</strong>.<br>Residual Risk Likelihood and Residual Risk Impact are entered in the <strong>Add Control</strong> screen.',
      add: 'Add',
      departmentAbbrRequired: 'Please enter the department abbreviation. Example: HR',
      referenceLawRequired: 'Please enter the applicable regulation.',
      riskContentRequired: 'Please enter the risk description.',
      noAssignableUser: 'No assignable users available',
      referenceLawLabel: 'Applicable Regulation',
      regulationDetailLabel: 'Regulation Details',
      sanctionLabel: 'Related Penalty',
      riskContentLabel: 'Risk Description',
      inherentRiskRating: 'Inherent Risk Rating',
      controlDetail: 'Control Detail',
      controlContentLabel: 'Control Description',
      controlTypeLabel: 'Control Type',
      controlOperationTypeLabel: 'Control Operation Type',
      scheduledMonthsLabel: 'Scheduled Month(s)',
      teamNameLabel: 'Team',
      authorizedUserLabel: 'Authorized User',
      residualRiskLikelihood: 'Residual Risk Likelihood',
      residualRiskImpact: 'Residual Risk Impact',
      residualRiskRating: 'Residual Risk Rating',
      quartersuffix: 'Q',
      addControlTitle: 'Add Control',
      score: 'Score',
      grade: 'Grade',
      criteria: 'Criteria',
      gradingMethod: 'Grading Method',
      gradingMethodDesc: 'If any one criterion applies, the corresponding grade is assigned. If multiple criteria apply, the highest grade among them is used.',
      january: 'Jan',
      february: 'Feb',
      march: 'Mar',
      april: 'Apr',
      may: 'May',
      june: 'Jun',
      july: 'Jul',
      august: 'Aug',
      september: 'Sep',
      october: 'Oct',
      november: 'Nov',
      december: 'Dec',
      scheduleMonthHelp: 'When a control frequency is selected, recommended months are auto-selected. You may adjust them freely if needed.',
      selectOneAssignableUser: 'The selected user is automatically granted view access to the related Risk / Control and upload access in Monitoring.',
      controlProcessLabel: 'Process',
      controlApplicableRegulationLabel: 'Applicable Regulation',
      controlNameModalLabel: 'Control Name',
      controlContentModalLabel: 'Control Description',
      controlTypeModalLabel: 'Control Type',
      controlExecutionTypeModalLabel: 'Control Operation Type',
      controlFrequencyModalLabel: 'Control Frequency',
      ownerNameModalLabel: 'Owner',
      assignedUserModalLabel: 'Assigned User',
      controlCodeAutoNote: 'Control Codes are generated automatically in the format <strong>C-TeamCode-RegulationCode-RiskSeq-ControlSeq</strong>.',
      loadingData: 'Loading the RCM JSON model...',
      monthDetailTitle: '{year} {month} Details',
      countSuffix: '{count} items',
      monthShortPattern: '{month}',
      monthDetailTooltip: 'View details for {month} ({status})',
      uploadModalTitle: 'Upload Evidence',
      existingEvidenceList: 'Existing Evidence',
      download: 'Download',
      noEvidenceRegistered: 'No evidence has been registered.',
      attachment: 'Attachment',
      noFileSelected: 'No file selected.',
      descriptionLabel: 'Description',
      evidenceDescriptionPlaceholder: 'e.g. Q1 execution evidence',
      exceptionReasonLabel: 'Exception Reason',
      exceptionReasonPlaceholder: 'Select exception reason',
      exceptionReasonNone: 'None',
      exceptionReasonNoOccurrence: 'No control activity occurred during the period',
      exceptionReasonLessThanSample: 'Actual occurrences are fewer than required sample size',
      exceptionCommentHelp: 'Select an exception reason only when no file is uploaded.',
      exceptionNoSelectionAlert: 'Select an exception reason when no file is uploaded.',
      exceptionSubmitted: 'Exception Submitted',
      addRow: '+ Add Row',
      removeRow: 'Remove Row',
      minimumOneRowRequired: 'At least one entry row is required.',
      descriptionWithoutFileAlert: 'A row has a description without a file. Please select a file or clear the description.',
      minimumOneFileRequired: 'Please select at least one file.',
      evidenceUploadSuccess: 'Evidence files were uploaded and saved to the database.',
      evidenceUploadError: 'An error occurred while uploading files: {message}',
      controlTypeApproval: 'Approval',
      controlTypeAuthorization: 'Authorization',
      controlTypeSegregation: 'Segregation of Duties',
      controlTypeMonitoring: 'Supervision and Monitoring',
      controlTypeReconciliation: 'Reconciliation and Verification',
      controlTypeConfirmation: 'Confirmation Collection',
      controlTypeTraining: 'Training',
      controlTypeOther: 'Other',
      assignedUserMeta: 'Assigned User',
      assignableUsersLoadFailed: 'Unable to load the list of assignable users.',
      ownerAssignmentHelp: 'Manage the control owner separately from the assigned access user.',
      downloadJson: 'Download JSON',
      downloadExcel: 'Download Excel',
      uploadedForPeriod: '{period} Uploaded',
      headerProcess: 'Process',
      headerApplicableRegulation: 'Applicable Regulation',
      headerRegulationDetail: 'Regulation Details',
      headerRelatedPenalty: 'Related Penalty',
      headerRiskDescription: 'Risk Description',
      headerInherentLikelihood: 'Inherent Risk\nLikelihood',
      headerInherentImpact: 'Inherent Risk\nImpact',
      headerInherentRating: 'Inherent Risk\nRating',
      headerControlCode: 'Control\nCode',
      headerControlName: 'Control Name',
      headerControlDescription: 'Control Description',
      headerControlType: 'Control Type',
      headerControlOperationType: 'Control Operation\nType',
      headerControlFrequency: 'Control\nFrequency',
      headerTeam: 'Team',
      headerOwner: 'Owner',
      headerResidualLikelihood: 'Residual Risk\nLikelihood',
      headerResidualImpact: 'Residual Risk\nImpact',
      headerResidualRating: 'Residual Risk\nRating',
      noUpload: 'No Upload',
      uploadEvidence: 'Upload Evidence',
      insufficient: 'Insufficient',
      sufficiencyMet: 'Sufficient',
      createBtn: 'Create'
    }
  };

  function getLang() {
    return state.language === 'en' ? 'en' : 'ko';
  }

  function t(key, vars = {}) {
    const lang = getLang();
    let value = I18N[lang]?.[key] ?? I18N.ko?.[key] ?? key;
    Object.entries(vars || {}).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });
    return value;
  }

  function isEnglish() {
    return getLang() === 'en';
  }

  function getMonthShortLabel(month) {
    const labels = {
      1: t('january'),
      2: t('february'),
      3: t('march'),
      4: t('april'),
      5: t('may'),
      6: t('june'),
      7: t('july'),
      8: t('august'),
      9: t('september'),
      10: t('october'),
      11: t('november'),
      12: t('december')
    };
    return labels[Number(month)] || `${month}`;
  }


  function getFrequencyDisplayLabel(value) {
    const normalized = normalizeFrequency(value);
    const map = {
      '상시': t('continuous'),
      '건별': t('adhoc'),
      '일별': t('daily'),
      '주별': t('weekly'),
      '월별': t('monthly'),
      '분기별': t('quarterly'),
      '반기별': t('semiAnnual'),
      '연간': t('annual')
    };
    if (normalized && map[normalized]) return map[normalized];
    return value || '';
  }

  function getControlTypeDisplayLabel(value) {
    const map = {
      '승인': t('controlTypeApproval'),
      '권한부여': t('controlTypeAuthorization'),
      '업무분장': t('controlTypeSegregation'),
      '감독 및 모니터링': t('controlTypeMonitoring'),
      '대사 및 검증': t('controlTypeReconciliation'),
      '확인서 징구': t('controlTypeConfirmation'),
      '교육실시': t('controlTypeTraining'),
      '기타': t('controlTypeOther')
    };
    return map[value] || value || '';
  }

  function translateSampleSufficiency(value) {
    if (value === '충족' || value === 'Sufficient') return t('sufficient');
    if (value === '부족' || value === 'Insufficient') return t('insufficient');
    if (value === '예외제출' || value === 'Exception Submitted') return t('exceptionSubmitted');
    return value || '';
  }

  function translateSubmissionStatus(value) {
    if (value === '제출대기') return t('pendingSubmissionKo');
    if (value === '검토대기') return t('pendingReviewKo');
    if (value === '제출완료' || value === 'Submitted') return t('submittedCompleted');
    if (value === '검토완료' || value === 'Review Completed') return t('reviewCompleted');
    if (value === '적합' || value === 'Conforming') return t('conformingKo');
    if (value === '미흡' || value === 'Needs Improvement') return t('needsImprovementKo');
    if (value === '부적합' || value === 'Nonconforming') return t('nonconformingKo');
    if (value === '충족' || value === 'Sufficient') return t('sufficient');
    return value || '';
  }

  window.__icmSetLanguage = (lang) => {
    state.language = lang === 'en' ? 'en' : 'ko';
    persistUiState();
    render();
  };

  let appReloadPromise = null;
  let lastAppReloadAt = 0;

  function resetSignedOutAppState() {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    state.currentUser = null;
    state.selectedRiskId = null;
    state.search = '';
    state.treeSearch = '';
    state.heatmapFilter = null;
    state.heatmapPreviousFolderId = null;
    state.isEditMode = false;
    closeModal();
    persistUiState();
    render();
  }

  async function reloadAppStateFromSupabase(force = false) {
    if (!state.currentUser) return;
    const now = Date.now();
    if (!force && appReloadPromise) return appReloadPromise;
    if (!force && now - lastAppReloadAt < 1500) return;
    appReloadPromise = (async () => {
      try {
        state.currentUser = await loadCurrentAuthUser();
        if (!state.currentUser) {
          resetSignedOutAppState();
          return;
        }
        state.db = await loadDatabase();
        normalizeDatabase();
        await refreshAccessControlContext();
        initializeExpanded();
        if (state.selectedFolderId && !getFolderById(state.selectedFolderId)) state.selectedFolderId = null;
        if (state.selectedRiskId && !getRiskById(state.selectedRiskId)) state.selectedRiskId = null;
        persistUiState();
        render();
        lastAppReloadAt = Date.now();
      } finally {
        appReloadPromise = null;
      }
    })();
    return appReloadPromise;
  }

  async function init() {
    renderLoading();
    state.currentUser = await loadCurrentAuthUser();
    state.db = await loadDatabase();
    normalizeDatabase();
    await refreshAccessControlContext();
    initializeExpanded();
    if (state.selectedFolderId && !getFolderById(state.selectedFolderId)) state.selectedFolderId = null;
    if (state.selectedRiskId && !getRiskById(state.selectedRiskId)) state.selectedRiskId = null;
    persistUiState();
    render();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        resetSignedOutAppState();
        return;
      }
      state.currentUser = await buildCurrentUserFromSession(session);
      await reloadAppStateFromSupabase(true);
    });

    window.addEventListener('pageshow', () => {
      if (state.currentUser && !isModalOpen()) reloadAppStateFromSupabase(false);
    });
    window.addEventListener('focus', () => {
      if (state.currentUser && !isModalOpen()) reloadAppStateFromSupabase(false);
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && state.currentUser && !isModalOpen()) reloadAppStateFromSupabase(false);
    });
  }


  async function loadCurrentAuthUser() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to restore auth session:', error);
        return null;
      }
      return await buildCurrentUserFromSession(data?.session || null);
    } catch (error) {
      console.error('Unexpected auth session restore error:', error);
      return null;
    }
  }

  async function buildCurrentUserFromSession(session) {
    const authUser = session?.user || null;
    if (!authUser) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, employee_id, email, display_name, role, is_active')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.error('Failed to load profile for signed-in user:', error);
      return null;
    }

    if (!profile || profile.is_active === false) {
      await supabase.auth.signOut();
      localStorage.removeItem(STORAGE_SESSION_KEY);
      alert(t('noActiveUserAlert'));
      return null;
    }

    const currentUser = {
      authId: authUser.id,
      userId: profile.employee_id || authUser.id,
      username: profile.email || authUser.email || '',
      email: profile.email || authUser.email || '',
      role: String(profile.role || '').toLowerCase(),
      displayName: profile.display_name || (profile.email || authUser.email || '').split('@')[0]
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(currentUser));
    return currentUser;
  }

  async function refreshAccessControlContext() {
    state.assignableUsers = [];
    state.riskUserAccess = [];

    if (!state.currentUser) return;

    try {
      const { data: accessData, error: accessError } = await supabase
        .from('risk_user_access')
        .select(`
          risk_id,
          user_id,
          can_view,
          can_upload,
          profiles!inner(id, email, display_name, role, is_active)
        `);

      if (accessError) {
        console.error('Failed to load risk access context:', accessError);
      } else {
        const accessRows = Array.isArray(accessData) ? accessData : [];
        state.riskUserAccess = accessRows.map((row) => ({
          riskId: row.risk_id,
          userId: row.user_id,
          canView: row.can_view !== false,
          canUpload: row.can_upload !== false,
          email: row.profiles?.email || '',
          displayName: row.profiles?.display_name || (row.profiles?.email || '').split('@')[0] || '',
          role: String(row.profiles?.role || '').toLowerCase(),
          isActive: row.profiles?.is_active !== false
        }));
      }

      const uniqueUsers = new Map();
      const addUserCandidate = (userId, email, displayName) => {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!userId || !normalizedEmail) return;
        if (uniqueUsers.has(normalizedEmail)) return;
        uniqueUsers.set(normalizedEmail, {
          userId,
          email: String(email || '').trim(),
          displayName: displayName || String(email || '').split('@')[0] || ''
        });
      };

      if (isManager()) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, display_name, role, is_active')
          .eq('role', 'user')
          .eq('is_active', true)
          .order('display_name', { ascending: true });

        if (profileError) {
          console.error('Failed to load assignable users from profiles:', profileError);
        } else {
          (Array.isArray(profileData) ? profileData : []).forEach((profile) => {
            addUserCandidate(profile.id, profile.email, profile.display_name);
          });
        }
      }

      state.riskUserAccess.forEach((row) => {
        if (row.isActive && row.role === 'user') {
          addUserCandidate(row.userId, row.email, row.displayName);
        }
      });

      state.assignableUsers = Array.from(uniqueUsers.values())
        .sort((a, b) => String(a.displayName || a.email).localeCompare(String(b.displayName || b.email)));
    } catch (error) {
      console.error('Unexpected access control context error:', error);
    }
  }

  function getAssignableUsers() {
    return Array.isArray(state.assignableUsers) ? state.assignableUsers : [];
  }

  function getRiskAccessEntries(riskId) {
    return (state.riskUserAccess || []).filter((item) => item.riskId === riskId);
  }

  function getAssignedUserForRisk(riskId) {
    const entries = getRiskAccessEntries(riskId);
    return entries.length ? entries[0] : null;
  }

  function findAssignableUserByEmail(email) {
    const target = String(email || '').trim().toLowerCase();
    if (!target) return null;
    return getAssignableUsers().find((item) => String(item.email || '').trim().toLowerCase() === target) || null;
  }

  function findAssignableUserByDisplayName(displayName) {
    const target = String(displayName || '').trim().toLowerCase();
    if (!target) return null;
    return getAssignableUsers().find((item) => String(item.displayName || '').trim().toLowerCase() === target) || null;
  }

  function inferAssignedUserEmailForRisk(riskId, ownerName = '', control = null) {
    if (control?.assignedUserEmail) return control.assignedUserEmail;
    const assigned = getAssignedUserForRisk(riskId);
    if (assigned?.email) return assigned.email;
    const matchedByName = findAssignableUserByDisplayName(ownerName);
    if (matchedByName?.email) return matchedByName.email;
    return getAssignableUsers()[0]?.email || '';
  }

  function getAssignedUserLabel(email, fallback = '') {
    const matched = findAssignableUserByEmail(email);
    if (matched) return matched.displayName || matched.email;
    return fallback || '';
  }

  async function syncRiskUserAccess(riskId, assignedUserId) {
    if (!riskId || !assignedUserId || !state.currentUser?.authId) return;

    const deleteResponse = await supabase
      .from('risk_user_access')
      .delete()
      .eq('risk_id', riskId)
      .neq('user_id', assignedUserId);

    if (deleteResponse.error) throw deleteResponse.error;

    const upsertResponse = await supabase
      .from('risk_user_access')
      .upsert({
        risk_id: riskId,
        user_id: assignedUserId,
        can_view: true,
        can_upload: true,
        created_by: state.currentUser.authId
      }, { onConflict: 'risk_id,user_id' });

    if (upsertResponse.error) throw upsertResponse.error;

    await refreshAccessControlContext();
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
      users: [],

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
        assignedUserId: row.assigned_user_id || '',
        assignedUserEmail: row.assigned_user_email || '',
        status: row.status || 'Open',
        effectiveFromDate: row.effective_from_date || '',
        closedAt: row.closed_at || '',
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
        year: Number(row.year),
        quarter: normalizeMonitoringQuarter(row.year, row.quarter),
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
        year: Number(row.year),
        quarter: normalizeMonitoringQuarter(row.year, row.quarter),
        targetMonth: row.target_month ? Number(row.target_month) : null,
        fileName: row.file_name,
        fileLink: row.file_link,
        storagePath: row.storage_path,
        description: row.description,
        uploadedBy: row.uploaded_by,
        uploadedAt: row.uploaded_at,
        isDeleted: row.is_deleted,
        createdAt: row.created_at,
        createdBy: row.created_by,
        updatedAt: row.updated_at,
        updatedBy: row.updated_by
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
      language: state.language || 'ko',
      monitoringYear: Number(state.monitoringYear || 2026),
      monitoringQuarter: Number(state.monitoringQuarter || 2),
      expandedFolderIds: Array.from(state.expanded || []),
      calendarFilters: {
        process: state.calendarFilters?.process || '',
        owner: state.calendarFilters?.owner || '',
        status: state.calendarFilters?.status || '',
        keyword: state.calendarFilters?.keyword || ''
      },
      calendarDetail: {
        month: Number(state.calendarDetail?.month || 0) || null,
        status: state.calendarDetail?.status || ''
      }
    };
    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify(payload));
  }


  function getMonitoringPeriodOptions() {
    const options = [];

    for (let year = 2026; year <= 2028; year += 1) {
      for (let quarter = 1; quarter <= 4; quarter += 1) {
        if (year === 2026 && quarter < 2) continue;

        options.push({
          value: `${year}|${quarter}`,
          label: isEnglish() ? `Q${quarter} FY${year}` : `FY${year} ${quarter}분기`
        });
      }
    }

    return options;
  }

  function getMonitoringPeriodLabel(year = state.monitoringYear, quarter = state.monitoringQuarter) {
    return isEnglish() ? `Q${quarter} FY${year}` : `FY${year} ${quarter}분기`;
  }

  function normalizeMonitoringQuarter(yearValue, quarterValue) {
    const year = Number(yearValue);
    const quarter = Number(quarterValue);

    if ([1, 2, 3, 4].includes(quarter)) {
      if (year === 2026 && quarter < 2) return 2;
      return quarter;
    }

    return year === 2026 ? 2 : 4;
  }

  function getMonitoringPeriodKey(yearValue = state.monitoringYear, quarterValue = state.monitoringQuarter) {
    return `${Number(yearValue)}Q${normalizeMonitoringQuarter(yearValue, quarterValue)}`;
  }

  function isSameMonitoringPeriod(target, yearValue = state.monitoringYear, quarterValue = state.monitoringQuarter) {
    if (!target) return false;
    const year = Number(yearValue);
    const quarter = normalizeMonitoringQuarter(yearValue, quarterValue);
    return Number(target.year) === year && normalizeMonitoringQuarter(target.year, target.quarter) === quarter;
  }

  function getQuarterDateRange(yearValue = state.monitoringYear, quarterValue = state.monitoringQuarter) {
    const year = Number(yearValue);
    const quarter = normalizeMonitoringQuarter(yearValue, quarterValue);

    const monthMap = {
      1: { start: 0, end: 2 },
      2: { start: 3, end: 5 },
      3: { start: 6, end: 8 },
      4: { start: 9, end: 11 }
    };

    const months = monthMap[quarter] || monthMap[4];
    const startDate = new Date(year, months.start, 1);
    const endDate = new Date(year, months.end + 1, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }


  function getQuarterMonths(quarterValue = state.monitoringQuarter) {
    const quarter = normalizeMonitoringQuarter(state.monitoringYear, quarterValue);
    const map = {
      1: [1, 2, 3],
      2: [4, 5, 6],
      3: [7, 8, 9],
      4: [10, 11, 12]
    };
    return map[quarter] ? [...map[quarter]] : [10, 11, 12];
  }

  function buildMonitoringMonthlySummary(evidenceFiles, months) {
    const summary = (months || []).reduce((acc, month) => {
      acc[month] = { uploaded: 0, exception: 0, files: [] };
      return acc;
    }, {});

    (evidenceFiles || []).forEach((file) => {
      const month = Number(file?.targetMonth || 0);
      if (!summary[month]) return;
      const isException = isExceptionEvidenceRow(file);
      if (isException) summary[month].exception += 1;
      else summary[month].uploaded += 1;
      summary[month].files.push(file);
    });

    return summary;
  }

  function getMonitoringMonthlyCellLabel(monthSummary) {
    const uploaded = Number(monthSummary?.uploaded || 0);
    const exception = Number(monthSummary?.exception || 0);
    if (!uploaded && !exception) return '-';
    return `${uploaded} / E${exception}`;
  }

  function parseControlDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(12, 0, 0, 0);
    return date;
  }

  function isControlEffectiveForPeriod(control, yearValue = state.monitoringYear, quarterValue = state.monitoringQuarter) {
    if (!control || control.isDeleted) return false;

    const { startDate, endDate } = getQuarterDateRange(yearValue, quarterValue);
    const effectiveFromDate = parseControlDate(control.effectiveFromDate);
    const closedAtDate = parseControlDate(control.closedAt);

    if (effectiveFromDate && effectiveFromDate > endDate) return false;
    if (closedAtDate && closedAtDate < startDate) return false;

    return true;
  }

  function getEffectiveControlsForPeriod(yearValue = state.monitoringYear, quarterValue = state.monitoringQuarter) {
    return getActiveControls().filter((control) => isControlEffectiveForPeriod(control, yearValue, quarterValue));
  }

  function getYearDateRange(yearValue = state.monitoringYear) {
    const year = Number(yearValue);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  }

  function isControlEffectiveForYear(control, yearValue = state.monitoringYear) {
    if (!control || control.isDeleted) return false;

    const { startDate, endDate } = getYearDateRange(yearValue);
    const effectiveFromDate = parseControlDate(control.effectiveFromDate);
    const closedAtDate = parseControlDate(control.closedAt);

    if (effectiveFromDate && effectiveFromDate > endDate) return false;
    if (closedAtDate && closedAtDate < startDate) return false;

    return true;
  }

  function controlMatchesCurrentUserAssignment(control) {
    if (!control) return false;
    if (isManager()) return true;

    const currentAuthId = String(state.currentUser?.authId || '');
    const currentEmail = String(state.currentUser?.email || '').trim().toLowerCase();

    if (currentAuthId && String(control.controlOwner || '') === currentAuthId) return true;
    if (currentAuthId && String(control.assignedUserId || '') === currentAuthId) return true;
    if (currentEmail && String(control.assignedUserEmail || '').trim().toLowerCase() === currentEmail) return true;

    const accessEntries = getRiskAccessEntries(control.riskId);
    return accessEntries.some((entry) => {
      const entryUserId = String(entry.userId || '');
      const entryEmail = String(entry.email || '').trim().toLowerCase();
      if (entry.canView === false) return false;
      return (currentAuthId && entryUserId === currentAuthId) || (currentEmail && entryEmail === currentEmail);
    });
  }

  function getCalendarControlsForYear(yearValue = state.monitoringYear) {
    return getActiveControls()
      .filter((control) => isControlEffectiveForYear(control, yearValue))
      .filter((control) => controlMatchesCurrentUserAssignment(control))
      .sort((a, b) => {
        const riskCompare = String(a.riskId || '').localeCompare(String(b.riskId || ''));
        if (riskCompare !== 0) return riskCompare;
        const controlCompare = String(a.controlCode || '').localeCompare(String(b.controlCode || ''));
        if (controlCompare !== 0) return controlCompare;
        return String(a.controlId || '').localeCompare(String(b.controlId || ''));
      });
  }

  function getControlCalendarMonthsForYear(control, yearValue = state.monitoringYear) {
    const year = Number(yearValue);
    const months = normalizeControlMonths(control?.controlMonths);
    if (!months.length) return [];

    const effectiveFromDate = parseControlDate(control?.effectiveFromDate);
    const closedAtDate = parseControlDate(control?.closedAt);

    return months.filter((month) => {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      monthStart.setHours(0, 0, 0, 0);
      monthEnd.setHours(23, 59, 59, 999);

      if (effectiveFromDate && effectiveFromDate > monthEnd) return false;
      if (closedAtDate && closedAtDate < monthStart) return false;
      return true;
    });
  }

  function getCalendarYearLabel(yearValue = state.monitoringYear) {
    return isEnglish() ? `FY${Number(yearValue)} Annual Control Calendar` : `FY${Number(yearValue)} 연간 통제 캘린더`;
  }

  function getCalendarYearOptions() {
    const years = Array.from(new Set(getMonitoringPeriodOptions().map((item) => Number(String(item.value).split('|')[0]))));
    return years.filter((year) => Number.isFinite(year)).sort((a, b) => a - b);
  }

  function getQuarterForMonth(monthValue) {
    const month = Number(monthValue);
    if (month >= 1 && month <= 3) return 1;
    if (month >= 4 && month <= 6) return 2;
    if (month >= 7 && month <= 9) return 3;
    return 4;
  }

  function isControlScheduledForPeriod(control, yearValue = state.monitoringYear, quarterValue = state.monitoringQuarter) {
    if (!isControlEffectiveForPeriod(control, yearValue, quarterValue)) return false;

    const quarter = normalizeMonitoringQuarter(yearValue, quarterValue);
    const scheduledMonths = getControlCalendarMonthsForYear(control, yearValue);
    if (!scheduledMonths.length) return false;

    return scheduledMonths.some((month) => getQuarterForMonth(month) === quarter);
  }

  function getMonitoringControlsForPeriod(yearValue = state.monitoringYear, quarterValue = state.monitoringQuarter) {
    return getActiveControls()
      .filter((control) => isControlScheduledForPeriod(control, yearValue, quarterValue))
      .filter((control) => controlMatchesCurrentUserAssignment(control))
      .sort((a, b) => {
        const riskCompare = String(a.riskId || '').localeCompare(String(b.riskId || ''));
        if (riskCompare !== 0) return riskCompare;
        const controlCompare = String(a.controlCode || '').localeCompare(String(b.controlCode || ''));
        if (controlCompare !== 0) return controlCompare;
        return String(a.controlId || '').localeCompare(String(b.controlId || ''));
      });
  }

  function inferEvidenceTargetMonth(control, record) {
    const selectedMonth = Number(state.calendarDetail?.month || 0);
    if (selectedMonth >= 1 && selectedMonth <= 12) {
      return selectedMonth;
    }

    const recordYear = Number(record?.year || state.monitoringYear || new Date().getFullYear());
    const recordQuarter = normalizeMonitoringQuarter(recordYear, record?.quarter || state.monitoringQuarter);
    const quarterMonths = normalizeControlMonths(control?.controlMonths).filter((month) => getQuarterForMonth(month) === recordQuarter);

    if (quarterMonths.length === 1) return quarterMonths[0];

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    if (quarterMonths.length > 1 && todayYear === recordYear && quarterMonths.includes(todayMonth)) {
      return todayMonth;
    }

    if (quarterMonths.length > 1) return quarterMonths[0];
    return getQuarterMonths(recordQuarter)[0] || null;
  }

  function getMonitoringRecordForControlPeriod(controlId, yearValue, quarterValue) {
    const year = Number(yearValue);
    const quarter = normalizeMonitoringQuarter(year, quarterValue);
    return (state.db.monitoring_records || []).find((record) =>
      !record.isDeleted &&
      Number(record.year) === year &&
      normalizeMonitoringQuarter(record.year, record.quarter) === quarter &&
      record.controlId === controlId
    ) || null;
  }

  function getEvidenceFilesForControlMonth(controlId, yearValue, monthValue) {
    const year = Number(yearValue);
    const month = Number(monthValue);
    const quarter = getQuarterForMonth(month);
    return (state.db.monitoring_evidence_files || [])
      .filter((file) =>
        !file.isDeleted &&
        file.controlId === controlId &&
        Number(file.year) === year &&
        normalizeMonitoringQuarter(file.year, file.quarter) === quarter &&
        Number(file.targetMonth || 0) === month
      )
      .sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
  }

  function getCalendarMonthStatus(control, yearValue, monthValue) {
    const month = Number(monthValue);
    const activeMonths = new Set(getControlCalendarMonthsForYear(control, yearValue));
    if (!activeMonths.has(month)) return 'inactive';

    const quarter = getQuarterForMonth(month);
    const record = getMonitoringRecordForControlPeriod(control.controlId, yearValue, quarter);
    const monthEvidenceFiles = getEvidenceFilesForControlMonth(control.controlId, yearValue, month);
    const monthResponseCount = monthEvidenceFiles.length;
    const reviewResult = String(record?.reviewResult || '').trim();
    const submissionStatus = String(record?.submissionStatus || '').trim();

    if (monthResponseCount > 0) {
      if (reviewResult === '적합' || reviewResult === 'Conforming') return 'fit';
      if (reviewResult === '미흡' || reviewResult === 'Needs Improvement') return 'gap';
      if (reviewResult === '부적합' || reviewResult === 'Nonconforming') return 'fail';
      if (submissionStatus === '제출완료' || submissionStatus === '검토완료' || submissionStatus === 'Submitted' || submissionStatus === 'Review Completed') return 'review-pending';
      return 'review-pending';
    }

    return 'submit-pending';
  }

  function getCalendarControlOverallStatus(control, yearValue) {
    const activeMonths = getControlCalendarMonthsForYear(control, yearValue);
    if (!activeMonths.length) return 'inactive';

    const priorities = ['fail', 'gap', 'review-pending', 'submit-pending', 'fit'];
    const statuses = new Set(activeMonths.map((month) => getCalendarMonthStatus(control, yearValue, month)));
    return priorities.find((status) => statuses.has(status)) || 'inactive';
  }

  function getCalendarStatusLabel(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'fit') return t('fit');
    if (normalized === 'gap') return t('gap');
    if (normalized === 'fail') return t('fail');
    if (normalized === 'review-pending') return t('pendingReview');
    if (normalized === 'submit-pending') return t('submissionPending');
    return '-';
  }

  function getCalendarStatusShortLabel(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'fit') return isEnglish() ? 'OK' : t('fit');
    if (normalized === 'gap') return isEnglish() ? 'NI' : t('gap');
    if (normalized === 'fail') return isEnglish() ? 'NC' : t('fail');
    if (normalized === 'review-pending') return isEnglish() ? 'REV' : '검토';
    if (normalized === 'submit-pending') return isEnglish() ? 'SUB' : '제출';
    return '-';
  }

  function getCalendarProcessOptions(yearValue = state.monitoringYear) {
    return Array.from(new Set(
      getCalendarControlsForYear(yearValue)
        .map((control) => getRiskById(control.riskId)?.departmentName || '')
        .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b));
  }

  function getCalendarOwnerOptions(yearValue = state.monitoringYear) {
    return Array.from(new Set(
      getCalendarControlsForYear(yearValue)
        .map((control) => control.controlOwnerName || '')
        .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b));
  }

  function getFilteredCalendarControlsForYear(yearValue = state.monitoringYear) {
    const filters = state.calendarFilters || {};
    const processFilter = String(filters.process || '').trim().toLowerCase();
    const ownerFilter = String(filters.owner || '').trim().toLowerCase();
    const statusFilter = String(filters.status || '').trim().toLowerCase();
    const keywordFilter = String(filters.keyword || '').trim().toLowerCase();

    return getCalendarControlsForYear(yearValue).filter((control) => {
      const risk = getRiskById(control.riskId);
      const processName = String(risk?.departmentName || '').trim().toLowerCase();
      const ownerName = String(control.controlOwnerName || '').trim().toLowerCase();
      const overallStatus = getCalendarControlOverallStatus(control, yearValue);
      const haystack = [
        risk?.riskId || control.riskId || '',
        control.controlCode || control.controlId || '',
        control.controlName || control.controlTitle || '',
        control.controlOwnerName || '',
        risk?.departmentName || ''
      ].join(' ').toLowerCase();

      if (processFilter && processName !== processFilter) return false;
      if (ownerFilter && ownerName !== ownerFilter) return false;
      if (statusFilter && overallStatus !== statusFilter) return false;
      if (keywordFilter && !haystack.includes(keywordFilter)) return false;
      return true;
    });
  }


  function buildCalendarYearSummary(yearValue = state.monitoringYear) {
    const summary = {
      total: 0,
      submitPending: 0,
      reviewPending: 0,
      fit: 0,
      gap: 0,
      fail: 0
    };

    getFilteredCalendarControlsForYear(yearValue).forEach((control) => {
      const activeMonths = getControlCalendarMonthsForYear(control, yearValue);
      activeMonths.forEach((month) => {
        const status = getCalendarMonthStatus(control, yearValue, month);
        if (status === 'inactive') return;
        summary.total += 1;
        if (status === 'submit-pending') summary.submitPending += 1;
        if (status === 'review-pending') summary.reviewPending += 1;
        if (status === 'fit') summary.fit += 1;
        if (status === 'gap') summary.gap += 1;
        if (status === 'fail') summary.fail += 1;
      });
    });

    return summary;
  }

  function getCalendarMonthDetailRows(yearValue = state.monitoringYear, monthValue = state.calendarDetail?.month, statusFilterValue = state.calendarDetail?.status || '') {
    const month = Number(monthValue || 0);
    if (!(month >= 1 && month <= 12)) return [];

    return getFilteredCalendarControlsForYear(yearValue)
      .map((control) => {
        const monthStatus = getCalendarMonthStatus(control, yearValue, month);
        if (monthStatus === 'inactive') return null;
        if (statusFilterValue && monthStatus !== statusFilterValue) return null;

        const risk = getRiskById(control.riskId);
        const quarter = getQuarterForMonth(month);
        const record = getMonitoringRecordForControlPeriod(control.controlId, yearValue, quarter);
        const evidenceFiles = getEvidenceFilesForControlMonth(control.controlId, yearValue, month);
        const requiredSampleCount = getRequiredSampleCount(
          risk?.inherentRating || '',
          control.controlOperationType || control.controlType || '',
          control.controlFrequency || ''
        );
        const latestUploadedAt = evidenceFiles.length
          ? evidenceFiles.reduce((latest, file) => {
              const current = new Date(file.uploadedAt || 0).getTime();
              const latestValue = new Date(latest || 0).getTime();
              return current > latestValue ? (file.uploadedAt || '') : latest;
            }, '')
          : '';

        return {
          month,
          monthStatus,
          riskId: risk?.riskId || control.riskId || '',
          controlCode: control.controlCode || control.controlId || '',
          controlName: control.controlName || control.controlTitle || '',
          controlOwnerName: control.controlOwnerName || '',
          controlFrequency: control.controlFrequency || '',
          requiredSampleCount,
          submittedSampleCount: evidenceFiles.length,
          uploadedAt: latestUploadedAt || record?.uploadedAt || ''
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const riskCompare = String(a.riskId || '').localeCompare(String(b.riskId || ''));
        if (riskCompare !== 0) return riskCompare;
        return String(a.controlCode || '').localeCompare(String(b.controlCode || ''));
      });
  }

  function renderCalendarSummaryCards(yearValue = state.monitoringYear) {
    const summary = buildCalendarYearSummary(yearValue);
    return `
      <div class="calendar-summary-grid">
        <article class="stat-card calendar-summary-card">
          <span class="stat-label">${escapeHtml(t('monthCount'))}</span>
          <strong>${summary.total}</strong>
        </article>
        <article class="stat-card calendar-summary-card status-submit">
          <span class="stat-label">${escapeHtml(t('submissionPending'))}</span>
          <strong>${summary.submitPending}</strong>
        </article>
        <article class="stat-card calendar-summary-card status-review">
          <span class="stat-label">${escapeHtml(t('pendingReview'))}</span>
          <strong>${summary.reviewPending}</strong>
        </article>
        <article class="stat-card calendar-summary-card status-fit">
          <span class="stat-label">${escapeHtml(t('fit'))}</span>
          <strong>${summary.fit}</strong>
        </article>
        <article class="stat-card calendar-summary-card status-gap">
          <span class="stat-label">${escapeHtml(t('gap'))}</span>
          <strong>${summary.gap}</strong>
        </article>
        <article class="stat-card calendar-summary-card status-fail">
          <span class="stat-label">${escapeHtml(t('fail'))}</span>
          <strong>${summary.fail}</strong>
        </article>
      </div>
    `;
  }

  function renderCalendarDetailPanel(yearValue = state.monitoringYear) {
    const selectedMonth = Number(state.calendarDetail?.month || 0);
    if (!(selectedMonth >= 1 && selectedMonth <= 12)) {
      return `
        <section class="table-card calendar-detail-panel">
          <div class="table-meta">
            <div>${escapeHtml(t('monthDetail'))}</div>
            <div class="status-text">${escapeHtml(t('noDetailPrompt'))}</div>
          </div>
          <div class="empty-state">${escapeHtml(t('noDetailPrompt'))}</div>
        </section>
      `;
    }

    const detailRows = getCalendarMonthDetailRows(yearValue, selectedMonth, state.calendarDetail?.status || '');
    const statusLabel = state.calendarDetail?.status ? getCalendarStatusLabel(state.calendarDetail.status) : t('full');

    return `
      <section class="table-card calendar-detail-panel">
        <div class="table-meta">
          <div>${escapeHtml(t('monthDetailTitle', { year: yearValue, month: selectedMonth }))}</div>
          <div class="status-text">${statusLabel} · ${escapeHtml(t('countSuffix', { count: detailRows.length }))}</div>
        </div>
        <div class="calendar-detail-actions">
          <button id="calendarDetailResetBtn" class="ghost-btn">${escapeHtml(t('detailReset'))}</button>
        </div>
        <div class="control-calendar-wrap">
          <table class="control-calendar-table calendar-detail-table">
            <thead>
              <tr>
                <th>Risk Code</th>
                <th>Control Code</th>
                <th>${escapeHtml(t('controlName'))}</th>
                <th>${escapeHtml(t('owner'))}</th>
                <th>${escapeHtml(t('controlFrequency'))}</th>
                <th>${escapeHtml(t('status'))}</th>
                <th>${escapeHtml(t('submittedSampleSize'))}</th>
                <th>${escapeHtml(t('requiredSampleSize'))}</th>
                <th>${escapeHtml(t('uploadDate'))}</th>
              </tr>
            </thead>
            <tbody>
              ${detailRows.length ? detailRows.map((row) => `
                <tr>
                  <td class="mono">${escapeHtml(row.riskId || '')}</td>
                  <td class="mono">${escapeHtml(row.controlCode || '')}</td>
                  <td>${escapeHtml(row.controlName || '')}</td>
                  <td>${escapeHtml(row.controlOwnerName || '')}</td>
                  <td>${escapeHtml(getFrequencyDisplayLabel(row.controlFrequency || '')) || '-'}</td>
                  <td><span class="calendar-status-chip ${row.monthStatus}">${escapeHtml(getCalendarStatusLabel(row.monthStatus))}</span></td>
                  <td class="center-cell">${row.submittedSampleCount || 0}</td>
                  <td class="center-cell">${row.requiredSampleCount || 0}</td>
                  <td>${escapeHtml(row.uploadedAt ? formatDate(row.uploadedAt) : '-')}</td>
                </tr>
              `).join('') : `
                <tr><td colspan="9" class="empty-state">${escapeHtml(t('noMonthlyDetailRows'))}</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }


  function renderDashboardCalendarSection(yearValue = state.monitoringYear) {
    const controls = getFilteredCalendarControlsForYear(yearValue);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const processOptions = getCalendarProcessOptions(yearValue);
    const ownerOptions = getCalendarOwnerOptions(yearValue);

    return `
      <section class="table-card control-calendar-section">
        ${renderCalendarSummaryCards(yearValue)}

        <div class="calendar-filter-bar">
          <div class="calendar-filter-grid">
            <div class="field-group">
              <label>${escapeHtml(t('process'))}</label>
              <select id="calendarProcessFilter" class="field-select">
                <option value="">${escapeHtml(t('full'))}</option>
                ${processOptions.map((item) => `<option value="${escapeHtml(item)}" ${state.calendarFilters.process === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}
              </select>
            </div>
            <div class="field-group">
              <label>${escapeHtml(t('owner'))}</label>
              <select id="calendarOwnerFilter" class="field-select">
                <option value="">${escapeHtml(t('full'))}</option>
                ${ownerOptions.map((item) => `<option value="${escapeHtml(item)}" ${state.calendarFilters.owner === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}
              </select>
            </div>
            <div class="field-group">
              <label>${escapeHtml(t('status'))}</label>
              <select id="calendarStatusFilter" class="field-select">
                <option value="">${escapeHtml(t('full'))}</option>
                <option value="submit-pending" ${state.calendarFilters.status === 'submit-pending' ? 'selected' : ''}>${escapeHtml(t('submissionPending'))}</option>
                <option value="review-pending" ${state.calendarFilters.status === 'review-pending' ? 'selected' : ''}>${escapeHtml(t('pendingReview'))}</option>
                <option value="fit" ${state.calendarFilters.status === 'fit' ? 'selected' : ''}>${escapeHtml(t('fit'))}</option>
                <option value="gap" ${state.calendarFilters.status === 'gap' ? 'selected' : ''}>${escapeHtml(t('gap'))}</option>
                <option value="fail" ${state.calendarFilters.status === 'fail' ? 'selected' : ''}>${escapeHtml(t('fail'))}</option>
              </select>
            </div>
            <div class="field-group">
              <label>${escapeHtml(t('search'))}</label>
              <input id="calendarKeywordFilter" class="field-input" placeholder="${escapeHtml(isEnglish() ? 'Search risk / control / owner' : t('searchMonitoring'))}" value="${escapeHtml(state.calendarFilters.keyword || '')}" />
            </div>
          </div>
          <div class="calendar-filter-actions">
            <button id="calendarFilterResetBtn" class="ghost-btn">${escapeHtml(t('resetFilter'))}</button>
          </div>
        </div>

        <div class="calendar-legend">
          <span><i class="legend-dot submit-pending"></i> ${escapeHtml(t('submissionPending'))}</span>
          <span><i class="legend-dot review-pending"></i> ${escapeHtml(t('pendingReview'))}</span>
          <span><i class="legend-dot fit"></i> ${escapeHtml(t('fit'))}</span>
          <span><i class="legend-dot gap"></i> ${escapeHtml(t('gap'))}</span>
          <span><i class="legend-dot fail"></i> ${escapeHtml(t('fail'))}</span>
          <span><i class="legend-dot inactive"></i> ${escapeHtml(t('inactiveMonth'))}</span>
        </div>

        <div class="control-calendar-wrap" style="overflow-x:visible;">
          <table class="control-calendar-table" style="width:100%; table-layout:fixed; font-size:11px;">
            <colgroup>
              <col style="width:68px;">
              <col style="width:72px;">
              <col style="width:130px;">
              <col style="width:74px;">
              <col style="width:78px;">
              <col style="width:82px;">
              ${months.map(() => '<col style="width:32px;">').join('')}
            </colgroup>
            <thead>
              <tr>
                <th style="padding:6px 3px; font-size:11px; line-height:1.15;">Risk Code</th>
                <th style="padding:6px 3px; font-size:11px; line-height:1.15;">Control Code</th>
                <th style="padding:6px 4px; font-size:11px; line-height:1.15;">${escapeHtml(t('controlName'))}</th>
                <th style="padding:6px 4px; font-size:11px; line-height:1.15;">${escapeHtml(t('owner'))}</th>
                <th style="padding:6px 3px; font-size:11px; line-height:1.15;">${escapeHtml(t('controlFrequency'))}</th>
                <th style="padding:6px 3px; font-size:11px; line-height:1.15;">${escapeHtml(t('overallStatus'))}</th>
                ${months.map((month) => `<th class="month-col" style="width:32px; min-width:32px; padding:6px 1px; white-space:nowrap; font-size:11px;">${escapeHtml(getMonthShortLabel(month))}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${controls.length ? controls.map((control) => {
                const risk = getRiskById(control.riskId);
                const overallStatus = getCalendarControlOverallStatus(control, yearValue);
                return `
                  <tr>
                    <td class="mono" style="padding:6px 3px; font-size:11px; line-height:1.2; word-break:break-all;">${escapeHtml(getDisplayRiskCode(risk?.riskId || control.riskId || ''))}</td>
                    <td class="mono" style="padding:6px 3px; font-size:11px; line-height:1.2; word-break:break-all;">${escapeHtml(control.controlCode || control.controlId || '')}</td>
                    <td style="padding:6px 4px; font-size:11px; line-height:1.3; white-space:normal; word-break:break-word;">${escapeHtml(control.controlName || control.controlTitle || '')}</td>
                    <td style="padding:6px 4px; font-size:11px; line-height:1.3; white-space:normal; word-break:break-word;">${escapeHtml(control.controlOwnerName || '')}</td>
                    <td style="padding:6px 3px; font-size:11px; line-height:1.2; white-space:normal; word-break:break-word;">${escapeHtml(getFrequencyDisplayLabel(control.controlFrequency || '')) || '-'}</td>
                    <td style="padding:6px 3px; font-size:11px; line-height:1.2;"><span class="calendar-status-chip ${overallStatus}" style="padding:4px 6px; font-size:10px; line-height:1.15;">${escapeHtml(getCalendarStatusLabel(overallStatus))}</span></td>
                    ${months.map((month) => {
                      const monthStatus = getCalendarMonthStatus(control, yearValue, month);
                      const isSelected = Number(state.calendarDetail?.month || 0) === month && String(state.calendarDetail?.status || '') === monthStatus;
                      return `
                        <td class="month-cell ${monthStatus} ${isSelected ? 'selected' : ''}" style="padding:4px 1px;">
                          ${monthStatus === 'inactive'
                            ? '<span class="month-dash" style="font-size:10px;">-</span>'
                            : `<button type="button" class="month-pill ${monthStatus}" data-calendar-month-btn="1" data-month="${month}" data-status="${monthStatus}" title="${escapeHtml(t('monthDetailTooltip', { month: getMonthShortLabel(month), status: getCalendarStatusLabel(monthStatus) }))}" style="min-width:24px; padding:3px 0; font-size:10px; line-height:1;">${escapeHtml(getCalendarStatusShortLabel(monthStatus))}</button>`}
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="18" class="empty-state">${escapeHtml(t('noControlsMatch'))}</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
        <div class="footer-note">
          ${escapeHtml(t('footerCalendar'))}
        </div>
      </section>
    `;
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
      assignedUserId: control.assignedUserId || '',
      assignedUserEmail: control.assignedUserEmail || '',
      status: control.status || 'Open',
      effectiveFromDate: control.effectiveFromDate || '',
      closedAt: control.closedAt || '',
      controlOperationType: control.controlOperationType || 'Manual',
      controlMonths: normalizeControlMonths(control.controlMonths)
    }));
    state.db.change_logs = state.db.change_logs || [];
    state.db.monitoring_records = (state.db.monitoring_records || []).map((record) => ({
      ...record,
      year: Number(record.year),
      quarter: normalizeMonitoringQuarter(record.year, record.quarter),
      controlId: record.controlId || record.control_id || '',
      riskId: record.riskId || record.risk_id || ''
    }));
    state.db.monitoring_evidence_files = (state.db.monitoring_evidence_files || []).map((file) => ({
      ...file,
      year: Number(file.year),
      quarter: normalizeMonitoringQuarter(file.year, file.quarter),
      targetMonth: Number(file.targetMonth || file.target_month || 0) || null,
      recordId: file.recordId || file.record_id || '',
      controlId: file.controlId || file.control_id || '',
      riskId: file.riskId || file.risk_id || '',
      createdAt: file.createdAt || file.created_at || file.uploadedAt || file.uploaded_at || '',
      createdBy: file.createdBy || file.created_by || file.uploadedBy || file.uploaded_by || '',
      updatedAt: file.updatedAt || file.updated_at || file.uploadedAt || file.uploaded_at || '',
      updatedBy: file.updatedBy || file.updated_by || file.uploadedBy || file.uploaded_by || ''
    }));
  }

  function renderLoading() {
    document.getElementById('app').innerHTML = `
      <div class="loading-screen">
        <div class="loading-card">${escapeHtml(t('loadingData'))}</div>
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
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:8px;">
            <div style="display:flex; flex-direction:column; align-items:flex-start; gap:10px; min-width:0;">
              <img src="${LOGIN_LOGO_SRC}" alt="HL Mando" style="height:34px; width:auto; display:block;" />
              <h1 style="margin:0; white-space:nowrap;">${escapeHtml(t('loginTitle'))}</h1>
            </div>
            <div style="display:flex; gap:6px; flex-shrink:0;">
              <button type="button" class="ghost-btn ${getLang()==='ko' ? 'active' : ''}" style="${getLang()==='ko' ? 'background:#2563eb;color:#fff;border-color:#2563eb;' : ''}" onclick="window.__icmSetLanguage('ko')">한국어</button>
              <button type="button" class="ghost-btn ${getLang()==='en' ? 'active' : ''}" style="${getLang()==='en' ? 'background:#2563eb;color:#fff;border-color:#2563eb;' : ''}" onclick="window.__icmSetLanguage('en')">English</button>
            </div>
          </div>
          <p>${escapeHtml(t('loginDesc'))}</p>

          <div class="field">
            <label>${escapeHtml(t('email'))}</label>
            <input id="loginId" type="email" placeholder="${escapeHtml(t('emailPlaceholder'))}" autocomplete="username" />
          </div>
          <div class="field">
            <label>${escapeHtml(t('password'))}</label>
            <input id="loginPw" type="password" placeholder="${escapeHtml(t('passwordPlaceholder'))}" autocomplete="current-password" />
          </div>

          <div class="login-actions">
            <button id="loginBtn" class="primary-btn">${escapeHtml(t('loginBtn'))}</button>
          </div>

          <div class="note-box">
            ${escapeHtml(t('loginNote1'))}<br>
            ${escapeHtml(t('loginNote2'))} <strong>profiles.role</strong> ${escapeHtml(t('roleValueSuffix'))}
          </div>
        </div>
      </div>
    `;

    document.getElementById('loginBtn').addEventListener('click', () => {
      handleLogin();
    });
    document.getElementById('loginPw').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  async function handleLogin() {
    const email = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPw').value.trim();

    if (!email || !password) {
      alert(t('loginAlertMissing'));
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login failed:', error);
      alert(t('loginAlertInvalid'));
      return;
    }

    const currentUser = await buildCurrentUserFromSession(data?.session || null);
    if (!currentUser) {
      alert(t('loginAlertProfile'));
      return;
    }

    state.currentUser = currentUser;
    render();
  }

  function renderAppPage() {
    const selectedFolder = getFolderById(state.selectedFolderId);

    document.getElementById('app').innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div>
              <h2>${escapeHtml(t('portalMenu'))}</h2>
              <p>${escapeHtml(t('portalMenuDesc'))}</p>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" class="ghost-btn ${getLang()==='ko' ? 'active' : ''}" style="${getLang()==='ko' ? 'background:#2563eb;color:#fff;border-color:#2563eb;' : ''}" onclick="window.__icmSetLanguage('ko')">한국어</button>
              <button type="button" class="ghost-btn ${getLang()==='en' ? 'active' : ''}" style="${getLang()==='en' ? 'background:#2563eb;color:#fff;border-color:#2563eb;' : ''}" onclick="window.__icmSetLanguage('en')">English</button>
            </div>
          </div>

          <div class="sidebar-tools">
            <input id="treeSearchInput" type="text" placeholder="${escapeHtml(t('searchFolderRisk'))}" value="${escapeHtml(state.treeSearch)}" />
            <div>${renderSidebarSelectionChip(selectedFolder)}</div>
          </div>

          ${state.currentModule === 'rcm' ? `
            <div class="folder-action-panel">
              <div class="folder-action-title">${escapeHtml(t('folderActions'))}</div>
              <div class="folder-action-row">
                <button id="addRootFolderBtn" class="ghost-btn ${canManageRcm() ? '' : 'viewer-readonly'}">${escapeHtml(t('addRootFolder'))}</button>
                <button id="addChildFolderBtn" class="ghost-btn ${canManageRcm() ? '' : 'viewer-readonly'}">${escapeHtml(t('addChildFolder'))}</button>
              </div>
              <div class="folder-action-row">
                <button id="deleteSelectedFolderBtn" class="danger-btn ${canManageRcm() ? '' : 'viewer-readonly'}">${escapeHtml(t('deleteSelectedFolder'))}</button>
              </div>
              <div class="folder-summary">
                ${renderSelectedFolderSummary(selectedFolder)}
              </div>
            </div>
          ` : ''}

          <div class="module-nav">
            <button type="button" class="module-btn ${state.currentModule === 'rcm' ? 'active' : ''}" data-module="rcm" onclick="window.__icmGoModule('rcm')">RCM Master</button>
            <div id="treeRoot" class="tree-root tree-under-rcm ${state.currentModule === 'rcm' ? '' : 'hidden'}"></div>

            <button type="button" class="module-btn ${state.currentModule === 'monitoring' ? 'active' : ''}" data-module="monitoring" onclick="window.__icmGoModule('monitoring')">${escapeHtml(t('monitoring'))}</button>
            <div class="module-subnav">
              <label class="year-select-label" for="monitoringPeriodSelect">${escapeHtml(t('periodSelect'))}</label>
              <select id="monitoringPeriodSelect" class="year-select" autocomplete="off" onchange="window.__icmSetMonitoringPeriod(this.value)">
                ${getMonitoringPeriodOptions().map((item) => `
                  <option value="${item.value}" ${Number(state.monitoringYear) === Number(item.value.split('|')[0]) && Number(state.monitoringQuarter) === Number(item.value.split('|')[1]) ? 'selected' : ''}>
                    ${item.label}
                  </option>
                `).join('')}
              </select>
            </div>

            <button type="button" class="module-btn ${state.currentModule === 'dashboard' ? 'active' : ''}" data-module="dashboard" onclick="window.__icmGoModule('dashboard')">${escapeHtml(t('dashboard'))}</button>
            <button type="button" class="module-btn ${state.currentModule === 'calendar' ? 'active' : ''}" data-module="calendar" onclick="window.__icmGoModule('calendar')">${escapeHtml(t('calendar'))}</button>
            <div class="module-subnav ${state.currentModule === 'calendar' ? '' : 'hidden'}">
              <label class="year-select-label" for="calendarYearSelect">${escapeHtml(t('yearSelect'))}</label>
              <select id="calendarYearSelect" class="year-select" autocomplete="off" onchange="window.__icmSetCalendarYear(this.value)">
                ${getCalendarYearOptions().map((year) => `
                  <option value="${year}" ${Number(state.monitoringYear) === Number(year) ? 'selected' : ''}>FY${year}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="sidebar-note">
            ${escapeHtml(t('currentLogin'))}: <strong>${escapeHtml(state.currentUser.displayName)}</strong><br />
            ${escapeHtml(t('role'))}: <strong>${getRoleDescription()}</strong><br /><br />
            ${state.currentModule === 'rcm'
              ? t('rcmNote')
              : state.currentModule === 'monitoring'
                ? t('monitoringNote')
                : state.currentModule === 'calendar'
                  ? t('calendarNote')
                  : t('dashboardNote')}
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
    bindMonitoringEvents();
    bindHeatmapEvents();
  }

  function renderSidebarSelectionChip(selectedFolder) {
    if (state.currentModule === 'monitoring') {
      return `<span class="selection-chip">${escapeHtml(t('monitoringPeriodChip'))}: ${escapeHtml(getMonitoringPeriodLabel())}</span>`;
    }

    if (state.currentModule === 'calendar') {
      return `<span class="selection-chip">${escapeHtml(t('calendarYearChip'))}: ${escapeHtml(`FY${Number(state.monitoringYear)}`)}</span>`;
    }

    if (state.currentModule === 'rcm' && state.heatmapFilter) {
      return `<span class="selection-chip">${escapeHtml(t('heatmapFilter'))}: ${escapeHtml(getHeatmapFilterLabel(state.heatmapFilter))}</span>`;
    }

    if (state.selectedRiskId) {
      return `<span class="selection-chip">${escapeHtml(t('selectedRisk'))}: ${escapeHtml(state.selectedRiskId)}</span>`;
    }

    if (selectedFolder) {
      return `<span class="selection-chip">${escapeHtml(t('selectedFolder'))}: ${escapeHtml(selectedFolder.folderName)}</span>`;
    }

    return `<span class="selection-chip">${escapeHtml(t('noFolderSelected'))}</span>`;
  }

  function renderSelectedFolderSummary(selectedFolder) {
    if (!selectedFolder) return `<div class="folder-summary-empty">${escapeHtml(t('noFolderSummary'))}</div>`;
    const childFolders = getChildrenFolders(selectedFolder.folderId).length;
    const descendantIds = getDescendantFolderIds(selectedFolder.folderId);
    const visibleRisks = getVisibleRisks().filter((risk) => descendantIds.includes(risk.folderId));
    const visibleRiskIds = new Set(visibleRisks.map((risk) => risk.riskId));
    const controls = getActiveControls().filter((control) => visibleRiskIds.has(control.riskId));
    return `
      <div class="folder-summary-path">${escapeHtml(buildFolderPath(selectedFolder.folderId).join(' > '))}</div>
      <div class="folder-summary-stats">${escapeHtml(t('childFolders'))} <strong>${childFolders}</strong> · ${escapeHtml(t('risk'))} <strong>${visibleRisks.length}</strong> · ${escapeHtml(t('control'))} <strong>${controls.length}</strong></div>
      <div class="folder-summary-help">${escapeHtml(t('folderDeleteHelp'))}</div>
    `;
  }

  function renderMainContent(selectedFolder) {
    if (state.currentModule === 'monitoring') return renderMonitoringContent();
    if (state.currentModule === 'dashboard') return renderDashboardContent();
    if (state.currentModule === 'calendar') return renderCalendarContent();
    return renderRCMContent(selectedFolder);
  }

  function renderRCMContent(selectedFolder) {
    return `
      <section class="hero">
        <div>
          <h2>${escapeHtml(t('riskControlMatrix'))}</h2>
          <p>${escapeHtml(t('rcmHeroDesc'))}</p>
        </div>
        <div class="hero-tools">
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">${isManager() ? (state.isEditMode ? t('editModeEnabled') : t('viewOnly')) : t('viewOnly')}</span>
          <input id="searchInput" type="text" placeholder="${escapeHtml(t('searchRcm'))}" value="${escapeHtml(state.search)}" />
                    <button id="logoutBtn" class="ghost-btn">${escapeHtml(t('logout'))}</button>
        </div>
      </section>

      <section class="toolbar">
        <div class="toolbar-left">
          ${isManager() ? `<button id="editModeBtn" class="${state.isEditMode ? 'primary-btn' : 'ghost-btn'}">${state.isEditMode ? t('editDone') : t('edit')}</button>` : ''}
          <button id="addRiskBtn" class="primary-btn ${canManageRcm() ? '' : 'viewer-readonly'}">${escapeHtml(t('addRisk'))}</button>
          <button id="moveRiskBtn" class="ghost-btn ${canManageRcm() && state.selectedRiskId ? '' : 'viewer-readonly'}">${escapeHtml(t('moveSelectedRisk'))}</button>
          <button id="saveBtn" class="ghost-btn ${canManageRcm() ? '' : 'viewer-readonly'}">${escapeHtml(t('save'))}</button>
                    ${state.heatmapFilter ? `<button id="clearHeatmapFilterBtn" class="ghost-btn">${escapeHtml(t('clearHeatmapFilterBtn'))}</button>` : ''}
        </div>
        <div class="toolbar-right">
          <span class="export-chip">Power BI / KNIME Ready</span>
          <button id="downloadJsonBtn" class="ghost-btn">${escapeHtml(t('downloadJson'))}</button>
                    <button id="downloadExcelBtn" class="primary-btn">${escapeHtml(t('downloadExcel'))}</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('visibleRisks'))}</span><strong>${getVisibleRisks().length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('visibleControls'))}</span><strong>${getVisibleControls().length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('rowsInRcm'))}</span><strong>${getVisibleRCMRows().length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('mediumHigh'))}</span><strong>${getVisibleRisks().filter(r => ['Medium','High'].includes(r.residualRating)).length}</strong></article>
      </section>

      <section class="table-card">
        <div class="table-meta">
          <div id="currentFilter">${renderCurrentFilterLabel(selectedFolder)}</div>
          <div id="statusText" class="status-text">${state.isDirty ? t('changesPending') : t('ready')}</div>
        </div>
        <div class="table-wrap">
          <table id="riskTable">
            <thead></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="footer-note">
          ${escapeHtml(t('localStorageNote'))}
        </div>
      </section>
    `;
  }

  function renderCurrentFilterLabel(selectedFolder) {
    if (state.heatmapFilter) {
      return getHeatmapFilterLabel(state.heatmapFilter);
    }
    if (state.selectedRiskId) return `Risk: ${escapeHtml(state.selectedRiskId)}`;
    if (selectedFolder) return `${escapeHtml(buildFolderPath(selectedFolder.folderId).join(' > '))}`;
    return t('allView');
  }

  function renderMonitoringContent() {
    ensureMonitoringRecordsForPeriod(state.monitoringYear, state.monitoringQuarter);
    const rows = getMonitoringRows();
    const quarterMonths = getQuarterMonths(state.monitoringQuarter);
    const hasResponse = (row) => Number(row.submittedSampleCount || 0) > 0 || Number(row.quarterExceptionCount || 0) > 0;
    return `
      <section class="hero">
        <div>
          <h2>${escapeHtml(t('monitoring'))}</h2>
          <p>${escapeHtml(t('monitoringHeroDesc', { period: getMonitoringPeriodLabel() }))}</p>
        </div>
        <div class="hero-tools">
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">${isManager() ? t('managerReview') : t('userSubmission')}</span>
          <input id="searchInput" type="text" placeholder="${escapeHtml(t('searchMonitoring'))}" value="${escapeHtml(state.search)}" />
                    <button id="logoutBtn" class="ghost-btn">${escapeHtml(t('logout'))}</button>
        </div>
      </section>

      <section class="toolbar">
        <div class="toolbar-left">
          ${isManager() ? `<button id="editModeBtn" class="${state.isEditMode ? 'primary-btn' : 'ghost-btn'}">${state.isEditMode ? t('reviewDone') : t('reviewStart')}</button>` : ''}
          ${isManager() ? `<button id="saveBtn" class="ghost-btn ${canSaveMonitoringReview() ? '' : 'viewer-readonly'}">${escapeHtml(t('save'))}</button>` : ''}
        </div>
        <div class="toolbar-right">
          <span class="export-chip">${escapeHtml(t('periodMonitoring', { period: getMonitoringPeriodLabel() }))}</span>
          <button id="downloadJsonBtn" class="ghost-btn">${escapeHtml(t('downloadJson'))}</button>
                    <button id="downloadExcelBtn" class="primary-btn">${escapeHtml(t('downloadExcel'))}</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('monitoringRows'))}</span><strong>${rows.length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('uploaded'))}</span><strong>${rows.filter(hasResponse).length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('fit'))} / ${escapeHtml(t('gap'))} / ${escapeHtml(t('fail'))}</span><strong>${rows.filter(r => ['적합','Conforming'].includes(r.reviewResult)).length} / ${rows.filter(r => ['미흡','Needs Improvement'].includes(r.reviewResult)).length} / ${rows.filter(r => ['부적합','Nonconforming'].includes(r.reviewResult)).length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('pendingReview'))}</span><strong>${rows.filter(r => hasResponse(r) && !r.reviewResult).length}</strong></article>
      </section>

      <section class="table-card">
        <div class="table-meta">
          <div>${escapeHtml(t('periodMonitoring', { period: getMonitoringPeriodLabel() }))}</div>
          <div id="statusText" class="status-text">${state.isDirty ? t('changesPending') : t('ready')}</div>
        </div>
        <div class="table-wrap">
          <table id="monitoringTable">
            <thead>
              <tr>
                <th>${escapeHtml(t('periodLabel'))}</th>
                <th>${escapeHtml(t('department'))}</th>
                <th>Risk Code</th>
                <th>Control Code</th>
                <th>${escapeHtml(t('controlName'))}</th>
                <th>${escapeHtml(t('controlDepartment'))}</th>
                <th>${escapeHtml(t('owner'))}</th>
                ${quarterMonths.map((month) => `<th>${escapeHtml(getMonthShortLabel(month))}</th>`).join('')}
                <th>${escapeHtml(t('submittedSampleSize'))}</th>
                <th>Exception</th>
                <th>${escapeHtml(t('requiredSampleSize'))}</th>
                <th>
  <div class="th-help-wrap">
    <span>${escapeHtml(t('sufficiency'))}</span>
    <button type="button" id="sampleGuideBtn" class="help-icon-btn" title="${escapeHtml(t('sampleGuide'))}">?</button>
  </div>
</th>
                <th>${escapeHtml(t('evidenceFiles'))}</th>
                <th>${escapeHtml(t('uploadDate'))}</th>
                <th>${escapeHtml(t('submissionStatus'))}</th>
                <th>${escapeHtml(t('reviewResult'))}</th>
                <th>${escapeHtml(t('reviewComment'))}</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows.map((row) => `
                <tr>
                  <td class="readonly-cell center-cell">${escapeHtml(getMonitoringPeriodLabel(row.year, row.quarter || state.monitoringQuarter))}</td>
                  <td class="readonly-cell">${escapeHtml(row.departmentName || '')}</td>
                  <td class="readonly-cell mono">${escapeHtml(row.riskId || '')}</td>
                  <td class="readonly-cell mono">${escapeHtml(row.controlCode || '')}</td>
                  <td class="readonly-cell">${escapeHtml(row.controlName || '')}</td>
                  <td class="readonly-cell">${escapeHtml(row.controlDepartment || '')}</td>
                  <td class="readonly-cell">${escapeHtml(row.controlOwnerName || '')}</td>
                  ${quarterMonths.map((month) => `<td class="readonly-cell center-cell">${escapeHtml(getMonitoringMonthlyCellLabel(row.monthlySummary?.[month]))}</td>`).join('')}
                  <td class="readonly-cell center-cell">${row.submittedSampleCount || 0}</td>
                  <td class="readonly-cell center-cell">${row.quarterExceptionCount || 0}</td>
                  <td class="readonly-cell center-cell">${row.requiredSampleCount || 0}</td>
                  <td class="readonly-cell center-cell">${escapeHtml(isEnglish() ? ((row.sampleSufficiency === '충족' || row.sampleSufficiency === 'Sufficient') ? 'Sufficient' : (row.sampleSufficiency === '부족' || row.sampleSufficiency === 'Insufficient') ? 'Insufficient' : (row.sampleSufficiency === '예외제출' || row.sampleSufficiency === 'Exception Submitted') ? 'Exception Submitted' : (row.sampleSufficiency || '-')) : translateSampleSufficiency(row.sampleSufficiency || '-'))}</td>
                  <td>${renderMonitoringEvidenceCell(row)}</td>
                  <td class="readonly-cell">${escapeHtml(row.uploadedAt ? formatDate(row.uploadedAt) : '')}</td>
                  <td class="readonly-cell center-cell">${escapeHtml(row.submissionStatus ? (translateSubmissionStatus(row.submissionStatus)) : t('pendingSubmissionKo'))}</td>
                  <td>${renderMonitoringReviewCell(row)}</td>
                  <td>${renderMonitoringCommentCell(row)}</td>
                </tr>
              `).join('') : `<tr><td colspan="${16 + quarterMonths.length}" class="empty-state">${escapeHtml(t('noMonitoringRows'))}</td></tr>`}
            </tbody>
          </table>
        </div>
        <div class="footer-note">
          ${escapeHtml(t('monitoringFooter'))}
        </div>
      </section>
    `;
  }

  function renderCalendarContent() {
    return `
      <section class="hero">
        <div>
          <h2>${escapeHtml(t('calendar'))}</h2>
          <p>${escapeHtml(t('calendarHeroDesc', { label: getCalendarYearLabel(state.monitoringYear) }))}</p>
        </div>
        <div class="hero-tools">
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">${isManager() ? t('allControls') : t('assignedOnly')}</span>
          <button id="logoutBtn" class="ghost-btn">${escapeHtml(t('logout'))}</button>
        </div>
      </section>

      <section class="table-card calendar-page-card">
        <div class="table-meta">
          <div>${getCalendarYearLabel(state.monitoringYear)}</div>
          <div class="status-text">${isManager() ? t('allValidControls') : t('assignedControlsOnly')}</div>
        </div>
        ${renderDashboardCalendarSection(state.monitoringYear)}
        ${renderCalendarDetailPanel(state.monitoringYear)}
      </section>
    `;
  }

  function renderDashboardContent() {
    const monitoringRows = getMonitoringRows();
    const uploaded = monitoringRows.filter(r => r.evidenceCount > 0).length;
    const suitable = monitoringRows.filter(r => ['적합','Conforming'].includes(r.reviewResult)).length;
    const insufficient = monitoringRows.filter(r => ['미흡','Needs Improvement'].includes(r.reviewResult)).length;
    const unsuitable = monitoringRows.filter(r => ['부적합','Nonconforming'].includes(r.reviewResult)).length;
    const submissionPending = getDashboardSubmissionPendingCount(monitoringRows);
    const reviewPending = getDashboardReviewPendingCount(monitoringRows);
    const processSummaryRows = buildDashboardProcessSummaryRows();
    const dashboardRisks = getDashboardScopedRisks();
    const dashboardControls = getDashboardScopedControls();
    return `
      <section class="hero">
        <div>
          <h2>${escapeHtml(t('dashboard'))}</h2>
          <p>${escapeHtml(t('dashboardHeroDesc'))}</p>
        </div>
        <div class="hero-tools">
          <span class="role-badge ${isManager() ? 'manager' : 'viewer'}">${escapeHtml(t('summary'))}</span>
                    <button id="logoutBtn" class="ghost-btn">${escapeHtml(t('logout'))}</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('totalRisks'))}</span><strong>${dashboardRisks.length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('totalControls'))}</span><strong>${dashboardControls.length}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('uploadedForPeriod', { period: getMonitoringPeriodLabel() }))}</span><strong>${uploaded}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('highResidualRisk'))}</span><strong>${dashboardRisks.filter(r => r.residualRating === 'High').length}</strong></article>
      </section>

      <section class="stats-grid">
        <article class="stat-card dashboard-status-card status-fit"><span class="stat-label">${escapeHtml(t('fit'))}</span><strong>${suitable}</strong></article>
        <article class="stat-card dashboard-status-card status-gap"><span class="stat-label">${escapeHtml(t('gap'))}</span><strong>${insufficient}</strong></article>
        <article class="stat-card dashboard-status-card status-fail"><span class="stat-label">${escapeHtml(t('fail'))}</span><strong>${unsuitable}</strong></article>
        <article class="stat-card"><span class="stat-label">${escapeHtml(t('notSubmitted'))}</span><strong>${monitoringRows.filter(r => r.evidenceCount === 0).length}</strong></article>
      </section>

      <section class="table-card">
        <div class="table-meta">
          <div>${escapeHtml(t('dashboardSummary'))}</div>
          <div class="status-text">${escapeHtml(t('ready'))}</div>
        </div>
        <div class="dashboard-grid">
          <div class="dashboard-panel">
            <h3>${escapeHtml(t('processRiskSummary'))}</h3>
            <div class="dashboard-list">
              ${processSummaryRows.map((item) => `<div><span>${escapeHtml(item.label || '-')}</span><strong>${item.count}</strong></div>`).join('')}
            </div>
          </div>
          <div class="dashboard-panel">
            <h3>${escapeHtml(t('reviewResultsSummaryTitle', { period: getMonitoringPeriodLabel() }))}</h3>
            <div class="dashboard-list">
              <div><span>${escapeHtml(t('conformingKo'))}</span><strong>${suitable}</strong></div>
              <div><span>${escapeHtml(t('needsImprovementKo'))}</span><strong>${insufficient}</strong></div>
              <div><span>${escapeHtml(t('nonconformingKo'))}</span><strong>${unsuitable}</strong></div>
              <div><span>${escapeHtml(t('pendingSubmissionKo'))}</span><strong>${submissionPending}</strong></div>
              <div><span>${escapeHtml(t('pendingReviewKo'))}</span><strong>${reviewPending}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section class="table-card heatmap-section">
        <div class="table-meta">
          <div>${escapeHtml(t('heatmapTitle'))}</div>
          <div class="status-text">${escapeHtml(t('companyStandard'))}</div>
        </div>
        <div class="dashboard-grid heatmap-grid">
          <div class="dashboard-panel">
            <h3>${escapeHtml(t('inherentRiskHeatmap'))}</h3>
            ${renderHeatmapPanel('inherentLikelihood', 'inherentImpact', 'inherent')}
          </div>
          <div class="dashboard-panel">
            <h3>${escapeHtml(t('residualRiskHeatmap'))}</h3>
            ${renderHeatmapPanel('residualLikelihood', 'residualImpact', 'residual')}
          </div>
        </div>
      </section>
    `;
  }

  function getDashboardSubmissionPendingCount(monitoringRows) {
    return monitoringRows.filter((row) => row.evidenceCount > 0 && row.sampleSufficiency !== '충족' && row.sampleSufficiency !== 'Sufficient').length;
  }

  function getDashboardReviewPendingCount(monitoringRows) {
    return monitoringRows.filter((row) => row.evidenceCount > 0 && (row.sampleSufficiency === '충족' || row.sampleSufficiency === 'Sufficient') && !row.reviewResult).length;
  }

  function buildDashboardProcessSummaryRows() {
    const activeRisks = getDashboardScopedRisks();
    const riskCountByFolderId = activeRisks.reduce((acc, risk) => {
      acc[risk.folderId] = (acc[risk.folderId] || 0) + 1;
      return acc;
    }, {});

    const candidateFolders = sortFolders(getActiveFolders()).filter((folder) => !!riskCountByFolderId[folder.folderId]);

    return candidateFolders.map((folder) => ({
      folderId: folder.folderId,
      label: folder.folderName,
      count: riskCountByFolderId[folder.folderId] || 0
    }));
  }

  function bindAppEvents() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        closeModal();
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Logout failed:', error);
        }
        resetSignedOutAppState();
      });
    }

    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        if (!confirm(t('resetBrowserData'))) return;

        localStorage.removeItem(STORAGE_SESSION_KEY);
        localStorage.removeItem(STORAGE_DB_KEY);
        localStorage.removeItem(STORAGE_UI_KEY);
        localStorage.removeItem('rcm_json_model_db_v2');
        supabase.auth.signOut().catch((error) => console.error('Auth signOut during cache reset failed:', error));

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

    const monitoringPeriodSelect = document.getElementById('monitoringPeriodSelect');
    if (monitoringPeriodSelect) {
      monitoringPeriodSelect.value = `${state.monitoringYear}|${state.monitoringQuarter}`;
      monitoringPeriodSelect.addEventListener('change', (e) => {
        window.__icmSetMonitoringPeriod(e.target.value);
      });
    }

    const calendarYearSelect = document.getElementById('calendarYearSelect');
    if (calendarYearSelect) {
      calendarYearSelect.value = `${state.monitoringYear}`;
      calendarYearSelect.addEventListener('change', (e) => {
        window.__icmSetCalendarYear(e.target.value);
      });
    }

    bindCalendarFilterEvents();

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
        if (!state.selectedFolderId && state.heatmapPreviousFolderId) {
          state.selectedFolderId = state.heatmapPreviousFolderId;
        }
        state.heatmapPreviousFolderId = null;
        persistUiState();
        render();
      });
    }

    const addRootFolderBtn = document.getElementById('addRootFolderBtn');
    if (addRootFolderBtn) {
      addRootFolderBtn.addEventListener('click', () => {
        if (!canManageRcm()) return blockRcmAction();
        openFolderModal(null);
      });
    }

    const addChildFolderBtn = document.getElementById('addChildFolderBtn');
    if (addChildFolderBtn) {
      addChildFolderBtn.addEventListener('click', () => {
        if (!canManageRcm()) return blockRcmAction();
        if (!state.selectedFolderId) {
          alert(t('addChildFolderFirst'));
          return;
        }
        openFolderModal(state.selectedFolderId);
      });
    }

    const deleteSelectedFolderBtn = document.getElementById('deleteSelectedFolderBtn');
    if (deleteSelectedFolderBtn) {
      deleteSelectedFolderBtn.addEventListener('click', () => {
        if (!canManageRcm()) return blockRcmAction();
        if (!state.selectedFolderId) {
          alert(t('selectFolderToDelete'));
          return;
        }
        deleteFolder(state.selectedFolderId);
      });
    }

    const addRiskBtn = document.getElementById('addRiskBtn');
    if (addRiskBtn) {
      addRiskBtn.addEventListener('click', () => {
        if (!canManageRcm()) return blockRcmAction();
        if (!state.selectedFolderId) {
          alert(t('selectFolderForRisk'));
          return;
        }
        openRiskModal();
      });
    }

    const moveRiskBtn = document.getElementById('moveRiskBtn');
    if (moveRiskBtn) {
      moveRiskBtn.addEventListener('click', () => {
        if (!canManageRcm()) return blockRcmAction();
        if (!state.selectedRiskId) {
          alert(t('selectRiskToMove'));
          return;
        }
        openMoveRiskModal(state.selectedRiskId);
      });
    }

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        if (state.currentModule === 'monitoring') {
          if (!canSaveMonitoringReview()) return blockMonitoringReviewAction();
          await saveMonitoringReviewChanges();
          state.isEditMode = false;
          render();
          return;
        }

        if (!canManageRcm()) return blockRcmAction();
        saveDatabase();
        state.isEditMode = false;
        render();
      });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!canManageRcm()) return blockRcmAction();
        if (!confirm(t('confirmResetAllData'))) return;

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
        const monitoringFileSuffix = `FY${state.monitoringYear}_Q${state.monitoringQuarter}`;
        downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }), state.currentModule === 'monitoring' ? `Monitoring_${monitoringFileSuffix}.json` : 'RCM_DB.json');
      });
    }

    const csvBtn = document.getElementById('downloadCsvBtn');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        const rows = state.currentModule === 'monitoring' ? getMonitoringRowsForExport() : getVisibleRowsForExport();
        const csv = convertRowsToCsv(rows);
        const monitoringFileSuffix = `FY${state.monitoringYear}_Q${state.monitoringQuarter}`;
        downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), state.currentModule === 'monitoring' ? `Monitoring_${monitoringFileSuffix}.csv` : 'RCM_Rows.csv');
      });
    }

    const excelBtn = document.getElementById('downloadExcelBtn');
    if (excelBtn) {
      excelBtn.addEventListener('click', () => {
        if (typeof XLSX === 'undefined') {
          alert(t('excelLibraryLoadFailed'));
          return;
        }
        const exportRows = state.currentModule === 'monitoring' ? getMonitoringRowsForExport() : getVisibleRowsForExport();
        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, state.currentModule === 'monitoring' ? 'Monitoring' : 'RCM');
        const monitoringFileSuffix = `FY${state.monitoringYear}_Q${state.monitoringQuarter}`;
        XLSX.writeFile(workbook, state.currentModule === 'monitoring' ? `Monitoring_${monitoringFileSuffix}.xlsx` : 'RCM_Rows.xlsx');
      });
    }

  }

  function bindMonitoringEvents() {
    const _uploadBtns = document.querySelectorAll('[data-monitoring-upload]');
    console.log('[ICM DEBUG] bindMonitoringEvents: buttons found =', _uploadBtns.length);
    _uploadBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const _controlId = btn.getAttribute('data-monitoring-upload');
        const _mode = String(btn.getAttribute('data-monitoring-evidence-view') || 'edit').toLowerCase();
        console.log('[ICM DEBUG] View Evidence clicked, controlId =', _controlId, 'mode =', _mode);
        openMonitoringUploadModal(_controlId, { readOnly: _mode === 'readonly' });
      });
    });

    document.querySelectorAll('[data-evidence-download]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await downloadEvidenceFileById(btn.getAttribute('data-evidence-download'));
      });
    });

    document.querySelectorAll('[data-monitoring-review]').forEach((el) => {
      el.addEventListener('change', () => {
        if (!canReviewMonitoring()) return blockMonitoringReviewAction();
        updateMonitoringRecord(el.dataset.recordId, 'reviewResult', el.value);
      });
    });

    document.querySelectorAll('[data-monitoring-comment]').forEach((el) => {
      el.addEventListener('change', () => {
        if (!canReviewMonitoring()) return blockMonitoringReviewAction();
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

function bindCalendarFilterEvents() {
    const processSelect = document.getElementById('calendarProcessFilter');
    const ownerSelect = document.getElementById('calendarOwnerFilter');
    const statusSelect = document.getElementById('calendarStatusFilter');
    const keywordInput = document.getElementById('calendarKeywordFilter');
    const resetBtn = document.getElementById('calendarFilterResetBtn');

    if (processSelect) {
      processSelect.addEventListener('change', (e) => {
        state.calendarFilters.process = e.target.value || '';
        persistUiState();
        render();
      });
    }

    if (ownerSelect) {
      ownerSelect.addEventListener('change', (e) => {
        state.calendarFilters.owner = e.target.value || '';
        persistUiState();
        render();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        state.calendarFilters.status = e.target.value || '';
        persistUiState();
        render();
      });
    }

    if (keywordInput) {
      keywordInput.addEventListener('input', (e) => {
        state.calendarFilters.keyword = e.target.value || '';
        persistUiState();
        render();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.calendarFilters = { process: '', owner: '', status: '', keyword: '' };
        state.calendarDetail = { month: null, status: '' };
        persistUiState();
        render();
      });
    }

    document.querySelectorAll('[data-calendar-month-btn]').forEach((button) => {
      button.addEventListener('click', () => {
        const month = Number(button.dataset.month || 0);
        const status = String(button.dataset.status || '');
        if (!(month >= 1 && month <= 12) || !status || status === 'inactive') return;

        const sameSelection = Number(state.calendarDetail?.month || 0) === month && String(state.calendarDetail?.status || '') === status;
        state.calendarDetail = sameSelection ? { month, status: '' } : { month, status };
        persistUiState();
        render();
      });
    });

    const detailResetBtn = document.getElementById('calendarDetailResetBtn');
    if (detailResetBtn) {
      detailResetBtn.addEventListener('click', () => {
        state.calendarDetail = { month: null, status: '' };
        persistUiState();
        render();
      });
    }
  }

function openSampleGuideModal() {
  openModal(`
    <div class="modal-header">
      <h3>${escapeHtml(t('sampleGuideTitle'))}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>

    <div class="help-text" style="margin-bottom:16px;">
      ${t('sampleGuideDesc')}
    </div>

    <div class="sample-guide-section">
      <h4>${escapeHtml(t('sampleGuideAuto'))}</h4>
      <div class="table-wrap">
        <table class="sample-guide-table">
          <thead>
            <tr>
              <th class="center-cell">${escapeHtml(t('controlCycle'))}</th>
              <th class="center-cell">${escapeHtml(t('inherentRiskMidOrBelow'))}</th>
              <th class="center-cell">${escapeHtml(t('inherentRiskHigh'))}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('상시'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('건별'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('일별'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('주별'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('월별'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('분기별'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('반기별'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('연간'))}</td><td class="center-cell">1</td><td class="center-cell">1</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="sample-guide-section" style="margin-top:20px;">
      <h4>${escapeHtml(t('sampleGuideManual'))}</h4>
      <div class="table-wrap">
        <table class="sample-guide-table">
          <thead>
            <tr>
              <th class="center-cell">${escapeHtml(t('controlCycle'))}</th>
              <th class="center-cell">${escapeHtml(t('inherentRiskMidOrBelow'))}</th>
              <th class="center-cell">${escapeHtml(t('inherentRiskHigh'))}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('상시'))}</td><td class="center-cell">3</td><td class="center-cell">5</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('건별'))}</td><td class="center-cell">3</td><td class="center-cell">5</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('일별'))}</td><td class="center-cell">3</td><td class="center-cell">5</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('주별'))}</td><td class="center-cell">2</td><td class="center-cell">4</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('월별'))}</td><td class="center-cell">2</td><td class="center-cell">4</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('분기별'))}</td><td class="center-cell">1</td><td class="center-cell">3</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('반기별'))}</td><td class="center-cell">1</td><td class="center-cell">2</td></tr>
            <tr><td>${escapeHtml(getFrequencyDisplayLabel('연간'))}</td><td class="center-cell">1</td><td class="center-cell">1</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="warning-box" style="margin-top:16px;">
      ${t('uploadOneEqualsOne')}
    </div>

    <div class="modal-actions">
      <button id="sampleGuideCloseBtn" class="primary-btn">${escapeHtml(t('close'))}</button>
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

        const nextFilter = { mode, like, impact };
        const sameFilter = isSameHeatmapFilter(state.heatmapFilter, nextFilter);

        if (sameFilter) {
          state.heatmapFilter = null;
          if (!state.selectedFolderId && state.heatmapPreviousFolderId) {
            state.selectedFolderId = state.heatmapPreviousFolderId;
          }
          state.heatmapPreviousFolderId = null;
        } else {
          if (state.selectedFolderId && !state.heatmapPreviousFolderId) {
            state.heatmapPreviousFolderId = state.selectedFolderId;
          }
          state.heatmapFilter = nextFilter;
          state.selectedFolderId = null;
        }

        state.search = '';
        state.selectedRiskId = null;
        state.currentModule = 'rcm';
        persistUiState();
        render();
      });
    });

    document.querySelectorAll('.heatmap-side-item').forEach((item) => {
      if (item.dataset.bound === 'Y') return;
      item.dataset.bound = 'Y';

      item.addEventListener('click', () => {
        const bucket = String(item.dataset.bucket || '').toLowerCase();
        const mode = item.dataset.mode || 'residual';
        if (!bucket) return;

        const nextFilter = { mode, bucket };
        const sameFilter = isSameHeatmapFilter(state.heatmapFilter, nextFilter);

        if (sameFilter) {
          state.heatmapFilter = null;
          if (!state.selectedFolderId && state.heatmapPreviousFolderId) {
            state.selectedFolderId = state.heatmapPreviousFolderId;
          }
          state.heatmapPreviousFolderId = null;
        } else {
          if (state.selectedFolderId && !state.heatmapPreviousFolderId) {
            state.heatmapPreviousFolderId = state.selectedFolderId;
          }
          state.heatmapFilter = nextFilter;
          state.selectedFolderId = null;
        }

        state.search = '';
        state.selectedRiskId = null;
        state.currentModule = 'rcm';
        persistUiState();
        render();
      });
    });
  }


function getHeatmapBucketFromScore(score) {
  const normalized = Number(score || 0);
  if (normalized <= 7) return 'low';
  if (normalized <= 12) return 'medium';
  return 'high';
}

function getHeatmapBucketLabel(bucket) {
  const key = String(bucket || '').toLowerCase();
  if (key === 'low') return 'Low';
  if (key === 'medium') return 'Medium';
  if (key === 'high') return 'High';
  return '-';
}

function getHeatmapModeLabel(mode) {
  return mode === 'inherent' ? t('inherentRiskShort') : t('residualRiskShort');
}

function isSameHeatmapFilter(a, b) {
  if (!a || !b) return false;
  if ((a.mode || '') !== (b.mode || '')) return false;
  if (a.bucket || b.bucket) {
    return String(a.bucket || '').toLowerCase() === String(b.bucket || '').toLowerCase();
  }
  return Number(a.like || 0) === Number(b.like || 0) && Number(a.impact || 0) === Number(b.impact || 0);
}

function getHeatmapFilterLabel(filter) {
  if (!filter) return t('allView');
  const modeLabel = getHeatmapModeLabel(filter.mode);
  if (filter.bucket) {
    return `${modeLabel} / ${getHeatmapBucketLabel(filter.bucket)}`;
  }
  return `${modeLabel} / ${isEnglish() ? 'Impact' : t('resultSeverity')} ${filter.impact} / ${isEnglish() ? 'Likelihood' : t('likelihoodKo')} ${filter.like}`;
}

function isSelectedHeatmapBucket(mode, bucket) {
  return !!(
    state.heatmapFilter &&
    state.heatmapFilter.mode === mode &&
    String(state.heatmapFilter.bucket || '').toLowerCase() === String(bucket || '').toLowerCase()
  );
}

function isSelectedHeatmapCell(mode, like, impact) {
  return !!(
    state.heatmapFilter &&
    !state.heatmapFilter.bucket &&
    state.heatmapFilter.mode === mode &&
    Number(state.heatmapFilter.like || 0) === Number(like || 0) &&
    Number(state.heatmapFilter.impact || 0) === Number(impact || 0)
  );
}

function matchesHeatmapFilter(risk) {
  if (!state.heatmapFilter) return true;
  const filter = state.heatmapFilter;
  const likeValue = Number(filter.mode === 'inherent' ? risk.inherentLikelihood || 0 : risk.residualLikelihood || 0);
  const impactValue = Number(filter.mode === 'inherent' ? risk.inherentImpact || 0 : risk.residualImpact || 0);
  if (!(likeValue >= 1 && likeValue <= 5) || !(impactValue >= 1 && impactValue <= 5)) return false;

  if (filter.bucket) {
    return getHeatmapBucketFromScore(likeValue * impactValue) === String(filter.bucket).toLowerCase();
  }

  return likeValue === Number(filter.like || 0) && impactValue === Number(filter.impact || 0);
}


function renderMonitoringEvidenceCell(row) {
  if (!row.controlId) return '<div class="readonly-cell"></div>';

  const files = getEvidenceFilesByRecordId(row.recordId);
  const isManagerView = isManager();
  const actionLabel = isManagerView
    ? (isEnglish() ? 'View Evidence' : '증빙 보기')
    : (isEnglish() ? 'Upload Evidence' : t('uploadEvidence'));

  let fileHtml = '';

  if (!files.length) {
    fileHtml = `<div class="readonly-cell muted">${escapeHtml(isEnglish() ? 'No Upload' : t('noUpload'))}</div>`;
  } else {
    fileHtml = files.map(f => `
      <div class="evidence-file-row" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <span>${escapeHtml(f.fileName)}</span>
        <button type="button" class="ghost-btn small-btn" data-evidence-download="${escapeHtml(f.fileId || '')}">${escapeHtml(t('download'))}</button>
      </div>
    `).join('');
  }

  return `
    <div class="evidence-file-list">
      ${fileHtml}
    </div>
    <button class="ghost-btn small-btn" data-monitoring-upload="${row.controlId}" data-monitoring-evidence-view="${isManagerView ? 'readonly' : 'edit'}">
      ${escapeHtml(actionLabel)}
    </button>
  `;
}

  function renderMonitoringReviewCell(row) {
    if (!isManager()) return `<div class="readonly-cell center-cell">${escapeHtml(translateSubmissionStatus(row.reviewResult || ''))}</div>`;
    return `
      <select class="cell-select" data-monitoring-review="1" data-record-id="${row.recordId}">
        <option value="" ${!row.reviewResult ? 'selected' : ''}>-</option>
        <option value="적합" ${row.reviewResult === '적합' ? 'selected' : ''}>${escapeHtml(t('fit'))}</option>
        <option value="미흡" ${row.reviewResult === '미흡' ? 'selected' : ''}>${escapeHtml(t('gap'))}</option>
        <option value="부적합" ${row.reviewResult === '부적합' ? 'selected' : ''}>${escapeHtml(t('fail'))}</option>
      </select>
    `;
  }

  function renderMonitoringCommentCell(row) {
    if (!isManager()) return `<div class="readonly-cell">${escapeHtml(row.reviewComment || '')}</div>`;
    return `<input class="cell-input" data-monitoring-comment="1" data-record-id="${row.recordId}" value="${escapeHtml(row.reviewComment || '')}" />`;
  }

  function ensureMonitoringRecordsForPeriod(yearValue, quarterValue) {
    const year = Number(String(yearValue).replace(/[^0-9]/g, ''));
    const quarter = normalizeMonitoringQuarter(year, quarterValue);
    if (!Number.isFinite(year)) return;

    state.monitoringYear = year;
    state.monitoringQuarter = quarter;
    state.db.monitoring_records = state.db.monitoring_records || [];

    getMonitoringControlsForPeriod(year, quarter).forEach((control) => {
      const risk = getRiskById(control.riskId);
      let record = state.db.monitoring_records.find((r) => isSameMonitoringPeriod(r, year, quarter) && r.controlId === control.controlId);
      if (!record) {
        const createdAt = nowIso();
        record = {
          recordId: nextSimpleId('M', state.db.monitoring_records.map((r) => r.recordId)),
          year,
          quarter,
          controlId: control.controlId,
          riskId: risk?.riskId,
          evidenceFile: '',
          uploadedAt: '',
          submissionStatus: '제출대기',
          reviewResult: '',
          reviewComment: '',
          createdAt,
          createdBy: state.currentUser?.userId || 'system',
          updatedAt: createdAt,
          updatedBy: state.currentUser?.userId || 'system'
        };
        state.db.monitoring_records.push(record);
      } else if (!record.quarter || record.quarter !== quarter) {
        record.quarter = quarter;
      }
    });
  }

function getMonitoringRows() {
  const keyword = state.search.trim().toLowerCase();
  const quarterMonths = getQuarterMonths(state.monitoringQuarter);
  return getMonitoringControlsForPeriod(state.monitoringYear, state.monitoringQuarter).map((control) => {
    const risk = getRiskById(control.riskId);
    const record = getOrCreateMonitoringRecord(control.controlId, risk?.riskId);
    const evidenceFiles = getEvidenceFilesByRecordId(record.recordId);
    const monthlySummary = buildMonitoringMonthlySummary(evidenceFiles, quarterMonths);

    const requiredSampleCount = getRequiredSampleCount(
      risk?.inherentRating || '',
      control.controlOperationType || control.controlType || '',
      control.controlFrequency || ''
    );
    const exceptionSummary = getMonitoringExceptionSummary(evidenceFiles);
    const submittedEvidenceFiles = evidenceFiles.filter((file) => !isExceptionEvidenceRow(file));
    const submittedSampleCount = submittedEvidenceFiles.length;
    const quarterExceptionCount = evidenceFiles.filter((file) => isExceptionEvidenceRow(file)).length;
    const sampleSufficiency = getSampleSufficiencyLabel(requiredSampleCount, submittedSampleCount, quarterExceptionCount > 0);
    const hasAnyResponse = submittedSampleCount > 0 || quarterExceptionCount > 0;

    return {
      recordId: record.recordId,
      year: record.year,
      quarter: record.quarter,
      periodLabel: getMonitoringPeriodLabel(record.year, record.quarter),
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
      evidenceCount: submittedEvidenceFiles.length,
      exceptionReasonCode: exceptionSummary.code,
      exceptionComment: exceptionSummary.comment,
      monthlySummary,
      quarterExceptionCount,
      requiredSampleCount,
      submittedSampleCount,
      sampleSufficiency,
      uploadedAt: record.uploadedAt || '',
      submissionStatus: hasAnyResponse ? '제출완료' : (record.submissionStatus || '제출대기'),
      reviewResult: record.reviewResult || '',
      reviewComment: record.reviewComment || ''
    };
  }).filter((row) => {
    if (!isSameMonitoringPeriod(row, state.monitoringYear, state.monitoringQuarter)) return false;
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
  }).sort((a, b) => {
    const riskCompare = String(a.riskId || '').localeCompare(String(b.riskId || ''));
    if (riskCompare !== 0) return riskCompare;

    const controlCompare = String(a.controlCode || '').localeCompare(String(b.controlCode || ''));
    if (controlCompare !== 0) return controlCompare;

    return String(a.controlId || '').localeCompare(String(b.controlId || ''));
  });
}

  function getMonitoringRowsForExport() {
    const quarterMonths = getQuarterMonths(state.monitoringQuarter);
    return getMonitoringRows().map((row) => {
      const payload = {
        year: row.year,
        quarter: row.quarter,
        period: getMonitoringPeriodLabel(row.year, row.quarter),
        departmentName: row.departmentName,
        riskId: row.riskId,
        controlCode: row.controlCode,
        controlName: row.controlName,
        controlDepartment: row.controlDepartment,
        controlOwnerName: row.controlOwnerName,
        evidenceFile: row.evidenceFile,
        evidenceCount: row.evidenceCount,
        quarterExceptionCount: row.quarterExceptionCount,
        requiredSampleCount: row.requiredSampleCount,
        submittedSampleCount: row.submittedSampleCount,
        sampleSufficiency: row.sampleSufficiency,
        uploadedAt: row.uploadedAt,
        submissionStatus: row.submissionStatus,
        reviewResult: row.reviewResult,
        reviewComment: row.reviewComment
      };
      quarterMonths.forEach((month) => {
        payload[`${getMonthShortLabel(month)} Uploaded`] = row.monthlySummary?.[month]?.uploaded || 0;
        payload[`${getMonthShortLabel(month)} Exception`] = row.monthlySummary?.[month]?.exception || 0;
      });
      return payload;
    });
  }

  function getOrCreateMonitoringRecord(controlId, riskId) {
    const year = Number(state.monitoringYear);
    const quarter = normalizeMonitoringQuarter(year, state.monitoringQuarter);
    let record = (state.db.monitoring_records || []).find((r) => isSameMonitoringPeriod(r, year, quarter) && r.controlId === controlId);
    if (!record) {
      const createdAt = nowIso();
      record = {
        recordId: nextSimpleId('M', (state.db.monitoring_records || []).map((r) => r.recordId)),
        year,
        quarter,
        controlId,
        riskId,
        evidenceFile: '',
        uploadedAt: '',
        submissionStatus: '제출대기',
        reviewResult: '',
        reviewComment: '',
        createdAt,
        createdBy: state.currentUser?.userId || 'system',
        updatedAt: createdAt,
        updatedBy: state.currentUser?.userId || 'system'
      };
      state.db.monitoring_records.push(record);
    } else if (!record.quarter || record.quarter !== quarter) {
      record.quarter = quarter;
    }
    return record;
  }

function getEvidenceFilesByRecordId(recordId) {
  return (state.db.monitoring_evidence_files || [])
    .filter((file) => !file.isDeleted && file.recordId === recordId)
    .sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
}

function getEvidenceFileById(fileId) {
  return (state.db.monitoring_evidence_files || []).find((file) => !file.isDeleted && file.fileId === fileId) || null;
}

async function downloadEvidenceFileById(fileId) {
  const file = getEvidenceFileById(fileId);
  if (!file) {
    alert('파일 정보를 찾을 수 없습니다.');
    return;
  }

  try {
    let blob = null;

    if (file.storagePath) {
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .download(file.storagePath);
      if (error) throw error;
      blob = data;
    } else if (file.fileLink) {
      const response = await fetch(file.fileLink);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      blob = await response.blob();
    }

    if (!blob) throw new Error('No downloadable file data');

    downloadBlob(blob, file.fileName || 'evidence');
  } catch (error) {
    console.error('Evidence download failed:', error);
    alert(`증빙파일 다운로드 중 오류가 발생했습니다: ${error.message || error}`);
  }
}

function getMonitoringQuarterFolderName(quarterValue = state.monitoringQuarter) {
  return `Q${normalizeMonitoringQuarter(state.monitoringYear, quarterValue)}`;
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
  const year = Number(record.year || state.monitoringYear || new Date().getFullYear());
  const quarter = normalizeMonitoringQuarter(year, record.quarter || state.monitoringQuarter);

  const safeFileName = sanitizeFileName(file.name);
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const storagePath = `${year}/Q${quarter}/${riskCode}/${controlCode}/${timestamp}_${safeFileName}`;

  const originalType = String(file.type || '').trim();
  const extension = String(file.name || '').toLowerCase().split('.').pop();
  const mimeByExtension = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlsm: 'application/vnd.ms-excel',
    csv: 'text/csv',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg'
  };

  let resolvedContentType = originalType || mimeByExtension[extension] || 'application/pdf';

  if (resolvedContentType === 'application/csv') {
    resolvedContentType = 'text/csv';
  }

  const normalizedOpenXmlPrefixes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.',
    'application/vnd.openxmlformats-officedocument.presentationml.'
  ];

  const isExplicitlyAllowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.ms-excel',
    'text/csv',
    'application/vnd.ms-powerpoint',
    'text/plain',
    'image/png',
    'image/jpeg'
  ].includes(resolvedContentType)
    || normalizedOpenXmlPrefixes.some(prefix => resolvedContentType.startsWith(prefix));

  if (!isExplicitlyAllowed && mimeByExtension[extension]) {
    resolvedContentType = mimeByExtension[extension];
  }

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: resolvedContentType
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
  return normalized.map((month) => getMonthShortLabel(month)).join(', ');
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
    assigned_user_id: control.assignedUserId || null,
    assigned_user_email: control.assignedUserEmail || '',
    status: control.status || 'Open',
    effective_from_date: control.effectiveFromDate || null,
    closed_at: control.closedAt || null,
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
  const lowerMessage = message.toLowerCase();
  const missingColumn = code === 'PGRST204' || lowerMessage.includes('control_months') || lowerMessage.includes('assigned_user_id') || lowerMessage.includes('assigned_user_email') || lowerMessage.includes('column');
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

function getSampleSufficiencyLabel(requiredSampleCount, submittedSampleCount, hasException) {
  if (!requiredSampleCount) return '-';
  if (submittedSampleCount >= requiredSampleCount) return '충족';
  if (hasException) return '예외제출';
  return '부족';
}

function normalizeEvidenceDescription(value) {
  return String(value || '').trim();
}

function getExceptionReasonMeta(value) {
  const normalized = String(value || '').trim();
  if (normalized === 'no_occurrence') return { code: 'NO_OCCURRENCE', label: t('exceptionReasonNoOccurrence') };
  if (normalized === 'less_than_sample') return { code: 'LESS_THAN_SAMPLE', label: t('exceptionReasonLessThanSample') };
  return null;
}

function buildExceptionDescription(reasonValue, comment) {
  const meta = getExceptionReasonMeta(reasonValue);
  const trimmedComment = normalizeEvidenceDescription(comment);
  if (!meta) return trimmedComment;
  return trimmedComment ? `[${meta.code}] ${trimmedComment}` : `[${meta.code}]`;
}

function parseExceptionDescription(description) {
  const normalized = normalizeEvidenceDescription(description);
  const match = normalized.match(/^\[(NO_OCCURRENCE|LESS_THAN_SAMPLE)\]\s*(.*)$/i);
  if (!match) return { hasException: false, code: '', comment: normalized };
  return {
    hasException: true,
    code: String(match[1] || '').toUpperCase(),
    comment: String(match[2] || '').trim()
  };
}

function isExceptionEvidenceRow(fileRow) {
  return parseExceptionDescription(fileRow?.description || '').hasException;
}

function getMonitoringExceptionSummary(evidenceFiles) {
  const exceptionFile = (evidenceFiles || []).find((file) => isExceptionEvidenceRow(file));
  if (!exceptionFile) return { hasException: false, code: '', comment: '', file: null };
  const parsed = parseExceptionDescription(exceptionFile.description || '');
  return {
    hasException: parsed.hasException,
    code: parsed.code,
    comment: parsed.comment,
    file: exceptionFile
  };
}


  function buildMonitoringRecordRow(record) {
    return {
      record_id: record.recordId,
      year: Number(record.year),
      quarter: normalizeMonitoringQuarter(record.year, record.quarter),
      control_id: record.controlId,
      risk_id: record.riskId || null,
      evidence_file: record.evidenceFile || '',
      uploaded_at: record.uploadedAt || null,
      submission_status: record.submissionStatus || '제출대기',
      review_result: record.reviewResult || '',
      review_comment: record.reviewComment || '',
      is_deleted: !!record.isDeleted,
      created_at: record.createdAt || nowIso(),
      created_by: record.createdBy || state.currentUser?.userId || '',
      updated_at: nowIso(),
      updated_by: state.currentUser?.userId || ''
    };
  }

  function buildMonitoringEvidenceRow(fileRow) {
    const now = nowIso();
    return {
      file_id: fileRow.fileId,
      record_id: fileRow.recordId,
      control_id: fileRow.controlId,
      risk_id: fileRow.riskId || null,
      year: Number(fileRow.year),
      quarter: normalizeMonitoringQuarter(fileRow.year, fileRow.quarter),
      target_month: fileRow.targetMonth ? Number(fileRow.targetMonth) : null,
      file_name: fileRow.fileName,
      file_link: fileRow.fileLink || '',
      storage_path: fileRow.storagePath || '',
      description: fileRow.description || '',
      uploaded_by: fileRow.uploadedBy || state.currentUser?.userId || '',
      uploaded_at: fileRow.uploadedAt || now,
      is_deleted: !!fileRow.isDeleted,
      created_at: fileRow.createdAt || fileRow.uploadedAt || now,
      created_by: fileRow.createdBy || fileRow.uploadedBy || state.currentUser?.userId || '',
      updated_at: fileRow.updatedAt || now,
      updated_by: fileRow.updatedBy || fileRow.uploadedBy || state.currentUser?.userId || ''
    };
  }

  async function upsertMonitoringRecordToSupabase(record) {
    const payload = buildMonitoringRecordRow(record);
    const response = await supabase
      .from('monitoring_records')
      .upsert(payload, { onConflict: 'record_id' });

    if (response.error) throw response.error;
  }

  async function insertMonitoringEvidenceFilesToSupabase(fileRows) {
    if (!fileRows.length) return;
    const payload = fileRows.map(buildMonitoringEvidenceRow);
    const response = await supabase
      .from('monitoring_evidence_files')
      .insert(payload);

    if (response.error) throw response.error;
  }

  async function refreshMonitoringDataFromSupabase() {
    const [monitoringRes, evidenceRes] = await Promise.all([
      supabase.from('monitoring_records').select('*'),
      supabase.from('monitoring_evidence_files').select('*')
    ]);

    if (monitoringRes.error) throw monitoringRes.error;
    if (evidenceRes.error) throw evidenceRes.error;

    state.db.monitoring_records = (monitoringRes.data || []).map((row) => ({
      recordId: row.record_id,
      year: Number(row.year),
      quarter: normalizeMonitoringQuarter(row.year, row.quarter),
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
    }));

    state.db.monitoring_evidence_files = (evidenceRes.data || []).map((row) => ({
      fileId: row.file_id,
      recordId: row.record_id,
      controlId: row.control_id,
      riskId: row.risk_id,
      year: Number(row.year),
      quarter: normalizeMonitoringQuarter(row.year, row.quarter),
      targetMonth: row.target_month ? Number(row.target_month) : null,
      fileName: row.file_name,
      fileLink: row.file_link,
      storagePath: row.storage_path,
      description: row.description,
      uploadedBy: row.uploaded_by,
      uploadedAt: row.uploaded_at,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    }));

    normalizeDatabase();
  }

  async function saveMonitoringReviewChanges() {
    const periodRows = (state.db.monitoring_records || []).filter((record) =>
      isSameMonitoringPeriod(record, state.monitoringYear, state.monitoringQuarter) && !record.isDeleted
    );

    for (const record of periodRows) {
      record.updatedAt = nowIso();
      record.updatedBy = state.currentUser?.userId || '';
      await upsertMonitoringRecordToSupabase(record);
    }

    await refreshMonitoringDataFromSupabase();
    persistDatabase();
    persistUiState();
    state.isDirty = false;
  }

  function updateMonitoringRecord(recordId, field, value) {
    const record = (state.db.monitoring_records || []).find((r) => r.recordId === recordId);
    if (!record) return;
    record[field] = value;
    if (field === 'reviewResult' && value && record.submissionStatus === '제출완료') {
      record.submissionStatus = '검토완료';
    }
    appendLog('monitoring', recordId, 'update', null, { [field]: value, year: record.year, quarter: record.quarter });
    markDirtyAndRender();
  }


  function generateUniqueEvidenceFileId() {
    return `E${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

function openMonitoringUploadModal(controlId, options = {}) {
  const control = getControlById(controlId);
  const risk = control ? getRiskById(control.riskId) : null;
  const record = getOrCreateMonitoringRecord(controlId, risk?.riskId);
  const files = getEvidenceFilesByRecordId(record.recordId);
  const readOnlyManagerView = options.readOnly === true || (isManager() && !canUploadMonitoringEvidence());

  openModal(`
    <div class="modal-header">
      <h3>${escapeHtml(readOnlyManagerView ? (isEnglish() ? 'View Evidence' : '증빙 보기') : t('uploadModalTitle'))}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>

    <div class="kv-list" style="margin-bottom:16px;">
      <div>${escapeHtml(t('period'))}</div><div>${getMonitoringPeriodLabel()}</div>
      <div>Risk Code</div><div class="mono">${escapeHtml(getDisplayRiskCode(risk?.riskId || ''))}</div>
      <div>Control Code</div><div class="mono">${escapeHtml(control?.controlCode || control?.controlId || '')}</div>
      <div>${escapeHtml(t('controlName'))}</div><div>${escapeHtml(control?.controlName || control?.controlTitle || '')}</div>
    </div>

    <div class="field-group">
      <label>${escapeHtml(t('existingEvidenceList'))}</label>
      <div id="evidenceExistingList" class="evidence-existing-list">
        ${
          files.length
            ? files.map(file => {
                const exceptionMeta = parseExceptionDescription(file.description || '');
                const exceptionReasonLabel = exceptionMeta.hasException
                  ? (exceptionMeta.code === 'NO_OCCURRENCE' ? t('exceptionReasonNoOccurrence') : t('exceptionReasonLessThanSample'))
                  : t('exceptionReasonNone');
                const descriptionText = exceptionMeta.hasException ? exceptionMeta.comment : (file.description || '');
                return `
              <div class="evidence-existing-item" style="border:1px solid #e5e7eb; border-radius:8px; padding:12px; margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; flex-wrap:wrap;">
                  <div><strong>${escapeHtml(file.fileName || (isExceptionEvidenceRow(file) ? t('exceptionSubmitted') : ''))}</strong></div>
                  <div class="mono">${file.fileId && !isExceptionEvidenceRow(file) ? `<button type="button" class="ghost-btn small-btn" data-evidence-download="${escapeHtml(file.fileId)}">${escapeHtml(t('download'))}</button>` : '-'}</div>
                </div>
                <div class="kv-list" style="margin-top:10px; grid-template-columns:140px 1fr; row-gap:8px;">
                  <div>${escapeHtml(t('exceptionReasonLabel'))}</div><div>${escapeHtml(exceptionReasonLabel)}</div>
                  <div>${escapeHtml(t('descriptionLabel'))}</div><div>${escapeHtml(descriptionText || '-')}</div>
                  <div>${escapeHtml(t('uploadDate'))}</div><div>${escapeHtml(formatDateTime(file.uploadedAt) || '-')}</div>
                </div>
              </div>
            `}).join('')
            : `<div class="readonly-cell muted">${escapeHtml(t('noEvidenceRegistered'))}</div>`
        }
      </div>
    </div>

    ${readOnlyManagerView ? '' : `
    <hr style="margin:16px 0;" />

    <div id="evidenceEntryWrap">
      <div class="evidence-entry" data-evidence-entry="1" style="border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:12px;">
        <div class="field-group">
          <label>${escapeHtml(t('attachment'))}</label>
          <div style="display:flex; align-items:center; gap:10px;">
            <label class="ghost-btn small-btn" style="display:inline-flex; align-items:center; cursor:pointer;">${escapeHtml(isEnglish() ? 'Choose File' : '파일 선택')}<input type="file" data-evidence-file accept=".pdf,.doc,.docx,.xls,.xlsx,.xlsm,.csv,.ppt,.pptx,.txt,.png,.jpg,.jpeg" style="display:none;" /></label>
            <div class="readonly-cell muted" data-evidence-file-name>${escapeHtml(t('noFileSelected'))}</div>
          </div>
        </div>
        <div class="field-group" style="margin-top:10px;">
          <label>${escapeHtml(t('exceptionReasonLabel'))}</label>
          <select class="field-input" data-evidence-exception-reason>
            <option value="">${escapeHtml(t('exceptionReasonPlaceholder'))}</option>
            <option value="none">${escapeHtml(t('exceptionReasonNone'))}</option>
            <option value="no_occurrence">${escapeHtml(t('exceptionReasonNoOccurrence'))}</option>
            <option value="less_than_sample">${escapeHtml(t('exceptionReasonLessThanSample'))}</option>
          </select>
        </div>
        <div class="field-group" style="margin-top:10px;">
          <label>${escapeHtml(t('descriptionLabel'))}</label>
          <input class="field-input" data-evidence-description placeholder="${escapeHtml(t('evidenceDescriptionPlaceholder'))}" />
        </div>
        <div class="readonly-cell muted" style="margin-top:8px;">${escapeHtml(t('exceptionCommentHelp'))}</div>
      </div>
    </div>

    <div class="modal-actions" style="justify-content:space-between;">
      <button type="button" id="addEvidenceRowBtn" class="ghost-btn">${escapeHtml(t('addRow'))}</button>
      <div style="display:flex; gap:8px;">
        <button type="button" id="evidenceSaveBtn" class="primary-btn">${escapeHtml(t('save'))}</button>
      </div>
    </div>
    `}
  `);

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.querySelectorAll('#evidenceExistingList [data-evidence-download]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await downloadEvidenceFileById(btn.getAttribute('data-evidence-download'));
    });
  });
  if (readOnlyManagerView) return;

  function bindEvidenceFilePreview(scope) {
    (scope || document).querySelectorAll('[data-evidence-file]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        const box = e.target.closest('.field-group')?.querySelector('[data-evidence-file-name]');
        if (box) box.textContent = file ? file.name : t('noFileSelected');
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
        <label>${escapeHtml(t('attachment'))}</label>
        <div style="display:flex; align-items:center; gap:10px;">
          <label class="ghost-btn small-btn" style="display:inline-flex; align-items:center; cursor:pointer;">${escapeHtml(isEnglish() ? 'Choose File' : '파일 선택')}<input type="file" data-evidence-file accept=".pdf,.doc,.docx,.xls,.xlsx,.xlsm,.csv,.ppt,.pptx,.txt,.png,.jpg,.jpeg" style="display:none;" /></label>
          <div class="readonly-cell muted" data-evidence-file-name>${escapeHtml(t('noFileSelected'))}</div>
        </div>
      </div>
      <div class="field-group" style="margin-top:10px;">
        <label>${escapeHtml(t('descriptionLabel'))}</label>
        <input class="field-input" data-evidence-description placeholder="${escapeHtml(t('evidenceDescriptionPlaceholder'))}" />
      </div>
      <div style="margin-top:10px;">
        <button type="button" class="danger-btn small-btn" data-remove-evidence-row="1">${escapeHtml(t('removeRow'))}</button>
      </div>
    `;

    wrap.appendChild(div);
    bindEvidenceFilePreview(div);

    div.querySelector('[data-remove-evidence-row]').addEventListener('click', () => {
      const rows = document.querySelectorAll('[data-evidence-entry="1"]');
      if (rows.length <= 1) {
        alert(t('minimumOneRowRequired'));
        return;
      }
      div.remove();
    });
  });

  document.getElementById('evidenceSaveBtn').addEventListener('click', async () => {
    if (!canUploadMonitoringEvidence()) {
      blockMonitoringUploadAction();
      return;
    }

    const rawEntries = Array.from(document.querySelectorAll('[data-evidence-entry="1"]'))
      .map((el) => {
        const fileInput = el.querySelector('[data-evidence-file]');
        const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
        const exceptionReason = el.querySelector('[data-evidence-exception-reason]')?.value || '';
        const descriptionComment = el.querySelector('[data-evidence-description]')?.value?.trim() || '';
        const normalizedReason = exceptionReason === 'none' ? '' : exceptionReason;
        const description = buildExceptionDescription(normalizedReason, descriptionComment);

        return {
          file,
          fileName: file ? file.name : '',
          fileLink: '',
          exceptionReason: normalizedReason,
          descriptionComment,
          description
        };
      });

    const realFileCount = rawEntries.filter(item => item.file).length;
    const requiresExceptionReason = realFileCount === 0;

    const hasInvalidExceptionSelection = rawEntries.some(item => !item.file && !item.exceptionReason && item.descriptionComment);
    if (hasInvalidExceptionSelection) {
      alert(t('descriptionWithoutFileAlert'));
      return;
    }

    if (requiresExceptionReason && !rawEntries.some(item => !!item.exceptionReason)) {
      alert(t('exceptionNoSelectionAlert'));
      return;
    }

    const entries = rawEntries.filter(item => item.file || item.exceptionReason);

    if (!entries.length) {
      alert(t('minimumOneFileRequired'));
      return;
    }

    state.db.monitoring_evidence_files = state.db.monitoring_evidence_files || [];

    try {
      const uploadedFiles = [];
      const uploadTime = nowIso();

      if (!record.createdAt) record.createdAt = uploadTime;
      if (!record.createdBy) record.createdBy = state.currentUser?.userId || '';
      record.updatedAt = uploadTime;
      record.updatedBy = state.currentUser?.userId || '';

      for (const item of entries) {
        const targetMonth = inferEvidenceTargetMonth(control, record);
        if (item.file) {
          const uploaded = await uploadEvidenceFileToSupabase(record, control, risk, item.file);
          const fileRow = {
            fileId: generateUniqueEvidenceFileId(),
            recordId: record.recordId,
            controlId: record.controlId,
            riskId: record.riskId,
            year: record.year,
            quarter: record.quarter,
            targetMonth,
            fileName: uploaded.fileName,
            fileLink: uploaded.fileLink,
            storagePath: uploaded.storagePath,
            description: item.description,
            uploadedBy: state.currentUser?.userId || '',
            uploadedAt: uploadTime,
            isDeleted: false,
            createdAt: uploadTime,
            createdBy: state.currentUser?.userId || '',
            updatedAt: uploadTime,
            updatedBy: state.currentUser?.userId || ''
          };
          uploadedFiles.push(fileRow);
          continue;
        }

        if (item.exceptionReason) {
          const fileRow = {
            fileId: generateUniqueEvidenceFileId(),
            recordId: record.recordId,
            controlId: record.controlId,
            riskId: record.riskId,
            year: record.year,
            quarter: record.quarter,
            targetMonth,
            fileName: t('exceptionSubmitted'),
            fileLink: '',
            storagePath: '',
            description: item.description,
            uploadedBy: state.currentUser?.userId || '',
            uploadedAt: uploadTime,
            isDeleted: false,
            createdAt: uploadTime,
            createdBy: state.currentUser?.userId || '',
            updatedAt: uploadTime,
            updatedBy: state.currentUser?.userId || ''
          };
          uploadedFiles.push(fileRow);
        }
      }

      await insertMonitoringEvidenceFilesToSupabase(uploadedFiles);

      uploadedFiles.forEach(fileRow => {
        state.db.monitoring_evidence_files.push(fileRow);
      });

      record.evidenceFile = uploadedFiles.find(item => !isExceptionEvidenceRow(item))?.fileName || uploadedFiles[0]?.fileName || record.evidenceFile || '';
      record.uploadedAt = uploadTime;
      record.submissionStatus = '제출완료';

      await upsertMonitoringRecordToSupabase(record);
      await refreshMonitoringDataFromSupabase();

      appendLog('monitoring', record.recordId, 'upload', null, {
        year: record.year,
        quarter: record.quarter,
        files: uploadedFiles.map(item => ({
          fileName: item.fileName,
          fileLink: item.fileLink,
          description: item.description
        }))
      });

      persistDatabase();
      persistUiState();
      state.isDirty = false;
      render();
      closeModal();
      alert(t('evidenceUploadSuccess'));
    } catch (error) {
      console.error(error);
      alert(t('evidenceUploadError', { message: error.message || error }));
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
    treeRoot.innerHTML = html || `<div class="empty-state">${escapeHtml(t('noFoldersToDisplay'))}</div>`;

    treeRoot.querySelectorAll('[data-folder-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedFolderId = btn.getAttribute('data-folder-id');
        state.selectedRiskId = null;
        state.heatmapFilter = null;
        state.heatmapPreviousFolderId = null;
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
        if (!canManageRcm()) return blockRcmAction();
        openFolderModal(btn.getAttribute('data-add-child'));
      });
    });

    treeRoot.querySelectorAll('[data-delete-folder]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!canManageRcm()) return blockRcmAction();
        deleteFolder(btn.getAttribute('data-delete-folder'));
      });
    });

    treeRoot.querySelectorAll('[data-edit-folder]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!canManageRcm()) return blockRcmAction();
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
        state.heatmapPreviousFolderId = null;
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
            <button class="icon-btn" title="${escapeHtml(t('tooltipAddChildFolder'))}" data-add-child="${folder.folderId}">+</button>
            <button class="icon-btn" title="${escapeHtml(t('tooltipEditFolder'))}" data-edit-folder="${folder.folderId}">✎</button>
            <button class="icon-btn delete" title="${escapeHtml(t('tooltipDeleteFolder'))}" data-delete-folder="${folder.folderId}">🗑</button>
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
    return getVisibleRisks()
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
      tbody.innerHTML = `<tr><td colspan="${columns.length}" class="empty-state">${escapeHtml(t('noItemsMatch'))}</td></tr>`;
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
        <td>${renderEditableCell('control', control?.controlId, 'controlName', control?.controlName || '', true)}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlContent', control?.controlContent || '', true)}</td>
        <td>${renderControlTypeCell(control)}</td>
        <td>${renderControlOperationTypeCell(control)}</td>
        <td>${renderControlFrequencyCell(control)}</td>
        <td>${renderEditableCell('control', control?.controlId, 'controlDepartment', control?.controlDepartment || '')}</td>
        <td>${renderControlOwnerCell(control)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'residualLikelihood', risk.residualLikelihood)}</td>
        <td>${renderRatingSelectCell('risk', risk.riskId, 'residualImpact', risk.residualImpact)}</td>
        <td class="readonly-cell">${renderBadge(risk.residualRating)}</td>
        <td>${renderStatusCell(risk, control)}</td>
        <td>${renderActionsCell(risk, control)}</td>
      </tr>
    `).join('');

    bindTableEvents();
  }

  function bindTableEvents() {
    document.querySelectorAll('[data-field-input]').forEach((el) => {
      el.addEventListener('change', async () => {
        if (!canManageRcm()) return blockRcmAction();
        await updateField(el.dataset.targetType, el.dataset.targetId, el.dataset.field, el.value);
      });
    });

    document.querySelectorAll('[data-control-frequency-select]').forEach((el) => {
      el.addEventListener('change', async () => {
        if (!canEdit()) return blockViewerAction();
        const controlId = el.dataset.targetId;
        const frequency = el.value;
        const suggestedMonths = getSuggestedControlMonths(frequency);
        await updateControlFrequencyAndMonths(controlId, frequency, suggestedMonths);
      });
    });

    document.querySelectorAll('[data-inline-control-month]').forEach((el) => {
      el.addEventListener('click', async () => {
        if (!canEdit()) return blockViewerAction();
        const controlId = el.dataset.controlId;
        const month = Number(el.dataset.month || 0);
        await toggleInlineControlMonth(controlId, month);
      });
    });

    document.querySelectorAll('[data-rating-btn]').forEach((el) => {
      el.addEventListener('click', async () => {
        if (!canEdit()) return blockViewerAction();
        await updateField(el.dataset.targetType, el.dataset.targetId, el.dataset.field, el.dataset.value);
      });
    });

    document.querySelectorAll('[data-control-owner-select]').forEach((el) => {
      el.addEventListener('change', async () => {
        if (!canEdit()) return blockViewerAction();
        await updateControlOwnerAssignment(el.dataset.controlId, el.value);
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
    setTimeout(() => autoResizeTextareas(document), 80);
    setTimeout(() => autoResizeTextareas(document), 180);
    setTimeout(() => autoResizeTextareas(document), 320);
  }

  function autoResizeTextareas(scope = document) {
    const textareas = Array.from(scope.querySelectorAll('textarea.cell-textarea, textarea.field-input'));

    const resize = (el) => {
      if (!el) return;
      el.style.setProperty('overflow-y', 'hidden', 'important');
      el.style.setProperty('height', 'auto', 'important');
      el.style.setProperty('height', `${Math.max(el.scrollHeight, 140)}px`, 'important');
    };

    textareas.forEach((el) => {
      resize(el);

      if (!el.dataset.autoresizeBound) {
        el.addEventListener('input', () => resize(el));
        el.addEventListener('change', () => resize(el));
        el.addEventListener('focus', () => resize(el));
        el.dataset.autoresizeBound = 'Y';
      }
    });

    requestAnimationFrame(() => textareas.forEach((el) => resize(el)));
    setTimeout(() => textareas.forEach((el) => resize(el)), 0);
    setTimeout(() => textareas.forEach((el) => resize(el)), 80);
    setTimeout(() => textareas.forEach((el) => resize(el)), 180);
    setTimeout(() => textareas.forEach((el) => resize(el)), 320);
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
  const likelihoodRows = isEnglish() ? [
    ['1', 'Low', 'Occurrence is practically impossible or there are no similar past violation cases.'],
    ['2', 'Lower-Medium', 'Occurrence is unlikely, limited to extremely rare exceptions, or there are almost no similar past cases.'],
    ['3', 'Medium', 'May occur under certain conditions or situations, and future occurrence is possible.'],
    ['4', 'Medium-High', 'Has a high chance of recurring periodically, or there are multiple similar past cases.'],
    ['5', 'High', 'Occurrence is highly likely or expected in nearly all applicable cases.']
  ] : [
    ['1', 'Low', '사실상 발생 불가능 or 과거 유사 위반사례 전무'],
    ['2', 'Lower-Medium', '발생 가능성 희박 or 극히 드문 예외적 상황에서만 발생 or 과거 유사 위반사례 거의 없음'],
    ['3', 'Medium', '특정 조건 및 상황에서 발생가능 or 향후 발생 가능성 있음'],
    ['4', 'Medium-High', '반복 · 주기적으로 발생소지 높음 or 과거 유사 위반사례 다수 존재'],
    ['5', 'High', '발생이 거의 확실 or 거의 모든 경우에 발생할 것으로 예상']
  ];

  const severityRows = isEnglish() ? [
    ['1', 'Low', 'Limited to internal corrective action level, with little to no financial or reputational damage.'],
    ['2', 'Lower-Medium', 'Minor sanctions such as caution or warning, limited financial loss, or low external exposure.'],
    ['3', 'Medium', 'Administrative fines or surcharges, ordinary damages, or a noticeable decline in external reputation.'],
    ['4', 'Medium-High', 'Maximum criminal fine, significant surcharges or damages, or expanded media and reputational risk.'],
    ['5', 'High', 'Maximum imprisonment, large-scale or punitive damages, business suspension, or market exit.']
  ] : [
    ['1', 'Low', '내부 시정 조치 수준 or 금전 · 평판 피해 거의 없음'],
    ['2', 'Lower-Medium', '경미한 제재(주의, 경고 등) or 제한적 금전적 손실 발생 or 대외 노출 적음'],
    ['3', 'Medium', '과태료 또는 과징금 부과 or 일반적 손해배상 발생 or 일정 수준의 대외 인지도 하락'],
    ['4', 'Medium-High', '최대 벌금형 부과 or 상당한 규모의 과징금 or 손해배상 발생 or 언론 보도 및 평판 리스크 확대'],
    ['5', 'High', '최대 징역형 부과 or 대규모 손해배상 또는 징벌적 손해배상 발생 or 사업 중단 또는 시장 퇴출']
  ];

  const rows = type === 'severity' ? severityRows : likelihoodRows;
  const title = type === 'severity' ? (isEnglish() ? 'Severity' : `${t('resultSeverity')} / Severity`) : (isEnglish() ? 'Likelihood' : `${t('likelihoodKo')} / Likelihood`);

  return `
    <div class="risk-help-popover-card ${type === 'severity' ? 'severity' : 'likelihood'}">
      <div class="risk-help-popover-title">${title}</div>
      <div class="risk-help-popover-table-wrap">
        <table class="risk-help-popover-table">
          <thead>
            <tr>
              <th>${escapeHtml(t('score'))}</th>
              <th>${escapeHtml(t('grade'))}</th>
              <th>${escapeHtml(t('criteria'))}</th>
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
        <strong>${escapeHtml(t('gradingMethod'))}</strong><br>
        ${escapeHtml(t('gradingMethodDesc'))}
      </div>
    </div>
  `;
}

function renderRiskHelpLabel(labelText, helpType) {
  return `${escapeHtml(labelText)} <button type="button" class="help-icon-btn risk-help-trigger" data-risk-help="${helpType}" title="${escapeHtml(t('tooltipRiskCriteria'))}">?</button>`;
}

function bindRiskHelpPopovers(scope = document) {
  const root = scope || document;

  const closeAll = () => {
    document.querySelectorAll('.risk-help-popover').forEach((el) => {
      if (typeof el._cleanup === 'function') el._cleanup();
      el.remove();
    });
    document.querySelectorAll('[data-risk-help]').forEach((btn) => btn.classList.remove('is-open'));
  };

  const positionPopover = (button, popover) => {
    const rect = button.getBoundingClientRect();
    const margin = 10;

    popover.style.position = 'fixed';
    popover.style.top = '0px';
    popover.style.left = '0px';
    popover.style.visibility = 'hidden';
    document.body.appendChild(popover);

    const popRect = popover.getBoundingClientRect();
    let top = rect.bottom + margin;
    let left = rect.left;

    if (left + popRect.width > window.innerWidth - margin) {
      left = window.innerWidth - popRect.width - margin;
    }
    if (left < margin) left = margin;

    if (top + popRect.height > window.innerHeight - margin) {
      top = rect.top - popRect.height - margin;
    }
    if (top < margin) top = margin;

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.style.visibility = 'visible';
  };

  root.querySelectorAll('[data-risk-help]').forEach((button) => {
    if (button.dataset.helpBound === 'Y') return;
    button.dataset.helpBound = 'Y';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const owner = button.dataset.riskHelp || 'likelihood';
      const alreadyOpen = button.classList.contains('is-open');
      closeAll();
      if (alreadyOpen) return;

      const popover = document.createElement('div');
      popover.className = 'risk-help-popover';
      popover.dataset.owner = owner;
      popover.innerHTML = getRiskCriteriaPopoverContent(owner);
      button.classList.add('is-open');
      positionPopover(button, popover);

      const reposition = () => {
        if (document.body.contains(popover)) positionPopover(button, popover);
      };
      window.addEventListener('resize', reposition, { passive: true });
      window.addEventListener('scroll', reposition, { passive: true });

      popover._cleanup = () => {
        window.removeEventListener('resize', reposition);
        window.removeEventListener('scroll', reposition);
      };
    });
  });

  if (!document.body.dataset.riskHelpBodyBound) {
    document.body.dataset.riskHelpBodyBound = 'Y';
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.risk-help-popover') && !event.target.closest('[data-risk-help]')) {
        closeAll();
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
  if (!canEdit()) return `<div class="readonly-cell">${escapeHtml(getControlTypeDisplayLabel(value))}</div>`;
  return `
    <select class="cell-select" data-field-input="1" data-target-type="control" data-target-id="${control.controlId}" data-field="controlType">
      ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${escapeHtml(getControlTypeDisplayLabel(v))}</option>`).join('')}
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
      ${options.map((v) => `<option value="${v}" ${value === v ? 'selected' : ''}>${escapeHtml(v)}</option>`).join('')}
    </select>
  `;
}

function renderControlFrequencyCell(control) {
  const value = control?.controlFrequency || '';
  const normalizedValue = normalizeFrequency(value);
  const options = [
    '상시',
    '건별',
    '일별',
    '주별',
    '월별',
    '분기별',
    '반기별',
    '연간'
  ];

  if (!control?.controlId) return `<div class="readonly-cell"></div>`;

  if (!canEdit()) {
    return `
      <div class="readonly-cell">${escapeHtml(getFrequencyDisplayLabel(value || ''))}</div>
      <div class="inline-control-months readonly">
        ${formatControlMonths(control.controlMonths || [])}
      </div>
    `;
  }

  const selectedMonths = normalizeControlMonths(control.controlMonths);
  return `
    <div class="inline-frequency-editor">
      <select class="cell-select" data-control-frequency-select="1" data-target-id="${control.controlId}">
        ${options.map((v) => `<option value="${v}" ${normalizedValue === normalizeFrequency(v) ? 'selected' : ''}>${escapeHtml(getFrequencyDisplayLabel(v))}</option>`).join('')}
      </select>
      <div class="inline-control-months">
        ${Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const active = selectedMonths.includes(month);
          return `<button type="button" class="inline-month-btn ${active ? 'active' : ''}" data-inline-control-month="1" data-control-id="${control.controlId}" data-month="${month}">${escapeHtml(getMonthShortLabel(month))}</button>`;
        }).join('')}
      </div>
      <div class="inline-control-months-help">${escapeHtml(t('scheduleMonthHelp'))}</div>
    </div>
  `;
}

function renderControlOwnerCell(control) {
  if (!control?.controlId) return `<div class="readonly-cell"></div>`;

  const assignedEmail = inferAssignedUserEmailForRisk(control.riskId, control.controlOwnerName || '', control);
  const assignedLabel = getAssignedUserLabel(assignedEmail, assignedEmail || '-');
  const users = getAssignableUsers();

  if (!canEdit()) {
    return `
      <div class="owner-assignment-cell">
        <div class="readonly-cell owner-name-display">${escapeHtml(control.controlOwnerName || '')}</div>
        <div class="owner-assignment-meta">${escapeHtml(t('assignedUserMeta'))}: ${escapeHtml(assignedLabel || '-')}</div>
      </div>
    `;
  }

  if (!users.length) {
    return `
      <div class="owner-assignment-cell">
        <div class="readonly-cell owner-name-display">${escapeHtml(control.controlOwnerName || '')}</div>
        <div class="warning-box">${escapeHtml(t('assignableUsersLoadFailed'))}</div>
      </div>
    `;
  }

  return `
    <div class="owner-assignment-cell">
      <div class="readonly-cell owner-name-display">${escapeHtml(control.controlOwnerName || '')}</div>
      <select class="cell-select" data-control-owner-select="1" data-control-id="${control.controlId}">
        ${users.map((user) => `<option value="${escapeHtml(user.email)}" ${assignedEmail === user.email ? 'selected' : ''}>${escapeHtml(user.displayName || user.email)}</option>`).join('')}
      </select>
      <div class="owner-assignment-meta">${escapeHtml(t('ownerAssignmentHelp'))}</div>
    </div>
  `;
}

function renderStatusCell(risk, control) {
  const options = ['Open', 'Mitigated', 'Closed'];
  const targetType = control?.controlId ? 'control' : 'risk';
  const targetId = control?.controlId || risk.riskId;
  const currentStatus = control?.controlId ? (control.status || 'Open') : (risk.status || '');
  if (!canEdit()) return `<div class="readonly-cell">${escapeHtml(currentStatus ?? '')}</div>`;
  return `
    <select class="cell-select" data-field-input="1" data-target-type="${targetType}" data-target-id="${targetId}" data-field="status">
      ${options.map((v) => `<option value="${v}" ${currentStatus === v ? 'selected' : ''}>${v}</option>`).join('')}
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
      <h3>${escapeHtml(parent ? t('addChildFolderTitle') : t('addRootFolderTitle'))}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>
    <div class="field-group">
      <label>${escapeHtml(t('folderNameLabel'))}</label>
      <input id="folderNameInput" class="field-input" placeholder="${escapeHtml(t('folderNamePlaceholder'))}" />
    </div>
    <div class="help-text" style="margin-top:12px;">
      ${parent ? `${escapeHtml(t('selectedParentFolder'))}: <strong>${escapeHtml(parent.folderName)}</strong>` : t('noFolderCreateAsRoot')}
    </div>
    <div class="warning-box" style="margin-top:12px;">
      ${escapeHtml(t('managerFolderOnly'))}
    </div>
    <div class="modal-actions">
      <button id="folderCreateBtn" class="primary-btn">${escapeHtml(t('createBtn'))}</button>
    </div>
  `);

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('folderCreateBtn').addEventListener('click', () => {
    const name = document.getElementById('folderNameInput').value.trim();
    if (!name) {
      alert(t('enterFolderName'));
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
      <h3>${escapeHtml(t('editFolderNameTitle'))}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>
    <div class="field-group">
      <label>${escapeHtml(t('currentFolderName'))}</label>
      <input class="field-input" value="${escapeHtml(folder.folderName)}" disabled />
    </div>
    <div class="field-group" style="margin-top:12px;">
      <label>${escapeHtml(t('newFolderName'))}</label>
      <input id="folderRenameInput" class="field-input" value="${escapeHtml(folder.folderName)}" />
    </div>
    <div class="warning-box" style="margin-top:12px;">
      ${escapeHtml(t('folderRenameHelp'))}
    </div>
    <div class="modal-actions">
      <button id="folderRenameBtn" class="primary-btn">${escapeHtml(t('edit'))}</button>
    </div>
  `);

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('folderRenameBtn').addEventListener('click', () => {
    const newName = document.getElementById('folderRenameInput').value.trim();
    if (!newName) {
      alert(t('enterNewFolderName'));
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
      <h3>${escapeHtml(t('moveRiskTitle'))}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>
    <div class="kv-list" style="margin-bottom:16px;">
      <div>Risk Code</div><div class="mono">${escapeHtml(getDisplayRiskCode(risk.riskId))}</div>
      <div>${escapeHtml(t('currentFolder'))}</div><div>${escapeHtml(buildFolderPath(risk.folderId).join(' > '))}</div>
    </div>
    <div class="field-group">
      <label>${escapeHtml(t('targetFolder'))}</label>
      ${options.length ? `
        <select id="moveRiskFolderSelect" class="field-select">
          ${options.map((item) => `<option value="${item.folderId}">${escapeHtml(item.label)}</option>`).join('')}
        </select>
      ` : `<div class="warning-box">${escapeHtml(t('noMovableFolder'))}</div>`}
    </div>
    <div class="warning-box" style="margin-top:12px;">
      ${escapeHtml(t('moveRiskHelp'))}
    </div>
    <div class="modal-actions">
      <button id="riskMoveConfirmBtn" class="primary-btn" ${options.length ? '' : 'disabled'}>${escapeHtml(t('move'))}</button>
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
      <h3>${escapeHtml(isEnglish() ? 'Add Risk' : 'Risk 추가')}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>
    <div class="kv-list" style="margin-bottom:16px;">
      <div>${escapeHtml(isEnglish() ? 'Target Folder' : '대상 폴더')}</div><div>${escapeHtml(buildFolderPath(folder.folderId).join(' > '))}</div>
      <div>${escapeHtml(isEnglish() ? 'Code Format' : '코드 형식')}</div><div class="mono">R-SC-01-01 / C-SC-01-01-01</div>
    </div>

    <div class="modal-grid three">
      <div class="field-group">
        <label>${escapeHtml(isEnglish() ? t('process') : '프로세스')}</label>
        <input id="departmentNameInput" class="field-input" value="${escapeHtml(defaultDept)}" />
      </div>
      <div class="field-group">
        <label>${escapeHtml(isEnglish() ? 'Department Abbr.' : '부서 약자')}</label>
        <input id="teamCodeInput" class="field-input" placeholder="${escapeHtml(isEnglish() ? 'e.g. SC' : '예: SC')}" />
      </div>
      <div class="field-group">
        <label>${escapeHtml(isEnglish() ? 'Category Code' : '구분 코드')}</label>
        <input id="lawCodeInput" class="field-input" placeholder="${escapeHtml(isEnglish() ? 'e.g. 01' : '예: 01')}" value="01" />
      </div>

      <div class="field-group field-span-3">
        <label>${escapeHtml(t('referenceLawLabel'))}</label>
        <input id="referenceLawInput" class="field-input" placeholder="${escapeHtml(isEnglish() ? 'e.g. Local tax law' : '예: 하도급법')}" />
      </div>
      <div class="field-group field-span-3">
        <label>${escapeHtml(t('regulationDetailLabel'))}</label>
        <textarea id="regulationDetailInput" class="field-input"></textarea>
      </div>
      <div class="field-group field-span-3">
        <label>${escapeHtml(t('sanctionLabel'))}</label>
        <textarea id="sanctionInput" class="field-input"></textarea>
      </div>
      <div class="field-group field-span-3">
        <label>${escapeHtml(t('riskContentLabel'))}</label>
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
        <label>${renderRiskHelpLabel(t('inherentRiskLikelihood'), 'likelihood')}</label>
        ${renderModalRatingPicker('inhLikelihoodInput', 3)}
      </div>
      <div class="field-group">
        <label>${renderRiskHelpLabel(t('inherentRiskImpact'), 'severity')}</label>
        ${renderModalRatingPicker('inhImpactInput', 3)}
      </div>

    </div>
    <div class="warning-box" style="margin-top:16px;">
      ${t('riskCodeAutoMessage')}
    </div>

    <div class="modal-actions">
      <button id="riskCreateBtn" type="button" class="primary-btn">${escapeHtml(t('add'))}</button>
    </div>
  `);

  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const riskCreateBtn = document.getElementById('riskCreateBtn');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  bindModalRatingPickers();
  bindRiskHelpPopovers(document.getElementById('modalRoot'));

  if (riskCreateBtn) {
    riskCreateBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();

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

      console.log('[Risk Modal] Add clicked', payload);

      if (!payload.teamCode) {
        alert(t('departmentAbbrRequired'));
        return;
      }
      if (!payload.referenceLaw) {
        alert(t('referenceLawRequired'));
        return;
      }
      if (!payload.riskContent) {
        alert(t('riskContentRequired'));
        return;
      }

      const originalLabel = riskCreateBtn.textContent;
      riskCreateBtn.disabled = true;
      riskCreateBtn.textContent = isEnglish() ? 'Saving...' : '저장 중...';

      try {
        const created = await createRisk(payload);
        console.log('[Risk Modal] createRisk result:', created);

        if (created) {
          closeModal();
        }
      } catch (error) {
        console.error('[Risk Modal] Unexpected createRisk error:', error);
        alert(`Risk 저장 중 예기치 못한 오류가 발생했습니다.\n${error?.message || error}`);
      } finally {
        if (document.body.contains(riskCreateBtn)) {
          riskCreateBtn.disabled = false;
          riskCreateBtn.textContent = originalLabel;
        }
      }
    });
  }
}

function renderAssignableUserOptions(selectedEmail = '') {
  const users = getAssignableUsers();
  if (!users.length) {
    return `<option value="">${escapeHtml(t('noAssignableUser'))}</option>`;
  }
  return users.map((user) => `
    <option value="${escapeHtml(user.email)}" ${selectedEmail === user.email ? 'selected' : ''}>${escapeHtml(user.displayName || user.email)}</option>
  `).join('');
}

function openControlModal(riskId) {
  const risk = getRiskById(riskId);
  if (!risk) return;

  openModal(`
    <div class="modal-header">
      <h3>${escapeHtml(t('addControlTitle'))}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>

    <div class="kv-list" style="margin-bottom:16px;">
      <div>Risk Code</div><div class="mono">${escapeHtml(risk.riskId)}</div>
      <div>${escapeHtml(t('controlProcessLabel'))}</div><div>${escapeHtml(risk.departmentName || '')}</div>
      <div>${escapeHtml(t('controlApplicableRegulationLabel'))}</div><div>${escapeHtml(risk.referenceLaw || '')}</div>
    </div>

    <div class="modal-grid three">
      <div class="field-group field-span-3">
        <label>${escapeHtml(t('controlNameModalLabel'))}</label>
        <input id="controlNameInput" class="field-input" />
      </div>
      <div class="field-group field-span-3">
        <label>${escapeHtml(t('controlContentModalLabel'))}</label>
        <textarea id="controlContentInput" class="field-input"></textarea>
      </div>
      <div class="field-group">
        <label>${escapeHtml(t('controlTypeModalLabel'))}</label>
        <select id="controlTypeInput" class="field-select">
          <option value="승인">${escapeHtml(t('controlTypeApproval'))}</option>
          <option value="권한부여">${escapeHtml(t('controlTypeAuthorization'))}</option>
          <option value="업무분장">${escapeHtml(t('controlTypeSegregation'))}</option>
          <option value="감독 및 모니터링">${escapeHtml(t('controlTypeMonitoring'))}</option>
          <option value="대사 및 검증">${escapeHtml(t('controlTypeReconciliation'))}</option>
          <option value="확인서 징구">${escapeHtml(t('controlTypeConfirmation'))}</option>
          <option value="교육실시">${escapeHtml(t('controlTypeTraining'))}</option>
          <option value="기타">${escapeHtml(t('controlTypeOther'))}</option>
        </select>
      </div>
      <div class="field-group">
        <label>${escapeHtml(t('controlExecutionTypeModalLabel'))}</label>
        <select id="controlOperationTypeInput" class="field-select">
          <option>Auto</option>
          <option selected>Manual</option>
        </select>
      </div>
      <div class="field-group">
        <label>${escapeHtml(t('controlFrequencyModalLabel'))}</label>
        <select id="controlFrequencyInput" class="field-select">
          <option value="상시">${escapeHtml(getFrequencyDisplayLabel('상시'))}</option>
          <option value="건별">${escapeHtml(getFrequencyDisplayLabel('건별'))}</option>
          <option value="일별">${escapeHtml(getFrequencyDisplayLabel('일별'))}</option>
          <option value="주별">${escapeHtml(getFrequencyDisplayLabel('주별'))}</option>
          <option value="월별">${escapeHtml(getFrequencyDisplayLabel('월별'))}</option>
          <option value="분기별">${escapeHtml(getFrequencyDisplayLabel('분기별'))}</option>
          <option value="반기별">${escapeHtml(getFrequencyDisplayLabel('반기별'))}</option>
          <option value="연간">${escapeHtml(getFrequencyDisplayLabel('연간'))}</option>
        </select>
      </div>
      <div class="field-group field-span-3">
        <label>${escapeHtml(t('scheduledMonthsLabel'))}</label>
        <div id="controlMonthsWrap" style="display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:8px;">
          ${Array.from({ length: 12 }, (_, i) => `
            <button type="button"
              class="ghost-btn small-btn"
              data-control-month="${i + 1}"
              style="width:100%; padding:8px 6px;"
            >${isEnglish() ? escapeHtml(getMonthShortLabel(i + 1)) : `${i + 1}월`}</button>
          `).join('')}
        </div>
        <input type="hidden" id="controlMonthsInput" value="" />
        <div class="help-text">${escapeHtml(t("scheduleMonthHelp"))}</div>
      </div>
      <div class="field-group">
        <label>${escapeHtml(t('teamNameLabel'))}</label>
        <input id="controlDepartmentInput" class="field-input" value="${escapeHtml(inferTeamName(risk.folderId) || '')}" />
      </div>
      <div class="field-group">
        <label>${escapeHtml(t('ownerNameModalLabel'))}</label>
        <input id="controlOwnerNameInput" class="field-input" value="" placeholder="${escapeHtml(isEnglish() ? 'e.g. Jennifer Cook' : '예: Jennifer Cook')}" />
      </div>
      <div class="field-group">
        <label>${escapeHtml(t('assignedUserModalLabel'))}</label>
        <select id="controlAssignedUserInput" class="field-select">
          ${renderAssignableUserOptions(inferAssignedUserEmailForRisk(risk.riskId, '', null))}
        </select>
        <div class="help-text">${escapeHtml(t("selectOneAssignableUser"))}</div>
      </div>
      <div class="field-group field-span-3">
        <div class="control-residual-grid">
          <div class="field-group">
            <label>${renderRiskHelpLabel(t('residualRiskLikelihood'), 'likelihood')}</label>
            ${renderModalRatingPicker('controlResLikelihoodInput', risk.residualLikelihood || 2)}
          </div>
          <div class="field-group">
            <label>${renderRiskHelpLabel(t('residualRiskImpact'), 'severity')}</label>
            ${renderModalRatingPicker('controlResImpactInput', risk.residualImpact || 2)}
          </div>
        </div>
      </div>
      <div class="field-group">
        <label>Status</label>
        <select id="controlStatusInput" class="field-select">
          <option value="Open" ${String(risk.status || '') === 'Open' ? 'selected' : ''}>Open</option>
          <option value="Mitigated" ${String(risk.status || 'Mitigated') === 'Mitigated' ? 'selected' : ''}>Mitigated</option>
          <option value="Closed" ${String(risk.status || '') === 'Closed' ? 'selected' : ''}>Closed</option>
        </select>
      </div>
    </div>

    <div class="warning-box" style="margin-top:16px;">
      ${t('controlCodeAutoNote')}
    </div>

    <div class="modal-actions">
      <button id="controlCreateBtn" class="primary-btn">${escapeHtml(isEnglish() ? t('createBtn') : '추가')}</button>
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


  document.getElementById('controlCreateBtn').addEventListener('click', async () => {
    const payload = {
      controlName: document.getElementById('controlNameInput').value.trim(),
      controlContent: document.getElementById('controlContentInput').value.trim(),
      controlType: document.getElementById('controlTypeInput').value,
      controlOperationType: document.getElementById('controlOperationTypeInput').value,
      controlFrequency: document.getElementById('controlFrequencyInput').value,
      controlMonths: parseControlMonthsInput(document.getElementById('controlMonthsInput')?.value || ''),
      controlDepartment: document.getElementById('controlDepartmentInput').value.trim(),
      controlOwnerName: document.getElementById('controlOwnerNameInput').value.trim(),
      assignedUserEmail: document.getElementById('controlAssignedUserInput')?.value || '',
      residualLikelihood: Number(document.getElementById('controlResLikelihoodInput').value || 2),
      residualImpact: Number(document.getElementById('controlResImpactInput').value || 2),
      status: document.getElementById('controlStatusInput')?.value || 'Open',
      effectiveFromDate: '',
      closedAt: ''
    };

    if (!payload.controlName) {
      alert(isEnglish() ? 'Please enter the control name.' : 'Control 명을 입력해 주세요.');
      return;
    }

    if (!payload.assignedUserEmail) {
      alert(isEnglish() ? 'Please select the assigned user.' : '담당 User를 선택해 주세요.');
      return;
    }

    const ok = await createControl(riskId, payload);
    if (ok) closeModal();
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

  const now = nowIso();
  const userId = state.currentUser.userId;

  const { error } = await supabase
    .from('folders')
    .update({ is_deleted: true, updated_at: now, updated_by: userId })
    .in('folder_id', validation.subtree);

  if (error) {
    console.error('Folder delete failed:', error);
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


function withTimeout(promise, ms, label = 'Request') {
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timerId);
  });
}

async function createRisk(payload) {
  try {
    console.log('[createRisk] entered');

    if (!state.currentUser?.userId) {
      alert('로그인 사용자 정보가 올바르지 않습니다. 다시 로그인 후 시도해 주세요.');
      return false;
    }

    if (!state.selectedFolderId) {
      alert(t('selectFolderForRisk'));
      return false;
    }

    console.log('[createRisk] selectedFolderId:', state.selectedFolderId);

    const now = nowIso();
    const inherent = calculateRating(payload.inherentLikelihood, payload.inherentImpact);
    const residual = calculateRating(payload.residualLikelihood, payload.residualImpact);
    let riskId = generateRiskCode(payload.teamCode, payload.lawCode);

    const folder = getFolderById(state.selectedFolderId);
    const folderId = folder?.folderId || state.selectedFolderId;

    console.log('[createRisk] selectedFolder object:', folder);
    console.log('[createRisk] resolvedFolderId for insert:', folderId);

    const sessionResult = await supabase.auth.getSession();
    console.log('[createRisk] getSession done:', sessionResult);

    const accessToken = sessionResult?.data?.session?.access_token;
    console.log('[createRisk] accessToken exists:', !!accessToken);

    const authHeader = accessToken ? `Bearer ${accessToken}` : `Bearer ${SUPABASE_KEY}`;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const risk = {
        riskId,
        folderId,
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
        ownerUserId: state.currentUser.authId || state.currentUser.userId,
        inherentLikelihood: payload.inherentLikelihood,
        inherentImpact: payload.inherentImpact,
        inherentScore: inherent.score,
        inherentRating: inherent.rating,
        residualLikelihood: payload.residualLikelihood,
        residualImpact: payload.residualImpact,
        residualScore: residual.score,
        residualRating: residual.rating,
        status: payload.status,
        entity: inferEntity(folderId),
        country: 'KR',
        isDeleted: false,
        createdAt: now,
        createdBy: state.currentUser.authId || state.currentUser.userId,
        updatedAt: now,
        updatedBy: state.currentUser.authId || state.currentUser.userId
      };

      console.log('[createRisk][REST] insert attempt:', attempt + 1, risk);
      console.log('[createRisk] before REST fetch');

      const response = await withTimeout(
        fetch(`${SUPABASE_URL}/rest/v1/risks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: authHeader,
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
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
          })
        }),
        15000,
        'Risk REST insert'
      );

      console.log('[createRisk] after REST fetch response:', response?.status);

      if (response.ok) {
        state.db.risks.push(risk);
        appendLog('risk', risk.riskId, 'create', null, pickRiskLogFields(risk));
        closeModal();
        window.location.reload();
        return true;
      }

      const responseText = await response.text();
      console.error('[createRisk][REST] failed response:', response.status, responseText);
      const lowerText = String(responseText || '').toLowerCase();
      const isDuplicate = (
        response.status === 409 ||
        lowerText.includes('duplicate key') ||
        lowerText.includes('already exists') ||
        lowerText.includes('23505')
      );

      if (isDuplicate) {
        const match = String(riskId).match(/^R-([A-Z]+)-(\d{2})-(\d{2})$/);
        if (!match) {
          alert(`Risk 저장 실패
중복된 Risk Code가 감지되었지만 다음 코드를 생성할 수 없습니다.
${responseText}`);
          return false;
        }
        const [, teamCode, lawCode, seq] = match;
        riskId = `R-${teamCode}-${lawCode}-${pad2(Number(seq) + 1)}`;
        continue;
      }

      alert(`Risk 저장 실패
HTTP ${response.status}
${responseText}`);
      return false;
    }

    alert(`Risk 저장 실패
사용 가능한 Risk Code를 생성하지 못했습니다. 다시 시도해 주세요.`);
    return false;
  } catch (error) {
    console.error('Unexpected createRisk failure:', error);
    alert(`Risk 저장 중 예기치 못한 오류가 발생했습니다.
${error?.message || error}`);
    return false;
  }
}



async function createControl(riskId, payload) {
  const risk = getRiskById(riskId);
  if (!risk) return false;

  const now = nowIso();
  const controlCode = generateControlCode(risk);
  const residual = calculateRating(payload.residualLikelihood, payload.residualImpact);
  const assignedUser = findAssignableUserByEmail(payload.assignedUserEmail);

  if (!assignedUser?.userId) {
    alert('담당 User 정보가 올바르지 않습니다. 다시 선택해 주세요.');
    return false;
  }

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
    assignedUserId: assignedUser.userId,
    assignedUserEmail: assignedUser.email,
    status: payload.status || 'Open',
    effectiveFromDate: payload.effectiveFromDate || now.slice(0, 10),
    closedAt: payload.status === 'Closed' ? (payload.closedAt || now.slice(0, 10)) : '',
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
    alert(`Control 저장 실패\n${error.message || error}`);
    return false;
  }

  const riskPatch = {
    residual_likelihood: Number(payload.residualLikelihood || 0),
    residual_impact: Number(payload.residualImpact || 0),
    residual_score: residual.score,
    residual_rating: residual.rating,
    updated_at: now,
    updated_by: state.currentUser.userId
  };

  const { error: riskUpdateError } = await supabase
    .from('risks')
    .update(riskPatch)
    .eq('risk_id', riskId);

  if (riskUpdateError) {
    console.error("Risk residual update failed:", riskUpdateError);
    await supabase.from('controls').delete().eq('control_id', control.controlId);
    alert(`Control 저장 후 Risk 업데이트 실패\n${riskUpdateError.message || riskUpdateError}`);
    return false;
  }

  try {
    await syncRiskUserAccess(riskId, assignedUser.userId);
  } catch (accessError) {
    console.error('Risk access sync failed:', accessError);
    await supabase.from('controls').delete().eq('control_id', control.controlId);
    alert(`Control 저장 후 담당 User 권한 동기화 실패\n${accessError.message || accessError}`);
    return false;
  }

  state.db.controls.push(control);

  risk.residualLikelihood = Number(payload.residualLikelihood || 0);
  risk.residualImpact = Number(payload.residualImpact || 0);
  risk.residualScore = residual.score;
  risk.residualRating = residual.rating;
  risk.updatedAt = now;
  risk.updatedBy = state.currentUser.userId;

  appendLog('control', control.controlId, 'create', null, pickControlLogFields(control));
  appendLog('risk', risk.riskId, 'update', null, {
    residualLikelihood: risk.residualLikelihood,
    residualImpact: risk.residualImpact,
    residualRating: risk.residualRating
  });

  markDirtyAndRender();
  return true;
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
  const riskId = control.riskId;

  const { error } = await supabase
    .from('controls')
    .delete()
    .eq('control_id', controlId);

  if (error) {
    console.error('Control delete failed:', error);
    alert(`Control 삭제 실패\n${error.message || error}`);
    return;
  }

  state.db.controls = state.db.controls.filter((item) => item.controlId !== controlId);

  const remainingControls = getControlsByRiskId(riskId);
  if (!remainingControls.length) {
    const { error: riskClearError } = await supabase
      .from('risks')
      .update({
        residual_likelihood: null,
        residual_impact: null,
        residual_score: null,
        residual_rating: null,
        status: 'Open',
        updated_at: now,
        updated_by: userId
      })
      .eq('risk_id', riskId);

    if (riskClearError) {
      console.error('Risk residual clear failed:', riskClearError);
      alert(`Risk 잔여평가 초기화 실패\n${riskClearError.message || riskClearError}`);
      return;
    }

    const risk = getRiskById(riskId);
    if (risk) {
      risk.residualLikelihood = null;
      risk.residualImpact = null;
      risk.residualScore = null;
      risk.residualRating = '';
      risk.status = 'Open';
      risk.updatedAt = now;
      risk.updatedBy = userId;
    }
  }

  appendLog('control', control.controlId, 'delete', before, null);
  markDirtyAndRender();
}

async function updateControlFrequencyAndMonths(controlId, frequency, months) {
  const control = getControlById(controlId);
  if (!control) return;

  const before = shallowClone(control);
  const now = nowIso();
  const userId = state.currentUser.userId;
  const normalizedMonths = normalizeControlMonths(months);

  control.controlFrequency = frequency;
  control.controlMonths = normalizedMonths;
  control.updatedAt = now;
  control.updatedBy = userId;

  const patch = {
    control_frequency: frequency,
    control_months: normalizedMonths,
    updated_at: now,
    updated_by: userId
  };

  const { error } = await supabase
    .from('controls')
    .update(patch)
    .eq('control_id', controlId);

  if (error) {
    console.error('Control frequency/months update failed:', error);
    alert(`Control 주기 수정 실패\n${error.message || error}`);
    state.db.controls[state.db.controls.findIndex(c => c.controlId === controlId)] = before;
    render();
    return;
  }

  appendLog('control', control.controlId, 'update', pickControlLogFields(before), pickControlLogFields(control));
  state.isDirty = false;
  markDirtyAndRender();
}

async function toggleInlineControlMonth(controlId, month) {
  const control = getControlById(controlId);
  if (!control) return;

  const current = normalizeControlMonths(control.controlMonths);
  const next = current.includes(month)
    ? current.filter((item) => item !== month)
    : current.concat(month);

  await updateControlMonths(controlId, next);
}

async function updateControlMonths(controlId, months) {
  const control = getControlById(controlId);
  if (!control) return;

  const before = shallowClone(control);
  const now = nowIso();
  const userId = state.currentUser.userId;
  const normalizedMonths = normalizeControlMonths(months);

  control.controlMonths = normalizedMonths;
  control.updatedAt = now;
  control.updatedBy = userId;

  const patch = {
    control_months: normalizedMonths,
    updated_at: now,
    updated_by: userId
  };

  const { error } = await supabase
    .from('controls')
    .update(patch)
    .eq('control_id', controlId);

  if (error) {
    console.error('Control months update failed:', error);
    alert(`수행 월 수정 실패\n${error.message || error}`);
    state.db.controls[state.db.controls.findIndex(c => c.controlId === controlId)] = before;
    render();
    return;
  }

  appendLog('control', control.controlId, 'update', pickControlLogFields(before), pickControlLogFields(control));
  state.isDirty = false;
  markDirtyAndRender();
}

async function updateControlOwnerAssignment(controlId, assignedUserEmail) {
  const control = getControlById(controlId);
  if (!control) return;

  const assignedUser = findAssignableUserByEmail(assignedUserEmail);
  if (!assignedUser?.userId) {
    alert('선택한 담당 User 정보를 찾을 수 없습니다.');
    render();
    return;
  }

  const before = shallowClone(control);
  const now = nowIso();
  const userId = state.currentUser.userId;

  control.assignedUserId = assignedUser.userId;
  control.assignedUserEmail = assignedUser.email;
  control.updatedAt = now;
  control.updatedBy = userId;

  const response = await supabase
    .from('controls')
    .update({
      assigned_user_id: control.assignedUserId,
      assigned_user_email: control.assignedUserEmail,
      updated_at: now,
      updated_by: userId
    })
    .eq('control_id', controlId);

  if (response.error) {
    console.error('Control owner update failed:', response.error);
    alert(`담당 User 저장 실패
${response.error.message || response.error}`);
    state.db.controls[state.db.controls.findIndex((item) => item.controlId === controlId)] = before;
    render();
    return;
  }

  try {
    await syncRiskUserAccess(control.riskId, assignedUser.userId);
  } catch (accessError) {
    console.error('Risk access resync failed:', accessError);
    alert(`담당 User 권한 동기화 실패
${accessError.message || accessError}`);
    state.db.controls[state.db.controls.findIndex((item) => item.controlId === controlId)] = before;
    render();
    return;
  }

  appendLog('control', control.controlId, 'update', pickControlLogFields(before), pickControlLogFields(control));
  state.isDirty = false;
  markDirtyAndRender();
}

async function updateField(targetType, targetId, field, value) {
  const now = nowIso();
  const userId = state.currentUser.userId;

  if (targetType === 'risk') {
    const risk = getRiskById(targetId);
    if (!risk) return;

    const before = shallowClone(risk);
    risk[field] = ['inherentLikelihood', 'inherentImpact', 'residualLikelihood', 'residualImpact'].includes(field)
      ? (value === '' || value == null ? null : Number(value))
      : value;

    const inherent = calculateRating(risk.inherentLikelihood, risk.inherentImpact);
    risk.inherentScore = inherent.score;
    risk.inherentRating = inherent.rating;

    const hasResidual = Number(risk.residualLikelihood) >= 1 && Number(risk.residualLikelihood) <= 5 &&
                        Number(risk.residualImpact) >= 1 && Number(risk.residualImpact) <= 5;
    if (hasResidual) {
      const residual = calculateRating(risk.residualLikelihood, risk.residualImpact);
      risk.residualScore = residual.score;
      risk.residualRating = residual.rating;
    } else {
      risk.residualScore = null;
      risk.residualRating = '';
    }
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
    control[field] = field === 'controlMonths' ? normalizeControlMonths(value) : value;
    if (field === 'controlName') control.controlTitle = value;
    if (field === 'controlContent') control.controlDescription = value;
    if (field === 'controlDepartment') control.controlOwner = value;
    if (field === 'status') {
      const normalizedStatus = String(value || 'Open');
      control.status = normalizedStatus;
      if (normalizedStatus === 'Closed') {
        control.closedAt = control.closedAt || now.slice(0, 10);
      } else {
        control.closedAt = '';
      }
      if (!control.effectiveFromDate) {
        control.effectiveFromDate = control.createdAt ? String(control.createdAt).slice(0, 10) : now.slice(0, 10);
      }
    }
    control.updatedAt = now;
    control.updatedBy = userId;

    const fieldMap = {
      controlName: 'control_name',
      controlContent: 'control_content',
      controlType: 'control_type',
      controlOperationType: 'control_operation_type',
      controlFrequency: 'control_frequency',
      controlMonths: 'control_months',
      controlDepartment: 'control_department',
      controlOwnerName: 'control_owner_name',
      assignedUserId: 'assigned_user_id',
      assignedUserEmail: 'assigned_user_email',
      status: 'status',
      effectiveFromDate: 'effective_from_date',
      closedAt: 'closed_at'
    };
    const patch = {
      updated_at: now,
      updated_by: userId
    };
    if (fieldMap[field]) patch[fieldMap[field]] = control[field];
    if (field === 'status') {
      patch.closed_at = control.closedAt || null;
      patch.effective_from_date = control.effectiveFromDate || null;
    }
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


function getCurrentUserScopedRiskIds() {
  if (isManager()) return null;

  const currentAuthId = String(state.currentUser?.authId || '');
  const currentEmail = String(state.currentUser?.email || '').trim().toLowerCase();
  const scopedRiskIds = new Set();

  (state.riskUserAccess || []).forEach((entry) => {
    const entryUserId = String(entry.userId || '');
    const entryEmail = String(entry.email || '').trim().toLowerCase();
    if ((currentAuthId && entryUserId === currentAuthId) || (currentEmail && entryEmail === currentEmail)) {
      if (entry.canView !== false && entry.riskId) scopedRiskIds.add(entry.riskId);
    }
  });

  getActiveControls().forEach((control) => {
    const ownerId = String(control.controlOwner || '');
    const assignedUserId = String(control.assignedUserId || '');
    const assignedUserEmail = String(control.assignedUserEmail || '').trim().toLowerCase();

    if (
      (currentAuthId && ownerId === currentAuthId) ||
      (currentAuthId && assignedUserId === currentAuthId) ||
      (currentEmail && assignedUserEmail === currentEmail)
    ) {
      if (control.riskId) scopedRiskIds.add(control.riskId);
    }
  });

  return scopedRiskIds;
}

function getDashboardScopedRisks() {
  const scopedRiskIds = getCurrentUserScopedRiskIds();
  return getActiveRisks()
    .filter((risk) => !scopedRiskIds || scopedRiskIds.has(risk.riskId))
    .sort((a, b) => a.riskId.localeCompare(b.riskId));
}

function getDashboardScopedControls() {
  const riskIds = new Set(getDashboardScopedRisks().map((risk) => risk.riskId));
  return getActiveControls()
    .filter((control) => riskIds.has(control.riskId))
    .sort((a, b) => String(a.controlCode || a.controlId).localeCompare(String(b.controlCode || b.controlId)));
}

function getVisibleRisks() {
  const scopedRiskIds = getCurrentUserScopedRiskIds();

  if (state.selectedRiskId) {
    return getActiveRisks()
      .filter((risk) => risk.riskId === state.selectedRiskId)
      .filter((risk) => !scopedRiskIds || scopedRiskIds.has(risk.riskId))
      .sort((a, b) => a.riskId.localeCompare(b.riskId));
  }

  const activeFolderIds = state.selectedFolderId ? getDescendantFolderIds(state.selectedFolderId) : getActiveFolders().map((f) => f.folderId);

  return getActiveRisks()
    .filter((risk) => activeFolderIds.includes(risk.folderId))
    .filter((risk) => !scopedRiskIds || scopedRiskIds.has(risk.riskId))
    .filter((risk) => matchesHeatmapFilter(risk))
    .sort((a, b) => a.riskId.localeCompare(b.riskId));
}

function getVisibleControls() {
  const visibleRiskIds = new Set(getVisibleRisks().map((risk) => risk.riskId));
  return getActiveControls()
    .filter((control) => visibleRiskIds.has(control.riskId))
    .sort((a, b) => String(a.controlCode || a.controlId).localeCompare(String(b.controlCode || b.controlId)));
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
    assignedUserEmail: control?.assignedUserEmail || inferAssignedUserEmailForRisk(risk.riskId, control?.controlOwnerName || '', control) || '',
    residualLikelihood: risk.residualLikelihood || '',
    residualImpact: risk.residualImpact || '',
    residualRating: risk.residualRating || '',
    status: control?.status || risk.status || ''
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
  const bucketCounts = { low: 0, medium: 0, high: 0 };

  for (let impact = 1; impact <= 5; impact += 1) {
    for (let like = 1; like <= 5; like += 1) {
      counts[`${impact}-${like}`] = 0;
    }
  }

  getDashboardScopedRisks().forEach((risk) => {
    const like = Number(risk[likeField] || 0);
    const impact = Number(risk[impactField] || 0);

    if (like >= 1 && like <= 5 && impact >= 1 && impact <= 5) {
      counts[`${impact}-${like}`] += 1;
      const bucket = getHeatmapBucketFromScore(like * impact);
      bucketCounts[bucket] += 1;
    }
  });

  const rows = [];

  for (let impact = 1; impact <= 5; impact += 1) {
    const cells = [];

    for (let like = 1; like <= 5; like += 1) {
      const count = counts[`${impact}-${like}`] || 0;
      const selectedClass = isSelectedHeatmapCell(mode, like, impact) ? ' selected' : '';

      cells.push(`
        <td
          class="heatmap-cell ${heatmapCellClass(like, impact)}${selectedClass}"
          data-impact="${impact}"
          data-like="${like}"
          data-mode="${mode}"
          title="${getHeatmapModeLabel(mode)} / ${isEnglish() ? 'Impact' : '결과심각성'} ${impact} / ${isEnglish() ? 'Likelihood' : '발생가능성'} ${like} / ${t('caseCount')} ${count}"
        >
          <span>${count === 0 ? '-' : count}</span>
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
      <div class="heatmap-axis-title top">${escapeHtml(t('likelihoodAxis'))}</div>

      <div class="heatmap-main">
        <div class="heatmap-matrix-wrap">
          <div class="heatmap-axis-title left">${escapeHtml(t('impactAxis'))}</div>

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

        <div class="heatmap-side-summary">
          <div class="heatmap-side-summary-title">${escapeHtml(t('riskCount'))}</div>
          <button type="button" class="heatmap-side-item low ${isSelectedHeatmapBucket(mode, 'low') ? 'selected' : ''}" data-mode="${mode}" data-bucket="low">
            <span>Low</span>
            <strong>${bucketCounts.low}</strong>
          </button>
          <button type="button" class="heatmap-side-item medium ${isSelectedHeatmapBucket(mode, 'medium') ? 'selected' : ''}" data-mode="${mode}" data-bucket="medium">
            <span>Medium</span>
            <strong>${bucketCounts.medium}</strong>
          </button>
          <button type="button" class="heatmap-side-item high ${isSelectedHeatmapBucket(mode, 'high') ? 'selected' : ''}" data-mode="${mode}" data-bucket="high">
            <span>High</span>
            <strong>${bucketCounts.high}</strong>
          </button>
        </div>
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
  const like = Number(likelihood);
  const imp = Number(impact);
  if (!(like >= 1 && like <= 5) || !(imp >= 1 && imp <= 5)) {
    return { score: null, rating: '' };
  }
  const score = like * imp;
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
    controlOwnerName: control.controlOwnerName,
    assignedUserId: control.assignedUserId || '',
    assignedUserEmail: control.assignedUserEmail || '',
    status: control.status || 'Open',
    effectiveFromDate: control.effectiveFromDate || '',
    closedAt: control.closedAt || ''
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

function isModalOpen() {
  const root = document.getElementById('modalRoot');
  return !!(root && root.innerHTML.trim());
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
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>
    <div class="kv-list" style="margin-bottom:16px;">
      <div>Risk Code</div><div class="mono">${escapeHtml(getDisplayRiskCode(risk.riskId || ''))}</div>
      <div>${escapeHtml(t('controlProcessLabel'))}</div><div>${escapeHtml(risk.departmentName || '')}</div>
      <div>${escapeHtml(t('referenceLawLabel'))}</div><div class="detail-block">${escapeHtml(risk.referenceLaw || '')}</div>
      <div>${escapeHtml(t('regulationDetailLabel'))}</div><div class="detail-block">${escapeHtml(risk.regulationDetail || '')}</div>
      <div>${escapeHtml(t('sanctionLabel'))}</div><div class="detail-block">${escapeHtml(risk.sanction || '')}</div>
      <div>${escapeHtml(t('riskContentLabel'))}</div><div class="detail-block">${escapeHtml(risk.riskContent || risk.riskDescription || risk.riskTitle || '')}</div>
      <div>${escapeHtml(t('inherentRiskLikelihood'))}</div><div>${escapeHtml(risk.inherentLikelihood || '')}</div>
      <div>${escapeHtml(t('inherentRiskImpact'))}</div><div>${escapeHtml(risk.inherentImpact || '')}</div>
      <div>${escapeHtml(t('inherentRiskRating'))}</div><div>${renderBadge(risk.inherentRating || '')}</div>
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
      <h3>${escapeHtml(t('controlDetail'))}</h3>
      <button type="button" id="modalCloseBtn" class="ghost-btn">${escapeHtml(t('close'))}</button>
    </div>
    <div class="kv-list" style="margin-bottom:16px;">
      <div>Control Code</div><div class="mono">${escapeHtml(control.controlCode || control.controlId || '')}</div>
      <div>${escapeHtml(t('controlName'))}</div><div>${escapeHtml(control.controlName || control.controlTitle || '')}</div>
      <div>${escapeHtml(t('controlContentLabel'))}</div><div class="detail-block">${escapeHtml(control.controlContent || control.controlDescription || '')}</div>
      <div>${escapeHtml(t('controlTypeLabel'))}</div><div>${escapeHtml(getControlTypeDisplayLabel(control.controlType || ''))}</div>
      <div>${escapeHtml(t('controlOperationTypeLabel'))}</div><div>${escapeHtml(control.controlOperationType || '')}</div>
      <div>${escapeHtml(t('controlFrequency'))}</div><div>${escapeHtml(getFrequencyDisplayLabel(control.controlFrequency || ''))}</div>
      <div>${escapeHtml(t('scheduledMonthsLabel'))}</div><div>${escapeHtml(formatControlMonths(control.controlMonths || []))}</div>
      <div>${escapeHtml(t('teamNameLabel'))}</div><div>${escapeHtml(control.controlDepartment || control.controlOwner || '')}</div>
      <div>${escapeHtml(t('owner'))}</div><div>${escapeHtml(control.controlOwnerName || '')}</div>
      <div>${escapeHtml(t('authorizedUserLabel'))}</div><div>${escapeHtml(getAssignedUserLabel(control.assignedUserEmail || '', control.assignedUserEmail || '-'))}</div>
      <div>${escapeHtml(t('residualRiskLikelihood'))}</div><div>${escapeHtml(risk?.residualLikelihood || '')}</div>
      <div>${escapeHtml(t('residualRiskImpact'))}</div><div>${escapeHtml(risk?.residualImpact || '')}</div>
      <div>${escapeHtml(t('residualRiskRating'))}</div><div>${renderBadge(risk?.residualRating || '')}</div>
    </div>
  `);
  const btn = document.getElementById('modalCloseBtn');
  if (btn) btn.addEventListener('click', closeModal);
}

function loadSession() {
  return null;
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

function canManageRcm() {
  return isManager() && state.isEditMode === true;
}

function canUploadMonitoringEvidence() {
  return !!state.currentUser;
}

function canReviewMonitoring() {
  return isManager() && state.isEditMode === true;
}

function canSaveMonitoringReview() {
  return canReviewMonitoring();
}

function getRoleDescription() {
  if (isManager()) {
    return state.isEditMode ? t('roleManagerEdit') : t('roleManagerRead');
  }
  return t('roleUser');
}

function blockRcmAction() {
  if (!isManager()) {
    alert(t('blockRcmManagerOnly'));
    return;
  }
  alert(t('blockRcmEditMode'));
}

function blockMonitoringUploadAction() {
  alert(t('blockUploadLogin'));
}

function blockMonitoringReviewAction() {
  if (!isManager()) {
    alert(t('blockReviewManager'));
    return;
  }
  alert(t('blockReviewMode'));
}

function blockViewerAction() {
  if (state.currentModule === 'monitoring') {
    blockMonitoringReviewAction();
    return;
  }
  blockRcmAction();
}

function columnLabel(col) {
  const labels = isEnglish() ? {
    departmentName: t('headerProcess'),
    riskId: 'Risk Code',
    referenceLaw: t('headerApplicableRegulation'),
    regulationDetail: t('headerRegulationDetail'),
    sanction: t('headerRelatedPenalty'),
    riskContent: t('headerRiskDescription'),
    inherentLikelihood: t('headerInherentLikelihood'),
    inherentImpact: t('headerInherentImpact'),
    inherentRating: t('headerInherentRating'),
    controlCode: t('headerControlCode'),
    controlName: t('headerControlName'),
    controlContent: t('headerControlDescription'),
    controlType: t('headerControlType'),
    controlOperationType: t('headerControlOperationType'),
    controlFrequency: t('headerControlFrequency'),
    responsibleDepartment: t('headerTeam'),
    ownerName: t('headerOwner'),
    residualLikelihood: t('headerResidualLikelihood'),
    residualImpact: t('headerResidualImpact'),
    residualRating: t('headerResidualRating'),
    status: 'Status',
    actions: 'Actions'
  } : {
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
  init();
})();