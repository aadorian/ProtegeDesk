"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { ImportExportDialog } from "./import-export-dialog"
import { NewEntityDialog } from "./new-entity-dialog"
import { ReasonerDialog } from "./reasoner-dialog"

export function OntologyHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">
            Protege<span className="text-primary">TS</span>
          </h1>
          <span className="text-sm text-muted-foreground">Ontology Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <NewEntityDialog />
          <ReasonerDialog />
          <ImportExportDialog />
          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </header>
  )
}
