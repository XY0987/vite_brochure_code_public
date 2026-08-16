// 「探针」插件（demo 里注册了 PRE / NORMAL / POST 三个），用来在终端观察插件的执行顺序：
//   enforce: 'pre' 批 → 普通批 → enforce: 'post' 批；同批内按数组顺序。
// 配套文章：第一阶段-使用篇/03-插件与生态/03-常用插件的使用与组合.md

export function orderProbe(label, enforce) {
  return {
    name: `demo-order-probe-${label}`,
    enforce, // 'pre' | 'post' | undefined
    transform(code, id) {
      if (id.includes('/src/') && id.endsWith('.js')) {
        console.log(
          `  [order-probe ${label}] transform ${id.split('/src/')[1]}  (enforce=${enforce ?? '默认'})`,
        );
      }
      return null;
    },
  };
}
