import { Component, type ReactNode } from 'react';
import { Container } from 'react-bootstrap';

interface Props{
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error capturado:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5 text-center">
          <h1>Algo salió mal</h1>
          <p>{this.state.error?.message}</p>
        </Container>
      );
    }

    return this.props.children;
  }
}