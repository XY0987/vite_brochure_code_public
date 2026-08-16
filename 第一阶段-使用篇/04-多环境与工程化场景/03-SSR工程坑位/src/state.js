// 只在服务端执行的数据准备。这里能安全读取「不带 VITE_ 前缀」的密钥，
// 因为这段代码只会进 SSR 包，绝不会泄露到浏览器。
export async function getServerState() {
  // SECRET_API_KEY 没有 VITE_ 前缀 → import.meta.env 里拿不到它，
  // 但服务端进程的 process.env 能拿到。真实项目用它去调后端取数据。
  const key = process.env.SECRET_API_KEY;

  return {
    renderedAt: new Date().toISOString(),
    // 注意：只下发「是否成功加载密钥」这个布尔值，绝不把 key 本身放进 state，
    // 否则它会被序列化进 HTML，等于泄露。
    secretLoaded: Boolean(key),
  };
}
