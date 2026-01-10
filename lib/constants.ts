// constants.ts

/* =========================
   Physics / Simulation
========================= */
export const REPULSION_STRENGTH = 3000
export const ATTRACTION_STRENGTH = 0.01
export const DAMPING = 0.8
export const MAX_SIMULATION_ITERATIONS = 300

/* =========================
   Initial Layout
========================= */
export const CLASS_LAYOUT_RADIUS = 250
export const PROPERTY_LAYOUT_RADIUS = 150
export const INDIVIDUAL_LAYOUT_RADIUS = 100
export const INDIVIDUAL_X_OFFSET = 300

/* =========================
   Node Sizes
========================= */
export const CLASS_NODE_RADIUS = 35
export const PROPERTY_NODE_RADIUS = 28
export const INDIVIDUAL_NODE_RADIUS = 25
export const SELECTION_RADIUS_PADDING = 6

/* =========================
   Canvas / Zoom
========================= */
export const DEFAULT_ZOOM = 1
export const MIN_ZOOM = 0.05
export const MAX_ZOOM = 5
export const ZOOM_IN_FACTOR = 1.2
export const ZOOM_OUT_FACTOR = 0.8
export const WHEEL_ZOOM_IN_FACTOR = 1.1
export const WHEEL_ZOOM_OUT_FACTOR = 0.9

/* =========================
   Edge Rendering
========================= */
export const SUBCLASS_EDGE_WIDTH = 2.5
export const DEFAULT_EDGE_WIDTH = 1.5
export const EDGE_ARROW_LENGTH = 12
export const EDGE_ARROW_ANGLE = Math.PI / 6
export const EDGE_DASH_SIZE = 5

/* =========================
   View / Fit
========================= */
export const FIT_VIEW_PADDING = 100
export const MAX_FIT_ZOOM = 2

/* =========================
   Toast Limit and Delay
========================= */
export const TOAST_LIMIT = 1
export const TOAST_REMOVE_DELAY = 1000000

export const REASONER_DIALOG_TIME_DELAY_MS = 500
