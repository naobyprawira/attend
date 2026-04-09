# Implement PRD Sprint Task

Implement a ClickUp sprint subtask from the Attend.ai PRD. The user provides a task ID or name (e.g., "S3.1" or "86ex4b1de").

## Step 1: Identify the task

Use `mcp__clickup__clickup_search` or `mcp__clickup__clickup_get_task` to fetch the full task details including description and subtasks. Determine:
- Which **sprint** this belongs to (S1-S16)
- Which **phase** (1-4)
- Task type: `[BE]` backend, `[FE]` frontend, `[ML]` model/data, `[QA]` testing

## Step 2: Context gathering

1. Read `non_app_archive/CLICKUP_PRD_TRACKER.md` to see current progress
2. Read `non_app_archive/docs/PRD.md` for the relevant sprint section to understand full acceptance criteria
3. Identify **related tasks** in the same sprint that are already complete or in-progress
4. Identify **dependent tasks** from prior sprints that this task builds on
5. Read the existing codebase files that will be modified — understand current patterns before changing anything

## Step 3: Plan and confirm

Use `EnterPlanMode` to design the implementation. Present the plan to the user with:
- What files will be created/modified
- How this fits with existing code patterns
- Any dependencies or blockers from other tasks

## Step 4: Implement

Follow these skill guidelines based on task type:

**For `[BE]` tasks:**
- Follow `python-best-practices` and `fastapi-templates` patterns
- Use existing project patterns: async SQLAlchemy, Pydantic schemas, structured error responses
- Place routers in `server/routers/`, models in `server/models/`, CRUD in `server/db/crud/`, schemas in `server/schemas/`
- Use `server/core/deps.py` for auth dependencies
- Add Alembic migrations for schema changes

**For `[FE]` tasks:**
- Follow `vercel-react-best-practices` patterns
- Use existing project patterns: TanStack Query hooks in `lib/queries.ts`, API functions in `lib/api.ts`, types in `lib/types.ts`
- Use Tailwind CSS with the existing Material Design 3 token system
- Use Material Symbols Outlined for icons
- Pages go in `web/src/app/(app)/`, components in `web/src/components/`
- Ensure responsive design (sm/md/lg breakpoints)

**For `[ML]` tasks:**
- Work in the `attend-mlops` repository
- Use existing patterns: ZenML steps, MLflow tracking, InsightFace/DeepFace

## Step 5: Update tracking and close out

After implementation is complete:

1. **Update the tracker**: Edit `non_app_archive/CLICKUP_PRD_TRACKER.md` to mark the task as **COMPLETE** with verification notes

2. **Confirm with user**: Use `AskUserQuestion` to present:
   - List of files created/modified
   - The ClickUp task(s) to be closed
   - Any related tasks whose status changed (e.g., sprint parent now partially done)
   - Ask: "Should I commit these changes and close the ClickUp task(s)?"

3. **Git commit**: Stage relevant files and commit with message format:
   ```
   feat(sprint-N): <short description>
   ```

4. **ClickUp closeout**: Use `mcp__clickup__clickup_update_task` to set the task status to `complete`

$ARGUMENTS
