import { useRef, useLayoutEffect, useState } from 'react';
import { gsap, reduce } from '../lib/motion';
import { FCATS, ITEMS } from '../data';
import { IMG } from '../lib/images';
import TabRow from './TabRow';

export default function Files() {
  const ref = useRef(null), last = useRef(null), [cat, setCat] = useState('collection'), [cols, setCols] = useState(2), [open, setOpen] = useState(null), [ix, setIx] = useState(0);
  const list = ITEMS.filter(i => i.cat === cat), label = FCATS.find(c => c[0] === cat)[1], it = open ? ITEMS.find(x => x.id === open) : null;
  const show = (id, e) => { last.current = { x: e.clientX || innerWidth / 2, y: e.clientY || innerHeight / 2, el: e.currentTarget }; setIx(0); setOpen(id); };
  const closeIt = () => {
    const ov = ref.current.querySelector('.fm'), c = last.current || { x: innerWidth / 2, y: innerHeight / 2 };
    const done = () => { setOpen(null); if (last.current && last.current.el) last.current.el.focus(); };
    if (reduce || !ov) return done();
    gsap.to(ov, { clipPath: 'circle(0px at ' + c.x + 'px ' + c.y + 'px)', duration: 0.6, ease: 'power3.inOut', onComplete: done });
  };
  useLayoutEffect(() => {
    if (reduce) return;
    gsap.from(ref.current.querySelectorAll('.fc'), { opacity: 0, y: 36, duration: 0.7, ease: 'power3.out', stagger: 0.06 });
    gsap.from(ref.current.querySelectorAll('.ft'), { yPercent: 110, duration: 0.8, ease: 'power4.out', stagger: 0.03 });
  }, [cat]);
  useLayoutEffect(() => {
    if (!open) return;
    const ov = ref.current.querySelector('.fm'), c = last.current || { x: innerWidth / 2, y: innerHeight / 2 };
    document.documentElement.style.overflow = 'hidden';
    if (!reduce) {
      gsap.fromTo(ov, { clipPath: 'circle(0px at ' + c.x + 'px ' + c.y + 'px)' }, { clipPath: 'circle(150% at ' + c.x + 'px ' + c.y + 'px)', duration: 0.9, ease: 'power3.inOut', clearProps: 'clipPath' });
      gsap.from(ov.querySelectorAll('.fin1'), { y: 30, opacity: 0, duration: 0.7, stagger: 0.07, delay: 0.45, ease: 'power3.out' });
    }
    ov.querySelector('.fclose').focus();
    const n = ITEMS.find(x => x.id === open).pics.length;
    const key = e => { if (e.key === 'Escape') closeIt(); if (e.key === 'ArrowRight') setIx(i => Math.min(n - 1, i + 1)); if (e.key === 'ArrowLeft') setIx(i => Math.max(0, i - 1)); };
    addEventListener('keydown', key);
    return () => { removeEventListener('keydown', key); document.documentElement.style.overflow = ''; };
  }, [open]);
  useLayoutEffect(() => { if (open && !reduce) gsap.fromTo(ref.current.querySelector('.fmain'), { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }); }, [ix]);
  const nextItem = () => { const k = list.findIndex(x => x.id === open); const nx = list[(k + 1) % list.length]; setIx(0); setOpen(nx.id); };
  return (<section ref={ref} id="files" className="bg-pearl px-5 py-20 text-night sm:px-6 md:px-12 md:py-32">
    <p className="text-xs uppercase tracking-[.3em] md:text-sm">Design files</p>
    <h2 aria-label={label} className="mt-3 overflow-hidden pb-[.08em] font-display text-5xl font-semibold italic leading-[.95] sm:text-6xl md:text-8xl lg:text-9xl">{label.split(' ').map((w, wi) => (<span key={cat + wi} aria-hidden="true" className="inline-block whitespace-nowrap pr-[.25em]">{[...w].map((c, i) => (<span key={i} className="ft inline-block">{c}</span>))}</span>))}</h2>
    <p className="mt-3 max-w-xl text-base md:text-lg">Each file gathers one piece with its pictures, notes and specifications. Open one to see every stage.</p>
    <div className="mt-8 flex flex-col gap-3 border-y border-night/30 py-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
      <TabRow dark={false} className="tabrow -mx-5 flex gap-x-6 gap-y-2 overflow-x-auto px-5 text-xs uppercase tracking-[.2em] sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:text-sm">{FCATS.map(([id, t]) => (<button key={id} type="button" onClick={() => setCat(id)} aria-pressed={cat === id} className={'shrink-0 whitespace-nowrap pb-1 ' + (cat === id ? 'border-b-2 border-night' : 'opacity-50')}>{t}</button>))}</TabRow>
      <div className="flex items-center gap-3 text-xs uppercase tracking-[.2em] md:hidden"><span className="opacity-50">View</span>{[1, 2].map(n => (<button key={n} type="button" onClick={() => setCols(n)} aria-pressed={cols === n} className={cols === n ? 'border-b-2 border-night' : 'opacity-50'}>{n}x</button>))}</div>
    </div>
    <div className={'mt-8 grid gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-4 ' + (cols === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
      {list.map(x => { const n = x.pics.length; return (<button key={x.id} type="button" onClick={e => show(x.id, e)} className="fc group text-center">
          <span className="relative block aspect-[3/4] overflow-hidden bg-night/10"><img loading="lazy" src={IMG[x.pics[0][0]].src} alt={x.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: 'center 25%' }} />
            <span className="absolute left-2 top-2 border border-night bg-pearl px-2 py-0.5 text-[10px] uppercase tracking-[.2em]">{n > 1 ? n + ' views' : 'File'}</span></span>
          <span className="mt-4 block text-sm uppercase tracking-[.25em] md:text-base">{x.name}</span>
          <span className="mt-1 block text-xs uppercase tracking-[.2em] opacity-60">{n} {n > 1 ? 'pictures' : 'picture'}</span>
        </button>); })}
    </div>
    {it ? (<div role="dialog" aria-modal="true" aria-label={it.name} className="fm fixed inset-0 z-[80] overflow-y-auto bg-pearl text-night lg:overflow-hidden">
        <button type="button" onClick={closeIt} className="fclose fixed right-4 z-10 rounded-full border border-pearl/40 bg-night px-4 py-2 text-xs uppercase tracking-[.2em] text-pearl md:right-8" style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>Close</button>
        <div className="lg:grid lg:h-full lg:grid-cols-[1.15fr_1fr]">
          <div className="relative flex h-[64svh] min-h-[22rem] flex-col bg-night text-champ md:h-[72svh] lg:h-full lg:min-h-0">
            <div className="relative min-h-0 flex-1 p-4 pt-16 md:p-8"><img key={it.id + ix} className="fmain h-full w-full object-contain" src={IMG[it.pics[ix][0]].src} alt={it.name + ': ' + it.pics[ix][1]} /></div>
            <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 md:px-8">{it.pics.map(([k, l], i) => (<button key={k} type="button" onClick={() => setIx(i)} aria-label={'Show ' + l} aria-pressed={ix === i} className={'shrink-0 overflow-hidden rounded-md border-2 ' + (ix === i ? 'border-champ' : 'border-transparent opacity-60')}><img src={IMG[k].src} alt="" className="h-16 w-12 object-cover" /></button>))}</div>
            <p className="px-4 pb-4 text-xs uppercase tracking-[.2em] md:px-8">{it.pics[ix][1]} · {ix + 1} / {it.pics.length}</p>
          </div>
          <div className="p-6 md:p-12 lg:overflow-y-auto" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
            <p className="fin1 text-xs uppercase tracking-[.25em]">{FCATS.find(c => c[0] === it.cat)[1]} / Design file</p>
            <h3 className="fin1 mt-3 font-display text-5xl font-semibold italic leading-[.95] md:text-7xl">{it.name}</h3>
            <p className="fin1 mt-5 max-w-lg text-base md:text-lg">{it.desc}</p>
            <dl className="mt-8 border-t-2 border-night">{it.specs.map(([k, v]) => (<div key={k} className="fin1 flex justify-between gap-6 border-b border-night/30 py-3 text-sm md:text-base"><dt className="uppercase tracking-[.15em]">{k}</dt><dd className={v ? 'text-right' : 'text-right italic opacity-50'}>{v || 'To be added'}</dd></div>))}</dl>
            <div className="fin1 mt-6 flex flex-wrap gap-2">{it.pics.map(([, l], i) => (<button key={l + i} type="button" onClick={() => setIx(i)} className={'rounded-full border-2 border-night px-3 py-1 text-xs uppercase tracking-[.15em] ' + (ix === i ? 'bg-night text-pearl' : '')}>{l}</button>))}</div>
            <button type="button" onClick={nextItem} className="fin1 mt-8 text-sm uppercase tracking-[.2em] underline underline-offset-8">Next file</button>
          </div>
        </div>
      </div>) : null}
  </section>);
}
