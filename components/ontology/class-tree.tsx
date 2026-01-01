"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOntology } from "@/lib/ontology/context";
import { cn } from "@/lib/utils";
import type { OntologyClass } from "@/lib/ontology/types";
import { useState } from "react"
import debug from "debug"
import { ChevronRight, ChevronDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOntology } from "@/lib/ontology/context"
import { cn } from "@/lib/utils"
import type { OntologyClass } from "@/lib/ontology/types"

const log = debug("app:class-tree")


type ClassTreeNodeProps = {
  classId: string;
  owlClass: OntologyClass;
  level: number;
};

function ClassTreeNode({ classId, owlClass, level }: ClassTreeNodeProps) {
  const { ontology, selectedClass, selectClass } = useOntology();
  const [isExpanded, setIsExpanded] = useState(true);

  // Find subclasses
  const subclasses = Array.from(ontology?.classes.values() || []).filter((c) =>
    c.superClasses.includes(classId)
  );

  console.log(
    `ClassTreeNode: Rendering ${
      owlClass.label || owlClass.name
    } at level ${level}`,
    {
      classId,
      hasChildren: subclasses.length > 0,
      isExpanded,
    }
  );
  const subclasses = Array.from(ontology?.classes.values() || []).filter((c) => c.superClasses.includes(classId))
 log("Rendering class node", {
    classId,
    label: owlClass.label || owlClass.name,
    level,
    hasChildren: subclasses.length > 0,
    isExpanded,
  })

  const hasChildren = subclasses.length > 0;
  const isSelected = selectedClass?.id === classId;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 rounded hover:bg-accent cursor-pointer text-sm",
          isSelected && "bg-primary/20 text-primary"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          console.log("ClassTreeNode: Class selected", {
            classId,
            className: owlClass.label || owlClass.name,
          });
          selectClass(classId);
          log("Class selected", {
            classId,
            className: owlClass.label || owlClass.name,
          })
          selectClass(classId)
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("ClassTreeNode: Toggle expand/collapse", {
              e.stopPropagation()
                log("Toggle expand/collapse", {
                className: owlClass.label || owlClass.name,
                wasExpanded: isExpanded,
                willBeExpanded: !isExpanded,
              });
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-center h-4 w-4"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="flex-1 font-mono text-xs">
          {owlClass.label || owlClass.name}
        </span>
        <div className="hidden group-hover:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {subclasses.map((subclass) => (
            <ClassTreeNode
              key={subclass.id}
              classId={subclass.id}
              owlClass={subclass}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ClassTree() {
  const { ontology } = useOntology();

  // Find root classes (those with no superclasses or only owl:Thing)
  const rootClasses = Array.from(ontology?.classes.values() || []).filter(
    (c) =>
      c.superClasses.length === 0 ||
      (c.superClasses.length === 1 && c.superClasses[0] === "owl:Thing")
  );

  console.log("ClassTree: Rendering with root classes", {
      log("Rendering with class treecd", {
    totalClasses: ontology?.classes.size || 0,
    rootClassCount: rootClasses.length,
    rootClasses: rootClasses.map((c) => c.label || c.name),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-sm font-semibold">Classes</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {rootClasses.map((rootClass) => (
          <ClassTreeNode
            key={rootClass.id}
            classId={rootClass.id}
            owlClass={rootClass}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}
