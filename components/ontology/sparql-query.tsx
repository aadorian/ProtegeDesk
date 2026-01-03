'use client'

import { useState } from 'react'
import { useOntology } from '@/lib/ontology/context'
import { executeSPARQLQuery, SAMPLE_QUERIES, type SPARQLResult } from '@/lib/ontology/sparql'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Play, Download, Copy, AlertCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

export function SPARQLQuery() {
  const { ontology } = useOntology()
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query)
  const [result, setResult] = useState<SPARQLResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const executeQuery = () => {
    if (!ontology) {
      setError('No ontology loaded')
      return
    }

    setIsExecuting(true)
    setError(null)

    try {
      const queryResult = executeSPARQLQuery(query, ontology)
      setResult(queryResult)
      toast.success(`Query executed: ${queryResult.results.bindings.length} results`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast.error('Query execution failed')
    } finally {
      setIsExecuting(false)
    }
  }

  const loadSampleQuery = (queryIndex: number) => {
    const sample = SAMPLE_QUERIES[queryIndex]
    if (sample) {
      setQuery(sample.query)
      setResult(null)
      setError(null)
      toast.info(`Loaded: ${sample.name}`)
    }
  }

  const copyQuery = () => {
    navigator.clipboard.writeText(query)
    toast.success('Query copied to clipboard')
  }

  const downloadResults = () => {
    if (!result) {
      return
    }

    const json = JSON.stringify(result, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sparql-results.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Results downloaded')
  }

  const formatValue = (value: string | number | boolean): string => {
    if (typeof value === 'string') {
      // Try to extract label from URI
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return value.split('#').pop() || value.split('/').pop() || value
      }
    }
    return String(value)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">SPARQL Query Interface</h2>
          <p className="text-muted-foreground text-sm">
            Execute SPARQL queries against the loaded ontology
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select onValueChange={value => loadSampleQuery(Number(value))}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Load sample query..." />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_QUERIES.map((sample, idx) => (
                <SelectItem key={idx} value={String(idx)}>
                  {sample.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="flex h-full flex-col">
          <div className="border-b px-4 pt-4">
            <TabsList>
              <TabsTrigger value="editor">Query Editor</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 overflow-hidden p-4">
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-2">
                <Button onClick={executeQuery} disabled={isExecuting || !ontology} size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  {isExecuting ? 'Executing...' : 'Execute Query'}
                </Button>
                <Button onClick={copyQuery} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>

              <div className="flex-1">
                <Textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Enter SPARQL query..."
                  className="font-mono h-full resize-none text-sm"
                  spellCheck={false}
                />
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border border-red-200 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Query Error</p>
                    <p className="text-xs">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="flex-1 overflow-hidden p-4">
            {result ? (
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    {result.results.bindings.length} result(s) found
                  </p>
                  <Button onClick={downloadResults} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>

                <ScrollArea className="flex-1">
                  {result.results.bindings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {result.head.vars.map(variable => (
                            <TableHead key={variable} className="font-mono">
                              ?{variable}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.results.bindings.map((binding, idx) => (
                          <TableRow key={idx}>
                            {result.head.vars.map(variable => (
                              <TableCell key={variable} className="font-mono text-xs">
                                {variable in binding ? (
                                  <span title={String(binding[variable])}>
                                    {formatValue(binding[variable])}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground italic">-</span>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                      No results found
                    </div>
                  )}
                </ScrollArea>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                Execute a query to see results
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-4">
        <h3 className="mb-2 text-sm font-semibold">Sample Queries</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_QUERIES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => loadSampleQuery(idx)}
              className="hover:bg-accent rounded-md border p-3 text-left transition-colors"
            >
              <p className="text-sm font-medium">{sample.name}</p>
              <p className="text-muted-foreground mt-1 text-xs">{sample.description}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
