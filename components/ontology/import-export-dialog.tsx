"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOntology } from "@/lib/ontology/context"
import {
  serializeToJSONLD,
  serializeToTurtle,
  serializeToOWLXML,
  parseFromJSONLD,
  parseFromOWLXML,
  parseFromTurtle,
} from "@/lib/ontology/serializers"
import { Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImportExportDialog() {
  const { ontology, setOntology } = useOntology()
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<"jsonld" | "turtle" | "owlxml">("jsonld")
  const [importData, setImportData] = useState("")
  const [importFormat, setImportFormat] = useState<"jsonld" | "turtle" | "owlxml" | "auto">("auto")
  const [open, setOpen] = useState(false)

  const handleExport = () => {
    if (!ontology) return

    let content = ""
    let filename = ""
    let mimeType = ""

    switch (exportFormat) {
      case "jsonld":
        content = serializeToJSONLD(ontology)
        filename = `${ontology.name.replace(/\s+/g, "_")}.jsonld`
        mimeType = "application/ld+json"
        break
      case "turtle":
        content = serializeToTurtle(ontology)
        filename = `${ontology.name.replace(/\s+/g, "_")}.ttl`
        mimeType = "text/turtle"
        break
      case "owlxml":
        content = serializeToOWLXML(ontology)
        filename = `${ontology.name.replace(/\s+/g, "_")}.owl`
        mimeType = "application/rdf+xml"
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `Ontology exported as ${filename}`,
    })
  }

  const handleImport = () => {
    try {
      let imported
      if (importFormat === "auto") {
        const trimmed = importData.trim()
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          imported = parseFromJSONLD(importData)
        } else if (trimmed.startsWith("<?xml") || trimmed.startsWith("<rdf:RDF")) {
          imported = parseFromOWLXML(importData)
        } else if (trimmed.includes("@prefix") || trimmed.includes("@base")) {
          imported = parseFromTurtle(importData)
        } else {
          throw new Error("Unable to detect format. Please select format manually.")
        }
      } else if (importFormat === "owlxml") {
        imported = parseFromOWLXML(importData)
      } else if (importFormat === "turtle") {
        imported = parseFromTurtle(importData)
      } else {
        imported = parseFromJSONLD(importData)
      }

      setOntology(imported)
      setImportData("")
      setOpen(false)
      toast({
        title: "Import successful",
        description: `Loaded ontology: ${imported.name}`,
      })
    } catch (error) {
      console.error("[v0] Import error:", error)
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Invalid format",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split(".").pop()?.toLowerCase()
    if (extension === "owl" || extension === "rdf" || extension === "xml") {
      setImportFormat("owlxml")
    } else if (extension === "ttl" || extension === "turtle") {
      setImportFormat("turtle")
    } else if (extension === "jsonld" || extension === "json") {
      setImportFormat("jsonld")
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setImportData(content)
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Upload className="h-4 w-4 mr-2" />
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
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
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
                    ? exportFormat === "jsonld"
                      ? serializeToJSONLD(ontology)
                      : exportFormat === "turtle"
                        ? serializeToTurtle(ontology)
                        : serializeToOWLXML(ontology)
                    : ""
                }
                readOnly
                className="font-mono text-xs h-64"
              />
            </div>

            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Ontology
            </Button>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload File</Label>
              <Input
                type="file"
                accept=".jsonld,.json,.ttl,.turtle,.owl,.rdf,.xml"
                onChange={handleFileUpload}
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label>Import Format</Label>
              <Select value={importFormat} onValueChange={(v) => setImportFormat(v as any)}>
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
                onChange={(e) => setImportData(e.target.value)}
                className="font-mono text-xs h-64"
              />
            </div>

            <Button onClick={handleImport} disabled={!importData} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Import Ontology
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
