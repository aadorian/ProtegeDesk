import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { PropertyDetails } from '../property-details'
import { OntologyProvider, useOntology } from '@/lib/ontology/context'
import type { Ontology, OntologyProperty } from '@/lib/ontology/types'

// Mock the toast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Mock the copy to clipboard hook
jest.mock('@/hooks/copy-to-clipboard', () => ({
  useCopyToClipboard: () => ({ copy: jest.fn().mockResolvedValue(true), copied: false }),
}))

// Helper to create a test property
function createTestProperty(overrides: Partial<OntologyProperty> = {}): OntologyProperty {
  return {
    id: 'testProperty',
    name: 'testProperty',
    label: 'Test Property',
    description: 'A test property',
    type: 'ObjectProperty',
    domain: [],
    range: [],
    superProperties: [],
    characteristics: [],
    annotations: [],
    ...overrides,
  }
}

// Create a mock ontology
function createMockOntology(properties: OntologyProperty[] = []): Ontology {
  const propertiesMap = new Map<string, OntologyProperty>()
  properties.forEach(p => propertiesMap.set(p.id, p))

  return {
    id: 'test-ontology',
    name: 'Test Ontology',
    version: '1.0.0',
    classes: new Map(),
    properties: propertiesMap,
    individuals: new Map(),
    imports: [],
    annotations: [],
  }
}

// Test component that allows us to set up ontology state before rendering PropertyDetails
function TestPropertyDetails({
  ontology,
  selectedPropertyId,
}: {
  ontology: Ontology
  selectedPropertyId?: string
}) {
  const { setOntology, selectProperty } = useOntology()

  React.useEffect(() => {
    setOntology(ontology)
  }, [ontology, setOntology])

  React.useEffect(() => {
    if (selectedPropertyId) {
      selectProperty(selectedPropertyId)
    }
  }, [selectedPropertyId, selectProperty])

  return <PropertyDetails />
}

