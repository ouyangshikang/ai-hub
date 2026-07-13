import type { ContentModuleConfig } from '../src/types/content';

export const SITE_BASE = '/ai-hub/';

export const modules: ContentModuleConfig[] = [
  {
    id: 'ai-daily',
    slug: 'ai-daily',
    title: 'AI 早报',
    description: '每日 AI 前沿动态与开发生态精选。',
    renderer: 'html',
    contentDir: 'ai-daily',
    filePattern: /^ai-daily-(\d{4}-\d{2}-\d{2})\.html$/,
    theme: { accentColor: '#0070f3', icon: 'AI' },
  },
  {
    id: 'java-learning',
    slug: 'java-learning',
    title: 'Java 学习',
    description: '面向前端工程师的 Java 后端学习笔记。',
    renderer: 'markdown',
    contentDir: 'java-learning',
    filePattern: /^java学习-(\d{4}-\d{2}-\d{2})\.md$/,
    theme: { accentColor: '#b45309', icon: 'JV' },
  },
  {
    id: 'fe-radar',
    slug: 'fe-radar',
    title: '前端技术雷达',
    description: '每周前端技术变化、工程判断与落地建议。',
    renderer: 'markdown',
    contentDir: 'fe-radar',
    filePattern: /^前端技术雷达-(\d{4}-\d{2}-\d{2})\.md$/,
    theme: { accentColor: '#6d28d9', icon: 'FE' },
  },
];
