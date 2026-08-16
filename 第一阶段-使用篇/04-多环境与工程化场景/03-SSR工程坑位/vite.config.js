import { defineConfig } from 'vite';

export default defineConfig({
  // ssr.* 控制「服务端打包时哪些依赖外部化（external）、哪些打进包（noExternal）」。
  ssr: {
    // noExternal：强制把依赖打进 SSR 包，而不是留给 Node 运行时 require。
    //   典型场景：某依赖是 ESM-only、或需要 Vite 转换（如它内部用了 .css / 别名），
    //   外部化后被 Node 直接加载会报 ERR_REQUIRE_ESM 或语法错误。
    //   例：noExternal: ['some-esm-only-lib']
    noExternal: [],

    // external：反过来，强制某依赖保持外部化（默认 node_modules 里的依赖就是外部化的）。
    //   例：external: ['some-cjs-pkg-that-breaks-when-bundled']

    // 小结：SSR 报错里出现 ERR_REQUIRE_ESM / Unexpected token 'export' →
    //   多半是某依赖该 noExternal 却被外部化了，把它加进 noExternal 即可。
  },
});
