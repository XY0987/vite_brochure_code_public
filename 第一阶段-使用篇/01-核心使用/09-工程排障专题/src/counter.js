// 场景 A（局部 HMR）：本模块用 import.meta.hot.accept 声明了「接受边界」，
// 改动这里时 Vite 做局部热更新（终端打印 hmr update），不刷新整页。
// 计数状态通过 import.meta.hot.data 在热替换间传递——改按钮文案后，
// 文案会即时更新、而 count 不会被重置，这才是「局部 HMR 状态保留」的正确姿势。
let count = import.meta.hot?.data.count ?? 0;
let rootEl = import.meta.hot?.data.rootEl ?? null;

export function mountCounter(el) {
  rootEl = el;
  el.innerHTML = `<button id="inc">点击次数：${count}</button>`;
  el.querySelector('#inc').addEventListener('click', () => {
    count++;
    el.querySelector('#inc').textContent = `点击次数：${count}`;
  });
}

if (import.meta.hot) {
  // 热替换前把当前状态存进 data，供新模块恢复。
  import.meta.hot.dispose((data) => {
    data.count = count;
    data.rootEl = rootEl;
  });
  // 自接受：新模块从 data.count 恢复计数，并重新挂载到同一容器
  //（重写 innerHTML 会移除旧按钮及其监听，不会产生重复监听）。
  import.meta.hot.accept((newModule) => {
    if (newModule && rootEl) newModule.mountCounter(rootEl);
  });
}
