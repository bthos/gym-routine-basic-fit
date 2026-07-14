import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['app/src/**/*.test.{js,jsx}'],
    globals: false,
    setupFiles: ['./app/src/test-setup.js'],
  },
});
