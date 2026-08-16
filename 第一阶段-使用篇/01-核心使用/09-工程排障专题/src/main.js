import { mountCounter } from './counter.js';
import { APP_TITLE } from './global-config.js';
import { boom } from './buggy-throw.js';

document.title = APP_TITLE;
document.querySelector('#cfg').textContent = APP_TITLE;

mountCounter(document.querySelector('#counter'));

document.querySelector('#boom').addEventListener('click', () => {
  // 触发错误，配合 sourcemap 在 devtools 里定位到 buggy-throw.js
  boom();
});
