/**
 * Cross-browser SVG stroke helpers for homepage teal connectors.
 * Avoid Framer/SVG pathLength="1" — Chromium and WebKit disagree on getTotalLength().
 */

export const FLOW_JOIN_PX = 2;

export function readGeometricLength(pathEl: SVGPathElement): number {
  const prev = pathEl.getAttribute("pathLength");
  if (prev != null) pathEl.removeAttribute("pathLength");
  const len = pathEl.getTotalLength();
  if (prev != null) pathEl.setAttribute("pathLength", prev);
  return len;
}

/** Drive stroke draw with dasharray in user units (progress 0–1). */
export function applyStrokeDash(
  pathEl: SVGPathElement,
  progress: number,
  lengthRef: { current: number },
): number {
  pathEl.removeAttribute("pathLength");
  let len = lengthRef.current;
  if (len <= 0) {
    len = readGeometricLength(pathEl);
    lengthRef.current = len;
  }
  if (len <= 0) return 0;
  const drawn = Math.min(1, Math.max(0, progress)) * len;
  pathEl.setAttribute("stroke-dasharray", `${drawn} ${len}`);
  pathEl.setAttribute("stroke-dashoffset", "0");
  return len;
}
