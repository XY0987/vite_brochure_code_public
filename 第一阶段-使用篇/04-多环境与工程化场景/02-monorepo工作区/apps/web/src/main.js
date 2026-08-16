// 直接从内部包按「包名」import，而不是相对路径 ../../packages/ui。
// 这条 import 之所以能跑、还能 HMR，是因为：
//   1. npm workspaces 在根 node_modules 里把 @demo/ui 软链到 packages/ui；
//   2. @demo/ui 的 exports 指向源码 src/index.js（不是打包产物）；
//   3. Vite 顺着软链拿到源码，纳入模块图，按需编译 + HMR。
import { createButton, uiVersion } from '@demo/ui';

const app = document.querySelector('#app');
app.append(createButton('点我'));

const info = document.createElement('p');
info.textContent = `@demo/ui 版本：${uiVersion}`;
app.append(info);
