import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// Custom plugin to handle @wirralbears/* imports
function wirralBearsImportsPlugin() {
  return {
    name: 'wirralbears-imports',
    resolveId(id: any) {
      if (id.startsWith('@wirralbears/')) {
        const [, packageName, ...rest] = id.split('/');
        const packagePath = path.resolve(__dirname, `../../packages/${packageName}/src`);
        
        if (rest.length > 0) {
          return path.resolve(packagePath, ...rest);
        }
        
        return path.resolve(packagePath, 'index.ts');
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    tsconfigPaths(),
    wirralBearsImportsPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@queries': path.resolve(__dirname, 'src/queries'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@apptypes': path.resolve(__dirname, 'src/types'),
      "@wirralbears/validation": path.resolve(
        __dirname,
        "../../packages/validation"
      ),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: ['/node_modules/'],
    },
  },
  optimizeDeps: {
    include: ['/cookie/'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
