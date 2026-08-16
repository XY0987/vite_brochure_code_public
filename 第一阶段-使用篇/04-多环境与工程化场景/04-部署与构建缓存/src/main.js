// 入口里只放「首屏必需」的代码；大模块用动态 import 懒加载，
// 让它被拆成独立 chunk —— 这是「分包 + 缓存」的基础：改了大模块只失效它那一个 chunk。
import { vendorHello } from './vendor-like.js';

document.querySelector('#out').textContent = vendorHello();

document.querySelector('#load').addEventListener('click', async () => {
  // 动态 import：big-feature 会被单独打成一个 chunk，点击时才按需下载。
  const { runBigFeature } = await import('./big-feature.js');
  document.querySelector('#out').textContent = runBigFeature();
});
