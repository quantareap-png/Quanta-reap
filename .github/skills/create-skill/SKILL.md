---
name: create-skill
description: 'Create a reusable VS Code skill for a workflow, review process, debugging routine, or team playbook. Use when you need to turn a repeatable method into a discoverable SKILL.md with clear triggers, procedures, and completion checks.'
---

# Create a Reusable Skill

## When to Use
- You have a repeatable multi-step process that should be reusable.
- You want a workflow packaged as a discoverable skill for future runs.
- You need to capture debugging, review, planning, implementation, or validation patterns.
- You want to standardize a team method without turning it into a permanent instruction for every task.

## Goal
Turn a real workflow into a focused, reusable, on-demand skill that other agents or users can invoke when the task matches the trigger conditions.

## Scope Decision
1. Choose the correct location:
   - Workspace/shared: `.github/skills/<skill-name>/`
   - Personal: `~/.copilot/skills/<skill-name>/` or equivalent personal skills folder
2. Determine whether the workflow is truly task-specific enough to deserve a skill.
3. Use a skill when the workflow is multi-step and specialized; prefer instructions for broad always-on guidance.

## Selection Rules
- Most work, always-on behavior -> use instructions, not a skill
- One focused task with inputs -> use a prompt
- Multi-step workflow with reusable procedure -> use a skill
- Need context isolation or custom tool restrictions -> use a custom agent

## Create the Skill
1. Define the skill's purpose in one sentence.
2. Choose a lowercase hyphenated name that matches the folder name.
3. Write a keyword-rich description that includes trigger phrases such as "Use when...".
4. Add the YAML frontmatter required by the skill format.
5. Write the body with these sections:
   - When to Use
   - Goal or outcome
   - Procedure
   - Decision points
   - Quality checks
6. Keep the file concise and self-contained; use separate reference files only for larger assets.

## Procedure to Extract the Workflow
1. Review the underlying process or conversation.
2. Identify the step-by-step flow being followed.
3. Capture the decision points and branching logic.
4. Note the quality gates or completion checks used to know the work is done.
5. Rephrase the workflow as clear instructions that can be followed again without extra context.

## Quality Criteria
A strong skill should have all of the following:
- Clear name and matching folder name
- Search-friendly description with real trigger words
- Concrete steps in order
- Explicit decision points and branching
- Completion checks before considering the task finished
- No vague boilerplate or filler language

## Validation Checklist
Before saving, confirm:
- The folder path is correct for the intended scope
- The skill name matches the folder name exactly
- YAML frontmatter is valid
- Description is present and meaningful
- The workflow is reusable and actionable
- The skill helps future users discover it by keyword

## Template
```markdown
---
name: skill-name
description: 'Describe the workflow and the trigger conditions. Use when: ...'
---

# Skill Title

## When to Use
- Trigger condition 1
- Trigger condition 2

## Goal
Describe the outcome.

## Procedure
1. Step one
2. Step two
3. Step three

## Decision Points
- If X, do Y
- If Z, do A

## Completion Checks
- Validate result 1
- Validate result 2
```

## Example Prompt to Trigger the Skill
- "Create a reusable skill for debugging frontend issues in a React app."
- "Turn our code review checklist into a skill for future use."
- "Package our deployment verification flow into a skill."

## Related Customizations to Create Next
- A project instruction for the team's coding standards
- A prompt for a recurring deployment checklist
- A custom agent for context-isolated debugging or review work
- A hook for enforcing formatting or pre-commit checks
