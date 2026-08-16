// 从「虚拟模块」导入——这个模块磁盘上不存在，由 demo-virtual-build-info 插件生成
import { buildInfo } from 'virtual:build-info';

document.querySelector('#build-info').textContent = JSON.stringify(buildInfo);

document.querySelector('#fetch-btn').addEventListener('click', async () => {
  const res = await fetch('/api/hello');
  const data = await res.json();
  document.querySelector('#api-result').textContent = JSON.stringify(data);
});

// 接收 demo-custom-hmr 插件发来的自定义 HMR 事件（仅 dev）
if (import.meta.hot) {
  import.meta.hot.on('txt-update', (payload) => {
    console.log('[client] 收到自定义 HMR 事件 txt-update：', payload);
    console.log('（注意：页面没有整页刷新，这是 hotUpdate 接管的效果）');
  });
}
