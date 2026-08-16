// 模拟一个较重的模块，被动态 import 拆成独立 chunk。
import { range, sum } from 'lodash-es';

export function heavyCompute() {
  return sum(range(1, 10001));
}
