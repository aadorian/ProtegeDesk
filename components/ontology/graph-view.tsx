'use client'

import type React from 'react'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useOntology } from '@/lib/ontology/context'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize, Download, RotateCcw } from 'lucide-react'

import {
  REPULSION_STRENGTH,
  ATTRACTION_STRENGTH,
  DAMPING,
  CLASS_LAYOUT_RADIUS,
  PROPERTY_LAYOUT_RADIUS,
  INDIVIDUAL_LAYOUT_RADIUS,
  INDIVIDUAL_X_OFFSET,
  CLASS_NODE_RADIUS,
  PROPERTY_NODE_RADIUS,
  INDIVIDUAL_NODE_RADIUS,
  MAX_SIMULATION_ITERATIONS,
  MIN_ZOOM,
  MAX_ZOOM,
  WHEEL_ZOOM_IN_FACTOR,
  WHEEL_ZOOM_OUT_FACTOR,
  ZOOM_IN_FACTOR,
  ZOOM_OUT_FACTOR,
  SUBCLASS_EDGE_WIDTH,
  DEFAULT_EDGE_WIDTH,
  EDGE_DASH_SIZE,
  EDGE_ARROW_LENGTH,
  EDGE_ARROW_ANGLE,
  SELECTION_RADIUS_PADDING,
  DEFAULT_ZOOM,
  FIT_VIEW_PADDING,
  MAX_FIT_ZOOM,
} from '../../lib/constants'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ClassDetails } from './class-details'
import { PropertyDetails } from './property-details'
import { IndividualDetails } from './individual-details'
import { NodeHoverCard } from './node-hover-card'
import { NewEntityDialog } from './new-entity-dialog'

type Node = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  label: string
  type: 'class' | 'property' | 'individual'
  radius: number
  color: string
}

type Edge = {
  from: string
  to: string
  label?: string
  type: 'subclass' | 'property' | 'instance'
  color: string
}

/**
 * Force-directed graph layout algorithm implementing a physics simulation.
 *
 * WHAT: Simulates physical forces to automatically arrange nodes in a visually pleasing layout.
 *
 * WHY use force-directed layout:
 * - Self-organizing: no manual positioning required for complex ontologies
 * - Reveals structure: connected nodes cluster together, hierarchies emerge naturally
 * - Aesthetic: tends to minimize edge crossings and distribute nodes evenly
 *
 * HOW it works:
 * 1. Repulsion forces push all nodes apart (prevents overlapping)
 * 2. Attraction forces pull connected nodes together (keeps relationships visible)
 * 3. Damping gradually reduces velocity (allows the system to stabilize)
 * 4. Iterative: runs for a fixed number of frames until equilibrium is reached
 *
 * Based on the Fruchterman-Reingold algorithm commonly used in graph visualization.
 */
function applyForces(nodes: Node[], edges: Edge[]) {
  // PHASE 1: Apply repulsion forces between ALL node pairs
  // WHY: Prevents nodes from overlapping and creates visual separation
  // TECHNIQUE: Inverse square law (force ∝ 1/distance²) mimics electrical repulsion
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x
      const dy = nodes[j].y - nodes[i].y
      // WHY "|| 1": Prevents division by zero when nodes overlap exactly
      const distance = Math.sqrt(dx * dx + dy * dy) || 1

      // WHY inverse square: Stronger repulsion at close range, weaker at distance
      // This creates natural spacing without pushing distant nodes unnecessarily
      const force = REPULSION_STRENGTH / (distance * distance)

      // Convert force magnitude to directional force components
      // WHY normalize: (dx/distance) gives unit vector direction
      const fx = (dx / distance) * force
      const fy = (dy / distance) * force

      // Apply equal and opposite forces (Newton's third law)
      // WHY opposite signs: node i pushed away (-), node j pushed away (+)
      nodes[i].vx -= fx
      nodes[i].vy -= fy
      nodes[j].vx += fx
      nodes[j].vy += fy
    }
  }

  // PHASE 2: Apply attraction forces along edges (relationships)
  // WHY: Pulls related nodes together to show semantic connections
  // TECHNIQUE: Spring force (force ∝ distance) like a stretched elastic band
  edges.forEach(edge => {
    const fromNode = nodes.find(n => n.id === edge.from)
    const toNode = nodes.find(n => n.id === edge.to)

    if (fromNode && toNode) {
      const dx = toNode.x - fromNode.x
      const dy = toNode.y - fromNode.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1

      // WHY linear force (not inverse square): Attraction grows stronger with distance
      // This creates a "spring" effect that pulls connected nodes to an optimal distance
      const force = distance * ATTRACTION_STRENGTH
      const fx = (dx / distance) * force
      const fy = (dy / distance) * force

      // WHY opposite velocities: fromNode pulled toward toNode, toNode pulled toward fromNode
      // This mutual attraction brings them closer together
      fromNode.vx += fx
      fromNode.vy += fy
      toNode.vx -= fx
      toNode.vy -= fy
    }
  })

  // PHASE 3: Apply velocity with damping to achieve stable layout
  // WHY damping: Without it, nodes would oscillate forever. Damping simulates friction
  // that gradually dissipates kinetic energy, allowing the layout to stabilize.
  nodes.forEach(node => {
    node.x += node.vx
    node.y += node.vy
    node.vx *= DAMPING
    node.vy *= DAMPING
  })
}

