import { useRef, useLayoutEffect, useState } from 'react';
import { reduce } from '../lib/motion';

/* Tab rows on phones: one swipeable line. Edges fade where more tabs are hidden, an arrow scrolls to the next ones,
   the row nudges once when it first comes into view, and a tapped tab slides to the centre. From 768px the tabs wrap and none of this shows. */
export default function TabRow({ dark, className, children }) {
  const row = useRef(null), [edge, setEdge] = useState({ l: false, r: false });
  useLayoutEffect(() => {
    const el = row.current; if (!el) return;
    const upd = () => { const max = el.scrollWidth - el.clientWidth; setEdge({ l: el.scrollLeft > 4, r: max > 4 && el.scrollLeft < max - 4 }); };
    upd(); el.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd);
    /* The nudge never fights the visitor: any touch or click on the row cancels it */
    let io, touched = false; const stop = () => { touched = true; };
    el.addEventListener('pointerdown', stop, { passive: true }); el.addEventListener('touchstart', stop, { passive: true });
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting || el.scrollWidth - el.clientWidth < 8 || el.scrollLeft > 4) return; io.disconnect();
        setTimeout(() => { if (touched) return; const to = Math.min(72, el.scrollWidth - el.clientWidth); el.scrollTo({ left: to, behavior: 'smooth' }); setTimeout(() => { if (!touched && Math.abs(el.scrollLeft - to) < 6) el.scrollTo({ left: 0, behavior: 'smooth' }); }, 650); }, 350);
      }), { threshold: 0.9 });
      io.observe(el);
    }
    return () => { el.removeEventListener('scroll', upd); removeEventListener('resize', upd); el.removeEventListener('pointerdown', stop); el.removeEventListener('touchstart', stop); if (io) io.disconnect(); };
  }, []);
  const center = e => {
    const b = e.target.closest('button'), el = row.current; if (!b || !el || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: b.offsetLeft - (el.clientWidth - b.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  };
  const more = () => { const el = row.current; el.scrollBy({ left: el.clientWidth * 0.7, behavior: reduce ? 'auto' : 'smooth' }); };
  const fade = edge.l && edge.r ? 'fade-lr' : edge.r ? 'fade-r' : edge.l ? 'fade-l' : '';
  return (<div className="relative">
    <div ref={row} onClick={center} className={className + ' ' + fade}>{children}</div>
    <button type="button" onClick={more} aria-label="Show more tabs" tabIndex="-1"
      className={'tabmore absolute -right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full shadow-lg transition-opacity duration-300 sm:-right-2 md:hidden ' + (dark ? 'bg-champ text-night' : 'bg-night text-pearl') + (edge.r ? '' : ' pointer-events-none opacity-0')}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
    </button>
  </div>);
}
