import React from "react";

// Catches WebGL context-creation failures (e.g. when the browser hits its
// context limit or the GPU is unavailable) so a failing <Canvas> degrades
// gracefully instead of crashing the whole app.
export default class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error("Renderer initialization failed:", error?.message || error);
  }
  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}