<script setup lang="ts">
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import MarkdownIt from 'markdown-it';
import { computed, nextTick, onBeforeUnmount, shallowRef, useTemplateRef, watch } from 'vue';
import 'highlight.js/styles/github-dark.css';

interface Props {
  src: string;
}

const props = defineProps<Props>();
const rendered = shallowRef('');
const loading = shallowRef(false);
const error = shallowRef<string | null>(null);
const activeId = shallowRef('');
const proseRef = useTemplateRef<HTMLElement>('prose');

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('yaml', yaml);

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    const value =
      language && hljs.getLanguage(language)
        ? hljs.highlight(code, { language }).value
        : hljs.highlightAuto(code).value;
    return `<pre class="hljs"><code class="hljs">${value}</code></pre>`;
  },
});

// ── Add IDs to headings & open links in new tab ──
const slugCount = new Map<string, number>();

function slugify(text: string): string {
  const slug = text
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  if (!slug) return '';
  const count = slugCount.get(slug) ?? 0;
  slugCount.set(slug, count + 1);
  return count === 0 ? slug : `${slug}-${count}`;
}

const defaultHeadingOpen = markdown.renderer.rules.heading_open;
markdown.renderer.rules.heading_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const contentToken = tokens[index + 1];
  const text = contentToken?.content ?? '';
  const id = slugify(text);
  if (id) token.attrSet('id', id);
  return defaultHeadingOpen
    ? defaultHeadingOpen(tokens, index, options, env, self)
    : self.renderToken(tokens, index, options);
};

const defaultLinkOpen = markdown.renderer.rules.link_open;
markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  tokens[index].attrSet('target', '_blank');
  tokens[index].attrSet('rel', 'noopener noreferrer');
  return defaultLinkOpen
    ? defaultLinkOpen(tokens, index, options, env, self)
    : self.renderToken(tokens, index, options);
};

// ── Extract TOC from rendered HTML ──
interface TocItem {
  id: string;
  text: string;
  level: number;
}

const toc = computed<TocItem[]>(() => {
  if (!rendered.value) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(rendered.value, 'text/html');
  const headings = doc.querySelectorAll('h2, h3, h4');
  return Array.from(headings)
    .filter((h) => h.id)
    .map((h) => ({
      id: h.id,
      text: h.textContent ?? '',
      level: Number(h.tagName[1]),
    }));
});

// ── Scroll spy ──
let observer: IntersectionObserver | null = null;

function setupScrollSpy() {
  observer?.disconnect();
  if (!proseRef.value || toc.value.length === 0) return;

  const headingEls = toc.value
    .map((item) => proseRef.value?.querySelector(`#${CSS.escape(item.id)}`))
    .filter((el): el is Element => !!el);

  if (headingEls.length === 0) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
  );

  headingEls.forEach((el) => observer?.observe(el));
}

