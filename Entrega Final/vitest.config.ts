import { defineConfig } from "vitest/config"
import { fileURLToPath } from 'url'
import { URL } from 'url'

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})