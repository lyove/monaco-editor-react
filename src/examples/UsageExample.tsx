import React, { useState } from 'react';
import MonacoEditor, {
  createCustomSuggestionsProvider,
  getSnippetsByLanguage,
  useMonacoEditor,
  useMonacoTheme,
  useMonacoValidation,
} from '..';

const UsageExample: React.FC = () => {
  const [code, setCode] = useState(`// 欢迎使用Monaco编辑器
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');`);

  const { actions: editorActions } = useMonacoEditor({
    value: code,
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
  });

  const { theme, setTheme, availableThemes } = useMonacoTheme();
  const { errorCount, warningCount, handleValidation } = useMonacoValidation();

  const [language, setLanguage] = useState('javascript');
  const [showMinimap, setShowMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

  const handleEditorChange = (value: string | null) => {
    setCode(value || '');
  };

  const handleValidationMarkers = (markers: any[]) => {
    handleValidation(markers);
  };

  const customSuggestions = createCustomSuggestionsProvider('javascript', [
    'React',
    'useState',
    'useEffect',
    'useCallback',
    'useMemo',
  ]);

  const snippets = getSnippetsByLanguage(language);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Monaco Editor 使用示例</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          语言:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '20px' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
        </label>

        <label>
          主题:
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '20px' }}
          >
            {availableThemes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={showMinimap}
            onChange={(e) => setShowMinimap(e.target.checked)}
          />
          显示小地图
        </label>

        <label style={{ marginLeft: '20px' }}>
          <input
            type="checkbox"
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.target.checked)}
          />
          自动换行
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <span>
          错误: {errorCount} | 警告: {warningCount}
        </span>
      </div>

      <MonacoEditor
        height={400}
        language={language}
        theme={theme}
        value={code}
        onChange={handleEditorChange}
        onValidate={handleValidationMarkers}
        options={{
          fontSize: 14,
          minimap: { enabled: showMinimap },
          wordWrap: wordWrap ? 'on' : 'off',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          formatOnType: true,
        }}
        snippets={snippets}
        customSuggestions={customSuggestions}
        enableValidation={true}
      />

      <div style={{ marginTop: '20px' }}>
        <h3>高级功能示例</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => editorActions.formatCode()}>
            格式化代码
          </button>
          <button type="button" onClick={() => editorActions.undo()}>
            撤销
          </button>
          <button type="button" onClick={() => editorActions.redo()}>
            重做
          </button>
          <button type="button" onClick={() => editorActions.find('console')}>
            查找console
          </button>
          <button
            type="button"
            onClick={() => editorActions.insertText('// 插入的注释\n')}
          >
            插入注释
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>代码提示功能</h3>
        <p>尝试输入以下字符来体验代码提示：</p>
        <ul>
          <li>
            输入 <code>console.</code> 查看console对象的方法
          </li>
          <li>
            输入 <code>function</code> 查看函数代码片段
          </li>
          <li>
            输入 <code>use</code> 查看React Hooks
          </li>
          <li>
            输入 <code>if</code> 查看条件语句代码片段
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UsageExample;
