import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class MonacoEditorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Monaco Editor Error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          border: '1px solid #ff4d4f',
          borderRadius: '4px',
          backgroundColor: '#fff2f0',
          color: '#ff4d4f',
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px',
        }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0' }}>编辑器加载失败</h3>
            <p style={{ margin: 0 }}>
              {this.state.error?.message || '未知错误，请刷新页面重试'}
            </p>
            <button
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MonacoEditorErrorBoundary;