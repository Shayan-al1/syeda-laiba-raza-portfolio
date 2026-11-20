import { useRef, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap, ScrollTrigger, reduce } from '../lib/motion';
import { D, LOOKS } from '../data';
import { IMG } from '../lib/images';

/* ---------- Three.js runway: her finished dresses stand in spotlit frames ---------- */
/* Curtain colour as red, green, blue (0 to 1). Emerald now; try [0.1,0.14,0.32] for midnight blue, [0.25,0.08,0.22] for plum or [0.86,0.77,0.64] for pearl satin (then make the title dark) */
const CURTAIN = [0.05, 0.28, 0.2];
const CURT_V = `varying vec3 vMV; void main(){ vec3 p = position; p.z += sin(p.x*5.0)*0.28 + sin(p.x*13.0)*0.06;
  vec4 mv = modelViewMatrix*vec4(p,1.0); vMV = mv.xyz; gl_Position = projectionMatrix*mv; }`;
const CURT_F = `uniform vec3 uCol; varying vec3 vMV; void main(){ vec3 N = normalize(cross(dFdx(vMV), dFdy(vMV))); vec3 V = normalize(-vMV); if (dot(N,V) < 0.0) N = -N;
  vec3 L = normalize(vec3(0.3,0.6,0.9)); float d = max(dot(N,L),0.0); float s = pow(max(dot(N,normalize(L+V)),0.0), 22.0);
  vec3 c = uCol*(0.35 + d*1.7) + vec3(0.75,1.0,0.88)*s*0.3; gl_FragColor = vec4(c,1.0); }`;
const BEAM_V = `varying vec3 vMV; varying vec3 vN; varying float vT; varying float vA;
void main(){ vT = (position.y + 3.8)/7.6; vA = atan(position.z, position.x);
  vec4 mv = modelViewMatrix*vec4(position,1.0); vMV = mv.xyz; vN = normalMatrix*normal; gl_Position = projectionMatrix*mv; }`;
const BEAM_F = `uniform float uTime; uniform float uI; varying vec3 vMV; varying vec3 vN; varying float vT; varying float vA;
void main(){ vec3 n = normalize(vN), v = normalize(-vMV); float rim = pow(abs(dot(n, v)), 1.7);
  float streak = 0.82 + 0.18*sin(vA*7.0 + uTime*0.25 + vT*4.0);
  float a = rim*(0.18 + 0.82*vT)*streak*uI*0.55; a *= exp(-pow(length(vMV)*0.052, 2.0));
  gl_FragColor = vec4(1.0, 0.86, 0.64, a); }`;
