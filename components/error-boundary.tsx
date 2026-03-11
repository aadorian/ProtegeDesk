'use client'

import {cloneElement,Component,isValidElement,type ErrorInfo,type ReactElement,type ReactNode,} from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (
          isValidElement<Partial<OntologyErrorFallbackProps>>(this.props.fallback) &&
          typeof this.props.fallback.type !== 'string'
        ) {
          return cloneElement(this.props.fallback as ReactElement<Partial<OntologyErrorFallbackProps>>, {
            error: this.state.error,
            onRetry: this.handleReset,
          })
        }

        return this.props.fallback
      }

      return <OntologyErrorFallback error={this.state.error} onRetry={this.handleReset} />
    }

    return this.props.children
  }
}

interface OntologyErrorFallbackProps {
  error?: Error
  onRetry?: () => void
}

export function OntologyErrorFallback({ error, onRetry }: OntologyErrorFallbackProps) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Something went wrong
          </CardTitle>
          <CardDescription>
            The ontology editor hit an unexpected error. You can try again without refreshing the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-mono break-all text-muted-foreground">
            {error?.message ?? 'Unexpected runtime error'}
          </p>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={onRetry}>
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
