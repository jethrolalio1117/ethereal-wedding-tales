import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // For custom domain GitHub Pages, base should be '/'
  base: '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  build: {
    // Configure for GitHub Pages compatibility
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Force legacy browser compatibility and avoid module script issues
    rollupOptions: {
      output: {
        // Use more compatible file naming without ES modules
        entryFileNames: 'assets/index-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        format: 'iife', // Use IIFE instead of ES modules to avoid MIME issues
        inlineDynamicImports: true, // Inline dynamic imports to avoid additional module loading
      }
    }
  },
  
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
