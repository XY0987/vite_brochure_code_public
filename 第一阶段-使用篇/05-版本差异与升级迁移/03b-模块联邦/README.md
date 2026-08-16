# Demo 05-03b · Module Federation（宿主远程加载远程模块）

对应文章：[03 · Vite 8 单打包器解锁的新能力](../../../../vite_brochure/第一阶段-使用篇/05-版本差异与升级迁移/03-Vite8单打包器解锁的新能力.md)（第三节 Module Federation）。

## 看点

一对可运行的微前端（纯原生 JS，无框架依赖），用官方推荐的 `@module-federation/vite` 插件：

- `remote/`：编译产出 `remoteEntry.js`，对外暴露 `./widget` 模块（占用 5174 端口）。
- `host/`：运行时通过 `import('remote/widget')` **远程加载** remote 暴露的模块（占用 5173 端口）。

关键：host 的构建产物里**没有** widget 的代码，它是运行时从 5174 拉回来的——这正是微前端「独立编译、独立部署」的价值。

## 运行（需要两个终端）

```bash
# 终端 1：remote（先起，占用 5174）
cd remote
npm install && npm run build && npm run preview

# 终端 2：host（占用 5173）
cd host
npm install && npm run build && npm run preview
```

然后浏览器打开 http://localhost:5173/ （host），页面上会出现「👋 我是来自 remote 的 widget」。

## 观察点

1. 打开 `remote/dist/remoteEntry.js`——这是 remote 对外的「联邦清单入口」，host 靠它发现可加载的模块。
2. host 页面顶部先显示「正在远程加载……」，随后出现远程 widget 及其 `meta` 信息——证明它是运行时加载、而非构建时打包进来的。
3. 只改 `remote/src/widget.js` 的文案，**仅重新构建/预览 remote**（不碰 host），刷新 host 页面即可看到变化——这就是「remote 独立发版、host 无需重建」。

> 需要 Node ≥ 20.19 或 ≥ 22.12。配置里 `dts: false` 关掉了联邦类型生成（纯 JS demo 不需要）。
> remote 必须先于 host 启动，否则 host 会提示远程加载失败（这本身也是个观察点：远程不可用时的降级表现）。
