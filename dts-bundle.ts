const outFileName = "editor.es";

const config = {
  compilationOptions: {
    preferredConfigPath: "./tsconfig.json",
  },
  entries: [
    {
      filePath: "./src/editor/index.tsx",
      outFile: `./lib/${outFileName}.d.ts`,
      output: {
        noBanner: true,
      },
    },
  ],
};

module.exports = config;
