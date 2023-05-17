import MonacoEditor, { EditorProps } from "./monaco/editor";
import DiffEditor, { DiffProps } from "./monaco/diff";
import { themeNames } from "./config";

export type MonacoEditorProps = EditorProps;

export type MonacoDiffEditorProps = DiffProps;

export { DiffEditor, themeNames };

export default MonacoEditor;
