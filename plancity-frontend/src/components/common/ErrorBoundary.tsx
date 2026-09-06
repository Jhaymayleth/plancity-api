import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo,
  ): void {
    console.error(
      "Error capturado por ErrorBoundary:",
      error,
      errorInfo,
    );
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main>
          <h1>Algo salió mal</h1>

          <p>
            Ocurrió un error inesperado. Intenta
            nuevamente.
          </p>

          <button
            type="button"
            onClick={this.handleReset}
          >
            Intentar nuevamente
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}