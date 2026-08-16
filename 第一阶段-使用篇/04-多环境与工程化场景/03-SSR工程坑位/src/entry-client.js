// 客户端入口：水合 + 检测哪些块出现 hydration mismatch。
import { renderBuggyTime, renderStableTime } from './app.js';
// 引入条件导入模块：在客户端调用它，证明被 import.meta.env.SSR 包住的 Node 分支
//（用到 process）在客户端构建里已被裁掉，不会报 "process is not defined"。
import { platformLabel } from './platform.js';

const state = window.__SSR_STATE__ || {};

function checkBlock(id, clientHTML) {
  const el = document.getElementById(id);
  if (!el) return;
  const serverHTML = el.innerHTML;
  if (serverHTML !== clientHTML) {
    console.warn(`[hydration mismatch] #${id}\n  server: ${serverHTML}\n  client: ${clientHTML}`);
    el.style.outline = '2px solid red';
  } else {
    console.log(`[hydration ok] #${id}`);
    el.style.outline = '2px solid green';
  }
}

// ❌ buggy 块：客户端再算一次时间 → 与服务端不同 → 红框
checkBlock('buggy', renderBuggyTime());
// ✅ stable 块：用服务端下发的 state → 完全一致 → 绿框
checkBlock('stable', renderStableTime(state));

// ②/③ 条件导入：客户端走的是 import.meta.env.SSR === false 的分支（navigator），
// 而引用了 process 的服务端分支已被构建期 DCE 裁掉——所以这里不会报 process 未定义。
console.log('客户端 platformLabel() =', platformLabel());

// ④ 验证环境变量泄露边界：
console.log('客户端可见 VITE_PUBLIC_TITLE =', import.meta.env.VITE_PUBLIC_TITLE);
console.log('客户端可见 SECRET_API_KEY =', import.meta.env.SECRET_API_KEY, '（应为 undefined）');
