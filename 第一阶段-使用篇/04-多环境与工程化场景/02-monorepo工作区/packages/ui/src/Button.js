// 这是内部包的「组件」。改这里的文字/样式并保存，
// app 端无需重新安装、无需重启，会直接 HMR —— 这就是「内部包热更新」。
export function createButton(label) {
  const el = document.createElement('button');
  el.textContent = `🔵 ${label}（来自 @demo/ui）`;
  el.style.cssText = 'padding:8px 16px;font-size:16px;border-radius:8px;cursor:pointer;';
  return el;
}
