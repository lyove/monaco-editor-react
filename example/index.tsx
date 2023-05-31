import React from "react";
import ReactDOM from "react-dom";
import MonacoEditor, { MonacoDiffEditor } from "../src/index";
import { languageOptions, themeOptons } from "./constant";
import { examples, diffExamples } from "./example";
import "./style.less";

export interface BaseProps {
  [key: string]: unknown;
}

interface BaseState {
  theme: string;
  language: string;
  width: number;
  height: number;
}

class App extends React.PureComponent<BaseProps, BaseState> {
  constructor(props: BaseProps) {
    super(props);
    this.state = {
      theme: "vs",
      language: "javascript",
      width: 1000,
      height: 400,
    };
  }

  componentDidMount(): void {
    const langSelect = document.getElementById("lang") as HTMLSelectElement;
    langSelect.value = "javascript";
  }

  handleThemeChange = () => {
    const tSelect = document.getElementById("theme") as HTMLSelectElement;
    const t = tSelect.value;
    this.setState({ theme: t });
  };

  handleLanguageChange = () => {
    const lSelect = document.getElementById("lang") as HTMLSelectElement;
    const l = lSelect.value;
    this.setState({ language: l });
  };

  render() {
    const { theme, language, width, height } = this.state;
    return (
      <>
        <nav className="header">
          <span className="nav-item">
            <a href="/">Home</a>
          </span>
          <span className="nav-item">
            <a href="https://github.com/lyove/monaco-editor-react/blob/master/README.md">
              Documentation
            </a>
          </span>
          <span className="nav-item">
            <a href="https://github.com/lyove/monaco-editor-react">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              Github
            </a>
          </span>
        </nav>

        <div className="feature">
          <h1>
            <span>Monaco-Editor-React</span>
          </h1>
          <div className="desc">
            React component for MonacoEditor without needing to use webpack plugins
          </div>
        </div>

        <div className="base-editor">
          <h2>Base example</h2>
          <div className="label-box">
            <label>
              Language:
              <select id="lang" className="form-select" onChange={this.handleLanguageChange}>
                {languageOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Theme:
              <select id="theme" className="form-select" onChange={this.handleThemeChange}>
                {themeOptons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <MonacoEditor
            // width={width}
            height={height}
            language={language}
            value={examples[language]}
            theme={theme}
            supportFullScreen={true}
            options={{
              fontSize: 13,
              fontFamily: 'Menlo, Monaco, "Courier New", monospace',
              minimap: {
                enabled: true,
              },
              automaticLayout: true,
              formatOnPaste: true,
              scrollbar: {
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
            monacoWillMount={(monaco) => {
              console.log("monaco：", monaco);
            }}
            editorDidMount={(editor, monaco) => {
              console.log("editor：", editor);
            }}
            onChange={(value: string | null) => {
              console.log("editor value:===========================\n", value);
            }}
            // monacoPath="https://g.alicdn.com/code/lib/monaco-editor/0.36.1/min/vs"
          />
        </div>

        <div className="diff-editor">
          <h2>Diff example</h2>
          <MonacoDiffEditor
            // width={600}
            height={400}
            original={diffExamples.original}
            modified={diffExamples.modified}
            language="markdown"
            options={{
              scrollbar: {
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
          />
        </div>
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading">
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root"),
);
