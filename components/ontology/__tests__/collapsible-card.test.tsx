import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CollapsibleCard } from '../collapsible-card'

// Helper function the component reads localStorage inside a setTimeout(0),
// so we need fake timers to flush that on demand.
function flushMount() {
  act(() => jest.runAllTimers())
}

function renderCard(props: Partial<React.ComponentProps<typeof CollapsibleCard>> = {}) {
  return render(
    <CollapsibleCard title="Test Section" storageKey="test-key" {...props}>
      <p>Card body content</p>
    </CollapsibleCard>
  )
}

function getContentWrapper() {
  return screen.getByText('Card body content').closest('.overflow-hidden')!.parentElement!
}

describe('CollapsibleCard', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders title and children', () => {
    renderCard()

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('Card body content')).toBeInTheDocument()
  })

  it('shows count badge when count is provided', () => {
    renderCard({ count: 5 })
    expect(screen.getByText('(5)')).toBeInTheDocument()
  })

  it('hides count badge when count is zero or undefined', () => {
    const { rerender } = render(
      <CollapsibleCard title="Test Section" storageKey="test-key" count={0}>
        <p>Card body content</p>
      </CollapsibleCard>
    )

    expect(screen.queryByText('(0)')).not.toBeInTheDocument()

    rerender(
      <CollapsibleCard title="Test Section" storageKey="test-key">
        <p>Card body content</p>
      </CollapsibleCard>
    )

    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument()
  })

  it('is expanded by default', () => {
    renderCard()
    expect(getContentWrapper()).toHaveClass('opacity-100')
  })

  it('starts collapsed when defaultOpen is false', () => {
    renderCard({ defaultOpen: false })
    expect(getContentWrapper()).toHaveClass('opacity-0')
  })

  it('collapses and expands when the header is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderCard()
    flushMount()

    const header = screen.getByText('Test Section').closest('[class*="cursor-pointer"]')!

    await user.click(header)
    expect(getContentWrapper()).toHaveClass('opacity-0')

    await user.click(header)
    expect(getContentWrapper()).toHaveClass('opacity-100')
  })

  it('rotates the chevron icon when collapsed', () => {
    renderCard({ defaultOpen: false })

    const chevron = document.querySelector('svg')!
    expect(chevron.getAttribute('class')).toContain('-rotate-90')
  })

  describe('localStorage persistence', () => {
    it('saves collapsed state to localStorage on toggle', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      renderCard({ storageKey: 'my-section' })
      flushMount()

      const header = screen.getByText('Test Section').closest('[class*="cursor-pointer"]')!
      await user.click(header)

      expect(localStorage.getItem('details-section-my-section')).toBe('false')
    })

    it('restores state from localStorage on mount', () => {
      localStorage.setItem('details-section-test-key', JSON.stringify(false))

      renderCard({ defaultOpen: true })
      flushMount()

      // defaultOpen is true but localStorage says false → should be collapsed
      expect(getContentWrapper()).toHaveClass('opacity-0')
    })

    it('falls back to defaultOpen when nothing is saved', () => {
      renderCard({ defaultOpen: false })
      flushMount()

      expect(getContentWrapper()).toHaveClass('opacity-0')
    })
  })
})
