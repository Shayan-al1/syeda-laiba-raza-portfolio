import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* Media query for visitors who are fine with animation, and the opposite flag */
export const NOPREF = '(prefers-reduced-motion: no-preference)';
export const reduce = typeof matchMedia !== 'undefined' && !matchMedia(NOPREF).matches;

export { gsap, ScrollTrigger };

export function goTo(e, id) {
  e.preventDefault();
  let el = id === 'top' ? null : document.getElementById(id);
  if (el && el.parentElement.classList.contains('pin-spacer')) el = el.parentElement;
  gsap.to(window, { scrollTo: el ? { y: el } : 0, duration: reduce ? 0 : 1.6, ease: 'power3.inOut' });
}
