// Public builds are self-contained; opt in explicitly to the original backend.
export const PORTFOLIO_MODE = import.meta.env.VITE_PORTFOLIO_MODE !== 'false';

// Site root, e.g. '/Andes/' on GitHub Pages; links and routes are resolved against it.
export const BASE_URL = import.meta.env?.BASE_URL || '/';
export const sitePath = (path = '') => BASE_URL + path.replace(/^\/+/, '');
