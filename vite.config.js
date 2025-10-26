import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // enable the new JSX transform so you don't need `import React from 'react'`
      jsxRuntime: "automatic",
    }),
  ],
  resolve: {
    alias: {
      // Alias for easier imports
      "@lib": "/src/lib",
      "@components": "/src/components",
    },
  },
});
