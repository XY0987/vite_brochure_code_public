# vite_brochure_code_public · 配套可运行代码

《Vite：从使用到精通》掘金小册的配套代码仓库。每个知识点都对应一个**最小可运行 demo**，目录按小册章节用中文命名组织，方便读者边读边跑。

## 运行环境要求

- **Node.js ≥ 20.19 或 ≥ 22.12**（Vite 8 的硬性要求；Node 18 会安装报错或运行异常）。
  - 推荐用 `nvm` 切换：`nvm install 22 && nvm use 22`。
- 包管理器：`npm` / `pnpm` / `yarn` 任意一个，下文以 `npm` 为例。

```bash
node -v   # 需要 v20.19+ 或 v22.12+
```

## 目录结构

```
vite_brochure_code_public/
└── 第一阶段-使用篇/
    ├── 01-核心使用/
    │   ├── 01-vite定位与诞生背景/      # 模块解析对比：ESM 原生 vs 打包
    │   ├── 02-项目搭建与配置详解/        # 一份逐项注释的 vite.config
    │   ├── 03-环境变量与多模式/          # .env 多模式 + 三命令演示
    │   ├── 04-静态资源与CSS/            # 资源/别名/Sass/CSS Modules/PostCSS
    │   ├── 05-依赖预构建/               # optimizeDeps 现象与配置
    │   ├── 06-SSR库模式多页应用/        # 三个子项目：ssr / lib / mpa
    │   ├── 07-TypeScript处理/          # 只转译不检查 + tsc 卡点
    │   ├── 08-性能优化与产物分析/        # 分包、可视化分析、构建提速
    │   └── 09-工程排障专题/             # CJS/ESM、HMR、sourcemap 等复现场景
    ├── 02-框架集成与测试/
    │   ├── 01-框架插件集成机制/         # 手写框架插件：编译 .myx + 注入 HMR
    │   ├── 02-React接入/               # plugin-react + Fast Refresh 状态保留
    │   ├── 03-Vue与Svelte接入/         # 两个子项目：vue / svelte
    │   └── 04-Vitest测试/             # 复用 vite.config 的别名/TS 跑测试
    ├── 03-插件与生态/
    │   ├── 01-插件开发/                # 虚拟模块/dev中间件/HTML注入/自定义HMR/enforce
    │   ├── 02-Rollup钩子模型/          # 一个插件观察 dev vs build 的钩子触发差异
    │   └── 03-常用插件使用与组合/       # visualizer + 压缩 + 别名 + enforce 顺序探针
    ├── 04-多环境与工程化场景/
    │   ├── 01-EnvironmentAPI多环境/    # 一份配置并发构建 client/ssr/edge + 多运行时
    │   ├── 02-monorepo工作区/          # npm workspaces：跨包 HMR + dedupe + 外部化
    │   ├── 03-SSR工程坑位/             # 水合不一致/外部化/条件导入/环境变量泄露现场
    │   └── 04-部署与构建缓存/           # base/codeSplitting/manifest/sourcemap + CI 示例
    ├── 05-版本差异与升级迁移/
    │   ├── 01-版本探针/                # 打印 Vite/Rolldown/Oxc/esbuild 真实版本
    │   ├── 02-配置迁移对照/             # 旧(rollupOptions+manualChunks) vs 新(rolldownOptions+codeSplitting)
    │   ├── 03-单打包器新能力/           # codeSplitting 多组分包 + 依赖预构建持久缓存观察
    │   ├── 03b-模块联邦/               # Module Federation：host 运行时远程加载 remote
    │   ├── 04-rolldown-vite隔离层/      # 升级体检脚本 + rolldown-vite drop-in 思路
    │   └── 05-迁移案例/                # require.context→import.meta.glob、env 迁移
    ├── 06-打包工具横向对比/
    │   ├── 01-三打包器横向对比/         # 同一份源码喂给 esbuild/Rollup/Rolldown 比耗时与产物
    │   ├── 02-Oxc转译与压缩/           # 用 Oxc 转译 TS+JSX 再压缩，体会「工具链≠打包器」
    │   └── 03-Vite定位探针/            # 探针确认 dev/build 都跑在 Rolldown（Vite 是编排层）
    └── 07-AI辅助Vite开发/
        ├── 01-AI配置上下文包/          # 采集 Node/包管理器/Vite 真实版本，打成可粘贴的 AI 上下文块
        ├── 02-报错复现与诊断采集/       # 确定性复现 CJS/ESM 报错 + 一键生成 SCROL 提问骨架
        ├── 03-AI误导对比/             # 体检脚本扫出 AI 式过时/混搭配置写法，给 V8 正解
        └── 04-校验工具箱/             # 最小复现骨架生成器 + 产物客观对账脚本（自带「示例产物」）
```

> 第 07 章「AI 辅助 Vite 开发」的 demo 多为**纯 Node 脚本**，`node xxx.mjs` 直接跑，无需 `npm install`、无需联网——因为它教的是「人 + AI 协作工作流」（上下文采集、诊断打包、配置体检、产物校验），可直接抄进你的真实项目。

## 通用运行方式

进入任意 demo 目录，安装依赖后按其内部 README 执行：

```bash
cd 第一阶段-使用篇/01-核心使用/02-项目搭建与配置详解
npm install
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 本地预览构建产物
```

每个 demo 目录下都有独立 `README.md`，说明它演示什么、对应文章哪一节、关键命令与观察点。

## 仓库级验收

### 1. 结构体检（静态、秒级，建议接 CI）

`check:demos` 遍历第一阶段**全部** demo 的 `package.json`，校验「能解析 + 顶层 demo 有可运行 scripts + Vite 版本覆盖 8.x 基线」。它不安装、不构建、不联网，用来在版本漂移或重命名后第一时间抓住「文章说有 demo、实际跑不起来」的隐患：

```bash
npm run check:demos
```

### 2. smoke 验收（实际执行抽样 demo）

抽样跑第一阶段最关键的 demo（配置、性能、React、Vitest、插件、Environment API、配置迁移、AI 校验工具箱）：

```bash
npm run smoke:first-stage:dry      # 只检查目标与脚本，不真正执行
npm run smoke:first-stage          # 直接运行各 demo 的验收命令（要求依赖已安装）
npm run smoke:first-stage:install  # 先 npm install，再运行验收命令
```

这个脚本只覆盖确定性命令。SSR dev server、Module Federation 的 host/remote 双终端、preview 类长驻服务仍建议按各自 README 人工验证。
