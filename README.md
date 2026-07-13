# AI Hub

Markdown/HTML 静态内容站点

## 本地开发

```bash
corepack enable
pnpm install
pnpm dev
```

`pnpm dev` 和 `pnpm build` 会先扫描仓库内容并生成 `public/content/content-index.json`。

## 内容输入契约

| 模块         | 目录                           | 文件名                       |
| ------------ | ------------------------------ | ---------------------------- |
| AI 早报      | `public/content/ai-daily`      | `ai-daily-YYYY-MM-DD.html`   |
| Java 学习    | `public/content/java-learning` | `java学习-YYYY-MM-DD.md`     |
| 前端技术雷达 | `public/content/fe-radar`      | `前端技术雷达-YYYY-MM-DD.md` |

外部内容生成流程只需把文件写入对应目录。AI Hub 不创建或维护定时任务。

## 页面路由

```text
/ai-hub/
/ai-hub/:moduleSlug/
/ai-hub/:moduleSlug/:date/
```

构建时会为模块和日期生成真实的目录入口，因此 GitHub Pages 上可以直接打开、分享和刷新深层 URL，不依赖 Hash 路由。

## 人工质量门禁

1. 阅读并检查新增 Markdown/HTML。
2. 运行本地验证。
3. 由仓库所有者亲自暂存、提交并推送 `master`。
4. GitHub Actions 自动构建并发布 GitHub Pages。

## 新增模块

在 `config/modules.ts` 增加模块配置，并创建匹配的 `public/content/<module>` 目录。全局主页、模块首页、日期详情页、内容索引和物理路由会自动生成，不需要新增页面或路由代码。

## 验证

```bash
pnpm generate:index
pnpm typecheck
pnpm build
```
