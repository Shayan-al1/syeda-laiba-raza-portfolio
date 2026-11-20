import { createRoot } from 'react-dom/client';
import './index.css';
import { ScrollTrigger } from './lib/motion';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);

/* Re-measure scroll positions once images and fonts have settled */
addEventListener('load', () => ScrollTrigger.refresh());
if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
