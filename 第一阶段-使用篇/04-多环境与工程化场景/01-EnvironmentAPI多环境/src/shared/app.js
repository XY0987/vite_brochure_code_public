// 这是「跨环境共享」的业务代码：三个环境用的是同一个文件。
// 它不关心自己跑在浏览器、Node 还是边缘，只 import 抽象的 '#platform'，
// 由各环境的 alias 决定真正解析到哪个实现 —— 这就是「一份源码、多运行时」。
import { runtime, now } from '#platform';

export function renderHTML(url) {
  return [
    `<h1>Hello from <b>${runtime}</b></h1>`,
    `<p>请求路径：${url}</p>`,
    `<p>由该运行时提供的时间：${now()}</p>`,
  ].join('\n');
}
