// filepath: /home/muhdbashir/Desktop/ZaCodder/myProjects/webDev/adFriend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background/index.ts'),
        content: path.resolve(__dirname, 'src/content/adDetector.ts'),
      },
      output: {
        entryFileNames: '[name]/index.js',
      },
    },
  },
});
