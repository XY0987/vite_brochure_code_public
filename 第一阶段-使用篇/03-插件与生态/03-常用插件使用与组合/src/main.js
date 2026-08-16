// 注意这里用了别名 @/，它来自 vite.config.js 的 resolve.alias（内置能力，最稳）。
// 想直接复用 tsconfig.json 的 paths：Vite 8 起内置 resolve.tsconfigPaths，
// 旧版本则用社区插件 vite-tsconfig-paths——本 demo 用的是内置 resolve.alias，见文章第 03 节。
import { sum } from '@/utils';

document.querySelector('#out').textContent = `@/utils 的 sum(1,2,3) = ${sum(1, 2, 3)}（别名由 resolve.alias 解析）`;
