// 一个「大功能」，被动态 import 懒加载，单独成 chunk。
export function runBigFeature() {
  const rows = Array.from({ length: 20 }, (_, i) => `row-${i}`);
  return `大功能已加载，生成 ${rows.length} 行：` + rows.join(', ');
}
