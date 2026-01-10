import { Badge } from '@/components/ui/badge'
import { Ontology } from '@/lib/ontology/types'

type NodeHoverCardProps = {
  node: {
    id: string
    label: string
    type: 'class' | 'property' | 'individual'
  }
  ontology: Ontology | null
  style: React.CSSProperties
}

const truncate = (text?: string, max = 120) =>
  text && text.length > max ? text.slice(0, max) + '…' : text

export function NodeHoverCard({ node, ontology, style }: NodeHoverCardProps) {
  if (!ontology) return null

  let description: string | undefined
  let details: React.ReactNode = null

  /** ---------- CLASS ---------- */
  if (node.type === 'class') {
    const cls = ontology.classes.get(node.id)
    if (!cls) return null

    const subclassCount = Array.from(ontology.classes.values()).filter(c =>
      c.superClasses?.includes(node.id)
    ).length

    const instanceCount = Array.from(ontology.individuals.values()).filter(i =>
      i.types?.includes(node.id)
    ).length

    description = cls.description

    details = (
      <div className="text-muted-foreground">
        {subclassCount} subclasses • {instanceCount} instances
      </div>
    )
  }

  /** ---------- PROPERTY ---------- */
  if (node.type === 'property') {
    const prop = ontology.properties.get(node.id)
    if (!prop) return null

    description = prop.description

    details = (
      <>
        <div className="text-muted-foreground">
          {prop.domain?.[0] ?? '∅'} → {prop.range?.[0] ?? '∅'}
        </div>

        {prop.characteristics?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {prop.characteristics.map(c => (
              <Badge key={c} variant="outline" className="text-[10px]">
                {c}
              </Badge>
            ))}
          </div>
        )}
      </>
    )
  }

  /** ---------- INDIVIDUAL ---------- */
  if (node.type === 'individual') {
    const ind = ontology.individuals.get(node.id)
    if (!ind) return null

    description = ind.label

    const primaryType = ind.types?.[0]
    const assertionCount = ind.types?.length ?? 0 // rdf:type assertions only

    details = (
      <>
        <div className="text-muted-foreground">
          {primaryType ?? 'Unknown type'}
        </div>
        <div className="text-muted-foreground">
          {assertionCount} type assertions
        </div>
      </>
    )
  }

  return (
    <div
      className="
        pointer-events-none
        absolute
        z-50
        -translate-x-1/2
        -translate-y-full
        rounded-lg
        border
        bg-card
        px-3
        py-2
        text-xs
        shadow-xl
        backdrop-blur-sm
        max-w-[260px]
      "
      style={style}
    >
      {/* Title */}
      <div className="text-foreground font-semibold leading-tight">
        {node.label}
      </div>

      {/* Type */}
      <div className="mt-1 flex items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {node.type}
        </Badge>
        <span className="text-muted-foreground truncate">{node.id}</span>
      </div>

      {/* Quick stats */}
      <div className="mt-1 space-y-1">{details}</div>

      {/* Description */}
      {description && (
        <div className="text-muted-foreground mt-2 border-t pt-2 leading-snug">
          {truncate(description)}
        </div>
      )}
    </div>
  )
}
