/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Component } from "react";
import { Alert, Button } from "react-bootstrap";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="text-center">
          <p>Terjadi kesalahan pada aplikasi.</p>
          <Button variant="outline-danger" onClick={this.handleReload}>
            Muat Ulang
          </Button>
        </Alert>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;