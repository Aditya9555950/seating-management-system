import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
});
function tailwindcss(): import("vite").PluginOption {
  throw new Error('Function not implemented.');
}

