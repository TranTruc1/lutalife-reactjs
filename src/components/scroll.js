// Chiều cao thanh menu cố định phía trên (dùng để cuộn không bị che tiêu đề).
export const NAV_OFFSET = 80;

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
  return true;
}
