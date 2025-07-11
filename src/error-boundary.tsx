import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * Generic React error boundary used to gracefully handle runtime errors.
 *
 * When an error occurs in any descendant component tree, the boundary renders
 * a fallback UI so the entire application does not unmount. Users can refresh
 * the page, or developers can wire the **Reload** button to a custom recovery
 * routine (e.g. clearing state, reporting error).  
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console -- Centralised error logging hook.
    console.error('[ErrorBoundary] Uncaught error:', error, info)
    // TODO: send error + info to monitoring service (Sentry, LogRocket, etc.)
  }

  private handleReload = () => {
    // Simple recovery: reload full page. Could also attempt soft-reset here.
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center space-y-4 px-4 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong.</h1>
          <p className="max-w-md text-muted-foreground">
            An unexpected error occurred. Our team has been notified and we are
            working on a fix. You can try refreshing the page.
          </p>
          <Button onClick={this.handleReload}>Reload</Button>
        </div>
      )
    }

    return this.props.children
  }
}
