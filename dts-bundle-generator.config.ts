const packageName = "monaco-editor-react";

const config = {
  entries: [
    {
      filePath: "./src/editor/index.tsx",
      outFile: `./dist/${packageName}.d.ts`,
      noCheck: false,
    },
  ],
};

module.exports = config;
