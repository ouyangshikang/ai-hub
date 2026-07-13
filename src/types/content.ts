export type ContentRenderer = "markdown" | "html";

export interface ModuleTheme {
  accentColor: string;
  icon: string;
}

export interface ContentModuleConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  renderer: ContentRenderer;
  contentDir: string;
  filePattern: RegExp;
  theme: ModuleTheme;
}

export interface ContentItem {
  date: string;
  title: string;
  contentPath: string;
}

export interface ContentModuleIndex {
  id: string;
  slug: string;
  title: string;
  description: string;
  renderer: ContentRenderer;
  theme: ModuleTheme;
  latestDate: string | null;
  count: number;
  items: readonly ContentItem[];
}

export interface ContentIndex {
  generatedAt: string;
  modules: readonly ContentModuleIndex[];
}
