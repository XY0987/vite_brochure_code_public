// 场景 A（整页刷新对比）：本模块没有声明 import.meta.hot.accept，
// 又被入口直接依赖。改动这里时找不到热更新边界 → Vite 整页刷新（终端 page reload）。
export const APP_TITLE = '排障复现 demo（改我会触发整页刷新）';
