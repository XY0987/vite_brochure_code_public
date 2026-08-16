// 模拟一个「工具库」，会被 codeSplitting 规则拆进 vendor-utils chunk。
export function uniq(arr) {
  return [...new Set(arr)];
}
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}
export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
