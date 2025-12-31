"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useOntology } from "@/lib/ontology/context"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize, Download } from "lucide-react"

type Node = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  label: string
  type: "class" | "property" | "individual"
  radius: number
  color: string
}

type Edge = {
  from: string
  to: string
  label?: string
  type: "subclass" | "property" | "instance"
  color: string
}

function applyForces(nodes: Node[], edges: Edge[]) {
  const repulsionStrength = 3000
  const attractionStrength = 0.01
  const damping = 0.8

  // Repulsion between all nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x
      const dy = nodes[j].y - nodes[i].y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1
      const force = repulsionStrength / (distance * distance)

      const fx = (dx / distance) * force
      const fy = (dy / distance) * force

      nodes[i].vx -= fx
      nodes[i].vy -= fy
      nodes[j].vx += fx
      nodes[j].vy += fy
    }
  }

  // Attraction along edges
  edges.forEach((edge) => {
    const fromNode = nodes.find((n) => n.id === edge.from)
    const toNode = nodes.find((n) => n.id === edge.to)

    if (fromNode && toNode) {
      const dx = toNode.x - fromNode.x
      const dy = toNode.y - fromNode.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1

      const force = distance * attractionStrength
      const fx = (dx / distance) * force
      const fy = (dy / distance) * force

      fromNode.vx += fx
      fromNode.vy += fy
      toNode.vx -= fx
      toNode.vy -= fy
    }
  })

  // Apply velocity with damping
  nodes.forEach((node) => {
    node.x += node.vx
    node.y += node.vy
    node.vx *= damping
    node.vy *= damping
  })
}

