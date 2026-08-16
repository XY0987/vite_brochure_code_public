import './global.scss';                 // Sass：自动注入全局变量，零 loader
import logoUrl from '@/assets/logo.svg'; // 被 import 的资源：build 后带哈希
import btn from '@/button.module.css';   // CSS Modules：类名局部哈希化

// import.meta.glob 批量引入 icons 目录，eager + ?url 直接拿 URL 字符串。
const iconModules = import.meta.glob('@/icons/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
});
const iconUrls = Object.values(iconModules);

// 普通 JS 模块 glob：返回动态 import 函数，点击时才真正加载对应模块。
const demoModules = import.meta.glob('./modules/*.js');
const demoModulePaths = Object.keys(demoModules);

const app = document.querySelector('#app');
app.innerHTML = `
  <!-- public/ 资源用根绝对路径引用，不 import，不带哈希 -->
  <img src="/banner.svg" alt="banner" />
  <div class="card">
    <h1><img src="${logoUrl}" width="28" style="vertical-align:middle" /> 资源与 CSS demo</h1>
    <p>上方 banner 来自 public/（无哈希）；这个 logo 是 import 进来的（build 后带哈希）。</p>
    <p>下面的图标用 import.meta.glob 批量引入：</p>
    <p>${iconUrls.map((u) => `<img src="${u}" />`).join(' ')}</p>
    <p>普通 JS 模块 glob 会得到动态 import 函数：${demoModulePaths.join('、')}</p>
    <button id="load-module">加载第一个 JS 模块</button>
    <p id="module-result">尚未加载</p>
    <button class="${btn.primary}">CSS Modules 按钮（类名已哈希）</button>
  </div>
`;

document.querySelector('#load-module').addEventListener('click', async () => {
  const firstPath = demoModulePaths[0];
  const mod = await demoModules[firstPath]();
  document.querySelector('#module-result').textContent = `${firstPath}: ${mod.message}`;
});
