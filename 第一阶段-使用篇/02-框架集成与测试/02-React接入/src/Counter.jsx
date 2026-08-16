import { useState } from 'react';

// 实验开关：取消下面这行注释（在「只导出组件」的文件里加一个非组件导出），
// 再改本文件文案保存 → Fast Refresh 退化为整页刷新，count 会归零。
// export const EXTRA = 42;

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ fontSize: '1.1rem', padding: '.6rem 1.2rem', cursor: 'pointer' }}
      >
        count is {count}
      </button>
      <p style={{ color: '#888', fontSize: '.85rem', maxWidth: '22rem' }}>
        先点几下，再改这段文案保存 → 文案更新但 count 不归零（Fast Refresh 保留状态）。
      </p>
    </div>
  );
}
