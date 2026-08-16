// 条件导入 / 条件代码：用 import.meta.env.SSR 隔离「只在服务端能跑」的逻辑。
// 关键认知：被 `if (import.meta.env.SSR)` 包住的分支，在客户端构建时会被
// 当成死代码裁掉。所以下面虽然引用了 Node 专有的 process，客户端也不会报
// 「process is not defined」—— 因为那段代码根本没被打进客户端包。
export function platformLabel() {
  if (import.meta.env.SSR) {
    // 仅服务端：可安全使用 Node API
    return `服务端渲染（Node ${process.version}）`;
  }
  // 仅客户端
  return `客户端水合（${navigator.userAgent.slice(0, 40)}…）`;
}
