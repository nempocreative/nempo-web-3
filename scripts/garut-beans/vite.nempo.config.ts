// Builds the Garut Beans web (artifacts/kopi-garut-web from nempocreative/Garut-Coffee-166)
// as a static sub-site served by the NEMPO site at /garut-beans/.
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const appRoot = process.env.GB_APP_ROOT!;
const shims = process.env.GB_SHIMS!;

export default defineConfig({
  base: '/garut-beans/',
  root: appRoot,
  plugins: [react(), tailwindcss({ optimize: false })],
  resolve: {
    alias: [
      { find: /^@clerk\/react\/internal$/, replacement: path.join(shims, 'clerk-internal.ts') },
      { find: /^@clerk\/react$/, replacement: path.join(shims, 'clerk-react.tsx') },
      { find: /^@clerk\/themes\/.+\.css$/, replacement: path.join(shims, 'empty.css') },
      { find: /^@clerk\/themes$/, replacement: path.join(shims, 'clerk-themes.ts') },
      { find: /^@clerk\/localizations$/, replacement: path.join(shims, 'clerk-localizations.ts') },
      { find: '@', replacement: path.join(appRoot, 'src') },
      { find: '@assets', replacement: path.join(appRoot, '..', '..', 'attached_assets') },
    ],
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: path.join(appRoot, 'dist/nempo'),
    emptyOutDir: true,
  },
});
