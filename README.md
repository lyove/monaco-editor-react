<h1 align='center'>💯 Monaco-Editor-React</h1>

Monaco Code Editor for React, without need of configuration files or plugins

[https://monaco-editor-react.netlify.app](https://monaco-editor-react.netlify.app/)

## 💎 **Using**

### 📌 BaseEditor

```javascript
import React from "react";
import MonacoEditor from "@lyove/monaco-editor-react";
import "@lyove/monaco-editor-react/lib/editor.css";
import examples from "./examples";

export default class CodeEditor extends React.PureComponent {
  render() {
    return (
      <MonacoEditor
        width={800}
        height={500}
        language="javascript"
        value={examples["javascript"]}
        onChange={(value) => {
          console.log("editor value: ", value);
        }}
        editorDidMount={(editor, monaco) => {
          console.log("editor instance: ", editor);
          console.log("monaco: ", monaco);
        }}
      />
    );
  }
}
```

### 📌 DiffEditor

```javascript
import React from "react";
import { DiffEditor } from "@lyove/monaco-editor-react";
import "@lyove/monaco-editor-react/lib/editor.css";
import { diffExamples } from "./example";

export default class CodeDiffEditor extends React.PureComponent {
  render() {
    return (
      <DiffEditor
        width={600}
        height={400}
        original={diffExamples.original}
        modified={diffExamples.modified}
        language="markdown"
      />
    );
  }
}
```


### 🧩 Editor Props

| Name | Type | Default | Description |
|:--------------|:-------------|:-------------|:---------------|
| value | string | null | editor value |
| width | number | null | editor width |
| height | number | null | editor height |
| language | string | null | editor language |
| theme | string | vs | vs, vs-dark, active4d, clouds, chrome, monokai, solarized-dark, solarized-light |
| options | object | null | [IEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html) |
| bordered | boolean | true | need bordered ? |
| className | string | null | wrapper class name |
| onChange | func | (value) => void | triggered when the editor value changes |
| monacoWillMount | func | (monaco) => void | triggered when the monaco will mounted |
| editorDidMount | func | (editor: MonacoEditor.editor, monaco: any) => void | triggered when the editor did mounted |
| cdnConfig | { monacoPath: string } | { monacoPath: "https://unpkg.com/monaco-editor@0.38.0/min/vs" } | custom cdn path, notice: `monacoPath` such as: "`https://your-custom-cdn-path/monaco-editor@version/min/vs`", the end of the path can only be "`/monaco-editor@version/min/vs`", no need for "`/xxx.js`" |


### 🧩 DiffEditor Props

| Name | Type | Default | Description |
|:--------------|:-------------|:-------------|:---------------|
| original | string | null | diff editor original value |
| modified | string | null | diff editor modified value |
| width | number | null | diff editor width |
| height | number | null | diff editor height |
| language | string | null | diff editor language |
| originalLanguage | string | null | diff editor original language |
| modifiedLanguage | string | null | diff editor modified language |
| theme | string | vs | vs, vs-dark, active4d, clouds, chrome, monokai, solarized-dark, solarized-light |
| options | object | null | [IDiffEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html) |
| className | string | null | wrapper class name |
| monacoWillMount | func | (monaco) => void | triggered when the monaco will mounted |
| editorDidMount | func | (original: MonacoEditor.editor.ITextModel, modified: MonacoEditor.editor.ITextModel, editor: MonacoEditor.editor, monaco: any) => void | triggered when the diff editor did mounted |
| onChange | (value: string) => void | null | modified model content change |
| cdnConfig | { monacoPath: string } | { monacoPath: "https://unpkg.com/monaco-editor@0.38.0/min/vs" } | custom cdn path, notice: `monacoPath` such as: "`https://your-custom-cdn-path/monaco-editor@version/min/vs`", the end of the path can only be "`/monaco-editor@version/min/vs`", no need for "`/xxx.js`" |

# 📋 License
Licensed under the MIT License.
