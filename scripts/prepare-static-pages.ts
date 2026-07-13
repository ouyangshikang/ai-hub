import { access, copyFile, mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_BASE } from '../config/modules'
import type { ContentIndex } from '../src/types/content'

const distRoot = fileURLToPath(new URL('../dist', import.meta.url))
const sourceHtml = join(distRoot, 'index.html')
const index = JSON.parse(
  await readFile(join(distRoot, 'content/content-index.json'), 'utf8'),
) as ContentIndex

// GitHub Pages 不会自动回退到 SPA 入口，因此为每个可分享 URL 补一份 index.html。
for (const module of index.modules) {
  const moduleDirectory = join(distRoot, module.slug)
  await mkdir(moduleDirectory, { recursive: true })
  await copyFile(sourceHtml, join(moduleDirectory, 'index.html'))

  for (const item of module.items) {
    const dateDirectory = join(moduleDirectory, item.date)
    await mkdir(dateDirectory, { recursive: true })
    await copyFile(sourceHtml, join(dateDirectory, 'index.html'))
  }
}

// 构建成功不代表可以部署，这里同时校验 base、路由入口和原始内容文件。
const rootHtml = await readFile(sourceHtml, 'utf8')
if (!rootHtml.includes(SITE_BASE))
  throw new Error(`build does not use ${SITE_BASE} base path`)

for (const module of index.modules) {
  await access(join(distRoot, module.slug, 'index.html'))
  for (const item of module.items) {
    await access(join(distRoot, module.slug, item.date, 'index.html'))
    const relativeContentPath = item.contentPath.startsWith(SITE_BASE)
      ? item.contentPath.slice(SITE_BASE.length)
      : item.contentPath.replace(/^\//, '')
    await access(join(distRoot, relativeContentPath))
  }
}

console.log('静态路由入口生成完成，GitHub Pages 构建校验通过。')
