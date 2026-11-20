import { useRef, useLayoutEffect, useState } from 'react';
import { goTo } from '../lib/motion';
import { D } from '../data';

export default function Nav() {
  const [open, setOpen] = useState(false), first = useRef(null), btn = useRef(null);
  const L = [['Runway', 'top'], ['Process', 'process'], ['Files', 'files'], ['Archive', 'archive'], ['About', 'about'], ['Experience', 'experience'], ['Contact', 'contact']];
  const lock = on => { document.documentElement.style.overflow = on ? 'hidden' : ''; };
  const close = () => { setOpen(false); lock(false); };
  const go = (e, id) => { close(); goTo(e, id); };
  const toggle = () => { lock(!open); setOpen(!open); };
  useLayoutEffect(() => {
    if (!open) return;
    if (first.current) first.current.focus({ preventScroll: true });
    const key = e => { if (e.key === 'Escape') { close(); if (btn.current) btn.current.focus(); } };
    const wide = matchMedia('(min-width: 1024px)'), onWide = () => { if (wide.matches) close(); };
    addEventListener('keydown', key); wide.addEventListener('change', onWide);
    return () => { removeEventListener('keydown', key); wide.removeEventListener('change', onWide); };
  }, [open]);
  const bar = 'absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ';
  return (<div>
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5 pb-4 text-white mix-blend-difference sm:px-6 md:px-12" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}>
      <a href="#top" onClick={e => go(e, 'top')} className="min-w-0 truncate font-display text-xl font-semibold italic md:text-2xl">{D.name}</a>
      <nav aria-label="Main" className="hidden items-center gap-6 text-xs uppercase tracking-[.18em] lg:flex xl:gap-8 xl:text-sm">{L.map(([t, id]) => (<a key={id} href={'#' + id} onClick={e => go(e, id)} className="underline-offset-8 hover:underline">{t}</a>))}</nav>
      <button ref={btn} type="button" onClick={toggle} aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'} className="flex shrink-0 items-center gap-3 py-2 pl-3 text-sm uppercase tracking-[.2em] lg:hidden">
        <span aria-hidden="true" className="hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
        <span aria-hidden="true" className="relative block h-3 w-7">
          <span className={bar + 'top-0 ' + (open ? 'translate-y-[5px] rotate-45' : '')}></span>
          <span className={bar + 'bottom-0 ' + (open ? '-translate-y-[5px] -rotate-45' : '')}></span>
        </span>
      </button>
    </header>
    <div id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} inert={open ? undefined : ''}
      className={'menu fixed inset-0 z-40 flex flex-col overflow-y-auto bg-velvet text-champ lg:hidden ' + (open ? 'on' : '')}
      style={{ paddingTop: 'calc(5.5rem + env(safe-area-inset-top, 0px))', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
      <nav aria-label="Menu links" className="flex flex-1 flex-col justify-center px-5 sm:px-6 md:px-12">
        <ol>{L.map(([t, id], i) => (<li key={id} className="mi overflow-hidden border-b border-champ/20" style={{ '--d': i * 40 + 'ms' }}>
            <a ref={i === 0 ? first : null} href={'#' + id} onClick={e => go(e, id)} className="group flex items-baseline gap-4 py-2 sm:py-3">
              <span className="w-6 text-xs tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display font-semibold italic leading-[1.05] transition-transform duration-300 group-hover:translate-x-2" style={{ fontSize: 'clamp(2.1rem, 8.5vw, 4.5rem)' }}>{t}</span>
            </a>
          </li>))}
        </ol>
      </nav>
      <div className="mi mt-6 flex flex-wrap items-center justify-between gap-4 px-5 text-sm sm:px-6 md:px-12" style={{ '--d': L.length * 40 + 'ms' }}>
        <div><a href={'mailto:' + D.email} className="break-all underline underline-offset-4">{D.email}</a><p className="mt-1 opacity-70">{D.phone}</p></div>
        <a href={D.whatsapp} target="_blank" rel="noopener" className="rounded-full bg-champ px-5 py-2.5 font-medium text-night">Chat on WhatsApp</a>
      </div>
    </div>
  </div>);
}
