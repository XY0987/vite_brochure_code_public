import { defineConfig } from 'vite';
import {
  virtualBuildInfo,
  mockApi,
  injectScript,
  customHmr,
  probe,
} from './plugins/demo-plugins.js';

// 把本节讲到的钩子用一组插件串起来。注意 probe 的 enforce：
// 'pre' 批会先于默认批执行 transform，构建日志可验证顺序。
export default defineConfig({
  plugins: [
    probe('A', 'pre'), // enforce: 'pre' —— 先跑
    probe('B'),        // 默认批 —— 后跑
    virtualBuildInfo(),
    mockApi(),
    injectScript(),
    customHmr(),
  ],
});
