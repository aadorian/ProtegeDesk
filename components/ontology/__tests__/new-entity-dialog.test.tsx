import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewEntityDialog } from '../new-entity-dialog'
import { OntologyProvider } from '@/lib/ontology/context'
import type { Ontology } from '@/lib/ontology/types'
import { useEffect } from 'react'

// Mock the toast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Helper component to set ontology in tests
function TestWrapper({
  children,
  ontology,
}: {
  children: React.ReactNode
  ontology?: Partial<Ontology>
}) {
  const defaultOntology: Ontology = {
    id: 'test-ontology',
    name: 'Test Ontology',
    version: '1.0.0',
    classes: new Map(),
    properties: new Map(),
    individuals: new Map(),
    imports: [],
    annotations: [],
    ...ontology,
  }

  return (
    <OntologyProviderWithSetup ontology={defaultOntology}>{children}</OntologyProviderWithSetup>
  )
}

// Component that sets ontology on mount
function OntologyProviderWithSetup({
  children,
  ontology,
}: {
  children: React.ReactNode
  ontology: Ontology
}) {
  const OntologyContext = require('@/lib/ontology/context')
  const { useOntology } = OntologyContext

  function OntologySetup({ children }: { children: React.ReactNode }) {
    const { setOntology } = useOntology()

    useEffect(() => {
      setOntology(ontology)
    }, [])

    return <>{children}</>
  }

  return (
    <OntologyProvider>
      <OntologySetup>{children}</OntologySetup>
    </OntologyProvider>
  )
}

describe('NewEntityDialog - Validation Tests', () => {
  beforeEach(() => {
    mockToast.mockClear()
  })

  const renderWithProvider = (ui: React.ReactElement, ontology?: Partial<Ontology>) => {
    return render(<TestWrapper ontology={ontology}>{ui}</TestWrapper>)
  }

  describe('IRI Format Validation', () => {
    it('accepts valid simple identifiers', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'Person')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Class created',
          description: 'Created class: Person Class',
        })
      )
    })

    it('accepts valid identifiers with underscores', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'Person_Class')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Class created',
        })
      )
    })

    it('accepts valid identifiers with hyphens', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'Person-Class')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Class created',
        })
      )
    })

    it('accepts valid full IRI with http', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'http://example.org/Person')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Class created',
        })
      )
    })

    it('accepts valid full IRI with https', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'https://example.org/Person')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Class created',
        })
      )
    })

    it('rejects IRI starting with number', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, '123Person')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Invalid ID format',
          description: 'ID must be a valid IRI or a simple identifier',
          variant: 'destructive',
        })
      )
    })

    it('rejects IRI with spaces', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'Person Class')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Invalid ID format',
          variant: 'destructive',
        })
      )
    })

    it('rejects IRI with special characters', async () => {
      renderWithProvider(<NewEntityDialog />)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'Person@Class')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Invalid ID format',
          variant: 'destructive',
        })
      )
    })
  })

  describe('Duplicate ID Validation', () => {
    it('detects duplicate class ID', async () => {
      const ontology: Partial<Ontology> = {
        classes: new Map([
          [
            'Person',
            {
              id: 'Person',
              name: 'Person',
              label: 'Person',
              description: '',
              superClasses: [],
              properties: [],
              equivalentTo: [],
              disjointWith: [],
              annotations: [],
            },
          ],
        ]),
      }

      renderWithProvider(<NewEntityDialog />, ontology)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'Person')
      await userEvent.type(nameInput, 'Person Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Duplicate ID',
          description: 'An entity with ID "Person" already exists in the ontology',
          variant: 'destructive',
        })
      )
    })

    it('detects duplicate property ID', async () => {
      const ontology: Partial<Ontology> = {
        properties: new Map([
          [
            'hasName',
            {
              id: 'hasName',
              name: 'hasName',
              label: 'has name',
              description: '',
              type: 'DataProperty',
              domain: [],
              range: [],
              superProperties: [],
              characteristics: [],
              annotations: [],
            },
          ],
        ]),
      }

      renderWithProvider(<NewEntityDialog />, ontology)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'hasName')
      await userEvent.type(nameInput, 'Has Name')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Duplicate ID',
          description: 'An entity with ID "hasName" already exists in the ontology',
          variant: 'destructive',
        })
      )
    })

    it('detects duplicate individual ID', async () => {
      const ontology: Partial<Ontology> = {
        individuals: new Map([
          [
            'john',
            {
              id: 'john',
              name: 'john',
              label: 'John',
              types: [],
              propertyAssertions: [],
              sameAs: [],
              differentFrom: [],
              annotations: [],
            },
          ],
        ]),
      }

      renderWithProvider(<NewEntityDialog />, ontology)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'john')
      await userEvent.type(nameInput, 'John')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Duplicate ID',
          description: 'An entity with ID "john" already exists in the ontology',
          variant: 'destructive',
        })
      )
    })

    it('allows creating entity with unique ID', async () => {
      const ontology: Partial<Ontology> = {
        classes: new Map([
          [
            'Person',
            {
              id: 'Person',
              name: 'Person',
              label: 'Person',
              description: '',
              superClasses: [],
              properties: [],
              equivalentTo: [],
              disjointWith: [],
              annotations: [],
            },
          ],
        ]),
      }

      renderWithProvider(<NewEntityDialog />, ontology)
      await userEvent.click(screen.getByRole('button', { name: /new entity/i }))

      const idInput = screen.getByLabelText(/ID/i)
      const nameInput = screen.getByLabelText(/Name/i)

      await userEvent.type(idInput, 'Animal')
      await userEvent.type(nameInput, 'Animal Class')

      const createButton = screen.getByRole('button', { name: /create class/i })
      await userEvent.click(createButton)

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Class created',
          description: 'Created class: Animal Class',
        })
      )
    })
  })
})
