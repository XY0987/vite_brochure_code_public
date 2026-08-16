// 同步依赖：会被分到 vendor chunk。
import { capitalize } from 'lodash-es';

document.querySelector('#app').innerHTML = `<h1>${capitalize('build 后看终端 chunk 体积与 dist/stats.html')}</h1>`;

// 动态 import：heavy.js 会被拆成独立 chunk，仅点击时才下载。
document.querySelector('#load').addEventListener('click', async () => {
  const { heavyCompute } = await import('./heavy.js');
  document.querySelector('#out').textContent = `动态加载完成，结果：${heavyCompute()}`;
});
