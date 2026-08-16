// 故意拆成两个模块，让 resolveId/load/transform 在终端里多打印几次，
// 方便观察 Build 阶段「对每个模块循环」的过程。
import { greet } from './greet.js';

document.querySelector('#out').textContent = greet('Vite 插件');
