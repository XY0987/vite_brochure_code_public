// 客户端入口：在浏览器里「接管」服务端already渲染好的 DOM（注水/hydrate）。
// 本 demo 用纯 DOM，演示客户端在 SSR 内容之上挂载交互。
import { renderApp } from './app.js';

const app = document.querySelector('#app');

// 真实框架（Vue/React）会做 hydrate；这里只追加一个仅客户端可用的交互按钮，
// 说明「服务端给首屏、客户端补交互」的分工。
const btn = document.createElement('button');
btn.textContent = '客户端交互：点我（这部分只在浏览器运行）';
let n = 0;
btn.addEventListener('click', () => (btn.textContent = `点击了 ${++n} 次`));
app.appendChild(btn);

console.log('客户端入口已执行，import.meta.env.SSR =', import.meta.env.SSR); // false
// 保留对 renderApp 的引用，演示同构模块也能在客户端使用。
void renderApp;
