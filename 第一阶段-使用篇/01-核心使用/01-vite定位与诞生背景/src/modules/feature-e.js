// 一个独立的小模块，dev 模式下作为单独请求被按需编译返回。
export function feature() {
  return '模块 e 已加载（按需编译）';
}
