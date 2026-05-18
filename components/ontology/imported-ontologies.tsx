'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useOntology } from '@/lib/ontology/context'
import { Link, Plus, Trash2 } from 'lucide-react'

export function ImportedOntologies() {
  const { ontology, addImport, removeImport } = useOntology()
  const [newImportIri, setNewImportIri] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  if (!ontology) {
    return null
  }

  const handleAddImport = (e: React.FormEvent) => {
    e.preventDefault()
    if (newImportIri.trim()) {
      addImport(newImportIri.trim())
      setNewImportIri('')
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">Imported Ontologies</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsAdding(!isAdding)}
          title="Add import"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Link className="text-primary h-4 w-4" />
            owl:imports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isAdding && (
            <form onSubmit={handleAddImport} className="flex gap-2">
              <Input
                size={1}
                className="h-8 text-xs flex-1"
                placeholder="Enter Ontology IRI"
                value={newImportIri}
                onChange={(e) => setNewImportIri(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="sm" className="h-8 px-2 text-xs">
                Add
              </Button>
            </form>
          )}

          {ontology.imports.length === 0 ? (
            <div className="text-muted-foreground text-xs text-center py-2">
              No imported ontologies.
            </div>
          ) : (
            <ul className="space-y-2">
              {ontology.imports.map((iri) => (
                <li
                  key={iri}
                  className="flex items-center justify-between gap-2 group text-xs border rounded-md p-2 bg-muted/30"
                >
                  <span className="font-mono truncate flex-1" title={iri}>
                    {iri}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-destructive"
                    onClick={() => removeImport(iri)}
                    title="Remove import"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
