import { LocalStorageLRU } from "@cocalc/local-storage-lru";

const OPEN_AI_TOKEN_KEY = "OPEN_AI_TOKEN_KEY";

// 获取openai token
export function getOpenAIToken() {
  return localStorage.getItem(OPEN_AI_TOKEN_KEY);
}

// 设置openai token
export function setOpenAIToken(token: string) {
  localStorage.setItem(OPEN_AI_TOKEN_KEY, token);
}

export const storage = new LocalStorageLRU();
