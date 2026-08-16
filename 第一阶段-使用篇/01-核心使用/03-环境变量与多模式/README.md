# Demo 03 · 环境变量与多模式

对应文章：[03 · dev / build / preview 与环境变量、多模式](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/03-devserver构建预览与环境变量多模式.md)。

## 看点

- `VITE_` 前缀安全闸门：页面尝试读取无前缀的 `SECRET_TOKEN`，结果为 `undefined`。
- 多模式：`development` / `production` / `staging` 三套 `.env`，`VITE_API_BASE` 各不相同。
- 内置变量 `MODE` / `DEV` / `PROD` 的表现。

## 运行

```bash
npm install

npm run dev                                  # MODE=development
npm run build && npm run preview             # MODE=production
npm run build:staging && npm run preview     # MODE=staging
```

## 验证「密钥没泄露」

```bash
npm run build
grep -r "this-should-never-reach-the-browser" dist/   # 应无任何输出
```

> 需要 Node ≥ 20.19 或 ≥ 22.12。