const REF_V = `varying vec2 vUv; varying vec3 vMV; void main(){ vUv = uv; vec4 mv = modelViewMatrix*vec4(position,1.0); vMV = mv.xyz; gl_Position = projectionMatrix*mv; }`;
const REF_F = `uniform sampler2D uMap; uniform float uOp; varying vec2 vUv; varying vec3 vMV;
void main(){ vec4 c = texture2D(uMap, vUv); float a = uOp*(1.0 - smoothstep(0.0, 0.8, vUv.y)); a *= exp(-pow(length(vMV)*0.05, 2.0)); gl_FragColor = vec4(c.rgb*0.9, a); }`;
const cv2d = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return new THREE.CanvasTexture(c); };
function buildRunway(canvas, S, M, onLook) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0608); scene.fog = new THREE.FogExp2(0x0a0608, 0.05);
  const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 120), Lz = i => i === LOOKS.length - 1 ? -50 : -7 - i * 9.5, END = -58, last = LOOKS.length - 1;
  const glow = cv2d(64, 64, g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,232,196,1)'); r.addColorStop(0.3, 'rgba(255,200,140,.35)'); r.addColorStop(1, 'rgba(255,200,140,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const add = (m, o = {}) => { if (o.position) m.position.copy(o.position); if (o.rotation) m.rotation.copy(o.rotation); if (o.renderOrder !== undefined) m.renderOrder = o.renderOrder; scene.add(m); return m; };
  const floorTex = cv2d(256, 512, (g, w, h) => { g.fillStyle = '#1a0e14'; g.fillRect(0, 0, w, h); const b = g.createLinearGradient(0, 0, w, 0); b.addColorStop(0, 'rgba(255,225,170,0)'); b.addColorStop(0.5, 'rgba(255,225,170,.26)'); b.addColorStop(1, 'rgba(255,225,170,0)'); g.fillStyle = b; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(242,215,160,.8)'; g.fillRect(6, 0, 3, h); g.fillRect(w - 9, 0, 3, h); });
  floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(1, 18);
  add(new THREE.Mesh(new THREE.PlaneGeometry(6, 70), new THREE.MeshBasicMaterial({ map: floorTex, transparent: true, opacity: 0.8, depthWrite: false })), { position: new THREE.Vector3(0, 0, -26), rotation: new THREE.Euler(-Math.PI / 2, 0, 0) });
  const edge = []; for (let z = 6; z > -62; z -= 1.6) edge.push(-3, 0.08, z, 3, 0.08, z);
  const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.Float32BufferAttribute(edge, 3));
  add(new THREE.Points(eg, new THREE.PointsMaterial({ size: 0.42, map: glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  const eg2 = new THREE.BufferGeometry(); eg2.setAttribute('position', new THREE.Float32BufferAttribute(edge.map((v, i) => i % 3 === 1 ? -v : v), 3));
  add(new THREE.Points(eg2, new THREE.PointsMaterial({ size: 0.36, map: glow, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })));
  const dust = []; for (let i = 0; i < 450; i++) dust.push((Math.random() - 0.5) * 12, Math.random() * 6, 6 - Math.random() * 66);
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3));
  const dp = add(new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.09, map: glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  const gm = [], bm = [];
  LOOKS.forEach(([, , , key], i) => {
    const side = i === last ? 0 : (i % 2 ? 1 : -1), im = IMG[key], h = i === last ? 2.7 : 3.1, w = h * im.w / im.h, z = Lz(i);
    const pm = new THREE.MeshBasicMaterial({ color: 0x2a1a20, side: THREE.DoubleSide });
    /* One download and one texture per dress, shared by the frame and its reflection */
    new THREE.TextureLoader().load(im.src, t => { pm.map = t; pm.color.set(0xffffff); pm.needsUpdate = true; rm.uniforms.uMap.value = t; rm.uniforms.uOp.value = 0.5; });
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.14, h + 0.14), new THREE.MeshBasicMaterial({ color: 0xf2d7a0, side: THREE.DoubleSide })); frame.position.z = -0.01;
    const grp = new THREE.Group(); grp.add(frame, new THREE.Mesh(new THREE.PlaneGeometry(w, h), pm)); grp.position.set(side * 1.7, h / 2 + 0.12, z); scene.add(grp); gm.push([grp, side, i]);
    /* Mirror image under the floor: brightest at the base of the frame, fading with depth and with distance */
    const rm = new THREE.ShaderMaterial({ uniforms: { uMap: { value: null }, uOp: { value: 0 } }, vertexShader: REF_V, fragmentShader: REF_F, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const rg = new THREE.Group(); rg.add(new THREE.Mesh(new THREE.PlaneGeometry(w, h), rm)); rg.scale.y = -1; rg.position.set(side * 1.7, -(h / 2 + 0.12), z); rg.renderOrder = 1; scene.add(rg); gm.push([rg, side, i]);
    const bmat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uI: { value: 1 } }, vertexShader: BEAM_V, fragmentShader: BEAM_F, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const beam = add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 1.35, 7.6, 48, 1, true), bmat), { position: new THREE.Vector3(side * 1.7, 3.8, z), renderOrder: 2 });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); pool.rotation.x = -Math.PI / 2; pool.position.y = -3.77; beam.add(pool);
    const mp = []; for (let k = 0; k < 70; k++) { const y = Math.random() * 7, r = (0.12 + 1.23 * (1 - y / 7.6)) * Math.sqrt(Math.random()), a = Math.random() * 6.283; mp.push(Math.cos(a) * r, y, Math.sin(a) * r); }
    const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.Float32BufferAttribute(mp, 3));
    const motes = add(new THREE.Points(mg, new THREE.PointsMaterial({ size: 0.07, map: glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })), { position: new THREE.Vector3(side * 1.7, 0, z) });
    bm.push([beam, motes, side, bmat, z]);
  });
  const cm = () => new THREE.ShaderMaterial({ uniforms: { uCol: { value: new THREE.Vector3(CURTAIN[0], CURTAIN[1], CURTAIN[2]) } }, extensions: { derivatives: true }, vertexShader: CURT_V, fragmentShader: CURT_F, side: THREE.DoubleSide });
  const cl = add(new THREE.Mesh(new THREE.PlaneGeometry(8, 12, 80, 1), cm()), { position: new THREE.Vector3(-4, 3, 2.3) }), cr = add(new THREE.Mesh(new THREE.PlaneGeometry(8, 12, 80, 1), cm()), { position: new THREE.Vector3(4, 3, 2.3) });
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.fov = cam.aspect < 1 ? 70 : 55; cam.updateProjectionMatrix(); const X = cam.aspect < 1 ? 1.05 : 1.7; gm.forEach(([m, s]) => { m.position.x = s * X; }); bm.forEach(([b, mo, s]) => { b.position.x = mo.position.x = s * X; }); };
  let t = 0, tm = performance.now(), cur = -2;
  const render = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - tm) / 1000); tm = now; t += dt;
    const open = Math.min(1, Math.max(0, S.p / 0.1)), e = open * open * (3 - 2 * open);
    cl.position.x = -4 - e * 5.4; cr.position.x = 4 + e * 5.4; cl.visible = cr.visible = S.p < 0.14;
    const k = Math.min(1, Math.max(0, (S.p - 0.07) / 0.86)), z = 4.2 - k * (4.2 - END - 3);
    cam.position.set(Math.sin(k * 40) * 0.05, 1.55 + Math.sin(k * 90) * 0.03, z); cam.rotation.set(M.y * 0.05, -M.x * 0.16, 0);
    gm.forEach(([m, s, ph]) => { m.rotation.y = -s * 0.55 + Math.sin(t * 0.8 + ph) * 0.04; });
    dp.position.y = Math.sin(t * 0.4) * 0.1; dp.position.x = Math.sin(t * 0.2) * 0.2;
    const on = Math.min(1, Math.max(0, (S.p - 0.04) / 0.12));
    bm.forEach(([, motes, , mat, bz]) => { const near = Math.max(0, 1 - Math.abs(z - bz) / 7); mat.uniforms.uTime.value = t; mat.uniforms.uI.value = on * (0.55 + 0.9 * near * near); motes.rotation.y = t * 0.1; });
    const idx = LOOKS.findIndex((_, i) => Math.abs(z - Lz(i)) < 5); if (idx !== cur) { cur = idx; onLook(idx); }
    renderer.render(scene, cam);
  };
  resize();
  return { render, resize, dispose: () => renderer.dispose() };
}

