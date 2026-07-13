import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { modules, SITE_BASE } from '../config/modules'
import type { ContentIndex, ContentItem, ContentModuleConfig, ContentModuleIndex, ContentRenderer } from '../src/types/content'

const contentRoot = fileURLToPath(new URL('../public/content', import.meta.url))
const indexPath = join(contentRoot, 'content-index.json')
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * 判断字符串是否为真实存在的 ISO 日期。
 *
 * 除了检查 `YYYY-MM-DD` 格式，还会通过 ISO 往返转换排除
 * `2026-02-30` 这类格式正确但实际不存在的日期。
 *
 * @param value 待校验的日期字符串。
 * @returns 日期格式正确且真实存在时返回 `true`。
 */
function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  // 正则只能校验格式，ISO 往返校验还能排除 2026-02-30 这类不存在的日期。
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

/**
 * 从源文档中提取站点列表使用的标题。
 *
 * Markdown 读取第一个一级标题，HTML 读取 `<title>`；该过程只生成索引元数据，
 * 不会修改源文件内容。没有可用标题时返回调用方提供的稳定回退值。
 *
 * @param content 源文档完整内容。
 * @param renderer 当前模块使用的内容渲染方式。
 * @param fallback 无法提取标题时使用的回退标题。
 * @returns 清理后的文档标题或回退标题。
 */
function extractTitle(content: string, renderer: ContentRenderer, fallback: string): string {
  // 标题只用于站点索引展示，不修改源文档；无法提取时使用稳定的模块日期标题。
  if (renderer === 'markdown')
    return content.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback
  return content.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || fallback
}

/**
 * 校验模块配置能否安全映射为导航、内容目录和页面路由。
 *
 * 模块 id、slug 和内容目录必须各自唯一，slug 必须使用小写中划线格式。
 * 校验失败时立即中止索引生成，避免部署出路径冲突的页面。
 *
 * @param configs 站点模块配置列表。
 * @throws 配置字段缺失、slug 非法或唯一字段重复时抛出错误。
 */
function validateModuleConfigs(configs: ContentModuleConfig[]): void {
  const ids = new Set<string>()
  const slugs = new Set<string>()
  const directories = new Set<string>()

  for (const config of configs) {
    if (!config.id || !config.title || !config.description)
      throw new Error(`invalid module config: ${config.slug}`)
    if (!slugPattern.test(config.slug))
      throw new Error(`invalid module slug: ${config.slug}`)
    if (ids.has(config.id))
      throw new Error(`duplicate module id: ${config.id}`)
    if (slugs.has(config.slug))
      throw new Error(`duplicate module slug: ${config.slug}`)
    if (directories.has(config.contentDir))
      throw new Error(`duplicate content directory: ${config.contentDir}`)
    ids.add(config.id)
    slugs.add(config.slug)
    directories.add(config.contentDir)
  }
}

/**
 * 扫描单个模块的内容目录并生成模块索引。
 *
 * 隐藏文件会被忽略；普通内容文件必须符合模块命名规则、包含有效日期、
 * 内容非空且同一模块内日期唯一。最终条目按日期倒序排列。
 *
 * @param config 当前待扫描模块的配置。
 * @returns 包含模块元数据、最新日期和全部内容条目的索引。
 * @throws 文件名非法、日期重复或内容为空时抛出错误。
 */
async function indexModule(config: ContentModuleConfig): Promise<ContentModuleIndex> {
  const directory = join(contentRoot, config.contentDir)
  await mkdir(directory, { recursive: true })
  const items: ContentItem[] = []
  const dates = new Set<string>()

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith('.')) continue

    // 文件名是日期路由的来源，非法命名或日期重复会让构建直接失败。
    const date = entry.name.match(config.filePattern)?.[1]
    if (!date || !isValidIsoDate(date))
      throw new Error(`invalid content filename: ${config.slug}/${entry.name}`)
    if (dates.has(date))
      throw new Error(`duplicate content date: ${config.slug}/${date}`)

    const content = await readFile(join(directory, entry.name), 'utf8')
    if (!content.trim())
      throw new Error(`empty content: ${config.slug}/${entry.name}`)
    dates.add(date)
    items.push({
      date,
      title: extractTitle(content, config.renderer, `${config.title} ${date}`),
      contentPath: `${SITE_BASE}content/${config.contentDir}/${entry.name}`,
    })
  }

  items.sort((left, right) => right.date.localeCompare(left.date))
  return {
    id: config.id,
    slug: config.slug,
    title: config.title,
    description: config.description,
    renderer: config.renderer,
    theme: config.theme,
    latestDate: items[0]?.date ?? null,
    count: items.length,
    items,
  }
}

validateModuleConfigs(modules)
await mkdir(contentRoot, { recursive: true })
const index: ContentIndex = {
  generatedAt: new Date().toISOString(),
  modules: await Promise.all(modules.map(indexModule)),
}

// 先写临时文件再原子替换，避免生成过程中断时留下不完整 JSON。
const temporaryIndexPath = `${indexPath}.tmp`
await writeFile(temporaryIndexPath, `${JSON.stringify(index, null, 2)}\n`)
await rename(temporaryIndexPath, indexPath)

for (const module of index.modules)
  console.log(`${module.slug}: ${module.count} 期，最新 ${module.latestDate ?? '无'}`)

console.log(`索引已生成：${indexPath}`)
