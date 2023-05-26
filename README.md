<h1 align='center'>💯 Monaco-Editor-React</h1>

Monaco Code Editor for React, without need of configuration files or plugins

<img src="https://camo.githubusercontent.com/9c766fb632fca7b8f42d163826fb8713d0507d34b7ad86f458cc8434c6d641c2/68747470733a2f2f7261776769742e636f6d2f6761627269656c62756c6c2f72656163742d6465736b746f702f6d61737465722f646f63732f7265736f75726365732f64656d6f2e737667" /> [https://monaco-editor-react.netlify.app](https://monaco-editor-react.netlify.app/)

## 💎 **Using**

### 📌 BaseEditor

```javascript
import React from "react";
import MonacoEditor from "@lyove/monaco-editor-react";

const exampleCode = `console.log('Hello @lyove/monaco-editor-react');`

export default class CodeEditor extends React.PureComponent {
  render() {
    return (
      <MonacoEditor
        width={1000}
        height={400}
        language="javascript"
        value={exampleCode}
        theme="vs"
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
          console.log("editor value:\n", value);
        }}
        // monacoPath="https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs"
      />
    );
  }
}
```

### 📌 DiffEditor

```javascript
import React from "react";
import { DiffEditor } from "@lyove/monaco-editor-react";

const originalCode = `npm install monaco-editor`
const modifiedCode = `npm install @lyove/monaco-editor-react`

export default class CodeDiffEditor extends React.PureComponent {
  render() {
    return (
      <DiffEditor
        width={600}
        height={400}
        original={originalCode}
        modified={modifiedCode}
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
| monacoPath | string | "https://unpkg.com/monaco-editor@0.38.0/min/vs" | custom cdn path, notice: `monacoPath` such as: "`https://your-custom-cdn-path/monaco-editor@version/min/vs`", the end of the path can only be "`/monaco-editor@version/min/vs`", no need for "`/xxx.js`" |


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
| monacoPath |string | "https://unpkg.com/monaco-editor@0.38.0/min/vs" | custom cdn path, notice: `monacoPath` such as: "`https://your-custom-cdn-path/monaco-editor@version/min/vs`", the end of the path can only be "`/monaco-editor@version/min/vs`", no need for "`/xxx.js`" |

## 📋 License
Licensed under the MIT License.
