// 一个「典型的老式 CommonJS 包」：动态地往 module.exports 上挂方法。
// 关键点：因为导出是「运行时动态赋值」的，Node 的 cjs-module-lexer 在静态分析阶段
// 探测不到具名导出。于是从 ESM 里 `import { foo }` 会失败——这正是 Vite 依赖预构建
// 报 "does not provide an export named 'xxx'" 的常见病根（CJS/ESM 互操作）。

const lib = {};

function build() {
  lib.foo = function foo() {
    return 'foo from cjs';
  };
  lib.bar = function bar() {
    return 'bar from cjs';
  };
}

build();

module.exports = lib;
