// @vitest-environment jsdom
// 顶部这行注释把【本文件】的测试环境切到 jsdom，于是能用 document。
import { describe, it, expect } from 'vitest';
import { createBadge } from '@/dom';

describe('createBadge', () => {
  it('生成带文本的 span', () => {
    const el = createBadge('NEW');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toBe('badge');
    expect(el.textContent).toBe('NEW');
  });
});
