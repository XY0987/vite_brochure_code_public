import { wrong, double } from './buggy';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1>TypeScript 处理 demo</h1>
  <p>wrong = <code>${String(wrong)}</code></p>
  <p>double(21) = <code>${double(21)}</code></p>
  <p>用 build:unsafe（仅转译，成功）对比 typecheck（拦下类型错）。</p>
`;
