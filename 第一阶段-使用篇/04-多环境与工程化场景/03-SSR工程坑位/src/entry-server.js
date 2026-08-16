// 服务端入口：被 server.js 的 ssrLoadModule 加载并调用。
import { renderBuggyTime, renderStableTime } from './app.js';
import { platformLabel } from './platform.js';
import { getServerState } from './state.js';

export async function render() {
  const state = await getServerState();

  const html = `
    <section>
      <h2>① 水合不一致（hydration mismatch）</h2>
      <div id="buggy">${renderBuggyTime()}</div>
      <div id="stable">${renderStableTime(state)}</div>
    </section>
    <section>
      <h2>② / ③ 条件代码（import.meta.env.SSR）</h2>
      <div id="platform">${platformLabel()}</div>
    </section>
    <section>
      <h2>④ 环境变量泄露边界</h2>
      <div>公开变量 <code>VITE_PUBLIC_TITLE</code> = ${import.meta.env.VITE_PUBLIC_TITLE}</div>
      <div>服务端是否读到密钥（不下发密钥本身）= ${state.secretLoaded}</div>
    </section>
  `;

  // 把 state 一起返回，server.js 会序列化进 HTML 供客户端复用。
  return { html, state };
}
