import React from "react";
import classNames from "classnames";
import { debounce } from "lodash";
import * as MonacoEditor from "monaco-editor";
import monacoLoader from "./loader";
import { initOptions, themes } from "../config";
import { isFunc } from "../utils";
import type { Config } from "./loader";

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
  ) => void;
  onChange?: (value: string) => void;
  cdnConfig?: Config;
}

interface DiffState {
  ready: boolean;
  monacoDidMount: boolean;
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
      monacoDidMount: false,
    };

    this.container = null;
    this.monaco = null;
    this.editor = null;

    this.bindRef = this.bindRef.bind(this);
    this.createEditor = this.createEditor.bind(this);
  }

  componentDidMount() {
    const { monacoWillMount = () => {}, cdnConfig } = this.props;
    monacoLoader.init(cdnConfig).then((m) => {
      if (isFunc(monacoWillMount)) {
        monacoWillMount(m);
      }
      this.monaco = m;
      this.setState({
        monacoDidMount: true,
      });
    });
  }

  componentDidUpdate(prevProps: DiffProps) {
    const { ready, monacoDidMount } = this.state;

    if (!monacoDidMount) {
      return;
    }

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
      height,
      width,
    } = this.props;

    if (prevProps.width !== width || prevProps.height !== height) {
      this.editor.layout({ width, height });
    }

    // original
    if (prevProps.original !== original) {
      this.editor.getModel().original.setValue(original);
    }

    // modified
    if (prevProps.modified !== modified) {
      this.editor.getModel().modified.setValue(modified);
    }

    // originalLanguage、modifiedLanguage、language
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
    const { editorDidMount = () => {}, theme, options, width, height, onChange } = this.props;
    if (!this.monaco || !this.container) {
      return;
    }

    this.editor = this.monaco.editor.createDiffEditor(this.container, {
      ...initOptions,
      ...options,
    });

    this.setModels();

    const { original, modified } = this.editor.getModel();

    if (isFunc(editorDidMount)) {
      editorDidMount(original, modified, this.editor);
    }

    if (onChange && isFunc(onChange)) {
      modified.onDidChangeContent(
        debounce(() => {
          onChange(modified.getValue());
        }, 32),
      );
    }

    Object.keys(themes).forEach((v) => {
      this.monaco.editor.defineTheme(v, themes[v]);
    });

    this.monaco.editor.setTheme(theme);

    this.editor.layout({ width, height });

    this.setState({ ready: true });
  }

  setModels() {
    const { original, modified, originalLanguage, modifiedLanguage, language } = this.props;

    const originalModel = this.monaco.editor.createModel(original, originalLanguage || language);

    const modifiedModel = this.monaco.editor.createModel(modified, modifiedLanguage || language);

    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  }

  render() {
    const { ready } = this.state;
    const { width, height, className, bordered = true } = this.props;

    const wrapperClass = classNames("monaco-editor-for-react", "diff", className, {
      "no-border": !bordered,
    });

    return (
      <div className={wrapperClass} style={{ width, height }}>
        {!ready && <span className="loading">Loading</span>}
        <div
          ref={this.bindRef}
          className="editor-container"
          style={{ height, flex: 1, display: ready ? "block" : "none" }}
        />
      </div>
    );
  }
}
