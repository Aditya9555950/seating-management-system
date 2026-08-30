import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <-- Must be @tailwindcss/vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/seating-management-system/',
});