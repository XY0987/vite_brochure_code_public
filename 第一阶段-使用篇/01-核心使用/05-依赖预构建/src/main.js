// lodash-es 内部由 600+ 个互相 import 的小模块组成。
// 预构建会把它合并成一个 ESM 文件，浏览器只发一个请求。
import { debounce, capitalize } from 'lodash-es';

const app = document.querySelector('#app');
app.innerHTML = `
  <h1>依赖预构建演示</h1>
  <p>${capitalize('open devtools network panel and filter by JS.')}</p>
  <p>默认：lodash-es 是 <code>一个</code> /node_modules/.vite/deps/lodash-es.js 请求。</p>
  <input id="search" placeholder="输入会被 debounce 处理（300ms）" style="width:320px;padding:6px" />
  <p id="out"></p>
`;

const out = document.querySelector('#out');
const onInput = debounce((value) => {
  out.textContent = `debounce 触发：${value}`;
}, 300);

document.querySelector('#search').addEventListener('input', (e) => onInput(e.target.value));
