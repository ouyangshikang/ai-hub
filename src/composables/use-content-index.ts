import { readonly, shallowRef } from "vue";
import type { ContentIndex } from "../types/content";
import { loadContentIndex } from "../services/content-index";

const index = shallowRef<ContentIndex | null>(null);
const loading = shallowRef(false);
const error = shallowRef<string | null>(null);
let pending: Promise<void> | null = null;

async function ensureLoaded(): Promise<void> {
  if (index.value || pending) return pending ?? Promise.resolve();

  loading.value = true;
  error.value = null;
  pending = loadContentIndex()
    .then((value) => {
      index.value = value;
    })
    .catch((reason: unknown) => {
      error.value = reason instanceof Error ? reason.message : "内容加载失败";
    })
    .finally(() => {
      loading.value = false;
      pending = null;
    });
  return pending;
}

export function useContentIndex() {
  return {
    index: readonly(index),
    loading: readonly(loading),
    error: readonly(error),
    ensureLoaded,
  };
}
