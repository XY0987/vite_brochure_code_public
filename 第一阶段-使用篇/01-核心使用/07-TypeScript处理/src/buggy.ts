// 故意写一个类型错误：把 string 赋给 number。
// - `vite build`（npm run build:unsafe）会忽略它、构建成功（只转译）。
// - `tsc --noEmit`（npm run typecheck）会报错并退出码非 0。
//
// 体验完后，把下面这行改成 const wrong: number = 42; 让 npm run build 通过。
export const wrong: number = 'this is not a number';

export function double(x: number): number {
  return x * 2;
}
