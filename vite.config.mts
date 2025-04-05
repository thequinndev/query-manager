import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      "@thequinndev/query-manager": "/src/query-manager",
      "@examples": "/examples",
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      name: 'QueryManager'
    },
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    coverage: {
      thresholds: {
        100: true,
      },
      reporter: ["text", "json", "html"],
      exclude: [
        '**/node_modules/**', // Ignore
        '**/dist/**', // Ignore
        '**/examples/**', // Ignore examples
        // The below are export files only
        '**/src/index.ts',
        '**/src/index.d.ts',
        '**/src/query-manager.ts',
        '**/src/query-manager/index.ts',
        // Config files only
        '.eslintrc.js',
        'query-manager.d.ts',
        'index.d.ts',
        'tsup.config.ts',
        'vite.config.mts'
      ]
    },
  },
});