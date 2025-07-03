import { monacoPath } from "../config";
import { isObject } from "../utils";

declare global {
  interface Window {
    monaco?: any;
  }
}

interface Config {
  /**
   * default: https://unpkg.com/monaco-editor@0.51.0/min/vs
   */
  monacoPath: string;
}

const noop = () => {
  //
};

class Monaco {
  private config: Config;

  public wrapperPromise: Promise<any>;

  public resolve: (value: any) => void;

  public reject: (value?: any) => void;

  private isInitialized: boolean;

  constructor(config: Config) {
    this.config = config;
    this.injectScripts = this.injectScripts.bind(this);
    this.mainScriptLoad = this.mainScriptLoad.bind(this);

    this.reject = noop;
    this.resolve = noop;

    this.wrapperPromise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });

    this.isInitialized = false;
  }

  injectScripts(script: HTMLScriptElement) {
    document.head.appendChild(script);
  }

  mainScriptLoad() {
    document.removeEventListener("monacoInit", this.mainScriptLoad);
    this.resolve(window.monaco);
  }

  createScript(src?: string) {
    const script = document.createElement("script");
    if (src) {
      script.src = src;
    }
    return script;
  }

  createMonacoLoaderScript(mainScript: HTMLScriptElement) {
    const loaderScript = this.createScript(`${this.config.monacoPath}/loader.js`);
    loaderScript.onload = () => this.injectScripts(mainScript);
    loaderScript.onerror = this.reject;
    return loaderScript;
  }

  createMainScript(): HTMLScriptElement {
    const mainScript = this.createScript();
    mainScript.innerHTML = `
      require.config({ paths: { 'vs': '${this.config.monacoPath}' } });
      require(['vs/editor/editor.main'], function() {
        document.dispatchEvent(new Event('monacoInit'));
      });
    `;
    mainScript.onerror = this.reject;
    return mainScript;
  }

  init(config?: Config): Promise<any> {
    if (config && isObject(config)) {
      // if config is not null
      this.config = { ...this.config, ...config };
    }

    if (!this.isInitialized) {
      if (window.monaco && window.monaco.editor) {
        return new Promise((res) => res(window.monaco));
      }

      document.addEventListener("monacoInit", this.mainScriptLoad);

      const mainScript = this.createMainScript();
      const loaderScript = this.createMonacoLoaderScript(mainScript);
      this.injectScripts(loaderScript);
    }

    this.isInitialized = true;

    return this.wrapperPromise;
  }
}

export default new Monaco({ monacoPath });
