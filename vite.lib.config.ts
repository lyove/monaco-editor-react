import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import banner from "vite-plugin-banner";
import styleInject from "./plugins/style-inject";
import pkg from "./package.json";

const packageName = "editor";

const fileNames = {
  es: `${packageName}.es.js`,
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

const pkgInfo = `/**
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
    outDir: "lib",
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: getPackageNameCamelCase(),
      formats: ["es", "iife", "umd"],
      fileName: (format) => fileNames[format],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        assetFileNames: `${packageName}.[ext]`,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        exports: "named",
      },
    },
    cssCodeSplit: true,
    emptyOutDir: true,
    assetsDir: "assets",
  },
  plugins: [react({}), banner(pkgInfo), styleInject()],
  resolve: {
    alias: {
      "@/*": path.resolve(__dirname, "src"),
    },
  },
});
