import 'highlight.js/styles/github.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import julia from 'highlight.js/lib/languages/julia';
import r from 'highlight.js/lib/languages/r';
import hljsVuePlugin from '@highlightjs/vue-plugin';

const langages = {
  javascript,
  typescript,
  python,
  julia,
  r,
};

for (const [nom, ext] of Object.entries(langages)) {
  hljs.registerLanguage(nom, ext);
}

export default hljsVuePlugin;
