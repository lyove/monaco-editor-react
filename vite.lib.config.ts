import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const packageName = "monaco-editor-for-react";

const fileNames = {
  es: `${packageName}.js`,
  cjs: `${packageName}.cjs`,
  iife: `${packageName}.iife.js`,
  umd: `${packageName}.umd.js`,
};

const getPackageNameCamelCase = () => {
  try {
    return packageName.replace(/-./g, (char) => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/editor/index.tsx"),
      name: getPackageNameCamelCase(),
      formats: ["es", "cjs", "iife", "umd"],
      fileName: (format) => fileNames[format],
    },
    rollupOptions: {
      external: ["react"],
      output: { assetFileNames: `${packageName}.[ext]` },
    },
    emptyOutDir: true,
    assetsDir: "assets",
  },
  plugins: [react({})],
  resolve: {
    alias: {
      "@/*": path.resolve(__dirname, "src"),
    },
  },
});
