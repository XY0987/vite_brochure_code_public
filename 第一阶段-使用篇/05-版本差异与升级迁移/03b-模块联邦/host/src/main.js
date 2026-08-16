// 宿主在运行时动态加载 remote 暴露的模块。
// 注意 import('remote/widget') 里的 'remote' 对应 vite.config 的 remotes 键，
// 'widget' 对应 remote 那边 exposes 的 './widget'。
// 构建时宿主产物里并没有 widget 的代码，它是运行时从 5174 拉回来的。

const app = document.querySelector('#app');
app.innerHTML = '<p>宿主启动中，正在远程加载 remote/widget……</p>';

async function load() {
  try {
    const { mount, meta } = await import('remote/widget');
    app.innerHTML = `<p>已远程加载：${JSON.stringify(meta)}</p>`;
    mount(app);
  } catch (err) {
    app.innerHTML = `
      <p style="color:#c00">远程加载失败：${err?.message ?? err}</p>
      <p>请确认 remote 已在 5174 端口运行（见本 demo README 的运行步骤）。</p>`;
  }
}

load();