function scrollToHeading(id: string) {
  const el = proseRef.value?.querySelector(`#${CSS.escape(id)}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeId.value = id;
  }
}

// ── Load content ──
watch(
  () => props.src,
  async (src, _prev, onCleanup) => {
    const controller = new AbortController();
    onCleanup(() => controller.abort());
    loading.value = true;
    error.value = null;
    slugCount.clear();
    try {
      const res = await fetch(src, { signal: controller.signal });
      if (!res.ok) throw new Error(`加载失败: ${res.status}`);
      rendered.value = DOMPurify.sanitize(markdown.render(await res.text()), {
        ADD_ATTR: ['target', 'id'],
      });
      await nextTick();
      setupScrollSpy();
    } catch (e) {
      if (controller.signal.aborted) return;
      rendered.value = '';
      error.value = e instanceof Error ? e.message : '加载失败';
    } finally {
      if (!controller.signal.aborted) loading.value = false;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <p v-if="loading" class="reader-msg" role="status">正在加载文档…</p>
  <p v-else-if="error" class="reader-msg reader-msg--error" role="alert">
    {{ error }}
  </p>
  <div v-else class="reader-layout">
    <article ref="prose" class="prose" v-html="rendered" />
    <aside v-if="toc.length > 0" class="toc">
      <nav class="toc__nav" aria-label="目录">
        <p class="toc__title">目录</p>
        <ul class="toc__list">
          <li
            v-for="item in toc"
            :key="item.id"
            class="toc__item"
            :class="[`toc__item--h${item.level}`, { 'toc__item--active': activeId === item.id }]"
          >
            <button class="toc__link" @click="scrollToHeading(item.id)">
              {{ item.text }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<style scoped>
.reader-msg {
  margin: 0;
  padding: 16px 0;
  color: var(--muted);
  font-size: 14px;
}

.reader-msg--error {
  color: var(--danger);
}

/* ── Layout: content + TOC ── */
.reader-layout {
  display: grid;
  grid-template-columns: minmax(0, var(--content-width)) 200px;
  gap: 48px;
  max-width: calc(var(--content-width) + 248px);
  margin: 0 auto;
  align-items: start;
}

/* ── TOC ── */
.toc {
  position: sticky;
  top: 72px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.toc__nav {
  padding: 8px 0;
}

.toc__title {
  margin: 0 0 12px;
  padding: 0 14px;
  color: var(--subtle);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 2px solid var(--line);
}

.toc__item {
  margin: 0;
}

.toc__link {
  display: block;
  width: 100%;
  padding: 5px 14px;
  border: 0;
  background: none;
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition:
    color 200ms ease,
    background 200ms ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc__link:hover {
  color: var(--ink);
  background: var(--surface);
}

.toc__item--h3 .toc__link {
  padding-left: 26px;
  font-size: 12px;
}

.toc__item--h4 .toc__link {
  padding-left: 38px;
  font-size: 12px;
  color: var(--subtle);
}

.toc__item--active .toc__link {
  color: var(--brand);
  font-weight: 600;
  background: var(--brand-soft);
}

.toc__item--active {
  position: relative;
}

.toc__item--active::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--brand);
  border-radius: 999px;
}

/* ══════════════════════════════════════
   Prose — 清新阅读排版
   ══════════════════════════════════════ */
.prose {
  max-width: var(--content-width);
  color: #374151;
  font-size: 17px;
  line-height: 1.85;
}

/* ── Headings ── */
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  font-weight: 700;
  line-height: 1.35;
  color: var(--ink);
  scroll-margin-top: 80px;
}

.prose :deep(h1) {
  margin: 0 0 0.6em;
  padding-bottom: 0.4em;
  border-bottom: 2px solid var(--brand-soft);
  font-size: 30px;
  letter-spacing: -0.02em;
}

.prose :deep(h1:first-child) {
  display: none;
}

.prose :deep(h2) {
  margin: 2em 0 0.7em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--line);
  font-size: 23px;
  letter-spacing: -0.015em;
}

.prose :deep(h3) {
  margin: 1.6em 0 0.4em;
  font-size: 19px;
}

.prose :deep(h3)::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 10px;
  background: var(--brand);
  border-radius: 50%;
  vertical-align: middle;
  transform: translateY(-2px);
}

.prose :deep(h4) {
  margin: 1.4em 0 0.3em;
  font-size: 17px;
  color: var(--ink-soft);
}

/* ── Text ── */
.prose :deep(p) {
  margin: 0.75em 0;
}

.prose :deep(strong) {
  font-weight: 650;
  color: var(--ink);
}

/* ── Links ── */
.prose :deep(a) {
  color: var(--brand);
  text-decoration: underline;
  text-decoration-color: rgba(35, 84, 224, 0.25);
  text-underline-offset: 3px;
  transition: text-decoration-color 200ms ease;
}

.prose :deep(a:hover) {
  text-decoration-color: var(--brand);
}

/* ── Lists ── */
.prose :deep(ul),
.prose :deep(ol) {
  margin: 0.75em 0;
  padding-left: 1.5em;
}

.prose :deep(li) {
  margin: 0.25em 0;
}

.prose :deep(li::marker) {
  color: var(--brand-light);
}

.prose :deep(li > p) {
  margin: 0.15em 0;
}

/* ── Blockquote ── */
.prose :deep(blockquote) {
  margin: 1.2em 0;
  padding: 14px 18px;
  color: #4b5563;
  background: linear-gradient(135deg, var(--brand-soft) 0%, #f8faff 100%);
  border-left: 3px solid var(--brand);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-size: 15px;
  line-height: 1.75;
}

.prose :deep(blockquote p) {
  margin: 0.15em 0;
}

/* ── Inline code ── */
.prose :deep(code) {
  font-family: var(--font-mono);
}

.prose :deep(:not(pre) > code) {
  padding: 0.12em 0.4em;
  background: #eef2ff;
  border-radius: 4px;
  font-size: 0.86em;
  font-weight: 500;
  color: #4338ca;
}

/* ── Code blocks (github-dark theme) ── */
.prose :deep(pre) {
  margin: 1.2em 0;
  padding: 16px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.65;
  overflow-x: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.prose :deep(pre code) {
  font-size: 14px;
  background: none;
  padding: 0;
}

/* ── Tables ── */
.prose :deep(table) {
  display: block;
  width: max-content;
  max-width: 100%;
  margin: 1.2em 0;
  overflow-x: auto;
  border-collapse: collapse;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-size: 14px;
}

.prose :deep(th),
.prose :deep(td) {
  padding: 9px 14px;
  border: 1px solid var(--line);
  line-height: 1.55;
}

.prose :deep(th) {
  background: var(--brand-soft);
  font-weight: 600;
  text-align: left;
  color: var(--ink);
}

.prose :deep(tr:nth-child(even) td) {
  background: #fafbfc;
}

/* ── Images ── */
.prose :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.2em 0;
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* ── HR ── */
.prose :deep(hr) {
  margin: 2em 0;
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--line), transparent);
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .reader-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .toc {
    position: relative;
    top: 0;
    max-height: none;
    margin-bottom: 24px;
    display: none;
  }
}

@media (max-width: 640px) {
  .prose {
    font-size: 16px;
    line-height: 1.8;
  }

  .prose :deep(h1) {
    font-size: 26px;
  }

  .prose :deep(h2) {
    font-size: 21px;
  }

  .prose :deep(h3) {
    font-size: 18px;
  }

  .prose :deep(pre) {
    padding: 14px;
    font-size: 13px;
  }
}
</style>
