import React from "react";
import classNames from "classnames";
import { debounce } from "lodash";
import * as MonacoEditor from "monaco-editor";
import monacoLoader from "./loader";
import {
  wrapperClassName,
  containerClassName,
  initHeight,
  loadingText,
  initOptions,
  themes,
} from "../config";
import { isFunc } from "../utils";

import "../style/index.less";

export interface DiffProps {
  width?: number;
  height?: number;
  className?: string;
  bordered?: boolean;
  original: string;
  modified: string;
  originalLanguage?: string;
  modifiedLanguage?: string;
  language: string;
  theme?: string;
  options?: MonacoEditor.editor.IDiffEditorOptions;
  monacoWillMount?: (monaco: any) => void;
  editorDidMount?: (
    original: MonacoEditor.editor.ITextModel,
    modified: MonacoEditor.editor.ITextModel,
    editor: MonacoEditor.editor.IStandaloneDiffEditor,
    monaco: any,
  ) => void;
  onChange?: (value: string) => void;
  monacoPath?: string;
}

interface DiffState {
  ready: boolean;
}

/**
 * DiffEditor
 */
export default class DiffEditor extends React.Component<DiffProps, DiffState> {
  public monaco: any;
  public editor: any;
  public container: HTMLDivElement | null;
  static displayName = "MonacoDiffEditor";

  constructor(props: DiffProps) {
    super(props);

    this.state = {
      ready: false,
    };

    this.container = null;
    this.monaco = null;
    this.editor = null;

    this.bindRef = this.bindRef.bind(this);
    this.createEditor = this.createEditor.bind(this);
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

      // react editor
      this.createEditor();

      const { original, modified } = this.editor.getModel();

      // onDidmount
      if (isFunc(editorDidMount)) {
        editorDidMount(original, modified, this.editor, this.monaco);
      }

      // onChange
      if (isFunc(onChange)) {
        modified.onDidChangeContent(
          debounce(() => {
            onChange(modified.getValue());
          }, 32),
        );
      }
    });
  }

  componentDidUpdate(prevProps: DiffProps, preState: DiffState) {
    const { ready } = this.state;

    if (!ready) {
      this.createEditor();
    }

    const {
      original,
      originalLanguage,
      modified,
      modifiedLanguage,
      language,
      theme,
      options,
      width,
      height,
    } = this.props;

    // layout
    if (prevProps.width !== width || prevProps.height !== height) {
      this.editor.layout({
        width,
        height,
      });
    }

    // original, modified
    if (prevProps.original !== original) {
      this.editor.getModel().original.setValue(original);
    }
    if (prevProps.modified !== modified) {
      this.editor.getModel().modified.setValue(modified);
    }

    // originalLanguage, modifiedLanguage, language
    if (
      prevProps.originalLanguage !== originalLanguage ||
      prevProps.modifiedLanguage !== modifiedLanguage ||
      prevProps.language !== language
    ) {
      const { original: or, modified: mo } = this.editor.getModel();
      this.monaco.editor.setModelLanguage(or, originalLanguage || language);
      this.monaco.editor.setModelLanguage(mo, modifiedLanguage || language);
    }

    // theme
    if (prevProps.theme !== theme) {
      this.monaco.editor.setTheme(theme);
    }

    // options
    if (prevProps.options !== options) {
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
    if (!this.monaco || !this.container) {
      return;
    }

    const wrapper = document.querySelector(`.${wrapperClassName}`) as HTMLElement;

    const {
      width = wrapper.offsetWidth,
      height = initHeight,
      original,
      modified,
      originalLanguage,
      modifiedLanguage,
      language,
      theme,
      options,
    } = this.props;

    // init
    const { createDiffEditor } = this.monaco.editor;
    this.editor = createDiffEditor(this.container, {
      ...initOptions,
      ...options,
    });

    // model
    const originalModel = this.monaco.editor.createModel(original, originalLanguage || language);
    const modifiedModel = this.monaco.editor.createModel(modified, modifiedLanguage || language);
    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    // layout
    this.editor.layout({
      width,
      height,
    });

    // theme
    Object.keys(themes).forEach((v) => {
      this.monaco.editor.defineTheme(v, themes[v]);
    });
    this.monaco.editor.setTheme(theme);

    // ready
    this.setState({
      ready: true,
    });
  }

  render() {
    const { ready } = this.state;
    const { width, height = initHeight, className, bordered = true } = this.props;

    const wrapperClass = classNames(wrapperClassName, "diff", className, {
      "no-border": !bordered,
    });

    const style = {
      ...(width && !isNaN(width) ? { width: `${width}px` } : { width: "100%" }),
      height: `${height}px`,
    };

    return (
      <div className={wrapperClass} style={style}>
        {!ready && <span className="loading">{loadingText}</span>}
        <div ref={this.bindRef} className={containerClassName} style={style} />
      </div>
    );
  }
}
