---
mode: agent
description: Turn a repeatable workflow into a reusable .prompt.md file.
---

# Create a reusable prompt

Turn a recurring task pattern into a reusable custom prompt file for this workspace.

## Goal

Generalize the repeated task into a prompt that can be reused for future work without re-explaining the workflow each time.

## Extract the pattern

From the conversation, identify:

- the core task being repeated
- the inputs the task depends on, such as selected code, a file type, a feature area, or an environment
- the desired output format, tone, or structure
- whether the task is best used with arguments or fixed context

## Clarify only when needed

If the pattern is not clear, ask targeted questions about:

- what the prompt should help accomplish
- whether it should accept arguments or use fixed context
- whether it is workspace-scoped or personal
- any constraints such as language, framework, test expectations, or output style

## Create the prompt

Draft a .prompt.md file in .github/prompts/ and follow these principles:

1. Keep the purpose narrow and specific.
2. Make inputs explicit and easy to supply.
3. Define the expected output structure and quality bar.
4. Include relevant context and tools when needed.
5. Prefer concise instructions over vague guidance.
6. Make the prompt reusable across similar tasks, not tied to one-off details.

## Recommended structure

Use YAML frontmatter and concise instructions:

```md
---
mode: agent
description: Short description of the reusable task.
---

# Task name

Describe the goal and when to use this prompt.

## Inputs

- expected variables or selected code
- relevant file types or project context
- any constraints or assumptions

## Instructions

1. Review the current context.
2. Extract the relevant requirements.
3. Perform the task.
4. Return the result in the requested format.

## Output expectations

- brief, actionable, production-ready content
- include code, tests, or documentation when relevant
- keep the response scoped to the actual task
```

## Finalize

After drafting the prompt:

- identify any ambiguous or weak parts
- ask the user about those unresolved details
- refine the prompt until it is reusable and clear
- summarize what the prompt does
- provide example invocations
- suggest related prompt customizations that could be created next

## Example invocation

- "Create a prompt for reviewing TypeScript code before merge."
- "Turn our codebase refactoring workflow into a reusable prompt."
- "Make a prompt that generates focused unit tests for new functions."
