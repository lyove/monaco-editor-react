const outFileName = "editor.es";

const config = {
  compilationOptions: {
    preferredConfigPath: "./tsconfig.json",
  },
  entries: [
    {
      filePath: "./src/index.tsx",
      outFile: `./lib/${outFileName}.d.ts`,
      output: {
        noBanner: true,
      },
    },
  ],
};

module.exports = config;
