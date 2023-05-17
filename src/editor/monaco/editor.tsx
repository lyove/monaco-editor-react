/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import classNames from "classnames";
import * as MonacoEditor from "monaco-editor";
import { debounce } from "lodash";
import monacoLoader from "./loader";
import { initOptions, themes, icons } from "../config";
import { isFunc, isNumber } from "../utils";
import type { Config } from "./loader";
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
  cdnConfig?: Config;
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

const initHeight = 200;

/**
 * BaseEditor
 */
export default class BaseEditor extends React.Component<EditorProps, EditorState> {
  private container: HTMLDivElement | null;
  public monaco: any;
  public editor?: MonacoEditor.editor.IStandaloneCodeEditor;
  static displayName = "MonacoEditor";

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      ready: false,
      isFullScreen: false,
    };

    this.container = null;
    this.editor = undefined;

    this.bindRef = this.bindRef.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleFullScreen = this.handleFullScreen.bind(this);
  }

  componentDidMount() {
    const { monacoWillMount = () => {}, editorDidMount = () => {}, cdnConfig } = this.props;
    monacoLoader.init(cdnConfig).then((monaco) => {
      this.monaco = monaco;
      if (isFunc(monacoWillMount)) {
        monacoWillMount(monaco);
      }

      this.createEditor();

      // ready
      this.setState({
        ready: true,
      });

      // onDidmount
      if (isFunc(editorDidMount)) {
        editorDidMount(this.editor, this.monaco);
      }

      // onChange
      this.editor?.onDidChangeModelContent(
        debounce(() => {
          this.onChange();
        }, 50),
      );
    });
  }

  componentDidUpdate(prevProps: EditorProps) {
    const { ready } = this.state;

    if (!ready) {
      this.createEditor();
    }

    const { width, height = initHeight, value = "", language, theme, options = {} } = this.props;

    // value
    if (this.editor && value !== prevProps.value) {
      if (options.readOnly) {
        this.editor.setValue(value);
      } else {
        this.editor.executeEdits("", [
          {
            range: this.editor.getModel()?.getFullModelRange() || initRange,
            text: value,
          },
        ]);
      }
      // push an "undo stop" in the undo-redo stack.
      this.editor.pushUndoStop();
    }

    // language
    if (this.editor && language !== prevProps.language) {
      this.editor.setValue(value);
      this.monaco.editor.setModelLanguage(this.editor.getModel(), language);
    }

    // with or height
    if (
      this.editor &&
      (prevProps.width !== width || prevProps.height !== height) &&
      isNumber(width) &&
      isNumber(height)
    ) {
      this.editor.layout({
        width: this.calc(width),
        height: this.calc(height),
      });
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

    const { width, height = initHeight, value, language, options, theme = "vs" } = this.props;

    // init
    const model = this.monaco.editor.createModel(value, language);
    this.editor = this.monaco.editor.create(this.container, {
      model,
      ...initOptions,
      ...options,
    });

    // with or height
    if (isNumber(width) || isNumber(height)) {
      this.editor?.layout({
        width: this.calc(width),
        height: this.calc(height),
      });
    }

    // theme
    Object.keys(themes).forEach((t) => {
      _this.monaco.editor.defineTheme(t, themes[t]);
    });
    this.monaco.editor.setTheme(theme);
  }

  onChange() {
    const { onChange = () => {} } = this.props;
    if (!this.editor) {
      return;
    }
    const value = this.editor.getValue();
    onChange(value);
  }

  calc = (n: number | undefined) => {
    if (!n) {
      return 0;
    }
    if (typeof n === "string") {
      return n;
    }
    return n - 2;
  };

  handleFullScreen = (sizeMode: string) => {
    const { width, height = initHeight } = this.props;

    if (!this.editor) {
      return;
    }

    if (sizeMode === "max") {
      this.setState({
        isFullScreen: true,
      });
      this.editor?.layout({
        width: window.innerWidth || document.documentElement.offsetWidth,
        height: window.innerHeight || document.documentElement.offsetHeight,
      });
      document.body.classList.add("monaco-fullScreen");
    } else if (sizeMode === "min") {
      this.setState({
        isFullScreen: false,
      });
      this.editor?.layout({
        width: width || 0,
        height: height || initHeight,
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

    const wrapperClass = classNames("monaco-editor-react", className, {
      fullscreen: isFullScreen,
      "no-border": !bordered,
    });

    const fullScreenClass = classNames({
      "full-screen-icon": !isFullScreen,
      "full-screen-icon-cancel": isFullScreen,
    });

    return (
      <div className={wrapperClass} style={{ width, height }}>
        {!ready && <span className="loading">Loading</span>}
        {ready && supportFullScreen && (
          <div
            className={fullScreenClass}
            onClick={() => this.handleFullScreen(isFullScreen ? "min" : "max")}
          >
            {isFullScreen ? icons.min : icons.max}
          </div>
        )}
        <div
          ref={this.bindRef}
          className="editor-container"
          style={{ height, flex: 1, display: ready ? "block" : "none" }}
        />
      </div>
    );
  }
}
