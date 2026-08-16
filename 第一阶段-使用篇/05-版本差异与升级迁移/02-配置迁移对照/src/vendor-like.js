// 模拟一个「第三方库」：很少变动、但有一定体积。
// 文件名里带 vendor-like，让两份配置的分包规则都能用 /vendor-like/ 命中它，
// 把它拆进独立的 vendor chunk —— 这样业务代码改动时 vendor 的哈希不变，长效缓存命中。

export function formatDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export function range(start, end, step = 1) {
  const out = [];
  for (let i = start; i < end; i += step) out.push(i);
  return out;
}

export function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
