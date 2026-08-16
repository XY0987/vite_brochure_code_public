// 这是 remote 对外暴露的模块。宿主 host 会在运行时远程加载它并调用 mount()。
// 它完全不知道自己会被谁加载——这正是 Module Federation 的解耦点：远程模块独立开发、独立部署。

export function mount(el) {
  const box = document.createElement('div');
  box.style.cssText =
    'border:2px dashed #646cff;padding:12px;border-radius:8px;font-family:system-ui';
  box.innerHTML = `
    <strong>👋 我是来自 remote 的 widget</strong>
    <p>我是被宿主在运行时远程加载进来的，构建时宿主里并没有我的代码。</p>
    <button id="mf-ping">点我计数</button> <span id="mf-count">0</span>
  `;
  el.appendChild(box);

  let n = 0;
  box.querySelector('#mf-ping').addEventListener('click', () => {
    n += 1;
    box.querySelector('#mf-count').textContent = String(n);
  });
}

export const meta = { from: 'remote', version: '1.0.0' };
