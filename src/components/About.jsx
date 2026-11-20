import { useRef, useLayoutEffect } from 'react';
import { gsap, NOPREF } from '../lib/motion';
import { ABOUT, SKILLS, EDU } from '../data';

/* Summary lights up word by word; skills and education rise in */
export default function About() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NOPREF, () => {
      const q = s => ref.current.querySelector(s);
      gsap.fromTo('.aw', { opacity: 0.15 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: q('.asum'), start: 'top 80%', end: 'bottom 50%', scrub: true } });
      gsap.from('.sk', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: q('.sklist'), start: 'top 85%', once: true } });
      gsap.from('.edu', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: q('.edu'), start: 'top 85%', once: true } });
    }, ref);
    return () => mm.revert();
  }, []);
  return (<section ref={ref} id="about" className="bg-pearl px-5 py-24 text-night sm:px-6 md:px-12 md:py-36">
    <p className="text-xs uppercase tracking-[.3em] md:text-sm">About</p>
    <p className="asum mt-6 max-w-5xl font-display font-semibold leading-tight" style={{ fontSize: 'clamp(1.75rem,4.4vw,3.9rem)' }}>{ABOUT.split(' ').map((w, i) => (<span key={i} className="aw">{w + ' '}</span>))}</p>
    <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-[1.3fr_1fr] md:gap-16">
      <div>
        <h3 className="text-xs uppercase tracking-[.3em] md:text-sm">Skills</h3>
        <ul className="sklist mt-4 border-t-2 border-night">{SKILLS.map((x, i) => (<li key={x} className="sk flex items-baseline gap-4 border-b border-night/25 py-3 md:py-4"><span className="w-8 text-xs tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span><span className="font-display text-2xl italic md:text-4xl">{x}</span></li>))}</ul>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-[.3em] md:text-sm">Education</h3>
        <div className="edu mt-4 rounded-2xl bg-night p-6 text-champ md:p-8" style={{ boxShadow: '8px 8px 0 #5A0F22' }}>
          <p className="text-xs uppercase tracking-[.25em]">{EDU[2]}</p>
          <p className="mt-4 font-display text-3xl font-semibold italic leading-tight md:text-4xl">{EDU[1]}</p>
          <p className="mt-3 text-base md:text-lg">{EDU[0]}</p>
        </div>
      </div>
    </div>
  </section>);
}
