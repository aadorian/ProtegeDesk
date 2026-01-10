'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOntology } from '@/lib/ontology/context'
import { Box, Link2, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '../ui/button'
import { useCopyToClipboard } from '@/hooks/copy-to-clipboard'
import { formatRelativeTime, formatAbsoluteTime } from '@/lib/utils'

export function OntologyStats() {
  const { ontology } = useOntology()
  const [, setUpdateTrigger] = useState(0)

  const classCount = ontology?.classes.size ?? 0
  const propertyCount = ontology?.properties.size ?? 0
  const individualCount = ontology?.individuals.size ?? 0
  const { toast } = useToast()
  const { copy, copied } = useCopyToClipboard('')

  // Debug logging when ontology changes
  useEffect(() => {
    if (ontology) {
      // console.log('[OntologyStats] Ontology updated:', {
      //   name: ontology.name,
      //   classes: classCount,
      //   properties: propertyCount,
      //   individuals: individualCount,
      // })
    }
  }, [ontology, classCount, propertyCount, individualCount])

  // Update relative time display every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1)
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  if (!ontology) {
    return null
  }

  const onClickHandler = async () => {
    const success = await copy(ontology.id)

    if (success) {
      toast({
        title: 'Copied',
        description: 'Ontology IRI copied to clipboard',
      })
    } else {
      toast({
        title: 'Copy failed',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="px-1 text-sm font-semibold">Ontology Statistics</h3>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Box className="text-primary h-4 w-4" />
            Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{classCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Link2 className="text-primary h-4 w-4" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{propertyCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="text-primary h-4 w-4" />
            Individuals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{individualCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Ontology Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div>
            <div className="text-muted-foreground">IRI:</div>
            <div className="font-mono break-all">{ontology.id}</div>
            <Button aria-label="Copy IRI" title="Copy IRI" onClick={onClickHandler} size="sm">
              Copy IRI
            </Button>
            <Toaster />
          </div>
          {ontology.version && (
            <div>
              <div className="text-muted-foreground">Version:</div>
              <div className="font-mono">{ontology.version}</div>
            </div>
          )}
          {ontology.lastModified && (
            <div>
              <div className="text-muted-foreground">Last Modified:</div>
              <div className="cursor-default" title={formatAbsoluteTime(ontology.lastModified)}>
                {formatRelativeTime(ontology.lastModified)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
