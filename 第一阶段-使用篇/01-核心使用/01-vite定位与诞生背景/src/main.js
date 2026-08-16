// 入口模块。每一个 import 在 dev 模式下都会触发浏览器对该模块的独立请求，
// dev server 收到请求后才「按需」编译并返回 —— 这就是 Vite 启动快的根源。
//
// 实验：把下面任意一行 import 注释掉再刷新页面，对应的网络请求会消失，
// 说明「没用到的模块就不会被编译、不会被传输」。
import { feature } from './modules/feature-a.js';
import { feature as featureB } from './modules/feature-b.js';
import { feature as featureC } from './modules/feature-c.js';
import { feature as featureD } from './modules/feature-d.js';
import { feature as featureE } from './modules/feature-e.js';

const list = document.querySelector('#list');

for (const item of [feature(), featureB(), featureC(), featureD(), featureE()]) {
  const li = document.createElement('li');
  li.textContent = item;
  list.appendChild(li);
}
