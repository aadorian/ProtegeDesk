'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useOntology } from '@/lib/ontology/context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Copy, User, Plus, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useCopyToClipboard } from '@/hooks/copy-to-clipboard'
import { Individual } from '@/lib/ontology/types'

interface IndividualDetailsProps {
  isModalView?: boolean
  individual?: Individual
}

export function IndividualDetails({ isModalView, individual }: IndividualDetailsProps) {
  const { selectedIndividual } = useOntology()
  const { toast } = useToast()
  const { copy, copied } = useCopyToClipboard('')

  const copyToClipboard = async (text: string) => {
    const success = await copy(text)

    if (success) {
      toast({
        title: 'Copied',
        description: `Copied "${text}" to clipboard`,
      })
    } else {
      toast({
        title: 'Copy failed',
        variant: 'destructive',
      })
    }
  }

  if (isModalView && individual) {
    return (
      <>
        <div className="space-y-2">
          <Label className="text-xs">Name</Label>
          <Input value={individual.name} readOnly className="text-xs" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Label</Label>
          <Input value={individual.label} readOnly className="text-xs" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Property Assertions</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {individual.propertyAssertions.length === 0 ? (
              <p className="text-muted-foreground text-xs">No property assertions</p>
            ) : (
              <div className="space-y-2">
                {individual.propertyAssertions.map((assertion, idx) => (
                  <div key={idx} className="bg-muted space-y-1 rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold">{assertion.property}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Value:</span>
                      <span className="font-mono text-xs">{String(assertion.value)}</span>
                    </div>
                    {assertion.datatype && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">Type:</span>
                        <Badge variant="outline" className="text-xs">
                          {assertion.datatype}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </>
    )
  }

  if (!selectedIndividual) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Select an individual to view details
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle className="text-lg">
                {selectedIndividual.label || selectedIndividual.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">IRI</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(selectedIndividual.id)}
                  className="h-6 px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <Input value={selectedIndividual.id} readOnly className="font-mono text-xs" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Name</Label>
              <Input value={selectedIndividual.name} readOnly className="text-xs" />
            </div>

            {selectedIndividual.label && (
              <div className="space-y-2">
                <Label className="text-xs">Label</Label>
                <Input value={selectedIndividual.label} readOnly className="text-xs" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Types Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Types</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedIndividual.types.length === 0 ? (
              <p className="text-muted-foreground text-xs">No types defined</p>
            ) : (
              <div className="space-y-2">
                {selectedIndividual.types.map((type, idx) => (
                  <div key={idx} className="bg-muted flex items-center justify-between rounded p-2">
                    <span className="font-mono text-xs">{type}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Assertions Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Property Assertions</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedIndividual.propertyAssertions.length === 0 ? (
              <p className="text-muted-foreground text-xs">No property assertions</p>
            ) : (
              <div className="space-y-2">
                {selectedIndividual.propertyAssertions.map((assertion, idx) => (
                  <div key={idx} className="bg-muted space-y-1 rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold">{assertion.property}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Value:</span>
                      <span className="font-mono text-xs">{String(assertion.value)}</span>
                    </div>
                    {assertion.datatype && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">Type:</span>
                        <Badge variant="outline" className="text-xs">
                          {assertion.datatype}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Same As Card */}
        {selectedIndividual.sameAs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Same As</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedIndividual.sameAs.map((same, idx) => (
                  <div key={idx} className="bg-muted flex items-center justify-between rounded p-2">
                    <span className="font-mono text-xs">{same}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Different From Card */}
        {selectedIndividual.differentFrom.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Different From</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedIndividual.differentFrom.map((diff, idx) => (
                  <div key={idx} className="bg-muted flex items-center justify-between rounded p-2">
                    <span className="font-mono text-xs">{diff}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Annotations Card */}
        {selectedIndividual.annotations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Annotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedIndividual.annotations.map((annotation, idx) => (
                  <div key={idx} className="bg-muted rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold">{annotation.property}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="mt-1 text-xs">{annotation.value}</p>
                    {annotation.language && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        @{annotation.language}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
}
