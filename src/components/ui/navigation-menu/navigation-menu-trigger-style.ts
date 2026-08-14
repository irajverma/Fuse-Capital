import { cva } from "class-variance-authority"

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger relative hover:bg-muted focus:bg-muted focus-visible:ring-ring/50 data-[active=true]:bg-muted/50 inline-flex h-16 w-max items-center justify-center px-4 py-0 text-md font-medium outline-none focus-visible:ring-3 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity data-[active=true]:after:opacity-100"
)

export default navigationMenuTriggerStyle
