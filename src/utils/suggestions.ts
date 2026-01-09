/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Monaco from 'monaco-editor';

// 创建默认range
const defaultRange = {
  startLineNumber: 1,
  endLineNumber: 1,
  startColumn: 1,
  endColumn: 1,
};

// 通用代码片段
export const commonSnippets: Monaco.languages.CompletionItem[] = [
  {
    label: 'console.log',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText: 'console.log(${1:message});',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: '输出日志到控制台',
    range: defaultRange,
  },
  {
    label: 'console.error',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText: 'console.error(${1:error});',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: '输出错误到控制台',
    range: defaultRange,
  },
  {
    label: 'function',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'function ${1:name}(${2:params}) {\n\t${3:// TODO: Implement}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: '创建函数',
    range: defaultRange,
  },
  {
    label: 'arrow function',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'const ${1:name} = (${2:params}) => {\n\t${3:// TODO: Implement}\n};',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: '创建箭头函数',
    range: defaultRange,
  },
  {
    label: 'if',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText: 'if (${1:condition}) {\n\t${2:// TODO: Implement}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'if语句',
    range: defaultRange,
  },
  {
    label: 'ifelse',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'if (${1:condition}) {\n\t${2:// TODO: Implement}\n} else {\n\t${3:// TODO: Implement}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'if-else语句',
    range: defaultRange,
  },
  {
    label: 'for',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// TODO: Implement}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'for循环',
    range: defaultRange,
  },
  {
    label: 'forof',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'for (const ${1:item} of ${2:array}) {\n\t${3:// TODO: Implement}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'for-of循环',
    range: defaultRange,
  },
  {
    label: 'try',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'try {\n\t${1:// TODO: Implement}\n} catch (${2:error}) {\n\t${3:// TODO: Handle error}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'try-catch语句',
    range: defaultRange,
  },
];

// React代码片段
export const reactSnippets: Monaco.languages.CompletionItem[] = [
  {
    label: 'useState',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'const [${1:state}, set${2:State}] = useState(${3:initialState});',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'React useState Hook',
    range: defaultRange,
  },
  {
    label: 'useEffect',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'useEffect(() => {\n\t${1:// TODO: Implement}\n}, [${2:dependencies}]);',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'React useEffect Hook',
    range: defaultRange,
  },
  {
    label: 'useCallback',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'const ${1:callback} = useCallback(() => {\n\t${2:// TODO: Implement}\n}, [${3:dependencies}]);',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'React useCallback Hook',
    range: defaultRange,
  },
  {
    label: 'useMemo',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'const ${1:value} = useMemo(() => {\n\t${2:// TODO: Implement}\n}, [${3:dependencies}]);',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'React useMemo Hook',
    range: defaultRange,
  },
  {
    label: 'FC',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'interface ${1:ComponentName}Props {\n\t${2:// TODO: Define props}\n}\n\nconst ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ ${3:props} }) => {\n\treturn (\n\t\t<div>\n\t\t\t${4:// TODO: Implement}\n\t\t</div>\n\t);\n};\n\nexport default ${1:ComponentName};',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'React Function Component',
    range: defaultRange,
  },
];

// TypeScript代码片段
export const typescriptSnippets: Monaco.languages.CompletionItem[] = [
  {
    label: 'interface',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText: 'interface ${1:Name} {\n\t${2:// TODO: Define properties}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'TypeScript Interface',
    range: defaultRange,
  },
  {
    label: 'type',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText: 'type ${1:Name} = {\n\t${2:// TODO: Define properties}\n};',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'TypeScript Type',
    range: defaultRange,
  },
  {
    label: 'enum',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'enum ${1:Name} {\n\t${2:VALUE} = ${3:0},\n\t${4:// TODO: Add more values}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'TypeScript Enum',
    range: defaultRange,
  },
];

// CSS代码片段
export const cssSnippets: Monaco.languages.CompletionItem[] = [
  {
    label: 'flex',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Flexbox布局',
    range: defaultRange,
  },
  {
    label: 'grid',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      'display: grid;\ngrid-template-columns: ${1:repeat(3, 1fr)};\ngap: ${2:16px};',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'CSS Grid布局',
    range: defaultRange,
  },
  {
    label: 'media',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      '@media (max-width: ${1:768}px) {\n\t${2:// TODO: Add styles}\n}',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: '媒体查询',
    range: defaultRange,
  },
];

