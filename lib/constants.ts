// constants.ts

/* =========================
   Math / Geometry
========================= */
const TWO_PI_MULTIPLIER = 2
export const FULL_CIRCLE_RADIANS = TWO_PI_MULTIPLIER * Math.PI
export const HALF_CIRCLE_RADIANS = Math.PI
export const CENTER_DIVIDER = 2
export const TRIANGLE_SIDES = 3
export const QUADRILATERAL_SIDES = 4
export const PENTAGON_SIDES = 5
export const GRID_COLUMNS = 2

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
export const ARROW_ANGLE_DIVISOR = 6
export const EDGE_ARROW_ANGLE = Math.PI / ARROW_ANGLE_DIVISOR
export const EDGE_DASH_SIZE = 5
export const ARROW_OFFSET_PX = 5

/* =========================
   Selection / Highlighting
========================= */
export const SELECTION_STROKE_WIDTH = 3
export const DEFAULT_NODE_STROKE_WIDTH = 2

/* =========================
   Text / Labels
========================= */
export const TEXT_SHADOW_BLUR = 4
export const FONT_SIZE_REGULAR = 12
export const FONT_SIZE_SMALL = 9
export const FONT_SIZE_BOLD = 13
export const TYPE_INDICATOR_OFFSET = 12
export const TOOLTIP_OFFSET = 12

/* =========================
   Interaction / Timing
========================= */
export const HOVER_DELAY_MS = 300
export const ZOOM_PERCENTAGE_MULTIPLIER = 100
export const DIALOG_POSITION_OFFSET = 200

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

/* =========================
   Search Scoring Weights
========================= */
export const SEARCH_WEIGHT_EXACT_LABEL_MATCH = 10
export const SEARCH_WEIGHT_LABEL_START = 8
export const SEARCH_WEIGHT_LABEL_CONTAINS = 6
export const SEARCH_WEIGHT_IRI_MATCH = 5
export const SEARCH_WEIGHT_COMMENT_MATCH = 3
export const SEARCH_WEIGHT_PROPERTY_MATCH = 2
export const SEARCH_WEIGHT_DEFAULT_PENALTY = 0.7

/* =========================
   UI Spacing / Indentation
========================= */
export const TREE_INDENT_PX = 16
export const TREE_ICON_SPACING_PX = 8
export const SEARCH_RESULT_LIMIT = 20
export const GRID_COLUMN_SPAN_HALF = 2
export const NODE_HOVER_TIMEOUT_MS = 120

/* =========================
   Time Constants (milliseconds)
========================= */
export const COPY_FEEDBACK_DURATION_MS = 2000
export const STATS_REFRESH_INTERVAL_MS = 10000
export const REASONER_EXECUTION_DELAY_MS = 4000

/* =========================
   Time Conversion Constants
========================= */
export const MILLISECONDS_PER_SECOND = 1000
export const SECONDS_PER_MINUTE = 60
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24
export const MILLISECONDS_PER_DAY =
  MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY

/* =========================
   Sample Data Ages (years)
========================= */
export const SAMPLE_AGE_ALICE = 30
export const SAMPLE_AGE_BOB = 28
export const SAMPLE_YEAR_FOUNDED = 1995
export const SAMPLE_AGE_CHARLIE = 35

/* =========================
   Array Index Constants
========================= */
export const ARRAY_INDEX_NOT_FOUND = -1
export const ARRAY_FIRST_ELEMENT = 0
export const SPARQL_LIMIT_OFFSET = 3
export const SPARQL_OFFSET_OFFSET = 2

/* =========================
   Property Chain Constants
========================= */
export const MIN_PROPERTY_CHAIN_LENGTH = 2
