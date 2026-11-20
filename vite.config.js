import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { LOOKS } from './src/data.js';

/* Start downloading the runway dresses as soon as the page opens, in parallel with the JavaScript,
   so the 3D frames are not empty while three.js loads. Picks the hashed files out of the build. */
const runwayPreload = () => ({
  name: 'runway-preload',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      const want = new Set(LOOKS.map(l => l[3] + '.jpg'));
      return Object.values(ctx.bundle || {})
        .filter(f => f.type === 'asset' && [f.name, ...(f.names || [])].some(n => n && want.has(n)))
        .map(f => ({ tag: 'link', attrs: { rel: 'preload', as: 'image', href: '/' + f.fileName, fetchpriority: 'high', crossorigin: 'anonymous' }, injectTo: 'head' }));
    }
  }
});

export default defineConfig({ plugins: [react(), runwayPreload()] });