// HTML代码片段
export const htmlSnippets: Monaco.languages.CompletionItem[] = [
  {
    label: 'html5',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${1:Document}</title>\n</head>\n<body>\n\t${2:<!-- TODO: Add content -->}\n</body>\n</html>',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'HTML5模板',
    range: defaultRange,
  },
  {
    label: 'div',
    kind: Monaco.languages.CompletionItemKind.Snippet,
    insertText:
      '<div class="${1:class-name}">\n\t${2:<!-- TODO: Add content -->}\n</div>',
    insertTextRules:
      Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Div容器',
    range: defaultRange,
  },
];

// 获取对应语言的代码片段
export const getSnippetsByLanguage = (
  language: string,
): Monaco.languages.CompletionItem[] => {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return [...commonSnippets, ...reactSnippets, ...typescriptSnippets];
    case 'javascriptreact':
    case 'typescriptreact':
      return [...commonSnippets, ...reactSnippets, ...typescriptSnippets];
    case 'css':
    case 'scss':
    case 'less':
      return [...cssSnippets];
    case 'html':
      return [...htmlSnippets];
    default:
      return commonSnippets;
  }
};

// 创建自定义代码提示提供者
export const createCustomSuggestionsProvider = (
  language: string,
  customKeywords: string[] = [],
): any => {
  return {
    triggerCharacters: ['.', '@', '#', '(', '{', '['],
    provideCompletionItems: (
      model: Monaco.editor.ITextModel,
      position: Monaco.Position,
      context: Monaco.languages.CompletionContext,
      token: Monaco.CancellationToken,
    ): Monaco.languages.ProviderResult<Monaco.languages.CompletionList> => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: Monaco.languages.CompletionItem[] = [];

      // 添加自定义关键词
      customKeywords.forEach((keyword) => {
        suggestions.push({
          label: keyword,
          kind: Monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range,
        });
      });

      // 根据上下文提供智能提示
      const lineContent = model.getLineContent(position.lineNumber);
      const textUntilPosition = lineContent.substring(0, position.column - 1);

      // 检测是否在字符串中
      const inString = /['"`][^'"`]*$/.test(textUntilPosition);

      // 检测是否在注释中
      const inComment = /\/\/[^\n]*$|\/\*[\s\S]*$/.test(textUntilPosition);

      if (!inString && !inComment) {
        // 添加语言特定的建议
        switch (language) {
          case 'javascript':
          case 'typescript':
            suggestions.push(
              {
                label: 'console',
                kind: Monaco.languages.CompletionItemKind.Variable,
                insertText: 'console',
                range,
                documentation: 'Console对象',
              },
              {
                label: 'Array',
                kind: Monaco.languages.CompletionItemKind.Class,
                insertText: 'Array',
                range,
                documentation: 'Array构造函数',
              },
              {
                label: 'Object',
                kind: Monaco.languages.CompletionItemKind.Class,
                insertText: 'Object',
                range,
                documentation: 'Object构造函数',
              },
            );
            break;
          case 'css':
          case 'scss':
          case 'less':
            suggestions.push(
              {
                label: 'display',
                kind: Monaco.languages.CompletionItemKind.Property,
                insertText: 'display: ${1:block};',
                insertTextRules:
                  Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
                documentation: 'CSS display属性',
              },
              {
                label: 'margin',
                kind: Monaco.languages.CompletionItemKind.Property,
                insertText: 'margin: ${1:0};',
                insertTextRules:
                  Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
                documentation: 'CSS margin属性',
              },
            );
            break;
        }
      }

      // 过滤并规范化建议项，避免返回不合法的项导致 Monaco 控制台告警
      const sanitized = suggestions
        .filter((item) => {
          if (!item) return false;
          // 必须有 label
          if (
            typeof item.label !== 'string' &&
            typeof (item as any).label !== 'object'
          )
            return false;
          // 必须有插入文本或 textEdit
          if (!('insertText' in item) && !('textEdit' in item)) return false;
          return true;
        })
        .map((item) => {
          const it = { ...item } as Monaco.languages.CompletionItem;
          // 确保有 range，否则使用当前 position 生成的 range（上层已经生成 range 传入时会覆盖）
          if (!it.range) {
            it.range = range;
          }
          // 如果是 snippet 类型，确保 insertTextRules 正确设置
          if (
            it.kind === Monaco.languages.CompletionItemKind.Snippet &&
            !it.insertTextRules
          ) {
            it.insertTextRules =
              Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
          }
          return it;
        });

      return {
        suggestions: sanitized,
      };
    },
  };
};
