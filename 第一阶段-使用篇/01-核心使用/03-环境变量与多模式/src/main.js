// 业务代码里读环境变量统一用 import.meta.env（不是 process.env）。
const env = import.meta.env;

// 故意尝试读取一个不带 VITE_ 前缀的变量，结果必然是 undefined。
const secret = env.SECRET_TOKEN; // -> undefined，安全闸门生效

document.querySelector('#app').innerHTML = `
  <h1>${env.VITE_APP_NAME}</h1>
  <table border="1" cellpadding="6" style="border-collapse:collapse">
    <tr><td>MODE</td><td><code>${env.MODE}</code></td></tr>
    <tr><td>DEV</td><td><code>${env.DEV}</code></td></tr>
    <tr><td>PROD</td><td><code>${env.PROD}</code></td></tr>
    <tr><td>VITE_API_BASE</td><td><code>${env.VITE_API_BASE}</code></td></tr>
    <tr><td>VITE_ENABLE_DEBUG</td><td><code>${env.VITE_ENABLE_DEBUG ?? '(未定义)'}</code></td></tr>
    <tr><td>SECRET_TOKEN（无前缀）</td><td><code>${String(secret)}</code> ← 读不到，符合预期</td></tr>
    <tr><td>__APP_VERSION__（define 注入）</td><td><code>${__APP_VERSION__}</code> ← 由 vite.config 的 loadEnv 读 APP_VERSION 注入</td></tr>
  </table>
  <p>用 dev / build / build:staging 分别运行，对比 MODE 与 VITE_API_BASE 的变化。</p>
`;

// import.meta.env.DEV 在 build 时会被静态替换为字面量，下面整块在生产产物中会被删除。
if (import.meta.env.DEV) {
  console.log('[仅开发环境] 这段调试日志在生产构建里会被 tree-shaking 删掉');
}
