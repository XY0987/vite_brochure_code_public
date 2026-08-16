// 场景 B（sourcemap）：故意抛错。build + preview 后点击按钮触发，
// 在 devtools Console 里堆栈应能映射回这个源码文件的具体行号（因为开了 sourcemap）。
export function boom() {
  const obj = null;
  return obj.somethingThatDoesNotExist(); // 故意的运行时错误
}
