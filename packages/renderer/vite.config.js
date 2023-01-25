/* eslint-env node */

import {chrome} from '../../.electron-vendors.cache.json';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import {renderer} from 'unplugin-auto-expose';
import {join} from 'node:path';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';
import { copyFileSync } from 'fs';

import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

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
    
  ];
  if (pourÉlectron) {
    extentions.push(renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }));
  } else {
    extentions.push(NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }));
  }
  extentions.push(injectAppVersion());
  return extentions;
};

const générerAliasRésolution = () => {
  const commun = {
    '/@/': join(PACKAGE_ROOT, 'src') + '/',
  };
  if (pourÉlectron) {
    return commun;
  } else {
    return Object.assign({}, commun, {
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      crypto: 'crypto-browserify',
      path: 'rollup-plugin-node-polyfills/polyfills/path',
    });
  }
};

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
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: pourÉlectron ? `chrome${chrome}` : 'es2020',
    outDir: pourÉlectron ? 'dist' : 'dist/web',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
      external: pourÉlectron ? undefined : ['chokidar'],
      plugins: pourÉlectron ? undefined : [
        rollupNodePolyFill(),
      ],
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    exclude: pourÉlectron ? undefined : ['chokidar'],
  },
  test: {
    environment: 'happy-dom',
  },
  plugins: générerExtentions(),
  define: pourÉlectron ? undefined : {
    global: 'globalThis',
  },
};

export default config;
