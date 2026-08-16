import { describe, it, expect } from 'vitest';
// 关键：用路径别名 @ 导入 —— 这是 vite.config 里配的 resolve.alias，
// 测试零额外配置就能用（Jest 需要再写 moduleNameMapper）。
import { add, clamp } from '@/math';

describe('math', () => {
  it('add 两数相加', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('clamp 限定范围', () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-3, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
  });
});
