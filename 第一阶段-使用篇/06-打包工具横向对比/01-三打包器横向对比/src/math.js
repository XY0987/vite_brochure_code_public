export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// 故意留一个没人用的导出，用来观察三个打包器的 tree-shaking：
// 产物里都不应该出现 subtract。
export function subtract(a, b) {
  return a - b;
}
