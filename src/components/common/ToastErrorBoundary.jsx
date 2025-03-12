import React from 'react';

class ToastErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Toast Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silently fail toast rather than breaking the app
    }

    return this.props.children;
  }
}

export default ToastErrorBoundary; 