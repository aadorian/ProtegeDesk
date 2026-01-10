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
import { Play, Download, Copy, AlertCircle, Table2, FileJson, LayoutGrid } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { EditorView } from '@codemirror/view'
import { useCopyToClipboard } from '@/hooks/copy-to-clipboard'

type ViewMode = 'table' | 'json' | 'cards'

export function SPARQLQuery() {
  const { ontology } = useOntology()
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query)
  const [result, setResult] = useState<SPARQLResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const { copy, copied } = useCopyToClipboard('')

  const executeQuery = () => {
    if (!ontology) {
      setError('No ontology loaded')
      toast.error('No ontology loaded')
      return
    }

    setIsExecuting(true)
    setError(null)

    try {
      const queryResult = executeSPARQLQuery(query, ontology)
      setResult(queryResult)
      toast.success(`Query executed: ${queryResult.results.bindings.length} results`)
      // Automatically switch to Results tab on successful execution
      setActiveTab('results')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast.error('Query execution failed')
      // Keep user on editor tab to see and fix the error
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
      setActiveTab('editor') // Switch to editor when loading a new query
      toast.info(`Loaded: ${sample.name}`)
    }
  }

  const copyQuery = async () => {
    const success = await copy(query)

    if (success) {
      toast.success('Query copied to clipboard')
    } else {
      toast.error('Unable to copy to clipboard')
    }
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
          <div className="border-b px-4 pt-4">
            <TabsList>
              <TabsTrigger value="editor">Query Editor</TabsTrigger>
              <TabsTrigger value="results">
                Results
                {result && (
                  <span className="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                    {result.results.bindings.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 overflow-hidden p-4">
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between">
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
                <p className="text-muted-foreground text-xs">
                  Press <kbd className="bg-muted rounded border px-1.5 py-0.5 text-xs">Ctrl</kbd> +{' '}
                  <kbd className="bg-muted rounded border px-1.5 py-0.5 text-xs">Enter</kbd> to
                  execute
                </p>
              </div>

              <div className="flex-1">
                <Textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault()
                      executeQuery()
                    }
                  }}
                  placeholder="Enter SPARQL query..."
                  className="h-full resize-none font-mono text-sm"
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

              <div className="border-t pt-3">
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="flex-1 overflow-hidden p-4">
            {error && (
              <div className="bg-destructive/10 text-destructive mb-3 flex items-start gap-2 rounded-md border border-red-200 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Query Error</p>
                  <p className="text-xs">{error}</p>
                  <Button
                    onClick={() => setActiveTab('editor')}
                    variant="link"
                    size="sm"
                    className="text-destructive mt-1 h-auto p-0 text-xs underline"
                  >
                    Back to Editor
                  </Button>
                </div>
              </div>
            )}
            {result ? (
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-muted-foreground text-sm">
                      {result.results.bindings.length} result(s) found
                    </p>
                    <Button
                      onClick={() => setActiveTab('editor')}
                      variant="ghost"
                      size="sm"
                      className="h-7"
                    >
                      Edit Query
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md border p-1">
                      <Button
                        onClick={() => setViewMode('table')}
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        title="Table View"
                      >
                        <Table2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setViewMode('cards')}
                        variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        title="Card View"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setViewMode('json')}
                        variant={viewMode === 'json' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        title="JSON View"
                      >
                        <FileJson className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={downloadResults} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download JSON
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  {result.results.bindings.length > 0 ? (
                    <>
                      {viewMode === 'table' && (
                        <div className="overflow-auto">
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
                        </div>
                      )}

                      {viewMode === 'cards' && (
                        <div className="grid gap-3 p-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                          {result.results.bindings.map((binding, idx) => (
                            <Card key={idx} className="p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  Result {idx + 1}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {result.head.vars.map(variable => (
                                  <div key={variable} className="border-b pb-2 last:border-0">
                                    <p className="text-muted-foreground mb-1 font-mono text-xs font-medium">
                                      ?{variable}
                                    </p>
                                    {variable in binding ? (
                                      <p
                                        className="text-sm break-words"
                                        title={String(binding[variable])}
                                      >
                                        {formatValue(binding[variable])}
                                      </p>
                                    ) : (
                                      <p className="text-muted-foreground text-xs italic">
                                        No value
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}

                      {viewMode === 'json' && (
                        <div className="w-full pb-4">
                          <CodeMirror
                            value={JSON.stringify(result, null, 2)}
                            extensions={[
                              json(),
                              EditorView.lineWrapping,
                              EditorView.editable.of(false),
                            ]}
                            theme="dark"
                            style={{ width: '100%' }}
                            basicSetup={{
                              lineNumbers: true,
                              highlightActiveLineGutter: true,
                              highlightActiveLine: true,
                              foldGutter: true,
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                Execute a query to see results
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
