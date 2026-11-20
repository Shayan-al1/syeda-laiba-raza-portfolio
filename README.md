# Syeda Laiba Raza – fashion portfolio

React + Vite + Tailwind CSS, animated with GSAP (ScrollTrigger, ScrollToPlugin), with a Three.js runway.

## Run it on your computer

Needs Node.js 18 or newer (check with `node -v`).

```bash
npm install
npm run dev       # opens at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # check the production build
```

## Deploy on Vercel

1. Create an empty repository on github.com, for example `syeda-laiba-raza-portfolio`.
2. In this folder run:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/syeda-laiba-raza-portfolio.git
   git push -u origin main
   ```
3. On vercel.com: **Add New > Project**, import the repository, keep the name `syeda-laiba-raza-portfolio` and click **Deploy**.
   Vercel detects Vite by itself; `vercel.json` already sets the build command and the `dist` folder.
4. You get an address like `https://syeda-laiba-raza-portfolio.vercel.app`. If it is different, put it in `.env`
   (`VITE_SITE_URL`), then commit and push. Every push to `main` redeploys automatically.

Without GitHub: `npm install -g vercel`, then `vercel login` and `vercel --prod` in this folder.

### Adding a domain later

**Project > Settings > Domains**, add the domain, then add the DNS records Vercel shows at your registrar
(on Cloudflare, set them to "DNS only"). Update `VITE_SITE_URL` in `.env` and push.

## Where things live

- `src/data.js` – all the text: contact details, runway looks, process steps, archive captions, design files
  (with their specs and pictures), about, skills, education and experience.
- `src/assets/work/` – every picture, mapped to its key in `src/lib/images.js`.
  To add a picture to a design file: put the image in `src/assets/work/`, add one import line to `images.js`,
  then add `['<key>', 'Label']` to that item's `pics` list in `data.js`.
- `public/Syeda_Laiba_Raza_CV.pdf` – the CV behind the Download CV button. Replace the file to update it.
- `public/og.jpg` – the picture shown when the link is shared (WhatsApp, LinkedIn).
- `src/components/` – Nav (with the full-screen phone menu), Runway (3D stage), Process, Files (design files),
  Archive, About, Experience, Contact, and TabRow (the swipeable tab rows on phones).
- `src/components/Runway.jsx` – `CURTAIN` near the top sets the curtain colour.
- `src/index.css` – custom styles; colours and fonts are in `tailwind.config.js`.
