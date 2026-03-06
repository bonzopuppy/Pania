# Pania Project Guidelines

## Sprint Document Maintenance

**File:** `SPRINT.md` (project root)

This project uses a sprint document to track tasks. A dashboard aggregates these across all projects, so consistent formatting matters.

### Format
- Section headers must contain "In Progress", "Backlog", or "Completed" (case-insensitive)
- Tasks must use `- [ ]` / `- [x]` checkbox format only
- **Every sprint must have a `###` sub-heading** with a number and theme: `### Sprint N: Theme`
- Add completion dates when marking done: `- [x] Task (YYYY-MM-DD)`

### When to Update
- **Proactively ask the user** "Should I update the sprint doc?" when a task is completed, new work emerges, or priorities shift
- Move completed tasks to Completed with `[x]` and date, keeping the sprint sub-heading
- Never delete tasks without asking — move to Completed or Parked

### Additional References
- Detailed sprint roadmap: `docs/specs/future-sprints.md`
- Security and privacy decisions: `docs/specs/security.md`

## Design Implementation Rules

1. **Never make assumptions based on "common design patterns"** - Always confirm with the user before making any design decisions that aren't explicitly specified in the Figma designs.

2. **When Figma designs are too large or inaccessible** - Ask the user to provide a smaller portion of the Figma design or clarify the specific styling details needed.

3. **Always follow the Figma designs exactly** - Do not improvise or make "improvements" without explicit approval.
