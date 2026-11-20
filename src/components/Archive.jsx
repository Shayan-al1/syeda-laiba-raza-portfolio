import { useRef, useLayoutEffect, useState } from 'react';
import { gsap, reduce } from '../lib/motion';
import { CATS, ARCH } from '../data';
import { IMG } from '../lib/images';
import TabRow from './TabRow';

/* Everything in one place: filter by category, tap a picture to open it large */
export default function Archive() {
  const ref = useRef(null), [f, setF] = useState('all'), [lb, setLb] = useState(-1);
  const list = ARCH.filter(a => f === 'all' || a[1] === f);
  useLayoutEffect(() => { if (!reduce) gsap.from(ref.current.querySelectorAll('.gi'), { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', stagger: 0.05 }); }, [f]);
  useLayoutEffect(() => {
    if (lb < 0) return;
    const key = e => { if (e.key === 'Escape') setLb(-1); if (e.key === 'ArrowRight') setLb(i => (i + 1) % list.length); if (e.key === 'ArrowLeft') setLb(i => (i - 1 + list.length) % list.length); };
    addEventListener('keydown', key); document.documentElement.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', key); document.documentElement.style.overflow = ''; };
  }, [lb, list.length]);
  const cur = lb >= 0 ? list[lb] : null;
  return (<section ref={ref} id="archive" className="bg-night px-5 py-24 text-champ sm:px-6 md:px-12 md:py-32">
    <h2 className="font-display text-5xl font-semibold italic leading-[.95] md:text-8xl">The archive</h2>
    <p className="mt-3 max-w-xl text-base md:text-lg">Her collection, draping, prototypes, ethnic and unisex designs, illustrations, moodboards and the textile work behind them. Tap any picture to open it.</p>
    <TabRow dark={true} className="tabrow -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:mt-10 md:flex-wrap md:overflow-visible md:px-0">{CATS.map(([id, t]) => (<button key={id} type="button" onClick={() => { setF(id); setLb(-1); }} aria-pressed={f === id} className={'shrink-0 whitespace-nowrap rounded-full border-2 border-champ px-4 py-1.5 text-sm ' + (f === id ? 'bg-champ text-night' : '')}>{t}</button>))}</TabRow>
    <div className="mt-8 columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
      {list.map(([key, , title], i) => (<button key={key} type="button" onClick={() => setLb(i)} aria-label={'Open ' + title} className="gi group mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white/5 md:mb-4"><img src={IMG[key].src} width={IMG[key].w} height={IMG[key].h} alt={title} loading="lazy" decoding="async" className="block h-auto w-full transition-transform duration-700 group-hover:scale-105" /></button>))}
    </div>
    {cur ? (<div role="dialog" aria-modal="true" aria-label={cur[2]} onClick={() => setLb(-1)} className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 p-4">
        <img src={IMG[cur[0]].src} alt={cur[2]} onClick={e => e.stopPropagation()} className="max-h-[72svh] max-w-full rounded-lg object-contain" />
        <div onClick={e => e.stopPropagation()} className="mt-4 max-w-xl text-center"><p className="font-display text-2xl font-semibold italic md:text-3xl">{cur[2]}</p><p className="mt-1 text-sm md:text-base">{cur[3]}</p></div>
        <div onClick={e => e.stopPropagation()} className="mt-4 flex gap-3 text-sm uppercase tracking-[.2em]">
          <button type="button" onClick={() => setLb((lb - 1 + list.length) % list.length)} className="rounded-full border-2 border-champ px-4 py-1.5">Prev</button>
          <button type="button" onClick={() => setLb(-1)} className="rounded-full bg-champ px-4 py-1.5 text-night">Close</button>
          <button type="button" onClick={() => setLb((lb + 1) % list.length)} className="rounded-full border-2 border-champ px-4 py-1.5">Next</button>
        </div>
      </div>) : null}
  </section>);
}
