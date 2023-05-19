const outFileName = "editor.es";

const config = {
  entries: [
    {
      filePath: "./src/editor/index.tsx",
      outFile: `./lib/${outFileName}.d.ts`,
      noCheck: false,
    },
  ],
};

module.exports = config;
