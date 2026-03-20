// textarea 자동 높이 조절
function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// 모든 textarea에 적용
function applyAutoResize() {
  document.querySelectorAll('textarea').forEach(el => {
    autoResizeTextarea(el);

    el.addEventListener('input', function () {
      autoResizeTextarea(el);
    });
  });
}

// 수정모드 진입 시 실행
function enterEditMode() {
  state.isEditMode = true;
  render();
  setTimeout(() => {
    applyAutoResize();
  }, 0);
}

// 초기 로딩 시에도 적용
document.addEventListener('DOMContentLoaded', function () {
  applyAutoResize();
});