export default function Runway() {
  const ref = useRef(null), cv = useRef(null), fxRef = useRef(true), [ok, setOk] = useState(true), [fx, setFx] = useState(true); fxRef.current = fx;
  useLayoutEffect(() => {
    const root = ref.current, S = { p: reduce ? 0.2 : 0 }, M = { x: 0, y: 0 }, q = s => root.querySelector(s), timers = [];
    /* Camera flashes from the sides as each look passes: at most 4 short, soft bursts, never faster than 3 a second */
    const flash = side => { const el = q(side ? '.fl-r' : '.fl-l'); if (el) gsap.fromTo(el, { opacity: 0 }, { opacity: 0.38, duration: 0.05, yoyo: true, repeat: 1, ease: 'power1.out' }); };
    const onLook = i => {
      if (i >= 0 && fxRef.current && !reduce) { timers.forEach(clearTimeout); timers.length = 0; [150, 560, 980, 1450].forEach((d, n) => timers.push(setTimeout(() => flash((n + i) % 2), d + Math.random() * 60))); }
      const lab = q('.lab'), L = LOOKS[i];
      gsap.to(lab, { opacity: 0, y: 12, duration: 0.2, onComplete: () => { if (L) { q('.ln').textContent = L[0]; q('.lt').textContent = L[1]; q('.lf').textContent = L[2]; } gsap.to(lab, { opacity: L ? 1 : 0, y: 0, duration: 0.4 }); } });
    };
    const sc = buildRunway(cv.current, S, M, onLook);
    if (!sc) { setOk(false); return; }
    if (reduce) { sc.render(); return () => sc.dispose(); }
    let active = true; const tick = () => { if (active) sc.render(); }; gsap.ticker.add(tick);
    const qx = gsap.quickTo(M, 'x', { duration: 0.8 }), qy = gsap.quickTo(M, 'y', { duration: 0.8 });
    const mv = e => { qx((e.clientX / innerWidth - 0.5) * 2); qy(-(e.clientY / innerHeight - 0.5) * 2); }, rs = () => sc.resize();
    addEventListener('pointermove', mv); addEventListener('resize', rs); ScrollTrigger.addEventListener('refresh', rs);
    const clamp = gsap.utils.clamp(0, 1);
    const st = ScrollTrigger.create({ trigger: root, start: 'top top', end: '+=700%', pin: true, onToggle: s => { active = s.progress < 1; },
      onUpdate: s => {
        gsap.to(S, { p: s.progress, duration: 0.5, ease: 'power2.out', overwrite: true });
        gsap.set(['.title', '.hint'].map(q), { opacity: 1 - clamp(s.progress / 0.06) });
        gsap.set(q('.fin'), { opacity: clamp((s.progress - 0.9) / 0.06) });
        gsap.set(q('.pbar'), { scaleX: s.progress });
      } });
    gsap.from('.tch', { yPercent: 115, rotation: 5, duration: 1.3, ease: 'power4.out', stagger: 0.04, delay: 0.3 });
    return () => { timers.forEach(clearTimeout); gsap.ticker.remove(tick); st.kill(); removeEventListener('pointermove', mv); removeEventListener('resize', rs); ScrollTrigger.removeEventListener('refresh', rs); sc.dispose(); };
  }, []);
  const word = w => (<span className="block overflow-hidden pb-[.08em]" aria-hidden="true">{[...w].map((c, i) => (<span key={i} className="tch inline-block">{c === ' ' ? '\u00a0\u00a0' : c}</span>))}</span>);
  return (<section ref={ref} id="top" className="rw relative h-[100svh] overflow-hidden bg-night">
    <canvas ref={cv} aria-hidden="true" className={'absolute inset-0 h-full w-full ' + (ok ? '' : 'noscr')}></canvas>
    <div className="title pointer-events-none absolute inset-0 z-10 grid place-items-center px-4 text-center">
      <h1 aria-label={D.name} className="font-display font-semibold italic leading-[.9] text-champ" style={{ fontSize: 'clamp(3rem,11vw,10rem)', textShadow: '0 4px 40px rgba(0,0,0,.6)' }}>{word('Syeda')}{word('Laiba Raza')}</h1>
    </div>
    <p aria-hidden="true" className="hint absolute inset-x-0 bottom-8 z-10 text-center text-xs uppercase tracking-[.3em] text-champ md:text-sm">Scroll to walk the runway</p>
    <div className="lab absolute bottom-10 left-5 z-10 max-w-[70vw] opacity-0 sm:left-6 md:left-12"><p className="ln font-display text-5xl italic md:text-7xl"></p><p className="lt font-display text-2xl font-semibold md:text-4xl"></p><p className="lf text-xs uppercase tracking-[.2em] md:text-sm"></p></div>
    <div className="fin pointer-events-none absolute inset-x-0 bottom-16 z-10 px-4 text-center opacity-0"><p className="font-display font-semibold italic text-pearl" style={{ fontSize: 'clamp(2rem,6vw,5rem)', lineHeight: 0.95, textShadow: '0 4px 30px rgba(0,0,0,.8)' }}>{D.name}</p></div>
    <div aria-hidden="true" className="fl fl-l pointer-events-none absolute inset-y-0 left-0 z-20 w-[45%] opacity-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 55%, rgba(255,255,255,.95), rgba(255,255,255,0) 70%)' }}></div>
    <div aria-hidden="true" className="fl fl-r pointer-events-none absolute inset-y-0 right-0 z-20 w-[45%] opacity-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 100% 55%, rgba(255,255,255,.95), rgba(255,255,255,0) 70%)' }}></div>
    <button type="button" onClick={() => setFx(!fx)} aria-pressed={fx} className="fxbtn absolute bottom-4 right-4 z-30 rounded-full border border-white px-3 py-1 text-[10px] uppercase tracking-[.2em] text-white mix-blend-difference md:bottom-6 md:right-12 md:text-xs">Flashes {fx ? 'on' : 'off'}</button>
    <div aria-hidden="true" className="pbar absolute inset-x-0 bottom-0 z-10 h-1 origin-left bg-champ" style={{ transform: 'scaleX(0)' }}></div>
  </section>);
}
