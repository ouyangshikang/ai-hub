import { SITE_BASE } from '../../config/modules'
import type { ContentIndex } from '../types/content'

function isContentIndex(value: unknown): value is ContentIndex {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ContentIndex>
  return typeof candidate.generatedAt === 'string' && Array.isArray(candidate.modules)
}

export async function loadContentIndex(fetcher: typeof fetch = fetch): Promise<ContentIndex> {
  const response = await fetcher(`${SITE_BASE}content/content-index.json`)
  if (!response.ok)
    throw new Error(`内容索引加载失败: ${response.status}`)
  const value: unknown = await response.json()
  if (!isContentIndex(value))
    throw new Error('内容索引格式无效')
  return value
}