export function GraphView() {
  const { ontology, selectClass } = useOntology()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(true)
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const hoverTimeoutRef = useRef<number | null>(null)
  const [contextNode, setContextNode] = useState<Node | null>(null)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [createSubclassParent, setCreateSubclassParent] = useState<string | null>(null)
  
  const selectedNodeData = useMemo(() => {
    if (!ontology || !selectedNode) {
      return null
    }

    const classData = ontology.classes.get(selectedNode)
    if (ontology.classes.has(selectedNode)) {
      return {
        id: selectedNode,
        type: 'class' as const,
        data: classData,
      }
    }

    const propertyData = ontology.properties.get(selectedNode)
    if (ontology.properties.has(selectedNode)) {
      return {
        id: selectedNode,
        type: 'property' as const,
        data: propertyData,
      }
    }

    const individualData = ontology.individuals.get(selectedNode)
    if (ontology.individuals.has(selectedNode)) {
      return {
        id: selectedNode,
        type: 'individual' as const,
        data: individualData,
      }
    }

    return null
  }, [ontology, selectedNode])

  useEffect(() => {
    if (!ontology) {
      return
    }

    // Convert ontology to graph data
    const graphNodes: Node[] = []
    const graphEdges: Edge[] = []

    // Add class nodes
    Array.from(ontology.classes.values()).forEach((owlClass, index) => {
      const angle = (index / ontology.classes.size) * 2 * Math.PI
      graphNodes.push({
        id: owlClass.id,
        x: Math.cos(angle) * CLASS_LAYOUT_RADIUS,
        y: Math.sin(angle) * CLASS_LAYOUT_RADIUS,
        vx: 0,
        vy: 0,
        label: owlClass.label || owlClass.name,
        type: 'class',
        radius: CLASS_NODE_RADIUS,
        color: 'rgb(147, 112, 219)',
      })

      // Add edges for superclasses
      owlClass.superClasses.forEach(superClass => {
        if (superClass !== 'owl:Thing') {
          graphEdges.push({
            from: owlClass.id,
            to: superClass,
            type: 'subclass',
            label: 'subClassOf',
            color: 'rgba(147, 112, 219, 0.5)',
          })
        }
      })
    })

    Array.from(ontology.properties.values()).forEach((prop, index) => {
      const angle = (index / ontology.properties.size) * 2 * Math.PI + Math.PI
      const color =
        prop.type === 'ObjectProperty'
          ? 'rgb(99, 179, 237)'
          : prop.type === 'DataProperty'
            ? 'rgb(129, 199, 132)'
            : 'rgb(255, 152, 0)'

      graphNodes.push({
        id: prop.id,
        x: Math.cos(angle) * PROPERTY_LAYOUT_RADIUS,
        y: Math.sin(angle) * PROPERTY_LAYOUT_RADIUS,
        vx: 0,
        vy: 0,
        label: prop.label || prop.name,
        type: 'property',
        radius: PROPERTY_NODE_RADIUS,
        color: color,
      })

      // Add edges from properties to their domain/range
      prop.domain.forEach(domainClass => {
        graphEdges.push({
          from: prop.id,
          to: domainClass,
          type: 'property',
          label: 'domain',
          color: 'rgba(99, 179, 237, 0.3)',
        })
      })
    })

    Array.from(ontology.individuals.values()).forEach((individual, index) => {
      const angle = (index / ontology.individuals.size) * 2 * Math.PI
      graphNodes.push({
        id: individual.id,
        x: Math.cos(angle) * INDIVIDUAL_LAYOUT_RADIUS + INDIVIDUAL_X_OFFSET,
        y: Math.sin(angle) * INDIVIDUAL_LAYOUT_RADIUS,
        vx: 0,
        vy: 0,
        label: individual.label || individual.name,
        type: 'individual',
        radius: INDIVIDUAL_NODE_RADIUS,
        color: 'rgb(244, 143, 177)',
      })

      // Add edges from individuals to their types
      individual.types.forEach(typeClass => {
        graphEdges.push({
          from: individual.id,
          to: typeClass,
          type: 'instance',
          label: 'instanceOf',
          color: 'rgba(244, 143, 177, 0.4)',
        })
      })
    })

    setNodes(graphNodes)
    setEdges(graphEdges)
    setIsSimulating(true)
  }, [ontology])

  useEffect(() => {
    if (!isSimulating || nodes.length === 0) {
      return
    }

    let iterations = 0

    const animate = () => {
      if (iterations < MAX_SIMULATION_ITERATIONS) {
        setNodes(prevNodes => {
          const newNodes = prevNodes.map(n => ({ ...n }))
          applyForces(newNodes, edges)
          return newNodes
        })
        iterations++
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsSimulating(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSimulating, edges])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = 'rgb(7, 7, 7)'
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Calculate center
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Apply transformations
    ctx.save()
    ctx.translate(centerX + offset.x, centerY + offset.y)
    ctx.scale(zoom, zoom)

    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from)
      const toNode = nodes.find(n => n.id === edge.to)

      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = edge.color
        ctx.lineWidth = edge.type === 'subclass' ? SUBCLASS_EDGE_WIDTH : DEFAULT_EDGE_WIDTH
        if (edge.type === 'property') {
          ctx.setLineDash([EDGE_DASH_SIZE, EDGE_DASH_SIZE])
        } else {
          ctx.setLineDash([])
        }
        ctx.stroke()

        // Draw arrow
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
        const arrowX = toNode.x - Math.cos(angle) * (toNode.radius + 5)
        const arrowY = toNode.y - Math.sin(angle) * (toNode.radius + 5)

        ctx.beginPath()
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(
          arrowX - EDGE_ARROW_LENGTH * Math.cos(angle - EDGE_ARROW_ANGLE),
          arrowY - EDGE_ARROW_LENGTH * Math.sin(angle - EDGE_ARROW_ANGLE)
        )
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(
          arrowX - EDGE_ARROW_LENGTH * Math.cos(angle + EDGE_ARROW_ANGLE),
          arrowY - EDGE_ARROW_LENGTH * Math.sin(angle + EDGE_ARROW_ANGLE)
        )
        ctx.strokeStyle = edge.color
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    nodes.forEach(node => {

      const isSelected = node.id === selectedNode

      // Draw selection highlight
      if (isSelected) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + SELECTION_RADIUS_PADDING, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgb(255, 215, 0)'
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Draw node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = isSelected ? 'rgb(255, 215, 0)' : 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = isSelected ? SUBCLASS_EDGE_WIDTH : 2
      ctx.stroke()

      // Draw label
      ctx.fillStyle = 'rgb(250, 250, 250)'
      ctx.font = node.type === 'class' ? 'bold 13px sans-serif' : '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 4
      ctx.fillText(node.label, node.x, node.y)
      ctx.shadowBlur = 0

      // Draw type indicator below node
      ctx.font = '9px sans-serif'
      ctx.fillStyle = 'rgb(160, 160, 160)'
      ctx.fillText(node.type, node.x, node.y + node.radius + 12)
    })

    ctx.restore()
  }, [nodes, edges, zoom, offset, selectedNode, hoveredNode])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? WHEEL_ZOOM_OUT_FACTOR : WHEEL_ZOOM_IN_FACTOR
    setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * delta)))
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        return
      } // Avoid interfering with browser zoom

      switch (e.key) {
        case '+':
        case '=':
          setZoom(z => Math.min(MAX_ZOOM, z * ZOOM_IN_FACTOR))
          break
        case '-':
        case '_':
          setZoom(z => Math.max(MIN_ZOOM, z * ZOOM_OUT_FACTOR))
          break
        case '0':
          resetView()
          break
        case 'f':
          fitToView()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
      return
    }
  
    const canvas = canvasRef.current
    if (!canvas) return
  
    const rect = canvas.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
  
    const x = (e.clientX - rect.left - centerX - offset.x) / zoom
    const y = (e.clientY - rect.top - centerY - offset.y) / zoom
  
    const node =
      nodes.find(n => {
        const dx = x - n.x
        const dy = y - n.y
        return Math.sqrt(dx * dx + dy * dy) <= n.radius
      }) ?? null
  
    // If hovering the same node, do nothing
    if (node?.id === hoveredNode?.id) return
  
    // Clear any pending hover
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  
    // Immediately clear tooltip if no node
    if (!node) {
      setHoveredNode(null)
      return
    }
  
    // Delay tooltip appearance
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredNode(node)
    }, 300)
  }
  
  

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const clickX = (e.clientX - rect.left - centerX - offset.x) / zoom
    const clickY = (e.clientY - rect.top - centerY - offset.y) / zoom

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const dx = clickX - node.x
      const dy = clickY - node.y
      return Math.sqrt(dx * dx + dy * dy) <= node.radius
    })

    if (clickedNode) {
      setSelectedNode(clickedNode.id)
      setIsDialogOpen(true)
      if (clickedNode.type === 'class') {
        selectClass(clickedNode.id)
      }
      setClickPosition({ x: e.clientX, y: e.clientY })
    } else {
      setSelectedNode(null)
      selectClass(null)
      setClickPosition(null)
    }
  }

  const resetView = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const fitToView = () => {
    if (nodes.length === 0 || !canvasRef.current) {
      return
    }

    // Find bounding box
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity
    nodes.forEach(node => {
      minX = Math.min(minX, node.x - node.radius)
      maxX = Math.max(maxX, node.x + node.radius)
      minY = Math.min(minY, node.y - node.radius)
      maxY = Math.max(maxY, node.y + node.radius)
    })

    const contentWidth = maxX - minX + FIT_VIEW_PADDING
    const contentHeight = maxY - minY + FIT_VIEW_PADDING

    const rect = canvasRef.current.getBoundingClientRect()
    const containerWidth = rect.width
    const containerHeight = rect.height

    const newZoom = Math.min(
      containerWidth / contentWidth,
      containerHeight / contentHeight,
      MAX_FIT_ZOOM
    )

    setZoom(newZoom)
    setOffset({
      x: (-(minX + maxX) / 2) * newZoom,
      y: (-(minY + maxY) / 2) * newZoom,
    })
  }

  const graphToScreen = (x: number, y: number) => {
    if (!canvasRef.current) return null
  
    const rect = canvasRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
  
    return {
      x: centerX + offset.x + x * zoom,
      y: centerY + offset.y + y * zoom,
    }
  }  

  const exportGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const link = document.createElement('a')
    link.download = 'ontology-graph.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  
    const canvas = canvasRef.current
    if (!canvas) return
  
    const rect = canvas.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
  
    const x = (e.clientX - rect.left - centerX - offset.x) / zoom
    const y = (e.clientY - rect.top - centerY - offset.y) / zoom
  
    const node = nodes.find(n => {
      const dx = x - n.x
      const dy = y - n.y
      return Math.sqrt(dx * dx + dy * dy) <= n.radius
    })
  
    if (node?.type === 'class') {
      setContextNode(node)
      setContextMenuPos({ x: e.clientX - 250, y: e.clientY - 80})
    } else {
      setContextNode(null)
      setContextMenuPos(null)
    }
  }
  
  

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp()
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
          }
          setHoveredNode(null)
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-secondary/80 border-border flex flex-col gap-1 rounded-lg border p-1 shadow-md backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent h-8 w-8"
            onClick={() => setZoom(z => Math.min(MAX_ZOOM, z * ZOOM_IN_FACTOR))}
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="border-border/50 flex h-8 items-center justify-center border-y text-[10px] font-medium">
            {(zoom * 100).toFixed(0)}%
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent h-8 w-8"
            onClick={() => setZoom(z => Math.max(MIN_ZOOM, z * ZOOM_OUT_FACTOR))}
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="shadow-md"
          onClick={fitToView}
          title="Fit to Screen (F)"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="shadow-md"
          onClick={resetView}
          title="Reset View (0)"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="shadow-md"
          onClick={exportGraph}
          title="Export PNG"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-card/80 border-border absolute bottom-4 left-4 space-y-2 rounded-lg border px-4 py-3 text-xs shadow-lg backdrop-blur-sm">
        <div className="text-foreground mb-2 flex items-center justify-between font-semibold">
          <span>Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: 'rgb(147, 112, 219)' }}
            />
            <span>Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: 'rgb(99, 179, 237)' }}
            />
            <span>Object Prop</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: 'rgb(129, 199, 132)' }}
            />
            <span>Data Prop</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: 'rgb(244, 143, 177)' }}
            />
            <span>Individual</span>
          </div>
        </div>
        <div className="border-border mt-2 border-t pt-2">
          <div className="mb-1 flex items-center gap-2">
            <div className="bg-primary/50 h-0.5 w-6" />
            <span>Subclass</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-blue-400/30" style={{ borderTop: '1.5px dashed' }} />
            <span>Relation</span>
          </div>
        </div>
        {selectedNode && (
          <div className="text-primary border-border max-w-[200px] truncate border-t pt-2 font-semibold">
            Selected: <span className="text-foreground font-normal">{selectedNode}</span>
          </div>
        )}
      </div>
      {selectedNodeData && clickPosition && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            className="max-w-md"
            style={{
              position: 'fixed',
              top: clickPosition.y + 200,
              left: clickPosition.x + 200,
              maxWidth: '300px',
              overflow: 'auto',
              borderRadius: '8px', // optional, keeps corners rounded
              backgroundColor: 'var(--card-background, #1c1c1c)', // ensure background is visible
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)', // optional for nicer look
            }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 capitalize">
                {selectedNodeData?.type}
                <Badge variant="outline">{selectedNodeData?.id}</Badge>
              </DialogTitle>
            </DialogHeader>

            {selectedNodeData && selectedNodeData.type === 'class' && (
              <ClassDetails isModalView={true} />
            )}

            {selectedNodeData && selectedNodeData.type === 'property' && (
              <PropertyDetails isModalView={true} property={selectedNodeData.data} />
            )}

            {selectedNodeData && selectedNodeData.type === 'individual' && (
              <IndividualDetails isModalView={true} individual={selectedNodeData.data} />
            )}
          </DialogContent>
        </Dialog>
      )}
      {contextNode && contextMenuPos && (
        <div
          className="absolute z-50 rounded-md border border-border bg-card shadow-lg"
          style={{
            left: contextMenuPos.x,
            top: contextMenuPos.y,
          }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setCreateSubclassParent(contextNode.id)
              setContextNode(null)
              setContextMenuPos(null)
            }}
          >
            Create subclass
          </Button>
        </div>
      )}
      {createSubclassParent && (
        <NewEntityDialog
          open={true}
          parentClassId={createSubclassParent}
          onOpenChange={(open) => {
            if (!open) {
              setCreateSubclassParent(null)
            }
          }}
        />
      )}

      {hoveredNode && (() => {
        const screenPos = graphToScreen(hoveredNode.x, hoveredNode.y)
        if (!screenPos) return null

        return (
          <NodeHoverCard
            node={hoveredNode}
            ontology={ontology}
            style={{
              left: screenPos.x,
              top: screenPos.y - hoveredNode.radius - 12,
            }}
          />
        )
      })()}
    </div>
  )
}