"use client"

import { useState } from "react"
import { useOntology } from "@/lib/ontology/context"
import { runReasoner, type ReasoningResult } from "@/lib/ontology/reasoner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, CheckCircle2, XCircle, AlertTriangle, Clock, Loader2 } from "lucide-react"

export function ReasonerDialog() {
  const { ontology } = useOntology()
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<ReasoningResult | null>(null)
  const [isReasoning, setIsReasoning] = useState(false)

  const handleReason = () => {
    if (!ontology) return

    setIsReasoning(true)
    // Simulate async reasoning with setTimeout
    setTimeout(() => {
      const reasoningResult = runReasoner(ontology)
      setResult(reasoningResult)
      setIsReasoning(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Brain className="h-4 w-4 mr-2" />
          Reasoner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>HermiT Reasoner</DialogTitle>
          <DialogDescription>
            Run the reasoner to check ontology consistency and compute inferred class hierarchy
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button onClick={handleReason} disabled={!ontology || isReasoning}>
              {isReasoning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reasoning...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Start Reasoner
                </>
              )}
            </Button>

            {result && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {result.duration.toFixed(2)}ms
              </div>
            )}
          </div>

          {result && (
            <ScrollArea className="h-[500px] rounded-md border">
              <div className="p-4 space-y-4">
                {/* Consistency Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.consistent ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Ontology is Consistent
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          Ontology is Inconsistent
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {result.consistent
                        ? "No logical contradictions found in the ontology"
                        : "Logical contradictions detected. Please review the errors below."}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Errors */}
                {result.errors.length > 0 && (
                  <Card className="border-red-500/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-500">
                        <XCircle className="h-5 w-5" />
                        Errors ({result.errors.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.errors.map((error, idx) => (
                          <div key={idx} className="rounded-lg bg-red-500/10 p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium text-red-500">{error.message}</p>
                              <Badge variant="destructive" className="ml-2">
                                {error.type}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {error.affectedEntities.map((entity) => (
                                <Badge key={entity} variant="outline" className="text-xs">
                                  {ontology?.classes.get(entity)?.name || entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Unsatisfiable Classes */}
                {result.unsatisfiableClasses.length > 0 && (
                  <Card className="border-orange-500/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-500">
                        <AlertTriangle className="h-5 w-5" />
                        Unsatisfiable Classes ({result.unsatisfiableClasses.length})
                      </CardTitle>
                      <CardDescription>
                        These classes cannot have any instances due to logical constraints
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.unsatisfiableClasses.map((classId) => (
                          <Badge key={classId} variant="secondary" className="bg-orange-500/10">
                            {ontology?.classes.get(classId)?.name || classId}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <Card className="border-yellow-500/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-500">
                        <AlertTriangle className="h-5 w-5" />
                        Warnings ({result.warnings.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.warnings.map((warning, idx) => (
                          <div key={idx} className="rounded-lg bg-yellow-500/10 p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="text-sm text-yellow-600 dark:text-yellow-400">{warning.message}</p>
                              <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-500">
                                {warning.type}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {warning.affectedEntities.map((entity) => (
                                <Badge key={entity} variant="outline" className="text-xs">
                                  {ontology?.classes.get(entity)?.name ||
                                    ontology?.properties.get(entity)?.name ||
                                    entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Inferred Hierarchy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Inferred Class Hierarchy
                    </CardTitle>
                    <CardDescription>Complete transitive closure of class inheritance relationships</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from(result.inferredHierarchy.entries()).map(([classId, superClasses]) => {
                        if (superClasses.length === 0) return null
                        return (
                          <div key={classId} className="text-sm">
                            <span className="font-medium text-foreground">
                              {ontology?.classes.get(classId)?.name || classId}
                            </span>
                            <span className="text-muted-foreground"> ⊑ </span>
                            <span className="text-muted-foreground">
                              {superClasses.map((sc) => ontology?.classes.get(sc)?.name || sc).join(", ")}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
