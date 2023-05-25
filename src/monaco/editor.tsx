/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import classNames from "classnames";
import * as MonacoEditor from "monaco-editor";
import { debounce } from "lodash";
import monacoLoader from "./loader";
import {
  wrapperClassName,
  containerClassName,
  initHeight,
  loadingText,
  initOptions,
  themes,
  icons,
} from "../config";
import { isFunc, isNumber } from "../utils";
import "../style/index.less";

export interface EditorProps {
  width?: number;
  height?: number;
  value: string;
  language: string;
  theme?: string;
  bordered?: boolean;
  options?: MonacoEditor.editor.IEditorOptions;
  supportFullScreen?: boolean;
  className?: string;
  monacoWillMount?: (monaco: any) => void;
  editorDidMount?: (
    editor: MonacoEditor.editor.IStandaloneCodeEditor | undefined,
    monaco: any,
  ) => void;
  onChange?: (value: string | null) => void;
  monacoPath?: string;
}

interface EditorState {
  ready: boolean;
  isFullScreen: boolean;
}

const initRange: MonacoEditor.IRange = {
  startLineNumber: 0,
  endLineNumber: 0,
  startColumn: 0,
  endColumn: 0,
};

const fullScreenWidth = window.innerWidth || document.documentElement.offsetWidth;
const fullScreenHeight = window.innerHeight || document.documentElement.offsetHeight;

/**
 * Editor
 */
export default class Editor extends React.Component<EditorProps, EditorState> {
  private container: HTMLDivElement | null;
  public monaco: any;
  public editor?: MonacoEditor.editor.IStandaloneCodeEditor;
  private originalLayout: { width: number; height: number };
  static displayName = "MonacoEditor";

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      ready: false,
      isFullScreen: false,
    };

    this.container = null;
    this.editor = undefined;

    this.originalLayout = {
      width: 0,
      height: 0,
    };

    this.bindRef = this.bindRef.bind(this);
    this.handleFullScreen = this.handleFullScreen.bind(this);
  }

  componentDidMount() {
    const {
      monacoWillMount = () => {},
      editorDidMount = () => {},
      onChange = () => {},
      monacoPath,
    } = this.props;
    const initCfg = monacoPath ? { monacoPath } : undefined;
    monacoLoader.init(initCfg).then((monaco) => {
      this.monaco = monaco;

      // onWillMount
      if (isFunc(monacoWillMount)) {
        monacoWillMount(monaco);
      }

      // create editor
      this.createEditor();

      // onDidmount
      if (isFunc(editorDidMount)) {
        editorDidMount(this.editor, this.monaco);
      }

      // onChange
      this.editor?.onDidChangeModelContent(
        debounce(() => {
          onChange(this.editor?.getValue() || null);
        }, 50),
      );

      // resize
      window.addEventListener("resize", this.resizeEditorHeight);
    });
  }

  componentDidUpdate(prevProps: EditorProps, preState: EditorState) {
    const { ready, isFullScreen } = this.state;

    if (!ready) {
      this.createEditor();
    }

    const { width, height, value = "", language, theme, options = {} } = this.props;

    // with or height
    if (
      this.editor &&
      (prevProps.width !== width ||
        prevProps.height !== height ||
        preState.isFullScreen !== isFullScreen)
    ) {
      const wrapper = document.querySelector(`.${wrapperClassName}`) as HTMLElement;
      this.editor.layout({
        width: isFullScreen ? fullScreenWidth : width || wrapper.offsetWidth,
        height: isFullScreen ? fullScreenHeight : height || wrapper.offsetHeight,
      });
    }

    // value
    if (this.editor && value !== prevProps.value) {
      this.editor.setValue(value);
    }

    // language
    if (this.editor && language !== prevProps.language) {
      this.editor.setValue(value);
      this.monaco.editor.setModelLanguage(this.editor.getModel(), language);
    }

    // theme
    if (theme !== prevProps.theme) {
      this.monaco.editor.setTheme(theme);
    }

    // options
    if (this.editor && options !== prevProps.options) {
      this.editor.updateOptions(options);
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.dispose();
      window.removeEventListener("resize", this.resizeEditorHeight);
    }
  }

  bindRef(node: HTMLDivElement | null) {
    this.container = node;
  }

  createEditor() {
    const _this = this;

    if (!this.monaco || !this.container) {
      return;
    }

    const wrapper = document.querySelector(`.${wrapperClassName}`) as HTMLElement;

    const {
      width = wrapper.offsetWidth,
      height = initHeight,
      value,
      language,
      options,
      theme = "vs",
    } = this.props;

    // init
    const model = this.monaco.editor.createModel(value, language);
    this.editor = this.monaco.editor.create(this.container, {
      model,
      ...initOptions,
      ...options,
    });

    // layout
    if (isNumber(width) || isNumber(height)) {
      this.editor?.layout({
        width,
        height,
      });
    }

    // theme
    Object.keys(themes).forEach((t) => {
      _this.monaco.editor.defineTheme(t, themes[t]);
    });
    this.monaco.editor.setTheme(theme);

    // ready
    this.setState({
      ready: true,
    });
  }

  resizeEditorHeight = () => {
    const editorElement = this.editor?.getDomNode();
    if (editorElement) {
      editorElement.style.height = `${window.innerHeight}px`;
    }
    this.editor?.layout();
  };

  handleFullScreen = (sizeMode: string) => {
    if (!this.editor) {
      return;
    }

    if (sizeMode === "max") {
      const container = document.querySelector(`.${containerClassName}`) as HTMLElement;
      this.originalLayout = {
        width: container.offsetWidth,
        height: container.offsetHeight,
      };
      this.setState({
        isFullScreen: true,
      });
      this.editor?.layout({
        width: fullScreenWidth,
        height: fullScreenHeight,
      });
      document.body.classList.add("monaco-fullScreen");
    } else if (sizeMode === "min") {
      this.setState({
        isFullScreen: false,
      });
      this.editor?.layout({
        width: this.originalLayout.width,
        height: this.originalLayout.height,
      });
      document.body.classList.remove("monaco-fullScreen");
    }
  };

  render() {
    const {
      width,
      height = initHeight,
      className,
      bordered = true,
      supportFullScreen = true,
    } = this.props;
    const { ready, isFullScreen } = this.state;

    const wrapperClass = classNames(wrapperClassName, className, {
      fullscreen: isFullScreen,
      "no-border": !bordered,
    });

    const fullScreenClass = classNames({
      "full-screen-icon": !isFullScreen,
      "full-screen-icon-cancel": isFullScreen,
    });

    const styleWidth = isFullScreen
      ? `${fullScreenWidth}px`
      : width && !isNaN(width)
      ? `${width}px`
      : undefined;
    const styleHeight = isFullScreen ? "100vh" : `${height}px`;

    return (
      <div className={wrapperClass} style={{ width: styleWidth, height: styleHeight }}>
        {!ready && <span className="loading">{loadingText}</span>}
        {ready && supportFullScreen && (
          <div
            className={fullScreenClass}
            onClick={() => this.handleFullScreen(isFullScreen ? "min" : "max")}
          >
            {isFullScreen ? icons.min : icons.max}
          </div>
        )}
        <div ref={this.bindRef} className={containerClassName} />
      </div>
    );
  }
}
