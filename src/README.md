# Monaco Editor 优化版

## 概述

这是对原有MonacoEditor组件的全面优化版本，修复了多个bug并增强了代码提示功能。

## 主要改进

### 1. Bug修复
- ✅ 修复了语言切换时错误更新值的问题
- ✅ 添加了错误边界处理，CDN加载失败时有降级方案
- ✅ 修复了全屏模式下事件监听未正确清理的问题
- ✅ 改进了Monaco Editor实例的销毁逻辑
- ✅ 添加了ResizeObserver处理容器大小变化

### 2. 性能优化
- ✅ 使用Function Component + Hooks替代Class Component
- ✅ 优化了防抖处理，减少不必要的更新
- ✅ 添加了ResizeObserver避免频繁的重绘
- ✅ 改进了组件卸载时的资源清理

### 3. 代码提示功能增强
- ✅ 添加了丰富的代码片段支持
- ✅ 支持自定义代码提示提供者
- ✅ 按语言提供特定的代码片段
- ✅ 支持TypeScript/JavaScript智能提示

### 4. 新增功能
- ✅ 错误边界组件，防止编辑器崩溃影响整个应用
- ✅ 自定义Hook简化编辑器使用
- ✅ 主题切换支持
- ✅ 代码验证和错误提示
- ✅ 全屏模式优化

## 使用方法

### 基础使用

```tsx
import MonacoEditor from './index';

function MyComponent() {
  const [code, setCode] = useState('');

  return (
    <MonacoEditor
      height={400}
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={setCode}
    />
  );
}
```

### 高级使用

```tsx
import MonacoEditor, { 
  useMonacoEditor, 
  getSnippetsByLanguage,
  createCustomSuggestionsProvider 
} from './index';

function AdvancedEditor() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  // 获取对应语言的代码片段
  const snippets = getSnippetsByLanguage(language);

  // 创建自定义代码提示
  const customSuggestions = createCustomSuggestionsProvider('javascript', [
    'React', 'useState', 'useEffect', 'useCallback', 'useMemo'
  ]);

  return (
    <MonacoEditor
      height={400}
      language={language}
      theme="vs-dark"
      value={code}
      onChange={setCode}
      options={{
        fontSize: 14,
        minimap: { enabled: true },
        wordWrap: 'on',
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
      snippets={snippets}
      customSuggestions={customSuggestions}
      enableValidation={true}
      onValidate={(markers) => {
        console.log('Validation markers:', markers);
      }}
    />
  );
}
```

### 使用自定义Hook

```tsx
import { useMonacoEditor, useMonacoValidation, useMonacoTheme } from './hooks/useMonacoEditor';

function HookExample() {
  const { state, actions } = useMonacoEditor({
    value: '',
    language: 'typescript',
    theme: 'vs-dark',
    fontSize: 14,
  });

  const { theme, setTheme, availableThemes } = useMonacoTheme();
  const { errorCount, warningCount } = useMonacoValidation();

  return (
    <div>
      <div>
        <button onClick={() => actions.formatCode()}>格式化</button>
        <button onClick={() => actions.undo()}>撤销</button>
        <button onClick={() => actions.redo()}>重做</button>
      </div>
      
      <MonacoEditor
        height={400}
        language={state.language}
        theme={state.theme}
        value={state.value}
        onChange={actions.setValue}
      />
    </div>
  );
}
```

## API文档

### MonacoEditor Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `value` | `string` | - | 编辑器内容 |
| `language` | `string` | 'javascript' | 语言类型 |
| `theme` | `string` | 'vs' | 主题 |
| `height` | `number` | 300 | 编辑器高度 |
| `width` | `number` | - | 编辑器宽度 |
| `options` | `IEditorOptions` | - | Monaco编辑器选项 |
| `onChange` | `(value: string) => void` | - | 内容变化回调 |
| `onValidate` | `(markers: IMarker[]) => void` | - | 验证回调 |
| `snippets` | `CompletionItem[]` | [] | 代码片段 |
| `customSuggestions` | `object` | - | 自定义代码提示 |
| `enableValidation` | `boolean` | true | 是否启用验证 |
| `enableEmmet` | `boolean` | false | 是否启用Emmet |

### 自定义Hook

#### useMonacoEditor

提供编辑器状态管理和操作方法。

```tsx
const { state, actions, refs } = useMonacoEditor(initialState);
```

#### useMonacoValidation

提供代码验证功能。

```tsx
const { markers, errorCount, warningCount } = useMonacoValidation(onValidate);
```

#### useMonacoTheme

提供主题管理功能。

```tsx
const { theme, setTheme, availableThemes } = useMonacoTheme();
```

## 代码片段支持

### 支持的代码片段

#### JavaScript/TypeScript
- `console.log` - 控制台输出
- `function` - 函数定义
- `arrow function` - 箭头函数
- `if` / `ifelse` - 条件语句
- `for` / `forof` - 循环语句
- `try` - 异常处理

#### React
- `useState` - useState Hook
- `useEffect` - useEffect Hook
- `useCallback` - useCallback Hook
- `useMemo` - useMemo Hook
- `FC` - Function Component模板

#### CSS
- `flex` - Flexbox布局
- `grid` - Grid布局
- `media` - 媒体查询

#### HTML
- `html5` - HTML5模板
- `div` - Div容器

## 主题支持

支持以下主题：
- `vs` - 浅色主题
- `vs-dark` - 深色主题
- `hc-black` - 高对比度黑色
- `active4d` - Active4D
- `monokai` - Monokai
- `solarized-dark` - Solarized Dark
- `solarized-light` - Solarized Light

## 错误处理

组件内置错误边界，当编辑器加载失败时会显示友好的错误提示，并提供刷新页面的选项。

## 迁移指南

从旧版本迁移到新版本：

1. 将导入路径从 `./MonacoEditor` 改为 `./index-new`
2. 如果使用Class Component，建议改为Function Component
3. 利用新的Hooks简化状态管理
4. 添加代码片段和自定义提示功能

## 注意事项

1. 确保CDN地址可访问，否则编辑器可能加载失败
2. 大文件编辑时建议关闭minimap以提高性能
3. 自定义代码提示时注意不要与内置提示冲突