document.querySelector('#app').innerHTML = `
  <h1>Vite 站在编排层</h1>
  <p>打包交给 Rolldown，转译/压缩交给 Oxc，Vite 负责把它们整合成开箱体验。</p>
  <p>看终端：dev 和 build 都打印「打包器：Rolldown」——这就是单引擎。</p>
`;
