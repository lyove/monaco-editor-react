import MonacoEditor, { EditorProps } from "./monaco/editor";
import MonacoDiffEditor, { DiffProps } from "./monaco/diff";
import { themeNames } from "./config";

export type MonacoEditorProps = EditorProps;

export type MonacoDiffEditorProps = DiffProps;

export { MonacoDiffEditor, themeNames };

export default MonacoEditor;
