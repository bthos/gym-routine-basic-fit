import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['app/src/**/*.test.{js,jsx}'],
    globals: false,
  },
});
