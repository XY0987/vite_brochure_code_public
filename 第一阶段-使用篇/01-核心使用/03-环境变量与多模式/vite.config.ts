import { defineConfig, loadEnv } from 'vite';

// defineConfig 的函数形式：拿到 command 与 mode 动态返回配置。
export default defineConfig(({ command, mode }) => {
  // loadEnv 在「配置阶段」（Node 环境）读取 .env。第三个参数传 '' 表示不做前缀过滤，
  // 因此这里能读到不带 VITE_ 前缀的 APP_VERSION——这正是「配置侧」与「业务侧」的区别：
  // 业务代码只能拿到 VITE_*，配置文件里用 loadEnv 可以拿到任意变量。
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      // 把配置阶段读到的值，作为编译期常量注入业务代码（构建时被静态替换为字面量）。
      __APP_VERSION__: JSON.stringify(env.APP_VERSION ?? 'dev'),
    },
    build: {
      // 仅在非 production 的构建里出 sourcemap，演示按 command/mode 分支配置。
      sourcemap: command === 'build' && mode !== 'production',
    },
  };
});