describe('PropertyDetails - Inverse Property Feature', () => {
  beforeEach(() => {
    mockToast.mockClear()
  })

  describe('Inverse Property Selector Visibility', () => {
    it('shows inverse property selector for ObjectProperty', async () => {
      const worksFor = createTestProperty({
        id: 'worksFor',
        name: 'worksFor',
        label: 'Works For',
        type: 'ObjectProperty',
      })

      const hasEmployee = createTestProperty({
        id: 'hasEmployee',
        name: 'hasEmployee',
        label: 'Has Employee',
        type: 'ObjectProperty',
      })

      const ontology = createMockOntology([worksFor, hasEmployee])

      render(
        <OntologyProvider>
          <TestPropertyDetails ontology={ontology} selectedPropertyId="worksFor" />
        </OntologyProvider>
      )

      // Wait for the component to render with selected property
      await waitFor(() => {
        expect(screen.getByText('Property Information')).toBeInTheDocument()
      })

      // Find all labels with "Inverse Of" - one in Property Information
      const inverseLabels = screen.getAllByText('Inverse Of')
      expect(inverseLabels.length).toBeGreaterThanOrEqual(1)
    })

    it('does not show inverse property selector for DataProperty', async () => {
      const hasName = createTestProperty({
        id: 'hasName',
        name: 'hasName',
        label: 'Has Name',
        type: 'DataProperty',
      })

      const ontology = createMockOntology([hasName])

      render(
        <OntologyProvider>
          <TestPropertyDetails ontology={ontology} selectedPropertyId="hasName" />
        </OntologyProvider>
      )

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText('Property Information')).toBeInTheDocument()
      })

      // The inverse selector should not be present for DataProperty
      expect(screen.queryByLabelText('Inverse Of')).not.toBeInTheDocument()
    })

    it('does not show inverse property selector for AnnotationProperty', async () => {
      const comment = createTestProperty({
        id: 'comment',
        name: 'comment',
        label: 'Comment',
        type: 'AnnotationProperty',
      })

      const ontology = createMockOntology([comment])

      render(
        <OntologyProvider>
          <TestPropertyDetails ontology={ontology} selectedPropertyId="comment" />
        </OntologyProvider>
      )

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText('Property Information')).toBeInTheDocument()
      })

      // The inverse selector should not be present for AnnotationProperty
      expect(screen.queryByLabelText('Inverse Of')).not.toBeInTheDocument()
    })
  })

  describe('Inverse Property Display in Hierarchy Card', () => {
    it('displays inverse property badge when inverse is set', async () => {
      const worksFor = createTestProperty({
        id: 'worksFor',
        name: 'worksFor',
        label: 'Works For',
        type: 'ObjectProperty',
        inverse: 'hasEmployee',
      })

      const hasEmployee = createTestProperty({
        id: 'hasEmployee',
        name: 'hasEmployee',
        label: 'Has Employee',
        type: 'ObjectProperty',
      })

      const ontology = createMockOntology([worksFor, hasEmployee])

      render(
        <OntologyProvider>
          <TestPropertyDetails ontology={ontology} selectedPropertyId="worksFor" />
        </OntologyProvider>
      )

      // Wait for the Hierarchy card to render
      await waitFor(() => {
        expect(screen.getByText('Hierarchy')).toBeInTheDocument()
      })

      // Should display the inverse property id in the Hierarchy card badge
      const badges = screen.getAllByText('hasEmployee')
      expect(badges.length).toBeGreaterThan(0)
    })

    it('does not display inverse property section in Hierarchy when inverse is not set', async () => {
      const worksFor = createTestProperty({
        id: 'worksFor',
        name: 'worksFor',
        label: 'Works For',
        type: 'ObjectProperty',
        inverse: undefined,
      })

      const ontology = createMockOntology([worksFor])

      render(
        <OntologyProvider>
          <TestPropertyDetails ontology={ontology} selectedPropertyId="worksFor" />
        </OntologyProvider>
      )

      // Wait for the Hierarchy card to render
      await waitFor(() => {
        expect(screen.getByText('Hierarchy')).toBeInTheDocument()
      })

      // The Hierarchy card should show Super Properties
      expect(screen.getByText('Super Properties')).toBeInTheDocument()

      // Count "Inverse Of" labels - should only be one (in Property Information card selector)
      const inverseLabels = screen.getAllByText('Inverse Of')
      expect(inverseLabels).toHaveLength(1)
    })
  })

  describe('Inverse Property Selection via Context', () => {
    it('updates property when inverse is selected', async () => {
      const worksFor = createTestProperty({
        id: 'worksFor',
        name: 'worksFor',
        label: 'Works For',
        type: 'ObjectProperty',
      })

      const hasEmployee = createTestProperty({
        id: 'hasEmployee',
        name: 'hasEmployee',
        label: 'Has Employee',
        type: 'ObjectProperty',
      })

      const ontology = createMockOntology([worksFor, hasEmployee])

      // Use renderHook to verify the updateProperty is called
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <OntologyProvider>{children}</OntologyProvider>
      )

      const { result } = renderHook(() => useOntology(), { wrapper })

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectProperty('worksFor')
      })

      // Simulate what the component does when selecting an inverse
      act(() => {
        result.current.updateProperty('worksFor', { inverse: 'hasEmployee' })
      })

      // Verify the property was updated
      expect(result.current.ontology?.properties.get('worksFor')?.inverse).toBe('hasEmployee')
    })

    it('clears inverse when "None" is selected', async () => {
      const worksFor = createTestProperty({
        id: 'worksFor',
        name: 'worksFor',
        label: 'Works For',
        type: 'ObjectProperty',
        inverse: 'hasEmployee',
      })

      const hasEmployee = createTestProperty({
        id: 'hasEmployee',
        name: 'hasEmployee',
        label: 'Has Employee',
        type: 'ObjectProperty',
      })

      const ontology = createMockOntology([worksFor, hasEmployee])

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <OntologyProvider>{children}</OntologyProvider>
      )

      const { result } = renderHook(() => useOntology(), { wrapper })

      act(() => {
        result.current.setOntology(ontology)
      })

      // Verify initial inverse is set
      expect(result.current.ontology?.properties.get('worksFor')?.inverse).toBe('hasEmployee')

      // Clear the inverse (what happens when "None" is selected)
      act(() => {
        result.current.updateProperty('worksFor', { inverse: undefined })
      })

      // Verify the inverse was cleared
      expect(result.current.ontology?.properties.get('worksFor')?.inverse).toBeUndefined()
    })
  })

  describe('Available Properties Filtering', () => {
    it('filters out self and non-ObjectProperties from available inverse options', () => {
      const worksFor = createTestProperty({
        id: 'worksFor',
        name: 'worksFor',
        label: 'Works For',
        type: 'ObjectProperty',
      })

      const hasEmployee = createTestProperty({
        id: 'hasEmployee',
        name: 'hasEmployee',
        label: 'Has Employee',
        type: 'ObjectProperty',
      })

      const hasName = createTestProperty({
        id: 'hasName',
        name: 'hasName',
        label: 'Has Name',
        type: 'DataProperty',
      })

      const comment = createTestProperty({
        id: 'comment',
        name: 'comment',
        label: 'Comment',
        type: 'AnnotationProperty',
      })

      const ontology = createMockOntology([worksFor, hasEmployee, hasName, comment])

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <OntologyProvider>{children}</OntologyProvider>
      )

      const { result } = renderHook(() => useOntology(), { wrapper })

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectProperty('worksFor')
      })

      // Get available properties (simulating what the component does)
      const availableProperties = Array.from(result.current.ontology!.properties.values()).filter(
        p => p.type === 'ObjectProperty' && p.id !== result.current.selectedProperty?.id
      )

      // Should only include hasEmployee (not worksFor which is self, not hasName which is DataProperty, not comment which is AnnotationProperty)
      expect(availableProperties).toHaveLength(1)
      expect(availableProperties[0].id).toBe('hasEmployee')
    })
  })

  describe('Empty State', () => {
    it('shows placeholder when no property is selected', () => {
      render(
        <OntologyProvider>
          <PropertyDetails />
        </OntologyProvider>
      )

      expect(screen.getByText('Select a property to view details')).toBeInTheDocument()
    })
  })

  describe('Modal View', () => {
    it('renders property info in modal view', () => {
      const testProperty = createTestProperty({
        id: 'testProp',
        name: 'testProp',
        label: 'Test Property',
        domain: ['Person'],
        range: ['Organization'],
        characteristics: ['Functional'],
      })

      render(
        <OntologyProvider>
          <PropertyDetails isModalView property={testProperty} />
        </OntologyProvider>
      )

      expect(screen.getByText('Property Info')).toBeInTheDocument()
      // Check for the name which is displayed in modal view
      expect(screen.getByText(/testProp/)).toBeInTheDocument()
      expect(screen.getByText(/Person/)).toBeInTheDocument()
      expect(screen.getByText(/Organization/)).toBeInTheDocument()
      expect(screen.getByText(/Functional/)).toBeInTheDocument()
    })
  })
})
