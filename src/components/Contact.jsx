import { useRef, useLayoutEffect } from 'react';
import { gsap, NOPREF } from '../lib/motion';
import { D } from '../data';

/* Download CV: the PDF lives in /public, so this is a plain browser download. Replace public/Syeda_Laiba_Raza_CV.pdf to update it. */
const CV_NAME = 'Syeda_Laiba_Raza_CV.pdf';
function CvButton() {
  return (<a href={import.meta.env.BASE_URL + CV_NAME} download={CV_NAME} className="inline-flex items-center gap-2 rounded-full border border-champ px-5 py-2.5">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>Download CV</a>);
}

export default function Contact() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NOPREF, () => {
      gsap.from('.cw', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.08, scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } });
      if (!matchMedia('(hover: hover)').matches) return;
      const b = ref.current.querySelector('.mag'), qx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      const mv = e => { const r = b.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2, near = Math.hypot(dx, dy) < 200; qx(near ? dx * 0.4 : 0); qy(near ? dy * 0.4 : 0); };
      addEventListener('pointermove', mv); return () => removeEventListener('pointermove', mv);
    }, ref);
    return () => mm.revert();
  }, []);
  return (<footer ref={ref} id="contact" className="flex min-h-[100svh] flex-col justify-between bg-velvet px-5 pb-8 pt-28 text-champ sm:px-6 md:px-12">
    <h2 className="font-display font-semibold italic leading-[.95]" style={{ fontSize: 'clamp(2.75rem,10vw,9rem)' }}>
      {['Come to the', 'fitting.'].map(l => (<span key={l} className="block overflow-hidden pb-[.08em]"><span className="cw block">{l}</span></span>))}
    </h2>
    <div className="flex flex-wrap items-center gap-8 md:gap-12">
      <a href={'mailto:' + D.email} className="mag grid h-32 w-32 place-items-center rounded-full bg-champ text-center text-base font-medium text-night md:h-44 md:w-44 md:text-lg">Get in touch</a>
      <div className="text-base md:text-xl">
        <a href={'mailto:' + D.email} className="break-all underline decoration-champ decoration-2 underline-offset-8">{D.email}</a>
        <p className="mt-2"><a href={D.tel} className="underline-offset-8 hover:underline">{D.phone}</a></p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm md:text-base">
          <a href={D.whatsapp} target="_blank" rel="noopener" className="rounded-full bg-champ px-5 py-2.5 font-medium text-night">Chat on WhatsApp</a>
          <a href={D.tel} className="rounded-full border border-champ px-5 py-2.5">Call</a>
          <CvButton />
        </div>
      </div>
    </div>
    <p className="text-xs md:text-sm">© {new Date().getFullYear()} {D.name}</p>
  </footer>);
}
