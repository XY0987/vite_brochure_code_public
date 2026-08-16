// 一份「自包含」的纯 ESM 源码：只用相对路径互相 import，
// 不依赖 node_modules，这样三个打包器都能在「零插件」前提下直接打包，对比才公平。
import { add, multiply } from './math.js';
import { formatMoney } from './format.js';

const price = multiply(add(19, 6), 3);

document.querySelector('#app').textContent = `总价：${formatMoney(price)}`;
