'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const itemVariants = cva(
  'flex items-center gap-3 rounded-lg transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-muted/50 hover:bg-muted',
        outline: 'border border-border bg-transparent hover:bg-muted/50',
        muted: 'bg-muted/30 text-muted-foreground hover:bg-muted/50',
        ghost: 'hover:bg-muted/50',
      },
      size: {
        default: 'p-3',
        sm: 'p-2',
        xs: 'p-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const itemMediaVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      default: '',
      icon: 'size-8 rounded-md bg-primary/10 text-primary [&>svg]:size-4',
      image: 'size-10 overflow-hidden rounded-md',
      indicator: 'size-3 rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
  asChild?: boolean
  selected?: boolean
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, size, asChild = false, selected, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'
    return (
      <Comp
        ref={ref}
        className={cn(
          itemVariants({ variant, size }),
          selected && 'bg-primary text-primary-foreground hover:bg-primary/90',
          className
        )}
        data-selected={selected}
        {...props}
      />
    )
  }
)
Item.displayName = 'Item'

const ItemGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1', className)}
    role="group"
    {...props}
  />
))
ItemGroup.displayName = 'ItemGroup'

const ItemSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-border my-1 h-px', className)}
    role="separator"
    {...props}
  />
))
ItemSeparator.displayName = 'ItemSeparator'

export interface ItemMediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemMediaVariants> {}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  )
)
ItemMedia.displayName = 'ItemMedia'

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
    {...props}
  />
))
ItemContent.displayName = 'ItemContent'

const ItemTitle = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('truncate text-sm font-medium leading-none', className)}
    {...props}
  />
))
ItemTitle.displayName = 'ItemTitle'

const ItemDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('text-muted-foreground truncate text-xs', className)}
    {...props}
  />
))
ItemDescription.displayName = 'ItemDescription'

const ItemActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('ml-auto flex shrink-0 items-center gap-1', className)}
    {...props}
  />
))
ItemActions.displayName = 'ItemActions'

const ItemHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-muted-foreground mb-1 text-xs font-medium', className)}
    {...props}
  />
))
ItemHeader.displayName = 'ItemHeader'

const ItemFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-muted-foreground mt-1 text-xs', className)}
    {...props}
  />
))
ItemFooter.displayName = 'ItemFooter'

export {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
  itemVariants,
  itemMediaVariants,
}

