// 현재 경로를 읽는 함수
export function getCurrentPath(): string {
  return window.location.pathname;
}

// pushState로 URL 변경 (새 항목 추가)
export function navigateTo(to: string) {
  window.history.pushState({}, "", to);
  // 커스텀 이벤트로 알림
  window.dispatchEvent(new Event("locationchange"));
}

// replaceState로 URL 변경 (현재 항목 대체)
export function replaceTo(to: string) {
  window.history.replaceState({}, "", to);
  window.dispatchEvent(new Event("locationchange"));
}
