import * as React from 'react';

interface OwnProps
  extends React.PropsWithChildren<{ fallback: React.ReactNode }> {}

export class ErrorBoundary extends React.Component<
  OwnProps,
  { hasError: boolean }
> {
  constructor(props: OwnProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
