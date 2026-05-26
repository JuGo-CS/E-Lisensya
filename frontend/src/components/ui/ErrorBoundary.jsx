import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for now
    console.error('Uncaught error in React tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold">An unexpected error occurred</h2>
          <pre className="mt-4 whitespace-pre-wrap text-sm text-red-700">{String(this.state.error)}</pre>
          <div className="mt-4">
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-3 py-1 rounded">Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
