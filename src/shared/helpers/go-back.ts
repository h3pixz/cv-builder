export function goBack() {
  if (window.history.length <= 1) {
    return false;
  }

  window.history.back();
  return true;
}
