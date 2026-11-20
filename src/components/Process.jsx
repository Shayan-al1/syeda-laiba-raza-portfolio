import { useRef, useLayoutEffect, useState } from 'react';
import { gsap, ScrollTrigger, NOPREF, reduce } from '../lib/motion';
import { DESIGNS } from '../data';
import { IMG } from '../lib/images';
import TabRow from './TabRow';

/* Scroll follows one idea from sketch to illustration, draping and finished dress; pick a design to switch */
export default function Process() {
  const ref = useRef(null), pr = useRef(0), dr = useRef(0), [d, setD] = useState(0);
  dr.current = d;
  const apply = () => {
    const root = ref.current, steps = DESIGNS[dr.current][1], n = steps.length, t = pr.current * (n - 1), k = Math.round(t);
    root.querySelectorAll('.ml').forEach((el, i) => { if (i) el.style.clipPath = 'inset(0 ' + (100 - 100 * Math.min(1, Math.max(0, t - (i - 1)))) + '% 0 0)'; });
    root.querySelector('.mlab').textContent = steps[k][0];
    root.querySelectorAll('.mdot').forEach((el, i) => el.classList.toggle('on', i <= k));
  };
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    /* Pin only when the screen is tall enough to show the whole section; on short screens (phones in landscape) it plays as you scroll past */
    mm.add(NOPREF + ' and (min-height: 600px)', () => { ScrollTrigger.create({ trigger: ref.current, start: 'top top', end: '+=400%', pin: true, scrub: true, onUpdate: s => { pr.current = s.progress; apply(); } }); }, ref);
    mm.add(NOPREF + ' and (max-height: 599px)', () => { ScrollTrigger.create({ trigger: ref.current, start: 'top 80%', end: 'bottom 20%', scrub: true, onUpdate: s => { pr.current = s.progress; apply(); } }); }, ref);
    return () => mm.revert();
  }, []);
  useLayoutEffect(() => { if (!reduce) apply(); }, [d]);
  const steps = DESIGNS[d][1];
  return (<section ref={ref} id="process" className="relative flex min-h-[100svh] flex-col justify-center bg-pearl px-5 py-16 text-night sm:px-6 md:px-12 md:py-0">
    <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[1fr_1.1fr] md:gap-14">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[.25em] md:text-sm">From sketch to dress</p>
        <h2 className="mt-2 font-display text-4xl font-semibold italic leading-[.95] md:text-7xl">One idea, step by step</h2>
        <TabRow dark={false} className="tabrow -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 sm:-mx-6 sm:px-6 md:mx-0 md:mt-6 md:flex-wrap md:overflow-visible md:px-0">{DESIGNS.map(([n], i) => (<button key={n} type="button" onClick={() => setD(i)} aria-pressed={d === i} className={'shrink-0 whitespace-nowrap rounded-full border-2 border-night px-3 py-1 text-sm md:px-4 md:py-1.5 ' + (d === i ? 'bg-night text-pearl' : '')}>{n}</button>))}</TabRow>
        <p aria-live="polite" className="mlab mt-4 font-display text-3xl italic text-[#B3173F] md:mt-8 md:text-5xl"></p>
        <div className="mt-2 flex gap-2">{steps.map((s, i) => (<span key={s[0] + i} className="mdot"></span>))}</div>
        <p className="hint mt-3 text-xs uppercase tracking-[.2em] md:mt-6 md:text-sm">Scroll to follow the idea</p>
      </div>
      <div className="mframe relative mx-auto aspect-[3/4] h-[44svh] overflow-hidden rounded-2xl bg-night md:h-auto md:w-full md:max-w-md" style={{ boxShadow: '8px 8px 0 #0A0608' }}>
        {steps.map(([lab, key], i) => (<img key={d + key} className="ml absolute inset-0 h-full w-full object-cover" src={IMG[key].src} alt={lab + ': ' + DESIGNS[d][0]} style={{ clipPath: i && !reduce ? 'inset(0 100% 0 0)' : 'none', objectPosition: 'center 25%' }} />))}
      </div>
    </div>
  </section>);
}
