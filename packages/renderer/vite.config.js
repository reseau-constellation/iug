/* eslint-env node */

import vue from '@vitejs/plugin-vue';
import {copyFileSync} from 'fs';
import {join} from 'node:path';
import {renderer} from 'unplugin-auto-expose';
import vuetify from 'vite-plugin-vuetify';
import {chrome} from '../../.electron-vendors.cache.json';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';

import {nodePolyfills} from 'vite-plugin-node-polyfills';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

const pourÉlectron = !process.env.WEB;

// C'est vraiment laid, mais rien d'autre marche...
if (pourÉlectron) {
  copyFileSync(join(PACKAGE_ROOT, 'indexÉlectron.html'), join(PACKAGE_ROOT, 'index.html'));
} else {
  copyFileSync(join(PACKAGE_ROOT, 'indexNavigateur.html'), join(PACKAGE_ROOT, 'index.html'));
}

const générerExtentions = () => {
  const extentions = [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    nodePolyfills(),
  ];
  if (pourÉlectron) {
    extentions.push(
      renderer.vite({
        preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
      }),
    );
  }
  extentions.push(injectAppVersion());
  return extentions;
};

const générerAliasRésolution = () => {
  const commun = {
    '/@/': join(PACKAGE_ROOT, 'src') + '/',
  };
  if (pourÉlectron) {
    return Object.assign({}, commun, {});
  } else {
    return Object.assign({}, commun, {
      '#preload': join(PACKAGE_ROOT, 'src') + '/polyfillPreload',
    });
  }
};

// Pareil pour Électron ou non, parce qu'ici il s'agit de la partie interface (rendu)
const dépendsÀExclure = [
  'chokidar',
  '@libp2p/tcp',
  '@libp2p/mdns',
  'env-paths',
  'datastore-fs',
  'blockstore-fs',
];

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: générerAliasRésolution(),
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  base: '', // pourÉlectron ? '' : '/iug/', // Plus nécessaire maintenant qu'on est sur appli.réseau-constellation.ca/
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: pourÉlectron ? `chrome${chrome}` : 'esnext',
    outDir: pourÉlectron ? 'dist' : 'dist/web',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
      external: dépendsÀExclure,
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    exclude: dépendsÀExclure,
    esbuildOptions: {
      target: 'esnext',
    },
  },
  test: {
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    coverage: {
      provider: 'istanbul',
    },
  },
  plugins: générerExtentions(),
};

export default config;
