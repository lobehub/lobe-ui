import { Component, type ReactNode } from 'react';

import { styles } from './style';

interface DemoErrorBoundaryProps {
  children: ReactNode;
  resetKey: string;
}

interface DemoErrorBoundaryState {
  error?: Error;
}

export class DemoErrorBoundary extends Component<DemoErrorBoundaryProps, DemoErrorBoundaryState> {
  state: DemoErrorBoundaryState = {};

  static getDerivedStateFromError(error: unknown): DemoErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  componentDidUpdate(previousProps: DemoErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: undefined });
    }
  }

  private retry = () => {
    this.setState({ error: undefined });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className={styles.error} role="alert">
        <strong>Unable to render this demo.</strong>
        <code>{error.message}</code>
        <button type="button" onClick={this.retry}>
          Retry demo
        </button>
      </div>
    );
  }
}
