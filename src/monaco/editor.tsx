import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import * as Monaco from 'monaco-editor';
import monacoLoader from './loader';
import {
  containerClassName,
  icons,
  initHeight,
  initOptions,
  loadingText,
  themes,
  wrapperClassName,
} from '../config';
import { isFunc, isNumber } from '../utils';
import '../style/editor.less';

export interface EditorProps {
  width?: number;
  height?: number;
  value: string;
  language: string;
  theme?: string;
  bordered?: boolean;
  options?: Monaco.editor.IEditorOptions;
  supportFullScreen?: boolean;
  className?: string;
  monacoWillMount?: (monaco: typeof Monaco) => void;
  editorDidMount?: (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco,
  ) => void;
  onChange?: (value: string | null) => void;
  onValidate?: (markers: Monaco.editor.IMarker[]) => void;
  monacoPath?: string;
  /** 自定义代码提示配置 */
  customSuggestions?: {
    triggerCharacters?: string[];
    provideCompletionItems: (
      model: Monaco.editor.ITextModel,
      position: Monaco.Position,
      context: Monaco.languages.CompletionContext,
      token: Monaco.CancellationToken,
    ) => Monaco.languages.ProviderResult<Monaco.languages.CompletionList>;
  };
  /** 代码片段配置 */
  snippets?: Monaco.languages.CompletionItem[];
  /** 是否启用Emmet支持 */
  enableEmmet?: boolean;
  /** 是否启用错误检查 */
  enableValidation?: boolean;
}

const fullScreenWidth =
  window.innerWidth || document.documentElement.offsetWidth;
const fullScreenHeight =
  window.innerHeight || document.documentElement.offsetHeight;

