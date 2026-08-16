// client 环境入口：跑在浏览器，挂载到 DOM。
import { renderHTML } from './shared/app.js';

document.querySelector('#app').innerHTML = renderHTML(location.pathname);
