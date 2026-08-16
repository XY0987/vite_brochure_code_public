// 库的公共 API。库模式下这些具名导出会出现在 ESM 产物里，
// 并在 UMD 产物里挂到全局 MyLib 对象上。

export function add(a, b) {
  return a + b;
}

export function createCounter(initial = 0) {
  let value = initial;
  return {
    increment: () => ++value,
    decrement: () => --value,
    get: () => value,
  };
}
