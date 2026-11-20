import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, NOPREF } from '../lib/motion';
import { XP } from '../data';

/* A gold line fills down the timeline as you scroll; each role lights its dot and rises in */
export default function Experience() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NOPREF, () => {
      const list = ref.current.querySelector('.xl');
      gsap.from('.xh', { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.04, scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } });
      gsap.fromTo('.xfill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 65%', scrub: true } });
      gsap.utils.toArray('.xr').forEach(r => {
        gsap.from(r.querySelectorAll('.xin'), { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: r, start: 'top 80%', once: true } });
        ScrollTrigger.create({ trigger: r, start: 'top 65%', onToggle: st => r.querySelector('.xdot').classList.toggle('on', st.isActive || st.progress > 0) });
      });
    }, ref);
    return () => mm.revert();
  }, []);
  return (<section ref={ref} id="experience" className="bg-night px-5 py-24 text-champ sm:px-6 md:px-12 md:py-36">
    <p className="text-xs uppercase tracking-[.3em] md:text-sm">Where I’ve worked</p>
    <h2 aria-label="Experience" className="mt-3 overflow-hidden pb-[.08em] font-display text-6xl font-semibold italic leading-[.95] md:text-9xl">{[...'Experience'].map((c, i) => (<span key={i} aria-hidden="true" className="xh inline-block">{c}</span>))}</h2>
    <div className="xl relative mt-14 pl-8 md:mt-20 md:pl-14">
      <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-champ/25"><div className="xfill h-full w-full origin-top bg-champ"></div></div>
      {XP.map(([when, co, role, pts, now]) => (<article key={co} className="xr relative grid gap-4 border-t border-champ/25 py-10 md:grid-cols-[14rem_1fr] md:gap-12 md:py-14">
          <span aria-hidden="true" className="xdot absolute -left-8 top-11 -ml-[6px] h-3 w-3 rounded-full border-2 border-champ bg-night md:-left-14 md:top-[3.75rem]"></span>
          <div className="xin">
            <p className="text-xs uppercase tracking-[.2em] md:text-sm">{when}</p>
            {now ? (<p className="mt-3 inline-flex items-center gap-2 rounded-full border border-champ px-3 py-1 text-[10px] uppercase tracking-[.2em]"><span className="pulse h-1.5 w-1.5 rounded-full bg-champ"></span>Current</p>) : null}
          </div>
          <div>
            <h3 className="xin font-display text-4xl font-semibold italic leading-[1] md:text-6xl">{co}</h3>
            <p className="xin mt-3 text-base uppercase tracking-[.18em] md:text-lg">{role}</p>
            {pts.length ? (<ul className="xin mt-5 max-w-2xl list-disc space-y-2 pl-5 text-base text-pearl/90 md:text-lg">{pts.map(t => (<li key={t}>{t}</li>))}</ul>) : null}
          </div>
        </article>))}
    </div>
  </section>);
}
