import React from "react";
import MonacoEditor, { DiffEditor } from "../editor";
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

export default class Demo extends React.PureComponent<BaseProps, BaseState> {
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
      <div className="monaco-editor-examples">
        <h1>Monaco Editor example</h1>
        <div className="base-editor">
          <h2>base example</h2>
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
            width={width}
            height={height}
            language={language}
            value={examples[language]}
            theme={theme}
            supportFullScreen={true}
            onChange={(value: string | null) => {
              console.log("editor value: ", value);
            }}
            // cdnConfig={{
            //   monacoPath: "https://g.alicdn.com/code/lib/monaco-editor/0.36.1/min/vs",
            // }}
          />
        </div>
        <div className="diff-editor">
          <h2>diff example</h2>
          <DiffEditor
            width={1000}
            height={400}
            original={diffExamples.original}
            modified={diffExamples.modified}
            language="markdown"
          />
        </div>
      </div>
    );
  }
}
