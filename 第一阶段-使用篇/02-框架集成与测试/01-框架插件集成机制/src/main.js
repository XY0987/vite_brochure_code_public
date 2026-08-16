// main.js 只负责把组件「拉起来」。
// .myx 的编译、挂载、HMR 全部由 vite-plugin-myx 在编译产物里完成，
// 所以这里只需 import 一次（副作用即挂载到 #app）。
import './App.myx';
