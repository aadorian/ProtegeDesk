import { fireEvent, render, screen } from '@testing-library/react'
import { ErrorBoundary, OntologyErrorFallback } from '@/components/error-boundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Boundary test error')
  }

  return <div>Editor Content</div>
}

describe('ErrorBoundary', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    consoleErrorSpy.mockClear()
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Editor Content')).toBeInTheDocument()
  })

  it('renders default fallback UI when an error is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Boundary test error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback content</div>}>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom fallback content')).toBeInTheDocument()
  })

  it('passes retry and error props to a provided OntologyErrorFallback element', () => {
    const App = ({ shouldThrow }: { shouldThrow: boolean }) => (
      <ErrorBoundary fallback={<OntologyErrorFallback />}>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    )

    const { rerender } = render(<App shouldThrow />)

    expect(screen.getByText('Boundary test error')).toBeInTheDocument()

    rerender(<App shouldThrow={false} />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    expect(screen.getByText('Editor Content')).toBeInTheDocument()
  })

  it('resets boundary when retry is clicked and children stop throwing', () => {
    const App = ({ shouldThrow }: { shouldThrow: boolean }) => (
      <ErrorBoundary>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    )

    const { rerender } = render(<App shouldThrow />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    rerender(<App shouldThrow={false} />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    expect(screen.getByText('Editor Content')).toBeInTheDocument()
  })
})
