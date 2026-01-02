'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type React from 'react'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOntology } from '@/lib/ontology/context'
import {
  serializeToJSONLD,
  serializeToTurtle,
  serializeToOWLXML,
  parseFromJSONLD,
  parseFromOWLXML,
  parseFromTurtle,
  validateOntology,
} from '@/lib/ontology/serializers'
import { Download, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ImportExportDialog() {
  const { ontology, setOntology } = useOntology()
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<'jsonld' | 'turtle' | 'owlxml'>('jsonld')
  const [importData, setImportData] = useState('')
  const [importFormat, setImportFormat] = useState<'jsonld' | 'turtle' | 'owlxml' | 'auto'>('auto')
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleExport = () => {
    if (!ontology) {
      return
    }

    let content = ''
    let filename = ''
    let mimeType = ''

    switch (exportFormat) {
      case 'jsonld':
        content = serializeToJSONLD(ontology)
        filename = `${ontology.name.replace(/\s+/g, '_')}.jsonld`
        mimeType = 'application/ld+json'
        break
      case 'turtle':
        content = serializeToTurtle(ontology)
        filename = `${ontology.name.replace(/\s+/g, '_')}.ttl`
        mimeType = 'text/turtle'
        break
      case 'owlxml':
        content = serializeToOWLXML(ontology)
        filename = `${ontology.name.replace(/\s+/g, '_')}.owl`
        mimeType = 'application/rdf+xml'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: 'Export successful',
      description: `Ontology exported as ${filename}`,
    })
  }

  const handleImport = () => {
    try {
      let imported
      if (importFormat === 'auto') {
        const trimmed = importData.trim()
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          imported = parseFromJSONLD(importData)
        } else if (trimmed.startsWith('<?xml') || trimmed.startsWith('<rdf:RDF') || trimmed.startsWith('<RDF') || trimmed.startsWith('<Ontology')) {
          imported = parseFromOWLXML(importData)
        } else if (trimmed.includes('@prefix') || trimmed.includes('@base')) {
          imported = parseFromTurtle(importData)
        } else {
          throw new Error('Unable to detect format. Please select format manually.')
        }
      } else if (importFormat === 'owlxml') {
        imported = parseFromOWLXML(importData)
      } else if (importFormat === 'turtle') {
        imported = parseFromTurtle(importData)
      } else {
        imported = parseFromJSONLD(importData)
      }

      // Validate the imported ontology per W3C RDF/OWL standards
      const validationErrors = validateOntology(imported)
      if (validationErrors.length > 0) {
        console.warn('[Import] Validation warnings:', validationErrors)
        toast({
          title: 'Import successful with warnings',
          description: `Loaded ontology: ${imported.name}. Check console for ${validationErrors.length} validation warnings.`,
        })
      } else {
        toast({
          title: 'Import successful',
          description: `Loaded ontology: ${imported.name}`,
        })
      }

      setOntology(imported)
      setImportData('')
      setOpen(false)
    } catch (error) {
      console.error('[Import] Error:', error)
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Invalid format or non-compliant RDF/XML',
        variant: 'destructive',
      })
    }
  }

  const processFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension === 'owl' || extension === 'rdf' || extension === 'xml') {
      setImportFormat('owlxml')
    } else if (extension === 'ttl' || extension === 'turtle') {
      setImportFormat('turtle')
    } else if (extension === 'jsonld' || extension === 'json') {
      setImportFormat('jsonld')
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .ttl, .owl, or .jsonld file.',
        variant: 'destructive',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = event => {
      const content = event.target?.result as string
      setImportData(content)
      toast({
        title: 'File loaded',
        description: `${file.name} ready for import`,
      })
    }
    reader.onerror = () => {
      toast({
        title: 'Error reading file',
        description: 'There was an error reading the file content.',
        variant: 'destructive',
      })
    }
    reader.readAsText(file)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Import/Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import/Export Ontology</DialogTitle>
          <DialogDescription>Import or export your ontology in various formats</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={v => setExportFormat(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jsonld">JSON-LD</SelectItem>
                  <SelectItem value="turtle">Turtle (TTL)</SelectItem>
                  <SelectItem value="owlxml">OWL/XML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <Textarea
                value={
                  ontology
                    ? exportFormat === 'jsonld'
                      ? serializeToJSONLD(ontology)
                      : exportFormat === 'turtle'
                        ? serializeToTurtle(ontology)
                        : serializeToOWLXML(ontology)
                    : ''
                }
                readOnly
                className="h-64 font-mono text-xs"
              />
            </div>

            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Ontology
            </Button>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={cn(
                  'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                )}
              >
                <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                <p className="text-sm font-medium">Click or drag & drop to upload</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Accepts .ttl, .owl, .jsonld, .rdf, .xml
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".jsonld,.json,.ttl,.turtle,.owl,.rdf,.xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Import Format</Label>
              <Select value={importFormat} onValueChange={v => setImportFormat(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="jsonld">JSON-LD</SelectItem>
                  <SelectItem value="turtle">Turtle (TTL)</SelectItem>
                  <SelectItem value="owlxml">OWL/XML or RDF/XML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Or Paste Ontology Data</Label>
              <Textarea
                placeholder="Paste your JSON-LD, Turtle, or OWL/XML ontology here..."
                value={importData}
                onChange={e => setImportData(e.target.value)}
                className="h-64 font-mono text-xs"
              />
            </div>

            <Button onClick={handleImport} disabled={!importData} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Import Ontology
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
