import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

const hostname = os.hostname(); // dynamically get machine name

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    origin: `http://${hostname}:5173`,     // dynamically inserted
    allowedHosts: [hostname],              // allow the current machine name
  }
});