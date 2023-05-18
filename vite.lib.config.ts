import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import banner from "vite-plugin-banner";
import pkg from "./package.json";

const packageName = "editor";

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

const info = `/**
 * name: ${pkg.name}
 * version: ${pkg.version}
 * description: ${pkg.description}
 * author: ${pkg.author}
 * homepage: ${pkg.homepage}
 * repository: ${pkg.repository.url}
 */`;

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
  plugins: [react({}), banner(info)],
  resolve: {
    alias: {
      "@/*": path.resolve(__dirname, "src"),
    },
  },
});
