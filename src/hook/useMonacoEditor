/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useRef } from 'react';
import * as Monaco from 'monaco-editor';

export interface MonacoEditorState {
  value: string;
  language: string;
  theme: string;
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
}

export interface MonacoEditorActions {
  setValue: (value: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  toggleWordWrap: () => void;
  toggleMinimap: () => void;
  formatCode: () => void;
  undo: () => void;
  redo: () => void;
  find: (text: string) => void;
  replace: (text: string, replaceText: string) => void;
  getValue: () => string;
  getSelection: () => string | null;
  insertText: (text: string) => void;
  focus: () => void;
  blur: () => void;
}

export const useMonacoEditor = (initialState: Partial<MonacoEditorState> = {}) => {
  const [state, setState] = useState<MonacoEditorState>({
    value: '',
    language: 'javascript',
    theme: 'vs',
    fontSize: 14,
    wordWrap: false,
    minimap: true,
    lineNumbers: 'on',
    ...initialState,
  });

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);

  const setValue = useCallback((value: string) => {
    setState(prev => ({ ...prev, value }));
  }, []);

  const setLanguage = useCallback((language: string) => {
    setState(prev => ({ ...prev, language }));
  }, []);

  const setTheme = useCallback((theme: string) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    setState(prev => ({ ...prev, fontSize }));
  }, []);

  const toggleWordWrap = useCallback(() => {
    setState(prev => ({ ...prev, wordWrap: !prev.wordWrap }));
  }, []);

  const toggleMinimap = useCallback(() => {
    setState(prev => ({ ...prev, minimap: !prev.minimap }));
  }, []);

  const formatCode = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  }, []);

  const undo = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('undo')?.run();
    }
  }, []);

  const redo = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('redo')?.run();
    }
  }, []);

  const find = useCallback((text: string) => {
    if (editorRef.current) {
      editorRef.current.getAction('actions.find')?.run();
    }
  }, []);

  const replace = useCallback((text: string, replaceText: string) => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.startFindReplaceAction')?.run();
    }
  }, []);

  const getValue = useCallback(() => {
    return editorRef.current?.getValue() || '';
  }, []);

  const getSelection = useCallback(() => {
    const selection = editorRef.current?.getSelection();
    if (selection && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        return model.getValueInRange(selection);
      }
    }
    return null;
  }, []);

  const insertText = useCallback((text: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        editorRef.current.executeEdits('insert', [
          {
            range: selection,
            text,
            forceMoveMarkers: true,
          },
        ]);
      }
    }
  }, []);

  const focus = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    // Monaco Editor没有直接的blur方法
    if (editorRef.current) {
      const domNode = editorRef.current.getDomNode();
      if (domNode) {
        (domNode as HTMLElement).blur();
      }
    }
  }, []);

  const setEditorRef = useCallback((editor: Monaco.editor.IStandaloneCodeEditor | null) => {
    editorRef.current = editor;
  }, []);

  const setMonacoRef = useCallback((monaco: typeof Monaco | null) => {
    monacoRef.current = monaco;
  }, []);

  return {
    state,
    actions: {
      setValue,
      setLanguage,
      setTheme,
      setFontSize,
      toggleWordWrap,
      toggleMinimap,
      formatCode,
      undo,
      redo,
      find,
      replace,
      getValue,
      getSelection,
      insertText,
      focus,
      blur,
      setEditorRef,
      setMonacoRef,
    },
    refs: {
      editorRef,
      monacoRef,
    },
  };
};

// 自定义Hook用于处理编辑器内容验证
export const useMonacoValidation = (
  onValidate?: (markers: Monaco.editor.IMarker[]) => void
) => {
  const [markers, setMarkers] = useState<Monaco.editor.IMarker[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);

  const handleValidation = useCallback((newMarkers: Monaco.editor.IMarker[]) => {
    setMarkers(newMarkers);
    setErrorCount(newMarkers.filter(m => m.severity === Monaco.MarkerSeverity.Error).length);
    setWarningCount(newMarkers.filter(m => m.severity === Monaco.MarkerSeverity.Warning).length);
    
    if (onValidate) {
      onValidate(newMarkers);
    }
  }, [onValidate]);

  const clearMarkers = useCallback(() => {
    setMarkers([]);
    setErrorCount(0);
    setWarningCount(0);
  }, []);

  return {
    markers,
    errorCount,
    warningCount,
    handleValidation,
    clearMarkers,
  };
};

// 自定义Hook用于处理编辑器主题
export const useMonacoTheme = () => {
  const [theme, setTheme] = useState('vs');
  const [availableThemes] = useState([
    { value: 'vs', label: 'Light' },
    { value: 'vs-dark', label: 'Dark' },
    { value: 'hc-black', label: 'High Contrast' },
    { value: 'active4d', label: 'Active4D' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'solarized-dark', label: 'Solarized Dark' },
    { value: 'solarized-light', label: 'Solarized Light' },
  ]);

  return {
    theme,
    setTheme,
    availableThemes,
  };
};