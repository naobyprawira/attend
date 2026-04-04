"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl opacity-30">error</span>
            <p className="text-sm">Something went wrong. Please refresh the page.</p>
            <Button
              onClick={() => this.setState({ hasError: false, message: "" })}
              variant="ghost"
              size="sm"
              className="text-primary"
            >
              Try again
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
