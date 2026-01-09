import React from 'react';
import { themeNames } from './config';
import MonacoEditorErrorBoundary from './ErrorBoundary';
import MonacoDiffEditor, { DiffProps } from './monaco/diff';
import MonacoEditor, { EditorProps } from './monaco/editor';
import {
  createCustomSuggestionsProvider,
  getSnippetsByLanguage,
} from './utils/suggestions';

export type MonacoEditorProps = EditorProps;
export type MonacoDiffEditorProps = DiffProps;

// 导出工具函数和组件
export {
  useMonacoEditor,
  useMonacoTheme,
  useMonacoValidation,
} from './hooks/useMonacoEditor';
export { MonacoDiffEditor, themeNames };
export { getSnippetsByLanguage, createCustomSuggestionsProvider };
export { MonacoEditorErrorBoundary };

// 默认导出带有错误边界的编辑器
const MonacoEditorWithErrorBoundary: React.FC<EditorProps> = (props) => {
  return (
    <MonacoEditorErrorBoundary>
      <MonacoEditor {...props} />
    </MonacoEditorErrorBoundary>
  );
};

export default MonacoEditorWithErrorBoundary;
