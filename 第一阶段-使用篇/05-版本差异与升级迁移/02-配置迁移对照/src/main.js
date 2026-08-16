import { formatDate, range } from './vendor-like.js';

const app = document.querySelector('#app');
app.innerHTML = `
  <h1>配置迁移对照</h1>
  <p>现在：${formatDate()}</p>
  <p>range(0,5)：${range(0, 5).join(', ')}</p>
`;