const Editor: React.FC<EditorProps> = ({
  width,
  height = initHeight,
  value,
  language,
  theme = 'vs',
  bordered = true,
  options = {},
  supportFullScreen = true,
  className,
  monacoWillMount,
  editorDidMount,
  onChange,
  onValidate,
  monacoPath,
  customSuggestions,
  snippets = [],
  enableEmmet = false,
  enableValidation = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const originalLayoutRef = useRef({ width: 0, height: 0 });
  const isSettingValueRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [ready, setReady] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化Monaco Editor
  const initEditor = useCallback(async () => {
    try {
      setError(null);
      const monaco = await monacoLoader.init(
        monacoPath ? { monacoPath } : undefined,
      );
      monacoRef.current = monaco;

      // 调用willMount钩子
      if (monacoWillMount && isFunc(monacoWillMount)) {
        monacoWillMount(monaco);
      }

      // 注册自定义主题
      Object.keys(themes).forEach((t) => {
        monaco.editor.defineTheme(t, themes[t]);
      });

      // 配置自定义代码提示
      if (customSuggestions) {
        monaco.languages.registerCompletionItemProvider(language, {
          triggerCharacters: customSuggestions.triggerCharacters || [
            '.',
            '@',
            '#',
          ],
          provideCompletionItems: customSuggestions.provideCompletionItems,
        });
      }

      // 注册代码片段（基于当前位置生成合理的 range，且规范化 snippet 的 insertTextRules）
      if (snippets.length > 0) {
        monaco.languages.registerCompletionItemProvider(language, {
          provideCompletionItems: (_model: any, position: any) => {
            const localRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            } as any;

            const prepared = snippets.map((s) => {
              const item = { ...s } as Monaco.languages.CompletionItem;
              if (!item.range) {
                item.range = localRange;
              }
              if (
                item.kind === Monaco.languages.CompletionItemKind.Snippet &&
                !item.insertTextRules
              ) {
                item.insertTextRules =
                  Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
              }
              return item;
            });

            return {
              suggestions: prepared,
            };
          },
        });
      }

      // 启用Emmet支持
      if (enableEmmet && ['html', 'css', 'scss', 'less'].includes(language)) {
        // 这里可以集成Emmet支持
        console.warn('Emmet support is not implemented yet');
      }

      // 创建编辑器
      if (containerRef?.current) {
        const model = monaco.editor.createModel(value, language);
        // 在 model 上注册验证监听（仅注册一次，避免重复创建 model）
        if (onValidate) {
          model.onDidChangeContent(() => {
            const markers = monaco.editor.getModelMarkers({
              resource: model.uri,
            });
            onValidate(markers);
          });
        }
        const editorOptions: Monaco.editor.IStandaloneEditorConstructionOptions =
          {
            model,
            ...initOptions,
            ...options,
            automaticLayout: true,
            theme,
            // dimension: {
            //   width: width || Math.max(containerRef?.current?.offsetWidth || 0, 300),
            //   height: height || initHeight,
            // },
          };

        if (!enableValidation) {
          editorOptions['hover'] = { enabled: false };
          editorOptions['lightbulb'] = { enabled: 'off' } as any;
        }

        const editor = monaco.editor.create(
          containerRef?.current,
          editorOptions,
        );
        editorRef.current = editor;

        // layout
        if (isNumber(width) || isNumber(height)) {
          editor?.layout({
            width:
              width || Math.max(containerRef?.current?.offsetWidth || 0, 300),
            height: height || initHeight,
          });
        }

        // 监听内容变化
        editor.onDidChangeModelContent(() => {
          if (!isSettingValueRef.current) {
            const newValue = editor.getValue();
            if (typeof onChange === 'function') {
              onChange(newValue);
            }
          }
        });

        // 调用didMount钩子
        if (editorDidMount && isFunc(editorDidMount)) {
          editorDidMount(editor, monaco);
        }

        setReady(true);
      }
    } catch (err) {
      console.error('Failed to initialize Monaco Editor:', err);
      setError('编辑器初始化失败，请刷新页面重试');
    }
  }, [monacoPath]);

  useEffect(() => {
    initEditor();
  }, []);

  // 处理全屏切换
  const handleFullScreen = useCallback(() => {
    if (!editorRef.current) {
      return;
    }

    if (!isFullScreen) {
      // 进入全屏
      const container = document.querySelector(
        `.${wrapperClassName}`,
      ) as HTMLElement;
      if (container) {
        originalLayoutRef.current = {
          width: container.offsetWidth,
          height: container.offsetHeight,
        };
      }

      setIsFullScreen(true);
      editorRef.current.layout({
        width: fullScreenWidth,
        height: fullScreenHeight,
      });
      document.body.classList.add('monaco-fullscreen');
    } else {
      // 退出全屏
      setIsFullScreen(false);
      editorRef.current.layout({
        width: originalLayoutRef.current.width,
        height: originalLayoutRef.current.height,
      });
      document.body.classList.remove('monaco-fullscreen');
    }
  }, [isFullScreen]);

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    if (editorRef.current && isFullScreen) {
      editorRef.current.layout({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [isFullScreen]);

  // 监听容器大小变化
  useEffect(() => {
    if (containerRef.current && !isFullScreen) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        if (editorRef.current && entries[0]) {
          const { width: newWidth, height: newHeight } = entries[0].contentRect;
          editorRef.current.layout({ width: newWidth, height: newHeight });
        }
      });
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isFullScreen]);

  // 监听窗口大小变化
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // 更新编辑器值
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      isSettingValueRef.current = true;
      editorRef.current.setValue(value);
      setTimeout(() => {
        isSettingValueRef.current = false;
      }, 0);
    }
  }, [value]);

  // 更新语言
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  // 更新主题
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme);
    }
  }, [theme]);

  // 更新选项
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions(options);
    }
  }, [options]);

  // 更新尺寸
  useEffect(() => {
    if (editorRef.current && !isFullScreen) {
      const getContainerWidth = () => {
        if (containerRef.current) {
          const style = window.getComputedStyle(
            containerRef.current.parentElement!,
          );
          const parentWidth =
            parseInt(style.width, 10) ||
            containerRef.current.offsetWidth ||
            300;
          return Math.max(parentWidth, 300);
        }
        return 300; // 默认最小宽度
      };

      const calculatedWidth = width || getContainerWidth();
      editorRef.current.layout({
        width: calculatedWidth,
        height: height || initHeight,
      });
    }
  }, [width, height, isFullScreen]);

  const wrapperClass = classNames(wrapperClassName, className, {
    fullscreen: isFullScreen,
    'no-border': !bordered,
  });

  const fullScreenClass = classNames({
    'full-screen-icon': !isFullScreen,
    'full-screen-icon-cancel': isFullScreen,
  });

  const styleWidth = isFullScreen
    ? `${fullScreenWidth}px`
    : width && !isNaN(width)
    ? `${width}px`
    : undefined;
  const styleHeight = isFullScreen ? '100vh' : `${height}px`;

  if (error) {
    return (
      <div
        className={wrapperClass}
        style={{ width: styleWidth, height: styleHeight }}
      >
        <div
          className="error-message"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff4d4f',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={wrapperClass}
      style={{ width: styleWidth, height: styleHeight }}
    >
      {!ready && <span className="loading">{loadingText}</span>}
      {ready && supportFullScreen && (
        <div
          className={fullScreenClass}
          onClick={handleFullScreen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleFullScreen();
            }
          }}
        >
          {isFullScreen ? icons.min : icons.max}
        </div>
      )}
      <div ref={containerRef} className={containerClassName} />
    </div>
  );
};

Editor.displayName = 'MonacoEditor';

export default Editor;
