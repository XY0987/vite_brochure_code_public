// 一个「迷你框架插件」：演示框架插件做的三件事
//   1. 编译：把自定义的 .myx 文件编译成浏览器能跑的标准 JS
//   2. 注入 HMR：让改 .myx 时局部更新且【保留状态】
//   3. 只处理本框架的文件，其它交还给 Vite
//
// .myx 文件由三块组成：<template> / <state> / <setup>
// 教学用途，编译器刻意写得很朴素。

function pick(source, tag) {
  const m = source.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].trim() : '';
}

function compileMyx(source) {
  const template = pick(source, 'template');
  const state = pick(source, 'state') || '{}';
  const setup = pick(source, 'setup');

  // 把模板里的 {{ 表达式 }} 转成模板字符串插值 ${ 表达式 }
  const tpl = template.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, '${$1}');

  // === 关键开关：把下面这段 HMR 代码注释掉，对比「整页刷新 + 状态归零」 ===
  const hmr = `
if (import.meta.hot) {
  import.meta.hot.data.myxState = state;   // 跨热更新保留状态引用
  import.meta.hot.accept();                // 自接受：模块更新后重新执行本文件
}`;
  // === 关键开关结束 ===

  return `// 由 vite-plugin-myx 自动编译生成（请勿手改 .myx 对应产物）
const __target = document.getElementById('app');
let state = (import.meta.hot && import.meta.hot.data.myxState) || (${state});

function __render() {
  return \`${tpl}\`;
}
function __bind() {
  const root = __target;
  const update = __update;
  ${setup}
}
function __update() {
  __target.innerHTML = __render();
  __bind();
}

__update();
${hmr}
`;
}

export default function myx() {
  return {
    name: 'vite-plugin-myx',
    // 框架插件主要挂在 transform 钩子上
    transform(code, id) {
      // 先剥掉 query（如 App.myx?import / ?vue），否则带 query 的请求会漏判。
      const cleanId = id.split('?')[0];
      if (!cleanId.endsWith('.myx')) return; // 只处理 .myx，其它交还 Vite
      return { code: compileMyx(code), map: null };
    },
  };
}