export function GraphView() {
  const { ontology, selectClass } = useOntology()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(true)

  useEffect(() => {
    if (!ontology) return

    // Convert ontology to graph data
    const graphNodes: Node[] = []
    const graphEdges: Edge[] = []

    // Add class nodes
    Array.from(ontology.classes.values()).forEach((owlClass, index) => {
      const angle = (index / ontology.classes.size) * 2 * Math.PI
      const radius = 250
      graphNodes.push({
        id: owlClass.id,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        label: owlClass.label || owlClass.name,
        type: "class",
        radius: 35,
        color: "rgb(147, 112, 219)",
      })

      // Add edges for superclasses
      owlClass.superClasses.forEach((superClass) => {
        if (superClass !== "owl:Thing") {
          graphEdges.push({
            from: owlClass.id,
            to: superClass,
            type: "subclass",
            label: "subClassOf",
            color: "rgba(147, 112, 219, 0.5)",
          })
        }
      })
    })

    Array.from(ontology.properties.values()).forEach((prop, index) => {
      const angle = (index / ontology.properties.size) * 2 * Math.PI + Math.PI
      const radius = 150
      const color =
        prop.type === "ObjectProperty"
          ? "rgb(99, 179, 237)"
          : prop.type === "DataProperty"
            ? "rgb(129, 199, 132)"
            : "rgb(255, 152, 0)"

      graphNodes.push({
        id: prop.id,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        label: prop.label || prop.name,
        type: "property",
        radius: 28,
        color: color,
      })

      // Add edges from properties to their domain/range
      prop.domain.forEach((domainClass) => {
        graphEdges.push({
          from: prop.id,
          to: domainClass,
          type: "property",
          label: "domain",
          color: "rgba(99, 179, 237, 0.3)",
        })
      })
    })

    Array.from(ontology.individuals.values()).forEach((individual, index) => {
      const angle = (index / ontology.individuals.size) * 2 * Math.PI
      const radius = 100
      graphNodes.push({
        id: individual.id,
        x: Math.cos(angle) * radius + 300,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        label: individual.label || individual.name,
        type: "individual",
        radius: 25,
        color: "rgb(244, 143, 177)",
      })

      // Add edges from individuals to their types
      individual.types.forEach((typeClass) => {
        graphEdges.push({
          from: individual.id,
          to: typeClass,
          type: "instance",
          label: "instanceOf",
          color: "rgba(244, 143, 177, 0.4)",
        })
      })
    })

    setNodes(graphNodes)
    setEdges(graphEdges)
    setIsSimulating(true)
  }, [ontology])

  useEffect(() => {
    if (!isSimulating || nodes.length === 0) return

    let iterations = 0
    const maxIterations = 300

    const animate = () => {
      if (iterations < maxIterations) {
        setNodes((prevNodes) => {
          const newNodes = prevNodes.map((n) => ({ ...n }))
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
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = "rgb(7, 7, 7)"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Calculate center
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Apply transformations
    ctx.save()
    ctx.translate(centerX + offset.x, centerY + offset.y)
    ctx.scale(zoom, zoom)

    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)

      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = edge.color
        ctx.lineWidth = edge.type === "subclass" ? 2.5 : 1.5
        if (edge.type === "property") {
          ctx.setLineDash([5, 5])
        } else {
          ctx.setLineDash([])
        }
        ctx.stroke()

        // Draw arrow
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
        const arrowLength = 12
        const arrowX = toNode.x - Math.cos(angle) * (toNode.radius + 5)
        const arrowY = toNode.y - Math.sin(angle) * (toNode.radius + 5)

        ctx.beginPath()
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle - Math.PI / 6),
        )
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle + Math.PI / 6),
        )
        ctx.strokeStyle = edge.color
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    nodes.forEach((node) => {
      const isSelected = node.id === selectedNode

      // Draw selection highlight
      if (isSelected) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + 6, 0, 2 * Math.PI)
        ctx.strokeStyle = "rgb(255, 215, 0)"
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Draw node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = isSelected ? "rgb(255, 215, 0)" : "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = isSelected ? 2.5 : 2
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "rgb(250, 250, 250)"
      ctx.font = node.type === "class" ? "bold 13px sans-serif" : "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Text shadow for better readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
      ctx.shadowBlur = 4
      ctx.fillText(node.label, node.x, node.y)
      ctx.shadowBlur = 0

      // Draw type indicator below node
      ctx.font = "9px sans-serif"
      ctx.fillStyle = "rgb(160, 160, 160)"
      ctx.fillText(node.type, node.x, node.y + node.radius + 12)
    })

    ctx.restore()
  }, [nodes, edges, zoom, offset, selectedNode])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const clickX = (e.clientX - rect.left - centerX - offset.x) / zoom
    const clickY = (e.clientY - rect.top - centerY - offset.y) / zoom

    // Find clicked node
    const clickedNode = nodes.find((node) => {
      const dx = clickX - node.x
      const dy = clickY - node.y
      return Math.sqrt(dx * dx + dy * dy) <= node.radius
    })

    if (clickedNode) {
      setSelectedNode(clickedNode.id)
      if (clickedNode.type === "class") {
        selectClass(clickedNode.id)
      }
    } else {
      setSelectedNode(null)
    }
  }

  const resetView = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const exportGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "ontology-graph.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" onClick={() => setZoom((z) => Math.min(3, z * 1.2))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={() => setZoom((z) => Math.max(0.1, z * 0.8))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={resetView}>
          <Maximize className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={exportGraph}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg px-4 py-3 text-xs space-y-2">
        <div className="font-semibold text-foreground mb-2">Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "rgb(147, 112, 219)" }} />
          <span>Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "rgb(99, 179, 237)" }} />
          <span>Object Property</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "rgb(129, 199, 132)" }} />
          <span>Data Property</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "rgb(244, 143, 177)" }} />
          <span>Individual</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-0.5 bg-primary/50" />
            <span>Subclass</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-400/30" style={{ borderTop: "1.5px dashed" }} />
            <span>Property relation</span>
          </div>
        </div>
        <div className="text-muted-foreground mt-2 pt-2 border-t border-border">Zoom: {(zoom * 100).toFixed(0)}%</div>
        {selectedNode && (
          <div className="text-primary font-semibold pt-2 border-t border-border">Selected: {selectedNode}</div>
        )}
      </div>
    </div>
  )
}
