import mitt from 'mitt';
import { button, card } from './vendor-ui.js';
import { uniq, sum } from './vendor-utils.js';

// 引入一个真实第三方依赖（mitt），让 dev 的依赖预构建有东西可缓存，
// 这样 scripts/cache-demo.mjs 才能演示出 node_modules/.vite 持久缓存目录。
const emitter = mitt();
emitter.on('hi', (n) => console.log('mitt event:', n));

const nums = [1, 2, 2, 3, 3, 3];
document.querySelector('#app').innerHTML = card(
  '单打包器分包演示',
  `${button('去重')}<p>uniq=[${uniq(nums)}] sum=${sum(nums)}</p>`,
);
